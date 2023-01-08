---
title: "CMake"
weight: 3
---

Afin de générer les artéfacts pour la compilation, nous utiliserons {{< open_in_new_tab "https://cmake.org/" "CMake" />}}.

---

### Installation

Si vous êtes sous Unix (Linux / MacOS), vous devriez pouvoir installer CMake depuis votre gestionnaire de paquets.\
Si vous êtes sous Windows, vous pouvez utiliser l'installeur que vous trouverez sur {{< open_in_new_tab "https://cmake.org/download/" "cette page" />}}.
Notez également l'emplacement où celui-ci a été installé, car vous en aurez besoin à l'étape suivante.

---

### Intégration à VSCode

Afin de pouvoir utiliser CMake facilement depuis VSCode, il faut installer les extensions CMake et CMakeTools.

1. Démarrez VSCode.
2. Ouvrez le panneau des extensions et recherchez les extensions CMake et CMakeTools.
![](/CPP_Learning/images/chapter0/cmake-ext.png)
3. Cliquez ensuite sur le bouton `Install` pour chacune d'entre elles.
4. Redémarrez VSCode.
5. Vérifiez que vous avez accès aux commandes `CMake` depuis le panneau de commandes (`View > Command Palette ...` ou Ctrl+Shift+P).

Vérifiez maintenant votre installation.
1. Téléchargez et extrayez {{< open_in_new_tab "/CPP_Learning/code/hello.zip" "cette archive" />}} dans un nouveau dossier.
2. Ouvrez ce dossier depuis VSCode.
![](/CPP_Learning/images/chapter0/folder-vscode.png)

**Si vous êtes sous Unix**, vous pouvez passer à l'étape 11.\
**Sinon, si vous êtes sous Windows**

3. Exécutez la commande `Preferences: Open User Settings`.
4. Recherchez l'option `Cmake Path` et indiquez le chemin où l'exécutable `cmake.exe` a été installé.
![](/CPP_Learning/images/chapter0/cmake-path.png)
5. Recherchez l'option `MinGW Search Dirs` et ajoutez-y "C:\msys64\mingw64".
![](/CPP_Learning/images/chapter0/mingw-vscode.png)
6. Redémarrez VSCode et réouvrez le dossier hello.
7. Exécutez la commande `CMake: Scan For Kits`.
8. Exécutez ensuite `CMake: Edit User-Local CMake Kits`.
9. Copiez le code suivant dans les entrées JSON correspondant aux compilateurs installés par MSYS2 (n'oubliez pas de rajouter une virgule sur les lignes précédentes):
```json
"preferredGenerator": {
  "name": "MinGW Makefiles"
},
"environmentVariables": {
  "CMT_MINGW_PATH": "C:\\msys64\\mingw64\\bin"
}
```
![](/CPP_Learning/images/chapter0/cmake-kits.png)

10. Sauvegardez et fermez le fichier de configuration des kits CMake.
11. Exécutez la commande `CMake: Configure`.
12. Sélectionnez le compilateur g++ ou clang++ le plus récent dans la liste proposée.
13. La configuration et la génération des fichiers de build devraient avoir lieu.
![](/CPP_Learning/images/chapter0/cmake-result.png)
14. Cliquez maintenant sur le bouton Build dans la barre en bas (ou F7) pour compiler le projet.
![](/CPP_Learning/images/chapter0/cmake-build.png)

---

### Lancement du programme

Afin de pouvoir lancer votre programme rapidement en utilisant la commande `Start Debugging` (F5), vous devrez préalablement réaliser la manipulation suivante.\
Celle-ci sera à refaire chaque fois que vous créérez un nouveau projet.

1. Créez un dossier `.vscode` à la racine du répertoire (si celui-ci n'existe pas déjà) et ajoutez dedans un fichier que vous nommerez `launch.json`.
![](/CPP_Learning/images/chapter0/new-launch.png)
2. Une fois ce fichier créé, ouvrez-le et cliquez sur le bouton `Add Configuration`.
![](/CPP_Learning/images/chapter0/add-conf.png)
3. Sélectionnez ensuite la configuration `C/C++: (XXX) Launch` adéquate.\
Windows et Linux devraient vous proposez GDB et MacOS devrait vous fournir LLDB.
![](/CPP_Learning/images/chapter0/launch-conf.png)
4. Remplacez les variables `program` et `cwd` par les valeurs ci-dessous :
```json
"program": "${command:cmake.launchTargetPath}",
"cwd": "${workspaceFolder}",
```
5. Si vous êtes sous Windows, renseignez également `"miDebuggerPath"` avec `"C:\\msys64\\mingw64\\bin\\gdb.exe"`.

Ajoutez un breakpoint sur la ligne 5 en cliquant devant le numéro de ligne, puis essayez de lancer le programme avec la commande `Start Debugging` (F5).\
Votre programme devrait se lancer puis mettre en pause son exécution sur la ligne 5.
![](/CPP_Learning/images/chapter0/cmake-breakpoint.png)
