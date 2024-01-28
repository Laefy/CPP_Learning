---
title: "Espace de stockage 💾"
weight: 3
---

Sur cette page, nous rappelerons ce que sont les variables et les pointeurs, et comment ils peuvent être représentés en mémoire, puis nous ferons de même pour les références.  
Nous présenterons ensuite les spécificités des trois zones dans lesquelles le programme alloue de la mémoire : la **mémoire statique**, la **pile** et le **tas**.  
Cela vous aidera, j'espère, à visualiser mentalement quelles sont les données valides du programme.

---

### Représentation

#### Variables

Une variable est un identifiant permettant d'accéder à une donnée de taille fixe en mémoire.  
L'emplacement précis de cette donnée constitue l'adresse de la variable.
Sur un ordinateur moderne, il s'agira généralement d'un entier encodé sur 64 bits.

Si on représente la mémoire comme un tableau dans lequel chaque case est un octet, alors nous pouvons représenter une variable comme une série contiguë de cases de ce tableau.

Supposons que le code suivant alloue `var` à l'adresse `0x00e8` (attention, pour la suite, on compte en hexadécimal !).

```cpp
int var = 145;
```

Comme `var` est de type entier, la zone mémoire s'étend sur 4 octets, c'est-à-dire entre `0x00e8` et `0x00eb`.

