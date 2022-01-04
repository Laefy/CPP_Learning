---
title: "Pointeurs intelligents"
weight: 3
---

Maintenant que vous savez ce à quoi correspond l'ownership, nous allons vous présentez les smart pointers.

---

### Ownership simple

Pour cet exercice, vous modifierez les fichiers :\
\- `chap-03/2-pokemons/Journey.cpp`\
\- `chap-03/2-pokemons/PC.h`\
\- `chap-03/2-pokemons/PokeCenter.h`\
\- `chap-03/2-pokemons/Pokedex.h`\
\- `chap-03/2-pokemons/Pokemon.h`\
\- `chap-03/2-pokemons/ProfessorOak.h`\
\- `chap-03/2-pokemons/Trainer.h`

La cible à compiler est `c3-2-pokemons`.

---

En général, on peut s'arranger pour qu'à tout instant de l'exécution d'un programme, chacune des ressources ait un unique propriétaire.
C'était par exemple le cas dans l'exercice précédent : un Pokémon pouvait changer de propriétaire, certes, mais il ne pouvait pas avoir deux propriétaires au même moment. 

Pour représenter explicitement ce type d'ownership, vous avez deux possibilités :
- utiliser un attribut de type `T` (sans référence, ni pointeur) : `T _my_object;`
- utiliser un attribut de type `std::unique_ptr<T>` : `std::unique_ptr<T> _my_object_ptr;`

Un `unique_ptr`, c'est comme un raw pointer (= pointeur nu), mis-à-part le fait que l'on ne peut pas le copier, et que l'objet alloué dedans est automatiquement détruit lorsque le `unique_ptr` est lui-même détruit.

Voici un petit exemple :

```cpp
// Les smart-pointeurs se trouvent dans <memory>
#include <memory>

// std::move se trouve dans <utility>
#include <utility>

int main()
{
    // On peut initialiser un unique_ptr en utilisant std::make_unique<Type>(p1, p2, ...).
    std::unique_ptr<Animal> animal = std::make_unique<Cow>();

    // On peut utiliser * pour récupérer une référence sur l'objet.
    Animal& animal_ref = *animal;

    // On peut utiliser -> pour déréférencer le unique_ptr.
    animal->sing(); // "Mewwwwh"

    // On peut réassigner le pointeur. L'objet précédent est automatiquement détruit.
    animal = std::make_unique<Dog>();
    animal->sing(); // "Waf"

    // On peut également construire un unique_ptr à partir d'un raw pointer.
    std::unique_ptr<Chicken> chicken { new Chicken };
    chicken->sing(); // "Cotcotcotcotcodet"

    // unique_ptr a un constructeur par défaut, qui initialise le contenu à nullptr.
    std::unique_ptr<Animal> no_animal;

    // On peut vérifier la validité d'un unique_ptr. 
    if (!no_animal && animal)
    {
        // On ne peut pas copier un unique_ptr dans un autre. C'est pour ça qu'il s'appelle unique_ptr.
        // no_animal = animal; // ne compile pas

        // Il est par contre possible de transférer le contenu d'un unique_ptr dans un autre.
        no_animal = std::move(animal);
        
        // `no_animal` contient maintenant une poule et `animal` contient une valeur indéterminée. Il ne faut
        // surtout pas réutiliser un unique_ptr après avoir déplacé son contenu ailleurs.
    }

    // Pas de fuite de mémoire à la sortie du programme, car au moment de détruire un unique_ptr,
    // si son contenu est valide, celui-ci est également détruit.
    return 0;
}
```

