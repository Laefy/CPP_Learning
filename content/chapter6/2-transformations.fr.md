---
title: "Transformations"
weight: 2
---

Maintenant que nous vous avons présenté les fonctions permettant de récupérer des informations à partir d'une plage d'éléments, nous allons vous présenter celles qui permettent de manipuler et de transformer ces plages.

---

### Suppressions

Afin de supprimer des éléments d'une plage, on utilise la fonction `std::remove`.
Cette fonction a pour effet de déplacer les éléments à conserver au début de la plage, en préservant leur ordre.
Elle renvoie un itérateur sur le nouvel itérateur de fin de plage.

{{% notice warning %}}
`std::remove` permet d'éliminer des éléments d'une plage, pas de les supprimer d'un conteneur.
Si vous voulez supprimer les éléments du conteneur, il faut bien penser à appeler `erase` sur le conteneur.
{{% /notice %}}

```cpp
std::vector<int> values { 3, 0, 6, 3, 5, -4, 3, 5, 3 };

const auto new_end = std::remove(values.begin(), values.end(), 3);
// values contient maintenant { 0, 6, 5, -4, 5, ?, ?, ?, ? };

// On utilise values.erase afin de supprimer les éléments "éliminés" par remove.
values.erase(new_end, values.end());
```

On peut également utiliser la variante `std::remove_if` afin de retirer tous les éléments vérifiant un prédicat.
```cpp
std::vector<std::string> names { ... };

// Retire tous les noms vides du tableau.
names.erase(std::remove_if(names.begin(), names.end(), [](const std::string& n) { return n.empty(); }),
            names.end());
```

---

### Copies

Lorsqu'on veut copier une plage d'éléments, on peut utiliser `std::copy` ou `std::copy_n`.
```cpp
std::vector<int> src { ... }
std::vector<int> dst;

dst.resize(src.size());

// Avec copy : src_begin, src_end, dst_begin
std::copy(src.begin(), src.end(), dst.begin());

// Avec copy_n : src_begin, nb_elem, dst_begin
std::copy_n(src.begin(), src.count(), dst.begin());
```

Comme vous pouvez le constater, avant d'effectuer l'appel à `std::copy` / `std::copy_n`, il a fallu appeler `dst.resize(...)`.
Et oui, comme pour `remove`, `copy` ne permet pas de modifier la structure du conteneur d'éléments.
On doit donc s'assurer du fait que `dst` pointe sur un emplacement mémoire correctement alloué.

Une autre manière de gérer ce cas, c'est d'utiliser la fonction `std::back_inserter` (dans `<iterator>`)
Elle crée un itérateur de type `std::back_insert_iterator`, qui permet d'**insérer** des éléments dans un conteneur chaque fois qu'on essaye de l'assigner.
On peut donc réécrire le code de cette manière :
```cpp
std::vector<int> src { ... }
std::vector<int> dst;

// Chaque fois que l'algorithme va essayer de modifier le contenu de l'itérateur, ce dernier va appeler dst.push_back().
std::copy(src.begin(), src.end(), std::back_inserter(dst));
std::copy_n(src.begin(), src.count(), std::back_inserter(dst));
```

La STL propose également la fonction `copy_if`.
Celle-ci accepte un prédicat, qui permet de spécifier quels sont les éléments que l'on souhaite copier.
```cpp
std::vector<int> src { ... }
std::vector<int> dst;

std::copy_if(src.begin(), src.end(), std::back_inserter(dst), [](int v) { return v % 2 == 0; });
```

Pour le `copy_if`, l'utilisation de `back_inserter` est vraiment très intéressante, puisque sinon, le code ressemblerait à ça :
```cpp
std::vector<int> src { ... }
std::vector<int> dst;

dst.resize(src.size());
auto dst_end = std::copy_if(src.begin(), src.end(), dst.begin(), [](int v) { return v % 2 == 0; });
dst.erase(dst_end, dst.end());
```

---

### Transformation

La fonction `std::transform` sert à appliquer une fonction (au sens mathématique: `y = f(x)`) à tous les éléments d'une plage.

```cpp
std::vector<Dog> dogs { ... };
std::vector<std::string> names;

std::transform(dogs.begin(), dogs.end(), std::back_inserter(names), [](const Dog& dog) { return dog.get_name(); }); 
```

