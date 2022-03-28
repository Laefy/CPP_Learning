---
title: "Référence universelle"
weight: 1
---

Dans cette première section, nous commencerons par introduire les concepts de l-value et r-value.\
Cela nous conduira à vous présenter la notion de référence universelle.
Nous vous expliquerons ensuite quand et comment vous en servir dans votre code.

---

### l-value / r-value

Avant de parler concrètement des références universelles, il faut aborder un point essentiel à leur compréhension.

En C++, une expression est une suite d'opérateurs et d'opérandes pouvant être évaluée.
L'évaluation d'une expression peut parfois produire une valeur.\
Voici quelques exemples d'expressions :
```cpp
(a + b) / 3
15
&r
fcn(r, c + 3, t)
a = b = c
r == 8 || call(g) == 'c'
++it
```

Notez bien qu'une expression peut bien composée de plusieurs sous-expressions.
Par exemple, dans la première ligne, `(a + b) / 3` est une expression composée des sous-expressions `(a + b)` et `3`, et `(a + b)` est elle-même composée des sous-expressions `a` et `b`.

La plupart des expressions peuvent être catégorisées en tant que l-value ou r-value.
Pour faire la différence entre une l-value et une r-value, il suffit de se poser deux questions.
1. Est-ce que l'expression fait référence à un objet précis stocké en mémoire ?
Si oui, on passe à la question 2, si non, c'est une r-value.
2. Est-ce cet objet risque d'être détruit ou invalidé si le résultat n'est pas stocké dans une variable avant la fin de l'instruction ?
Si oui, c'est une r-value, si non, c'est une l-value.

Par exemple :
```cpp
auto v1 = 5;
// `5` est une r-value.
// C'est un litéral entier, et il n'a donc pas d'adresse en mémoire.

auto v2 = v1;
// `v1` est une l-value.
// L'expression fait référence à la variable v1, qui a bien une adresse en mémoire.

auto v3 = v2 + 5 - v1;
// `v2 + 5 - v1` est une r-value.
// C'est une suite d'opérations qui ne fait pas référence à un objet en particulier.

auto v4 = std::vector { 1, 2, 3 };
// `std::vector { 1, 2, 3 }` est une r-value.
// Bien qu'il s'agisse d'un objet, si on ne l'avait pas mis dans une variable, celui-ci aurait été détruit à la fin de l'instruction.

auto v5 = v4.emplace_back(4);
// `v4.emplace_back(4)` est une l-value.
// emplace_back retourne une référence sur l'élément ajouté dans le tableau.
// Si on n'avait pas stocké le résultat, cet élément n'aurait pas pour autant été détruit.
```

**Petit exercice**\
Essayez de déterminer la catégorie des expressions indiquées dans chacun des commentaires.
Vous pouvez utiliser {{% open_in_new_tab "https://www.godbolt.org/z/YT9Ef889f" "ce petit programme" /%}} pour obtenir les solutions et testez d'autres expressions. 

```cpp
int return_3() { return 3; }
int return_copy(int& ref) { return ref; }
int& return_ref(int& ref) { return ref; }

int main()
{
    int value = 3;
    // `value`
    // `3+4`
    // `"tata"`
    // `std::string { "toto" }`
    // `std::move(value)`
    // `&value`
    // `return_3()`
    // `return_ref(value)`
    // `return_copy(value)`
}
```

{{% expand "Explications" %}}
1. `value`\
Il s'agit d'une l-value, puisque `value` est une variable.

2. `3+4`\
Il s'agit d'une r-value, puisque c'est un calcul (donc pas d'adresse en mémoire).

