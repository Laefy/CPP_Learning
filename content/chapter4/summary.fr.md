---
title: "Synthèse"
weight: 101
---

---

### Ce qu'il faut savoir faire

##### Langage

- Définir une relation de parenté **publique** entre deux classes : `class Child : public Parent { ... };`
- Définir un membre (fonction ou attribut) accessible uniquement depuis la classe courante et ses enfants : `protected : int _a1 = 0; char _a2 = 'a';`
- Appeler le constructeur de la classe parent : `Child(int p1, int p2) : Parent { p1 }, _p2 { p2 } { ... }`
- Déclarer une fonction virtuelle dans la classe de base : `virtual void fcn(int p) const;`
- Déclarer une fonction virtuelle pure dans la classe de base : `virtual void fcn(int p) const = 0;`
- Redéfinir une fonction virtuelle dans une classe dérivée : `void fcn(int p) const override;`
- Appeler une fonction de la classe-mère depuis une fonction de la classe-file : `void fcn(int p) const override { Parent::fcn(p); ... }`

---

### Ce qu'il faut retenir

##### Théorie

- L'héritage statique sert uniquement à limiter la duplication de code. On ne l'utilise pas pour faire du polymophisme.
- L'héritage dynamique permet de créer des classes polymorphes, dont on peut redéfinir le comportement lorsqu'on en hérite.
- Une classe polymorphe est une classe qui contient des fonctions virtuelles.
- Une fonction de la classe-fille override une fonction de la classe-mère **uniquement si elles ont la même signature** (nom, paramètres, const, etc).
- Une virtual table est un tableau dans lequel sont référencées les fonctions qui seront vraiment appelées au cours d'un appel virtuel.

##### Pratique

- Lorsqu'on copie un objet, on perd sa virtual table, et on ne peut donc plus garantir que les redéfinitions de fonctions seront bien appelées pendant les appels virtuels.\
Il faut donc toujours passer les objets polymorphes aux fonctions par référence ou pointeur.
- Il faut **toujours** déclarer un **destructeur virtuel** (même s'il ne fait rien) dans une classe de base polymorphe.
- Pour modéliser une classe abstraite, on peut mettre son constructeur dans la partie `protected` ou déclarer certaines de ces fonctions comme étant virtuelles pures.
- Il n'est pas possible d'instancier une classe si elle contient des fonctions virtuelles pures, ni si elle hérite de fonctions virtuelles pures qu'elle ne redéfinit pas.

##### Librairie standard

- Lorsqu'un conteneur n'acceptent pas les références (si les éléments doivent être réassignables par exemple), on peut utiliser des pointeurs à la place.

---

### Ce dont il faut à peu près se souvenir

##### Théorie

- Pour éviter de dupliquer du code, on peut utiliser la composition. Contrairement à l'héritage statique, la composition permet d'encapsuler l'objet dont on veut réutiliser le code. 

##### Pratique

- Il est possible de créer des relations de parenté privées, mais il est assez rare d'en avoir véritablement besoin.