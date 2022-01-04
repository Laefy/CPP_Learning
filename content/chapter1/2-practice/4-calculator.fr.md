---
title: "🧮 Calculette"
weight: 4
---

Dans cet exercice, vous refactoriserez le code d'une mini-calculette. Cela sera l'occasion de voir l'instruction switch, les fonctions et le passage de paramètres par référence. 

---

Pour cet exercice, vous modifierez le fichier :\
\- `chap-01/4-calculator.cpp`

La cible à compiler est `c1-4-calculator`.

---

### Comprendre le code existant

Commençons par parcourir le code fourni, afin de comprendre ce qu'il s'y passe.

```cpp
int main(int argc, char** argv)
{
    // Parsing program parameters.
    some code...

    // Process operation, depending on the operator.
    some code...

    // Output result.
    some code...

    return 0;
}
```

Déjà, en regardant les commentaires, on se rend compte que le programme comporte 3 étapes :
1. Traitement des arguments
2. Calcul de l'opération
3. Affichage du résultat

Nous allons décortiquer le code de chacune de ces étapes.

#### Traitement des arguments

```cpp
if (argc < 2)
{
    std::cerr << "Expected operator as first argument." << std::endl;
    return -1;
}
```

Ce premier `if` est plutôt simple à comprendre. Le programme attend pour premier argument un opérateur, donc si on a moins d'un argument (2 car `argv[0]` est le nom de la commande), on s'arrête.
{{% empty_line %}}

```cpp
std::string op = argv[1];
```

L'expression `argv[1]`, c'est-à-dire ce que l'on s'attend à être l'opérateur, est placée dans une `std::string`. Ecrire cette instruction a deux avantages :\
\- déjà, cela permet d'avoir un nom de variable un peu plus explicite que 'argv[1]', et donc de rendre le code plus clair,\
\- ensuite, on se retrouve avec une variable de type `std::string` plutôt que `char*`. Or, si on fait `==` entre deux `std::string`, on compare bien les chaînes de caractères, alors que si on fait `==` entre deux `char*`, on compare en fait deux adresses en mémoire (`char*` n'étant qu'un pointeur).
{{% empty_line %}}

```cpp
if (op != "+" && op != "*" && op != "-")
{
    std::cerr << "Expected operator to be '+', '*' or '-'." << std::endl;
    return -1;
}
```

Le programme ne supportant que les additions, multiplications ou soustractions, on s'arrête si l'opérateur ne correspond pas à l'une de ces trois opérations.
{{% empty_line %}}

```cpp
std::vector<int> values;
for (auto arg_i = 2; arg_i < argc; ++arg_i)
{
    auto value = std::stoi(argv[arg_i]);
    values.emplace_back(value); 
}
```

Un tableau de valeurs est défini, et il est rempli avec les arguments donnés au programme à la suite de l'opérateur. `std::stoi` est utilisée pour convertir les chaînes en entiers.\
La seule chose un peu étonnante ici, c'est l'utilisation de `auto` à la place de `int`. En fait, `auto` permet de ne pas avoir à spécifier en permanence les types que l'on manipule lorsque le compilateur peut les déduire par lui-même. Ici, en écrivant `auto arg_i = 2`, le compilateur est capable de déterminer que `arg_i` est de type `int`, puisqu'on l'initialise avec 2. Dans la ligne suivante, le compilateur est également capable de déduire tout seul que `value` sera de type `int`, car la fonction `stoi` retourne un résultat de type `int`.

{{% notice note %}}
Certaines personnes n'aiment pas utiliser `auto`, car elles trouvent que cela rend le code moins clair. C'est effectivement l'un des inconvénients, surtout si l'on n'utilise pas d'IDE. Si on utilise un IDE, ce problème est quasiment inexistant, puisqu'il suffit généralement de passer son curseur au-dessus du nom de la variable pour obtenir le vrai type.\
Personnellement, j'apprécie l'utilisation de `auto`, car cela évite d'avoir à écrire des types parfois longs et de toute manière incompréhensibles (par exemple, `std::vector<std::array<std::string, 3>>`), et de simplifier les refactos lorsque l'on renomme un type.\
Dans vos TPs, vous pouvez choisir ou non d'utiliser `auto`, ou même de ne l'utiliser que dans certains cas, tant que vous écrivez du C++ qui est valide 🙂
{{% /notice %}}

#### Calcul de l'opération

```cpp
auto result = 0;
```