3. `"tata"`\
On pourrait penser qu'il s'agit d'une r-value, mais c'est en fait une l-value.
En effet, contrairement aux litéraux de type `int`, `char` ou `bool`, les chaînes de caractères en dur sont enregistrées dans la mémoire statique du programme au moment de la compilation.
Donc si vous écrivez `"tata"` sans placer le résultat dans une variable, cet objet continuera d'exister quand même.
Pour vous en convaincre, vous pouvez placer cette chaîne dans plusieurs `const char*` et affichez le contenu des pointeurs (c'est-à-dire les adresses, pas la chaîne).
Vous pourrez constatez qu'ils pointent tous sur la même case de la mémoire.

4. `std::string { "toto" }`\
Ici, il s'agit par contre d'une r-value.
Si cette `std::string` n'est pas placée dans une variable, alors elle sera détruite une fois l'instruction terminée.

5. `std::move(value)`\
Il s'agit d'une r-value, car le rôle de `std::move` est en fait de transformer des l-values en r-values afin de pouvoir déplacer les objets.

6. `&value`\
Il s'agit d'une r-value.
On réalise une opération avec la variable `value` (de la même manière que si on avait écrit `value + 1`) et si le résultat n'est pas stocké, alors il sera détruit une fois l'instruction terminée.

7. `return_3()`\
Il s'agit d'une r-value.
L'appel à `return_3()` renvoie un entier, et si celui-ci n'est pas stocké, alors il est détruit à la fin de l'instruction réalisant l'appel.

8. `return_ref(value)`\
Il s'agit d'une l-value.
Contrairement à la fonction précédente, on retourne une référence sur un entier.
Ne pas stocker cette référence ne conduira pas à la destruction de l'objet référencé.

9. `return_copy(value)`\
Cette expression est une r-value, puisqu'on retourne une copie temporaire de l'objet passé en paramètre.
Si celle-ci n'est pas stockée, elle sera détruit.

{{% /expand %}}

{{% notice note %}}
Les termes l-value et r-value signifient en fait "left-value" et "right-value".
Ils ont été choisis car on peut placer une l-value à gauche d'un signe `=` alors qu'on ne pourra jamais le faire avec une r-value.
Mais ce n'est pas vraiment très représentatif, car une l-value peut très bien être placée à droite d'un signe `=` (par exemple `v1 = v2`).
Et quand une l-value est constante, on ne peut pas la mettre à gauche d'un signe `=`, puisqu'une constante n'est pas réassignable.\
Retenez donc qu'étymologiquement, les noms signifient "left-value" et "right-value", mais qu'en pratique, ça ne vous aidera pas vraiment à savoir si vous avez affaire à une l-value ou une r-value.
{{% /notice %}}

---

### Surcharge par l-value ou r-value reference

Comme vous le savez, il est possible de surcharger des fonctions.

Mais ce que vous ne saviez probablement pas, c'est qu'il est possible de définir une surcharge qui sera utilisée uniquement si on lui passe une expression r-value.\
Voici la syntaxe :
```cpp
void fcn(const std::string& str)
{
    std::cout << "l-value contains " << str << std::endl;
}

void fcn(std::string&& str) // <- on utilise '&&' derrière le type pour définir une r-value reference
{
    std::cout << "r-value contains " << str << std::endl;
}

int main()
{
    std::string str = "toto";
    fcn(str);                       // => fcn(const std::string&)
    fcn(std::string { "tata" });    // => fcn(std::string&&)
    return 0;
}
```

Bien sûr, si vous retirez la surcharge `fcn(std::string&&)`, le programme continuera de compiler puisque jusqu'ici, vos programmes ont compilés (enfin j'espère) sans que vous ayiez eu besoin d'écrire `&&`.
En effet, si le compilateur ne trouve pas de surcharge acceptant une `T&&`, alors il se rabattera sur une surcharge acceptant un `T` ou un `const T&`.

Bien qu'une r-value puisse être convertie en const l-value, sachez que l'inverse n'est pas possible.
Si le seul overload de votre fonction attend une r-value, vous ne pourrez pas compiler un appel fournissant une l-value.
Essayez donc de commenter la surcharge `fcn(const std::string&)` dans le snippet de code ci-dessus.
L'instruction `fcn(str)` ne devrait plus compiler, alors que `fcn(std::string { "tata" })` ne posera pas de problème.

**Mais quel est l'intérêt d'avoir tout ce bazar ?**

Revenons sur votre chapitre préféré : l'ownership 😈

En fait, lorsque vous définissez une fonction qui attend une r-value, vous êtes en train d'indiquer à l'appelant que vous souhaiteriez voler l'argument qu'il vous envoie.
L'intérêt est d'éviter des copies coûteuse, puisque quand on vole / déplace quelque chose, on ne le copie pas.

Dans le cas où l'appelant vous envoie une r-value directement, cela n'a pas d'importance, parce qu'il n'avait pas encore stocké cet objet de son côté.
En revanche, s'il cherchait à passer une l-value, il serait obligé d'utiliser `std::move` pour indiquer qu'il est prêt à céder cet objet à la fonction appelante et à ne plus le réutiliser ensuite.

