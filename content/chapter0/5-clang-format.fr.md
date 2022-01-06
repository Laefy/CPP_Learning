---
title: "Clang-Format"
weight: 5
---

Clang-Format est un outil permettant de formatter automatiquement vos fichiers (indentation, espaces, retours à la ligne, etc).\
Comme le C++ est un langage avec une syntaxe un peu lourde, utiliser ce type d'outils permet de faciliter la lecture du code.

---

### Configuration de VSCode

Clang-Format est déjà disponible dans l'extension C/C++ installée précédemment.
Pour qu'il se lance automatiquement lorsque vous sauvegardez vos fichiers, suivez les instructions ci-dessous.
1. Ouvrez le panneau de commandes VSCode (Ctrl+Shift+P).
1. Exécuter la commande `Preferences: Open User Settings`.
3. Recherchez et activez l'option "Editor: Format On Save".

Testez maintenant que tout fonctionne.
1. Ouvrez dans VSCode le dossier hello/ téléchargé précédemment.
2. Ajoutez ou supprimez des espaces dans le fichier `helloworld.cpp`.
3. Vérifiez que lorsque vous sauvegardez le fichier, celui-ci retrouve son formattage original.
4. Ouvrez maintenant le fichier `.clang-format`.
5. Recherchez le paramètre BraceWrapping > AfterFunction et settez le à `false`.
6. Retournez dans `helloworld.cpp` et sauvegardez le fichier.
7. Vérifiez qu'après avoir sauvegardé, l'accolade ouvrante du `main` est remontée à la ligne précédente.
