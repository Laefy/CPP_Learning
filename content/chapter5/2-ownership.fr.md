---
title: "Ownership"
weight: 2
---

---

Pour cet exercice, vous modifierez les fichiers :\
\- `chap-05/2-pokemons/Journey.cpp`\
\- `chap-05/2-pokemons/PC.h`\
\- `chap-05/2-pokemons/PokeCenter.h`\
\- `chap-05/2-pokemons/Pokedex.h`\
\- `chap-05/2-pokemons/Pokemon.h`\
\- `chap-05/2-pokemons/ProfessorOak.h`\
\- `chap-05/2-pokemons/Trainer.h`

La cible à compiler est `c5-2-pokemons`.

---

{{% notice note %}}
Le terme "propriété" est tout à fait valide pour parler d'"ownership", mais nous utiliserons de préférence ce dernier, car "propriété" peut aussi être utilisé pour désigner les "attributs" d'un objet.
{{% /notice %}}

---

### Un problème d'architecture

Comme vous l'avez vu dans l'exercice précédent, afin de pouvoir libérer une ressource, il faut d'abord prévenir tous les objets qui la référencent que celle-ci va être détruite.

Analysez le code de l'exercice et essayez de répondre aux questions suivantes.
1. Quelles sont les classes et les variables du `main` référençant un objet de type `Pokemon` ?
2. A quels endroits fait-on appel au destructeur de `Pokemon` ?
3. Pour chacune de ces locations, quels sont les objects du programme préalablement notifiés de cette destruction ?
4. Certains objets ont-ils été notifiés pour rien ?
5. D'autres n'ont-ils pas été notifiés alors qu'ils auraient dû l'être ?
6. Toute la mémoire a-t-elle correctement été libérée à la fin du programme ?

{{% expand "Solution" %}}
Toutes les classes référencent des `Pokemon`: `PC::_stored_pokemons`, `PokeCenter::_traumatized_pokemons`, `Pokedex::_pokemons`, `ProfessorOak::_starters`, `Trainer::_team`.\
Dans le `main`, les variables `encounter`, `traumatized`, `duplicated` et `pokemon` référencent aussi des `Pokemon`.

Le destructeur de `Pokemon` n'est appelé qu'à trois endroits : `delete encounter` et `delete pokemon` dans le `main`, ainsi que `delete pokemon` dans `PC::remove`.\
Le programme est probablement bourré de fuites de mémoire...

Avant de détruire le contenu de `encounter`, on notifie les dresseurs `red` et `blue`.
Pourtant, cela ne semble pas nécessaire, puisque cette instruction ne semble être exécutée que lorsqu'aucun dresseur n'attrape le Pokémon.

Avant de détruire `pokemon` dans la dernière boucle du `main`, on notifie `pc3`.
Etant donné que `pc3` n'a jamais été utilisé précédemment dans le `main`, le notifier n'était probablement pas nécessaire.

En ce qui concerne `PC::remove`, la fonction est appelée depuis les diverses boucles du `main`.
Dans la boucle itérant sur `traumatized`, les 2 pokédex, les 2 dresseurs principaux et les 2 premiers PCs sont notifiés.
Cela paraît à-priori cohérent, mais en y regardant de plus près, on s'aperçoit que le `pokecenter` ne connaît que les Pokémons de `red`.
Il n'est donc peut-être pas nécessaire de notifier `blue_pokedex` ou `blue`.\
Autre problème, `pc1.remove` et `pc2.remove` sont appelés sur le même objet.
On aura donc une erreur de double-free si on passe dans cette boucle.

Dans la boucle itérant sur `duplicated`, les 2 dresseurs principaux sont notifiés.
Il n'était probablement pas nécessaire de notifier `red`, puisque `duplicated` est obtenu depuis `blue_pokedex`.
En revanche, il aurait probablement fallu notifier `blue_pokedex` justement.
{{% /expand %}}

Comme vous pouvez le constater, avec du code agencé de cette manière, répondre aux questions ci-dessus n'est pas une tâche aisée.
Or, il est nécessaire de pouvoir le faire pour s'assurer que le programme n'est pas buggé.

Le premier problème de cette architecture, c'est qu'il est extrêmement difficile d'identifier qui possède des références sur une instance particulière d'un `Pokemon` à un instant donné du programme :
`pc1` ? `red._team` ? `pc1` et `red._team` ? `pc1` et `red._team` et `pokecenter` ? seulement `pokecenter` ?

Le deuxième problème, c'est que même si nous avions cette information, nous ne serions pas capables de déterminer qui est supposé libérer le bloc de mémoire alloué pour un Pokémon, ni de prévenir de sa destruction imminente les objets qui en dépendent.

Pour désigner le composant responsable de ces deux missions, on utilise le terme de **propriétaire** ou **owner**. Pour être tout à fait précis, le propriétaire d'une ressource, c'est le **composant chargé de la durée de vie de cette ressource**.
Et du coup, pour s'assurer que l'on accède toujours à des ressources valides, et que ces ressources sont bien libérées lorsque l'on n'en a plus besoin, il est nécessaire d'identifier le propriétaire de chaque ressource pour vérifier qu'il fait son travail correctement.