![Représentation d'une variable en mémoire](/CPP_Learning/images/chapter3/storage/01-var.svg)

#### Pointeurs

Un pointeur est une variable dont le rôle est de stocker l'adresse d'une autre variable.  
Si les adresses sont encodées sur 64 bits, la taille d'un pointeur est de 8 octets.

```cpp
int* ptr = &var;
```

![Représentation d'un pointeur en mémoire](/CPP_Learning/images/chapter3/storage/02-ptr.svg)

#### Références

Une référence est un alias de variable.
Elle identifie le même emplacement que la variable d'origine.  

```cpp
int& ref = var;
```

Ci-dessous, `ref` correspond donc au même bloc que `var`.  
Nous l'avons représenté en italique pour indiquer que la durée de vie de la donnée n'est pas couplée à l'identifiant `ref`.

![Représentation d'une référence en mémoire](/CPP_Learning/images/chapter3/storage/03-ref.svg)

#### Type-structuré

Dans le cas des types-structurés, les attributs d'un objet sont alloués au sein de l'espace alloué pour l'objet lui-même.

La taille d'un objet est donc souvent égale à la somme des tailles de ses attributs, mais ce n'est pas toujours le cas...  
En effet, le processeur est plus efficace pour accéder à certaines données si celles-ci sont écrites à des adresses multiples d'un certain nombre.
Par exemple, il lira plus vite un `int` si celui-ci est écrit à une adresse multiple de `4`.  
Le compilateur pourra donc décider de laisser du vide entre un attribut de type `char` (1 octet) et un attribut de type `int` (4 octets) afin d'**aligner** l'entier sur la bonne adresse.

```cpp
struct Box
{
    int v1 = 2;
    char c = 'A';
    int v2 = 0;
};

Box box;
```

![Représentation d'un objet en mémoire](/CPP_Learning/images/chapter3/storage/04-struct.svg)

{{% notice tip %}}
Si vous voulez éviter de perdre de l'espace dans vos types-structurés, vous pouvez modifier l'ordre dans lequel vous définissez vos attributs.  
Attention cependant, notez bien que cela modifie aussi l'ordre dans lequel ils sont instanciés !
{{% /notice %}}

---

### La mémoire statique

La **mémoire statique** est la zone contenant les données associées aux variables globales du programme.

Comme la taille d'une variable dépend uniquement de son type, la compilation permet de déterminer la quantité d'espace à allouer pour le segment de mémoire statique.
Il est réservé une fois pour toute par le système d'exploitation au lancement du programme, et est restitué une fois la fonction `main` terminée.

Il n'est pas possible d'augmenter ou de réduire cet espace réservé au cours de l'exécution du programme, et c'est pour cela qu'on parle de mémoire "statique".

---

### La pile

La **pile** est l'espace mémoire dans lequel sont stockées la plupart des variables locales.  
Il s'agit d'un espace de taille limitée (quelques méga-octets en général, cela dépend du système), mais dans lequel il est très rapide d'accéder et de modifier les données.  
De plus, l'allocation est **immédiate**, car cet espace est réservé à votre programme dès qu'il démarre.

```cpp {linenos=table}
int f2(int p)
{
    auto b = true;
    // ...
    return p + 3;
}

void f1()
{
    auto v1 = 5;
    auto v2 = f2(v1);
    auto v3 = 'a';
    // ...
}
```

A l'exécution, la pile pourrait avoir le contenu suivant :
![Contenu de la pile](/CPP_Learning/images/chapter3/storage/05-stack.svg)

Le haut de la pile est indiqué par la flèche.  
`l.9`: On entre d'abord dans la fonction `f1`.  
`l.10`: On ajoute la variable `v1` dans la pile et on l'initialise à `5`.  
`l.2`: Ensuite, on appelle la fonction `f2`. On empile le paramètre `p` contenant la valeur `5`.  
`l.3`: On ajoute `b` à la pile, puis on exécute le restant de la fonction.  
`l.6`: Une fois `f2` terminée, toutes les variables définies dedans sont retirées de la pile.  
`l.11`: On place ensuite `v2` dans la pile, initialisée à la valeur de retour de `f2`.  
`l.12`: Enfin, on empile `v3` et on exécute le restant de la fonction.  
`l.12`: À la fin de l'appel à `f1`, on retire toutes les variables locales de la pile.

{{% notice note %}}
Notez bien que ce scénario n'est qu'un exemple parmi d'autres de ce qu'il pourrait se passer.
En fonction de l'implémentation de votre compilateur et des instructions qu'il produit, le contenu de la pile ne sera pas le même.
Par exemple, à des fins d'optimisation, il est fort probable que certaines variables soient stockées directement dans les registres du processeur plutôt que sur la pile.
{{% /notice %}} 

---

### Le tas

Les données sont allouées sur le **tas** dès lors qu'elles sont allouées dynamiquement (c'est-à-dire via un `new`).

Contrairement à l'allocation sur la pile, l'allocation sur le tas est coûteuse en temps.  
En effet, le processus doit demander au système d'exploitation qu'il lui alloue un segment de mémoire-vive de taille suffisante pour stocker l'objet.  
Cette opération est longue car, comme tous les appels-système, elle nécessite de rendre la main au système d'exploitation et donc de changer de contexte d'exécution.

L'accès est également plus lent que sur la pile, car les données ne sont pas forcément regroupées : elles sont stockées là où le système a trouvé assez d'espace pour l'allocation.
On a donc plus souvent des *cache-miss* (litteralement "échec de cache", c'est-à-dire lorsque le cache ne contient pas le contenu demandé) que lorsqu'on accède aux données de la pile.

Il y a tout de même des avantages à allouer sur le tas.  
Déjà, on peut allouer autant de données qu'on le souhaite (ou tout du moins, autant que votre machine vous le permette).  
Ensuite, les données restent disponibles tant qu'on ne décide pas de les désinstancier.
Cela permet d'instancier des objets dans une fonction et qu'ils ne soient pas désinstanciés au retour vers l'appelant.

```cpp {linenos=table}
int* make_int(int value)
{
    int* ptr = new int { value };
    return ptr;
}

int main()
{
    auto* ptr_1 = make_int(1);
    std::cout << *ptr_1 << std::endl;
    delete ptr_1;

    return 0;
}
```

![Contenu de la pile et du tas](/CPP_Learning/images/chapter3/storage/06-heap.svg)

`l.9`: On appelle la fonction `make_int` avec l'argument `1`.  
`l.2`: On entre dans la fonction, on ajoute le paramètre `value` dans la pile.  
`l.3`: On alloue un entier de valeur `1` sur le tas, et on stocke l'adresse dans `ptr`.  
`l.5`: On sort de la fonction, donc on dépile les variables locales, mais le contenu du tas ne change pas.   
`l.9`: On stocke la valeur de retour de `make_int` dans `ptr_1`.  
`l.11`: On demande la désinstanciation de l'entier alloué sur le tas.  
`l.14`: On sort du `main`, donc on dépile toutes les variables définies dedans.  

---

### Synthèse

- Les variables globales et statiques sont allouées dans la **mémoire statique** du programme.
- Les variables locales sont allouées sur la **pile** ou dans les registres du processeur.  
Sa taille est limitée, mais l'allocation des données est immédiate et les accès très rapides.
- Les données allouées dynamiquement sont placées dans le **tas**.  
L'allocation et les accès peuvent être longs, mais la quantité d'espace disponible est très importante.
