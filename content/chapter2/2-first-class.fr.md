---
title: "Première classe ✨"
weight: 2
---

C'est parti pour la pratique ! Vous allez ici apprendre à définir une classe en C++ et à l'instancier.  
Commencez par ouvrir le [dépôt d'exercices](https://github.com/Laefy/CPP_Learning_Code/) dans VSCode.

---

### Méthodologie

Ouvrez le fichier `chap-02/1-first_class.cpp`, dans lequel on vous fournit le code de la fonction `main`.
```cpp
int main()
{
    // Person p;

    // p.set_name("Batman");
    // p.set_age(23);

    // std::cout << "Person named '" << p.get_name() << "' is " << p.get_age() << " years old." << std::endl;

    return 0;
}
```

Vous allez procéder ici en suivant plus ou moins la méthodologie **Test Driven Development** (ou TDD),
qui consiste à écrire le code des tests avant d'écrire le code appelé. Dans votre cas, il ne s'agira pas réellement de TDD (si vous voulez vraiment voir en quoi cela consiste, vous pouvez trouver plein d'exemples sur Internet, comme [cette vidéo](https://www.youtube.com/watch?v=nbSaq_ykOl4) en français), mais vous suivrez les étapes ci-dessous afin de vous habituer à écrire le code appelé uniquement à partir de ce que le code appelant requiert :
1. Décommenter la prochaine ligne du `main`.
2. Ecrire le code permettant de la faire compiler.
3. Compiler et tester.
4. Si ça ne fonctionne pas, modifier le code, et recommencer à partir de l'étape 3.
5. Si ça fonctionne, recommencer à partir de l'étape 1, jusqu'à ce que tout le code du `main` soit décommenté.

{{% notice note %}}
Pourquoi vous faire faire l'exercice de cette manière ? Déjà, cela vous permet de découvrir un peu des méthodologies qui sont employées en entreprise. Ensuite, parce que le TDD a de gros avantages :\
\- Vous n'implémentez que du code utile (principes [KISS](https://fr.wikipedia.org/wiki/Principe_KISS) et [YAGNI](https://fr.wikipedia.org/wiki/YAGNI)) : pas besoin de réfléchir à ce que vous devez fournir, puisque le code appelant vous dit quoi fournir, et vous perdez moins de temps à écrire du code qui au final ne sert à rien (= **code mort**),\
\- Vous ne déliverez que du code testé,\
\- Vous avez moins d'opportunités de **régression**, c'est-à-dire d'introduire des bugs dans du code qui fonctionnait à la base, lors d'un refactoring par exemple.
{{% /notice %}}

---

### Définition d'une classe

Voici la syntaxe permettant de définir une classe `A` :
```cpp
class A
{
};
```

Attention à ne pas oublier le point virgule `;` après l'accolade fermante. Il s'agit d'une erreur classique.

Décommentez la première instruction du `main`, permettant d'instancier une variable `p` de type `Person`, et définissez la classe correspondante juste au-dessus du `main`.  
Compilez et testez que le programme se lance correctement.

{{% hidden-solution %}}
```cpp
#include <iostream>

class Person
{
};

int main()
{
    Person p;
    ...
}
```
Pour la compilation, on peut se placer dans le répertoire `chap-02` et exécuter :
```b
g++ -std=c++17 -o 1-first_class 1-first_class.cpp
```
{{% /hidden-solution %}}

---

### Définition des membres (attributs et fonctions-membres)

Pour définir des membres dans une classe, il faut dans un premier temps choisir leur visibilité. En C++, cela se fait à l'aide des mots-clefs `public`, `private` et `protected`. Dans ce chapitre, nous n'utiliserons que les deux premiers.

Voici un exemple de classe définissant des fonctions-membres publiques et des attributs privés :
```cpp
class SomeClass
{
public:
    void fcn1(int p1, int p2)
    {
        // code
    }

    int fcn2(bool p1)
    {
        // code
    }

private:
    int         _member1 = 0;
    std::string _member2;
};
```

{{% notice note %}}
\- Nous avons mis la partie publique avant la partie privée, mais on peut très bien faire l'inverse. Il est même possible d'écrire un nouveau bloc public derrière le bloc privé. Restez cependant cohérents, et lisibles.  
\- Ici, toutes les fonctions sont publiques, et tous les attributs sont privés, mais on peut très bien mettre la définition d'une fonction dans le bloc privé ou la définition d'un attribut dans le bloc public.  
\- Nous avons préfixé les attributs avec `_`. Ce n'est ni obligatoire de préfixer, ni d'utiliser `_` comme préfixe (certains utilisent `m_` ou `my`), mais c'est toujours pratique de le faire pour distinguer les attributs des paramètres de même nom.
{{% /notice %}}

Vous allez maintenant décommenter l'instruction permettant d'appeler la fonction `set_name` sur `p`.  
Ajoutez ensuite un attribut `_name` à la classe `Person` et implémentez la fonction-membre `set_name` permettant de modifier cet attribut.  
Quelle visibilité avez-vous choisi pour `_name` et `set_name` ?

Compilez et testez que le code s'exécute correctement.

{{% hidden-solution %}}
Pour les visibilités, `_name` doit être privé, car on y accède uniquement depuis une fonction-membre.  
En revanche, `set_name` doit être publique, car on l'utilise depuis le `main`, donc en dehors de la définition de la classe.

Voici le nouveau code de la classe `Person` :

```cpp
class Person
{
public:
    void set_name(std::string name) { _name = name; }

private:
    std::string _name;
};
```
{{% /hidden-solution %}}

---

**Comment s'assurer que le code est juste, sachant que la ligne qui affiche le résultat est toujours commentée ?**

C'est la raison pour laquelle je vous ai demandé d'installer un vrai IDE. Nous allons voir comment inspecter les valeurs du programme au cours de l'exécution à l'aide du débuggeur.

Pour commencer, il faut recompiler le programme en ajoutant l'option `-g`.  
Cette option sert à ajouter les **symboles de debug** à l'intérieur des fichiers produits par la compilation.
```b
g++ -g -std=c++17 -o 1-first_class 1-first_class.cpp
```

Ensuite, pour pouvoir lancer le programme depuis VSCode, vous devez configurer le fichier `.vscode/launch.json`.  
Si ce n'est pas encore fait, rendez vous sur [cette section](/CPP_Learning/chapter0/6-tips/2-vscode/#configuration-du-fichier-launchjson), et remplacez bien le paramètre `program` par le chemin de l'exécutable.
Par exemple, si vous avez suivi la correction, vous pouvez indiquer :
```json
"program": "${workspaceFolder}/chap-02/1-first_class",
```

Une fois l'environnement correctement configuré, il faut ajouter un **breakpoint**, c'est-à-dire un point d'arrêt : cela permet au programme de se mettre en pause, juste avant l'exécution d'une instruction particulière.  

Par défaut, VSCode propose des raccourcis clavier pour les différents fonctions du débuggeur. Voici les plus utiles pour le moment :
- **F5** : Lancer ou reprendre l'exécution du programme (il se mettra en pause lorsqu'il atteindra un prochain point d'arrêt),
- **F9** : Ajouter ou supprimer un point d'arrêt à la ligne actuelle,
- **F10** : Passer à l'instruction suivante (étape par étape), sans descendre dans les fonctions,
- **F11** : Passer à l'instruction suivante en descendant dans les fonctions si nécessaire.

Ici, vous allez placer un breakpoint sur l'instruction `return 0;` du `main`. 
Pour cela, placez votre curseur sur la ligne en question et appuyez sur F9. Vous pouvez aussi cliquer directement à gauche du numéro de ligne (un espace y est dédié à l'affichage des points d'arrêt).
![](/CPP_Learning/images/vscode-breakpoint.png)

Utilisez ensuite F5 pour lancer le programme.
L'éditeur devrait prendre cette apparence, indiquant que le programme est en pause au niveau de l'instruction surlignée :
![](/CPP_Learning/images/vscode-breaking.png)

Ouvrez maintenant le panneau d'exécution en allant dans `View > Run`.
![](/CPP_Learning/images/vscode-locals.png)

Ce panneau contient 3 sections :
- La section **Variables**, dans laquelle vous pouvez voir le contenu de chacune des variables locales à votre fonction.
- La section **Watch**, qui vous permet d'entrer des expressions pour en récupérer le contenu. Vous pouvez par exemple entrer `8 + 3 * 5` pour obtenir le résultat du calcul, ou `p._name` pour obtenir la valeur de l'attribut `_name` de `p`, ou encore `&p` pour récupérer l'adresse de `p`.
- La section **Call Stack**, qui vous permet de suivre la trace des appels de fonctions, et de vous positionner à un point spécifique de la pile d'appels. Ici, vu qu'on n'a que le `main`, ce n'est pas très intéressant pour nous, mais nous y reviendrons.

Dans la section des **Variables**, si vous pouvez constater comme sur le screenshot que `p._name` vaut bien `"Batman"`, alors c'est que votre code est correct.

Appuyez ensuite sur F5 pour reprendre l'exécution du programme.

---

### Modification d'un attribut

Décommentez l'instruction faisant l'appel à `set_age`, et définissez la fonction ainsi que l'attribut correspondants.\
Quel type avez-vous utilisé pour l'âge de Batman ?

{{% hidden-solution %}}
Pour `_age`, le mieux est d'utiliser un entier non-signé. En effet, ce n'est pas possible d'avoir un âge négatif, donc utiliser un `unsigned int` plutôt qu'un `int` permet de réduire la possibilité d'avoir un mauvais usage. Vous pouvez également décider d'utiliser un `unsigned short`, plutôt que `unsigned int`, puisque même Batman ne vivra pas si vieux.

{{% notice tip %}}
Je déconseille l'utilisation de `unsigned char` cependant, car `char` est associé à la notion de caractères. Donc bien que l'espace soit suffisant pour contenir un âge humain, il est plus clair d'utiliser un vrai type entier.  
Évidemment, ce genre de bonnes pratiques ne peut s'appliquer que dans le cas où il n'y a pas de contrainte critique d'utilisation de la mémoire.
{{% /notice %}}

Voici le nouveau code :
```cpp
class Person
{
public:
    void set_name(const std::string& name) { _name = name; }
    void set_age(unsigned int age) { _age = age; }

private:
    std::string  _name;
    unsigned int _age;
};
```
{{% /hidden-solution %}}

Testez à nouveau votre code avec le débuggeur. En plus du breakpoint final, ajoutez un breakpoint supplémentaire de manière à vous arrêter juste après l'exécution du `set_name` et juste avant l'exécution du `set_age`.

{{% hidden-solution %}}
Pour s'arrêter au bon endroit, il faut placer le breakpoint sur la ligne de l'instruction `p.set_age(23);`.
![](/CPP_Learning/images/chap2-ex1-break.png)
{{% /hidden-solution %}}

Si vous inspectez la valeur de `p._age` avant l'exécution de `set_age`, il est possible que celle-ci soit complètement aléatoire. Eh oui, de la même manière que les variables locales de types fondamentaux, il faut également initialiser les attributs de types fondamentaux de vos classes. Faites les changements nécessaires pour que l'âge de Batman vaille 0 tant que celui-ci n'a pas été modifié. Testez à nouveau.

{{% hidden-solution %}}
```cpp
private:
    std::string  _name;
    unsigned int _age = 0u;
```

{{% notice info %}}
`0u` permet de faire référence au `0` entier non-signé. Cela n'a pas beaucoup d'importance ici, puisque `_age` est explicitement typé, mais si on écrivait dans une fonction `auto v = 0u;` alors `v` serait de type `unsigned int` plutôt que de type `int`. 
{{% /notice %}}
{{% /hidden-solution %}}

---

### Fonction-membre constante

Il ne reste plus qu'une seule ligne à décommenter. Vous devrez ici implémenter deux **accesseurs** (ou **getters**), un pour le nom et un pour l'âge.

Les accesseurs sont des fonctions qui ne sont pas censées modifier l'état de l'objet lorsqu'elles sont appelées. En C++, on spécifie cette garantie en plaçant le mot-clef `const` à la fin de la signature de la fonction.
```cpp
public:
    int get_value() const { return _value; }
```

Dès lors qu'une fonction-membre est marquée `const`, le compilateur va vérifier qu'aucune modification n'est effectuée sur les attributs de l'objet. Le code suivant ne compilera donc pas :  
```cpp {hl_lines=[6]}
class SomeClass
{
public:
    int set_and_get(int value) const
    {
        _value = value;
        return _value;
    }

private:
    int _value = 0;
};
```

{{% notice warning %}}
Il est extrêmement facile d'omettre d'ajouter `const` aux fonctions qui ne sont pas censées modifier l'état de l'objet. Parfois, ces indications ne sont pas strictement nécessaires pour compiler et exécuter le programme, et c'est donc difficile de prendre l'habitude de les ajouter.  
Cependant, même si le compilateur peut s'en passer, inclure le mot-clé `const` est une information précieuse pour les programmeurs qui liront votre code. Cela permet d'identifier rapidement ce qui peut être modifié et ce qui restera constant pendant l'exécution.  
Par conséquent, il est fortement recommandé de se **relire systématiquement** après l'ajout d'une fonction-membre et de se demander si cette fonction est censée modifier la classe. Si ce n'est pas le cas, n'oubliez pas d'ajouter `const` 💪
{{% /notice %}}

Revenons à notre exercice. Décommentez la dernière instruction du `main`, implémentez les deux accesseurs nécessaires (sans oublier leur `const` 🙃) et vérifiez que le programme fonctionne.

{{% hidden-solution %}}
```cpp
public:
    std::string  get_name() const { return _name; }
    unsigned int get_age() const  { return _age; }

    ...
```
{{% /hidden-solution %}}

---

### Synthèse

- Les classes peuvent contenir des **attributs** et des **fonctions-membre**.
- La définition d'une classe se termine toujours par un `;`
- On utilise `public:` ou `private:` devant un groupe de champs pour indiquer s'ils sont publics ou privés.
- Si une fonction-membre n'a pas vocation à changer l'état de l'objet, il faut indiquer qu'elle est **const** (à placer derrière les parenthèses des paramètres).
