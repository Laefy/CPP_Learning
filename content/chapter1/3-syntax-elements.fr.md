---
title: "Eléments de syntaxe ✍"
weight: 3
---

Nous allons vous présenter les éléments de syntaxe de base du langage.  
Comme vous pourrez le constater, mise à part quelques subtilités, la plupart de ce que vous allez voir ici ne devrait pas vous dépayser de ce que vous avez déjà vu en C ou Java.

---

### Variables et types fondamentaux

Comme dans tous les langages ou presque, on retrouve :
- les types entier (signés ou non-signés) : `int`, `short`, `unsigned int`, ...
- les types flottant : `float`, `double`
- les types caractère : `char`, `unsigned char`
- le type booléen : `bool` (et non pas `boolean` comme en Java ⚠️)

Pour définir des variables, c'est comme d'habitude : `<type> <nom> = <valeur>;`

{{% notice tip %}}
Faites bien attention à initialiser vos variables si elles ont un type fondamental pour éviter de vous retrouver avec des valeurs "aléatoires".  
En effet, ces variables ne sont pas toujours mises à 0 par défaut, comme en témoigne [ce programme](https://godbolt.org/z/P4Kr44q5s).
{{% /notice %}}

En ce qui concerne les spécificités du C++ maintenant...    
Contrairement au C, les pointeurs null ne sont plus représentés par la constante `NULL` (c'est-à-dire à 0, donc de type entier) mais par le mot-clef `nullptr` (en minuscule) de type `nullptr_t`.

Autre particularité, vous n'êtes pas obligé de respécifier le type de la variable que vous déclarez si vous l'initialiser en même temps : si vous définissez votre variable avec le mot-clef `auto` (équivalent à `var` en Java), le compilateur utilise le type de la valeur utilisée pour l'initialisation.

Voici quelques exemples de définition de variables :
```cpp
int          i1 = 3;        // type i1 = int
unsigned int u2 = 4;        // type u2 = int
float        f3 = 4.5f;     // type f3 = float
auto         d4 = 5.0;      // type d4 = double
auto         u5 = 9u;       // type u5 = unsigned int
auto         s6 = "blabla"; // type s6 = const char*
float        f7 = 3;        // type f7 = float
auto         b8 = true;     // type b8 = bool
```

La liste complète des types fondamentaux est accessible [ici](https://en.cppreference.com/w/cpp/language/types).

---

### Structures de contrôle

En ce qui concerne les structures de contrôle qui sont similaires à celles que vous avez déjà rencontrées, on retrouve le `if` / `else if` / `else` et le `switch` pour les conditions, et le `while`, le `do-while` et le `for` pour les boucles.

```cpp
// Ex1: affiche si les éléments d'un tableau sont pairs ou impairs
for (int it = 0; it < n; ++it)
{
    if (tab[it] % 2 == 0)
    {
        std::cout << "Number #" << it << " is even" << std::endl;
    }
    else
    {
        std::cout << "Number #" << it << " is odd" << std::endl;
    }
}

// Ex2: récupère les caractères de la sortie standard pour effectuer des commandes
auto exit = false;
while (!exit)
{
    auto c = std::cin.get();
    switch (c)
    {
        case 'p':
            std::cout << "Print" << std::endl;
            break;

        case 'c':
            std::cout << "Compute" << std::endl;
            break;

        case 'b':
            std::cout << "Bye-Bye" << std::endl;
            exit = true;
            break;

        default:
            std::cout << "Unknown command " << c << std::endl;
            exit = true;
            break;
    }
}
```

{{% notice tip %}}
En C++, il est tout à fait valide et même conseillé de définir son indice d'itérations directement dans l'instruction `for`.
Cela permet de limiter le **scope** (ou portée) de la variable à la boucle dans laquelle elle est définie.  
On écrira donc `for (int i = 0; i < 10; ++ i) { ... }` plutôt que `int i; for (i = 0; i < 10; ++i) { ... }`.
{{% /notice %}}

En plus du `for` classique, le C++ introduit une structure `for`-each. Celle-ci permet d'itérer sur des plages de données.  
Voici la syntaxe, mais nous vous détaillerons un peu mieux son fonctionnement une fois que lorsqu'on vous aura présenté quelques conteneurs de la librairie standard :

```cpp
for (<type> <variable> : <conteneur>)
{
    ...
}

// Ex: affiche chaque valeur du tableau ci-dessous sur une nouvelle ligne
int array[] = { 1, 2, 3, 4 };
for (auto v : array)
{
    std::cout << v << std::endl;
}
```

---

### Fonctions libres

De la même manière qu'en C, vous pouvez définir des **fonctions libres** en C++, c'est-à-dire des fonctions qui ne sont pas rattachées à une classe.

```cpp
// Ex1: fonction qui retourne la somme de deux entiers
int sum(int a, int b)
{
    return a + b;
}

// Ex2: fonction qui retourne si la somme des trois entiers entrés est pair
bool is_full_sum_even()
{
    int s = 0;

    for (int i = 0; i < 3; ++i)
    {
        int n = 0;
        std::cin >> n;
        s = sum(s, n);
    }

    return s % 2 == 0;
}
```

Notez que pour pouvoir utiliser une fonction, il faut que le compilateur ait connaissance de son existence.  
Cela signifie que la fonction utilisée doit être déclarée avant la ligne où vous essayez de l'appeler.

```cpp
// Ex1: on définit la fonction avant son appel (car une
// définition de fonction fait office de déclaration)
int sum(int a, int b)
{
    return a + b;
}

void print_sum(int a, int b)
{
    std::cout << sum(a, b) << std::endl;
}

// Ex2: on déclare la fonction avant son appel (sa définition
// peut exister n'importe où ailleurs dans le programme,
// plus loin dans le même fichier, ou bien dans un autre fichier)
int complicated_stuff();

int main()
{
    std::cout << complicated_stuff() << std::endl;
}
```

---

### Références

Les références sont des alias sur des zones de la mémoire.
Elles se définissent un peu comme des variables, mais on rajoute le symbole `&` après le type.

```cpp
int  value = 3;
int& ref   = value;

// Les symboles ref et value sont maintenant équivalents...

std::cout << value << " - " << ref << std::endl; // -> 3 - 3

// ... et modifier l'un revient à modifier l'autre

value = 4;
std::cout << value << " - " << ref << std::endl; // -> 4 - 4

ref = 2;
std::cout << value << " - " << ref << std::endl; // -> 2 - 2
```

{{% notice warning %}}
Attention à ne pas confondre la syntaxe des références avec celle de l'adresse mémoire d'une variable.  
Si le symbole `&` est placé derrière un type, c'est forcément la définition d'une référence : `auto& ref = var;`  
S'il n'y a pas de type juste devant, c'est qu'on essaye d'accéder à l'adresse mémoire de quelque chose : `auto addr = &var;`
{{% /notice %}}

Grâce aux références, vous pouvez facilement modifier une variable depuis l'intérieur d'une fonction.  
En effet, par défaut, le passage de paramètres en C++ s'effectue par copie (comme en C).
Mais si vous définissez votre paramètre comme étant une référence, alors le passage est fait par référence.

```cpp
void set_variables_to_3(int p1, int& p2)
{
    // p1 est une copie de v1
    // p2 est un alias de v2

    p1 = 3;
    // on a modifié la copie de v1
    // => pas d'effet de bord, v1 reste inchangé

    p2 = 3;
    // on a modifié un alias de v2
    // => il y a bien un effet de bord sur v2, sa valeur change
}

int main()
{
    int v1 = 1;
    int v2 = 1;
    set_variables_to_3(v1, v2);

    std::cout << v1 << std::endl; // -> 1
    std::cout << v2 << std::endl; // -> 3
}
```

---

### Types structurés

Un type structuré est un type décomposé en sous-attributs.
On utilisera souvent le terme **classe** pour parler des types structurés.

Pour définir des types structurés, vous pouvez utiliser les mots-clef `struct` ou `class`.  
On peut ensuite définir des **attributs** et des **fonctions-membre** dans le type.  
Pour spécifier la visibilité des champs, on écrit `public:` ou `private:` devant un ensemble de champs.

Voici un exemple de définition et d'utilisation d'un type structuré :
```cpp
struct Fraction
{
public:
    void set_num(int num)
    {
        _num = num;
    }

    void set_den(int den)
    {
        _den = den;
    }

    void add(Fraction other)
    {
        if (_den == other._den)
        {
            _num += other._num;
        }
        else
        {
            _den *= other._den;
            _num = _num * other._den + other._num * _den;
        }
    }

    void print()
    {
        std::cout << _num << '/' << _den << std::endl;
    }

private:
    int _num = 0;
    int _den = 1;
};

int main()
{
    Fraction f1;
    f1.set_num(3);
    f1.set_den(6);
    f1.print();

    Fraction f2;
    f2.set_num(-1);
    f2.set_den(6);
    f2.print();

    f1.add(f2);
    f1.print();

    Fraction f3;
    f3.set_num(2);
    f3.print();

    f1.add(f3);
    f1.print();

    return 0;
};
```

{{% notice warning %}}
Attention, contrairement au Java, **il faut mettre un `;` à la fin de la définition des types** !  
Sinon, le compilateur n'arrivera pas à comprendre ce que vous essayez de faire.  
{{% /notice %}}

Comme vous pouvez le constater, nous avons défini des fonctions-membre dans une `struct`.  
On aurait d'ailleurs tout à fait pû remplacer le mot-clef `struct` par `class`.
Cela n'aurait absolument rien changé dans ce cas.

Vous vous demandez donc probablement quelle est la différence entre une `struct` et une `class`, puisqu'on peut faire la même chose avec les deux.  
Eh bien la seule différence réside dans la visibilité par défaut des champs.
Si vous ne précisez ni `public`, ni `private`, alors les champs seront publics pour une `struct` et privés pour une `class`.

```cpp
struct S
{
    int v = 0;
};

class C
{
    int v = 0;
};

int main()
{
    S s;
    std::cout << s.v << std::endl;
    // => ok, v est public dans S

    C c;
    std::cout << c.v << std::endl;
    // => erreur de compilation !
    // => v n'est pas accessible dans C car privé
}
```

---

### Synthèse

Nous venons de vous présenter les bases de la syntaxe du C++.

Voici un petit rappel des choses à retenir :
- un bonne partie est similaire à ce que vous avez déjà vu en C ou en Java
- `bool` pour les booléens, et pas `boolean`
- `auto` pour la déduction de type
- `nullptr` au lieu de `NULL`
- l'itérateur peut se définir directement dans l'instruction "for" : `for (auto it = ...; <condition>; <iteration>)`
- la boucle "foreach" qui s'écrit `for (<type> <var> : <plage de données>)`
- le passage par référence en ajoutant `&` derrière le type d'un paramètre : `void fcn(int& ref)`
- le `;` derrière la définition des types structurés
- la visibilité dans une classe est définie en plaçant `public:` ou `private:` devant un groupe de champs
