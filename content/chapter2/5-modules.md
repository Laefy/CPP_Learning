---
title: "Modularité 🧱"
weight: 5
---

Cet exercice vous permettra de découvrir :
- comment écrire des headers en C++,
- comment extraire l'implémentation des fonctions d'une classe en dehors de cette classe,
- à quoi correspondent les membres statiques d'une classe et comment les définir,
- comment déléguer un appel à un autre constructeur.

---

### Séparer l'implémentation des fonctions-membres

Ouvrez le dossier `chap-02/4-modules`.
Celui-ci est composé de 3 fichiers :
- `main.cpp`, qui contient une fonction `main` déjà écrite
- `Rectangle.h`, qui contient une classe `Rectangle`,
- `Rectangle.cpp`, qui est lui tout vide.

Il est très courant de placer la définition de chaque classe dans un header différent et d'extraire l'implémentation des ses fonctions-membres dans l'**unité de compilation** (`.cpp`) associée.  
Cela permet de réduire drastiquement les temps de compilation dans les gros projets, car :
1. le code est réparti dans plusieurs fichiers qui peuvent être compilés en parallèle,
2. si on modifie un `.cpp`, seul ce dernier a besoin d'être recompilé,
3. si on modifie un header, seuls les `.cpp` qui en dépendent ont besoin d'être recompilés.

Dans cet exercice, vous allez voir comment extraire le constructeur de la classe `Rectangle` et sa fonction `scale` dans le fichier `Rectangle.cpp`.  
Vous laisserez dans le header les petits getters.

1. Commencez par vérifier que le programme constitué uniquement de `main.cpp` compile, et exécutez-le.

2. Dans `Rectangle.h`, remplacez les définitions du constructeur de `scale` par des déclarations de fonction.
Vous mettrez de côté les anciennes définitions en les commentant.  
Notez que pour déclarer un constructeur, c'est pareil que pour n'importe quelle autre fonction. On écrit sa signature et on termine par un `;`.  
Vérifiez ensuite que le fichier `main.cpp` compile, mais que le programme n'arrive plus à linker.

{{% hidden-solution %}}
```cpp
class Rectangle
{
public:
    Rectangle(float length, float width);
//    Rectangle(float length, float width)
//        : _length { length }, _width { width }
//    {}

    ...

    void scale(float ratio);
//    void scale(float ratio)
//    {
//        _length *= ratio;
//        _width *= ratio;
//    }

    ...
};
```

La commande `g++ -std=c++17 -c main.cpp`, permettant de compiler uniquement `main.cpp` en fichier-objet, se termine avec succès.  
En revanche, en exécutant ensuite `g++ -o rectangle main.o`, on obtient les erreurs suivantes :
```b
main.o:main.cpp:(.text+0x28): undefined reference to `Rectangle::Rectangle(float, float)'
main.o:main.cpp:(.text+0xc9): undefined reference to `Rectangle::scale(float)'
```
{{% /hidden-solution %}}

Pour définir une fonction-membre en dehors de sa classe, il suffit de préfixer l'identifiant de la fonction par le nom de la classe, suivi de `::`.  
Par exemple :
```cpp
struct ClassName
{
    void fcn(int p);
};

void ClassName::fcn(int p)
     ^^^^^^^^^^^
{
    ...
}
```

2. Modifiez le fichier `Rectangle.cpp` de manière à y définir les fonctions-membres `Rectangle::Rectangle` (le constructeur de `Rectangle`) et `Rectangle::scale`.  
Pensez également à y inclure le fichier `Rectangle.h`, sinon, le compilateur ne comprendra pas que `Rectangle` est une classe.  
Compilez et testez le programme.

{{% hidden-solution %}}
```cpp
#include "Rectangle.h"

Rectangle::Rectangle(float length, float width)
    : _length { length }, _width { width }
{}

void Rectangle::scale(float ratio)
{
    _length *= ratio;
    _width *= ratio;
}
```

