---
title: "🔳 Rectangle"
weight: 5
---

Cet exercice vous permettra de découvrir :
- comment écrire des headers en C++,
- comment extraire l'implémentation des fonctions d'une classe en dehors de cette classe,
- à quoi correspondent les membres statiques d'une classe et comment les définir,
- comment déléguer un appel à un autre constructeur.

---

Pour cet exercice, vous modifierez les fichiers :\
\- `chap-02/4-rectangle/main.cpp`\
\- `chap-02/4-rectangle/Rectangle.cpp`\
\- `chap-02/4-rectangle/Rectangle.h`

La cible à compiler est `c2-4-rectangle`.

---

### Header en C++

Vous commencez l'exercice avec une fonction `main` dans le fichier `main.cpp` et la définition d'une classe `Rectangle` dans le fichier `Rectangle.h`.

En C++, les headers peuvent avoir pour extension .h, .hpp, .hxx, .inl, .inc, et j'en passe. Nous avons utilisé .h pour cet exercice.\
En C, vous deviez écrire des gardes d'inclusions en utilisant `#ifndef X / #define X / #endif`. Désormais, vous pouvez simplement écrire `#pragma once` tout en haut du fichier.
Cela demande au compilateur de ne pas recopier une nouvelle fois le header dans le .cpp si celui-ci y a déjà été copié.

Enfin, si vous regardez le fichier `main.cpp`, vous pouvez constater que l'on inclut le fichier `Rectangle.h` en utilisant des `""`. Ici, c'est pareil qu'en C, si le fichier est dans le même projet, on aura tendance à utiliser `#include "header.h"`, et s'il s'agit d'une librairie externe, plutôt `#include <header.h>`.

---

### Implémentation => .cpp

Il est très courant de placer chaque définition de classe dans un header différent et d'extraire l'implémentation des ses fonctions-membres dans l'**unité de compilation** (.cpp) associé.
Cela permet de limiter le nombre d'inclusions à faire dans les headers et par conséquent de réduire les temps de compilation (surtout sur les gros projets).

Dans cet exercice, vous allez voir comment extraire le constructeur de la classe `Rectangle` et sa fonction `scale` dans le fichier `Rectangle.cpp`.
Vous pouvez laisser dans le header les petits getters.

`Rectangle.h` :\
Remplacez les définitions du constructeur et de `scale` par des déclarations de fonction. Vous mettre de côté les anciennes définitions en les commentant.\
Pour déclarer un constructeur, c'est pareil que pour n'importe quelle autre fonction. On écrit sa signature et on termine par un `;`.
Si vous essayez de compiler le code, votre `main` devrait compiler sans erreur, par contre, votre programme ne devrait pas pouvoir linker.

{{% expand "Solution" %}}
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
{{% /expand %}}

`Rectangle.cpp` :\
Commencez par inclure le fichier `Rectangle.h`. Autrement, vous ne pourrez pas faire référence à la classe `Rectangle`.\
Déplacez-y ensuite les définitions des fonctions qui étaient dans le header.\
La dernière étape consiste à indiquer que ces fonctions appartiennent à la classe `Rectangle`. Pour cela, vous devez préfixer le nom de vos fonctions avec `Rectangle::`.
C'est la même syntaxe que celle utilisée pour indiquer qu'un symbole fait partie d'un namespace. Ici, on indique que le symbole fait partie d'une classe.

Vous devriez maintenant pouvoir compiler et tester le programme.

{{% expand "Solution" %}}
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
{{% /expand %}}

---

### Constructeur délégué

Vous pouvez instancier des rectangles, mais vous aimeriez bien aussi pouvoir instancier des carrés.
Pour cela, vous pouvez tout à faire écrire :
```cpp
Rectangle square(2.5f, 2.5f);
```

Sauf que ça vous paraît un peu bête de devoir réécrire deux fois la même valeur dans l'appel au constructeur.