Une variable appelée `result` est définie. On suppose de par son nom qu'elle servira à stocker le résultat de l'opération. Une fois de plus, `auto` est utilisé et comme la variable est initialisée avec 0, on peut en déduire qu'elle est de type `int`.
{{% empty_line %}}

```cpp
if (op == "+")
{
    for (auto v : values)
    {
        result += v;
    }
}
```

Si on doit réaliser une addition, le résultat est obtenu en incrémentant `result` de chacune des valeurs passées au programme.
{{% empty_line %}}

```cpp
else if (op == "*")
{
    result = 1;
    for (auto v : values)
    {
        result *= v;
    }
}
```

Pareil que plus haut, mais avec la multiplication. En revanche, il faut modifier la valeur initiale de `result`, car la valeur neutre pour le produit est 1 et pas 0. 
{{% empty_line %}}

```cpp
else if (op == "-")
{
    if (values.empty())
    {
        std::cerr << "Operator '-' expects at least one operand to substract from." << std::endl;
        return -1;
    }

    result = values[0];
    for (auto i = 1; i < values.size(); ++i)
    {
        result -= values[i];
    }
}
```

Dans le cas de la soustraction, le programme attend que la première valeur soit nécessairement fournie, car c'est de cette valeur que l'on déduit toutes les suivantes.

#### Affichage du résultat

Le programme termine par afficher le résultat dans la console :

```cpp
std::cout << "Result is " << result << std::endl;
```

---

### Extraction de chaque étape dans des fonctions

Nous allons d'abord extraire chacune des trois étapes dans une fonction différente.

Pour l'appel et la définition des fonctions, vous pouvez commencer par faire comme si vous étiez en C.
Vous aurez donc pour la **définition** de chaque fonction quelque chose comme : 
```cpp
return_type fcn_name(p1_type p1, p2_type p2, ...)
{
    // function body ...
}
```
Pour l'**appel** :
```cpp
fcn_name(arg1, arg2, ...);
```
Et si vous préférez définir vos fonctions après le `main`, il faudra penser à les **déclarer** au début du fichier cpp, juste après les includes : 
```cpp
return_type fcn1_name(p1_type p1, p2_type p2, ...);
return_type fcn2_name(p1_type p1, p2_type p2, ...);
...
```

#### Traitement des arguments

Cette fonction devra renvoyer trois informations :\
\- si les arguments sont valides ou non,\
\- l'opérateur,\
\- les opérandes.

La validité des arguments sera indiqué par la valeur de retour, de type `bool`.
Comme une fonction ne peut renvoyer qu'une seule valeur, nous utiliserons les paramètres pour récupérer l'opérateur et les opérandes. Comme en C, il faudra passer par des pointeurs, puisqu'autrement, les variables seront copiées.

Pour l'opérateur, vous allez récupérer un `char` au lieu d'une `string` complète. En effet, dans le restant du `main`, nous attendons soit '+', '\*' ou '-', donc nous n'avons pas besoin de stocker la chaîne complète au déjà du traitement des arguments.     

Voici donc la signature de la fonction que vous devez implémenter :
```cpp
bool parse_params(char* op, std::vector<int>* values, int arg, char** argv)
```

Modifiez le code du programme pour introduire cette fonction et l'appeler. Vérifiez que tout fonctionne comme avant.

{{< expand "Solution" >}}
<p>Le plus simple, c'est de couper-coller l'ancien code dans la fonction et de le modifier afin de fixer les erreurs :<br/>
- remplacer les <code>return -1</code> par des <code>return false</code>, et ajouter le <code>return true</code> à la fin,<br/>
- renommer <code>op</code> en <code>op_str</code>, puisqu'on introduit un paramètre du même nom, mais de type différent,<br/>
- assigner <code>op_str[0]</code> à <code>op</code> (il faut écrire <code>*op</code> puisque <code>op</code> est un pointeur),<br/>
- supprimer la définition de <code>values</code>, puisqu'on va directement remplir le tableau du même nom passé en paramètre,<br/>
- remplacer <code>values.emplace_back</code> par <code>values->emplace_back</code>, car <code>values</code> est maintenant un pointeur.</p>

