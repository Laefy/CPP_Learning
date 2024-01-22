---
title: "Allocation dynamique 🎇"
weight: 1
---

Cette première page sera assez courte, elle vous présentera simplement la syntaxe permettant d'allouer dynamiquement de la mémoire et de libérer.

---

### Allouer un seul élément 

Pour allouer un bloc de mémoire, on utilise le mot-clef `new`, suivi du type de donnée que l'on souhaite placer dedans, puis de la valeur avec laquelle on souhaite l'initialiser.  
Cette instruction retourne un pointeur.

```cpp
int* ptr_5 = new int { 5 };
std::cout << *ptr_5 << std::endl;   // --> 5
```

Comme pour une variable classique, on peut utiliser des `{}` ou des `()` pour indiquer la valeur initiale.
```cpp
int* ptr_3 = new int(3);
std::cout << *ptr_3 << std::endl;   // --> 3
```

Une fois que de la mémoire a été allouée dynamiquement, il faut penser à la libérer.  
Pour cela, on emploie `delete` :
```cpp
delete ptr_3;
delete ptr_5;
```

---

### Allouer un tableau d'éléments

Pour allouer plusieurs éléments à la fois, c'est quasiment pareil, si ce n'est que juste derrière `new`, on indique entre `[]` le nombre d'éléments souhaités.  
L'initialisation se fait forcément avec des `{}`.

```cpp
char* many_chars = new char[3] { 'a', 'b', 'c' };
std::cout << many_chars[0] << many_chars[1] << many_chars[2] << std::endl;   // --> abc
```

Attention, pour la libération du bloc mémoire, il faut écrire `delete` suivi de `[]` vides !
```cpp
delete[] many_chars;
```

---

### Pas d'exercice ?

Eh bien non, pas sur cette partie.

En effet, en C++, même si vous en faites votre métier, vous n'aurez quasiment jamais besoin de vous servir de `new` et `delete`.  
Ce sont des classes, telles que `std::vector` ou `std::string`, qui se chargeront de faire ce sale boulot pour vous !  

C'est néanmoins utile pour la culture d'avoir vu comment on écrivait des allocations à la mano.  
Et surtout, cela vous permettra de comprendre ce que nous avons écrit dans la suite de ce chapitre.