On pense bien à indiquer les deux fichiers `.cpp` pour compiler le programme :
```b
g++ -std=c++17 main.cpp Rectangle.cpp
```
{{% /hidden-solution %}}

---

### Petit apparté relatif à l'édition des liens

Comme vous avez pu le constater, votre programme compile.
Pourtant, si on s'intéresse aux fonctions dont les instructions attérissent dans les fichiers-objet, on a :
- pour `main.o` : `main()`, `Rectangle::get_length()`, `Rectangle::get_width()`
- pour `Rectangle.o` : `Rectangle::get_length()`, `Rectangle::get_width()`, `Rectangle::Rectangle()`, `Rectangle::scale(float)`

Les fonctions `Rectangle::get_length()` et `Rectangle::get_width()` apparaissent donc 2 fois.  
En théorie, on devrait donc avoir des erreurs de type `"multiple definition of ..."` et le programme ne devrait donc pas compiler...

Eh bien en réalité, toutes les fonctions qui sont définies à l'intérieur de la définition de la classe sont automatiquement spécifiées comme étant `inline`.
Pour rappel, ce mot-clef permet d'indiquer au linker qu'il doit ignorer les éventuelles redéfinitions d'une fonction.

Ainsi, votre programme compile sans que vous ayiez besoin de mettre des `inline` sur tous vos getters.

---

### Constructeur délégué

Vous pouvez instancier des rectangles, mais vous aimeriez bien aussi pouvoir instancier des carrés.
Pour cela, vous pouvez tout à faire écrire :
```cpp
Rectangle square(2.5f, 2.5f);
```

Sauf que ça vous paraît un peu bête de devoir réécrire deux fois la même valeur dans l'appel au constructeur.

1. Modifiez le `main` afin de créer cette instance de `square`, mais en n'y passant qu'une seule fois `2.5f`.\
Définissez ensuite le constructeur à 1 paramètre correspondant, qui initialise les deux attributs `_length` et `_width` avec cette valeur.  
Vous placerez l'implémentation de ce constructeur dans `Rectangle.cpp`.

{{% hidden-solution %}}
```cpp
// Rectangle.cpp

Rectangle::Rectangle(float size)
    : _length { size }, _width { size }
{}

Rectangle::Rectangle(float length, float width)
    : _length { length }, _width { width }
{}

...

// Rectangle.h

class Rectangle
{
public:
    Rectangle(float size);
    Rectangle(float length, float width);

    ...
};
```
{{% /hidden-solution %}}

Le constructeur que vous venez de créer pourrait en fait appeler le second constructeur, en lui passant `size` deux fois.

Pour appeler un constructeur depuis un autre constructeur, il faut appeler le premier constructeur depuis la liste d'initialisation du second. Cela donne donc quelque chose comme ça :
```cpp {hl_lines=[9]}
class SomeClass
{
public:
    SomeClass(int p1, int p2, int p3)
        : _a1 { p1 }, _a2 { p2 }, _a3 { p3 }
    {}

    SomeClass(int p1)
        : SomeClass { p1, p2, p3 }
    {}

    ...
};
```

2. Modifiez l'implémentation du constructeur à 1 paramètre, de manière à déléguer la construction au constructeur à 2 paramètres.

{{% hidden-solution %}}
```cpp
Rectangle::Rectangle(float size)
    : Rectangle { size, size }
{}
```
{{% /hidden-solution %}}

{{% notice info %}}
Vous ne pouvez pas initialiser d'attributs dans la liste d'initialisation d'un constructeur qui a délégué la construction à un autre constructeur.  
Le constructeur à qui vous déléguez la construction doit donc vous permettre d'initialiser l'intégralité des attributs de la classe comme vous le souhaitez.
{{% /notice %}}

---

### Membres statiques

