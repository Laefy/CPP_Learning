---
title: "Template variadique"
weight: 2
---

Un template variadique, c'est un template qui attend un nombre variable de paramètres. 
Vous en avez déjà utilisé plusieurs, comme :\
\- la fonction-template `emplace_back` de `std::vector`, qui attend n'importe quels nombres et types d'arguments, et les utilisent pour construire le nouvel élément,\
\- la fonction-template `std::make_unique`, qui fonctionne sur le même principe,\
\- la classe-template `std::tuple`, qui permet de représenter un N-uplet contenant n'importe quels types.

L'objectif de cette section sera de vous apprendre à définir vos propres templates variadiques.

---

### Parameter packs et substitutions

Commençons par la syntaxe permettant d'indiquer qu'un template peut recevoir un nombre variable de paramètres.
```cpp
template <typename... Ts>   // -> on écrit `...` entre le type (ici typename) et le nom du paramètre (ici T)
void fcn(Ts... params)      // -> on écrit encore `...` entre le type (ici Ts) et le nom du paramètre (ici params) 
```

On parlera de **parameter pack de template** pour désigner `Ts` et de **parameter pack de fonction** pour désigner `params`.

Comme n'importe quel paramètre de fonction-template, il est possible de qualifier `Ts` avec `&` (l-value non-constante), `const &` (l-value constante) ou `&&` (référence universelle) :
```cpp
template <typename... Ts>
void fcn_ref(Ts&... params)

template <typename... Ts>
void fcn_const_ref(const Ts&... params)

template <typename... Ts>
void fcn_universal_ref(Ts&&... params)
```

Cela impactera bien sûr la possibilité pour le compilateur de générer une fonction à partir d'un appel donné, ainsi que la signature de l'éventuelle fonction générée :
```cpp
int v1 = 3;
char v2 = 'A';
const std::string v3 = "toto";

// Il est toujours possible de substituer Ts&... / const Ts&... / Ts&&... avec "rien". 
fcn_ref();
fcn_const_ref();
fcn_universal_ref();

// Ts&... ne peut être substitué que par des l-values (constantes ou pas)
fcn_ref(v1, v2); // ok : Ts&... -> int&, char&
fcn_ref(v1, 3);  // pas ok, car 3 est une r-value
fcn_ref(v3);     // ok : Ts&... -> const std::string&

// const Ts&... peut être substitué par n'importe quoi (les r-value et l-value non-const seront converties en l-value const si nécessaires)
fcn_const_ref(v1, v2); // ok : Ts&... -> const int&, const char&
fcn_const_ref(v1, 3);  // ok : Ts&... -> const int&, const int&
fcn_const_ref(v3);     // ok : Ts&... -> const std::string&

// Ts&&... peut évident être subtitué par n'importe quoi (c'est le principe de la référence universelle)
fcn_universal_ref(v1, v2); // ok : Ts&... -> int&, char&
fcn_universal_ref(v1, 3);  // ok : Ts&... -> int&, int&&
fcn_universal_ref(v3);     // ok : Ts&... -> const std::string&
```

Un petit point à noter : il n'est pas possible de restreindre les paramètres d'un pack à un type donné.\
Le code suivant n'est du coup pas valide :
```cpp
void give_me_some_ints(int... params)
{ /* ... */ }
```

Il existe différentes méthodes permettant d'obtenir ce genre de comportement.
Nous détaillerons l'une d'entre elles dans la dernière partie de ce chapitre.

---

### Pack expansion

Bon, c'est bien de pouvoir définir des parameter packs, mais ce serait mieux de pouvoir aussi s'en servir... 

La première façon d'utiliser un parameter pack, c'est de le passer à un autre template ou fonction.
On parlera dans ce cas de **pack expansion**.

Voici un exemple dans lequel on passe notre parameter pack de template à une autre classe-template :
```cpp
template <typename... Ts>
class SomeStuff
{
public:
    /* ... */

private:
    std::tuple<Ts...> _tuple; // -> pack expansion : `Ts...`
};

// En utilisant SomeStuff<int, char, double>, la génération du pack expansion donne :
// std::tuple<int, char, double> _tuple;
```

