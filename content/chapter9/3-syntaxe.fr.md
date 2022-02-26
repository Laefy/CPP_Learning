---
title: "Débrief"
weight: 3
---

---

### Définition d'un template

Pour définir un template, il faut écrire `template <...>` devant la définition de la classe ou fonction templatée.\
Les chevrons contiennent la liste des paramètres du template. Chaque paramètre est typé par :\
\- `typename` : il faut donc passer un nom de type en paramètre,\
\- un type intégral, comme `size_t`, `char`, `int`, ... : il faut passer une expression du bon type **évaluable à la compilation**,\
\- une énumération : il faut passer une valeur de cette énumération **évaluable à la compilation**.

Classe-template :
```cpp
template <typename Type, int Size, char Letter>
class TemplateClass
{ ... };

int main()
{
    TemplateClass<std::string, 3, 'A'> class_example;
    ...
    return 0;
}
```

Fonction-template :
```cpp
enum class TheEnum { E1, E2, E3 };

template <TheEnum Enum>
void template_fcn()
{ ... }

int main()
{
    template_fcn<TheEnum::E2>();
    ...
    return 0;
}
```

---

### Valeur par défaut de paramètres de template

Il est possible de donner des valeurs par défaut aux paramètres de template :

```cpp
template <typename T1 = int, typename T2 = T1, typename T3 = T1>
struct Triple
{
    T1 _m1 {};
    T2 _m2 {};
    T3 _m3 {};
};

int main()
{
    Triple<float, double> t1; // => Triple<float, double, float>
    Triple<float>         t2; // => Triple<float, float, float>
    Triple<>              t3; // => Triple<int, int, int>   
    Triple                t4; // => Triple<int, int, int> (pareil que la syntaxe précédente)  

    return 0;
}
```

---

### Déduction des paramètres de template

Dans le cas d'un appel de fonction-template, on peut omettre de spécifier les derniers paramètres de template si ceux-ci sont déductibles des arguments passés à la fonction :

```cpp
template <typename T1, typename T2, typename T3>
struct Triple
{
    T1 _m1 {};
    T2 _m2 {};
    T3 _m3 {};
};

template <typename T1, typename T2, typename T3>
Triple<T1, T2, T3> make_triple(const T1& p1, const T2& p2, const T3& p3)
{
    return Triple<T1, T2, T3> { p1, p2, p3 };
}

int main()
{
    auto triple = make_triple(3.2f, 'A', 6u); // => Triple<float, char, unsigned int>
    return 0;
}
```

---

### Constexpr

Le mot-clef `constexpr` sert à indiquer au compilateur qu'il est censé pouvoir évaluer le contenu d'une expression à la compilation.
Seules des expressions évaluables à la compilation peuvent être passées en tant que paramètres de template.

On peut l'indiquer sur des variables :
```cpp
constexpr size_t size = 3;
std::array<int, size> array;
```

On peut aussi l'indiquer sur des fonctions :
```cpp
constexpr size_t factorial(size_t n)
{
    return n < 2 ? 1 : (n * factorial(n-1)); 
}

std::array<int, factorial(3)> array;
```

Enfin, lorsqu'on peut évaluer une condition à la compilation, on peut utiliser un `if constexpr` plutôt qu'un `if` pour que le code correspondant à la branche qui ne sera jamais exécutée ne soit pas généré du tout.
```cpp
template <typename T, size_t Size>
void woah(const std::array<T, Size>&)
{
    if constexpr (Size > 16)
    {
        std::cout << "Woaaaah, this is a BIG array!" << std::endl;
    }
    else
    {
        std::cout << "This is a little array." << std::endl;
    }
}
```

---

### Contraintes des paramètres de template

Les paramètres de templates peuvent être utilisés à n'importe quel endroit de la classe-template ou de la fonction-template.\
Il faut juste vérifier les deux conditions suivantes pour que le programme compile :\
1- le code de la classe ou de la fonction peut être généré à partir du template et des arguments de template fournis,\
2- ce code généré compile. 

```cpp
template <typename Animal>
void go_somewhere(Animal& animal, const Point& destination)
{
    if constexpr (Animal::category == Category::Bird)
    {
        animal.fly_to(destination);
    }
    else if constexpr (Animal::category == Category::Fish)
    {
        animal.swim_to(destination);
    }
    else if constexpr (Animal::category == Category::Mammal)
    {
        animal.run_to(destination);
    }
    else
    {
        animal.go_to(destination);
    }
}

struct Monkey
{
    static constexpr Category category = Category::Mammal;
    
    void run_to(const Point& destination) { ... };
};

struct Snake
{
    static constexpr Category category = Category::Reptile;
    
    void crawl_to(const Point& destination) { ... };
};
```

Le code de `go_somewhere<Monkey>` peut être généré et compile :
```cpp
void go_somewhere(Monkey& animal, const Point& destination)
{
    animal.run_to(destination); // Monkey a bien une fonction run_to(const Point&).
}
```

Le code de `go_somewhere<int>` ne pourra pas être généré :
```cpp
// ... génération de go_somewhere<int>
void go_somewhere(int& animal, const Point& destination)
{
    if constexpr (int::category == Category::Bird) // Erreur !
    // int est un type primitif, on ne peut donc pas écrire int::category, et encore moins évaluer la condition du if constexpr.
}
```

Le code de `go_somewhere<Snake>` pourra être généré, mais ne compilera pas :
```cpp
void go_somewhere(Snake& animal, const Point& destination)
{
    animal.go_to(destination); // Snake n'a pas de fonction go_to(const Point&).
}
```