Lorsque la fonction appliquée retourne le même type que celui en paramètre, vous pouvez décider de construire le résultat sur la même plage que celle en entrée.
 
```cpp
std::vector<int> values { 0, 9, 4 };
std::transform(values.begin(), values.end(), values.begin(), [](int v) { return 2 * v - 3; });
// => values = { -3, 15, 5 }
```

---

### Remplissages

Pour remplir une plage d'éléments d'une même valeur, vous pouvez utiliser `std::fill` ou `std::fill_n`.
```cpp
// fill remplit la plage comprise entre values.begin() et values.end().
std::fill(values.begin(), values.end(), 5);

// fill_n remplit la plage de taille values.size() commençant à values.begin().
std::fill_n(values.begin(), values.size(), 5);
```

Et si vous souhaitez remplir la plage avec des valeurs différentes, vous pouvez utiliser `std::generate` ou `std::generate_n`.
Contrairement à `fill` qui attend une valeur bien précise, `generate` attend un générateur, c'est-à-dire un foncteur à 0 paramètre qui retourne un élément.
```cpp
std::generate(values.begin(), values.end(), create_random_value);

std::generate_n(values.begin(), values.size(), [&queue]()
{
    auto value = queue.front();
    queue.pop();
    return value;
});
```

Enfin, sachez qu'il est possible d'utiliser `back_inserter` avec `fill_n` et `generate_n`.
```cpp
std::fill_n(std::back_inserter(values), 5);

std::generate_n(std::back_inserter(values), [&queue]()
{
    auto value = queue.front();
    queue.pop();
    return value;
});
```

---

### Réductions

Une réduction est une opération qui accepte un ensemble d'éléments et retourne une valeur.
Par exemple, une somme et un produit sont des réductions.

Dans la librairie standard, a deux fonctions qui permettent de faire des réductions : `std::accumulate` et `std::reduce`.
Attention, elles se trouvent dans `<numeric>` et non pas dans `<algorithm>`. 

La différence entre `accumulate` et `reduce`, c'est que `reduce` ne doit être utilisé que pour des opérations à la fois associatives et commutatives.
En contre-partie, cela fait que `reduce` peut lancer des opérations sur des paires d'éléments en parallèle. 

```cpp
std::vector<int> values { 4, 3, 1, 0, 7, -8 };
// Le 3e paramètre correspond à l'élément initial (on passe en général l'élément neutre pour l'opération).
const auto product = std::reduce(values.begin(), values.end(), 1, [](int v1, int v2) { return v1 * v2; });

std::vector<std::string> names { ... }
// La concaténation de chaînes de caractères n'étant pas commutative, on ne peut pas utiliser reduce.
const auto many_names = std::accumulate(names.begin(), names.end(), "> ", [](const auto& str1, const auto& str2) { return str1 + " " + str2; });
```

---

### Réordonnancement

##### Tri

Pour trier une plage d'éléments, on utilise `std::sort`.
```cpp
// Réordonne en utilisant operator<.
std::sort(names.begin(), names.end());

// On peut également fournir un autre foncteur de comparaison.
std::sort(names.begin(), names.end(), std::greater {})
```

Il existe également `std::stable_sort`, qui permet de trier de manière stable.\
Trier de manière "stable" signifie que si deux éléments sont équivalents (il n'y en a pas un plus petit que l'autre), alors l'opération de tri ne les réordonnera pas l'un par rapport à l'autre.
```cpp
std::vector<std::string> names { "Toto", "toto", "tata", "Tata" };

std::stable_sort(names.begin(), names.end(), compare_no_case);
// => names = { "tata", "Tata", "Toto", "toto" }
// "tata" est toujours devant "Tata" et "Toto" est toujours devant "toto".
```

---

##### Inversion

La fonction `std::reverse` permet de "retourner" une série d'éléments.
Pour pouvoir s'en servir, il faut fournir à l'algorithme des itérateurs bidirectionnels.

```cpp
std::vector<int> values { 0, 3, 4, 2, 5 };

std::reverse(values.begin(), values.end());
// => values = { 5, 2, 4, 3, 0 }
```

---

### Autres fonctions

Il existe plein d'autres fonctions qui permettent de manipuler des plages de données.
Avant d'implémenter un algorithme à la main, pensez donc toujours à aller vérifier dans la documentation d'`<algorithm>` ou de `<numeric>` si ces bibliothèques ne propose pas déjà ce qu'il vous faut.    
