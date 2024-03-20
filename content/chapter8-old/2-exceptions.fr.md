---
title: "Exceptions"
weight: 2
---

---

### Qu'est-ce qu'une exception ?

En C++, une exception sert à interrompre le flot classique d'exécution du programme lorsqu'un événement particulier se produit.
Lorsqu'une exception est lancée, on sort du bloc courant, et on remonte la callstack autant que nécessaire, jusqu'à atteindre un bloc capable de traiter l'exception.

C'est donc un mécanisme extrêmement utilisé pour le traitement des erreurs (autant de programmation que d'utilisation), puisque l'erreur est remontée automatiquement jusqu'à l'endroit qui peut la traiter, sans avoir besoin de toucher au code des fonctions intermédiaires. 

```cpp
#include <stdexcept>

void AnimalCenter::adopt_dog(Someone& someone)
{
    if (!someone.like_dogs())
    {
        throw std::invalid_argument { "Les gens qui n'aiment pas les chiens n'ont rien à faire ici !" };
    }

    someone.receive(_dogs.front());
    _dogs.pop_front();
}

...

void AnimalCenter::update()
{
    while (auto* client = get_new_client())
    {
        try
        {
            _seller.process(*client);
        }
        catch (const std::invalid_argument& arg_error)
        {
            std::cout << "Seller: \"" << arg_error.what() << "\"" << std::endl; // => Seller: "Les gens qui n'aiment pas les chiens n'ont rien à faire ici !"
        }
    }
}
```

**Puisqu'il est possible de traiter des erreurs de programmation avec les exceptions, pourquoi utiliser des assertions ?**

