---
title: "Git"
weight: 4
---

Pour le gestionnaire de version, nous utiliserons {{< open_in_new_tab "https://git-scm.com/" "git" />}}. Vous pourrez ensuite héberger votre dépôt pour les TPs et le projet sur la plateforme de votre choix (Github, Gitlab, Bitbucket, votre serveur perso, peu importe), du moment que l'on peut y avoir accès pour l'évaluation.

---

### Installation

Si vous êtes sous Unix, vous devriez pouvoir installer git depuis votre gestionnaire de paquets.\
Si vous êtes sous Windows, vous pouvez télécharger l'outil depuis {{< open_in_new_tab "https://git-scm.com/download/win/" "cette page" />}}.

---

### Manipulation d'un dépôt depuis VSCode

Si vous savez déjà utiliser Git en ligne de commande, cela est largement suffisant.\
Mais si vous êtes intéressés quand même, les sections ci-dessous détaillent comment utiliser Git directement depuis VSCode.

#### Créer un nouveau dépôt

1. Créez un nouveau dossier `test-git-init` et ouvrez-le dans VSCode.
2. Réouvrez le dossier hello/ téléchargé précédemment depuis VSCode.
3. Configurer le projet avec `CMake: Configure`, puis compilez-le, comme vous l'avez appris sur la page précédente.
4. Placez-vous ensuite dans l'onglet Source Control de VSCode (Ctrl+Shift+G ou `View > SCM`).
5. Cliquez sur `Initialize Repository`.
![](/CPP_Learning/images/vscode-git-init.png)
6. Les fichiers générés par la compilation devraient apparaître dans la liste des changements détectés par git.
Comme nous ne souhaitons pas sauvegarder les fichiers temporaires, nous allons les ignorer en ajoutant un nouveau fichier `.gitignore`.\
Créez ce fichier à la racine de votre dossier et copiez-collez dedans les lignes ci-dessous :
```b
build/
.vscode/

*.exe
*.obj
*.pdb
*.ilk
*.o
```

7. Si votre exécutable est généré dans le même répertoire que les fichiers sources, et que celui-ci ne comporte pas d'extension, vous pouvez ajouter son nom sur une nouvelle ligne du fichier `.gitignore`.
8. Retournez dans l'onglet Source Control, et appuyez sur le bouton `+` pour stager vos modifications.
![](/CPP_Learning/images/vscode-git-stage.png)

9. Entrez un message décrivant vos changements et cliquez sur la coche pour les committer.
![](/CPP_Learning/images/vscode-git-commit.png)

#### Cloner un dépôt existant

1. Si vous possédez un compte Github, commencez par forker le dépôt suivant : https://github.com/Laefy/CPP-M1-test-git-clone.
![](/CPP_Learning/images/github-fork.png)
2. Ouvrez VSCode.
3. Lancer la commande `Git: Clone` depuis le panneau de commandes (Ctrl+Shift+P ou `View > Command Palette...`).
![](/CPP_Learning/images/vscode-git-clone.png)
4. Fournissez-lui l'URL du dépôt créé sur votre compte à la suite du fork, ou utilisez l'URL du dépôt d'origine : https://github.com/Laefy/CPP-M1-test-git-clone.git/ (vous ne pourrez alors pas réalisez de push sur ce dépôt).
![](/CPP_Learning/images/vscode-git-clone-url.png)
5. Sélectionnez le dossier où vous ranger habituellement vos projets de code, pour que git y copie le dépôt distant.
6. Dans le fichier `main.cpp`, remplacez le contenu de la fonction `main` par les instructions ci-dessous :
```cpp
int main()
{
    std::cout << "ByeBye now" << std::endl;
    return 0;
} 
```
7. Allez dans l'onglet Source Control de VSCode (Ctrl+Shift+G ou `View > SCM`) et appuyez sur le bouton `+` pour stager vos changements.
![](/CPP_Learning/images/vscode-git-clone-stage.png)
8. Entrez un message et cliquez sur la coche pour committer vos changements.
![](/CPP_Learning/images/vscode-git-clone-commit.png)
9. Si vous avez utilisé votre propre compte pour cloner le dépôt, vous pouvez maintenant y pusher votre commit en utilisant la commande `Git: Push`.
![](/CPP_Learning/images/vscode-git-push.png)