```cpp
void steal_and_assign_name(Person& person, std::string&& name)
{
    person.name = std::move(name);
    // Le buffer alloué pour `name` a été déplacé dans `person.name`.
    // A partir de maintenant, l'utilisation de `name` n'est plus valide.
}

int main()
{
    Person p;
    std::string name = "Toto";

    steal_and_assign_name(p, std::move(name));
    // On est obligé d'utiliser `std::move`, car `steal_and_assign_name` attend une r-value.
    // Si le compilateur ne nous avait pas obligé à le faire, il aurait fallu regarder l'implémentation
    // de `steal_and_assign_name` pour comprendre que `name` a été invalidé.

    return 0;
}
```

{{% notice tip %}}
Après avoir `std::move` un objet, il faut être prudent, car son contenu a probablement été extrait par la fonction à laquelle il a été passé.
{{% /notice %}}

Un autre intérêt des r-values, c'est de pouvoir manipuler certains objets non-copiables.
Si vous consultez la documentation de `std::unique_ptr` par exemple, vous pourrez voir que son constructeur de copie ainsi que son opérateur d'assignation par copie sont supprimés.
En revanche, il est tout de même possible de construire un `unique_ptr` à partir d'un autre `unique_ptr`, du moment que l'on déplace ce dernier.

Cela est possible parce que `unique_ptr` définit un move-constructor et un opérateur d'assignation par déplacement.
Il s'agit de surcharges acceptant des r-value references de `unique_ptr` au lieu de const-ref.
```cpp
unique_ptr(unique_ptr&&);
unique_ptr& operator=(unique_ptr&&);
```

Le code suivant est donc tout à fait valide, puisque le compilateur réussira bien à trouver les fonctions permettant de compiler ses instructions :
```cpp
std::unique_ptr<int> p1 = std::make_unique<int>(3);
std::unique_ptr<int> p2 { std::move(p1) }; // => appel à unique_ptr(unique_ptr&&)
std::unique_ptr<int> p3;
p3 = std::move(p2);                        // => appel à operator=(unique_ptr&&)
```

---

### Référence universelle et perfect-forwarding

Revenons maintenant à nos moutons et parlons template !

Supposons que vous avez cette superbe fonction, permettant d'insérer une valeur dans un conteneur disposant d'une fonction `emplace_back` :
```cpp
template <typename Ctn, typename T>
void generic_emplace(Ctn& ctn, T value)
{
    ctn.emplace_back(value);
}
```

Voici différents appels à cette fonction, ainsi que le code généré par le compilateur pour chacun d'entre eux :
```cpp
std::list<int> values;
generic_emplace(values, 3);
// void generic_emplace(std::list<int>& ctn, int value)
// {
//     ctn.emplace_back(value);
// }

std::vector<std::string> names;
const std::string str = "toto";
generic_emplace(names, str);
// void generic_emplace(std::vector<std::string>& ctn, std::string value)
// {
//     ctn.emplace_back(value);
// }

std::deque<std::unique_ptr<int>> ptrs;
generic_emplace(ptrs, std::make_unique<int>(3));
// void generic_emplace(std::deque<std::unique_ptr<int>>& ctn, std::unique_ptr<int> value)
// {
//     ctn.emplace_back(value);
// }
```

Le premier appel va compiler sans aucun problème.\
Le second appel va également compiler, mais on note qu'on réalise une copie inutile.\
Par contre, le troisième appel ne va pas compiler du tout, car `ctn.emplace_back(value)` va tenter d'appeler le constructeur de copie de `unique_ptr`, qui n'existe pas.

Ce qu'on aimerait idéalement avoir au moment de la génération, c'est donc plutôt cela :
```cpp
std::list<int> values;
generic_emplace(values, 3);
// void generic_emplace(std::list<int>& ctn, int value)
// {
//     ctn.emplace_back(value);
// }

std::vector<std::string> names;
const std::string str = "toto";
generic_emplace(names, str);
// void generic_emplace(std::vector<std::string>& ctn, const std::string& value) -> const-ref pour économiser une copie
// {
//     ctn.emplace_back(value);
// }

std::deque<std::unique_ptr<int>> ptrs;
generic_emplace(ptrs, std::make_unique<int>(3));
// void generic_emplace(std::deque<std::unique_ptr<int>>& ctn, std::unique_ptr<int>&& value) -> r-value car on vole le ptr
// {
//     ctn.emplace_back(std::move(value)); -> pour le placer dans ctn avec un move
// }
```

