---
title: "Compilation en terminal"
weight: 4
---

## Options g++ et clang++

Si vous compilez via le terminal ou avec [Compiler Explorer](https://godbolt.org/), nous vous conseillons d'utiliser les options ci-dessous, car nous les activerons pour vos rendus de projet :
- `-std=c++17` : spécifie que le projet sera compilé en C++17 (sans cette option, certains fichiers peuvent ne pas compiler)
- `-Wall -W` : permet d'activer un certain nombre de warnings
- `-Werror` : transforme les warnings en erreurs, donc tant qu'il y a des warnings, le programme ne compile pas

Sachez par ailleurs que vous pouvez également utiliser :
- `-g` : ajoute des informations supplémentaires à l'exécutable, afin de pouvoir le débugger plus facilement

---

## Compilation avec CMake

1. Se placer à la racine du projet (le répertoire le plus haut contenant un fichier CMakeLists.txt) :\
`cd /path/to/project/folder`
2. Créer un répertoire build/ si celui-ci n'existe pas déjà et se placer dedans :\
`mkdir build`\
`cd build`
3. Configurer le projet ('..' permet ici de cibler la racine du projet en étant placé dans le dossier build/) :\
`cmake ..`
1. Compiler tous les éléments du projet :\
`cmake --build .`
