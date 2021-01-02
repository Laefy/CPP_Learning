---
title: "Tableau Numérique"
weight: 3
---

Le but de cet exercice est de voir comment manipuler les tableaux en C++ et passer des arguments au programme. Votre objectif sera d'afficher un tableau de nombres, dont la taille sera définie par les paramètres passés au programme. 

---

Pour cet exercice, vous modifierez le fichier :\
\- `chap-01/3-array.cpp`

La cible à compiler est `c1-3-array`.

---

### Tableau statique

Le code initial de l'exercice vous est fourni. Le voici :
```cpp
#include <iostream>

int main()
{
    int array[] = { 0, 1, 2, 3 };

    for (int i = 0; i < 4; ++i)
    {
        std::cout << array[i] << std::endl;
    }

    return 0;
}
```

Ce programme permet d'instancier un tableau d'entiers contenant les valeurs 0, 1, 2 et 3, et d'afficher ses valeurs. La taille du tableau n'étant pas spécifié dans les crochets `[]`, elle est déduite automatiquement à partir du nombre de valeurs fournies dans les accolades `{}`. Ce qui n'est pas très élégant ici, c'est que l'on doit fournir cette taille dans la boucle juste en dessous. Si on ajoute une nouvelle valeur dans les accolades ou que l'on en retire une, il faut donc penser à mettre à jour la condition d'arrêt de la boucle.

Pour ne plus avoir ce problème, vous allez remplacer votre boucle `for`, par une boucle **foreach**. La syntaxe est similaire au Java :
```cpp
for (int value : values)
```

Effectuez le changement et les modifications associées, et testez que votre programme fonctionne toujours.

{{% expand "Solution" %}}
```cpp
for (int value : array)
{
    std::cout << value << std::endl;
}
```
{{% /expand %}}

{{% notice info %}}
Il est possible d'utiliser une boucle foreach uniquement sur un tableau statique seulement s'il est déclaré dans la même fonction que votre boucle. Nous verrons dans le [Chapitre 3](/chapter3/) une autre manière de définir des tableaux statiques, qui permet de les manipuler plus facilement que les tableaux statiques 'primitifs'. 
{{% /notice %}}

Vous souhaiteriez maintenant avoir dans votre tableau les nombres de 1 à 50. Mais vous n'avez pas très envie d'écrire cette suite à la main dans les accolades. Vous allez donc utiliser les crochets `[]` pour spécifiez la nouvelle taille du tableau, ainsi qu'une boucle `for` pour intialiser votre tableau. N'oubliez pas de définir votre tableau avec `= {}`. Cela permettra de remplir dans un premier temps le tableau de 0, plutôt que de valeurs aléatoires. Vérifiez que vous obtenez les bonnes valeurs dans la sortie du programme.

{{% expand "Solution" %}}
```cpp
int array[50] = {};

for (int i = 0; i < 50; ++i)
{
    // Array indices start at 0, so we need to use (i+1) if we want the series to start at 1.
    array[i] = i+1;
}
```
{{% /expand %}}

---

### Passage d'arguments au programme

Nous souhaiterions maintenant avoir un tableau de taille variable, donc la taille serait spécifiée en utilisant le premier argument du programme.
Pour cela, nous allons modifier la **signature** de la fonction `main` par :
```cpp
int main(int argc, char** argv)
```

{{% notice tip %}}
`argc` signifie 'arguments count', et `argv` 'arguments values'. Il n'est pas nécessaire de les nommer de cette façon, mais par convention, c'est plus propre de le faire.
{{% /notice %}}

Si l'argument n'est pas fourni, affichez un message d'erreur en écrivant dans `std::cerr` et sortez du programme avec le code d'erreur -1. Sinon, affichez le contenu de l'argument. Vous pouvez commenter le restant du code avec le tableau, en utilisant `/* code */` ou bien `// code` sur chaque ligne.

Afin de tester votre programme, vous pouvez soit le lancer depuis un terminal (le programme devrait être généré dans le dossier `build/chap-01/{config}/c1-3-array)`), ou bien générer un nouveau fichier `launch.json` depuis VSCode et modifier son contenu pour y passer l'argument de votre choix.

{{% expand "Solution" %}}
```cpp
int main(int argc, char** argv)
{
    // First argument is always the command name used to launch the program.
    if (argc < 2)
    {
        std::cerr << "Expected argument for array size." << std::endl;
        return -1;
    }

    std::cout << argv[1] << std::endl;

    // Commented
    // code
    // ...

    return 0;
}
```
{{% /expand %}}

---

### Conversion d'une chaîne en entier

Nous pouvons bien récupérer la taille attendue pour le tableau, mais hélas, il s'agit d'une chaîne de caractères, et non d'un entier.
Recherchez sur Internet s'il n'existe pas une fonction dans la librairie standard permettant de réaliser cette conversion, et utilisez-la pour récupérer cette valeur dans une variable `length`. 

