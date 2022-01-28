---
title: "🐮 Concerto animalier"
weight: 2
---

Vous allez maintenant apprendre à définir des classes permettant à leurs enfants de spécialiser leur comportement. On parle alors de **classe polymorphe**.\
Nous ferons un petit récapitulatif en fin de page, pour rappelez les points essentiels auxquels il faut faire attention lorsque vous définissez des classes polymorphes pour éviter les bugs. 

---

Pour cet exercice, vous modifierez les fichiers :\
\- `chap-04/2-farm/FarmHouse.cpp`\
\- `chap-04/2-farm/Animal.h`\
\- `chap-04/2-farm/Dog.h`\
\- `chap-04/2-farm/Cat.h`\
\- `chap-04/2-farm/Chicken.h`\
\- `chap-04/2-farm/Cow.h`

La cible à compiler est `c4-2-farm`.

---

### Fonction virtuelle

Essayez de compiler le programme fourni.
Vous devriez avoir une erreur au niveau de l'appel à `sing_a_lot` dans le `main`, vous indiquant qu'il n'est pas possible de convertir les différentes classes `Dog`, `Cat`, `Cow` et `Chicken` en `Animal`.\
Selon vous, que faut-il faire dans chacune de ces classes pour que l'on puisse passer une variable de ce type à une fonction attendant une référence sur un `Animal` ?\
Modifiez le programme en conséquence pour qu'il compile.

{{% expand "Solution" %}}
Il faut que chacune de ces classes hérite de `Animal`. Et comme spécifié précédemment, on n'oublie pas d'indiquer le mot-clef `public` dans la relation de parenté.

```cpp
class Cat : public Animal { ... };
class Chicken : public Animal { ... };
class Cow : public Animal { ... };
class Dog : public Animal { ... };
```
{{% /expand %}}

Essayez maintenant d'exécuter le programme. Comme vous pouvez le constater, c'est la fonction `sing` de la classe `Animal` qui est appelée à chaque fois, et non pas les fonctions `sing` de chacune des sous-classes.

Pour demander au compilateur d'appeler les implémentations spécifiées dans les classes dérivées plutôt que celle de la classe de base, vous allez devoir rendre la fonction `sing` **virtuelle**.
Pour ce faire, il faut placer le mot-clef `virtual` devant le prototype de la fonction dans `Animal` :
```cpp
class Animal
{
public:
    virtual void sing() const { std::cout << "..." << std::endl; }
};
```

Recompilez à nouveau le programme. Les implémentations dans les classes dérivées devraient maintenant être appelées.

---

### Vérification de la signature

Vous aimeriez maintenant rajouter un paramètre à la fonction, permettant de remplacer le retour à la ligne par un espace :
```bash
Meow Meow
Waf
Mewwwwwh Mewwwwwh Mewwwwwh
Waf
Cotcotcotcodet Cotcotcotcodet
```

Réalisez les modifications dans le programme pour obtenir la sortie ci-dessus. Néanmoins, comme vous n'avez pas pris votre café ce matin, et vous allez (in)volontairement oublier de modifier le contenu de Cow.h.

{{% expand "Solution" %}}
Animal.h :
```cpp
virtual void sing(char next_char) const { std::cout << "..." << next_char; }
```
Classes dérivées (sauf `Cow`) :
```cpp
void sing(char next_char) const { std::cout << "<some noise>" << next_char; }
```
FarmHouse.cpp:
```cpp
void sing_a_lot(const Animal& animal, unsigned int times)
{
    if (times > 0)
    {
        while (--times > 0)
        {
            animal.sing(' ');
        }

        animal.sing('\n');
    }
}
```
{{% /expand %}}

Vous devriez constater que malgré votre étourderie, le programme compile toujours. Cependant, c'est de nouveau l'implémentation de `sing` dans `Animal` qui est appelée, plutôt que celle de `Cow`.

