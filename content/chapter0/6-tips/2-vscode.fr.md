---
title: "Projets VSCode"
weight: 1
---

Lorsque vous avez un projet un peu plus conséquent, il est plus pratique de passer par VSCode pour configurer, compiler et tester vos programmes.

---

### Configuration avec CMake

Vous aurez besoin d'un fichier `CMakeLists.txt` à la racine de votre répertoire pour configurer le projet.
Si celui-ci ne contient qu'un seul programme, vous pouvez copier et adapter dans votre `CMakeLists.txt` les instructions suivantes.
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

Pour configurer le projet, utilisez la commande `CMake: Configure`.

---

### Configuration du fichier launch.json

Afin de pouvoir exécuter votre ou vos programme rapidemment, il vous faudra créer et configurer le fichier `launch.json`.

1. Créez un dossier `.vscode` à la racine du répertoire (si celui-ci n'existe pas déjà) et ajoutez dedans un fichier que vous nommerez `launch.json`.
![](/CPP_Learning/images/chapter0/new-launch.png)
2. Une fois ce fichier créé, ouvrez-le et cliquez sur le bouton `Add Configuration`.
![](/CPP_Learning/images/chapter0/add-conf.png)
3. Sélectionnez ensuite la configuration `C/C++: (XXX) Launch` adéquate.\
Windows et Linux devraient vous proposez GDB et MacOS devrait vous fournir LLVM.
![](/CPP_Learning/images/chapter0/launch-conf.png)
4. Remplacez les variables `program` et `cwd` par les valeurs ci-dessous :
```json
"program": "${command:cmake.launchTargetPath}",
"cwd": "${workspaceFolder}",
```
5. Si vous êtes sous Windows, supprimez la ligne contenant `"miDebuggerPath"`.

---

### Lancer un programme

Une fois que votre `launch.json` existe, vous pouvez lancer votre programme avec la commande `Debug: Start Debugging` ou en appuyant sur F5.

Si votre projet contient plusieurs exécutables, vous pouvez changer l'exécutable à lancer avec la commande `CMake: Set Debug Target`.
![](/CPP_Learning/images/chapter0/set-debug-target.png)

Si vous souhaitez lancer le programme en utilisant des arguments, vous pouvez renseigner ces derniers en modifiant la variable `args` dans le fichier `launch.json`.
![](/CPP_Learning/images/chapter0/args.png)
