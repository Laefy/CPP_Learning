---
title: "Synthèse"
weight: 101
draft: true
---

---

### Ce qu'il faut retenir

##### Théorie

- A quoi correspondent les termes **attributs** et **fonction-membres**
- **constructeur** = fonction appelée à l'instanciation d'une classe
- **constructeur par défaut** = constructeur à 0 paramètre
- **implémentation par défaut** = implémentation d'une fonction générée par le compilateur dans certaines conditions
- **opérateur d'assignation** = fonction appelée lorsque l'on écrit `a = ...;`, sachant que `a` a été instancié plus tôt
- **surcharge** = fonction de même nom, acceptant un nombre différent de paramètres et/ou des paramètres de types différents
- Lorsque la variable référencée par une référence est détruite, on a une dangling reference

##### Pratique

- Utiliser `this` pour faire référence à l'instance courante
- Comparer `this` et `&other` au début de l'opérateur d'assignation
- Utiliser `const` aussi souvent que possible

---

### Ce qu'il faut savoir faire

##### Langage

- Définir une classe : `class A {};` (sans oublier le point-virgule)
- Définir des attributs et des fonctions-membres
- Indiquer la visibilité d'un ou plusieurs membres : `public:` - `private:`
- Définir un constructeur : `ClassName(int p1, char p2) : _a1 { p1 }, _a2 { p2 } { }`
- Déléguer la construction à un autre constructeur : `ClassName(int p) : ClassName { p, p } {}`
- Définir un constructeur de copie : `ClassName(const ClassName& other) : _a1 { other._a1 }, _a2 { other._a2 } {}`
- Définir l'opérateur d'assignation par copie : `ClassName& operator=(const ClassName& other) { ...; return *this; }`
- Définir des fonctions-membres constantes : `int get() const { return _attr; }`
- Référencer un symbole d'une classe en dehors de cette classe (attributs / fonctions statiques, définition fonction-membres, etc): `ClassName::symbol`
- Déclarer des attributs statiques : `static int _attr;`
- Définir et initialiser des attributs statiques : `int ClassName::_attr = 1;` forcément dans un cpp, en dehors de toute classe ou fonction
- Déclarer une fonction amie : `friend void fcn();` n'importe où dans la définition d'une classe
- Instancier des objets avec ou sans paramètre : `Toto toto;` -  `Toto toto { 1, 2, 3 };`
- Accéder à un membre: `toto._attr` - `toto.fcn()`
- Accéder à des membres statiques: `Toto::_attr_s` - `Toto::fcn_s()`
- Définir des alias : `using Alias = type_pas_clair;`

##### Librairie standard

- Surcharger l'opérateur `<<` pour afficher des données dans un flux : `std::ostream& operator<<(std::ostream& s, const SomeClass& c) { return s << c.get() << std::endl; }`

##### Debugging

- Placer des breakpoints.
- Inspecter les valeurs des variables.
- Itérer dans l'exécution du programme.

---

### Ce dont il faut à peu près se souvenir

##### Théorie

- Il y a plein de syntaxes différentes pour appeler le constructeur d'une variable : `type v = p`, `type v { p1, p2, ... }`, `type v(p1, p2, p3)`, etc.

##### Librairie standard

- `std::pair<type1, type2>`

##### Méthodologie

- Ecrire le code appelant avant le code appelé permet de ne pas coder des fonctions inutiles.
- TDD = Test Driven Development : on code les tests avant tout le reste.
- Réfléchir aux invariants de classe avant de définir plein de setters et de getters.