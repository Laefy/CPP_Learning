---
title: "Compilation & Exécution"
weight: 4
---

Nous allons maintenant voir comment compiler un programme avec nos différents outils.

---

### Depuis un terminal

#### Sans CMake (petit projet)

Avec g++ :
```b
g++ f1.cpp f2.cpp f3.cpp -o program
```

Avec clang :
```b
clang++ f1.cpp f2.cpp f3.cpp -o program
```

Vous pouvez ajouter des options de compilation (voir [plus bas](#options-de-compilation)) à la fin de la ligne de commande.

#### Avec CMake

Commencez par vous placer dans le répertoire qui contiendra les fichiers temporaires générés par la compilation (un dossier `build/` dans ou à-côté du répertoire de sources par exemple), puis exécutez la commande `cmake` en lui passant le chemin du répertoire contenant le fichier `CMakeLists.txt` :
```b
cd      path/to/build/folder
cmake   path/to/src/folder/containing/CMakeLists.txt
```

Si vous avez des erreurs, cela signifie soit que votre `CMakeLists.txt` contient des erreurs, soit qu'il faut modifier le `CMakeCache.txt` (généré dans le dossier de build) pour spécifier manuellement les chemins vers les librairies qui n'ont pas été trouvées.

Vous devrez ensuite utiliser une commande qui dépend de la configuration utilisée par CMake pour compiler le projet.

Sous Unix, ce sera probablement :
```b
make
```

Et sous Windows, si vous avez installé MinGW :
```b
mingw-make
```

#### Exécution

Pour lancer le programme :
```b
./path/to/program arg1 arg2
```

---

### Depuis VSCode

Dans VSCode, la plupart des opérations se font via des commandes. Pour y avoir accès, il faut aller dans `View > Command Palette...` ou utiliser Ctrl+Shift+P.   

#### Avec Code Runner

Vous pouvez installer l'extension {{% open_in_new_tab "https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner" "Code Runner" /%}}, qui permet de compiler facilement des petits programmes et de les exécuter.

#### Avec CMake

Utilisez la commande `CMake: Configure` pour configurer le projet, puis `CMake: Build Target` pour compiler une cible. \
Vous pouvez ensuite lancer le programme avec `CMake: Debug` ou `CMake: Run Without Debug`.

#### Via le terminal intégré

Tout ce que vous pouvez faire depuis un terminal peut être fait depuis le terminal intégré de VSCode.

Dans certains cas, il sera d'ailleurs beaucoup plus simple de lancer le programme via ce terminal qu'en utilisant une des extensions citées plus haut. Par exemple, il est difficile d'utiliser l'entrée standard ou de passer des paramètres au programme avec `CMake: Debug`.

#### Compilation avec tasks.json

Utilisez la commande `Tasks: Configure Default Build Task` afin de générer un fichier `tasks.json` depuis un template. Vous pouvez le modifier pour y ajouter des options de compilation.\
Compilez ensuite avec `Tasks: Run Build Task`.

Si vous souhaitez plus d'informations sur les tasks, vous pouvez consulter la {{% open_in_new_tab "https://code.visualstudio.com/docs/editor/tasks" "documentation de VSCode" /%}}.

#### Exécution avec launch.json

Vous pouvez aussi créer un fichier `launch.json` pour exécuter votre programme. Cela vous permettra de spécifier les paramètres d'exécution, si vous voulez exécuter dans une console séparée ou pas, etc.

Afin de générer ce fichier depuis un template, lancez `Debug: Start Debugging` (ou `Run: Start Without Debugging`) et sélectionnez l'environnement le plus adapté à votre situation. Modifiez ensuite la variable 
`program` pour qu'elle pointe vers l'exécutable de votre choix. Relancez ensuite la commande `Debug: Start Debugging` (ou `Run: Start Without Debugging`).

Si vous souhaitez plus d'informations sur comment configurer `launch.json`, vous pouvez consulter la {{% open_in_new_tab "https://code.visualstudio.com/docs/editor/debugging#_launch-configurations" "documentation de VSCode" /%}}.

---

### Options de compilation

Voici les options de compilation que nous vous conseillons d'utiliser pendant le cours, et que l'on activera pour compiler vos rendus de TPs :
- `-std=c++17` : spécifie que le projet sera compilé en C++17 
- `-Wall -W` : permet d'activer un certain nombre de warnings
- `-Werror` : transforme les warnings en erreurs, donc tant qu'il y a des warnings, le programme ne compile pas

Vous pouvez également utiliser :
- `-g` : ajoute des informations supplémentaire à l'exécutable, ce qui permet de le debugger