{{% notice tip %}}
Vous devriez utiliser autant que possible `std::make_unique` plutôt que `new` pour initialiser des `unique_ptr`.
Si vous souhaitez comprendre pourquoi, vous pouvez aller lire [cet article](https://herbsutter.com/gotw/_102/).
{{% /notice %}}

---

##### PC

Reprenez l'exercice précédent.
Remplacez le type de `PC::_stored_pokemons` par un `std::vector<std::unique_ptr<Pokemon>>`.

Comme il n'existe pas d'`operator==` permettant de tester l'égalité entre un raw pointer et un smart pointer, vous devrez également remplacer l'appel à `find` dans `release` par un appel à `find_if` :
```cpp
// La fonction get() permet de récupérer le raw pointer contenu dans le unique_ptr.
auto it = std::find_if(_stored_pokemons.begin(), _stored_pokemons.end(), [&pokemon](const auto& p) { return p.get() == &pokemon; });
```

Le destructeur de votre classe est-il encore utile ?\
Que faut-il changer pour que les fonctions `release`, puis `remove`, compilent ?

{{% expand "Solution" %}}
Le destructeur de la classe peut être supprimé, puisqu'il ne servait qu'à appeler `delete` sur les raw pointers.
La classe `unique_ptr` s'en charge maintenant toute seule.

Pour que la fonction `release` compile, il faut remplacer le type de retour de la fonction par un `std::unique_ptr<Pokemon>`.
En effet, la fonction transfert l'ownership du `Pokemon`, c'est donc logique de passer par un `unique_ptr`.

Après avoir fait ces changements, il faut aussi modifier la fonction `remove`.
Celle-ci faisait un appel à `delete` sur le pointeur.
Ce n'est désormais plus nécessaire, puisqu'une fois de plus, `unique_ptr` gère ça pour nous !

```cpp
class PC
{
public:
    void transfer(Pokemon* pokemon) { _stored_pokemons.emplace_back(pokemon); }

    void remove(const Pokemon& pokemon)
    {
        auto to_destroy = release(pokemon);
    }

    [[nodiscard]] std::unique_ptr<Pokemon> release(const Pokemon& pokemon)
    {
        std::unique_ptr<Pokemon> result;

        auto it = std::find_if(_stored_pokemons.begin(), _stored_pokemons.end(), [&pokemon](const auto& p) { return p.get() == &pokemon; });
        if (it != _stored_pokemons.end())
        {
            std::swap(result, *it);
            _stored_pokemons.erase(it);
        }

        return result;
    }

private:
    std::vector<std::unique_ptr<Pokemon>> _stored_pokemons;
};
```

{{% notice tip %}}
Il ne faut pas retirer l'attribut `[[nodiscard]]` de la fonction `release`.
En effet, si vous le faites, alors la fonction `remove` n'apporte aucune plus-value.
En gardant `[[nodiscard]]` sur `release`, on a deux cas d'utilisation bien distincts :\
\- `remove` sert à supprimer une valeur du conteneur,\
\- `release` sert à extraire une valeur du conteneur.\
C'est donc logique de conserver l'attribut `[[nodiscard]]` sur `release`.
Si quelqu'un n'est vraiment pas intéressé par la valeur de retour, il peut utiliser `remove` à la place.
{{% /notice %}}

{{% /expand %}}

Pour indiquer que la fonction `transfer` s'attend à ce qu'on lui transmette l'ownership du Pokémon qu'elle reçoit, transformez le type du paramètre en `unique_ptr`.
Vous devriez avoir des erreurs de ce type :
```b
cannot convert argument 1 from 'Pokemon *' to 'std::unique_ptr<Pokemon,std::default_delete<Pokemon>>'
```

Selon-vous, pourquoi les raw pointers ne se convertissent pas implicitement en `unique_ptr` ?

{{% expand "Solution" %}}
Rappelez-vous, un `unique_ptr` libère automatiquement la mémoire lors de sa destruction.\
Si un raw pointer est converti en `unique_ptr` alors que ce n'est pas prévu, la destruction de ce `unique_ptr` libérera la mémoire associée à notre raw pointer, et on ne s'en rendra compte qu'au moment de la segfault.\
Du coup, il est possible de convertir un raw pointer en `unique_ptr`, mais uniquement si c'est fait de manière explicite.
```cpp
fcn_taking_unique_ptr(raw_ptr);                        // conversion implicite => erreur
fcn_taking_unique_ptr(std::unique_ptr<T> { raw_ptr }); // conversion explicite => ok
```
{{% /expand %}}

Ajoutez une surcharge à la fonction `transfer`, acceptant un raw pointer, et qui le convertit en `unique_ptr` pour appeler l'autre version de `transfer`.
Vous pourrez supprimer cette surcharge une fois que vous aurez anéanti les derniers raw pointers du programme.

{{% expand "Solution" %}}
```cpp
void transfer(Pokemon* pokemon)
{
    // On construit explicitement un unique_ptr à partir du raw pointer.
    transfer(std::unique_ptr<Pokemon> { pokemon });
}
```
{{% /expand %}}

Vous devriez maintenant avoir l'erreur suivante :
```b
error C2280: 'std::unique_ptr<Pokemon,std::default_delete<Pokemon>>::unique_ptr(const std::unique_ptr<Pokemon,std::default_delete<Pokemon>> &)': attempting to reference a deleted function
```

Que faut-il faire dans la fonction `transfer` (celle prenant un `unique_ptr`) pour indiquer au compilateur que l'on ne cherche pas à copier le pointeur, mais à le déplacer dans le `vector` ?

{{% expand "Solution" %}}
Il faut include `<utility>` et écrire `std::move(pokemon)`.

```cpp
void transfer(std::unique_ptr<Pokemon> pokemon) { _stored_pokemons.emplace_back(std::move(pokemon)); }
```
{{% /expand %}}

---

##### Trainer

Modifiez maintenant le type de `Trainer::_team` pour utiliser des `unique_ptr`.
{{% expand "Solution" %}}
```cpp
std::array<std::unique_ptr<Pokemon>, 6> _team;
```
{{% /expand %}}

Pourquoi les boucles `for (auto* t : _team)` ne compilent plus ?
Que faut-il changer pour corriger le problème ? (en gardant bien en tête le fait qu'un `unique_ptr` n'est pas copiable)
{{% expand "Solution" %}}
Seuls les pointeurs nus peuvent être référencés avec `auto*`.
Il faut donc écrire `auto&` ou `const auto&` (si on écrit juste `auto`, le compilateur va essayer de copier le `unique_ptr`, donc ça ne fonctionnera pas).
{{% /expand %}}

Pourquoi ne doit-on pas remplacer le type de retour de `get_first_pokemon` par un `unique_ptr` ?
Et pourquoi ne peut-on pas non plus le remplacer par une référence ?
Que cherche-t-on à représenter ici avec ce raw pointer ?
{{% expand "Solution" %}}
Le raw pointer sert ici à représenter un référence sans ownership optionnelle.\
Il s'agit d'une des seules situations dans lesquelles l'usage d'un raw pointer est encore légitime.
{{% /expand %}}

Modifiez la fonction `get_first_pokemon` pour qu'elle compile.
Vous pouvez utiliser la fonction-membre `get()` pour accéder au raw pointer stocké dans un `unique_ptr`.
{{% expand "Solution" %}}
```cpp
Pokemon* get_first_pokemon() const
{
    for (auto& t : _team)
    {
        if (t != nullptr)
        {
            return t.get();
        }
    }

    return nullptr;
}
```
{{% /expand %}}

Modifiez la fonction `give_pokemons` afin qu'elle retourne des `unique_ptr`.\
Pourquoi l'instruction `_teams.fill(nullptr)` ne compile plus ?
Retirez-la, et réinitialisez les pointeurs de `_teams` depuis la boucle directement.   
{{% expand "Solution" %}}
En recherchant dans la doc de `std::array<T>::fill`, on constate que la fonction attend un `const T&`.
Dans notre cas, la fonction prend donc un `const unique_ptr<Pokemon>&`.
En écrivant `_team.fill(nullptr)`, un `unique_ptr` est créé implicitement à partir de `nullptr`, et la fonction `fill` essaye de copier ce `unique_ptr` dans chacune des cases du tableau.
Or `unique_ptr` n'est pas copiable. On ne peut donc pas utiliser la fonction `fill` sur un tableau de `unique_ptr`.

{{% notice note %}}
Pourquoi un `unique_ptr` peut être crée implicitement à partir de `nullptr`, alors qu'on a dit plus haut qu'on ne peut pas convertir un raw pointer en `unique_ptr` implicitement ?\
Tout simplement parce que la valeur `nullptr` n'est pas de type raw pointer (de quel type s'agirait-il d'ailleurs ? `void*` ? `char*` ?), mais de type `nullptr_t`.\
Et `unique_ptr` est bien implicitement convertible depuis un `nullptr_t`.  
{{% /notice %}}

```cpp
[[nodiscard]] std::vector<std::unique_ptr<Pokemon>> give_pokemons()
{
    std::vector<std::unique_ptr<Pokemon>> pokemons;

    for (auto& t : _team)
    {
        if (t != nullptr)
        {
            auto& ptr = pokemons.emplace_back();
            std::swap(t, ptr);

            // Autre version un peu moins élégante, mais qui reste valide :
            // pokemons.emplace_back(std::move(t));
            // t = std::unique_ptr<Pokemon>{};
        }
    }

    return pokemons;
}
```
{{% /expand %}}

Corrigez maintenant la fonction `transfer_team_to_pc`.

{{% expand "Solution" %}}
Il faut dire au compilateur de déplacer le `unique_ptr` avec `std::move` pour qu'il n'essaye pas de le copier.
```cpp
void transfer_team_to_pc()
{
    for (auto& pokemon : give_pokemons())
    {
        _pc.transfer(std::move(pokemon));
    }
}
```
{{% /expand %}}

La fonction `remove_from_team` ne compile pas pour trois raisons :
- le `std::find`, car on ne peut pas comparer des raw pointers à des smart pointers ; il faut utiliser `get()` pour récupérer un raw pointer et le comparer à l'autre raw pointer.
- l'instruction `auto to_destroy = *it`
- l'instruction `delete to_destroy`.

Fixez ces trois erreurs.

{{% expand "Solution" %}}
La variable `to_destroy` servait uniquement à assurer que `*it` ne pointe jamais sur de la mémoire libérée.
Avec le smart pointer, on n'a plus besoin de cette variable du tout.
```cpp
bool remove_from_team(const Pokemon& pokemon)
{
    // On utilise la même lambda que dans `PC::release`.
    auto it = std::find_if(_team.begin(), _team.end(), [&pokemon](const auto& p) { return p.get() == &pokemon; });
    if (it != _team.end())
    {
        // On peut réinitialiser un unique_ptr soit en appelant la fonction reset(), soit
        // en assignant explicitement nullptr au pointeur.
        // Dans les deux cas, le contenu précédent est automatiquement détruit.
        it->reset();
        //*it = nullptr;

        return true;
    }

    return false;
}
```
{{% /expand %}}

Modifiez la signature et le contenu de `add_to_teams` afin d'accepter un `unique_ptr`.
{{% expand "Solution" %}}
```cpp
bool add_to_team(std::unique_ptr<Pokemon> pokemon)
{
    for (auto& t : _team)
    {
        if (t == nullptr)
        {
            std::swap(t, pokemon);
            // t = std::move(pokemon); fonctionne également.
            return true;
        }
    }

    return false;
}
```
{{% /expand %}}

Faites en sorte que `collect` prenne lui aussi un unique_ptr en paramètre.\
Afin de faire compiler la fonction, vous pourriez être tenté d'écrire :
```cpp
if (!add_to_team(std::move(pokemon)))
{
    _pc.transfer(std::move(pokemon));
}
```

Pourquoi ce code n'est pas correct ?
{{% expand "Solution" %}}
Une fois qu'un objet a été déplacé, il faut partir du principe que son contenu n'est plus disponible.
Au moment de l'appel à `add_to_team(std::move(pokemon))`, le contenu de `pokemon` est déplacé dans la fonction, et il n'est donc plus là au moment de l'appel à `_pc.transfer(std::move(pokemon))`.
{{% /expand %}}

Afin de pouvoir écrire `add_to_team(pokemon)` plutôt que `add_to_team(std::move(pokemon))`, comment pourriez-vous modifier la signature de `add_to_team` ?
{{% expand "Solution" %}}
On prend le `unique_ptr` par référence plutôt que par valeur.
Lorsqu'une fonction attend un `unique_ptr&`, cela signifie que la fonction va **peut-être** récupérer l'ownership de l'objet.
```cpp
void collect(std::unique_ptr<Pokemon> pokemon)
{
    if (auto* fighter = get_first_pokemon())
    {
        fighter->level_up();
    }

    _pokedex.add(*pokemon);

    if (!add_to_team(pokemon))
    {
        _pc.transfer(std::move(pokemon));
    }
}

bool add_to_team(std::unique_ptr<Pokemon>& pokemon)
{
    for (auto& t : _team)
    {
        if (t == nullptr)
        {
            std::swap(t, pokemon);
            return true;
        }
    }

    return false;
}
```
{{% /expand %}}

Pour terminer, ajoutez une surcharge à `collect` acceptant un raw pointer, de la même manière que ce que vous avez fait pour `PC::transfer`, et corrigez les erreurs dans le `main`.
{{% expand "Solution" %}}
```cpp
// Trainer.h
void collect(Pokemon* pokemon) { collect(std::unique_ptr<Pokemon> { pokemon }); }

// Journey.cpp
int main()
{
    ...
    for (auto& pokemon : some_girl.give_pokemons())
    {
        red.collect(std::move(pokemon));
    }

    auto to_destroy = some_guy.give_pokemons();
    return 0;
}
```
{{% /expand %}}

---

##### ProfessorOak

Modifiez le type de `ProfessorOak::_starters` afin d'exprimer clairement l'ownership.\
Note: Il n'est pas possible de mettre des objets non copiables dans une `initializer_list`.
Vous devrez donc initialiser le tableau en ajoutant les valeurs une par une depuis le corps du constructeur.

{{% expand "Solution" %}}
```cpp
class ProfessorOak
{
public:
    ProfessorOak()
    {
        _starters.emplace_back(std::make_unique<Pokemon>("Bulbasaur", 2));
        _starters.emplace_back(std::make_unique<Pokemon>("Charmander", 2));
        _starters.emplace_back(std::make_unique<Pokemon>("Squirtle", 2));
    }

    [[nodiscard]] std::unique_ptr<Pokemon> get_starter()
    {
        if (_starters.empty())
        {
            return std::make_unique<Pokemon>("Pikachu", 2);
        }

        std::unique_ptr<Pokemon> pokemon;
        std::swap(pokemon, _starters.front());
        // auto pokemon = std::move(_starters.front()); est valide aussi 
        _starters.pop_front();
        return pokemon;
    }

private:
    std::deque<std::unique_ptr<Pokemon>> _starters;
};
```
{{% /expand %}}

---

##### Journey

Terminez le travail en retirant les derniers raw pointers du fichier `Journey.cpp`.
Vous devriez également pouvoir retirer les surcharges ajoutées dans `Trainer` et `PC` plus tôt.

{{% expand "Solution" %}}
```cpp
[[nodiscard]] std::unique_ptr<Pokemon> random_encounter()
{
    switch (rand() % 4)
    {
    case 0:
        return std::make_unique<Pokemon>("Magikarp", rand() % 4);
    case 1:
        return std::make_unique<Pokemon>("Caterpie", 1 + rand() % 2);
    case 2:
        return std::make_unique<Pokemon>("Psyduck", 6 + rand() % 12);
    case 3:
        return std::make_unique<Pokemon>("Jigglypuff", 4 + rand() % 7);
    default:
        return nullptr;
    }
}

int main()
{
    ...
    for (auto i = 0; i < 32; ++i)
    {
        auto encounter = random_encounter();

        if (!red.get_pokedex().has_duplicate(*encounter) && try_capture(red, *encounter))
        {
            red.collect(std::move(encounter));
        }
        else if (try_capture(blue, *encounter))
        {
            blue.collect(std::move(encounter));
        }
    }
    ...
}
```
{{% /expand %}}

---

### Ownership partagé

Pour cet exercice, vous modifierez les fichiers :\
\- `chap-03/3-cache/Cache.cpp`\
\- `chap-03/3-cache/Model.h`\
\- `chap-03/3-cache/Texture.h`

La cible à compiler est `c3-3-cache`.

---

Comme nous l'avons dit plus haut, dans la plupart des situations, il est possible d'identifier un unique propriétaire pour une ressource donnée.
Mais bien entendu, il y a des exceptions.

Prenons le cas d'un cache de textures.
Lorsqu'on charge un modèle 3D, on charge également l'ensemble des textures dont il a besoin.
Cependant, une même texture peut-être utilisée par beaucoup de modèles.
Du coup, plutôt que de charger une texture autant de fois qu'il y a de modèles qui en ont besoin, on aimerait charger une seule fois la texture, et la réutiliser pour tous ces modèles.
Et pour ne pas encombrer la RAM, dès qu'on décharge un modèle, il faut aussi décharger les textures qui ne sont plus utilisées par qui que ce soit.
La durée de vie d'une texture dépend donc de la durée de vie de chacun des modèles qui l'utilisent.
Comme les modèles ont des durées de vie complètement indépendantes, on est obligé de partager l'ownership entre eux.

La STL fournit `std::shared_ptr` pour traiter l'ownership partagé.
En plus d'allouer le bloc mémoire pour l'objet, il alloue de la place pour un compteur.
Lorsqu'on copie un `shared_ptr`, le compteur qui lui est associé est incrémenté.
Dès qu'un `shared_ptr` est détruit, le compteur est décrémenté.
Lorsqu'il tombe à 0, alors l'objet référencé par le pointeur est détruit.

Ouvrez le fichier `Model.h`.
Pour le moment, les textures sont référencées au moyen de `unique_ptr`.\
Remplacez les par des `shared_ptr`.\
Pour créer un `unique_ptr<T>`, on écrit `make_unique<T>(...)`.
Quelle fonction faut-il donc probablement utiliser pour créer un `shared_ptr<Texture>` ?

{{% expand "Solution" %}}
```cpp
class Model
{
    ...
    static void Create(Container& models)
    {
        ...
        std::vector<std::shared_ptr<Texture>> textures;
        ...
    }
    ...
    Model(std::string_view name, std::vector<std::shared_ptr<Texture>> textures)
        : _name { name }
        , _textures { std::move(textures) }
    {
        ...
    }
    ...

    std::vector<std::shared_ptr<Texture>> _textures;
};

class Texture
{
public:
    static std::shared_ptr<Texture> Load(std::string_view name)
    {
        ...
        return std::make_shared<Texture>(name, width, height);
    }
    ...
};
```
{{% /expand %}}

Ajoutez une fonction permettant de rechercher dans un `Model::Container` si une texture avec un nom donné existe déjà.
Si c'est le cas, la fonction renvoie cette texture, et sinon, elle appelle et retourne le résultat de `Texture::Load`.\
Modifiez ensuite `Model::Create` pour appelez votre nouvelle fonction. 

{{% expand "Solution" %}}
```cpp
// Dans Model:
static void Create(Container& models)
{
    ...
        textures.push_back(FindOrLoadTexture(models, texture));
    ...
}

static std::shared_ptr<Texture> FindOrLoadTexture(const Container& models, const std::string& name)
{
    for (const auto& [_, model] : models)
    {
        for (const auto& texture : model->_textures)
        {
            if (texture->get_name() == name)
            {
                return texture;
            }
        }
    }

    return Texture::Load(name);
}

// Dans Texture:
const std::string& get_name() const { return _name; }
```
{{% /expand %}}

Et voilà ! Vos textures sont maintenant partagées par différents `Model`. Dès qu'une texture n'est plus référencée, elle est automatiquement détruite.

Le seul truc un peu triste dans ce programme, c'est le fait de devoir faire une recherche linéaire parmis tous les modèles pour trouver si l'un d'entre eux possède la texture qui nous intéresse.
Pour éviter d'avoir à faire cela, vous allez créer une nouvelle classe qui permettra de référencer les `Texture` actuellement chargées.

Définissez une classe `Cache`, contenant une hash map `_textures` de `string` vers `shared_ptr<Texture>`.
Déplacez la fonction `Texture::Load` dans `Cache` et modifiez-la afin que :
- si la texture est présente dans `_textures`, on la renvoie directement,
- sinon, on la charge, on l'insère dans le cache et on la renvoie.

Ajoutez ensuite une instance de `Cache` dans la fonction `main`, et modifiez ce qu'il faut dans `Model::Create` pour pouvoir utiliser ce cache.
Vous pouvez également supprimer votre ancienne fonction de recherche.

{{% expand "Solution" %}}
```cpp
// Texture.h:
class Texture
{
public:
    class Cache
    {
    public:
        std::shared_ptr<Texture> Load(const std::string& name)
        {
            auto it = _textures.find(name);
            if (it != _textures.end())
            {
                return it->second;
            }

            ...

            std::shared_ptr<Texture> texture = std::make_shared<Texture>(name, width, height);
            _textures.emplace_hint(it, name, texture);
            return texture;
        }

    private:
        std::unordered_map<std::string, std::shared_ptr<Texture>> _textures;
    };

    static std::shared_ptr<Texture> Load(Cache& cache, const std::string& name)
    {
        return cache.Load(name);
    }

    ...
};

// Model.h:
static void Create(Container& models, Texture::Cache& cache)
{
    ...
        textures.push_back(Texture::Load(cache, texture));
    ...
}

// Cache.cpp:
int main()
{
    Model::Container models;
    Texture::Cache cache;

    ...
        else if (command == "c")
        {
            Model::Create(models, cache);
        }
    ...

    return 0;
}
```
{{% /expand %}}

Testez le programme.
Vous devriez vous rendre compte que les textures ne sont plus du tout libérées.
C'est tout à fait normal, puisque le cache acquiert l'ownership des textures.\
Afin de retrouver le comportement précédent, vous allez utiliser le dernier type de smart pointer proposé par la STL : `std::weak_ptr<T>`.\
Le `weak_ptr` est un pointeur qui sert à écouter une ressource partagée, sans en prendre l'ownership.
Il permet donc de vérifier qu'une ressource est toujours vivante, et si c'est le cas, d'y accéder.

Un `weak_ptr` s'utilise généralement de la façon suivante :
```cpp
std::shared_ptr<int> shared { new int { 3 } };

// On construit un weak_ptr à partir d'un shared_ptr.
std::weak_ptr<int> weak = shared;

// On utilise lock pour savoir si la ressource est valide.
if (auto new_shared = weak.lock())
{
    // Si la ressource existe encore, lock retourne un shared_ptr valide sur cette ressource.
    std::cout << *new_shared << std::endl; // 3

    shared.reset();
}
//-> la ressource est libérée car shared a été reset et new_shared a été détruit.

if (auto new_shared = weak.lock())
{
    // Si la ressource n'existe plus au moment de l'appel à lock, alors lock renvoie un shared_ptr null.
    // On ne passerait donc pas dans cette condition.
}
```

{{% notice tip %}}
Lorsqu'on utilise des `weak_ptr`, il est préférable d'utiliser `new` pour initialiser les `shared_ptr` plutôt que `make_shared`.\
Si vous souhaitez savoir pourquoi, vous pouvez lire [cet article](https://dev.to/dbdanilov/std-sharedptr-is-an-anti-pattern-49jo).
{{% /notice %}}

Changez le type de `Cache::_textures` de manière à pouvoir observer les textures sans en prendre l'ownership.
Modifiez la fonction `Load` en conséquence. 

{{% expand "Solution" %}}
```cpp
class Cache
{
public:
    std::shared_ptr<Texture> Load(const std::string& name)
    {
        auto it = _textures.find(name);
        if (it != _textures.end())
        {
            if (auto texture = it->second.lock())
            {
                return texture;
            }

            // Il ne faut pas oublier de supprimer l'ancien élément, car
            // les fonctions d'insertion d'unordered_map ne font rien lorsqu'une
            // valeur est déjà présente.  
            _textures.erase(it);
        }


        ...

        // On remplace make_shared par un new.
        std::shared_ptr<Texture> texture { new Texture { name, width, height } };
        _textures.emplace_hint(it, name, std::weak_ptr { texture });
        return texture;
    }

private:
    std::unordered_map<std::string, std::shared_ptr<Texture>> _textures;
};
```
{{% /expand %}}

{{% notice info %}}
Les `shared_ptr`, c'est bien, mais c'est à utiliser seulement quand on en a vraiment besoin.
D'une part, si vous utilisez des `shared_ptr` quand vous pouvez utiliser des `unique_ptr`, l'architecture de votre code risque d'en pâtir (vous pouvez créer des dépendances cycliques, et vous retrouvez avec des fuites de mémoire)
D'autre part, l'usage des `shared_ptr` est beaucoup moins efficace que celui des `unique_ptr` :\
\- l'incrémentation et la décrémentation du compteur sont réalisées avec des atomiques (afin d'être thread-safe), il s'agit donc d'opérations coûteuses.\
\- tant qu'un `weak_ptr` existe, la mémoire du bloc complet n'est pas libérée. 
{{% /notice %}}

---

### Les pointeurs nus, c'est terminé ?

Maintenant que vous connaissez les smart pointeurs et les références, vous ne devriez quasiment plus avoir besoin de raw pointers.

Voici les deux cas qui peuvent encore justifier l'utilisation d'un raw pointer :
- représenter une référence optionnelle,
- créer des conteneurs de références (alternative aux conteneurs de `reference_wrapper`, qui rendent le code parfois moins lisible).

Notez bien dans ces deux cas que le pointeur n'est pas propriétaire de son contenu.
Désormais, vous devez utiliser `unique_ptr` (et des fois `shared_ptr`) pour représenter un pointeur propriétaire de ressources.
Vous pouvez donc dire au revoir à `new` et adieu à `delete`. 

---

### RAII

RAII signifie "Resource Acquisition is Initialization".
Il s'agit d'une technique consistant à lier la durée de vie d'une ressource à la durée de vie d'un objet : la ressource est acquise au cours de l'initialisation de l'objet (dans son constructeur) et elle est libérée à sa destruction.

Lorsque l'on n'a pas besoin de référence et que l'on manipule un objet directement par valeur, c'est donc très pratique, car on a la garantie que le destructeur de l'objet va bien tout nettoyer pendant son exécution.

Exemple avec `std::vector` :
```cpp
void make_vector()
{
    // Un bloc de mémoire pouvant contenir 3 entiers est automatiquement alloué par l'instruction suivante.
    std::vector<int> v { 1, 2, 3 };

    // Ce bloc de mémoire peut éventuellement être réalloué en fonction des opérations réalisées sur v.
    v.emplace_back(4);

    // Le destructeur de la variable v est **automatiquement** appelé à la sortie du bloc, entraînant la libération
    // du bloc de mémoire sous-jacent. 
}
```

Exemple avec `std::fstream` :
```cpp
void write_content(const std::string& content)
{
    // Déclenche l'ouverture de my_document.txt en écriture.
    std::fstream file { "my_document.txt", std::fstream::out | std::fstream::app };

    // Ajoute content à la fin du buffer. Les modifications ne sont pas encore enregistrées dans le fichier. 
    file << content;

    // Le destructeur de la variable file est **automatiquement** appelé à la sortie du bloc, entraînant la
    // sauvegarde des modifications dans le fichier ainsi que sa fermeture.
}
```

Vous connaissiez déjà pas mal de classes de la STL qui utilisent la technique RAII pour gérer la durée de vie de leurs ressources : `vector`, `string`, les autres conteneurs, les smart pointers que vous venez de voir, etc.
Maintenant, si quelqu'un vous parle de RAII, vous saurez qu'il est en fait en train de vous parler d'objets (généralement placées sur la pile) qui possède des ressources qui se libèrent "toutes seules" quand l'objet est détruit.