Modifiez le `main` afin de créer cette instance de `square`, mais en n'y passant qu'une seule fois `2.5f`.\
Définissez ensuite le constructeur à 1 paramètre correspondant qui initialise les deux attributs `_length` et `_width` avec cette valeur.\
Vous placerez l'implémentation de ce constructeur dans `Rectangle.cpp`.

{{% expand "Solution" %}}
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
{{% /expand %}}

Le constructeur que vous venez de créer pourrait en fait appeler le second constructeur, en lui passant `size` deux fois.

Pour appeler un constructeur depuis un autre constructeur, il faut appeler le premier constructeur depuis la liste d'initialisation du second. Cela donne donc quelque chose comme ça :
{{< highlight cpp "hl_lines=9" >}}
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
{{< /highlight >}}

Modifiez l'implémentation du constructeur à 1 paramètre, de manière à déléguer la construction au constructeur à 2 paramètres.

{{% expand "Solution" %}}
```cpp
Rectangle::Rectangle(float size)
    : Rectangle { size, size }
{}
```
{{% /expand %}}

{{% notice info %}}
Une fois la construction déléguée, vous ne pouvez pas indiquer d'initialisation pour un ou plusieurs attributs de la classe. Si vous déléguez la construction à un autre constructeur, ce dernier doit donc vous permettre d'initialiser l'intégralité des attributs de la classe comme vous le souhaitez.
{{% /notice %}}

---

### Membres statiques

Nous souhaiterions maintenant pouvoir créer un série de carrés de même taille, sans avoir à spécifier le moindre paramètre à leur construction.
Voici à quoi le code devrait pour ressembler :

```cpp
/* some instruction saying that next squares's size will be 3.f */

Rectangle s1;
Rectangle s2;

/* some instruction saying that next squares's size will now be 5.f */

Rectangle s3;
Rectangle s4;
Rectangle s5;

// At this point, size of s1 and s2 should be 3.f, and size fo s3, s4 and s5 should be 5.f. 
```

Pour cela, nous allons définir des **membres statiques** à la classe Rectangle.

#### Attribut statique

Un attribut est dit statique si sa valeur est portée par la classe et non par une instance. Cela permet d'avoir une variable qui est partagée par l'ensemble des instances d'une classe. 

Pour mettre cela en pratique, vous allez définir un nouvel attribut statique `_default_size` dans la partie publique de la classe `Rectangle`. Il sera de type `float`, et vous n'essayerez pas de l'initialiser pour le moment. Vous pouvez utiliser la syntaxe suivante pour déclarer un attribut statique : `static type _attribute;`.

{{% expand "Solution" %}}
```cpp
class Rectangle
{
public:
    static float _default_size;

    ...
};
```
{{% /expand %}}

A ce stade, vous ne devriez plus pouvoir compiler, car le linker n'arrive pas à trouver de référence pour `_default_size`.

En fait, vous n'avez fait que la moitié du travail. Vous avez déclaré l'attribut statique, mais vous ne l'avez pas défini. Pour cela, il faut aller dans un .cpp afin d'y ajouter la ligne suivante : `type ClassName::attribute;`. Notez qu'à cet endroit, on ne remet pas le mot-clef `static`, mais on préfixe par contre l'attribut avec `ClassName::`.

Ajoutez la définition de l'attribut `_default_size` dans le fichier `Rectangle.cpp`. C'est au niveau de la définition d'un attribut que vous pouvez (et devez dans le cas des primitives) spécifier un initializer.
Compilez et testez votre programme avec un débuggeur de manière à vous assurez que la valeur de `_default_value` est correctement initialisée.

{{% expand "Solution" %}}
```cpp
float Rectangle::_default_size = 0.f;
```
{{% /expand %}}

Ajoutez ensuite un constructeur par défaut à votre classe, qui déléguera la construction au constructeur à 1 paramètre en lui passant `_default_size`. Les attributs statiques peuvent être accédés de la même manière que les attributs non-statiques.