---

### Exposer les couplages

Lorsqu'il n'est pas possible d'identifier clairement le propriétaire d'une ressource dans un programme, il faut commencer par analyser comment intéragissent les composants du programme entre eux.
Cela permet généralement d'encapsuler un certain nombre d'objets à l'intérieur d'une même classe et de diviser le problème.

Exemple : dans le code suivant, qui est responsable de `res1` ?
```cpp
A a { res1 };           // a can be the owner of res1, but it can also be a simple observer of res1 
B b { res1, res2 };     // same for b
C c { res2 };           // c is definitely not the owner of res1.
```

En introduisant un type `D`, qui regroupe A et B :
```cpp
class D
{
public:
    D(Res res1, Res res2)
        : a { res1 }, b { res1, res2 }
    {}

private:
    A a;
    B b;
}
```

Il n'y a maintenant plus de doute. Dans le code suivant, c'est forcément `d` qui est responsable de `res1`. 
```cpp
D D { res1, res2 };     // no one but d seems to take care of res1, so it needs to be the owner of res1
C c { res2 };
```

Evidemment, pour que ça se passe bien, il ne faut pas regrouper n'importe quoi.
Il faut essayer de mettre ensemble les objets qui travaillent sur les mêmes ressources.

En regardant le `main`, pouvez-vous identifier des couplages entre certains objets ?
C'est-à-dire, quels objets semblent utiliser les mêmes ressources et travailler conjointement ?

{{% expand "Solution" %}}
Le résultat des opérations faites sur `red` n'impacte que `pc1`, celles faites sur `blue` n'impacte que `pc2`, et celles faites sur `some_guy` n'impacte que `pc3`.\
Il existe donc un couplage entre les instances de `Trainer` et les instances de `PC`.

Lorsqu'on ajoute un Pokémon dans `red_pokedex`, on ajoute ce même Pokémon dans `red` ou `pc1`. De même, lorsqu'on ajoute un Pokémon dans `blue_pokedex`, on l'ajoute également dans `blue` ou `pc2`.\
Il existe un couplage entre les instances de `Trainer` / `PC` et les instances de `Pokedex`.
{{% /expand %}}

Ajoutez deux attributs `PC _pc` et `Pokedex _pokedex` à la classe `Trainer` afin d'exposer clairement ces couplages.

{{% expand "Solution" %}}
```cpp
class Trainer
{
    ...

private:
    const std::string _name;

    PC                      _pc;
    Pokedex                 _pokedex;
    std::array<Pokemon*, 6> _team { nullptr };
};
```
{{% /expand %}}

{{% notice note %}}
En réalisant ce changement, vous venez de désigner chaque instance de `Trainer` comme le propriétaire du PC et du Pokédex avec lesquels elle intéragit.
Par transitivité, elle est donc aussi propriétaire des ressources managées par chacun de ces attributs.
Cela signifie qu'en toute logique, détruire un `Trainer` permettra d'entraîner automatiquement la libération de toutes les ressources qui lui sont directement associées (par exemple, le contenu de `_team`), mais aussi de celles associées à chacun de ses attributs (`_pc._stored_pokemons`).
{{% /notice %}}

Supprimez maintenant les variables de type `PC` et `Pokedex` du `main` et refactorisez le code de manière à utiliser vos nouveaux attributs à la place.\
Profitez-en pour en retirer les instructions inutiles, par exemple, lorsqu'un Pokémon est supprimé d'un conteneur dans lequel il ne pouvait de toute manière pas être.\
Vous êtes libre de modifier légèrement le comportement du programme, du moment que vous n'introduisez pas des bugs qui n'étaient pas là avant.

{{% expand "Solution" %}}
**Consultation du Pokédex**

On peut ajouter un getter de Pokédex dans `Trainer`.
```cpp
// Dans Trainer:
const Pokedex& get_pokedex() const { return _pokedex; }

// Dain main:
if (red.get_pokedex().has_duplicate(encounter) && ...)
```

---

**Capture des Pokémons**

On peut déplacer les appels à `Pokedex::add` et `PC::transfer` dans `Trainer::collect`.\
On en profite également pour introduire les fonctions privées `get_first_pokemon` (qui peut aussi être utilisée dans `get_level`) et `add_to_team` afin de rendre le code plus compréhensible.

