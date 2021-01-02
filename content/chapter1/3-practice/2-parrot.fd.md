---
title: "Perroquet"
weight: 2
---

Vous allez maintenant implémenter un perroquet, qui répète ce que vous dites dans la console.

---

Pour cet exercice, vous modifierez le fichier :\
\- `chap-01/2-parrot.cpp`

La cible à compiler est `c1-2-parrot`.

---

### Lire un entier

Commencez par écrire une fonction `main` qui ne fait rien, comme dans l'exercice précédent.
Compilez et exécutez le programme, pour être sûr que tout est bien configuré.

Ensuite, vous allez déclarer une variable de type `int`. Cela se fait de la même manière qu'en C.
```cpp
int number = 0;
```

{{% notice tip %}}
Il faut toujours initialiser vos variables de types primitifs (c'est-à-dire les variables qui ne sont pas des instances de classe). Cela permet d'avoir des crashes et des bugs non-aléatoires, qui se reproduisent toujours de la même manière. Parce que quand un bug ne se produit qu'une fois sur dix, il y a des chances que ce soit le correcteur du TP qui se le prenne, alors que tout c'était bien passé la dernière fois que vous avez testé le programme.\
Et plus sérieusement, quand vous serez en entreprise, et que vous vous arracherez les cheveux à relancer 341 fois le même programme pour essayer de reproduire un bug (qu'il faut bien corriger, même s'il n'arrive qu'une fois sur 341), vous vous rappelerez que faire en sorte que vos programmes soient déterministes, ça aide à ne pas devenir chauve.
{{% /notice %}}

Utilisez ensuite l'instruction suivante pour lire un nombre depuis l'entrée standard.
Vous conviendrez que la seule différence avec l'instruction pour écrire sur la sortie standard, c'est qu'on utilise `cin` plutôt que `cout`, et que les chevrons sont dans l'autre sens.

```cpp
std::cin >> number;
```

Ecrivez ensuite `number` sur la sortie standard et tester votre programme. Si vous exécutez depuis VSCode, utilisez `CMake: Run Without Debugging` plutôt que `CMake: Debug`, afin que le programme s'exécute dans le terminal intégré pour pouvoir y entrer vos valeurs.  

{{% expand "Solution" %}}
```cpp
#include <iostream>

int main()
{
    int number = 0;
    std::cin >> number;
    std::cout << "Craow " << number << "!" << std::endl;
    return 0;
}
```
{{% /expand %}}

---

### Faire une boucle

Vous allez maintenant utilisez une boucle `while` afin d'exécuter vos instructions à l'infini. Placez `true` en condition du `while`.

{{% expand "Solution" %}}
```cpp
while (true)
{
    int number = 0;
    std::cin >> number;
    std::cout << "Craow " << number << "!" << std::endl;
}
```
{{% /expand %}}

Afin de pouvoir terminer le programme un peu plus proprement qu'avec Ctrl+C, ajoutez une condition pour sortir de la boucle si le nombre entré est -1. Cela se fait de la même manière qu'en C.

{{% expand "Solution" %}}
```cpp
while (true)
{
    int number = 0;
    std::cin >> number;
    std::cout << "Craow " << number << "!" << std::endl;

    if (number == -1)
    {
        break;
    }
}
```
{{% /expand %}}

Essayez de remplacer votre `while` par une boucle `do ... while`, de manière à supprimer le `if`.

{{% expand "Solution" %}}
```cpp
int number = 0;

do
{
    std::cin >> number;
    std::cout << "Craow " << number << "!" << std::endl;
}
while (number != -1);
```
{{% /expand %}}

Supposons maintenant que notre perroquet a une durée de vie de 10 allocutions. Remplacez le `do ... while` par une boucle `for` de dix itérations.

{{% expand "Solution" %}}
```cpp
for (int i = 0; i < 10; ++i)
{
    int number = 0;
    std::cin >> number;
    std::cout << "Craow " << number << "!" << std::endl;
}
```
{{% /expand %}}

{{% notice tip %}}
En C++, il est tout à fait valide et même conseillé de définir son itérateur directement dans l'instruction `for`. Cela permet de limiter le **scope** de la variable à la boucle dans laquelle elle est définie.\
On écrira donc `for (int i = 0; i < 10; ++ i) { ... }` plutôt que `int i; for (i = 0; i < 10; ++i) { ... }`.
{{% /notice %}}

---

### Les chaînes de caractères

Jusqu'ici, notre perroquet ne sait dire que "Craow" et comptez. D'ailleurs, si vous lui dites autre chose qu'un nombre, il a tendance à s'étrangler. \
Nous allons donc lui apprendre à faire des vraies phrases.

La librairie standard du C++ définit la classe `std::string`. Cherchez quel header inclure pour pouvoir l'utiliser, et ajoutez-le à votre programmme. \
Remplacez ensuite votre variable `number` de type `int` par une variable `word` de type `std::string`.

{{% expand "Solution" %}}
```cpp
for (int i = 0; i < 10; ++i)
{
    std::string word;
    std::cin >> word;
    std::cout << "Craow " << word << "!" << std::endl;
}
```
{{% /expand %}}

{{% notice tip %}}
Vous n'avez pas besoin ici d'initialiser `word` en écrivant `= ""`. En effet, `std::string` est une classe, et par défaut, les instances de cette classe sont déjà initialisées avec la chaîne vide.
{{% /notice %}}

---

### Omettre `std`

Vous en avez marre de devoir écrire `std::` partout ? Il est possible de ne pas avoir à le faire en écrivant l'instruction suivante juste après vos includes dans le cpp, ou alors dans le corps d'une fonction :
```cpp
using namespace std;
```

Placez cette instruction au début de votre fonction `main`, retirez tous les `std::` devant les symboles de la librairie standard et vérifiez que votre programme compile toujours.

{{% expand "Solution" %}}
```cpp
using namespace std; 

for (int i = 0; i < 10; ++i)
{
    string word;
    cin >> word;
    cout << "Craow " << word << "!" << endl;
}
```
{{% /expand %}}

{{% notice info %}}
Lorsqu'on utilise `using namespace` dans un bloc d'instructions (fonction, boucle, condition, etc), il faut savoir que son effet est limité à ce bloc.\
Autre point important, il faut éviter d'utiliser des `using namespace` à l'intérieur de headers. Comme vous le savez peut-être, lorsque l'on fait un include depuis un .cpp, le fichier inclu est en fait copié-collé dedans. Si on inclut un fichier qui réalise un `using namespace`, puis que l'on inclut au autre header derrière (librairie standard par exemple), le `using namespace` du premier header risque d'impacter le code du second header...

{{% /notice %}}