Si vous ne l'avez pas déjà fait, ajoutez dans le `main` les instructions pour instancier une série de `Rectangle` à partir du constructeur par défaut. Compilez et vérifiez à l'aide d'un débuggeur que les rectangles créés ont bien tous pour taille la valeur contenue dans `_default_size`.

{{% expand "Solution" %}}
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
{{% /expand %}}

Vous allez maintenant modifier la valeur de `_default_size` entre les différentes instanciations de vos rectangles. Pour accéder ou modifier à la valeur de `_default_size` en dehors de la classe `Rectangle`, il faut préfixer par `Rectangle::`.\
Testez que les tailles de vos rectangles sont bien initialisées avec la dernière valeur assignée à `_default_size` au moment de l'appel au constructeur.

{{% expand "Solution" %}}
```cpp
Rectangle::_default_size = 2.f;
Rectangle s1; // -> size is 2.f
Rectangle s2; // -> size is 2.f

Rectangle::_default_size = 7.f;
Rectangle s3; // -> size is 7.f
Rectangle s4; // -> size is 7.f
Rectangle s5; // -> size is 7.f
```
{{% /expand %}}

#### Fonction-membre statique

Une fonction-membre est dite statique si elle peut être appelée sur la classe plutôt que sur une instance. Ces fonctions peuvent donc accéder à l'ensemble des attributs statiques de la classe, mais elles ne peuvent pas accéder aux attributs d'instance, puisqu'on ne leur founit aucune instance au moment de l'appel.

Vous allez maintenant déplacer `_default_size` dans la partie privée de la classe et définir un setter statique dans la partie publique.\
Pour indiquer qu'une fonction-membre est statique, il faut placer le mot-clef `static` devant la déclaration de la fonction dans la définition de la classe. Attention, c'est uniquement à cet endroit là qu'il faut le faire. Si vous implémentez la fonction dans un .cpp séparé, vous ne devrez donc pas remettre `static` devant la définition.

Définissez la fonction-membre statique `set_default_size` prenant un `float` en paramètre et assignant sa valeur à `_default_size`. Vous placerez l'implémentation de la fonction dans `Rectangle.cpp`.

{{% expand "Solution" %}}
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

void Rectangle::set_default_size(float size)
{
    _default_size = size;
}
```
{{% /expand %}}

Pour appeler cette fonction depuis l'extérieur de la classe, il faut préfixer son nom par `Rectangle::`.\
Dans le `main`, remplacez les assignations de `_default_size` par des appels à `set_default_size`. Testez votre programme.

{{% expand "Solution" %}}
```cpp
Rectangle::set_default_size(2.f);
Rectangle s1; // -> size is 2.f
Rectangle s2; // -> size is 2.f

Rectangle::set_default_size(7.f);
Rectangle s3; // -> size is 7.f
Rectangle s4; // -> size is 7.f
Rectangle s5; // -> size is 7.f
```
{{% /expand %}}

---

### Opérateur `<<` (le retour)

Implémentez une surcharge de l'opérateur `<<` dans `Rectangle.cpp`, de manière à pouvoir remplacer les :
```cpp
std::cout << "{ L: " << rect.get_length() << ", W: " << rect.get_width() << " }" << std::endl;
```

par des :

```cpp
std::cout << rect << std::endl;
```

N'oubliez pas d'ajouter la déclaration de la fonction dans le header `Rectangle.h`, afin que vous puissiez vous en servir dans `main`.

{{% expand "Solution" %}}
```cpp
// Rectangle.h :

class Rectangle
{
    ...
};

std::ostream& operator<<(std::ostream& stream, const Rectangle& rect);

// Rectangle.cpp :

#include <ostream>

...

std::ostream& operator<<(std::ostream& stream, const Rectangle& rect)
{
    return stream << "{ L: " << rect.get_length() << ", W: " << rect.get_width() << " }";
}
```
