---
title: "Autres conteneurs séquentiels"
weight: 3
---

Vous allez maintenant manipuler les autres conteneurs séquentiels que la libraire propose.

---

Pour cet exercice, vous modifierez le fichier :\
\- `chap-05/2-sequentials.cpp`

La cible à compiler est `c5-2-sequentials`.

---

### Tableaux de taille fixe

Pour créer des tableaux de taille fixe, il est bien entendu possible d'utiliser les tableaux primitifs. L'inconvénient, c'est qu'il faut penser à les initialiser, ce que tout le monde ne pense pas toujours à faire....

Du coup, pour pallier à ce problème, il est possible d'utiliser la classe `std::array`. Dans les paramètres de template, il faut préciser le type des éléments, comme pour `vector`, mais il faut également indiquer la taille du tableau :
```cpp
std::array<int, 3> an_array_with_3_elements;
```

{{% notice info %}}
Lorsque vous fournissez une expression à un paramètre de template, il faut que le compilateur soit capable de calculer la valeur de cette expression au moment de la compilation.\
Si vous essayez d'utiliser une variable pour indiquer la taille d'un `std::array`, vous aurez donc une erreur de compilation.
{{% /notice %}}

**Dans quelle situation peut-on utiliser un `std::array` ?**

Un des cas d'utilisation classique est lorsque l'on souhaite créer un tableau associatif indexé par des entiers de 0 à N.\
Cela s'y prête d'autant plus lorsque l'indice est en réalité une **enumération**.

{{% notice note %}}
Pour définir et utiliser des `enum` en C++, c'est un peu plus simple qu'en C : il n'y a pas besoin de faire de `typedef` pour référencer l'enum par son nom.
{{% /notice %}}

Dans le code de base du fichier, vous pouvez trouver une énumération `Fruit`, contenant les valeurs `Apricot`, `Cherry`, `Mango` et `Raspberry`. Vous avez également une dernière valeur `Fruit_Count`, qui contient donc le nombre de valeurs de l'enum.\
Définissez un `array` servant à indiquer pour chaque fruit possible le nom de ce fruit. Assignez ensuite dans chaque case la valeur appropriée.

{{% expand "Solution" %}}
```cpp
std::array<std::string, Fruit_Count> fruit_names;
fruit_names[Apricot] = "apricot";
fruit_names[Cherry] = "cherry";
fruit_names[Mango] = "mango";
fruit_names[Raspberry] = "raspberry";
```
{{% /expand %}}

**C'est quoi l'intérêt d'utiliser un `array`, alors qu'on peut faire la même chose, et même plus, avec un `vector` ?**

Une partie de la réponse est dans la question : en programmation, faire plus, c'est rarement synonyme de faire mieux...\
Lorsqu'une classe permet de répondre exactement à un besoin, il vaut mieux utiliser cette classe là plutôt qu'en utiliser une autre qui répond aussi au besoin, mais vous permet en plus de faire le café, nettoyer les toilettes et détruire le monde. Pourquoi ? Tout simplement parce que moins il y a de code à devoir supporter, plus c'est simple de maintenir ses programmes et de les faire évoluer.

Une autre raison de préférer l'usage d'un `array` à un `vector` est de réduire le nombre d'allocations dynamiques du programme. En effet, contrairement aux `vector`, l'espace de stockage des `array` peut être placé sur la pile. C'est donc toujours intéressant de s'économiser des opérations coûteuses lorsqu'on en a la possibilité.

---

### Listes chaînées

La librairie standard implémente les classes `std::list` et `std::forward_list`, qui représente respectivement des listes doublement et simplement chaînées.

L'intérêt des listes vis-à-vis des tableaux, c'est qu'il est possible d'insérer ou de supprimer des éléments en O(1). De nouvelles fonctions de modifications sont donc disponibles dans l'interface de la liste, comme `merge` (fusionner deux listes), `splice` (insérer une liste au milieu d'une autre), `remove` (retirer des éléments selon leur valeur) ou encore `sort` (trier la liste).

L'inconvénient, c'est qu'il n'est plus possible d'accéder à un élément depuis sa position en O(1). D'ailleurs, l'opérateur `[]` n'est pas disponible sur les listes de la STL.

Dans la fonction `try_lists`, quatres listes vides sont définies. Commencez par leur ajouter des valeurs (de la manière de votre choix).\
Faites ensuite en sorte de regrouper `l1` et `l2` dans une même liste ordonnée. Faites de même avec `l3` et `l4`.\
Placez enfin le résultat du deuxième groupement en plein milieu du premier groupement.