Nous souhaiterions maintenant pouvoir créer une série de carrés de même taille, sans avoir à spécifier le moindre paramètre à leur construction.
Voici à quoi le code devrait pour ressembler :

```cpp
/* some instruction saying that next squares's size will be 3.f */

Rectangle s1;
Rectangle s2;

/* some instruction saying that next squares's size will now be 5.f */

Rectangle s3;
Rectangle s4;
Rectangle s5;

// At this point, size of s1 and s2 should be 3.f, and size of s3, s4 and s5 should be 5.f. 
```

Pour cela, nous allons définir des **membres statiques** à la classe `Rectangle`.

#### Attribut statique

Un attribut est dit statique si sa valeur est portée par la classe et non par une instance. Cela permet d'avoir une variable qui est partagée par l'ensemble des instances d'une classe. 

1. Pour mettre cela en pratique, vous allez définir un nouvel attribut statique `_default_size` dans la partie publique de la classe `Rectangle`.
Il sera de type `float`, et vous n'essaierez pas de l'initialiser pour le moment.
Vous pouvez utiliser la syntaxe suivante pour déclarer un attribut statique : `static type _attribute;`.

{{% hidden-solution %}}
```cpp
class Rectangle
{
public:
    static float _default_size;

    ...
};
```
{{% /hidden-solution %}}

2. Ajoutez maintenant un constructeur par défaut à votre classe, qui déléguera la construction au constructeur à 1 paramètre en lui passant `_default_size`.  
À ce stade, votre programme ne devrait plus pouvoir compiler à cause d'une erreur de linker.  
Vérifiez néanmoins que chacun de vos `.cpp` compilent correctement.

{{% hidden-solution %}}
```cpp
// Rectangle.h :

class Rectangle
{
public:
    static float _default_size;

    Rectangle();
    ...
};

// Rectangle.cpp :

Rectangle::Rectangle()
    : Rectangle { _default_size }
{}
```
{{% /hidden-solution %}}

L'erreur indique que la variable `Rectangle::_default_size` n'est pas définie.
Et en effet, vous n'avez fait que la moitié du travail...  
La ligne `static float _default_size;` dans `Rectangle` est une déclaration d'attribut statique, et non pas une définition.

Pour définir un attribut statique, il y a deux méthodes.  
La première consiste à écrire dans un `.cpp`, en dehors de toute fonction : `type ClassName::attribute;`  
Notez bien qu'à cet endroit, on ne remet pas le mot-clef `static`, mais on préfixe par contre l'attribut avec `ClassName::`.

3. Ajoutez la définition de l'attribut `_default_size` dans le fichier `Rectangle.cpp`.
C'est au niveau de la définition d'un attribut que vous pouvez spécifier un initializer.  
Compilez et testez votre programme avec un débuggeur de manière à vous assurer que la valeur de `_default_value` est correctement initialisée.

{{% hidden-solution %}}
Comme la variable est statique, le compilateur l'initialisera à 0 de lui-même (contrairement aux variables locales de types fondamentaux).  
Mais c'est quand même plus clair de spécifier une valeur d'initialisation, donc autant le faire.
```cpp
float Rectangle::_default_size = 0.f;
```
{{% /hidden-solution %}}

4. Si vous ne l'avez pas déjà fait, ajoutez dans le `main` les instructions pour instancier une série de `Rectangle` à partir du constructeur par défaut.  
Compilez et vérifiez à l'aide d'un débuggeur que les rectangles créés ont bien tous pour taille la valeur contenue dans `_default_size`.

La seconde manière de définir un attribut statique est beaucoup plus simple, mais ne fonctionne qu'à partir de C++17.  
Il suffit de placer le mot-clef `inline` à la déclaration de l'attribut, juste devant son type.
La déclaration se transforme alors magiquement en définition.

5. Commentez la définition de `_default_size` à l'intérieur de `Rectangle.cpp` et utilisez la méthode avec `inline` pour définir l'attribut.

