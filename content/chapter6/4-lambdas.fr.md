---
title: "Lambdas"
weight: 4
---

Les lambdas sont des objets-fonction un peu spéciaux, que l'on peut facilement définir depuis le corps d'une fonction.
Vous avez déjà dû voir de nombreux exemples d'utilisation de lambda tout au long de ce cours.
Nous allons maintenant revenir plus en détail sur leur fonctionnement et vous montrez tout ce qu'il est possible de faire avec. 

---

### Syntaxe

La définition d'une lambda est composée en général de trois parties :
```cpp
[c1, c2, c3](int p1, int p2, int p3) { return c1 * p1 + c2 * p2 + c3 * p3; }
```

La partie entre crochet s'appelle la **capture**.
Par défaut, la lambda n'a pas accès aux variables définies dans la fonction parent.
La capture permet donc de spécifier les variables locales du parent que l'on veut pouvoir utiliser dans la lambda.

La deuxième partie est composée des paramètres de la lambda.
Comme n'importe quelle fonction, il s'agit d'une liste d'éléments entre parenthèses, et chacun des élément est composé d'un type et d'un identifiant (ce dernier pouvant être omis, s'il n'est pas utilisé).

Enfin, la dernière partie correspond au corps de la lambda.
Il contient les instructions qui seront exécutées lorsque la lambda est appelée.
Sachez que vous pouvez mettre autant d'instructions que vous voulez dans le corps d'une lambda.
En général, c'est mieux d'avoir des lambdas courtes, et éventuellement d'extraire une partie du code dans une vraie fonction annexe si la lambda devient trop grosse.
Cela permet de garder du code lisible.

---

### Stockage et appel

Les lambdas peuvent être placées dans des variables locales ayant pour type `auto` :
```cpp
const auto compare_stuff = [](const Stuff& stuff1, const Stuff& stuff2) { return stuff1.content == stuff2.content; };

Stuff stuff1 { 1 }, stuff2 { 2 }, stuff3 { 2 }, stuff4 { 1 };
if (compare_stuff(stuff1, stuff2) && compare_stuff(stuff2, stuff3))
{
    assert(compare_stuff(stuff1, stuff3));
}
```

On peut également les assigner à des objets de type `std::function<Ret(Params...)>` si la signature de la lambda correspond bien au paramètre de template de la `std::function` :
```cpp
const Dog my_first_dog;

std::function<bool(const Dog&)> is_my_dog = [&my_first_dog](const Dog& dog) { return &dog == &my_first_dog; };

if (Dog* my_new_dog = get_new_dog())
{
    is_my_dog = [my_new_dog](const Dog& dog) { return &dog == my_new_dog; };
}

if (!is_my_dog(my_first_dog))
{
    std::cout << "Seems like I got a new dog." << std::endl;
}
```

{{% notice note %}}
`std::function<Ret(Params...)>` est une classe définie dans `<functional>` qui permet de wrapper n'importe quel genre de foncteur : fonctions libres, lambdas, objets avec `operator()`, appel à une fonction-membre, etc.\
C'est très pratique pour mettre en place un système de **callbacks**, c'est-à-dire pour stocker des fonctions destinées à être appelées plus tard dans le programme.
{{% /notice %}}

Enfin, on peut les passer directement à des fonctions qui attendent des `std::function<...>` ou des "*Callables*" (comme les fonctions de `<algorithm>`) :
```cpp
for (unsigned int i = 1; i < 20u; ++i)
{
    mutiples_nb[i] = std::count_if(values.begin(), values.end(), [i](unsigned int v) { return v % i == 0u; });
}
```

---

### Captures

##### Valeur ou référence

Pour commencer, on peut choisir de capturer une variable par valeur ou par référence.

```cpp
int value = 0;

// Capture par valeur.
const auto display_copy = [value]() { std::cout << value << std::endl; };

// Capture par référence.
const auto display_ref = [&value]() { std::cout << value << std::endl; };

display_copy(); // => 0
display_ref();  // => 0

value = 5;

display_copy(); // => 0
display_ref();  // => 5
```