Et voici un exemple dans lequel on transfère notre parameter pack de fonction dans un autre appel de fonction :
```cpp
template <typename Ctn, typename... Args>
void copy_to(Ctn& ctn, const Args&... args)
{
    ctn.emplace_back(args...); // -> pack expansion : `args...` 
}

// En appelant copy_to(persons, 3, name), le compilateur pourrait générer quelque chose comme :
// void copy_to(std::vector<Person>& ctn, const int& p1, const std::string& p2)
// {
//     ctn.emplace_back(p1, p2); 
// }
```

Dans les 2 exemples ci-dessus, le motif répété par le pack expansion correspondait uniquement aux paramètres du pack.
Mais il est possible d'élargir le motif à répéter, en plaçant les `...` ailleurs que juste après le nom du pack.

Reprenons `generic_emplace` pour voir ce que cela donne avec le perfect forwarding :
```cpp
template <typename Ctn, typename... Args>
void generic_emplace(Ctn& ctn, Args&&... args)
{
    ctn.emplace_back(std::forward<Args>(args)...);
}

// En plaçant les ... derrière l'appel à `forward` plutôt que derrière `args`, la génération du parameter pack donnerait :
// `std::forward<A1>(a1), std::forward<A2>(a2), ...` dans l'appel à `emplace_back`
// plutôt que :
// `a1, a2, ...` dans l'appel à `forward`.
```

Voici un autre exemple, qui ajoute 3 à chacun des paramètres, les sérialisent et les regroupent dans un `vector` :
```cpp
template <typename... Values>
std::vector<std::string> add_3_and_stringify(const Values&... values)
{
    return std::vector<std::string> { std::to_string(values + 3)... };
}

// Ici, le parameter pack expansion donnera quelque chose comme :
// return std::vector<std::string> { std::to_string(v1 + 3), std::to_string(v2 + 3), ... };
```

---

### Fold expressions

Les fold expressions constituent la deuxième manière d'utiliser les parameter packs.

Avec les pack expansions, on peut générer un motif `arg1, arg2, ..., argN` à passer en paramètre de template ou de fonctions.\
Avec les fold expressions, on va pouvoir générer ce même type de motifs, mais en utilisant des opérateurs binaire (`+`, `-`, `&&`, ...) au lieu de la virgule de séparations d'arguments.
Les fold expressions permettent donc de réaliser des réductions sur des parameter packs.

En supposant que `op` est un opérateur binaire quelconque, voici la syntaxe d'une fold expression :
```cpp
(args op ...) // -> associativité droite -> gauche : a1 op (a2 op (... op (aN-1 op aN)))
(... op args) // -> associativité gauche -> droite : (((a1 op a2) op ...) op aN-1) op aN
```

{{% notice info %}}
Notez bien que les parenthèses englobant la fold expression sont nécessaires.
Sans elles, le programme ne compilera pas.
{{% /notice %}}

On peut donc réaliser une somme simplement en écrivant :
```cpp
template <typename... Values>
auto sum(const Values&... values)
{
    return (values + ...);
}
```

Il est également possible de spécifier l'élément neutre de la réduction en l'ajoutant de l'autre côté des `...` :
```cpp
template <typename... Values>
auto sum_starting_at_10(const Values&... values)
{
    return (values + ... + 10);
}
```

Lorsqu'on commence à utiliser les fold expressions, il devient très intéressant d'introduire l'opérateur binaire `,` (aussi appelé opérateur **comma**).\
Celui-ci permet d'évaluer des expressions de gauche à droite et de récupérer la valeur de la dernière expression.
```cpp
int print_and_return(int value) { std::cout << value << std::endl; }

int main()
{
    int last = (print_and_return(1), print_and_return(-1), print_and_return(3));
    std::cout << "Last is " << last << std::endl;
    return 0;
}

// Ce programme affiche :
// 1
// -1
// 3
// Last is 3
```

{{% notice info %}}
Encore une fois, on a affaire à un affreux cas de recyclage de syntaxe.\
Notez bien que le compilateur interprétera le symbole `,` à l'intérieur de `fcn(p1, p2, ...)` comme le séparateur d'arguments dans l'appel à une fonction `fcn`.\
Par contre, dans l'expression `(p1, p2, ...)` (avec "rien" devant la parenthèse) ou l'instruction `p1, p2, ...;`, il l'interprétera comme l'opérateur comma.
{{% /notice %}}

