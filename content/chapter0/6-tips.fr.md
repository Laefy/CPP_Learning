---
title: "Astuces"
weight: 6
---

---

### Compiler un petit programme dans un terminal

Avec g++ :
```b
g++ f1.cpp f2.cpp f3.cpp -o program
```

Avec clang :
```b
clang++ f1.cpp f2.cpp f3.cpp -o program
```

Vous pouvez ajouter des options de compilation (voir [ci-dessous](#options-de-compilation)) à la fin de la ligne de commande.

---

### Options de compilation

Voici les options de compilation que nous vous conseillons d'utiliser pendant le cours, et que l'on activera pour compiler vos rendus de TPs :
- `-std=c++17` : spécifie que le projet sera compilé en C++17 
- `-Wall -W` : permet d'activer un certain nombre de warnings
- `-Werror` : transforme les warnings en erreurs, donc tant qu'il y a des warnings, le programme ne compile pas

Vous pouvez également utiliser :
- `-g` : ajoute des informations supplémentaires à l'exécutable, afin de pouvoir le débugger plus facilement

---

### Compiler un programme depuis VSCode avec CMake

Déjà, il faut avoir un fichier [CMakeLists.txt](#un-cmakeliststxt-minimal) à la racine du dossier ouvert dans VSCode.

Ensuite, on utilise la commande `CMake: Configure` pour regénérer les fichiers de build.\
On doit exécuter cette commande à chaque fois que l'on modifie le CMakeLists.txt, que l'on rajoute des fichiers au project ou que l'on en supprime.

Enfin, on utilise la barre en bas de l'éditeur pour compiler ou exécuter une cible (c'est-à-dire un exécutable ou une librairie définie dans le CMakeLists.txt).
![](/CPP_Learning/images/chapter0/vscode-toolbar.png)

---

### Un CMakeLists.txt minimal

```
cmake_minimum_required(VERSION 3.1)
project(my_project)

add_executable(my_executable
    my_file1.cpp
    my_file2.cpp
    my_file3.h
)

target_compile_features(my_executable PUBLIC cxx_std_17)
```

---

### Raccourcis VSCode utiles

Ctrl+Shift+P : Ouvre le panneau de commandes\
F7 : Compile la cible courante\
Ctrl+F7 : Débugge la cible courante\
Shift+F7 : Exécute la cible courante

---

### Commandes VSCode utiles

CMake: Configure\
CMake: Set Build Target\
CMake: Build\
CMake: Set Debug Target\
CMake: Debug\
CMake: Run Without Debugging