Ce comportement est tout à fait normal.
Lorsqu'une fonction virtuelle `fcn` est appelée sur une classe `Class`, le programme va déterminer quelle fonction appeler en recherchant dans les enfants de `Class` une fonction ayant la même signature (nom + paramètres + type de retour + constness) que `Class::fcn`. Il parcourt donc chacune des classes, de la plus dérivée à la moins dérivée, jusqu'à trouver la déclaration d'une fonction satisfaisant cette condition.

Comme `Cow::sing` n'a pas la même signature que `Animal::sing`, et qu'il n'y a pas d'autres surcharges à `sing` dans la classe `Cow`, le programme va remonter dans sa classe parent `Animal`, et déterminer que c'est `Animal::sing` qui doit être utilisée.

**C'est peut-être normal comme comportement, mais ça n'empêche pas de se retrouver avec des bugs...**

Lorsque vous modifiez la signature d'une fonction virtuelle et que vous oubliez de modifier la signature d'une de ses redéfinitions, vous vous retrouvez avez des bugs qui ne sont pas toujours évident à identifier. Ici, vous n'aviez que quelques classes, et un seul niveau d'héritage, mais dans un programme plus conséquent, ce n'est pas rare d'avoir une bonne centaine de classes héritant d'une même classe-mère.  

Donc pour éviter les étourderies, vous allez demander au compilateur de vous prévenir en cas de divergences de signatures suite à la modification d'une fonction virtuelle.
Pour cela, à partir de maintenant et jusqu'à la fin de vos jours, dès lors que vous redéfinirez une fonction virtuelle dans une classe fille, vous ajouterez le mot-clef `override` à la fin de son prototype.

Vous aurez donc `virtual` devant le prototype de la fonction dans la classe-mère, et `override` derrière le prototype des fonctions dans la classe-fille :
```cpp
virtual void fcn();   // This function can be overriden in child classes
void fcn() override;  // This function is overriding the implementation of a base class's virtual function.
```

{{% notice note %}}
Lorsqu'une fonction est marquée `override`, le compilateur effectue les deux vérifications suivantes :\
\- il existe une fonction avec la même signature dans l'une des classes parent,\
\- cette fonction est déclarée virtuelle. 
{{% /notice %}}

Ajoutez le mot-clef `override` à la fin du prototype de `sing` (donc derrière le `const`) dans chacune des classes-fille, et vérifier que le compilateur refuse maintenant de compiler la fonction `Cow::sing`.

{{% expand "Solution" %}}
Cow :
```cpp
void sing() const override { std::cout << "Mewwwwwh" << std::endl; }
```
Autres classes dérivées :
```cpp
void sing(char next_char) const override { std::cout << "<some noise>" << next_char; }
```
{{% /expand %}}

Modifiez maintenant la signature et l'implémentation de `Cow::sing` de manière à ce que le programme compile et qu'il affiche le résultat attendu.

{{% expand "Solution" %}}
```cpp
void sing(char next_char) const override { std::cout << "Mewwwwwh" << next_char; }
```
{{% /expand %}}

{{% notice info %}}
Les mots-clef `virtual` et `override` ne font pas partie de la signature des fonctions-membre.
Donc tout comme `static`, si vous définissez une fonction-membre `fcn` en dehors de sa classe `Class`, vous devrez écrire `void Class::fcn() { ... }` et non pas `virtual void Class::fcn() { ... }` ou `void Class::fcn() override { ... }`.
{{% /notice %}}

---

### Conteneurs polymorphes

Nous allons maintenant voir comment regrouper un ensemble d'animaux dans un conteneur, de façon à l'envoyer à une fonction.

Commencez par instancier un `std::vector<Animal>` et essayez d'insérer dedans les variables `dog` et `cat`.
Créez ensuite une fonction `sing_chorus` prenant ce tableau en paramètres et dans laquelle vous appelerez `sing` sur chacun de ces éléments.
Que pouvez-vous constater en testant le programme ?