1. Car jeter et attraper une exception, c'est relativement coûteux à faire, en comparaison de simplement vérifier une condition.
2. Les assertions peuvent être complètement désactivées en définissant la constante `NDEBUG`, et ce n'est pas le cas des exceptions.
3. Il arrive parfois que le système-cible de notre programme ne gère pas bien, voire pas du tout, les exceptions (c'est notamment le cas de certains systèmes embarqués).

---

### Utilisation des exceptions

##### std::exception

La classe `std::exception` (dans `<exception>`) est l'interface de base dont dérivent toutes les exceptions de la STL.
Elle comporte une fonction virtuelle `what()`, qui permet d'accéder au message d'erreur associé à l'exception.

```cpp
// Si `err` est une std::exception, on peut appeler `what()` pour récupérer le message d'erreur. 
std::cerr << err.what() << std::endl;
```

---

##### Throw

Pour lancer une exception, il suffit d'utiliser l'instruction `throw` :
```cpp
throw std::runtime_error { "Something wrong happened!" };
```

Notez qu'il n'est pas obligatoire de construire l'exception sur la ligne où elle est lancée :
```cpp
std::runtime_error err { "Something wrong happened!" }:
throw err;
```

La STL propose quelques classes d'exceptions génériques, qui font partie de `<stdexcept>` (et non pas `<exception>`) :
- `std::logic_error` : violation d'invariant ou de précondition (=> erreur de programmation)
- `std::invalid_argument` : l'un des arguments de la fonction n'est pas valide
- `std::runtime_error` : erreurs détectables uniquement à l'exécution (problème d'ouverture de fichier, mauvaise entrée de l'utilisateur, ...)
- ...

A la construction, chacune d'entre elle attend le message d'erreur qui sera retourné par l'appel à `what()`.
```cpp
// std::invalid_argument
std::pair<int, int> euclidian_division(int num, int den)
{
    if (den == 0)
    {
        throw std::invalid_argument { "The denominator is null." };
    }

    return std::pair { num / den, num % den };
}

// std::logic_error
class Square
{
public:
    void fcn1(...)
    {
        check_square();
        ...
    }

    void fcn2(...)
    {
        check_square();
        ...
    }

    ...

private:
    void check_square()
    {
        if (/* check if the segments length are not equal */)
        {
            std::string msg;
            msg += "This square is not a square anymore: ";
            msg += segments_to_string();

            throw std::logic_error { msg };
        }
    }

    ...
};

// std::runtime_error
std::string query_mail()
{
    std::string mail;
    std::getline(std::cin, mail); 

    if (mail.find('@') == std::string::npos)
    {
        std::string err;
        err += "\'";
        err += mail;
        err += "\' is not a valid email address.";

        throw std::runtime_error {  err };
    }

    return mail;
}
```

{{% notice warning %}}
Attention, il ne faut pas appeler du code susceptible de lancer une exception (instruction throw / fonction qui throw) depuis le destructeur d'une classe.
Cela peut générer des undefined behaviors.
{{% /notice %}}


---

##### Try-Catch

Pour attraper une erreur, il suffit de placer le code pouvant lancer une exception dans un bloc `try-catch`.
```cpp
try
{
    /* du code qui peut throw */
}
catch (const std::exception& err)
{
    /* traitement de l'exception */
}
```

{{% notice info %}}
Si vous lancez une exception polymorphe (c'est le cas de `std::exception` et des ses dérivés), il faut bien penser à l'attraper dans le `catch` par référence et non pas par copie.
{{% /notice %}}

Il est possible de placer plusieurs `catch` à la suite, pour traiter différemments des exceptions en fonction de leur type :
```cpp
try
{
    /* du code qui peut throw */
}
catch (const std::invalid_argument& err)
{
    std::cerr << "My bad: " << err.what() << std::endl;
}
catch (const std::logic_error& err)
{
    std::cerr << "Also my bad: " << err.what() << std::endl;
}
catch (const std::runtime_error& err)
{
    std::cerr << "This one is not my fault: " << err.what() << std::endl;
}
/* si c'est un autre type, alors l'exception continue de remonter la callstack */
```

Attention par contre à l'ordre dans lequel vous définissez les blocs `catch`.
En effet, le compilateur ne va pas aller chercher le bloc "le plus spécialisé" pour traiter une exception.
Il utilisera le premier qu'il trouve permettant de traiter l'exception donnée.
Si une relation d'héritage existe entre les types que vous souhaitez attrapés, il faut donc écrire les `catch` du type le plus dérivé au type le plus générique.   

```cpp
try
{
    // Comme std::invalid_argument est une sous-classe de std::logic_error
    // on va entrer dans le premier catch au lieu du deuxième.

    throw std::invalid_argument { "err" };
    // => "logic_error"
}
catch (const std::logic_error&)
{
    std::cerr << "logic_error" << std::endl;
}
catch (const std::invalid_argument& err)
{
    std::cerr << "invalid_argument" << err.what() << std::endl;
}
```

---

### Stack unwinding

Lorsque vous sortez d'un bloc (`if`, `else`, `for`, fonctions, etc.) dans lequel vous avez défini des variables, celles-ci sont automatiquement détruites (le destructeur est appelé, et la variable est retirée de la pile).
Dans le cas des exceptions, ce mécanisme s'applique également, et on parle de **stack unwinding**.

Lorsque vous allouez des ressources dans une fonction qui `throw`, il faut faire attention aux fuites de mémoire :
```cpp
void fcn(size_t count)
{
    auto* bad_c_array = new int[count] {};

    ...

    if (/* something bad */)
    {
        // Il faut penser à écrire `delete[] bad_c_array` ici,
        // sinon, on a une fuite de mémoire...
        delete[] bad_c_array;
        throw std::runtime_error { "Something went wrong!" };
    }

    ...

    delete[] bad_c_array;
}
```

Pensez donc bien à utiliser des classes RAII (conteneurs standards, smart pointers, etc), pour profiter du stack unwinding et ne pas avoir à vous soucier de libérer les ressources.
```cpp
void fcn(size_t count)
{
    std::vector<int> good_cpp_array(count);

    ...

    if (/* something bad */)
    {
        // std::vector::~vector sera automatiquement appelé grâce au stack unwinding, ce qui entraînera la
        // libération de son buffer alloué en interne.
        throw std::runtime_error { "Something went wrong!" };
    }

    ...
}
```

---

### Définir ses propres types d'exceptions

Si vous souhaitez définir un type particulier d'exception, vous pouvez hériter d'une des classes présentées sur [cette page](https://en.cppreference.com/w/cpp/header/stdexcept).
Chacune d'entre elle attend un message à sa construction, qui sera retourné en cas d'appel à `what()`.

```cpp
#include <stdexcept>

class DogLegsError : public std::out_of_range
{
public:
    DogLegsError(std::string_view name, size_t legs_count)
        : std::out_of_range { build_error_msg(name, legs_count) }
        , _name { name }
    {}

private:
    static std::string build_error_msg(std::string_view name, size_t legs_count)
    {
        using namespace std::string_literals;

        std::string msg;
        msg += "A dog has 4 legs at most. Ok, maybe 5 in some rare cases. ";
        msg += "But clearly, if you saw ";
        msg += name;
        msg += " with ";
        msg += std::to_string(legs_count);
        msg += " legs, then you either need glasses, or we must run away from the evil spider-dog...";

        return msg;
    }

    std::string _name;
};

class Dog
{
public:
    Dog(std::string_view name, size_t legs_count) : _name { name }, _legs_count { legs_count }
    {
        if (_legs_count > 5)
        {
            throw DogLegsError { name, legs_count };
        }
    }

private:
    std::string _name;
    size_t      _legs_count = 0u;
};

int main()
{
    try
    {
        Dog medor { "Medor", 4 };
        Dog turlutu { "Turlutu", 3 };
        Dog brutus { "Brutus", 5 };
        Dog evil_beast { "EvilBeast", 12 };
    }
    catch (const DogLegsError& err)
    {
        std::cerr << err.what() << std::endl;
    }

    return 0;
}
```
