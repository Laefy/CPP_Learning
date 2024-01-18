---
title: "Opérateurs ➗"
weight: 6
---

Sur cette page, nous vous montrerons comment implémenter vos propres opérateurs.  
Nous en profiterons aussi pour vous expliquer comment définir un alias de type et comment définir des fonctions amies. 

---

### Définition

Un opérateur est une fonction, mais qui peut être appelée avec une syntaxe "simplifiée".

Prenons l'exemple de la concaténation de `std::string` :
```cpp
auto a = std::string { "a" };
auto b = std::string { "b" };
auto ab = a + b;
```

Dans le code ci-dessus, l'expression `a + b` est en fait un appel à une fonction dont la signature est quelque chose comme: `operator+(std::string, std::string)`.  
Le code suivant aurait donc été parfaitement équivalent, mais moins agréable à lire :
```cpp
auto a = std::string { "a" };
auto b = std::string { "b" };
auto ab = operator+(a, b);      // => une manière moche d'écrire a + b
```

Il y a deux manières de définir des opérateurs : via des fonctions libres ou via des fonctions-membres.  
Voici un exemple pour chacune des méthodes :
```cpp
// Méthode 1 - avec une fonction libre
struct Point
{
    int x = 0;
    int y = 0;
};

Point operator+(Point p1, Point p2)
{
    return Point { p1.x + p2.x, p1.y + p2.y };
}

int main()
{
    Point p1 { 3, 5 };
    Point p2 { 1, 0 };

    auto p3 = p1 + p2;
    // équivalent à :
    // auto p3 = operator+(p1, p2)m
}

// Méthode 2 - avec une fonction-membre
struct Point
{
    Point operator+(Point other) const
    {
        return Point { x + other.x, y + other.y };
    }

    int x = 0;
    int y = 0;
}

int main()
{
    Point p1 { 3, 5 };
    Point p2 { 1, 0 };

    auto p3 = p1 + p2;
    // équivalent à :
    // auto p3 = p1.operator+(p2);
}
```

L'opérateur `+` étant un **opérateur binaire** (c'est-à-dire qu'il attend 2 opérandes), notez bien que la signature prend deux paramètres dans le cas de la fonction libre et un seul dans le cas de la fonction-membre (instance courante + un paramètre = 2 opérandes).

---

### Méthodologie de l'exercice

Pour assimiler un peu ces notions, nous vous proposons un petit exercice.  
Commencer par ouvrir le fichier `chap-02/5-operators/main.cpp`.

Vous utiliserez la même méthodologie que pour `1-first_class.cpp` : 
1. Décommenter la prochaine ligne du `main`.
2. Ecrire le code permettant de la faire compiler.
3. Compiler et tester.
4. Si ça ne fonctionne pas, modifier le code, et recommencer à partir de l'étape 3.
5. Si ça fonctionne, recommencer à partir de l'étape 1, jusqu'à ce que tout le code du `main` soit décommenté.

Vous aurez à implémenter une classe `Polygon` contenant un tableau dynamique de `Vertex`.

Vous ajouterez deux fichiers `Polygon.h` et `Polygon.cpp`, afin de contenir la définition de votre classe et l'implémentation de ses fonctions.

---

### Définition de la classe

Décommentez la première instruction du `main` :
```cpp
Polygon polygon;
```

Créez un nouveau fichier `Polygon.h` et ajoutez-y la définition d'une classe `Polygon`, pour le moment vide.  
Que faut-il mettre au début du header ? Que devez-vous penser à faire dans `main.cpp` ?

{{% hidden-solution %}}
Au début des headers, il faut écrire `#pragma once`.\
Dans le fichier `main.cpp`, on pense à inclure le nouveau fichier `Polygon.h`.

```cpp
#pragma once

class Polygon
{
};
```
{{% /hidden-solution %}}

---

### Ajout d'un sommet

Décommentez l'instruction suivante :
```cpp
polygon.add_vertex(2, 3);
```

Pour ajouter un sommet au polygône, il va déjà falloir faire en sorte que le polygône puisse en contenir.

Afin de représenter les sommets, vous allez utiliser la structure `std::pair<int, int>`.
Ajoutez un attribut `_vertices` qui puisse contenir un tableau dynamique de sommets.  
Quel doit-être le type de `_vertices` ? Dans quel header est défini `std::pair` ?

{{% hidden-solution %}}
Les attributs doivent être placés autant que possible dans la partie privée.

```cpp
#pragma once

#include <utility>
#include <vector>

class Polygon
{
private:
    std::vector<std::pair<int, int>> _vertices;
};
```
{{% /hidden-solution %}}

Comme `std::pair<int, int>` n'est ni très lisible, ni très représentatif de ce qui va être contenu dedans, vous allez créer un **alias** `Vertex` dessus.  
Pour définir un alias (équivalent au `typedef` en C), on utilise le mot-clef `using` :
```cpp
using AliasName = OriginalType;
```