{{% expand "Solution" %}}
```cpp
#include <iostream>

void sing_chorus(const std::vector<Animal>& animals)
{
    for (const auto& animal: animals)
    {
        animal.sing(' ');
    }

    std::cout << std::endl;
}

...

int main()
{
    ...

    std::vector<Animal> animals;
    animals.emplace_back(dog);
    animals.emplace_back(cat);

    sing_chorus(animals);

    return 0;
}
```

En testant, on s'aperçoit que c'est de nouveau `Animal::sing` qui est appelé et non pas les fonctions dérivées...
{{% /expand %}}

**D'où vient le problème ?**

En fait, en créant un `vector<Animal>`, chaque fois que vous avez ajouté un élément dans le tableau, vous avez instancié un nouvel objet de type `Animal`.
Comme `dog` est un `Dog`, il peut être converti en `const Animal&`, et donc, le constructeur de copie `Animal(const Animal&)` est appelé pour créer chacun des éléments.
Dans votre tableau, vous avez donc créer des objets de type `Animal`, et non pas de type `Dog` ou `Cat`.
C'est pour cela que c'est la fonction `sing` de `Animal` qui est appelée.

**Du coup, comment faire pour placer des animaux de type différents dans un conteneur, tout en gardant la possibilité d'appeler sur les éléments les fonctions redéfinies dans les classes-filles ?**

Dans la fonction `sing_a_lot`, les fonctions des classes-fille étaient correctement appelées, car `animal` était passé par référence et non pas par copie.
Le programme pouvait donc retrouver le type à partir duquel `animal` a été construit pour déterminer les fonctions à appeler.
Il suffirait donc d'utiliser un tableau de référence pour régler le problème.

Le souci, c'est qu'écrire `vector<Animal&>` ne compilera pas.
En effet, d'après la documentation de `vector`, le type des éléments doit être assignable par copie.
Or, les références ne sont pas réassignables...

Du coup, à défaut de pouvoir utiliser des références, **vous allez devoir passer par des pointeurs**.\
Modifiez votre code pour de manière à remplacer le `vector<Animal>` par un `vector<Animal*>` et vérifiez que le programme fonctionne maintenant comme il faut.

{{% expand "Solution" %}}
```cpp
void sing_chorus(const std::vector<Animal*>& animals)
{
    for (const auto* animal: animals)
    {
        animal->sing(' ');
    }

    std::cout << std::endl;
}

...

int main()
{
    ...

    std::vector<Animal*> animals;
    animals.emplace_back(&dog);
    animals.emplace_back(&cat);

    sing_chorus(animals);

    return 0;
}
```
{{% /expand %}}

---

### Destructeurs virtuels

Vous allez maintenant créer une nouvelle classe `Opera`, contenant un tableau d'animaux.
Contrairement à tout à l'heure, ce tableau sera propriétaire de la mémoire des animaux qu'il contient.

Pour faire cela, plutôt qu'insérer dans le tableau des pointeurs sur des objets déjà existants, vous allez créer et placer des `unique_ptr` dans le tableau :
```cpp
std::vector<std::unique_ptr<Animal>> animals;
animals.emplace_back(std::make_unique<Dog>());
animals.emplace_back(std::make_unique<Cat>());
animals.emplace_back(std::make_unique<Chicken>());
```

Définissez la classe `Opera` en respectant les contraintes suivantes :\
\- une fois le constructeur appelé, les instances de `Opera` doivent contenir un animal de chaque type,\
\- il est possible d'appeler une fonction `sing` sur une instance, qui exécute alors la fonction `sing` de chacun des animaux qu'elle contient.

Instanciez et utiliser cette classe dans le `main` pour vérifier que tout fonctionne.

