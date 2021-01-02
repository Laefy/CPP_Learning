---
title: "Hello World"
weight: 1
---

Pour votre premier programme, on ne va pas trop faire dans l'originalité, il s'agira d'un Hello World.
Vous l'avez d'ailleurs déjà probablement vu dans la rubrique précédente, pour tester vos outils.

---

Pour cet exercice, vous modifierez le fichier :\
\- `chap-01/1-hello_world.cpp`

La cible à compiler est `c1-1-hello_world`.

---

### La fonction main

Tout d'abord, commençons par écrire la fonction qui est appelée lorsqu'on lance le programme. On parle de **point d'entrée**. Comme en C, cette fonction doit s'appeler `main` et renvoyer une valeur de type `int`. Pour ce premier exercice, nous n'aurons pas besoin de lui fournir d'arguments.

```cpp
int main()
{
    return 0;
}
```

Vérifiez que votre programme compile et s'exécute sans erreur.

{{% expand "Rappel des commandes VSCode" %}}
1- `CMake: Configure` (nécessaire seulement si vous ne l'avez jamais lancé sur ce projet)
```b
[main] Configuring folder: cours-cpp 
[proc] Executing command: "C:\Program Files\CMake\bin\cmake.exe" --no-warn-unused-cli -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=TRUE -Hd:/Cours/C++/test/cours-cpp -Bd:/Cours/C++/test/cours-cpp/build -G "Visual Studio 16 2019" -T host=x64 -A x64
[cmake] Not searching for unused variables given on the command line.
[cmake] -- Selecting Windows SDK version 10.0.18362.0 to target Windows 10.0.18363.
[cmake] -- The C compiler identification is MSVC 19.24.28314.0
[cmake] -- The CXX compiler identification is MSVC 19.24.28314.0
[cmake] -- Check for working C compiler: C:/Program Files (x86)/Microsoft Visual Studio/2019/Community/VC/Tools/MSVC/14.24.28314/bin/Hostx64/x64/cl.exe
[cmake] -- Check for working C compiler: C:/Program Files (x86)/Microsoft Visual Studio/2019/Community/VC/Tools/MSVC/14.24.28314/bin/Hostx64/x64/cl.exe -- works
[cmake] -- Detecting C compiler ABI info
[cmake] -- Detecting C compiler ABI info - done
[cmake] -- Detecting C compile features
[cmake] -- Detecting C compile features - done
[cmake] -- Check for working CXX compiler: C:/Program Files (x86)/Microsoft Visual Studio/2019/Community/VC/Tools/MSVC/14.24.28314/bin/Hostx64/x64/cl.exe
[cmake] -- Check for working CXX compiler: C:/Program Files (x86)/Microsoft Visual Studio/2019/Community/VC/Tools/MSVC/14.24.28314/bin/Hostx64/x64/cl.exe -- works
[cmake] -- Detecting CXX compiler ABI info
[cmake] -- Detecting CXX compiler ABI info - done
[cmake] -- Detecting CXX compile features
[cmake] -- Detecting CXX compile features - done
[cmake] -- Configuring done
[cmake] -- Generating done
[cmake] -- Build files have been written to: D:/Cours/C++/test/cours-cpp/build
```

2- `CMake: Build Target` (Shift+F7) : `1-hello_world`
```b
[main] Building folder: cours-cpp 1-hello_world
[build] Starting build
[proc] Executing command: "C:\Program Files\CMake\bin\cmake.exe" --build d:/Cours/C++/test/cours-cpp/build --config Debug --target 1-hello_world -- /maxcpucount:18
[build] Microsoft (R) Build Engine version 16.4.0+e901037fe for .NET Framework
[build] Copyright (C) Microsoft Corporation. All rights reserved.
[build] 
[build]   Checking Build System
[build]   Building Custom Rule D:/Cours/C++/test/cours-cpp/chap-01/CMakeLists.txt
[build]   1-hello_world.cpp
[build]   1-hello_world.vcxproj -> D:\Cours\C++\test\cours-cpp\build\chap-01\Debug\1-hello_world.exe
[build] Build finished with exit code 0
```

3- `CMake: Set Debug Target` : `1-hello_world` (nécessaire seulement une fois pour l'exercice)

4- `CMake: Debug` (Ctrl+F5)
```b
The program '[15604] 1-hello_world.exe' has exited with code 0 (0x0).
```
{{% /expand %}}

{{% notice note %}}
La valeur de retour du `main` indique si le programme s'est terminé sans erreur. Si tout se passe bien, il faut retourner 0. N'importe quelle autre valeur indique une erreur.
{{% /notice %}}

---

### Ecrire sur la sortie standard

Ajoutez l'instruction suivante dans votre fonction `main` :
```cpp
std::cout << "Hello World!" << std::endl;
```

Cette ligne permet d'afficher la chaîne de caractère "Hello World!" sur la sortie standard du programme. Nous allons la décortiquer ensemble...

`std::`\
En C++, il est possible de définir des **espaces de noms**, ou **namespaces**. `std` fait référence au namespace utilisé pour la librairie standard. Si on écrit `std::cout`, c'est donc pour référencer un symbole nommé `cout` défini par la librairie standard.

{{% notice note %}}
Les librairies développées en C++ définissent généralement des namespaces pour contenir leurs symboles. Cela permet d'éviter des conflits de noms dans les programmes qui les utilisent. Par exemple, {{% open_in_new_tab "https://ogrecave.github.io/ogre/api/latest/" "Ogre" /%}} définit ses symboles dans `Ogre`, la {{% open_in_new_tab "https://www.sfml-dev.org/documentation/" "SFML" /%}} dans `sf`, etc.\
Ce problème existe aussi en C bien sûr, et pour y pallier, certaines APIs préfixent tous leurs symboles (la {{% open_in_new_tab "https://wiki.libsdl.org/CategoryAPI" "SDL" /%}} par exemple)... Ce n'est pas très pratique, d'où la bonne idée d'avoir introduit les namespaces en C++.
{{% /notice %}}

`cout`\
Il s'agit de la variable contenant le flux pour écrire sur la sortie standard du programme. Je ne sais pas pourquoi 'c', mais le 'out' indique 'sortie'. Par symétrie, on fera référence au flux pour l'entrée standard avec `cin`.

`<<`\
Il s'agit d'un opérateur, un peu comme `+` ou `%`. Si on utilise `<<` entre une variable de flux et une chaîne de caractère, cette chaîne de caractère sera écrite dans le flux.

`"Hello World!"`\
Une chaîne de caractère, comme en C.

`endl`\
Cette variable permet d'écrire le caractère de fin de ligne `\n` ('endl' pour 'end of line') dans le flux. Il permet également de forcer son flush.

{{% notice tip %}}
En C, on a dû vous dire expliquer qu'il fallait toujours mettre des `\n` à la fin de vos écritures avec `printf`, car cela permet d'être sûr que tout est bien écrit dans la console. En C++, `\n` ne suffit pas à le garantir, on utilisera donc `endl` lorsque l'on veut que le résultat soit écrit dans la console immédiatement.
{{% /notice %}}

Essayez maintenant de recompiler votre programme. Vous devriez obtenir des erreurs de ce style :
```b
blabla error ##: 'cout': is not a member of 'std' blabla
blabla message : see declaration of 'std' blabla
blabla error ##: 'cout': undeclared identifier blabla
blabla error ##: 'endl': is not a member of 'std' blabla
blabla message : see declaration of 'std' blabla
blabla error ##: 'endl': undeclared identifier blabla
```

Le premier message indique que le compilateur ne trouve aucun symbole nommé `cout` dans le namespace `std`. Eh bien oui, le C++, c'est comme le C. Le compilateur est un peu bêbête, et il faut tout lui indiquer, même où trouver les symboles de la librairie standard.

Allez sur {{% open_in_new_tab "https://en.cppreference.com/w/" "ce site" /%}} et recherchez `cout`. Vous devriez pouvoir déterminer dans quel header il se trouve, et ajouter la directive d'inclusion correspondante au fichier.

{{% expand "Solution" %}}
Vous devriez arriver sur {{% open_in_new_tab "https://en.cppreference.com/w/cpp/io/cout" "cette page" /%}}, vous indiquant que le header à référencer est `<iostream>` :
![](/images/doc-cout.png)

Placez le code suivant dans votre fichier :
```cpp
#include <iostream>

int main()
{
    std::cout << "Hello World!" << std::endl;
    return 0;
}
```
{{% /expand %}}

Vous devriez maintenant pouvoir compiler le programme sans soucis. Exécutez-le et vérifiez que vous obtenez bien un résultat similaire à celui-ci :
```b
Hello World!
The program '[2288] c1-1-hello_world.exe' has exited with code 0 (0x0).
```
