---
title: "Déplacement"
weight: 4
---

Nous avons vu précédement que les `unique_ptr` ne pouvaient pas être copiés.
Cependant, le `vector` a réussi à provoquer leur "déplacement" en mémoire pour effectuer sa réallocation.\
Nous allons voir comment faire de même afin de pouvoir manipuler les `unique_ptr` avec un peu plus de souplesse.

---

### Construction sur place

Lorsqu'une fonction retourne un objet et que celui-ci est utilisé pour initialiser une variable, aucune copie n'a lieu.
L'objet est directement construit à l'adresse mémoire qui lui était réservée dans le code appelant.

Vous pouvez vérifier en exécutant le programme `c3-4-inplace` :
```cpp
#include <iostream>

struct Test
{
    Test(int v)
        : value { v }
    {
        std::cout << "Constructor was called with " << v << "." << std::endl;
    }

    Test(const Test& other)
        : value { other.value }
    {
        std::cout << "Copy constructor was called." << std::endl;
    }

    int value = 0;
};

Test create_test(int value)
{
    Test result { value };
    return result;
}

int main()
{
    Test test = create_test(3);
    std::cout << test.value << std::endl;

    return 0;
}
```

Comme vous pouvez le constater, seul le constructeur à 1 paramètre est appelé.
La première ligne du `main` ne nécessite donc pas la présence du constructeur de copie.

{{% notice note %}}
Veuillez noter que ce n'est qu'à partir de C++17 que le standard garantit qu'aucune construction supplémentaire n'a lieu dans ce genre de cas.\
Avant, il s'agissait d'une optimisation que certains compilateurs fournissait sous le nom de **copy-elision**.\
Désormais, les compilateurs doivent l'implémenter et on parle de **mandatory copy-elision**. 
{{% /notice %}}

Vous pouvez également essayer d'enchaîner les appels, il n'y aura pas de copie :
```cpp
Test create_test(int value)
{
    Test result { value };
    return result;
}

Test create_test_double(int value)
{
    Test result = create_test(2 * value);
    return result;
}

int main()
{
    Test test = create_test_double(3);          // -> pas de copie non plus
    std::cout << test.value << std::endl;

    return 0;
}
```

Cela s'applique également si vous essayez d'imbriquer directement des appels au constructeur de copie :
```cpp
int main()
{
    Test test = Test { Test { Test { 3 } } };   // -> toujours aucune copie
    std::cout << test.value << std::endl;

    return 0;
}
```

En ce qui concerne l'initialisation des `unique_ptr` avec `make_unique`, c'est exactement le même principe.\
Bien que le `unique_ptr` ne puisse pas être copié, il est valide d'écrire le code ci-dessous, puisqu'aucune copie n'a lieu :
```cpp
std::unique_ptr<int> ptr = std::make_unique<int>(3);
```

Il est également valide de définir soi-même une fonction qui renvoie un `unique_ptr` et d'assigner le résultat à une variable :
```cpp
#include <memory>

std::unique_ptr<int> dynamic_add(int a, int b)
{
    std::unique_ptr<int> result = std::make_unique<int>(a + b);
    return result;
}

int main()
{
    std::unique_ptr<int> sum = dynamic_add(8, 12);
    std::cout << *sum << std::endl;

    return 0;
}
```

---

### Déplacement

La copy-elision, c'est bien, mais cela reste un peu limité pour manipuler aisément les `unique_ptr`...

Par exemple, il n'est toujours pas possible d'écrire directement :
```cpp
std::vector<std::unique_ptr<int>> many_ints;

std::unique_ptr<int> value = std::make_unique<int>(3);
many_ints.emplace_back(value); // -> tentative de copie
```

On est obligé d'imbriquer les appels, ce qui n'est pas toujours très facile à lire :
```cpp
std::vector<std::unique_ptr<int>> many_ints;
many_ints.emplace_back(std::make_unique<int>(3)); // -> ok, mais ça fait beaucoup de parenthèses à lire...
```

Nous allons donc vous montrez comment déplacer un `unique_ptr`.\
Cela se fait en utilisant la fonction `std::move`, contenu dans le header `<utility>` :
```cpp
std::vector<std::unique_ptr<int>> many_ints;

std::unique_ptr<int> value = std::make_unique<int>(3);
many_ints.emplace_back(std::move(value)); // -> ça fonctionne !
```

