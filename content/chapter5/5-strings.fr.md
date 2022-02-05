---
title: "Manipulation de chaînes"
weight: 5
---

Dans cette partie, nous reviendrons sur les fonctions fournies par la librairie permettant de manipuler des `string`. Vous apprendrez aussi ce que sont les `string_view` et à quoi elles servent.

---

Pour cet exercice, vous modifierez le fichier :\
\- `chap-05/4-strings.cpp`

La cible à compiler est `c5-4-strings`.

---

### Opérations standards

Parmis les opérations standards que l'on peut effectuer sur des chaînes de caractère, on retrouve :
- la concaténation,
- l'extration de sous-chaîne,
- la recherche de caractère ou de sous-chaîne,
- la comparaison,
- le remplacement d'une partie de la chaîne.

Recherchez dans la documentation les fonctions qui permettent d'effectuer les opérations ci-dessus.

{{% expand "Solution" %}}
- concaténation -> `operator+` : `auto str_3 = str1 + str2;`
- extration de sous-chaîne -> `substr` : `auto str_me = std::string { "find me" }.substr(5, 2);`
- recherche -> `find` : `auto pos = str.find("abc");`
- comparaison -> `operator==` : `auto are_equal = (str1 == str2);`
- remplacement -> `replace` : `std::string { "this is old" }.replace(8, 3, "new");`
{{% /expand %}}

---

### Conversions

Quelle fonction permet de convertir des valeurs numériques en chaînes de caractères ?
{{% expand "Solution" %}}
Il s'agit de `std::to_string`.
{{% /expand %}}

Quelles fonctions permettent maintenant de faire l'inverse ? Que se passe-t-il si la chaîne de caractères ne contient pas vraiment une valeur du type attendu ?
{{% expand "Solution" %}}
Il s'agit des fonctions `std::stoi` (string to int), `std::stol` (string to long), `std::stof` (string to float), etc.\
Si la chaîne ne contient pas réellement un nombre, alors, la fonction lance une exception de type `std::invalid_argument`.
{{% /expand %}}

---

### Passage de chaînes

Pour passer une chaînes de caractères à une fonction, et sachant que cette fonction ne la modifie pas, vous aviez jusqu'ici deux options possibles (ou en tout cas, deux options pas trop nulles) :
```cpp
// Passage par const char*.
void print_str(const char* str);

// Passage par const std::string&.
void print_str(const std::string& str);
```

Dans le premier cas, on manipule un pointeur. Et comme vous le savez maintenant, les pointeurs, ce n'est pas ce qui est le plus sécurisé pour passer de l'information à une fonction. L'utilisateur peut notamment passer `nullptr` alors que l'implémentation de la fonction peut ne pas le prévoir. De plus, les `const char*` ne sont pas aussi facilement manipulables que les `string` (comparaison ne marche pas avec `==`, pas de concaténation, etc).

Du coup, on pourrait se dire qu'il vaut mieux tout le temps passer par des `const std::string&`. Le problème, c'est qu'il y a des situations où le passage par `string` n'est pas souhaitable. Voici un exemple de ce genre de cas :
```cpp
#include <iostream>

void print_in_console(const std::string& str)
{
    std::cout << str << std::endl;
}

int main()
{
    print_in_console("print me");
    return 0;
}
```

Dans le code ci-dessus, on fournit à la fonction une chaîne litérale. Au moment du passage à `print_in_console`, une conversion `const char*` vers `string` est réalisée, ce qui déclenche une allocation dynamique. Et comme vous le savez déjà, les allocations dynamiques sont des opérations coûteuses, qu'il vaut mieux éviter de faire si elles ne sont pas nécessaires. Dans ce cas particulier, le programme serait donc (un tout petit peu) plus efficace si la fonction `print_in_console` avait pris un `const char*` plutôt qu'une `std::string`.

Pour ne pas avoir à choisir entre sécurité et performances, le type `string_view` a été introduit avec C++17 dans la librairie standard.

**Qu'est-ce qu'une `string_view` ?**\
Il s'agit d'une toute petite classe qui ne contient que deux membres : un pointeur sur une chaîne de caractère et la taille de cette chaîne. Cette classe permet donc de référencer une chaîne de caractère existante (qu'il s'agisse d'une `string` ou d'un `const char*`) sans allouer de mémoire supplémentaire. Enfin, elle dispose d'un certain nombre de fonctions permettant de simplifier sa manipulation (`substr`, `find`, `contains`, etc). 

{{% notice warning %}}
Attention, lorsqu'on utilise des `string_view`, il faut faire attention à la durée de vie de la chaîne sur laquelle elle pointe.
Si une `string` référencée par une `string_view` est détruite, et que l'on essaye d'utiliser la `string_view` ensuite, on se retrouve avec une dangling references.
{{% /notice %}}

Modifiez la signature de la fonction `print_in_console` de manière à utiliser une `string_view`. Comme `string_view` est une classe peu coûteuse à copier, il est préférable de la passer par valeur plutôt que référence.

{{% expand "Solution" %}}
```cpp
#include <iostream>

void print_in_console(std::string_view str)
{
    std::cout << str << std::endl;
}

int main()
{
    print_in_console("print me");
    return 0;
}
```
{{% /expand %}}