{{% expand "Solution" %}}
```cpp
// There are many differentes ways to put values in a list.
std::list<int> l1 { -2, -3, 7, 200, -8, 6 };
std::list<int> l2(3, -45);

std::list<int> l3;
l3.assign({ 41, 6, 12 });

std::list<int> l4;
l4.emplace_front(0);
l4.emplace_front(4);
l4.emplace_front(6);

// First possibility : sort first, then use merge.
l1.sort();
l2.sort();
l1.merge(l2);

// Second possibility : append one to the other, then use sort.
l3.splice(l3.begin(), l4);
l3.sort();

// Find the middle of the list by using function std::advance, and insert the other list at this position.
auto mid = l1.begin();
std::advance(mid, l1.size() / 2);
l1.splice(mid, l3);
```
{{% /expand %}}

**Concrètement, que peut-on faire avec une `list` que l'on ne peut pas faire avec une `forward_list` ?**

Dans une `forward_list`, on ne connaît que le début de la liste. Il faut donc la parcourir en entière si on veut accéder à la fin. Il n'est aussi pas possible de la parcourir à l'envers.\
A part cela, les autres opérations sont disponibles avec la même complexité.

---

### Pile ou File

Les derniers conteneurs que nous allons ici sont les piles `std::stack` et les files `std::queue`. Nous n'allons pas rappeler en détail ce que sont les piles ou les files, mais si vous avez tout oublier de vos cours d'algorithmique, sachez au moins que dans une pile, les insertions et suppressions sont effectuées en fin de conteneur, alors que dans une file, les suppressions s'effectuent en tête et les insertions en fin de conteneur.

Dans le cas de la STL, `stack` et `queue` ont la particularité d'être des adapteurs. Cela signifie que vous pouvez choisir l'implémentation que vous souhaitez utiliser en interne. La seule contrainte, c'est que la classe sous-jacente doit fournir certaines fonctions. Par exemple, dans le cas de la pile, on pourrait utiliser `vector` ou `list`, mais pas `forward_list` car elle ne définit pas `push_back` :\
![](/CPP_Learning/images/chapter5/doc-stack-constraints.png)

Sur l'image ci-dessus, on vous précise quel conteneur est utilisé par défaut si vous n'en spécifier aucun (c'est-à-dire si vous écrivez juste `std::stack<int>`, au lieu de `std::stack<int, smtg>`). De quelle classe s'agit-il ?\
En cherchant un petit peu dans sa documentation, essayez de trouver une raison pour laquelle la librairie a décidé d'utiliser ce conteneur là par défaut.

{{% expand "Solution" %}}
Par défaut, `stack` est implémentée au moyen d'une `std::deque`. L'avantage de cette classe pour l'implémentation d'une pile, c'est qu'elle est très efficace pour ajouter et retirer des éléments en fin de conteneur (complexité en O(1)), et lors de ces opérations, les itérateurs sur les autres éléments ne sont jamais invalidés (= plus de sécurité). Elle est aussi plus performante que le `vector` lors des réallocations (pas de copie des éléments existants).
{{% /expand %}}

Vous allez maintenant instancier une `stack` utilisant comme implémentation sous-jacente un `vector<int>`, plutôt qu'une `deque`. Pour cela, il suffit de spécifier le type de conteneur dans un second paramètre de template.\
Faites en sorte que la `stack` contienne à la fin `{ 0, 1, 2 }`.

{{% expand "Solution" %}}
```cpp
// The stack can be initialized from nothing, and then values are added with push or emplace.
std::stack<int, std::vector<int>> s1;
s1.emplace(0);
s1.emplace(1);
s1.emplace(2);

// It can also be initialized from an already existing container, matching the type used internally.
std::vector<int> v { 0, 1, 2 };
std::stack<int, std::vector<int>> s2 { v };
```

Notez que les deux syntaxe `s2 { v }` et `s2(v)` fonctionnent, puisque `stack` n'a pas de constructeur par initializer_list.
{{% /expand %}}

Essayez maintenant de parcourir la `stack` via une boucle `for` pour l'afficher (pas foreach). Qu'est-ce qui pose problème ?

{{% expand "Solution" %}}
Dans une pile, on ne peut accéder qu'au premier élément. La classe `stack` ne fournit donc pas l'ensemble des fonctions dont dispose le conteneur sous-jacent, et c'est bien là son intérêt.\
Si on décide de définir un attribut d'une classe en tant que `stack` plutôt qu'en tant que `vector`, on ajoute en fait des contraintes sur les opérations qu'il est possible d'effectuer sur ce membre. Cela permet donc d'enforcer les invariants de la classe plus facilement.
{{% /expand %}}

Retentez maintenant le parcours via une boucle `foreach`. Essayez de compiler, et déduisez-en le nom des fonctions attendues par le compilateur pour pouvoir parcourir un conteneur via une boucle `foreach`.

{{% expand "Solution" %}}
Le compilateur nous dit ceci :
```shell
error: 'begin' was not declared in this scope
error: 'end' was not declared in this scope
```

On peut donc en déduire que pour qu'une classe soit itérable via une boucle foreach, il semblerait qu'elle doive fournir deux fonctions appelées `begin` et `end`. Nous y reviendrons au cours du [Chapitre 6](/chapter6/). 
{{% /expand %}}
