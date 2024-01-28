---
title: "Durée de vie ⏳"
weight: 2
---

Nous allons maintenant revenir sur l'instanciation et la désinstanciation des données, car ce sont les deux événements qui délimitent leur période de validité.

---

### Donnée de type fondamental

L'instanciation d'une donnée de type fondamental se passe en deux étapes :
1. Le programme alloue l'espace nécessaire pour stocker la donnée,
2. **Si spécifié par le programmeur**, le contenu de la donnée est initialisé.

En ce qui concerne la désinstanciation, le programme désalloue l'espace réservé pour la donnée.

Dans le cas d'une **allocation automatique**, l'instanciation a lieu au moment de la définition de la variable, et la désinstanciation a lieu lorsque l'on sort du bloc dans lequel elle est définie.

```cpp {linenos=table}
int twice_sum()
{
    auto sum = 0;

    for (auto i = 0; i < 3; ++i)
    {
        auto twice = i * 2;
        sum += twice; 
    }

    return sum;
}
```

Dans l'exemple ci-dessus :
- `sum` est instancié à la ligne 3 et désinstancié à la ligne 12
- `i` est instancié à la ligne 5 et désinstancié à la ligne 9 (après la dernière itération de la boucle)
- `twice` est instancié à la ligne 7 et désinstancié à la ligne 9 (à la fin de chaque itération)

Dans le cas d'une **allocation dynamique**, l'instanciation a lieu à l'appel à `new` (ou `new[]`) et la désinstanciation à l'appel à `delete` (ou `delete[]`).

```cpp {linenos=table}
int* make_int(int value)
{
    int* ptr = nullptr;
    ptr = new int { value };
    return ptr;
}

int main()
{
    int* five = make_int(5);
    std::cout << *five << std::endl;
    delete five;

    return 0;
}
```

Dans ce nouvel exemple :
- la variable `value` est instanciée ligne 1 et désinstanciée ligne 6,
- la variable `ptr` (le pointeur !) est instanciée ligne 3 et désinstanciée ligne 6,
- l'entier alloué dynamiquement (et référencé par `*ptr` puis `*five`) est instancié ligne 4 et désinstancié ligne 54,
- la variable `five` (encore le pointeur) est instanciée à la ligne 10 et désinstanciée ligne 15.

---

### Donnée de type-structuré