{{% expand "Solution" %}}
Opera.h
```cpp
#pragma once

#include "Animal.h"
#include "Cat.h"
#include "Chicken.h"
#include "Cow.h"
#include "Dog.h"

#include <iostream>
#include <memory>
#include <vector>

class Opera
{
public:
    Opera()
    {
        _animals.emplace_back(std::make_unique<Cat>());
        _animals.emplace_back(std::make_unique<Chicken>());
        _animals.emplace_back(std::make_unique<Cow>());
        _animals.emplace_back(std::make_unique<Dog>());
    }

    void sing() const
    {
        for (const auto& animal: _animals)
        {
            animal->sing(' ');
        }

        std::cout << std::endl;
    }

private:
    std::vector<std::unique_ptr<Animal>> _animals;
};
```

FarmHouse.cpp
```cpp
...

int main()
{
    ...

    Opera opera;
    opera.sing();

    return 0;
}
```
{{% /expand %}}

{{% notice warning %}}
Je m'excuse par avance pour les âmes sensibles.
{{% /notice %}}

Il paraît que lorsqu'on coupe la tête d'une poule, celle-ci continue de courir.
Comme ici, nous avons affaire à des artistes et non pas des athlètes, nous allons dire qu'elle continue de chanter.

Ajoutez un destructeur à la classe `Chicken`, dans lequel vous afficherez le râle d'agonie de votre poulet. Un truc du style `"CotCooooooooot!"` fera parfaitement l'affaire.\
Combien d'objets de type `Chicken` avez-vous construits dans votre programme ? Obtenez-vous le nombre de `"CotCooooooooot!"` attendus ?

{{% expand "Solution" %}}
```cpp
class Chicken : public Animal
{
public:
    ~Chicken() { std::cout << "CotCooooooooot!" << std::endl; }

    void sing(char next_char) const override { std::cout << "Cotcotcotcodet" << next_char; }
};
```

Vous devriez avoir construits au moins deux objets de type `Chicken` (un dans le `main`, et un dans la classe `Opera`).
Pourtant, il semblerait que l'un des appels au destructeur ne soit pas réalisé...  
{{% /expand %}}

**Pourquoi le destructeur de `Chicken` n'est pas tout le temps appelé ?**

Il y a deux manières d'appeler le destructeur d'un objet :

1- Si l'objet est construit sur la pile, alors, le destructeur de cet objet est appelé une fois que l'on sort du bloc dans lequel il a été construit.
```cpp
{
    Chicken chicken;
    ...
} // le destructeur de chicken est appelé à la sortie du bloc
```

2- En utilisant l'instruction `delete` sur un objet alloué avec un `new`.
```cpp
Chicken* chicken = new Chicken {};
...
delete chicken; // le destructeur de chicken est appelé sur cette ligne.
```

Dans le cas d'un `unique_ptr<T>`, il appelle `delete` sur son pointeur interne. 
```cpp
{
    std::unique_ptr<Chicken> chicken = std::make_unique<Chicken>();
    ...
} // le destructeur de std::unique_ptr est appelé à la sortie du bloc, et celui-ci appelle `delete` sur son pointeur interne, de type Chicken*.
```

Le problème de `delete`, c'est qu'il regarde le type du pointeur pour déterminer le destructeur à appeler.
```cpp
Chicken* chicken = new Chicken {};
delete chicken; // appelle ~Chicken, car chicken est de type Chicken*

Animal* dog = new Dog {};
delete dog; // appelle ~Animal, car dog est de type Animal*
```

Le code suivant appelera par conséquent le destructeur de `Animal` plutôt que le destructeur de `Chicken`.
```cpp
{
    std::unique_ptr<Animal> chicken = std::make_unique<Chicken>();
    ...
} // ~Animal() est appelé au lieu de ~Chicken()...
```

Or, nous avons vu au début de cette page que, lorsque le programme doit appeler une fonction, il recherche une redéfinition dans les classes-filles seulement si la fonction est déclarée virtuelle dans la classe-mère.
Eh bien, c'est exactement pour cela que `~Chicken` n'est pas appelé pendant la destruction de la classe `Opera`.