{{% notice info %}}
Lorsque l'on capture par référence, il faut s'assurer que la durée de vie de la lambda ne dépassera pas celle de la variable référencée.
Si cette dernière est détruite et que l'on appelle la lambda après, on se retrouve avec une dangling-ref.  
{{% /notice %}}

---

##### Capture des attributs d'un objet

Si vous écrivez une lambda à l'intérieur d'une fonction-membre, vous devriez vous apercevoir qu'il n'est pas possible de capturer les attributs de l'objet :
```cpp
struct CaptureTest
{
    std::function<void(int)> create_add_callback() const
    {
        return [&_value](int other) { return _value + other; }; // => la capture ne compile pas...
    }

    int _value = 0;
};
```

En fait, pour capturer les attributs de l'objet, il faut capturer l'objet en lui-même.
Pour faire cela, on écrit `this` dans la capture.

```cpp
struct CaptureTest
{
    std::function<void(int)> create_add_callback() const
    {
        return [this](int other) { return _value + other; }; // => _value est maintenant accessible !
    }

    int _value = 0;
};
```

Attention encore une fois aux durées de vie.
Si vous capturez `this`, cela revient à capturer par référence tous les attributs et fonction-membres de l'objet.
Vous devez donc vous assurer que l'instance capturée vivra au moins aussi longtemps que la lambda.

```cpp
auto capture_test = std::make_unique<CaptureTest>();
capture_test->_value = 3;

const auto add_cb = capture_test->create_add_callback();

// L'instruction suivante affiche 6.
std::cout << add_cb(3) << std::endl;

// L'objet capture_test est détruit.
capture_test.reset();

// L'instruction suivante a un comportement indéfini (usage d'une dangling-ref).
std::cout << add_cb(9) << std::endl;
```

---

##### Capture des variables globales

Les variables globales ne peuvent pas être capturées.
En effet, celles-ci sont déjà accessibles de base dans le corps de la lambda.

```cpp
int global_value = 5;

int main()
{
    // La ligne suivante déclenche un warning.
    // const auto increment_global = [&global_value]() { ++global_value; };

    // Alors que celle-ci compile parfaitement.
    const auto increment_global = []() { ++global_value; };
    increment_global();
    increment_global();

    std::cout << global_value << std::endl; // => 7

    return 0;
}
```

---

##### Alias

Il est possible de définir un alias pour capturer un élément.
Vous pouvez ainsi utiliser des noms plus courts dans la lambda, ou encore capturer le résultat d'une expression.
```cpp
int variable = 0;
const auto lambda = [v = variable, square = (variable * variable)]() { return v + square; };
```

C'est aussi pratique lorsque l'on est dans une fonction-membre, et que l'on souhaite capturer l'instance courante par valeur (= copie) plutôt que par référence.

```cpp
struct CaptureTest
{
    std::function<void(int)> create_add_callback() const
    {
        return [self_copy = *this](int other) { return other + self_copy._value; };
    }

    int _value = 0;
};

int main()
{
    auto capture_test = std::make_unique<CaptureTest>();
    capture_test->_value = 3;

    const auto add_cb = capture_test->create_add_callback();
    std::cout << add_cb(3) << std::endl; // => 6

    capture->_value = 7;
    std::cout << add_cb(3) << std::endl; // => toujours 6, puisqu'on a pas capturé par référence

    capture_test.reset();
    std::cout << add_cb(9) << std::endl; // => 12, donc plus de problème de dangling-ref !

    return 0;
}
```

On peut aussi décider de restreindre la capture à un seul attribut, plutôt que de capturer l'intégralité de l'objet. 
```cpp
struct BunchOfStuff
{
    std::function<void()> update_first_stuff_cb()
    {
        // Notez qu'utiliser un alias n'empêche pas de capturer par référence.
        return [&stuff = _stuff1]() { stuff.update(); };
    }

    Stuff _stuff1;
    Stuff _stuff2;
    Stuff _stuff3;
};
```