{{< highlight cpp "hl_lines=1 6 10 13 16 21 24">}}
bool parse_params(char* op, std::vector<int>* values, int argc, char** argv)
{
    if (argc < 2)
    {
        std::cerr << "Expected operator as first argument." << std::endl;
        return false;
    }
 
    std::string op_str = argv[1];
    if (op_str != "+" && op_str != "*" && op_str != "-")
    {
        std::cerr << "Expected operator to be '+', '*' or '-'." << std::endl;
        return false;
    }

    *op = op_str[0];

    for (auto arg_i = 2; arg_i < argc; ++arg_i)
    {
        auto value = std::stoi(argv[arg_i]);
        values->emplace_back(value);
    }

    return true;
}
{{< /highlight >}}

<p>Au niveau du site de l'appel, on peut supprimer le commentaire, qui devient redondant avec le nom de la fonction, définir les variables qui vont contenir l'opérateur et les opérandes, et vérifier que la fonction renvoie bien <code>true</code> pour continuer.</p>
{{< highlight cpp >}}
char op = '?';
std::vector<int> values;

if (!parse_params(&op, &values, argc, argv))
{
    return -1;
}
{{< /highlight >}}

<p> Il faut enfin penser à remplacer dans le <code>main</code> les <code>"+"</code> par <code>'+'</code>, <code>"*"</code> par <code>'*'</code> et <code>"-"</code> par <code>'-'</code>, car <code>op</code> n'est plus une <code>string</code> mais un <code>char</code>.</p>

{{< /expand >}}

#### Calcul de l'opération

Ici, la fonction ne devrait avoir besoin de renvoyer que le résultat du calcul. Hélas, à l'intérieur du traitement de la soustraction, on peut quitter prématurément le programme si les arguments passés au programme sont invalides. La première étape consistera donc à déplacer cette vérification à l'intérieur de la fonction `parse_params`, qui est là pour ça.

Modifiez la fonction `parse_params` de manière à ce qu'elle renvoie `false` si l'utilisateur essaye d'effectuer une soustraction sans donner aucune valeur. Supprimez ensuite la vérification associée du `main`. Testez pour vérifier que tout fonctionne comme avant.

{{% expand "Solution" %}}
On peut ajouter le code ci-dessous à la fonction `parse_params`, juste avant le `return true` :
```cpp
if (*op == '-' && values->empty())
{
    std::cerr << "Operator '-' expects at least one operand to substract from." << std::endl;
    return false;
}
```
{{% /expand %}}

Vous pouvez maintenant facilement extraire le code permettant de calculer le résultat de l'opération dans une nouvelle fonction. Voici la signature attendue :
```cpp
int compute_result(char op, std::vector<int> values)
```
<br/>

{{% expand "Solution" %}}
Ce coup-ci, on peut vraiment directement couper-coller les instructions à l'intérieur de la fonction.
```cpp
int compute_result(char op, std::vector<int> values)
{
    auto result = 0;

    if (op == '+')
    {
        for (auto v : values)
        {
            result += v;
        }
    }
    else if (op == '*')
    {
        result = 1;
        for (auto v : values)
        {
            result *= v;
        }
    }
    else if (op == '-')
    {
        result = values[0];
        for (auto i = 1; i < values.size(); ++i)
        {
            result -= values[i];
        }
    }

    return result;
}
```
On appelle ensuite la fonction avec :
```cpp
auto result = compute_result(op, values);
```
{{% /expand %}}

#### Affichage du résultat

Rien de bien compliqué ici. Vous pouvez utiliser la signature suivante pour cette fonction :
```cpp
void display_result(int result)
```
<br/>

{{% expand "Solution" %}}
Voici la fonction `display_result` :
```cpp
void display_result(int result)
{
    std::cout << "Result is " << result << std::endl;
}
```
Et voici à quoi devrait maintenant ressembler votre `main` :
```cpp
int main(int argc, char** argv)
{
    char op = '?';
    std::vector<int> values;

    if (!parse_params(&op, &values, argc, argv))
    {
        return -1;
    }

    auto result = compute_result(op, values);
    display_result(result);

    return 0;
}
```

{{% /expand %}}

---

### Switch !

Le code de la calculette est maintenant un peu plus structuré. Vous allez maintenant remplacer les `if / else` dans la fonction `compute_result` par un `switch`. Le `switch` en C++, c'est exactement le même que celui du C. N'oubliez pas les `break` à la fin de chaque `case`.