Dans la classe `Opera`, pour appeler le `delete` sur les animaux contenus dans les `unique_ptr`, le compilateur commence par regarder le prototype de `~Animal`.
Comme vous n'avez pas défini le destructeur vous-même, il tombe sur le destructeur généré par défaut.\
L'implémentation par défaut du destructeur n'étant pas virtuelle, le compilateur détermine qu'il n'aura pas besoin de rechercher de redéfinition dans les classe-filles au moment de l'exécution du programme.
C'est donc `~Animal` qui est appelé pour chacun des animaux.

Du coup, afin que le destructeur `~Chicken` soit toujours appelé lors de la destruction d'un objet de type `Chicken`, il faut que vous redéfinissiez explicitement le destructeur de `Animal` pour le déclarer virtuel.\
N'oubliez pas d'ajouter le `override` sur `~Chicken`, pour indiquer au compilateur, mais surtout à vous-même, que vous êtes en train de redéfinir un destructeur virtuel.

Testez le programme pour vérifier que désormais, `~Chicken` est bien appelé durant la destruction de la variable `opera`.

{{% expand "Solution" %}}
Animal.h:
```cpp
class Animal
{
public:
    virtual ~Animal() {}

    virtual void sing(char next_char) const { std::cout << "..." << next_char; }
};
```

Chicken.h:
```cpp
class Chicken : public Animal
{
public:
    ~Chicken() override { std::cout << "CotCooooooooot!" << std::endl; }

    void sing(char next_char) const override { std::cout << "Cotcotcotcodet" << next_char; }
};
```
{{% /expand %}}

---

### Ce qu'il faut retenir

1. Pour pouvoir redéfinir le comportement d'une fonction dans une classe-fille, il faut déclarer la fonction comme étant virtuelle dans la classe-mère.\
Pour cela, on place le mot-clef `virtual` en début de prototype.

{{% notice note %}}
Dès lors qu'une fonction est déclarée virtuelle dans une classe, celle-ci reste virtuelle dans les enfants, mais aussi dans les petits-enfants, arrière-petit-enfants, etc.\
D'une part, ça fait qu'il n'est pas nécessaire de remettre `virtual` sur le prototype de cette fonction dans les sous-classes.\
D'autre part, cela veut dire qu'il n'est pas possible de faire en sorte qu'une fonction virtuelle redevienne non-virtuelle à un certain niveau de la hiérarchie :
une fois que c'est virtuel, c'est virtuel à tout jamais.
{{% /notice %}}

2. Lorsqu'on rédéfinit une fonction dans une classe-fille, on place le mot-clef `override` à la fin de son prototype.
Cela force le compilateur à vérifier qu'on est effectivement en train de redéfinir une fonction d'une classe de base.

3. Lorsqu'on fait de l'héritage "dynamique", c'est-à-dire qu'on a une ou plusieurs fonction virtuelle, ou bien que l'on compte stocker des objets de type `Child` dans des pointeurs `Parent` **ownant** (c'est-ç-dire qui peuvent détruire l'objet, comme `unique_ptr`), on définit **TOUJOURS** explicitement le destructeur de `Parent` pour le rendre virtuel. **TOUJOURS !**

4. Si vous copiez un objet `Child` dans une variable `parent` de type `Parent`, vous ne pourrez pas appeler les redéfinitions de fonctions définies dans `Child`.\
Si vous souhaitez appeler des fonctions redéfinie dans une classe-fille, il faut donc que la variable soit un objet de type `Child`, ou bien qu'elle référence (via une référence ou un pointeur) un objet de type `Child`.
```cpp
Child                   c;
Child&                  ref = c;
Parent&                 p   = c;
Parent*                 p   = &c;
std::unique_ptr<Parent> p   = std::make_unique<Child>();
```