Enfin, en utilisant des alias, il est possible de déplacer un objet à l'intérieur d'une lambda :
```cpp
std::function<void()> create_display_range_cb(int a, int b)
{
    const auto [min, max] = std::minmax(a, b);
    
    std::vector<int> values;
    std::generate(std::back_inserter(values), max - min, [v = min]() mutable { return v++; });
    
    // On ne va plus utiliser "values" après, donc on peut déplacer le tableau dans la lambda, afin d'économiser une copie.
    return [values = std::move(values)]()
    { 
        std::for_each(values.begin(), values.end(), [](int v) { std::cout << v << " "; });
    };
}
```

---

### Compilation

Au moment où vous écrivez une lambda, il faut savoir que celle-ci n'a pas encore de type.
C'est pour cela que lorsque vous voulez créer une variable à partir d'une lambda, vous êtes obligé d'utiliser `auto`, ou bien de la wrapper à l'intérieur d'un objet de type `std::function`.

Le type de la lambda va être réellement généré au cours de la compilation.

Si la lambda ne capture rien, alors le compilateur va créer une fonction libre à partir du code de la lambda.
Le type de cette lambda sera donc un pointeur de fonction avec la même signature.  

```cpp
int main()
{
    auto lambda = [](int v){ std::cout << v << std::endl; };
    lambda(3);
    return 0;
}

// pourrait être traduit par le compilateur avec :

void nom_autogenere_incomprehensible(int v)
{
    std::cout << v << std::endl;
}

int main()
{
    void (*lambda)(int) = &nom_autogenere_incomprehensible;
    lambda(3);
    return 0;
}
```

En revanche, si la lambda capture quelque chose, alors le compilateur va générer une classe ayant pour attributs les différents éléments capturés.
La lambda aura dans ce cas pour type cette classe auto-générée.

```cpp
int main()
{
    int coeff = 3;
    auto lambda = [coeff](int v){ std::cout << (coeff * v) << std::endl; };
    lambda(3);
    return 0;
}

// pourrait être traduit par le compilateur avec :

struct nom_autogenere_incomprehensible
{
    nom_autogenere_incomprehensible(int coeff)
        : _coeff { coeff }
    {}

    void operator()(int v) const
    {
        std::cout << (_coeff * v) << std::endl;
    }

    int _coeff;
};

int main()
{ 
    int coeff = 3;
    nom_autogenere_incomprehensible lambda { coeff };
    lambda(3);
    return 0;
}
```

Comme vous pouvez le constater, dans le code ci-dessus, nous avons marqué l'`operator()` comme étant `const`.\
En effet, vous devriez avoir une erreur si vous essayez de compiler le code suivant :
```cpp
int main()
{
    int coeff = 3;
    auto lambda = [coeff](int v) { coeff += v; }; // => assignment of read-only variable 'coeff'
    lambda(3);
    return 0;
}
```

Par défaut, il n'est pas possible de modifier les objets capturés par valeur dans une lambda.
Si vous souhaitez pouvoir le faire, il faut utiliser le mot-clef `mutable`.
Ainsi, au moment de générer le type de la lambda, le compilateur ne placera pas `const` sur l'`operator()`. 
```cpp
int main()
{
    int coeff = 3;
    auto lambda = [coeff](int v) mutable { coeff += v; }; // => plus d'erreur
    lambda(3);
    return 0;
}
```

{{% notice tip %}}
Notez bien que cela ne concerne que les captures **par valeur**.
En effet, lorsqu'on capture par référence, la lambda ne own pas l'objet référencé.
Si on modifie le contenu de la référence, on ne modifie donc pas vraiment la lambda, puisque ce qui est modifié vit en dehors de la lambda.
Il est donc recommandé de ne mettre `mutable` que si vous modifiez des objets capturés par valeur.  
{{% /notice %}}