```cpp
// Trainer::collect (public), qui ne plus besoin de retourner un bool:
void collect(Pokemon* pokemon)
{
    if (auto* fighter = get_first_pokemon())
    {
        fighter->level_up();
    }

    _pokedex.add(pokemon);

    if (!add_to_team(pokemon))
    {
        _pc.transfer(pokemon);
    }
}

// Trainer::get_level (public):
int get_level() const
{
    const auto* pokemon = get_first_pokemon();
    return pokemon ? pokemon->get_level() : 0;
}

// Trainer::get_first_pokemon (private):
Pokemon* get_first_pokemon() const
{
    for (auto* t : _team)
    {
        if (t != nullptr)
        {
            return t;
        }
    }

    return nullptr;
}

// Trainer::add_to_team (private):
bool add_to_team(Pokemon* pokemon)
{
    for (auto* t : _team)
    {
        if (t == nullptr)
        {
            t = pokemon;
            return true;
        }
    }

    return false;
}

// Dans main:
if (!red.get_pokedex().has_duplicate(encounter) && try_capture(red, encounter))
{
    red.collect(encounter);
}
else if (try_capture(blue, encounter))
{
    blue.collect(encounter);
}
```

{{% notice info %}}
Attention, comme `Trainer::collect` est utilisé à deux autres endroits du `main`, ce changement modifie le comportement du programme (`Pikachu` et `Squirtle` apparaîtront par exemple dans le Pokédex de `red`).
Si vous souhaitez garder l'ancien comportement, vous pouvez laisser `Trainer::collect` tel quel et implémenter une nouvelle fonction `Trainer::catch_pokemon` appelant `Pokedex::add`, `PC::transfer` et `Trainer::collect`.
{{% /notice %}}

---

**Pokémon non capturé**

Lorsque le pokémon n'est capturé par personne, il est évident qu'il n'a été attribué à aucun des dresseurs.\
Les deux instructions au dessus du `delete` se servent donc à rien :
```cpp
else
{
    delete encounter;
}
```

---

**Assistance aux Pokémons maltraités**

```cpp
// Code précédent:
pokecenter.heal(red.get_pokemons());

const auto traumatized = pokecenter.get_traumatized();

for (auto* pokemon : traumatized)
{
    red_pokedex.remove(pokemon);
    blue_pokedex.remove(pokemon);
    red.remove(pokemon);
    pc1.remove(pokemon);
}
```