Adaptez cette instruction et placez-la dans `Polygon.h`, juste avant la définition de votre classe. Modifiez la définition de `_vertices` afin d'utiliser cet alias.
{{% hidden-solution %}}
```cpp {hl_lines=[6,10]}
#pragma once

#include <utility>
#include <vector>

using Vertex = std::pair<int, int>;

class Polygon
{
private:
    std::vector<Vertex> _vertices;
};
```

{{% notice note %}}
Il est aussi possible de placer l'instruction pour définir un alias à l'intérieur d'une classe (partie privée ou publique, en fonction de si on veut pouvoir y accéder de l'extérieur ou pas), ainsi que dans le corps d'une fonction (accessible alors uniquement depuis cette fonction).
{{% /notice %}}

{{% /hidden-solution %}}

Ajoutez enfin la fonction `add_vertex` à votre classe.
Vous l'implémenterez dans un nouveau fichier `Polygon.cpp`.  
Pour construire un `Vertex` (aka `std::pair<int, int>`), sachez que vous pouvez passer deux entiers à son constructeur. 

{{% hidden-solution %}}
Voici une implémentation possible pour `add_vertex` :

```cpp
void Polygon::add_vertex(int x, int y)
{
    _vertices.emplace_back(x, y);
}
```

{{% notice tip %}}
La fonction `emplace_back` de `vector` est un peu spéciale.
On peut lui passer directement les arguments que l'on passerait au constructeur de l'objet qu'on souhaite ajouter au tableau.  
Du coup, plutôt qu'écrire `_vertices.emplace_back(Vertex { x, y })`, on peut directement écrire `_vertices.emplace_back(x, y)`.  
Plutôt pratique, non ?
{{% /notice %}}

{{% /hidden-solution %}}

---

### Inspection des variables

Pour vérifier que le programme fonctionne correctement, vous allez utiliser le debugger.  
Pensez bien à compiler votre programme avec `-g` et à modifier la valeur de `program` dans le fichier `.vscode/launch.json`.

Placez ensuite un breakpoint sur la ligne `polygon.add_vertex(2, 3);` du `main`.  
![](/CPP_Learning/images/chapter2/6-breakpoint-v2.png)

Lancez ensuite le programme avec F5.  
Votre vue devrait désormais ressembler à celle-ci si vous vous placez dans l'onglet 'Exécution' à gauche :
![](/CPP_Learning/images/chapter2/6-execution-v2.png)

Dans la fenêtre des variables, en haut à gauche, cliquez sur la variable `polygon`, puis sur son membre `_vertices`.  
Celui-ci ne devrait rien contenir.

Appuyez sur F10 pour exécuter l'instruction sur la ligne 9.  
Vous devriez constater que `_vertices` contient désormais le sommet (2, 3). 
![](/CPP_Learning/images/chapter2/6-vertices.png)

---

### Opérateur d'indice

Décommentez les instructions :
```cpp
polygon.add_vertex(4, 5);
polygon.add_vertex(6, 7);

auto vertex = polygon[1];
std::cout << "(" << vertex.first << "," << vertex.second << ")" << std::endl; // -> (4,5)
```

Implémentez l'opérateur `[]` pour la classe `Polygon`, sachant que les deux instructions suivantes sont équivalentes :
```cpp
auto vertex = polygon[1];
auto vertex = polygon.operator[](1);
```

Etant donné que cet opérateur ne modifie pas les attributs de `Polygon`, que faut-il ajouter à la fin de la signature ?

{{% hidden-solution %}}
```cpp
class Polygon
{
public:
    ...

    Vertex operator[](int index) const
    {
        return _vertices[index];
    }

    ...
};
```

On pense bien à mettre le `const` sur cette fonction-membre, puisqu'elle n'a pas vocation à modifier l'état de l'objet.
{{% /hidden-solution %}}

---

### Un ami imprimeur

Décommentez la dernière instruction :
```cpp
std::cout << polygon << std::endl;
```

Le but de cette dernière partie est d'implémenter l'opérateur de flux `<<` pour la classe `Polygon`.

La première opérande de l'opérateur `<<` est le flux dans lequel on souhaite écrit.  
Le type associé est `std::ostream`, et on le passe par référence, car on ne veut pas créer de copie du flux à l'appel de la fonction.  
Ce flux est ensuite renvoyé comme valeur de retour, afin de pouvoir chaîner l'appel :
```cpp
std::cout << polygon << std::endl;
// => std::cout << polygon
//    ^^^^^^^^^^^^^^^^^^^^ << std::endl
```

