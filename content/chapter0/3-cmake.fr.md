---
title: "CMake"
weight: 3
---

Afin de générer les artéfacts pour la compilation, nous utiliserons {{< open_in_new_tab "https://cmake.org/" "CMake" />}}.

---

### Installation

Si vous êtes sous Unix, vous devriez pouvoir installer CMake depuis votre gestionnaire de paquets.\
Si vous êtes sous Windows, vous pouvez utiliser l'installeur que vous trouverez sur {{< open_in_new_tab "https://cmake.org/download/" "cette page" />}}.

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

**Si vous êtes sous Unix**, vous pouvez passer à l'étape 10.\
**Sinon, si vous êtes sous Windows**

3. Exécutez la commande `Preferences: Open User Settings`.
4. Recherchez l'option `MinGW Search Dirs` et ajoutez-y "C:\msys64\mingw64".
![](/CPP_Learning/images/chapter0/mingw-vscode.png)
5. Redémarrez VSCode et réouvrez le dossier hello.
6. Exécutez la commande `CMake: Scan For Kits`.
7. Exécutez ensuite `CMake: Edit User-Local CMake Kits`.
8. Copiez le code suivant dans les entrées JSON correspondant aux compilateurs installés par MSYS2 (n'oubliez pas de rajouter une virgule sur les lignes précédentes):
```json
"preferredGenerator": {
  "name": "MinGW Makefiles"
},
"environmentVariables": {
  "CMT_MINGW_PATH": "C:\\msys64\\mingw64\\bin"
}
```
![](/CPP_Learning/images/chapter0/cmake-kits.png)

9. Sauvegardez et fermez le fichier de configuration des kits CMake.
10. Exécutez la commande `CMake: Configure`.
11. Sélectionnez le compilateur g++ ou clang++ le plus récent dans la liste proposée.
12. La configuration et la génération des fichiers de build devraient avoir lieu.
![](/CPP_Learning/images/chapter0/cmake-result.png)
13. Cliquez maintenant sur le bouton Build dans la barre en bas (ou F7) pour compiler le projet.
![](/CPP_Learning/images/chapter0/cmake-build.png)
14. Lancez le programme en utilisant le bouton Debug (Ctrl+F5) ou le bouton Play (Shift+F5).\
Celui-ci devrait s'exécuter dans le terminal intégré de VSCode.
![](/CPP_Learning/images/chapter0/cmake-run.png)

