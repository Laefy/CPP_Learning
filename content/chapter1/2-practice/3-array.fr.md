---
title: "🔢 Tableau Numérique"
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

Afin de tester le passage d'arguments à votre programme, vous avez 2 possibilités :
1. Vous pouvez le lancer depuis un terminal.
L'exécutable devrait avoir été généré quelque part dans le dossier `build/chap-01/`.
```b
## Unix
./build/chap-01/c1-3-array arg1 arg2

## Windows
./build/chap-01/c1-3-array.exe arg1 arg2
```
2. Vous pouvez générer un fichier `launch.json` depuis VSCode.\
Pour cela, allez dans le menu `Run` et sélectionnez `Add Configuration...`.
Si VSCode vous propose plusieurs options, choisissez 'C++ (GDB/LLDB)'.\
Enfin, modifiez les champs `"program"` et `"args"` dans le fichier qui vient de s'ouvrir :
```json
"program": "${command:cmake.launchTargetPath}", // copiez-collez la ligne telle quelle
"args": ["voici", "3", "arguments"],            // fournissez les arguments de votre choix ici
```
\
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

### Tableau dynamique

Vous pouvez maintenant décommenter le code de manipulation du tableau, que vous allez transformer en tableau dynamique.
La classe proposée par la librairie standard pour définir ce type de conteneur est `std::vector`.

Afin de générer un `std::vector` initialement vide qui contiendra des entiers, on utilise l'instruction suivante :
```cpp
std::vector<int> array;
```

Pour ajouter de nouvelles valeurs à ce tableau (par exemple, 8, 5 et -3), on utilise la **fonction membre** `emplace_back`. Pour accéder à une fonction membre en C++, on utilise la même syntaxe que pour accéder à une méthode en Java :
```cpp
array.emplace_back(8);
array.emplace_back(5);
array.emplace_back(-3);
```

Modifiez votre code de façon à utiliser un `std::vector` plutôt que le tableau de taille statique et testez que tout fonctionne correctement.

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
