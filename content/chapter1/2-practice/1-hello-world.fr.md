---
title: "👋 Hello World"
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

Vous pouvez retrouver les commandes VSCode utiles {{% open_in_new_tab "/CPP_Learning/chapter0/5-tips/#commandes-vscode-utiles" "ici" /%}}.

{{% notice note %}}
La valeur de retour du `main` indique si le programme s'est terminé sans erreur. Si tout se passe bien, il faut retourner 0. N'importe quelle autre valeur indique une erreur.
{{% /notice %}}

---

### Ecrire sur la sortie standard

L'instruction ci-dessous permet d'afficher la chaîne de caractère "Hello World!" sur la sortie standard du programme. 
```cpp
std::cout << "Hello World!" << std::endl;
```

Décortiquons la ensemble...

`std::`\
En C++, il est possible de définir des **espaces de noms**, ou **namespaces**.\
`std` fait référence au namespace utilisé pour la librairie standard.
Si on écrit `std::cout`, c'est donc pour référencer un symbole nommé `cout` défini par la librairie standard.

{{% notice note %}}
Les librairies développées en C++ définissent généralement des namespaces pour contenir leurs symboles. Cela permet d'éviter des conflits de noms dans les programmes qui les utilisent. Par exemple, {{% open_in_new_tab "https://ogrecave.github.io/ogre/api/latest/" "Ogre" /%}} définit ses symboles dans `Ogre`, la {{% open_in_new_tab "https://www.sfml-dev.org/documentation/" "SFML" /%}} dans `sf`, etc.\
Ce problème existe aussi en C bien sûr, et pour y pallier, certaines APIs préfixent tous leurs symboles (la {{% open_in_new_tab "https://wiki.libsdl.org/CategoryAPI" "SDL" /%}} par exemple)... Ce n'est pas très pratique, d'où la bonne idée d'avoir introduit les namespaces en C++.
{{% /notice %}}

`cout`\
Il s'agit de la variable globale contenant le flux pour écrire sur la sortie standard du programme. Je ne sais pas pourquoi 'c', mais le 'out' indique 'sortie'. Par symétrie, on fera référence au flux pour l'entrée standard avec `cin`.

`<<`\
Il s'agit d'un opérateur, un peu comme `+` ou `%`. Si on utilise `<<` entre une variable de flux et une chaîne de caractère, cette chaîne de caractère sera écrite dans le flux.

`"Hello World!"`\
Une chaîne de caractère, comme en C.

`endl`\
Cette variable permet d'écrire le caractère de fin de ligne `\n` ('endl' pour 'end of line') dans le flux. Il permet également de forcer son flush.

{{% notice tip %}}
En C, on a dû vous dire expliquer qu'il fallait toujours mettre des `\n` à la fin de vos écritures avec `printf`, car cela permet d'être sûr que tout est bien écrit dans la console. En C++, `\n` ne suffit pas à le garantir, on utilisera donc `endl` lorsque l'on veut que le résultat soit écrit dans la console immédiatement.
{{% /notice %}}

Ajoutez l'instruction précédente dans votre fonction `main` et essayez de recompiler votre programme.\
Vous devriez obtenir des erreurs de ce style :
```b
blabla error ##: 'cout': is not a member of 'std' blabla
blabla message : see declaration of 'std' blabla
blabla error ##: 'cout': undeclared identifier blabla
blabla error ##: 'endl': is not a member of 'std' blabla
blabla message : see declaration of 'std' blabla
blabla error ##: 'endl': undeclared identifier blabla
```

Le premier message indique que le compilateur ne trouve aucun symbole nommé `cout` dans le namespace `std`. Eh bien oui, le C++, c'est comme le C. Le compilateur est un peu bêbête, et il faut tout lui indiquer, même où trouver les symboles de la librairie standard.

Allez sur {{% open_in_new_tab "https://en.cppreference.com/w/" "ce site" /%}} et recherchez `cout`. Cela devrait vous permettre de déterminer dans quel header la fonction est déclarée, afin d'ajouter la directive d'inclusion correspondante au fichier.

{{% expand "Solution" %}}
Vous devriez arriver sur {{% open_in_new_tab "https://en.cppreference.com/w/cpp/io/cout" "cette page" /%}}, vous indiquant que le header à référencer est `<iostream>` :
![](/CPP_Learning/images/doc-cout.png)

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
