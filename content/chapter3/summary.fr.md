---
title: "Synthèse"
weight: 101
---

---

### Ce qu'il faut retenir

##### Théorie

- Un conteneur séquentiel est un conteneur dans lequel les élements se suivent (tableaux, listes, ...).
- Un conteneur associatif est un conteneur dans lequel chaque élément est indexé par une clef (l'élément pouvant être la clef elle-même).
- Les types passés en paramètre de template doivent parfois respecter des contraintes pour compiler (ces contraintes sont spécifiées dans la documentation).

##### Librairie standard

- Tableau de taille dynamique : `vector`
- Tableau de taille fixe : `array`
- Listes chaînées : `list` ou `forward_list`
- Ensembles : `set` ou `unordered_set`
- Dictionnaires : `map` ou `unordered_map`

##### Pratique

- On peut passer les chaînes de caractères constantes par `std::string_view` plutôt que `const std::string&` ou `const char*`.
- Si une classe définit une constructeur acceptant un paramètre de type initializer_list, alors il faut forcément utiliser la syntaxe `(...)` plutôt que `{ ... }` pour appeler un autre constructeur.
- On peut écrire `values[idx]` si `values` est un tableau primitif ou si la classe de `values` définit un `operator[]`.

##### Méthodologie

- Pour savoir comment utiliser une classe ou fonction, commencer par regarder l'exemple fourni dans la doc.

---

### Ce qu'il faut savoir faire

##### Langage

- Définir un opérateur de comparaison : `bool operator<(const ClassName& other) { return /* ... */; }`
- Définir un opérateur d'égalité : `bool operator==(const ClassName& other) { return /* ... */; }`

##### Librairie standard

- Utiliser les fonctions génériques permettant d'accéder ou de manipuler un conteneur : `size`, `empty`, `clear`, `emplace_back`, `insert`, `erase`, etc.
- Instancier des conteneurs de la librairie standard et les utiliser (en consultant la doc si besoin).
- Instancier des `pair` et des `tuple`.
- Accéder au n-ième élément d'un `tuple` : `auto& fifth = std::get<4>(my_tuple);`

##### Méthodologie

- Rechercher dans la documentation comment utiliser une fonction ou une classe (header à inclure, paramètres, contraintes, etc).
- Utiliser la documentation pour choisir la meilleure classe à utiliser dans une situation donnée (complexité des opérations, espace utilisé, condition d'invalidation des itérateurs, etc).
- Identifier les "vraies" erreurs dans la sortie du compilateur pour les corriger.

---

### Ce dont il faut à peu près se souvenir

##### Théorie

- Un foncteur est un objet qui définit un `operator()`.

##### Librairie standard

- Il faut spécialiser la classe `std::hash` pour `Key` si on souhaite utiliser `Key` comme clef d'un `unordered_set` ou `unordered_map`.
