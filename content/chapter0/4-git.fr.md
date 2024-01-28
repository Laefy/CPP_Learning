---
title: "Git"
weight: 4
---

Pour le gestionnaire de version, nous utiliserons {{< open_in_new_tab "https://git-scm.com/" "git" />}} et nous utiliserons GitHub pour l'hébergement des dépôts.

---

### GitHub

#### Création de compte

Commencez par créer un compte si vous n'en avez pas déjà un.

#### Génération de clef SSHs

Depuis quelques années, pour pouvoir push sur un dépôt, il est nécessaire de passer par la méthode SSH (HTML ne permet plus d'éditer, juste de consulter).

Pour associer une nouvelle clef SSH à votre machine, suivez les instructions du paragraphe ["Generating a new SSH key"](https://docs.github.com/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key) et enregistrez la clef à l'emplacement par défaut (c'est-à-dire sans spécifier de chemin de sauvegarde).

Ensuite, pour référencer votre clef nouvellement générée sur votre compte GitHub, vous pouvez suivre les instructions disponible [ici](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

---

### Installation

Si vous êtes sous Unix (Linux / MacOS), vous devriez pouvoir installer git depuis votre gestionnaire de paquets.\
Si vous êtes sous Windows, vous pouvez télécharger l'outil depuis {{< open_in_new_tab "https://git-scm.com/download/win/" "cette page" />}}.

---

### Manipulation d'un dépôt depuis VSCode

Si vous savez déjà utiliser Git en ligne de commande, cela est largement suffisant.\
Mais si vous êtes intéressés quand même, les sections ci-dessous détaillent comment utiliser Git directement depuis VSCode.

#### Créer un nouveau dépôt

1. Réouvrez le dossier `hello/` téléchargé précédemment depuis VSCode.
2. Si vous ne l'aviez pas fait précédement, configurez le projet avec `CMake: Configure`, puis compilez-le.
3. Placez-vous ensuite dans l'onglet `Source Control` de VSCode (`Ctrl + Shift + G` ou `View > SCM`).
4. Cliquez sur `Initialize Repository`.
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

7. Vérifiez que seuls les fichiers `helloworld.cpp`, `CMakeLists.txt`, `.clang-format` et `.gitignore` apparaissent désormais dans la liste des changements.
8. Retournez dans l'onglet `Source Control`, et appuyez sur le bouton `+` pour stager vos modifications.
![](/CPP_Learning/images/chapter0/git-add.png)
9. Entrez un message décrivant vos changements et cliquez sur la coche pour les committer.
![](/CPP_Learning/images/chapter0/git-commit.png)

#### Cloner un dépôt existant

1. Si vous possédez un compte Github, commencez par forker le dépôt suivant : https://github.com/Laefy/CPP-M1-test-git-clone.
![](/CPP_Learning/images/github-fork.png)
2. Ouvrez VSCode.
3. Lancer la commande `Git: Clone` depuis le panneau de commandes (`Ctrl + Shift + P` ou `View > Command Palette...`).
![](/CPP_Learning/images/vscode-git-clone.png)
4. Fournissez-lui l'URL du dépôt créé sur votre compte à la suite du fork, ou utilisez l'URL du dépôt d'origine : https://github.com/Laefy/CPP-M1-test-git-clone.git/ (vous ne pourrez alors pas réalisez de push sur ce dépôt).
![](/CPP_Learning/images/vscode-git-clone-url.png)
5. Sélectionnez le dossier où vous rangez habituellement vos projets de code, pour que git y copie le dépôt distant.
6. Dans le fichier `main.cpp`, remplacez le contenu de la fonction `main` par les instructions ci-dessous :
```cpp
int main()
{
    std::cout << "ByeBye now" << std::endl;
    return 0;
} 
```
7. Allez dans l'onglet `Source Control` de VSCode (`Ctrl + Shift + G` ou `View > SCM`) et appuyez sur le bouton `+` pour stager vos changements.
![](/CPP_Learning/images/vscode-git-clone-stage.png)
8. Entrez un message et cliquez sur la coche pour committer vos changements.
![](/CPP_Learning/images/vscode-git-clone-commit.png)
9. Si vous avez utilisé votre propre compte pour cloner le dépôt, vous pouvez maintenant y pusher votre commit en utilisant la commande `Git: Push`.\
Une popup vous demandera de vous connecter à votre compte GitHub si vous ne l'avez pas encore fait.
![](/CPP_Learning/images/vscode-git-push.png)
10.  Ouvrez un navigateur web et rendez-vous sur la page de votre dépôt GitHub pour vérifier que vos modifications ont bien été poussées.
