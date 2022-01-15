---
title: "Petits programmes"
weight: 1
---

Voici 2 solutions permettant de compiler et de tester rapidement des petits programme.

---

### Compiler Explorer

Vous pouvez utiliser [Compiler Explorer](godbolt.org) pour compiler du code avec à peu près tous les compilateurs de la Terre.\
Cet utilitaire vous permet également d'exécuter directement votre programme.

---

### Depuis un terminal

##### Pour compiler

Avec g++ :
```b
g++ f1.cpp f2.cpp f3.cpp -o program
```

Avec clang :
```b
clang++ f1.cpp f2.cpp f3.cpp -o program
```

Vous pouvez ajouter des [options de compilation](4-options) à la fin de la ligne de commande.

##### Pour exécuter

Utiliser simplement :
```b
./program arg1 arg2
```