Afin de pouvoir arriver à un comportement approximativement similaire, il faut utiliser des références universelles d'une part, et du perfect-forwarding de l'autre.

Commençons par les références universelles.
Voici la syntaxe :
```cpp
template <typename Ctn, typename T>
void generic_emplace(Ctn& ctn, T&& value) // <- on ajoute && sur T
{
    ctn.emplace_back(value);
}
```

**Heeeeeein ? Mais on vient de voir que `&&`, ça sert à faire des r-value references !** 

Et bah pas dans ce cas...\
Si vous mettez `&&` sur un type précis, comme `int&&` ou `std::string&&`, vous êtes effectivement en train d'attendre qu'on vous passe une r-value de ce type.\
En revanche, si vous mettez `&&` sur un type générique défini comme argument de template de la fonction, vous êtes en train de définir une référence universelle.\
Cela signifie que **votre fonction pourra attendre n'importe quoi, qu'il s'agisse d'une ref, d'une const-ref ou d'une r-value reference.**

Personnellement, je pense qu'il s'agit du pire choix de réutilisation de syntaxe qui a été fait en C++...
D'une part, ça fait qu'il n'est pas possible d'utiliser `T&&` pour restreindre l'usage d'une fonction-template à une r-value.
Et d'autre part, c'est le troll ultime du mec qu'a décidé que le C++, fallait que ça soit dur.
Déjà que c'est pas simple de comprendre la différence entre l-value et r-value, que c'est pas simple non plus d'apprendre à faire des templates, il fallait en plus qu'ils choisissent la même syntaxe pour exprimer deux notions complètement différentes, mais qui sont un peu liées quand même... 

Enfin bref, retenez simplement que si vous écrivez `T&&` dans le cas où `T` est un argument de template de la fonction, alors c'est une référence universelle (c'est-à-dire que `T&&` sera remplacé par le type exact de l'expression passée en paramètre à la fonction) et pas une r-value reference.
Vous pouvez aussi lire {{% open_in_new_tab "https://isocpp.org/blog/2012/11/universal-references-in-c11-scott-meyers" "cet article" /%}} si vous souhaitez apprendre à distinguer une r-value reference d'une référence universelle à tous les coups !

Revenons au code précédent.
```cpp
template <typename Ctn, typename T>
void generic_emplace(Ctn& ctn, T&& value)
{
    ctn.emplace_back(value);
}
```

Voici les fonctions qui seront maintenant générées par chacun des appels :
```cpp
std::list<int> values;
generic_emplace(values, 3);
// Comme on passe `3` qui est une r-value, la référence universelle est transformée en r-value reference
// void generic_emplace(std::list<int>& ctn, int&& value)
// {
//     ctn.emplace_back(value);
// }

std::vector<std::string> names;
const std::string str = "toto";
generic_emplace(names, str);
// Comme on passe `str` qui est une l-value constante, la référence universelle est transformée en const-ref
// void generic_emplace(std::vector<std::string>& ctn, const std::string& value)
// {
//     ctn.emplace_back(value);
// }

std::deque<std::unique_ptr<int>> ptrs;
generic_emplace(ptrs, std::make_unique<int>(3));
// Comme on passe `std::make_unique<int>(3)` qui est une r-value, la référence universelle est transformée en r-value reference
// void generic_emplace(std::deque<std::unique_ptr<int>>& ctn, std::unique_ptr<int>&& value)
// {
//     ctn.emplace_back(value);
// }
```

Le premier appel compile toujours.
Le second appel compile lui aussi, et on a réussi à économiser la copie inutile que l'on faisait avant.\
En revanche, le troisième appel ne toujours compile pas, car bien que la signature de `generic_emplace` ait changée, une fois à l'intérieur de la fonction, c'est toujours le constructeur de copie de `unique_ptr` que le compilateur tente d'utiliser.

Eh oui, même si `value` est de type `std::unique_ptr<int>&&`, l'expression `value` est une l-value (contre-intuitif n'est-ce pas ? 🤪).
Rappelez-vous, si une expression fait référence à un objet particulier, et que cet objet n'est pas détruit une fois l'instruction exécutée, c'est qu'il s'agit d'une l-value.
```cpp
void fcn(std::string&& str)
{
    std::cout << str << std::endl;
    // str n'a pas été détruite à la fin de l'instruction précédente => l-value

    std::cout << std::string { "toto" } << std::endl;
    // la std::string construite a été détruite à la fin de l'instruction => r-value
}
```