En ne se basant que sur le code existant, `pokecenter` ne peut théoriquement avoir connaissance que des Pokémons de `red` faisant partie de son équipe (`get_pokemons` renvoie les Pokémons de l'équipe).
Cependant, on voit plus bas qu'il est en fait possible de déplacer les Pokémons de l'équipe vers le PC :
```cpp
for (auto* pokemon : blue.give_pokemons())
{
    pc2.transfer(pokemon);
}
```

Pour que le nouveau code reste robuste, lorsqu'un Pokémon est maltraité par un dresseur, il faut donc le supprimer de son équipe et de son PC.\
En effet, un programmeur pourrait très bien décidé d'insérer du code entre l'appel à `PokeCenter::heal` et la boucle qui le suit.
Si ce nouveau code réalise le transfert des Pokémons vers le PC, alors, ils resteront maltraités à tout jamais 😢  

On commence donc par déplacer les instructions relatives à `red_pokedex` et `pc1` dans la fonction `Trainer::remove`.

```cpp
// Trainer::remove (public):
void remove(const Pokemon* pokemon)
{
    _pokedex.remove(pokemon);

    if (!remove_from_team(pokemon))
    {
        _pc.remove(pokemon);
    }
}

// Trainer::remove_from_team (private):
bool remove_from_team(const Pokemon* pokemon)
{
    auto it = std::find(_team.begin(), _team.end(), pokemon);
    if (it != _team.end())
    {
        *it = nullptr;
        return true;
    }

    return false;
}

// Dans main:
for (auto* pokemon : traumatized)
{
    red.remove(pokemon);
    blue_pokedex.remove(pokemon);
    blue.remove(pokemon);
    pc2.remove(pokemon);
}
```

{{% notice tip %}}
Il est clair d'après l'implémentation de `collect` qu'un Pokémon ne peut pas être dans le PC s'il est déjà dans l'équipe (invariant de classe).
On n'est donc pas obligé d'appeler `PC::remove` si on a déjà trouvé le Pokémon dans l'équipe.
{{% /notice %}}

Qu'en est-il des instructions relatives à `blue` ?
Dans le code actuel, le `pokecenter` n'a jamais connaissance des Pokémons de `blue`.
On pourrait donc se dire que l'on peut retirer `blue` de la boucle sans problème.
Cependant, le code est amené à changer, et quelqu'un pourrait décider un jour d'insérer l'instruction `pokecenter.heal(blue.get_pokemons())` avant la boucle.\
Faut-il donc gérer ce potentiel futur cas, et ajouter `trainer.remove(pokemon)` dans la boucle pour tous les dresseurs du programme ?

La réponse est non.
Mais on ne peut pas non plus laisser le code tel quel, car si on rajoute du code pour soigner d'autres Pokémons, il faut aussi penser à ajouter des instructions dans la boucle plus loin.
Ce genre de situation est propice à l'introduction de bugs, et il faudrait donc refactoriser le système pour coupler plus fortement le fait de soigner les Pokémons avec le signalement des cas de maltraitance.

Mais comme on est déjà en plein milieu d'un autre refacto, et qu'il vaut mieux faire les choses une par une, on ajoute juste un commentaire pour penser à faire les autres modifications plus tard.

```cpp
// TODO: make the removal of the traumatized pokemon and the healing strongly coupled. 
pokecenter.heal(red.get_pokemons());

const auto traumatized = pokecenter.get_traumatized();
for (auto* pokemon : traumatized)
{
    red.remove(pokemon);
}
```

---

**Transfert des Pokémons sur le PC**

On pourrait faire un getter pour `_pc`, mais cela casserait l'encapsulation de la classe puisqu'il faudrait renvoyer un `_pc` non constant.
On ne pourrait par exemple plus garantir le fait qu'un Pokémon ne peut pas être à la fois dans l'équipe et le PC.

A la place, on ajoute une fonction `Trainer::transfer_team_to_pc`.

```cpp
// Trainer::transfer_team_to_pc (public):
void transfer_team_to_pc()
{
    for (auto* pokemon : give_pokemons())
    {
        _pc.transfer(pokemon);
    }
}

// Dans main:
blue.transfer_team_to_pc();
```

---

**Retour à l'état sauvage**

Blue étant un personnage sans coeur, tout ce qu'il l'intéresse, c'est de compléter son Pokédex et de monter de niveau rapidement.
Par conséquent, il capture tous les Pokémons qu'il rencontre, mais il les relâche plus tard s'il les a déjà.
C'est un peu comme les pêcheurs en fait...

Nous ajoutons donc une nouvelle fonction `release_duplicates` à la classe `Trainer`.\
On peut aussi supprimer complètement l'instruction `red.remove(pokemon)`, car les Pokémons apparaissant dans le Pokédex de Blue ne peuvent pas appartenir à Red. 

```cpp
// Trainer::release_duplicates (public):
void release_duplicates()
{
    auto duplicated = _pokedex.get_duplicated();
    for (auto* pokemon : duplicated)
    {
        // remove already delegates to all the right components (team / pc / pokedex).
        remove(pokemon);
    }
}

// Dans main:
blue.release_duplicates();
```

---

**Don de Pokémon**

`Trainer::collect` prenant maintenant en charge le transfert vers le PC si l'équipe est pleine, on peut simplement remplacer le contenu de la boucle par : 
```cpp
for (auto* pokemon : some_girl.give_pokemons())
{
    red.collect(pokemon);
}
```

---

**Abandon de carrière**

Etre maître Pokémon, ce n'est pas fait pour tout le monde, et `some_guy` a donc décidé qu'il valait mieux pour lui qu'il arrête sa carrière et relâche ses Pokémons.

`Trainer::give_pokemons` permet d'extraire les Pokémons faisant partie de l'équipe d'un dresseur.
Or comme un Pokémon ne peut pas être sur le PC s'il fait partie de l'équipe, on peut en déduire que l'instruction `pc3.release(pokemon)` n'a aucun d'effet.

```cpp
for (auto* pokemon : some_guy.give_pokemons())
{
    delete pokemon;
}
```

{{% /expand %}}

---

### Transferts d'ownership

Maintenant qu'il est plus simple d'identifier quels objets intéragissent ensemble, essayez de répondre aux questions suivantes.
- Quelles lignes de la fonction `main` réalisent un transfert d'ownership ?
C'est-à-dire à quel endroit le propriétaire d'une instance de `Pokemon` change ?
- Quelles lignes de la classe `Trainer` (fonctions publiques uniquement) réalisent un transfert d'ownership ?
- Pour chacun de ces transferts, qui est l'ancien propriétaire, et qui est le nouveau ?
- La classe `PokeCenter` détient-elle l'ownership des instances de `Pokémon` qu'elle référencent ?
Pouvez-vous répondre à cette question en analysant seulement le code de `PokeCenter` ?
- Même question pour `ProfessorOak`.
- Pour chacune des classes `Trainer`, `PC`, `Pokedex`, `ProfessorOak`, `PokeCenter`, indiquez si elle possède les `Pokemons` qu'elles référencent (= **composition**) ou si elle ne fait que les observer (= **aggrégation**).

{{% expand "Solutions" %}}

|                                                        | Ancien             | Nouveau           |
|--------------------------------------------------------|--------------------|-------------------|
| **Attributions des starters (main)**                   |                    |                   |         
| `some_guy.collect(oak.get_starter())`                  | `oak`              | `some_guy`        |
| `blue.collect(oak.get_starter())`                      | `oak`              | `blue`            |
| `some_girl.collect(oak.get_starter())`                 | `oak`              | `some_girl`       |
| `red.collect(oak.get_starter())`                       | `oak`              | `red`             |
| **Capture d'un Pokémon (main)**                        |                    |                   |
| `auto* encounter = random_encounter()`                 | `random_encounter` | `encounter`       |
| `red.collect(encounter)`                               | `encounter`        | `red`             |
| `blue.collect(encounter)`                              | `encounter`        | `blue`            |
| `delete encounter`                                     | `encounter`        | -                 |
| **Echange de Pokémon (main)**                          |                    |                   |
| `for (auto* pokemon : some_girl.give_pokemons())`      | `some_girl`        | `pokemon`         |
| `red.collect(pokemon)`                                 | `pokemon`          | `red`             |
| **Suppression de Pokémon (main)**                      |                    |                   |
| `for (auto* pokemon : some_guy.give_pokemons())`       | `some_guy`         | `pokemon`         |
| `delete pokemon`                                       | `pokemon`          | -                 |
| **Trainer::give_pokemons**                             |                    |                   |
| `auto pokemons = get_pokemons() + _team.fill(nullptr)` | `_team`            | `pokemon`         |
| `return pokemons`                                      | `pokemons`         | appelant          |
| **Trainer::collect**                                   |                    |                   |
| `add_to_team(pokemon)`                                 | `pokemon`          | `_team`           |
| `_pc.transfer(pokemon)`                                | `pokemon`          | -                 |
| **Trainer::transfer_team_to_pc**                       |                    |                   |
| `for (auto* pokemon : give_pokemons())`                | `_team`            | `pokemon`         |

**PokeCenter n'est pas un owner**\
L'instruction `pokecenter.heal(red.get_pokemons())` ne réalise pas de transfert, puisque `Trainer::get_pokemons` ne cède pas l'ownership des Pokémons de l'équipe (contrairement à `Trainer::give_pokemons`).\
`PokeCenter::heal` recevant un objet qui ne porte pas d'ownership, on peut donc en conclure que la classe `PokeCenter` est supposée être un observeur de `Pokemon`, et non pas un owner.
Afin de déduire cette information, il a été nécessaire d'analyser le code du `main`.
En effet, l'attribut `PokeCenter::_traumatized_pokemons` est exactement du même type que `PC::_stored_pokemons`, alors que le premier ne porte pas d'ownership mais le second oui.

**ProfessorOak est bien un owner**\
La classe `ProfessorOak` alloue elle-même ses propres instances de Pokémons.
`ProfessorOak` est donc bien owner des Pokémons dont il dispose, et on a ce coup-ci pu déduire l'information directement de l'implémentation de la classe.

**Conclusion**\
La relation entre les classes `Trainer`, `PC` et `ProfessorOak` et leurs Pokémons est une relation de composition.
En revanche, `Pokedex` et `PokeCenter` ne font qu'aggréger des Pokémons existants ailleurs.
{{% /expand %}}

Maintenant que vous êtes capable de déterminer à tout instant le propriétaire d'un Pokémon, vous devriez pouvoir identifier les endroits du programme succeptibles de déclencher des fuites de mémoire et les corriger.
Pour cela, il faut déjà s'assurer que le destructeur de chaque classe propriétaire de ressources s'occupe de leur libération.
Il faut ensuite vérifier que lorsqu'un transfert d'ownership a lieu dans une fonction, soit la fonction s'occupe de libérer cette ressource, soit elle retransfert l'ownership à un autre composant.
Enfin, il faut s'assurer que dès lors qu'un owner supprime sa dernière référence sur une ressource, soit il la libère préalablement, soit il la retransfère à quelqu'un d'autre.

{{% expand "Solutions" %}}
Il faut ajouter les destructeurs aux différentes classes qui ownent des instances de `Pokemon`.
```cpp
// Trainer.
~Trainer()
{
    for (auto* pokemon : _team)
    {
        delete pokemon;
    }
}

// PC
~PC()
{
    for (auto* pokemon : _stored_pokemons)
    {
        delete pokemon;
    }
}

// ProfessorOak
~ProfessorOak()
{
    for (auto* starter : _starters)
    {
        delete starter;
    }
}
```

{{% notice tip %}}
Il n'y a pas besoin de vérifier qu'un pointeur n'est pas nul avant de le `delete`.
Ecrire `delete nullptr` est tout à fait correct. L'instruction ne fait juste rien dans ce cas là.\
C'est d'écrire `delete ptr` avec `ptr` non nul mais déjà libéré qui peut générer une segfault.
{{% /notice %}}

Il faut ensuite s'assurer que toutes les fonctions qui ont à un moment reçu l'ownership d'un Pokémon l'ont soit cédé à quelqu'un d'autre, soit ont bien libéré les ressources qui lui étaient associées.
- `auto* encounter = random_encounter()` : `main` acquière l'ownership du résultat de `random_encounter`. Si l'ownership n'est pas cédé à un `Trainer`, la variable `encounter` est bien libérée.
- `for (auto* pokemon : some_girl.give_pokemons())` : `main` acquière l'ownership du résultat de `give_pokemons`, qu'il transfère ensuite à `red`.
- `for (auto* pokemon : some_guy.give_pokemons())` : `main` acquière l'ownership du résultat de `give_pokemons`, et il en libère la mémoire.
Il n'y a donc pas de problème à ce niveau là.

Vérifions maintenant que chaque fois qu'une référence sur un `Pokemon` est perdue dans les classes qui ownent des Pokémons, le Pokémon est soit libéré, soit transféré à quelqu'un d'autre.
- `PC::release` : lorsqu'un élément est retiré `_stored_pokemons`, le `Pokemon` associé n'est pas détruit. L'ownership de l'objet est donc *probablement* transmis à la fonction parente.
- `PC::remove` : `remove` est la seule fonction qui appelle `release` dans le code. Le `Pokemon` associé à cet appel est effectivement détruit. Il n'y a donc pas de fuite lors d'un appel à `remove`.
- `ProfessorOak::get_starter` : les éléments extraient de `_starters` sont transmis à la fonction appelante via la valeur de retour.\
Cette fonction est utilisée uniquement dans `main`, et les valeurs de retour sont ensuite transmises à des `trainers`. 
- `Trainer::remove_from_team` : les éléments extraient du tableau ne sont ni libérés, ni transférés à qui que ce soit. C'est donc éventuellement la fonction appelante qui récupère l'ownership.
Or, dans `Trainer::remove`, qui est le seul appelant de `remove_from_team`, la ressource n'est pas non plus libérée.
Cependant, si le Pokémon à extraire est dans `_pc` au lieu de `_team`, il est bien détruit, car `PC::remove` s'en charge pour nous. 
Il serait donc logique que `Trainer::remove_from_team` déclenche la destruction du Pokémon s'il existe, puisque l'appelant de `Trainer::remove` ne peut pas s'en charger (le Pokémon pourrait déjà avoir été détruit par `PC::remove`).
- `Trainer::give_pokemons` : les éléments extraits de `_team` sont transmis à la fonction appelante via la valeur de retour.

On corrige donc la fuite de mémoire produite par `Trainer::remove_from_team` en détruisant le `Pokemon` extrait avant de sortir de la fonction. 
```cpp
bool remove_from_team(const Pokemon* pokemon)
{
    auto it = std::find(_team.begin(), _team.end(), pokemon);
    if (it != _team.end())
    {
        auto to_destroy = *it;
        *it = nullptr;
        delete to_destroy;

        return true;
    }

    return false;
}
```
{{% /expand %}}

Les fuites de mémoire sont plus faciles à repérer lorsque le transfert d'ownership est correctement exprimé par le code.\
Hélas, ce n'est pas le cas ici. Typiquement, les fonctions `give_pokemons` et `get_pokemons` renvoient la même chose.
Pourtant la première réalise un transfert d'ownership alors que l'autre non.

Si on appelle `get_pokemons()` sans stocker le résultat où que ce soit, on aura juste fait un appel inutile.
En revanche, si on fait la même chose avec `give_pokemons()`, on déclenche une fuite de mémoire. 
```cpp
red.give_pokemons(); // fuite de mémoire à moins que red._team soit vide
```

Pour empêcher l'appelant d'une fonction d'ignorer son résultat, il est possible d'appliquer l'attribut `[[nodiscard]]` sur le type de retour de cette fonction.
Si la valeur de retour de la fonction n'est pas utilisée, alors le compilateur va déclencher une erreur.
```cpp
[[nodiscard]] int my_result_is_very_important() { return 3; } 

int main()
{
    // The following code is correct.
    std::cout << my_result_is_very_important() << std::endl;

    // This one also.
    int value = my_result_is_very_important();

    // However, this one triggers an error because the return value of my_result_is_very_important is not used.
    my_result_is_very_important();

    return 0;
};
```

{{% notice note %}}
Utilisez `[[nodiscard]]` n'empêchera pas forcément d'avoir des fuites. L'appelant peut très bien stocker le résultat dans une variable, et tout de même oublier de la libérer.
Cependant, l'attribut attirera quand même l'attention du programmeur, et il y aura donc plus de chances qu'il se rende compte qu'il doit détruire l'objet ou le transférer à quelqu'un d'autre. 
{{% /notice %}}

Ajoutez l'attribut `[[nodiscard]]` sur toutes les fonctions renvoyant une valeur propriétaire des ressources qu'elle référence. 

{{% expand "Solutions" %}}
```cpp
// Dans Journey.cpp
[[nodiscard]] Pokemon* random_encounter() { ... }

// Dans ProfessorOak.h
[[nodiscard]] Pokemon* get_starter() { ... }

// Dans Trainer.h
[[nodiscard]] std::vector<Pokemon*> give_pokemons() { ... }
```
{{% /expand %}}

Modifiez `PC::release` afin qu'elle retourne le Pokémon qu'elle a retiré de `_stored_pokemons`.
Il sera ainsi plus évident de comprendre que l'appel de la fonction déclenche une transmission d'ownership. 

{{% expand "Solutions" %}}
```cpp
void remove(const Pokemon& pokemon)
{
    delete release(pokemon);
}

[[nodiscard]] Pokemon* release(const Pokemon& pokemon)
{
    Pokemon* result = nullptr;

    auto it = std::find(_stored_pokemons.begin(), _stored_pokemons.end(), &pokemon);
    if (it != _stored_pokemons.end())
    {
        std::swap(result, *it); // <utility>
        _stored_pokemons.erase(it);
    }

    return result;
}
```
{{% /expand %}}

---

### Aggrégations

Vous avez rendu les transferts d'ownership un peu plus clair au niveau des valeurs de retour des fonctions.
Ce serait bien de pouvoir faire la même chose sur les paramètres.
A défaut de savoir comment exprimer un transfert d'ownership au niveau d'un paramètre, vous devriez savoir que ce qui permet d'exprimer une relation d'aggrégation (donc référencement sans ownership), ce sont les références.

Modifiez les signatures des fonctions qui ne récupèrent pas l'ownership de ce qu'on leur passe en utilisant des références plutôt que des pointeurs.\
Rappel: n'essayez par contre pas de remplacer des `std::vector<T*>` par des `std::vector<T&>`, cela ne compilera pas.

{{% expand "Solution" %}}
Il faut bien penser à reconvertir la référence en pointeur à l'intérieur des implémentations là où cela est nécessaire (appel à std::find, par exemple).

```cpp
// PC.h
void remove(const Pokemon& pokemon) { ... }

[[nodiscard]] Pokemon* release(const Pokemon& pokemon)
{
    ...
    auto it = std::find(_stored_pokemons.begin(), _stored_pokemons.end(), &pokemon);
    ...
}

// Pokedex.h
void add(const Pokemon& pokemon)
{
    _pokemons.emplace_back(&pokemon);
}

void remove(const Pokemon& pokemon)
{
    auto it = std::find(_pokemons.begin(), _pokemons.end(), &pokemon);
    ...
}

bool has_duplicate(const Pokemon& pokemon) const
{
    auto it = std::find(_pokemons.begin(), _pokemons.end(), pokemon.get_name());
    ...
}

// Trainer.h
void collect(Pokemon* pokemon)
{
    ...
    _pokedex.add(*pokemon);
    ...
}

void remove(const Pokemon& pokemon) { ... }

void release_duplicates()
{
    ...
        remove(*pokemon);
    ...
}

bool remove_from_team(const Pokemon& pokemon)
{
    auto it = std::find(_team.begin(), _team.end(), &pokemon);
    ...
}

// Journey.cpp
bool try_capture(const Trainer& trainer, const Pokemon& encounter)
{
    return (rand() % 3) * trainer.get_level() > encounter.get_level();
}

int main()
{
    ...
        if (!red.get_pokedex().has_duplicate(*encounter) && try_capture(red, *encounter))
        {
            ...
        }
        else if (try_capture(blue, *encounter))
        {
            ...
        }
    ...
    for (auto* pokemon : traumatized)
    {
        red.remove(*pokemon);
    }
    ...
}
```
{{% /expand %}}

Comme indiquer plus haut, il n'est pas possible de stocker les références directement dans des conteneurs.
Cependant, la STL propose un petit objet permettant d'emballer une référence.
Il s'agit de `std::reference_wrapper<T>`, contenu dans `<functional>`.
Comme cette classe est réassignable, il est possible de l'utiliser pour stocker des références dans des conteneurs.

```cpp
A a1;
A a2;

std::reference_wrapper<A> a1_ref = a1;

// On ne peut pas écrire directement a1_ref.value (car reference_wrapper n'a pas de membre `value`).
// On peut utiliser get() pour récupérer la "vraie" référence de type A&.
a1_ref.get().value = 3;
std::cout << a1 << std::endl; // -> 3

a1 = 6;
std::cout << a1_ref.get() << std::endl; // -> 6

// On peut par contre transformer un reference_wrapper en référence automatiquement via une assignation
// (sans faire get()).
A& a1_raw_ref = a1_ref;

// On peut aussi passer un reference_wrapper<A> à une fonction qui attend un A& sans faire de get().
fcn(a1);
fcn(a1_ref);
fcn(a1_raw_ref);

// Enfin, on peut mettre des reference_wrapper dans des conteneurs.
std::vector<std::reference_wrapper<A>> a_refs { a1, a2 };

std::cout << a_refs.front().get() << std::endl; // -> 6

a_refs.back().get().value = 2;
std::cout << a2 << std::endl; // -> 2
```

Remplacez les conteneurs de `Pokemon*` qui ne porte pas l'ownership des Pokémons par des conteneurs de `std::reference_wrapper<Pokemon>`.
Si les pointeurs étaient constants, vous pouvez dans ce cas utiliser des `std::reference_wrapper<const Pokemon>`.

Attention par contre à la recherche : pour trouver un objet particulier dans un conteneur de `reference_wrapper`, il faut comparer les adresses des objets référencés et non pas leur valeur.
```cpp
Obj obj_or;
Obj obj_copy = obj_or;

std::vector<std::reference_wrapper<Obj>> objects { obj_copy, obj_or };

// L'instruction suivante retournera obj_copy, car la comparaison utilise Obj::operator==.
std::find(objects.begin(), objects.end(), obj_or);

// Pour être sûr d'obtenir exactement obj_or, et pas n'importe quel objet qui pourrait lui être égal,
// il faut utiliser find_if et comparer les adresses.
std::find_if(objects.begin(), objects.end(), [&obj_or](const Obj& obj) { return &obj_or == &obj; });
```
N'hésitez pas à copier-coller la lambda ci-dessus et à adapter les noms à votre contexte, sans trop vous préoccuper de la syntaxe. 

{{% expand "Solution" %}}
```cpp
// Pokemon.h
friend bool operator==(const Pokemon& pokemon, std::string_view name)
{
    return pokemon._name == name;
}

// Pokedex.h
class Pokedex
{
public:
    void add(const Pokemon& pokemon)
    {
        _pokemons.emplace_back(pokemon);
    }

    void remove(const Pokemon& pokemon)
    {
        auto it = std::find_if(_pokemons.begin(), _pokemons.end(), [&pokemon](const Pokemon& p) { return &pokemon == &p; });
        ...
    }

    ...

    std::vector<std::reference_wrapper<const Pokemon>> get_duplicated() const
    {
        std::vector<std::reference_wrapper<const Pokemon>> result;

        for (auto it = _pokemons.begin(); it != _pokemons.end(); ++it)
        {
            auto duplicated = std::find(it + 1, _pokemons.end(), it->get().get_name());
            ...
        }

        return result;
    }

private:
    std::vector<std::reference_wrapper<const Pokemon>> _pokemons;
};

// Trainer.h
std::vector<std::reference_wrapper<Pokemon>> get_pokemons() const
{
    std::vector<std::reference_wrapper<Pokemon>> pokemons;
    ...
            pokemons.emplace_back(*t);
    ...
}

[[nodiscard]] std::vector<Pokemon*> give_pokemons()
{
    // On ne peut plus utiliser get_pokemons, puisque le type de retour n'est plus le même plus.

    std::vector<Pokemon*> pokemons;

    for (auto* t : _team)
    {
        if (t != nullptr)
        {
            pokemons.emplace_back(t);
        }
    }

    _team.fill(nullptr);
    return pokemons;
}

void release_duplicates()
{
    auto duplicated = _pokedex.get_duplicated();
    for (auto& pokemon : duplicated)
    {
        ...
    }
}

// PokeCenter.h
class PokeCenter
{
public:
    void heal(const std::vector<std::reference_wrapper<Pokemon>>& pokemons)
    {
        // Remplace auto* par Pokemon& plutôt que auto& pour ne pas avoir à faire le get() en dessous.
        for (Pokemon& pokemon : pokemons)
        {
            if (pokemon.get_level() == 0)
            {
                ...
            }
        }
    }

    std::vector<std::reference_wrapper<Pokemon>> get_traumatized()
    {
        ...
    }

private:
    std::vector<std::reference_wrapper<Pokemon>> _traumatized_pokemons;
};

// Journey.cpp
const auto traumatized = pokecenter.get_traumatized();
for (auto& pokemon : traumatized)
{
    red.remove(pokemon);
}
```
{{% /expand %}}

---

### Conclusion

En C++, les problèmes de gestion de mémoire, c'est courant :
- fuite de mémoire,
- accès à de la mémoire libérée,
- écriture dans de la mémoire libérée,
- double free,
- accès à de la mémoire non-allouée, car pointeurs non-initialisés,
- etc.

L'objectif de cet exercice, c'était de vous faire prendre conscience que plus une ressource est partagée dans un programme, plus il est difficile de savoir qui est censé la gérer.

Du coup, afin de faciliter la compréhension du programme et de limiter les erreurs, voilà ce que vous pouvez appliquer :
- Faites en sorte qu'il soit facile de distinguer si vos fonctions exposent des ressources (comme `get_pokemons`) ou transfèrent des ressources (comme `give_pokemons`).
- Faites aussi en sorte qu'il soit facile de distinguer si un objet est propriétaire d'une ressource (composition) ou s'il ne fait que l'utiliser (aggrégation).  
- Si dans une fonction, vous ne souhaitez plus référencer une ressource dont vous avez l'ownership :
    - soit vous libérez la ressource,
    - soit vous placez cette ressource dans la valeur de retour de la fonction, que vous marquez `[[nodiscard]]`.
- Essayez de faire en sorte que les composants qui intéragissent ensemble et partagent les mêmes ressources soient fortement couplés.
Cela permet de notifier plus facilement les dépendances d'une ressource avant qu'elle ne soit libérée.

---

### (Bonus) Et le TODO alors ?

Si vous avez envie, vous pouvez modifier la fonction `PokeCenter::heal` afin de faire en sorte que les Pokémons maltraités soient secourus au cours de l'appel de la fonction.
Vous devriez du coup pouvoir supprimer entièrement les membres `get_traumatized` et `_traumatized_pokemons` de la classe `PokeCenter`.