Comme la première opérande n'est pas de type `Polygon`, nous ne pouvons pas implémenter l'opérateur `<<` en tant que fonction-membre de `Polygon`.  
On peut néanmoins définir une fonction libre, dont le prototype est :
```cpp
std::ostream& operator<<(std::ostream& stream, Polygon polygon);
```

Essayez d'implémenter cette fonction.
Vous placerez la déclaration dans `Polygon.h` et la définition dans `Polygon.cpp`.
Pour son contenu, faites pour le moment en sorte qu'elle affiche `"This is a polygon"` dans le flux.

{{% hidden-solution %}}
Dans `Polygon.h` :
```cpp {hl_lines=[3,14]}
#pragma once

#include <ostream> // -> pour pouvoir utiliser le type std::ostream
#include <utility>
#include <vector>

using Vertex = std::pair<int, int>;

class Polygon
{
    ...
};

std::ostream& operator<<(std::ostream& stream, Polygon polygon);
```

Dans `Polygon.cpp` :
```cpp
std::ostream& operator<<(std::ostream& stream, Polygon polygon)
{
    stream << "This is a polygon";
    return stream;
}
```
{{% /hidden-solution %}}

Maintenant que vous avez défini votre opérateur, vous allez modifier son implémentation afin de pouvoir afficher le contenu de `polygon`.  
Nous attendrons dans la console le résultat suivant :
```b
(2,3) (4,5) (6,7) 
```

L'inconvénient ici, c'est qu'on ne peut pas accéder à `_vertices` depuis `operator<<`, car `_vertices` est un attribut privé de `Polygon` et `operator<<` une fonction libre.  
Il est possible de contourner cette limitation en déclarant la fonction comme étant **amie** de la classe.
En effet, les fonctions amies d'une classe ont le droit d'accéder à la partie privée de celle-ci.

Pour déclarer une fonction amie, on place le prototype de la fonction à l'intérieur de la définition de la classe, précédée du mot-clef `friend`.  
Par exemple :
```cpp {linenos=table}
class SomethingHidden
{
    friend void display_content(SomethingHidden something);

private:
    std::string _password;
};

void display_content(SomethingHidden something)
{
    std::cout << something._password << std::endl;
}
```

Dans le code ci-dessus, à la ligne 11, le compilateur autorise l'accès à l'attribut privé `SomethingHidden::_password`, car `display_content` est une fonction amie de la classe.

{{% notice info %}}
Attention, si une fonction est déclarée ou définie dans une classe avec `friend`, **il s'agit d'une fonction libre, pas d'une fonction-membre** !  
Pensez donc bien à lui passer l'objet qui vous intéresse en paramètre, car il n'y a pas d'instance courante.
{{% /notice %}}

Déclarez `operator<<` en tant qu'amie de la classe `Polygon`, puis modifiez son implémentation afin d'afficher les coordonnées de chacun des sommets dans la console.

{{% hidden-solution %}}
L'endroit où vous placez la déclaration dans la classe n'a pas d'importance.
Les modificateurs de visibilité n'ont pas d'effet sur une déclaration d'amitié. 

Dans `Polygon.h` :
```cpp {hl_lines=[11]}
#pragma once

#include <ostream>
#include <utility>
#include <vector>

using Vertex = std::pair<int, int>;

class Polygon
{
    friend std::ostream& operator<<(std::ostream& stream, Polygon polygon);

public:
    void add_vertex(int x, int y);

public:
    std::vector<Vertex> _vertices;
};
```

Dans `Polygon.cpp` :
```cpp
std::ostream& operator<<(std::ostream& stream, Polygon polygon)
{
    for (auto v: polygon._vertices)
    {
        stream << "(" << v.first << "," << v.second << ") ";
    }

    return stream;
}
```
{{% /hidden-solution %}}

{{% notice warning %}}
Le mécanisme d'amitié brise l'encapsulation d'une classe.
C'est donc un élément du langage qu'il faut éviter d'utiliser si on peut s'en passer.  
Dans le cas ci-dessus, c'est acceptable car on ne peut pas définir l'opérateur de flux en tant que fonction-membre de `Polygon` (la première opérande étant un `std::ostream`).
{{% /notice %}}

---

### Synthèse

- Pour définir un alias sur un type, on utilise `using` : `using SimpleName = std::difficult_thing<std::to_read<std::horrible>>;`
- Un opérateur est une fonction libre ou une fonction-membre dont l'identifiant commence par `operator`, et qui peut être appelée avec une syntaxe plus naturelle.
- On peut déclarer des fonctions libres en tant qu'amies d'une classe avec `friend`, pour qu'elles puissent accéder aux membres privés de la classe.
- Pour définir l'opérateur de flux `<<` permettant d'afficher le contenu d'un objet, on implémente : `std::ostream& operator<<(std::ostream& stream, <type> object) { ... }`