Dans le code ci-dessus, le `unique_ptr` n'a pas été copié.
Il a été déplacé à l'intérieur du tableau `many_ints`.
Pour vous en convaincre, testez le code suivant :
```cpp
#include <iostream>
#include <memory>
#include <utility>
#include <vector>

int main()
{
    std::vector<std::unique_ptr<int>> many_ints;

    auto value = std::make_unique<int>(3);

    if (value != nullptr)
    {
        std::cout << "value is " << *value << std::endl;
    }
    else
    {
        std::cout << "value is empty" << std::endl;
    }

    many_ints.emplace_back(std::move(value));
    
    if (value != nullptr)
    {
        std::cout << "value is " << *value << std::endl;
    }
    else
    {
        std::cout << "value is empty" << std::endl;
    }

    if (many_ints[0] != nullptr)
    {
        std::cout << "many_ints[0] is " << *many_ints[0] << std::endl;
    }
    else
    {
        std::cout << "many_ints[0] is empty" << std::endl;
    }

    return 0;
}
```

Comme vous pouvez le voir, une fois le `emplace_back` exécuté, le contenu de `value` a été transféré dans `many_ints[0]`.\
`value` est désormais vide, ce qui signifie bien qu'il n'y a pas eu de copie.

Il est donc possible de transférer des données d'une variable à une autre en utilisant `std::move`.\
Remplacez les `unique_ptr<int>` par des `string` et adaptez le restant du programme pour vérifier que les `string` peuvent également être déplacées.

{{% expand "Solution" %}}
Attention à bien spécifier que l'on construit une `std::string` et pas un `const char*` en remplaçant le `auto` ou bien en écrivant le type à droite du `=`.
```cpp
#include <iostream>
#include <string>
#include <utility>
#include <vector>

int main()
{
    std::vector<std::string> many_strings;

    std::string value = "will I move?";
    // auto value = std::string { "will I move?" };

    std::cout << "value is '" << value << "'" << std::endl;

    many_strings.emplace_back(std::move(value));
    
    std::cout << "value is '" << value << "'" << std::endl;
    std::cout << "many_strings[0] is '" << many_strings[0] << "'" << std::endl;

    return 0;
}
```
{{% /expand %}}

---

### Un peu de pratique

Entraînez-vous maintenant à déplacer des `unique_ptr` en écrivant un petit programme qui :
1. initialise deux variables `i1` et `i2` de type `std::unique_ptr<int>` avec `make_unique`,
2. transfère `i1` à une fonction `passthrough` qui attend un `std::unique_ptr<int>` (sans référence),
3. le paramètre de `passthrough` est ensuite déplacé dans une variable locale,
4. cette variable est renvoyée par la fonction,
5. ce résultat est ensuite réassigné à `i2`.

Pour vérifier ce qu'il se passe au cours de l'exécution du programme, vous implémenterez également une fonction qui affiche le nom d'une variable et son contenu (si le pointeur n'est pas vide).
Voici sa signature :
```cpp
void display(const std::string& variable_name, const std::unique_ptr<int>& variable);
```
Il faudra que vous puissiez l'utiliser de cette manière :
```cpp
display("i1", i1); // -> affiche "i1 contains X" ou "i1 is empty"
```

{{% expand "Solution" %}}
```cpp
#include <iostream>
#include <memory>
#include <utility>

void display(const std::string& variable_name, const std::unique_ptr<int>& variable)
{
    if (variable)
    {
        std::cout << variable_name << " contains " << *variable << std::endl;
    }
    else
    {
        std::cout << variable_name << " is empty" << std::endl;
    }
}

std::unique_ptr<int> passthrough(std::unique_ptr<int> ptr)
{
    std::cout << "Before move in passthrough" << std::endl;
    display("ptr", ptr);
    std::cout << "--------------------------" << std::endl;

    auto moved_ptr = std::move(ptr);

    std::cout << "After move in passthrough" << std::endl;
    display("moved_ptr", moved_ptr);
    display("ptr", ptr);
    std::cout << "--------------------------" << std::endl;

    return moved_ptr;
}

int main()
{
    auto i1 = std::make_unique<int>(3);
    auto i2 = std::make_unique<int>(8);

    std::cout << "Before passthrough call" << std::endl;
    display("i1", i1);
    display("i2", i2);
    std::cout << "--------------------------" << std::endl;

    i2 = passthrough(std::move(i1));

    std::cout << "After passthrough call" << std::endl;
    display("i1", i1);
    display("i2", i2);
    std::cout << "--------------------------" << std::endl;

    return 0;
}
```
La sortie du programme est la suivante :
```b
--------------------------
Before passthrough call
i1 contains 3
i2 contains 8
--------------------------
Before move in passthrough
ptr contains 3
--------------------------
After move in passthrough
moved_ptr contains 3
ptr is empty
--------------------------
After passthrough call
i1 is empty
i2 contains 3
--------------------------
```
{{% /expand %}}