Du coup, pour en revenir à `generic_emplace`, lorsqu'on écrit `ctn.emplace_back(value)`, on appelle le copy-constructor de `unique_ptr` au lieu du move-constructor, car l'expression `value` est une l-value et non pas une r-value. 

Afin de transformer cette l-value en r-value, on utilise une technique nommée **perfect-forwarding**, reposant sur l'utilisation de la fonction `std::forward` définie dans `<utility>`.
```cpp
template <typename T>
void perfect_forwarder(T&& universal_ref)
{
    // std::forward, c'est un peu comme std::move, si ce n'est qu'il faut rajouter <T> (sans les &&) à l'appel.
    do_something(std::forward<T>(universal_ref));
}
```

Le comportement de `std::forward` est le suivant :\
\- si `universal_ref` est de type `const T&`, alors l'expression `std::forward<T>(universal_ref)` est une l-value de type `const T&`,\
\- si `universal_ref` est de type `T&`, alors l'expression `std::forward<T>(universal_ref)` est une l-value de type `T&`,\
\- si `universal_ref` est de type `T&&` (au sens r-value reference et pas référence universelle), alors l'expression `std::forward<T>(universal_ref)` est une r-value de type `T&&`.

Du coup, on peut réécrire `generic_emplace` de cette manière :
```cpp
template <typename Ctn, typename T>
void generic_emplace(Ctn& ctn, T&& value)
{
    ctn.emplace_back(std::forward<T>(value));
}
``` 

Ainsi, le code généré sera le suivant, et il n'y aura plus d'erreur de compilation :
```cpp
std::list<int> values;
generic_emplace(values, 3);
// void generic_emplace(std::list<int>& ctn, int&& value)
// {
//     ctn.emplace_back(static_cast<int&&>(value));
//     -> Le static_cast ne change rien ici, vu que int est un type primitif
//        Il n'y a effectivement pas de move-constructor ni de copy-constructor, juste le processeur qui change la valeur des octets en mémoire
// }

std::vector<std::string> names;
const std::string str = "toto";
generic_emplace(names, str);
// void generic_emplace(std::vector<std::string>& ctn, const std::string& value)
// {
//     ctn.emplace_back(static_cast<const std::string&>(value));
//     -> Le static_cast ne change rien ici non plus, mais pour une autre raison.
//        `value` est déjà une l-value de type `const std::string&`, ce qui est aussi le cas de `static_cast<const std::string&>(value)`.
// }

std::deque<std::unique_ptr<int>> ptrs;
generic_emplace(ptrs, std::make_unique<int>(3));
// void generic_emplace(std::deque<std::unique_ptr<int>>& ctn, std::unique_ptr<int>&& value)
// {
//     ctn.emplace_back(static_cast<std::unique_ptr<int>&&>(value));
//     -> Le static_cast permet ici d'appeler `unique_ptr(unique_ptr&&)` plutôt que `unique_ptr(const unique_ptr&)`.
//        `value` est une l-value de type `std::unique_ptr<int>&&`, alors que `static_cast<std::unique_ptr<int>&&>` est une r-value de type `std::unique_ptr<int>&&`.
// }
```

---

### Conclusion

En C++, la plupart des expressions sont classées en deux grandes catégories : les l-values et les r-values.\
Les expressions l-values sont généralement des noms de variables, comme `value`, ou bien des appels de fonctions qui renvoient des l-value references, comme `vec.emplace_back(3)`.\
Les expressions r-values englobent à peu près tout le reste, à savoir les calculs, les litéraux qui ne sont pas des chaînes de caractères, les appels de fonctions qui renvoient un temporaire, les appels à `std::move`, etc.

Lorsque que dans une fonction-template, vous souhaitez transmettre à une autre fonction l'un de vos paramètres par l-value si on vous l'avait passé par l-value, et par r-value si on vous l'avait passé par r-value, il faut :
1. utiliser une référence universelle pour définir ce paramètre,
2. passer ce paramètre à l'autre fonction en utilisant `std::forward`.

```cpp
#include <utility>

template <typename Plat>
void passe_plat(Serveur& serveur, Plat&& plat)
{
    serveur.recoit(std::forward<Plat>(plat));
}
```
