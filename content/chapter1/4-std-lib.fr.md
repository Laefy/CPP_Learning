---
title: "Librairie standard 📚"
weight: 4
---

Sur cette page, vous allez apprendre à utiliser quelques classes fournies par la librarie standard pour manipuler chaînes de caractères et tableaux.
Vous verrez également comment écrire ou lire dans des flux pour intéragir avec l'utilisateur.

---

### Chaînes de caractères

Comme en C, `const char*` est le type fondamental associé à une chaîne de caractères littérale (c'est-à-dire écrite en dur, avec les guillemets autour) :
```cpp
auto str = "hello"; // -> str est de type const char*
```

Cependant, ce n'est pas du tout pratique pour faire des opérations comme des concaténations, des recherches, ou même simplement récupérer la taille de la chaîne.

Pour pouvoir faire ce genre de choses facilement, on utilise la classe `std::string` définie dans le header `<string>`.
```cpp
// Ex: on concatène les arguments passés au programme, puis on affiche le nombre total de lettres

#include <iostream>
#include <string>

int main(int argc, char** argv)
{
    // On crée une chaîne vide (par défaut, les std::string prennent la valeur "")
    std::string word;

    for (auto i = 1; i < argc; ++i)
    {
        // On construit une std::string à partir de argv[i] et on le concatène à word
        word += std::string { argv[i] };
    }

    std::cout << "Word " << word << " contains " << word.length() << " letters" << std::endl;
    return 0;
}
```

{{% notice warning %}}
Attention à bien caster vos chaînes littérales en `std::string` avant de commencer à les utiliser.  
Certaines opérations comme l'addition compileront sur le type `const char*`, mais vous n'obtiendrez pas le résultat attendu : `std::cout << ("abc" + "def") << std::endl` n'affichera pas du tout `"abcdef"`.
{{% /notice %}}

---

### Tableaux dynamiques

Pour manipuler des tableaux dynamiques, on utilise la classe `std::vector<...>`, définie dans le header `<vector>`.  
Lorsque vous créez un `vector`, le type de données que vous souhaitez stocker dans votre tableau est à indiquer entre les chevrons.  
Par exemple, `std::vector<int>` est un tableau d'entiers et `std::vector<std::string>` un tableau de chaînes de caractères.

Voici du code illustrant comment instancier des `vector`, ajouter des éléments dedans et y accéder :
```cpp
#include <iostream>
#include <vector>

int main()
{
    // On crée un vector de booléens vide
    auto are_evens = std::vector<bool> {};

    // On crée un vector d'entiers contenant différents nombres
    auto numbers = std::vector<int> { 1, 23, 38, -54 };   

    // On parcourt le tableau d'entiers avec une boucle for-each
    for (auto n: numbers)
    {
        // On indique dans le tableau de booléens si le nombre est pair
        auto is_even = (n % 2) == 0;
        are_evens.emplace_back(is_even);
    }

    // On parcourt maintenant les tableaux avec une boucle for classique
    for (auto idx = 0; idx < numbers.size(); ++idx)
    {
        std::cout << "Number " << numbers[idx] << " is " << (are_evens[idx] ? "even" : "odd") << std::endl;
    }

    return 0;
}
```

---

### Flux d'entrée et de sortie

Comme vous le savez déjà, `std::cout` est le flux permettant d'écrire dans la sortie standard du programme et on utilise `std::cout << expr` pour afficher `expr` dedans.
Afin d'écrire dans la sortie d'erreurs, on remplace `std::cout` par `std::cerr`.

Pour ce qui est de lire dans l'entrée standard, on utilise `std::cin >> var` où `var` est la variable qui reçoit la donnée à extraire du flux.
C'est donc assez similaire à l'écriture, si ce n'est qu'on utilise l'opérateur `>>` au lieu de `<<`.

En plus des flux standards, vous pouvez écrire ou lire depuis des fichiers en utilisant la classe `std::fstream` du header `<fstream>`.  
```cpp
// Ex1 : ouvre le fichier 'text.txt' et lit son contenu pour l'afficher

auto file = std::fstream { "text.txt" };

// On vérifie que le fichier existe et a pu être ouvert
if (file)
{
    std::string text;

    // On vérifie si on a atteint la fin du fichier
    while (!file.eof()) 
    {
        // On lit le prochain "mot" du fichier
        file >> text;
        std::cout << text << std::endl;
    }
}
else
{
    std::cerr << "Unable to open text.txt" << std::endl;
}

// Ex2 : ouvre le fichier 'report.txt' en écriture et écrit une phrase dedans

auto report = std::fstream { "report.txt", std::fstream::out };
report << "Operation done!" << std::endl;
```

{{% notice note %}}
Le second paramètre du constructeur de `fstream` est le mode d'ouverture.
Par défaut, le fichier est ouvert en lecture et en écriture.  
Dans le cas d'une ouverture en écriture seule, le fichier est créé automatiquement s'il n'existe pas.
{{% /notice %}}

Pour construire une chaîne de caractères, vous pouvez concaténer des `std::string` entre elles, mais cela n'est pas toujours très efficace.
La librairie standard propose donc la classe `std::stringstream` dans le header `<sstream>`.
C'est un peu l'équivalent du `StringBuilder` de Java.
```cpp
std::stringstream builder;
builder << "J'aime ajouter des ints comme " << 1 << std::endl;
builder << "Et aussi des bools " << false;
builder << " ou " << true << " ou plein d'autres trucs" << std::endl;

std::string final_string = builder.str(); // on récupère le résultat avec str()
```

---

### Un peu de pratique

Vous allez maintenant implémenter un perroquet, qui répète tout ce que vous dites dans la console.  
Par exemple, si vous entrez les phrases :
> Coucou  
> Ca va ?

Le programme devra écrire :
> Craow Coucou  
> Craow Ca va ?

1. Ouvrez le fichier `chap-01/2-parrot.cpp` dans VSCode.  
Vérifiez qu'il compile et qu'il affiche `"Craow"` lorsque vous le lancez.

{{% hidden-solution %}}
Pour compiler, on peut ouvrir le terminal VSCode et écrire : `g++ -std=c++17 -o parrot 2-parrot.cpp` après s'être placé dans le bon répertoire avec `cd`.
{{% /hidden-solution %}}

2. Utilisez la fonction `std::getline` pour récupérer la ligne de texte entrée par l'utilisateur et affichez-la dans la console.

{{% hidden-solution %}}
D'après l'exemple dans la [documentation](https://en.cppreference.com/w/cpp/string/basic_string/getline) de `getline`, on peut lui passer le flux d'entrée et la chaîne de caractères dans laquelle stocker le résultat.  
Pour utiliser `std::string` et `std::getline`, on doit penser à inclure le header `<string>`.

```cpp
#include <iostream> // pour std::cout et std::cin
#include <string>   // pour std::string et std::getline

int main()
{
    std::string line;
    std::getline(std::cin, line);
    std::cout << line << std::endl;

    return 0;
}
```
{{% /hidden-solution %}}

3. Ajoutez une boucle au programme de manière à ce que le programme répète les phrases de l'utilisateur, précédées de `"Craow"`, jusqu'à ce qu'il entre une ligne vide.

{{% hidden-solution %}}
Si l'utilisateur n'a rien écrit, alors la chaîne renvoyée par `getline` est vide.
On peut vérifier cette condition pour s'échapper d'une boucle infinie avec `break`.  

```cpp
#include <iostream> // pour std::cout et std::cin
#include <string>   // pour std::string et std::getline

int main()
{
    std::string line;

    while (true)
    {
        std::getline(std::cin, line);
        if (line.empty())
        {
            break;
        }

        std::cout << "Craow " << line << std::endl;
    }

    return 0;
}
```

Notez que ce n'est pas la seule solution possible.
{{% /hidden-solution %}}

4. Vous allez maintenant stocker l'intégralité des phrases de l'utilisateur dans un tableau.  
Ce n'est qu'après que l'utilisateur ait entré une ligne vide que le perroquet répétera chacune des phrases.

{{% hidden-solution %}}
Pour manipuler des tableaux, on utilise la classe `std::vector` disponible dans `<vector>`.

On a alors plusieurs possibilités : récupérer la ligne dans une nouvelle variable puis l'ajouter au tableau après avoir vérifié qu'elle n'est pas vide, ou bien ajouter la nouvelle ligne dans le tableau et la retirer ensuite si elle est vide.

Une fois le tableau rempli, on peut utiliser une boucle `for-each` pour le parcourir et afficher les phrases du perroquet.

```cpp
#include <iostream> // pour std::cout et std::cin
#include <string>   // pour std::string et std::getline
#include <vector>   // pour std::vector

int main()
{
    std::vector<std::string> lines;

    do
    {
        std::string line;
        std::getline(std::cin, line);
        lines.emplace_back(line);
    }
    while (!lines.back().empty());

    lines.pop_back();

    for (auto line: lines)
    {
        std::cout << "Craow " << line << std::endl;
    }

    return 0;
}
```

{{% notice info %}}
Pensez-bien à compiler avec `-std=c++17`. Sinon, la solution ci-dessus ne pourra pas compiler.
{{% /notice %}}

{{% /hidden-solution %}}

5. Supprimez maintenant votre tableau de `string` et utilisez à la place un `stringstream` pour stocker le résultat à afficher à la fin.

{{% hidden-solution %}}
La classe `std::stringstream` est disponible dans `<sstream>`.  
On construit chaque ligne du perroquet à l'intérieur de la boucle, et on affiche la chaîne finale en utilisant la fonction-membre `str()`.

```cpp
#include <iostream> // pour std::cout et std::cin
#include <sstream>  // pour std::stringstream
#include <string>   // pour std::string et std::getline

int main()
{
    std::stringstream lines;

    while (true)
    {
        std::string line;
        std::getline(std::cin, line);

        if (line.empty())
        {
            break;
        }

        lines << "Craow " << line << std::endl;
    }

    std::cout << lines.str();
    return 0;
}
```
{{% /hidden-solution %}}