Pour les types-structurés (c'est-à-dire `class` et `struct`), le comportement à l'instanciation et désinstanciation est un peu différent.

À l'instanciation :
1. le programme alloue l'espace nécessaire pour stocker la donnée,
2. le constructeur de la donnée est appelé **quoi qu'il arrive**.

À la désinstanciation :
1. le destructeur de la donnée est appelé,
2. le programme désalloue l'espace réservé pour la donnée.

Prenons l'exemple suivant :
```cpp {linenos=table}
class Person
{
public:
    Person(std::string name, std::string surname) : _surname { surname }
                                                  , _name { name }                                                    
    {
        std::cout << name << " is born" << std::endl;
    }

    ~Person()
    {
        std::cout << name << " is dead" << std::endl;
    }

private:
    std::string _name;
    int         _age = 3;
    std::string _surname;
};

int main()
{
    Person p { "Jean", "Paul" };
    return 0;
}
```

Voici ce qu'il se passe au moment de l'instanciation de `p` (ligne 23) :
1. Le programme alloue l'espace nécessaire pour stocker un objet de type `Person`,
2. Il appelle le constructeur de `Person` à deux paramètres qui :
    1. instancie `_name` :
        1. Le programme lui alloue le bloc mémoire nécessaire (au sein de l'espace déjà réservé pour `p`),
        2. Il appelle le constructeur de `std::string` à un paramètre.
    2. instancie `_age` :
        1. Le programme lui alloue le bloc mémoire nécessaire (au sein de l'espace déjà réservé pour `p`),
        2. Il lui assigne la valeur `3`.
    3. instancie `_surname` :
        1. Le programme lui alloue le bloc mémoire nécessaire (au sein de l'espace déjà réservé pour `p`),
        2. Il appelle le constructeur de `std::string` à un paramètre.
    4. exécute les instructions présentes dans le corps du constructeur (en l'occurrence, cela affiche `Jean is born` dans la console).

{{% notice note %}}
Notez bien ici que `_name` est instancié en premier, puis `_age`, puis `_surname`, malgré l'ordre dans lequel les attributs apparaissent dans la liste d'initialisation du constructeur.  
En effet, c'est l'ordre de définition des attributs dans la classe qui fait foi et détermine qui est instancié avant qui.  
{{% /notice %}}

{{% notice note %}}
Lorsqu'un attribut est mentionné dans la liste d'initialisation, il est initialisé en fonction de ce qui est spécifié dans cette liste. En l'absence de cette mention, l'initialisation se fait à partir du class-initializer. Si ce dernier n'est pas défini, le constructeur par défaut est invoqué pour un type structuré, tandis que pour un type fondamental, rien n'est fait.
{{% /notice %}}

Voici maintenant ce qu'il se passe au moment de sa désinstanciation (ligne 25) :
1. Le programme appelle le destructeur de `Person` qui :
    1. exécute les instructions présentes dans le corps du destructeur (en l'occurrence, cela affiche `Jean is dead` dans la console),
    2. désinstancie `_surname` :
        1. Le programme appelle le destructeur de `std::string`,
        2. Il désalloue l'espace réservé pour `_surname`.
    3. désinstancie `_age`, c'est-à-dire qu'il désalloue l'espace qui lui est réservé,
    4. désinstancie `_name` :
        1. Le programme appelle le destructeur de `std::string`,
        2. Il désalloue l'espace réservé pour `_name`.
2. le programme désalloue entièrement l'espace réservé à `p`.

Pour résumer, en plus de l'allocation et la désallocation mémoire, l'instanciation et la désinstanciation d'un objet de type-structuré comprennent sa construction et sa destruction.  
Ces deux étapes entraînent récursivement l'instanciation et la désinstanciation de ses attributs.

---

### Références

Une référence est un alias d'une donnée, cependant, la déclaration ou la sortie du bloc dans lequel elle est définie n'a absolument **aucun impact** sur l'instanciation ou la désinstanciation de la donnée :
```cpp {linenos=table}
void fcn()
{
    int a = 0;

    {
        int& b = a;
        b = 3;
    }

    a = 5;
}
```

La donnée représentée par `a`, mais également par `b`, est instanciée ligne 3 et désinstanciée ligne 11.  
La ligne 6 n'a absolument aucun impact sur la mémoire : aucune nouvelle instanciation n'est réalisée.  
Idem pour la ligne 8, rien n'est désinstancié, la donnée correspondant à `a` est toujours bien présente.

En revanche, il faut faire attention au cas inverse : conserver une référence sur une donnée qui va être désinstanciée !  
Voici un exemple :
```cpp {linenos=table}
const std::string& person(const std::string& name)
{
    std::string default_name = "stranger";
    return name.empty() ? default_name : name;
}

int main()
{
    std::string name;
    std::cin >> name;
    std::cout << "Hello " << person(name) << std::endl;
    return 0;
}
```

Ici, `default_name` est instancié ligne 3 et désinstancié ligne 5 (lorsqu'on sort de la fonction `fcn`).  
Dans le cas où `name` est vide, on renvoie une référence sur cette donnée, qui n'a par conséquent plus d'espace mémoire attribué une fois revenu dans la fonction `main`.  
Ce qui est affiché dans la console à la ligne 11 est donc indéterminé (et encore, moyennant que le programme ne crash pas 😬).

On utilise le terme **dangling-reference** pour parler de cette situation.
C'est un problème que l'on rencontre souvent, surtout lorsqu'on est débutant.

---

### Validité des données

L'accès à une donnée (en écriture ou en lecture) est valide **si et seulement si** cet accès est effectué après son instanciation et avant sa désinstanciation.

Pourquoi ? Eh bien, tout simplement parce que le support d'existence d'une donnée est le segment mémoire dans lequel elle est écrite, et ce segment est réservé au cours de l'instanciation puis libéré à la désinstanciation.  
C'est d'ailleurs la cause des dangling-references, que nous avons présentées dans le paragraphe précédent.

La période entre ces deux événements est appelée **durée de vie** de la donnée, ou encore **lifespan** en anglais.

Si l'accès à la donnée est fait en dehors de sa durée de vie, le comportement du programme est indéterminé (= **undefined behavior**).  
Dans le cas d'un accès en lecture, si le programme ne génère pas immédiatement une segfault, vous pourrez vous retrouver avec une valeur complètement aléatoire (ce ne sera pas forcément la dernière valeur portée par la donnée).  
Dans le cas d'un accès en écriture, on aura au mieux une segfault qui permettra de localiser rapidement à quel endroit du code l'accès invalide a été fait, et dans le pire des cas on écrira dans une zone mémoire désormais allouée à une autre donnée, et il devient alors extrêmement difficile de comprendre d'où vient le problème...

Petit exercice, dans le code ci-dessous, essayez d'anticiper quelles seront les valeurs affichées dans la console :
```cpp
#include <iostream>
#include <vector>

void fcn1()
{
    int* ptr = nullptr;
    {
        int a = 1200;
        ptr = &a;
    }

    std::cout << *ptr << std::endl; // => ?
}

struct Values
{
    std::vector<int> values = { 1, 2, 3 };
};

void fcn2()
{
    Values* ptr = nullptr;
    {
        Values values;
        ptr = &values;
    }

    std::cout << ptr->values.size() << std::endl; // => ?
    std::cout << ptr->values[1] << std::endl; // => ?
}

void fcn3()
{
    int* ptr = new int(1200);
    delete ptr;

    std::cout << *ptr << std::endl; // => ?
}

int& fcn4()
{
    int v = 4;
    return v;
}

int main()
{
    fcn1();
    fcn2();
    fcn3();

    std::cout << fcn4() << std::endl; // => ?

    return 0;
}
```

Ouvrez maintenant le code dans [Compiler Explorer](https://godbolt.org/#z:OYLghAFBqd5QCxAYwPYBMCmBRdBLAF1QCcAaPECAMzwBtMA7AQwFtMQByARg9KtQYEAysib0QXACx8BBAKoBnTAAUAHpwAMvAFYTStJg1DIApACYAQuYukl9ZATwDKjdAGFUtAK4sGe1wAyeAyYAHI%2BAEaYxCBmGqQADqgKhE4MHt6%2BekkpjgJBIeEsUTFxtpj2eQxCBEzEBBk%2BflzllWk1dQQFYZHRsfEKtfWNWS2Dnd1FJf0AlLaoXsTI7BzmAMzByN5YANQma25Og8SYrPvYJhoAguub25h7BwBumA4k55c310%2BoeOg7VGQDC4EBmnxMAHYrNcdrCdsECAAqHYJAjER4AER2DC8tFoqOI%2B2hVzheyhn1JpIROyYmJ2XDiGiJFMpsIJdPMADYmMyYXDIRjwXzYYN0CAUAsCI83Ps3DtEezZbKdqLxa5aLySXCAPTanYAWn15xpyFMbjWJiuAA4FPCGE8xH9MKQdiwmHhbSciIsQjsInhGPTGeCIYLrp9jl4HDsAGpiLyYBQh4mk1UgF5vQkHBHGh3eRMcqH0l1mF1rMmCtbEgWaz4/P4AoFmUHJlmwuP5hTIxVrLE4vEEzWkyEp1mx%2BMFvMJpNVtuUntYrlTxND/mhoVakUEMUSrxSpUHFFoo1rbDLhQAOhSAC9MKDpcq0%2BrV7DdQaT9gTWaLdbbcE806Lpuh6OxegsxC%2Bv6gYWsKKrbuKaB7g%2Bh4Eh%2B54mAArBYXCYYuByPvBIDPrOsFvoaxpMKaJjmpaNp2gBWAumBPoPBhNJeDstABhxuxmI8ABi%2ByCWsgnhuu4bfL8/yAgwawtmJo6wgi3ZonSIQAO52gQEAMhoGhgiRm47Fg9AEA8g6GXOaaIfu%2BGHgqqkHnKT4MOgGqGaSZEfl%2B1E/nR/6OoxoGYN6EEPAwYAcHgLBJPUDwAI5eL8OxgGAIZhl8Vw5mYnKNgwkjyTc5KwdSTx0pIL7BQQPo7E8tbiZlnzUsBDCFSOc4ySCBmKXlzbdR1QJyf1ElGdZkrIXKMkFTME1wTuxE9V5FFUTRv70YFzquu6noheBkEBgwOwVSNpJejVTKWQ1HBzLQnAYbwfgcFopCoJwMqWNYKrgcsexmGsPCkAQmjXXMADWIAYfEt0cJID3Ay9nC8AoIDxEDT3XaQcCwEgmCqK8e4kOQlB1MACjKIYFRCAgqDqY9z1oDFdBMFU5MhLQVM03TvAMwkdB9FshjAFwEIaC0PN88QoSsCs3OoIz9DEAA8nuHO0/DuOvFcxCk4jpAa8gNT4I9vD8IIIhiOwUgyIIigqOo6OkLoLQGEYKDWNY%2Bh4BEyOQHMqComkyMcPqor7BipgfZYwu8KgLzEMQTo%2B6CpDEF4gjRZgAAqqCeEncwKN9lu2NuwSs5T1Nq9wvDqcQTAJJwPA3XdcMO69HDYHjyAE%2BiqhWpy%2BqcpIOwC0Y9IQheGgXlwOwQO9ViWC6uCECQv3/TMvBo1oMxzAgpxYDEyfg5D%2BicLDpBcwjHBIyjgPA9vJ8cGYLfPW3G933MccpM4khAA) et regardez ce qu'il se passe vraiment.  
Changez ensuite de compilateur et sélectionnez `x86-64 gcc 13.2`.
Que constatez-vous ?

{{% notice tip %}}
Le terme **undefined behavior** signifie littéralement "comportement indéfini".
En réalité, il s'agit d'un comportement indéfini **par le standard**.  
Cela comporte donc les cas où le programme ne donne pas les mêmes résultats d'une exécution à l'autre (`fcn3`), mais également les cas où le comportement semble stable, jusqu'à ce que l'on change de compilateur ou de machine (`fcn2` et `fcn4`).  
Et comme on ne peut pas tester son code sur tous les compilateurs et toutes les machines, même si certaines instructions ont l'air de toujours se comporter comme on le voudrait (`fcn1`), il faudra éviter d'écrire du code dont le comportement n'est pas garanti par le standard. 
{{% /notice %}}

---

### Synthèse

- L'**instanciation** comporte :
    - l'allocation de la mémoire pour la donnée,
    - son éventuelle initialisation : constructeur pour les types-structurés, initialiseur (seulement si spécifié) pour les types fondamentaux.
- La **désinstanciation** comporte :
    - la destruction de la donnée s'il s'agit d'une instance de type-structuré,
    - la désallocation de la mémoire réservée.
- On parle d'**allocation automatique** lorsque la donnée est instanciée via la définition d'une variable locale.  
La désinstanciation a lieu lorsque l'on sort du bloc dans lequel elle est définie.
- On parle d'**allocation dynamique** lorsque la donnée est instanciée via l'utilisation de `new` (ou `new[]`).  
La désinstanciation se fait explicitement avec l'appel `delete` (ou `delete[]`).
- Le constructeur d'un objet déclenche l'instanciation de chacun de ses attributs, dans l'ordre dans lequel ils ont été définis.
- La **durée de vie** d'une donnée est la période durant laquelle il est valide d'y accéder : entre son instanciation et sa désinstanciation.
- Les références n'ont pas d'impact sur la durée de vie des données référencées.
En revanche, il faut faire attention à ne pas conserver une référence sur une donnée déjà désinstanciée (= **dangling-reference**).
- Accéder à une donnée déjà désinstanciée constitue un **undefined behavior**.
L'utilisation d'une dangling-reference est un bon exemple.
