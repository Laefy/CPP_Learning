---
title: "Options de compilation"
weight: 4
---

Si vous compilez via le terminal ou avec [Compiler Explorer](https://godbolt.org/), nous vous conseillons d'utiliser les options ci-dessous, car nous les activerons pour vos rendus de projet :
- `-std=c++17` : spécifie que le projet sera compilé en C++17 
- `-Wall -W` : permet d'activer un certain nombre de warnings
- `-Werror` : transforme les warnings en erreurs, donc tant qu'il y a des warnings, le programme ne compile pas

Sachez par ailleurs que vous pouvez également utiliser :
- `-g` : ajoute des informations supplémentaires à l'exécutable, afin de pouvoir le débugger plus facilement
