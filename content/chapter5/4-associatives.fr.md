---
title: "Conteneurs associatifs"
weight: 4
---

Un conteneur associatif est un conteneur dans lequel les éléments peuvent être indexés par des objets, et non plus seulement par des entiers.\
Vous allez donc ici voir les différents types de conteneurs associatifs proposés par la STL.

---

Pour cet exercice, vous modifierez les fichiers :\
\- `chap-05/3-associatives/main.cpp`\
\- `chap-05/3-associatives/keys.h`

La cible à compiler est `c5-3-associatives`.

---

### Les sets (ensembles)

Un set est un conteneur dans lequel les éléments sont "indexés par eux-mêmes". Il y a deux cas d'utilisation classiques d'un `set`:
- disposer d'un conteneur qui ne peut contenir qu'une seule fois un même élément,
- savoir si un conteneur contient ou non un élément très rapidement.

Dans la librairie standard, vous pouvez trouver `std::set` et `std::unordered_set` qui permettent de manipuler des sets. En analysant leur documentation, pouvez-vous identifier les différences principales entre ces deux classes ?

{{% expand "Solution" %}}
Complexité :
- `std::set` est implémenté (généralement) comme un arbre binaire de recherche. Les opérations d'insertions, de recherches et de comparaison s'effectuent donc en temps logarithmique. En ce qui concerne l'espace mémoire utilisé, les arbres binaires de recherche ont généralement besoin d'autant de mémoire qu'il y a d'éléments à stocker, c'est-à-dire O(n).
- `std::unordered_set` est implémenté en utilisant des "buckets", indexés par le hash de l'objet (comme dans une hashmap). Les opérations d'insertions, de recherches et de comparaison s'effectuent donc en temps constant amorti ("amorti", car si deux objets ont le même hash, il faut potentiellement parcourir une liste d'objects ensuite). La documentation ne donne pas de détail concernant l'espace mémoire alloué par un `unordered_set`, mais si vous vous rappelez de votre cours d'algorithmique, pour qu'une hashmap soit efficace, il faut limiter le nombre de conflits possibles. Cela implique que l'espace alloué doit être très largement supérieur à l'espace réellement occupé par les éléments.