{{% expand "Solution" %}}
```cpp
switch (op)
{
case '+':
    for (auto v : values)
    {
        result += v;
    }
    break;

case '*':
    for (auto v : values)
    {
        result += v;
    }
    break;
    
case '-':
    result = values[0];
    for (auto i = 1; i < values.size(); ++i)
    {
        result -= values[i];
    }
    break;

default:
    break;
}
```
{{% notice note %}}
Vous vous demandez pourquoi j'ai ajouté la clause par défaut alors que tous les cas ont été traités ? En fait, le compilateur n'est pas suffisamment malin pour se rendre compte que `op` ne peut pas prendre d'autres valeurs que celles indiquées. On ajoute donc la clause `default`, car sinon, on se retrouve avec des warnings. Et les warnings, c'est le début des erreurs.\
Si on voulait aller plus loin, on pourrait utiliser un `enum class` à la place d'un `char` pour indiquer au compilateur la liste exhaustive des valeurs à traiter.
{{% /notice %}}

{{% /expand %}}


Mmmmh, le résultat n'est pas forcément ultra lisible. En général, on évite de mettre trop de code dans les `cases`, surtout quand il s'agit de boucles ou de conditions.\
Pour corriger ça, ajoutez des fonctions `add`, `multiply` et `sub`, et appelez-les depuis votre switch.

{{% expand "Solution" %}}
```cpp
int add(std::vector<int> values)
{
    int result = 0;
    for (auto v : values)
    {
        result += v;
    }
    return result;
}

int multiply(std::vector<int> values)
{
    auto result = 1;
    for (auto v : values)
    {
        result *= v;
    }
    return result;
}

int sub(std::vector<int> values)
{
    auto result = values[0];
    for (auto i = 1; i < values.size(); ++i)
    {
        result -= values[i];
    }
    return result;
}

int compute_result(char op, std::vector<int> values)
{
    switch (op)
    {
    case '+':
        return add(values);

    case '*':
        return multiply(values);
            
    case '-':
        return sub(values);

    default:
        return 0;
    }
}
```
{{% /expand %}}

---

### Passage par référence

Je suppose que vous avez un peu grincer des dents tout à l'heure quand il a fallu utiliser des pointeurs pour modifier les valeurs des paramètres de nos fonctions. D'une part, c'est moche, d'autre part, ça peut cacher des problèmes. En effet, dans la fonction `parse_params`, vous avez reçu des pointeurs, mais à aucun moment, vous n'avez vérifié que ces pointeurs étaient valides (ou alors, vous êtes beaucoup trop prudents).\
En théorie, il faudrait donc ajouter des conditions avant de les déréférencer :
```cpp
if (op != nullptr)
{
    *op = ...
}

if (values != nullptr)
{
    for (...)
    {
        values->emplace_back(...);
    }
}
```

{{% notice info %}}
Profitez-en pour noter qu'en C++, on utilise `nullptr` plutôt que `NULL`. Pourquoi ? Tout simplement parce que `NULL` est un entier, alors que `nullptr` est un pointeur.\
Donc si vous avez deux fonctions qui ont le même nom, que l'une prend un paramètre de type `int`, et l'autre de type `int*`, vous appelerez la première fonction en passant `NULL`. Sauf que si vous aviez voulu appelez la première fonction, vous auriez probablement passé 0. Prenez donc désormais l'habitude d'utiliser `nullptr` plutôt que `NULL`.
{{% /notice %}}

Bonne nouvelle ! En C++, nous allons pouvoir retirer complètement ces pointeurs en utilisant ce qui s'appelle des **références**. Une référence, c'est simple, c'est une variable qui va faire référence à la même zone mémoire qu'une autre variable. C'est comme un pointeur en fait, mais sans les déréférencements, les adresses, les `nullptr`, et tout ce bazar là.

Voyons donc comment est-ce qu'on déclare une référence. C'est simple, il suffit de mettre un `&` derrière le type de la variable. Par exemple :
```cpp
int original = 3;
int& reference = original;
```

Et voilà ! Maintenant, si vous souhaitez modifier la valeur de `original`, vous pouvez bien sûr modifier `original` directement, mais vous pouvez aussi passer par `reference`. Il suffit de faire l'assignation, de la même manière qu'avec une variable classique :
```cpp
reference = 8;
```

Et si vous modifiez `original`, la valeur de `reference` est modifiée également. Eh bien oui, c'est normal, puisque les deux variables font référence au même bloc de mémoire. Vous pouvez d'ailleurs essayer d'imprimer leurs adresses pour en être convaincus.

