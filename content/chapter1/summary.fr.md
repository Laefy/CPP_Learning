---
title: "Synthèse"
weight: 101
---

---

### Ce qu'il faut retenir

##### Théorie

- C++ est un langage compilé, performant, documenté, standardisé et disposant d'une large communauté.
- Il est verbeux et sa syntaxe font qu'il ne s'agit pas du langage le plus agréable à lire.
- Une référence est une variable que permet d'aliaser une autre variable. Les deux variables font donc référence au même espace dans la mémoire.

##### Méthodologie

- Lorsqu'on a besoin d'une fonction, on commence par aller voir sur Internet si elle n'existe pas déjà dans la librairie standard.
- Si on ne sait pas comment utiliser une fonction de la librairie standard, on peut trouver des exemples sur les pages de {{% open_in_new_tab "https://en.cppreference.com/w/" "ce site" /%}} (en bas de page, généralement).

##### Pratique

- Toujours initialiser les variables de type primitif (`int`, `float`, `short`, `bool`, etc) et le contenu des tableaux statiques
- Préférer en général `std::endl` à `\n`
- `<<` n'est qu'un opérateur, au même titre que `+` ou `==`
- Préférer définir l'itérateur directement dans le `for`
- `auto` peut remplacer le type d'une variable si le compilateur est capable de le déduire du contexte
- Utiliser des `std::string` pour représenter des chaînes de caractères
- Utiliser des `std::vector` pour représenter des tableaux dynamiques
 
---

### Ce qu'il faut savoir faire

##### Outils

- Configurer un projet avec cmake.
- Compiler un programme.
- Exécuter un programme.
- Récupérer un dépôt git.

##### Langage

- Créer un nouveau programme, qui accepte ou non des arguments : `int main() / int main(int argc, char** argv)`
- Ecrire des commentaires : `// comment` ou `/* comments */`
- Accéder à une variable définie dans un namespace : `ns::var`
- Ecrire des boucles `while` et `for`.
- Ecrire des boucles foreach : `for (int v : values)`
- Ecrire des conditions `if / else if / else` et `switch`
- Définir des fonctions : `int fcn(char p1, float p2) { ... }` 
- Appeler des fonctions : `fcn('a', 2.f);`
- Passer des paramètres par référence : `void fcn(std::string& str) { ... }`
- Passer des paramètres par const-ref : `void fcn(const std::string& str) { ... }`
- Accéder à une fonction membre : `obj.fcn(...)` ou `obj->fcn(...)`

##### Librairie standard

- Inclure un header : `#include <un_header>` 
- Ecrire sur la sortie standard : `std::cout << "message" << std::endl`
- Définir une `std::string`
- Définir un `std::vector`, ajouter des élements dedans : `array.emplace_back(...)` et y accéder : `array[idx]`. 

---

### Ce dont il faut à peu près se souvenir

##### Outils

- Les options de compilation permettant de limiter les bugs : -W -Wall -Werror.
- L'option de compilation permettant de choisir la version du langage : -std=c++17 (ou 11, ou 14).

##### Langage

- On peut utiliser `using namespace std;` au début du programme pour ne pas avoir à répéter `std::` partout.
- On peut aussi l'utiliser dans une fonction (l'effet est alors limité à cette fonction).

##### Librairie standard

- Récupérer des informations depuis l'entrée standard : `std::cin >> var`
- `array.empty()` pour savoir si un `std::vector` est vide