Contraintes :
- `std::set` attend que ses éléments soient comparables (= qu'il existe une fonction permettant de dire si un élément est plus petit qu'un autre).
- `std::unordered_set` attend que ses éléments soient hashables (= qu'il existe une fonction permettant de convertir un élément en un entier, respectant le fait que si deux éléments sont considérés égaux, alors les deux entiers obtenus sont égaux également) et qu'il existe une fonction permettant de savoir si deux éléments sont égaux ou non (il n'est pas nécessaire ici d'avoir une relation d'ordre sur les éléments).
{{% /expand %}}

Dans les fichiers de l'exercice, on vous fournit deux classes `ComparableDog` et `HashableDog`. Ces deux classes sont pour le moment identique : elles contiennent deux attributs `_name` et `_species`.\
Votre objectif sera d'ajouter les fonctions nécessaires pour utiliser ces classes dans des sets.

#### `std::set`

Pour pouvoir placer des éléments dans un `set`, nous avons dit qu'ils devaient être comparables. Le plus simple pour cela, c'est de créer un `operator<` pour la classe. Les opérateurs de comparaison peuvent être définis soit en tant que fonction-membre, soit en tant que fonction libre.

Fonction-membre :
```cpp
class SomeClass
{
public:
    bool operator<(const SomeClass& other) const
    {
        return /* whether this and other are equal */;
    }
};
```

Fonction libre :
```cpp
// SomeClass.h

class SomeClass
{
    ...
};

bool operator<(const SomeClass& a, const SomeClass& b);

// SomeClass.cpp

bool operator<(const SomeClass& a, const SomeClass& b)
{
    return /* whether a and b are equal */;
}
```

{{% notice info %}}
Notez bien que si vous voulez utiliser une fonction libre, vous devrez peut-être exposer vos attributs dans des getters ou déclarer `operator<` comme une fonction amie de la classe. 
{{% /notice %}}

Commencez par définir un `set` contenant des `ComparableDog` dans la fonction `main`. Essayez de compiler. Jusque là, tout devrait bien se passer.\
Instanciez maintenant une variable de type `ComparableDog`, et ajoutez-là à votre `set`.

{{% expand "Solution" %}}
```cpp
std::set<ComparableDog> dogs;

ComparableDog medor { "medor", "labrador" };
dogs.emplace(medor);
```
{{% /expand %}}

Essayez à nouveau de compiler. Vos yeux devraient désormais commencer à saigner, ce qui est normal. Je vous rassure, avec un peu d'entraînement, cela n'arrivera plus.\
Du coup, essuyez vos larmes et enfilez vos lunettes si vous en avez, et tentez d'identifier ce que le compilateur essaye de vous communiquer.

{{% expand "Solution" %}}
Le compilateur essaye simplement de vous dire qu'il n'arrive pas à trouver de fonction permettant d'évaluer l'expression `x < y`.\
Vous allez donc devoir définir un opérateur de comparaison pour la classe `ComparableDog`.  
{{% /expand %}}

Implémentez ce qu'il manque pour que votre programme compile.

{{% expand "Solution" %}}
```cpp
class ComparableDog
{
public:
    ComparableDog(const std::string& name, const std::string& species)
        : _name { name }, _species { species }
    {}

    bool operator<(const ComparableDog& other) const
    {
        if (_name < other._name)
        {
            return true;
        }
        else if (_name > other._name)
        {
            return false;
        }
        else
        {
            return _species < other._species;
        }
    }

private:
    std::string _name;
    std::string _species;
};
```
{{% /expand %}}

Créez maintenant une nouvelle instance de `ComparableDog`, différente de la première, et ajoutez-là au set.\
Affichez le nombre d'éléments du set pour vérifier qu'il en contient maintenant 2.

{{% expand "Solution" %}}
```cpp
ComparableDog gus { "gus", "bordercollie" };
dogs.emplace(gus);

std::cout << dogs.size() << std::endl;
```
{{% /expand %}}

Instanciez maintenant une copie de votre premier chien, et ajoutez-là à votre set.\
Combien y a-t-il d'éléments dans le `set` après cette opération ? Pourquoi ?

{{% expand "Solution" %}}
```cpp
ComparableDog medor_clone = medor;
dogs.emplace(medor_clone);

std::cout << dogs.size() << std::endl;
```

Votre `set` ne devrait contenir que 2 éléments, car par définition, dans un set, les éléments sont uniques. Comme `medor` existe déjà dans l'ensemble, `medor_clone` qui lui est égal n'est pas ajouté.

Si ce n'est pas le cas chez vous et que la copie est ajoutée malgré tout, c'est probablement que l'implémentation de votre opérateur de comparaison est un peu bancale.
{{% /expand %}}

#### `std::unordered_set`

Vous allez maintenant faire le même exercice, mais avec un `std::unordered_set` plutôt qu'un `set`.

Commencez par définir un `unordered_set` contenant des `HashableDog` dans la fonction `main` et essayez de compiler. Vous devriez vous retrouver avec un paquet d'erreurs.\
Comme tout à l'heure, essayez d'identifier la cause de leur déclenchement.

{{% expand "Solution" %}}
```cpp
std::unordered_set<HashableDog> dogs;
```

Ici, la première erreur n'aide pas du tout : "use of deleted function 'std::unordered_set<$£^p%*ù$>'".\
Il faut donc scroller plus bas, jusqu'à tomber sur celle-ci : "use of deleted function 'std::hash<HashableDog>::hash()'.

Rappelez-vous, pour utiliser un `unordered_set`, une des contraintes est que le type des éléments doit être hashable. Et d'après l'erreur, ce n'est pas le cas de `HashableDog`. 
{{% /expand %}}

Afin de rendre une classe hashable, il faut spécialiser une fonction de la librairie standard que l'on appelle `hash`. Pour ce faire, vous devez d'abord inclure le header `<functional>`, puis écrire le code suivant :
```cpp
namespace std {

template <>
struct hash<ClassToMakeHashable>
{
    size_t operator()(const ClassToMakeHashable& c) const
    {
        return /* some value that can be computed from c */;
    } 
};

}
```

Ne vous posez pas trop de questions pour le moment sur la syntaxe du code ci-dessus. Vous pouvez directement le copier-coller à la fin du fichier `keys.h`, en remplaçant `ClassToMakeHashable` par le nom de votre classe.
En ce qui concerne le contenu de la fonction, vous allez devoir générer un hash en combinant les hashs des attributs de la classe `HashableDog`. 

Pour récupérer le hash d'une `string`, vous devez déclarer une variable de type `std::hash<std::string>`, puis appeler son `operator()` sur la `string` en question. Ca donne quelque chose comme ça :
```cpp
std::hash<std::string> hash_fcn;
size_t                 hash_of_blablabla = hash_fcn("blablabla");
```

Vous pouvez ensuite combiner plusieurs valeurs de hash ensemble en utilisant des opérateurs binaires (`^`, `+`, `*`, ou n'importe quoi d'autres, ce n'est pas vraiment important du moment que vous renvoyer bien quelque chose à la fin) :
```cpp
std::hash<std::string> hash_fcn;
size_t                 hash_final = hash_fcn("first") ^ hash_fcn("second") ^ hash_fcn("third");
```

{{% notice note %}}
Lorsqu'on défini un `operator()` dans une classe, il est ensuite possible d'utiliser les instances de cette classe comme des fonctions. C'est pour cela que ce genre d'objets est appelé **foncteur**.
{{% /notice %}}

Implémentez le contenu de `hash<HashableDog>::operator()`.\
Afin de pouvoir accéder aux attributs de `HashableDog` depuis cette fonction, vous pouvez les déplacer dans la partie publique.

{{% expand "Solution" %}}
```cpp
size_t operator()(const HashableDog& dog) const
{
    std::hash<std::string> hash_fcn;
    return hash_fcn(dog._name) ^ hash_fcn(dog._species);
} 
```
{{% /expand %}}


Une fois que cela compile, refactorisez votre code pour remettre les attributs dans la partie privée.\
Pour cela, définissez une fonction-membre publique `get_hash` dans la classe `HashableDog`, que vous appelerez depuis `hash<HashableDog>::operator()`.

{{% expand "Solution" %}}
N'oubliez pas le `const` dans la signature de `get_hash`. En effet, vous ne pourrez pas appeler `get_hash` sur un `const HashableDog&` si vous oubliez de le mettre.

```cpp
class HashableDog
{
public:
    ...

    size_t get_hash() const
    {
        std::hash<std::string> hash_fcn;
        return hash_fcn(_name) ^ hash_fcn(_species);
    }

private:
    ...
};

namespace std {

template <>
struct hash<HashableDog>
{
    size_t operator()(const HashableDog& dog) const
    {
        return dog.get_hash();
    }
};

}
```
{{% /expand %}}

Instanciez maintenant une variable de type `HashableDog`, ajoutez-là à votre set et essayez de compiler.\
Comme vous pouvez le voir, aujourd'hui, le compilateur de vous apprécie pas. Déterminez à partir des erreurs de compilation ce qu'il manque dans la classe `HashableDog` pour que le programme compile.

{{% expand "Solution" %}}
```cpp
std::unordered_set<HashableDog> dogs;

HashableDog medor { "medor", "labrador" };
dogs.emplace(medor);
```

D'après l'erreur, il faut implémentez un `operator==` dans la classe.
{{% /expand %}}

Ajoutez la fonction manquante (même signature que `operator<`) et vérifiez ensuite que tout fonctionne.

{{% expand "Solution" %}}
```cpp
class HashableDog
{
public:
    ...

    bool operator==(const HashableDog& other) const
    {
        return _name == other._name && _species == other._species;
    }
    
    ...
};
```
{{% /expand %}}

Vous pouvez ensuite essayer d'ajouter de nouveaux éléments dans votre `unordered_set`. Vous devriez avoir le même comportement qu'avec la classe `set` : les éléments sont ajoutés seulement s'ils n'apparaissent pas déjà dans le conteneur.

---

### Les maps (dictionnaires)

Une map est un conteneur dans lequel chaque valeur est indexé par une clef. Dans la STL, vous pouvez trouver les classes `std::map` et `std::unordered_map`.

Les différences entre `map` et `unordered_map` sont exactement les mêmes que les différences entre `set` et `unordered_set`. D'ailleurs, `std::[unordered_]map`, c'est la même chose que `std::[unordered_]set`, si ce n'est que pour chaque élément du conteneur, on stocke une valeur en plus de la clef.\
En particulier, vous retrouvez les mêmes contraintes sur le type des clefs :
- opérateur de comparaison pour la clef d'une `map`,
- fonction de hash et opérateur d'égalité pour la clef d'une `unordered_map`.

Vous allez maintenant définir une variable de type `std::map<key, value>` qui stocke pour chaque chien (= clef) le nom et prénom de son propriétaire (= valeur).\
Quel type pouvez-vous utiliser pour la clef ? Pour la valeur, vous pouvez utiliser une `std::pair<std::string, std::string>` (n'hésitez pas à créer un alias).

{{% expand "Solution" %}}
Pour la clef, on peut réutiliser la classe `ComparableDog`, qui dispose déjà d'un opérateur de comparaison.
```cpp
using Owner = std::pair<std::string, std::string>;
std::map<ComparableDog, Owner> owners_by_dog;
```
{{% /expand %}}

Pour insérer des éléments dans une `map`, vous pouvez utiliser plein de fonctions différentes. Consultez la documentation pour trouver le nom de ces fonctions et identifiez leurs différences (comportement / syntaxe).

{{% expand "Solution" %}}
Comportement :
- `insert` / `emplace` / `try_emplace` : insère l'élément dans la map seulement si la clef n'est pas déjà présente,
- `insert_or_assign` : insère l'élément dans la map et remplace l'élément existant si la clef était déjà présente,

Syntaxe :
- `insert` : la fonction attend une `pair` : `dict.insert(std::make_pair(key, value));` / `dict.insert({ key, value });`
- `insert_or_assign` : on peut passer la clef et la valeur directement : `dict.insert_or_assign(key, value);`
- `emplace` : on peut aussi passer la clef et la valeur directement : `dict.emplace(key, value);`
- `try_emplace` : on peut passer la clef en premier, puis les paramètres de construction de la valeur à la suite : `dict.try_emplace(key, p1, p2, p3);`
{{% /expand %}}

Essayez d'ajouter plusieurs éléments à votre map, en utilisant chacune de ces fonctions.\
{{% expand "Solution" %}}
Pour la clef, on peut réutiliser la classe `ComparableDog`, qui dispose déjà d'un opérateur de comparaison.
```cpp
std::map<ComparableDog, Owner> owners_by_dog;

ComparableDog medor { "medor", "labrador" };
ComparableDog gus { "gus", "bordercollie" };
ComparableDog zim { "zim", "poodle" };
ComparableDog flippy { "flippy", "spaniel" };

owners_by_dog.insert(std::make_pair(medor, Owner { "Claire", "David" }));
owners_by_dog.insert_or_assign(gus, Owner { "Marc", "Zipstein" });
owners_by_dog.emplace(zim, Owner { "Céline", "Noël" });
owners_by_dog.try_emplace(flippy, "Vincent", "Nozick");

owners_by_dog.emplace(gus, Owner { "Claire", "David" });
// -> gus is still owned by Marc (emplace does not modify values with existing keys, neither does insert or try_emplace)

owners_by_dog.insert_or_assign(gus, Owner { "Vincent", "Nozick" });
// -> gus is now owned by Vincent (insert_or_assign reassign values with existing keys)
```
{{% /expand %}}

Que faut-il maintenant faire si vous souhaitez utiliser une `unordered_map` plutôt qu'une `map` ?

{{% expand "Solution" %}}
Il suffit d'utiliser des clefs de type `HashableDog` plutôt que `ComparableDog`.
{{% /expand %}}