Pour en revenir aux templates variadiques, les fold expressions et les pack expansions permettent de générer des motifs à l'intérieur d'une même instruction.
Or, comme l'opérateur comma permet de réécrire plusieurs instructions sous la forme d'une seule, cela va permettre d'écrire le code des templates variadiques beaucoup plus facilement.

Supposons que l'on veuille écrire une fonction qui affiche tous les paramètres de notre fonction dans la console.
Si on travaillait avec une fonction normale à N paramètres, on pourrait avoir quelque chose comme :
```cpp
void print(int p1, char p2, const std::string& p3)
{
    std::cout << p1 << std::endl;
    std::cout << p2 << std::endl;
    std::cout << p3 << std::endl;
}
```

On pourrait ensuite réécrire cette fonction avec l'opérateur comma, pour n'avoir qu'une seule instruction, 
```cpp
void print(int p1, char p2, const std::string& p3)
{
    (std::cout << p1 << std::endl), (std::cout << p2 << std::endl), (std::cout << p3 << std::endl);
}
```

Enfin, pour généraliser cette fonction à n'importe quel nombre de paramètres, on remplacerait par :
```cpp
template <typename... Ts>
void print(const Ts&... params)
{
    ((std::cout << params << std::endl), ...);
    // Encore une fois, il ne faut pas oublier les parenthèses autour de la fold expression, ainsi
    // qu'autour du motif à répéter (car il n'y a pas qu'un seul symbole dans cette expression).
}
```

{{% notice tip %}}
L'avant-dernier snippet n'est pas un exemple de bonne pratique, au contraire.
Le but est juste de vous montrez les étapes pour passer de N instructions à 1 instruction, afin d'arriver au code du template variadique.\
Retenez qu'en général l'opérateur comma est utilisé pour implémenter du code de template variadique, ou éventuellement pour offusquer du code (il y a notamment des concours, dont le but est d'écrire le code le plus illisible possible).
{{% /notice %}}

---

### Position du pack

Dans un template variadique de classe, le paramètre pack doit nécessairement se trouver en dernière position :
```cpp
template <typename T1, typename T2, typename... Others> // OK
class C
{ /* ... */ };

template <typename T1, typename... Others, typename T2> // Pas OK
class C
{ /* ... */ };
```

Dans le cas d'un template de fonction, il peut se trouver ailleurs qu'à la dernière position uniquement si les paramètres spécifiés derrière le pack ...\
\- ... peuvent être déduits à partir des paramètres passés à la fonction,\
\- ... ou possèdent une valeur par défaut.
```cpp
template <typename Res, typename... Args> // OK
Res fcn(Args&&... args)
{ /* ... */ }

template <typename Res, typename... Args, typename Ctn = std::vector<Res>> // OK car Ctn a une valeur par défaut
Res fcn(Args&&... args)
{ /* ... */ }

template <typename Res, typename... Args, typename Arg1> // OK car Arg1 peut être déduit du type du paramètre `arg1`
Res fcn(Arg1 arg1, Args&&... other_args)
{ /* ... */ }

template <typename... Args, typename Res> // Pas OK car Res n'a pas de valeur par défaut et ne peut pas non plus être déduit des paramètres de la fonction
Res fcn(Args&&... args)
{ /* ... */ }
```

Enfin, pour les parameter packs de fonction, ceux-ci doivent toujours se trouver en dernière position, même si les paramètres suivants ont des valeurs par défaut.
```cpp
template <typename... Args>
void fcn(int p1, Args&&... args) // OK
{ /* ... */ }

template <typename... Args>
void fcn(int p1 = 0, Args&&... args) // OK aussi
{ /* ... */ }

template <typename... Args>
void fcn(Args&&... args, int pn = 0) // Pas OK car le parameter pack doit être en dernière position
{ /* ... */ }
```

---

### Exercices

Entraînez-vous en implémentant les fonctions suivantes :
- `concat` : reçoit un ensemble de paramètres, les convertit en `string` et les concatène 
- `product` : reçoit un ensemble de paramètres et calcule leurs produits
- `emplace_many` : ajoute des éléments dans un conteneur (N paramètres dans le pack => N éléments en plus dans le conteneur)
