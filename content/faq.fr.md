---
title: "FAQ"
---

---

### Pourquoi je n'arrive pas à lancer mon projet avec CMake ?

Cela peut-être dû à plusieurs raisons :

#### 1. Vous n'avez pas ouvert le bon dossier dans VSCode.

Il faut toujours ouvrir le dossier qui contient tous les chapitres et tous les TPs, pas le dossier d'un chapitre ou d'un TP en particulier.

#### 2. Vous avez essayé de lancer le programme via le menu `Run` de VSCode.

Si vous tentez de lancer un programme de cette manière, VSCode va générer un fichier `launch.json` dans le dossier .vscode. A partir de ce moment, chaque fois que vous essayerez de lancer le programme, une compilation de l'exécutable sera déclenchée, sauf que celle-ci n'utilisera pas la configuration définie dans les CMakeLists.txt (en particulier, il manquera le flag indiquant que l'on souhaite compiler en C++17).

Commencez par supprimer le fichier `launch.json` du dossier .vscode. Vous pouvez également supprimer le fichier `tasks.json` s'il existe.\
Allez ensuite sur [cette section](/workflow/#programmer--compiler--tester) pour obtenir les étapes permettant d'exécutez les programmes du cours et des TPs avec CMake.