{{% hidden-solution %}}
```cpp
class Rectangle
{
public:
    static inline float _default_size;

    Rectangle();
    ...
};
```
{{% /hidden-solution %}}

6. Vous allez maintenant modifier la valeur de `_default_size` entre les différentes instanciations de vos rectangles.  
Pour accéder à la valeur de `_default_size` ou la modifier en dehors de la classe `Rectangle`, il faut préfixer par `Rectangle::`.  
Testez que les tailles de vos rectangles sont bien initialisées avec la dernière valeur assignée à `_default_size` au moment de l'appel au constructeur.

{{% hidden-solution %}}
```cpp
Rectangle::_default_size = 2.f;
Rectangle s1; // -> size is 2.f
Rectangle s2; // -> size is 2.f

Rectangle::_default_size = 7.f;
Rectangle s3; // -> size is 7.f
Rectangle s4; // -> size is 7.f
Rectangle s5; // -> size is 7.f
```
{{% /hidden-solution %}}

---

#### Fonction-membre statique

Une fonction-membre est dite statique si elle peut être appelée sur la classe plutôt que sur une instance. Ces fonctions peuvent donc accéder à l'ensemble des attributs statiques de la classe, mais elles ne peuvent pas accéder aux attributs d'instance, puisqu'on ne leur founit aucune instance au moment de l'appel.

Vous allez déplacer `_default_size` dans la partie privée de la classe et définir un setter statique dans la partie publique.  
Pour indiquer qu'une fonction-membre est statique, il faut placer le mot-clef `static` devant la déclaration de la fonction dans la définition de la classe. Attention, c'est uniquement à cet endroit là qu'il faut le faire. Si vous implémentez la fonction dans un `.cpp` séparé, vous ne devrez donc pas remettre `static` devant la définition.

1. Définissez la fonction-membre statique `set_default_size` prenant un `float` en paramètre et assignant sa valeur à `_default_size`. Vous placerez l'implémentation de la fonction dans `Rectangle.cpp`.

{{% hidden-solution %}}
```cpp
// Rectangle.h :

class Rectangle
{
public:
    static void set_default_size();
    ...

private:
    static float _default_size;
    ...
};

// Rectangle.cpp :
...
void Rectangle::set_default_size(float size)
{
    _default_size = size;
}
...
```
{{% /hidden-solution %}}

2. Pour appeler cette fonction depuis l'extérieur de la classe, il faut préfixer son nom par `Rectangle::`.\
Dans le `main`, remplacez les assignations de `_default_size` par des appels à `set_default_size`. Testez votre programme.

{{% hidden-solution %}}
```cpp
Rectangle::set_default_size(2.f);
Rectangle s1; // -> size is 2.f
Rectangle s2; // -> size is 2.f

Rectangle::set_default_size(7.f);
Rectangle s3; // -> size is 7.f
Rectangle s4; // -> size is 7.f
Rectangle s5; // -> size is 7.f
```
{{% /hidden-solution %}}

---

### Synthèse

- Pour définir une fonction-membre en dehors de la classe, on préfixe l'identifiant de la fonction par `ClassName::`.
- Si une fonction est définie à l'intérieur de la définition de la classe, elle est considérée `inline` par le linker (pas de risque de définitions multiples si le header est inclus depuis différents `.cpp`).
- On peut déléguer la construction à un autre constructeur en l'appelant depuis la liste d'initialisation.
- Les membres statiques ne sont pas associés à une instance de classe, on peut y accéder depuis la classe elle-même avec `ClassName::member`.
- Pour déclarer une fonction-membre statique, on écrit `static` devant le prototype de la fonction : `static void fcn();`  
- Pour déclarer un attribut statique, on écrit `static` devant la déclaration de l'attribut : `static int _attr;`
- Pour convertir une déclaration d'attribut statique en définition, on peut ajouter `inline` devant : `inline static int _attr = 0;`