{{% notice tip %}}
D'ailleurs, pour avoir l'adresse d'une variable, il faut aussi utiliser le caractère `&`. C'est un peu confusant tout ça... Hélas, en C++, on réutilise en permanence les mêmes symboles et les mêmes mots-clefs pour faire des choses différentes, ce qui est un peu dommage, mais ça permet d'assurer la rétro-compatibilité du langage.\
Pour savoir si on parle d'une référence ou d'une adresse, il suffit de regarder où est placé le `&`. Si c'est derrière le type d'une variable, c'est une référence. Si ce n'est pas derrière le type d'une variable, c'est probablement une adresse, ou alors une erreur de syntaxe...\
De toute manière, on ne peut parler de référence qu'à la définition d'une variable, puisqu'ensuite, on la manipule exactement de la même manière que n'importe quelle autre variable.
{{% /notice %}}

On va maintenant utiliser les références pour simplifier le code et le rendre plus efficace.

#### Passage par référence

Un des premier cas d'utilisation des références, c'est pour passer des paramètres à une fonction qui va les modifier.

Dans la fonction `parse_params`, commencez par changer le type de `op` pour passer d'un `char*` à un `char`, comme si vous souhaitiez passer le paramètre par copie. N'oubliez pas de modifier l'appelant pour que tout compile, puis faites de même pour `values`.

{{< expand "Solution" >}}
{{< highlight cpp "hl_lines=1 16 21 24">}}
bool parse_params(char op, std::vector<int> values, int argc, char** argv)
{
    if (argc < 2)
    {
        std::cerr << "Expected operator as first argument." << std::endl;
        return false;
    }
 
    std::string op_str = argv[1];
    if (op_str != "+" && op_str != "*" && op_str != "-")
    {
        std::cerr << "Expected operator to be '+', '*' or '-'." << std::endl;
        return false;
    }

    op = op_str[0];

    for (auto arg_i = 2; arg_i < argc; ++arg_i)
    {
        auto value = std::stoi(argv[arg_i]);
        values.emplace_back(value);
    }

    if (op == '-' && values.empty())
    {
        std::cerr << "Operator '-' expects at least one operand to substract from." << std::endl;
        return false;
    }

    return true;
}
{{< /highlight >}}

<p>Et dans le <code>main</code>, on retire les esperluettes :</p>
{{< highlight cpp "hl_lines=1">}}
if (!parse_params(op, values, argc, argv))
{
    return -1;
}
{{< /highlight >}}
{{< /expand >}}

Normalement, la calculette ne devrait plus fonctionner, puis qu'au retour de la fonction `parse_params`, les paramètres passés par valeur n'auront pas été modifiés. Heureusement, le fix va être très rapide. Il suffit de modifiez la signature de `parse_params` pour indiquer que `op` et `values` sont désormais des références. Le reste du code (corps de la fonction et appelant) n'a pas besoin d'être modifié. Testez pour vérifier que tout fonctionne à nouveau.

{{% expand "Solution" %}}
```cpp
bool parse_params(char& op, std::vector<int>& values, int argc, char** argv)
```
{{% /expand %}}

#### Passage par référence constante

Un autre cas d'utilisation des références, c'est pour passer des paramètres coûteux à copier à une fonction. Par exemple, pour passer des classes qui réalisent des allocations dynamiques en interne, comme std::vector ou std::string, on peut tout à fait décider d'utiliser des références pour éviter que ces allocations ne se fassent.

Le problème de passer d'une copie à une référence, c'est que l'on donne le pouvoir à la fonction de modifier des choses qu'on souhaiterait qu'elle ne modifie pas. Pour éviter cela, on va passer les paramètres en utilisant des **références constantes** (abbrégé const-ref). Pour définir une const-ref, il suffit d'ajouter le mot-clef `const` devant le type de la référence :
```cpp
int original = 3;
const int& const_ref = original;
```

Avec le code ci-dessus, vous pourrez lire le contenu de `const_ref`, mais vous ne pourrez pas le modifier. Si vous essayez d'écrire `const_ref = 8`, vous aurez une erreur de compilation.

Modifiez maintenant les signatures de `add`, `multiply`, `sub` et `compute_result` de manière à passer le tableau `values` par const-ref plutôt que par valeur.

{{% expand "Solution" %}}
```cpp
int add(const std::vector<int>& values) { ... }
int multiply(const std::vector<int>& values) { ... }
int sub(const std::vector<int>& values) { ... }
int compute_result(char op, const std::vector<int>& values) { ... }
```
{{% /expand %}}