{{% expand "Solution" %}}
Vous pouvez utiliser la fonction `std::stoi` (définie dans `<string>`) ou éventuellement la fonction C `std::atoi` (définie dans `<cstdlib>`).
```cpp
int length = std::stoi(argv[1]);
if (length <= 0)
{
    std::cerr << "Expected strictly positive value for array size." << std::endl;
    return -1;
}

std::cout << length << std::endl;
```

{{% notice note %}}
Si vous utilisez `std::stoi` et que la chaîne fournie ne commence pas par un entier, le programme va lever une exception. Nous verrons comment traiter les exceptions au [Chapitre 7](/chapter7/).
{{% /notice %}}

{{% /expand %}}

---

### Allocation de tableau dynamique

Vous pouvez maintenant décommenter le code pour le tableau, que vous allez modifier afin d'allouer un tableau dynamique.

Pour allouer de la mémoire en C++, nous allons utiliser l'opérateur `new`. Et pour la libérer, nous utiliserons `delete`. Afin d'allouer une variable de type `int` (que l'on oubliera pas de libérer) ayant pour valeur 4, on utilisera le code suivant :
```cpp
int* value = new int(4);
std::cout << "Value is " << *value << std::endl;
delete value;
``` 

C'est bien tout ça, mais nous, ce qu'on aimerait, c'est un tableau. La syntaxe que nous venons de voir ne permet pas de spécifier le nombre de blocs à allouer pour le tableau. Dans notre cas, il faut en réalité utiliser les operator `new[]` et `delete[]`. Si on veut allouer un tableau de 4 entiers allant de 0 à 3, on utilisera donc :
```cpp
int* values = new int[4] { 0, 1, 2, 3 };
std::cout << "Values are " << values[0] << ", " << values[1] << ", " << values[2] << ", " << values[3] << std::endl;
delete[] values;
```

{{% notice info %}}
Notez bien le fait que l'on utilise des crochets vides sur le `delete`. Si vous les oubliez, le programme risque de râler.\
Pensez aussi à mettre des accolades vides derrière le `new int[size]` si vous ne souhaitez pas spécifier de valeurs, afin d'avoir des 0 dans le tableau, plutôt que des valeurs aléatoires.
{{% /notice %}}

Utilisez les opérateurs `new[]` et `delete[]` et faites les modifications appropriées afin d'allouer un tableau de la taille attendue, plutôt qu'un tableau de taille statique.

{{% expand "Solution" %}}
```cpp
int* array = new int[length] {};

for (int i = 0; i < length; ++i)
{
    array[i] = i+1;
}

for (int value : array)
{
    std::cout << value << std::endl;
}

delete[] array;
```
{{% /expand %}}

Essayez maintenant de compiler. Vous devriez avoir une erreur de ce style au niveau de votre boucle foreach :
```b
error blabla: 'begin': no matching overloaded function found
```

Eh oui, les boucles foreach ne fonctionnent pas avec les tableaux dynamiques. Vous devez donc la remplacez par une boucle `for` classique. 
{{% expand "Solution" %}}
```cpp
for (int i = 0; i < length; ++i)
{
    std::cout << array[i] << std::endl;
}
```
{{% /expand %}}

---

### std::vector

Afin de pouvoir manipuler des tableaux plus simplement, la librairie standard définit la classe `std::vector`. Vous n'aurez ainsi plus à vous préoccuper de libérer la mémoire, à initialiser des valeurs qui seront de toute manière écrasées, et vous pourrez réutiliser des boucles foreach.

Pour définir un `std::vector` initialement vide qui contiendra des entiers, on utilise l'instruction suivante :
```cpp
std::vector<int> array;
```

Pour ajouter de nouvelles valeurs à ce tableau (par exemple, 8, 5 et -3), on utilise la **fonction membre** `emplace_back`. Pour accéder à une fonction membre en C++, on utilise la même syntaxe que pour accéder à une méthode en Java :
```cpp
array.emplace_back(8);
array.emplace_back(5);
array.emplace_back(-3);
```

Modifiez votre code de façon à utiliser un `std::vector` plutôt qu'un tableau alloué manuellement, retransformer votre boucle pour l'affichage en boucle foreach et testez que tout fonctionne correctement.
{{% expand "Solution" %}}
Commencez par inclure le header `<vector>`.
Dans votre fonction, vous devriez avoir le code suivant.
```cpp
std::vector<int> array;

for (int i = 0; i < length; ++i)
{
    array.emplace_back(i+1);
}

for (int value : array)
{
    std::cout << value << std::endl;
}
```
{{% /expand %}}
