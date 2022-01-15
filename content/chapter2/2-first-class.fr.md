---
title: "✨ Première classe"
weight: 2
---

C'est parti pour la pratique ! Vous allez ici apprendre à définir une classe en C++ et à l'instancier.

---

Pour cet exercice, vous modifierez le fichier :\
\- `chap-02/1-first_class.cpp`

La cible à compiler est `c2-1-first_class`.

---

### Méthodologie

Pour cet exercice, on vous fournit le code de la fonction `main`.
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
qui consiste à écrire le code des tests avant d'écrire le code appelé. Dans votre cas, il ne s'agira pas réellement de TDD (si vous voulez vraiment voir en quoi cela consiste, vous pouvez trouver plein d'exemples sur Internet), mais vous suivrez les étapes ci-dessous afin de vous habituer à écrire le code appelé uniquement à partir de ce que le code appelant requiert :
1. Décommenter la prochaine ligne du `main`.
2. Ecrire le code permettant de la faire compiler.
3. Compiler et tester.
4. Si ça ne fonctionne pas, modifier le code, et recommencer à partir de l'étape 3.
5. Si ça fonctionne, recommencer à partir de l'étape 1, jusqu'à ce que tout le code du `main` soit décommenté.

{{% notice note %}}
Pourquoi vous faire faire l'exercice de cette manière ? Déjà, cela vous permet de découvrir un peu des méthodologies qui sont employées en entreprise. Ensuite, parce que le TDD a de gros avantages :\
\- vous n'implémentez que du code utile : pas besoin de réfléchir à ce que vous devez fournir, puisque le code appelant vous dit quoi fournir, et vous perdez moins de temps à écrire du code qui au final ne sert à rien (= **code mort**),\
\- vous ne déliverez que du code testé,\
\- vous avez moins d'opportunités de **régression**, c'est-à-dire d'introduire des bugs dans du code qui fonctionnait à la base, lors d'un refacto par exemple.
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

Décommentez la première instruction du `main`, permettant d'instancier une variable `p` de type `Person`, et définissez la classe correspondante juste au-dessus du `main`.\
Compilez et testez que le programme se lance correctement.

{{% expand "Solution" %}}
```cpp
#include ...

class Person
{
};

int main()
{
    Person p;
    ...
}
```
{{% /expand %}}

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
\- Nous avons mis la partie publique avant la partie privée, mais on peut très bien faire l'inverse. Il est même possible d'écrire un nouveau bloc public derrière le bloc privé.\
\- Ici, toutes les fonctions sont publiques, et tous les attributs sont privés, mais on peut très bien mettre la définition d'une fonction dans le bloc privé ou la définition d'un attribut dans le bloc public.\
\- Nous avons préfixé les attributs avec `_`. Ce n'est ni obligatoire de préfixer, ni d'utiliser `_` comme préfixe (certains utilisent `m_` ou `my`), mais c'est toujours pratique de le faire pour distinguer les attributs des paramètres de même nom.
{{% /notice %}}

Vous allez maintenant décommenter l'instruction permettant d'appeler la fonction `set_name` sur `p`. Ajoutez ensuite un attribut `_name` à la classe `Person` et implémentez la fonction-membre `set_name` permettant de modifier cet attribut.\
Quel type allez-vous utiliser pour `_name` ? Quel est la signature la plus appropriée pour `set_name` ?

Compilez et testez que le code s'exécute correctement.

{{% expand "Solution" %}}
Pour `_name`, il est préférable d'utiliser `std::string`. On aurait pu prendre `const char*`, mais ça voudrait dire qu'il faut s'occuper d'allouer et de libérer la mémoire pour les caractères (`char*` n'étant qu'un pointeur).
Autant utiliser une classe qui s'en charge déjà pour nous 🙂

La signature la plus appropriée pour `set_name` avec ce que l'on a vu jusqu'ici est : `void set_name(const std::string& name)`. Les copies de `std::string` étant coûteuses (allocation mémoire), on passera par référence constante plutôt que par copie.

Enfin, pour les visibilités, `_name` doit être privé, car on y accède uniquement depuis une fonction-membre. En revanche, `set_name` doit être publique, car on l'utilise depuis le `main`, donc en dehors de la définition de la classe.

Voici le nouveau code de la classe `Person` :

```cpp
class Person
{
public:
    void set_name(const std::string& name) { _name = name; }

private:
    std::string _name;
};
```
{{% /expand %}}

---

**Comment s'assurer que le code est juste, sachant que la ligne qui affiche le résultat est toujours commentée ?**

C'est la raison pour laquelle je vous ai demandé d'installer un vrai IDE. Nous allons voir comment inspecter les valeurs du programme au cours de l'exécution à l'aide du débuggeur.

Déjà, il faut placer un **breakpoint**. Cela permet au programme de se mettre en pause, juste avant l'exécution d'une instruction particulière. Nous allons placer le breakpoint sur l'instruction `return 0;` du `main`. 
Pour faire cela dans VSCode, placez votre curseur sur la ligne en question et appuyer sur F9. Vous pouvez aussi cliquer directement dans l'espace juste avant le numéro de ligne.
![](/CPP_Learning/images/vscode-breakpoint.png)

Afin de pouvoir lancer le programme, il faudra préalablement avoir configuré votre fichier `launch.json`.\
Si ce n'est pas encore fait, rendez vous sur [cette page](/CPP_Learning/chapter0/6-tips/2-vscode/#configuration-du-fichier-launchjson) pour le faire.\
Utilisez ensuite F5 pour lancer le programme.
L'éditeur devrait prendre cette apparence, indiquant que le programme est en pause à l'instruction surlignée :
![](/CPP_Learning/images/vscode-breaking.png)

Ouvrez maintenant le panneau d'exécution en allant dans `View > Run`.
![](/CPP_Learning/images/vscode-locals.png)

Ce panneau contient 3 sections :
- La section Variables, dans laquelle vous pouvez voir le contenu de chacune des variables locales à votre fonction.
- La section Watch, qui vous permet d'entrer des expressions pour en récupérer le contenu. Vous pouvez par exemple entrer "8+3*5" pour obtenir le résultat du calcul, ou "p._name" pour obtenir la valeur de `p.name`, ou encore "&p" pour récupérer l'adresse de `p`.
- La section Call Stack, qui vous permet de remonter les appels de fonction pour vous placer à un endroit particulier de la pile d'appel. Ici, vu qu'on a que le `main`, ce n'est pas très intéressant pour nous, mais nous y reviendrons.

Si dans la section des Variables, vous pouvez constater comme sur le screenshot que `p._name` vaut bien `"Batman"`, alors c'est que votre code est correct.

Appuyez ensuite sur F5 pour reprendre l'exécution du programme.

---

### Initialisation d'un attribut

Décommentez l'instruction faisant l'appel à `set_age`, et définissez la fonction ainsi que l'attribut correspondants.\
Quel type avez-vous utiliser pour l'âge de Batman ? Avez-vous passé le paramètre de la fonction `set_age` par valeur, référence ou référence constante ?

{{% expand "Solution" %}}
Pour `_age`, le mieux est d'utilisé un entier non-signé. En effet, ce n'est pas possible d'avoir un âge négatif, donc utiliser un `unsigned int` plutôt qu'un `int` permet de réduire la possibilité d'avoir un mauvais usage. Vous pouvez également décider d'utiliser un `unsigned short`, plutôt que `unsigned int`, puisque même Batman ne vivra pas si vieux.

{{% notice tip %}}
Je déconseille l'utilisation de `unsigned char` cependant, car `char` est associé à la notion de caractères. Donc bien que l'espace soit suffisant pour contenir un âge humain, il est plus clair d'utiliser un vrai type entier.\
Evidemment, ce genre de bonne pratique ne peut s'appliquer que dans le cas où il n'y a pas de contrainte critique d'utilisation de la mémoire.
{{% /notice %}}

Pour `set_age`, il est préférable de passer la paramètre par valeur (ou copie). En effet, pour des types primitifs ou des petits objets qui n'allouent rien à leur construction, passer par valeur plutôt que par const-ref permet au compilateur d'optimiser le code comme il le souhaite.

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
{{% /expand %}}

Testez à nouveau votre code avec le débuggeur. En plus du breakpoint final, ajoutez un breakpoint suppplémentaire de manière à vous arrêter juste après l'exécution du `set_name` et juste avant l'exécution du `set_age`.

{{% expand "Solution" %}}
Pour s'arrêter au bon endroit, il faut placer le breakpoint sur la ligne de l'instruction `p.set_age(23);`.
![](/CPP_Learning/images/chap2-ex1-break.png)
{{% /expand %}}

Si vous inspectez la valeur de `p._age` avant l'exécution de `set_age`, vous devriez constater que celle-ci est complètement aléatoire. Eh oui, de la même manière que les variables locales de type primitif, il faut également initialiser les attributs de type primitifs de vos classes. Faites les changements nécessaires pour que l'âge de Batman vaille 0 tant que celui-ci n'a pas été modifié. Testez à nouveau.

{{% expand "Solution" %}}
```cpp
private:
    std::string  _name;
    unsigned int _age = 0u;
```

{{% notice info %}}
`0u` permet de faire référence au `0` entier non-signé. Cela n'a pas beaucoup d'importance d'ici, puisque `_age` est explicitement typé, mais si on écrivait dans une fonction `auto v = 0u;` alors `v` serait de type `unsigned int` plutôt que de type `int`. 
{{% /notice %}}
{{% /expand %}}

---

### Fonction-membre constante

Il ne reste plus qu'une seule ligne à décommenter. Vous devrez ici implémenter deux **accesseurs** (ou **getters**), un pour le nom et un pour l'âge.

Les accesseurs sont des fonctions qui ne sont pas censées modifier l'état de l'objet lorsqu'elles sont appelées. En C++, on spécifie cette garantie en plaçant le mot-clef `const` à la fin de la signature de la fonction.
```cpp
public:
    int get_value() const { return _value; }
```

Dès lors qu'une fonction-membre est marquée `const`, le compilateur va vérifier qu'aucune modification n'est effectué sur les attributs de l'objet. Le code suivant ne compilera donc pas :  
{{< highlight cpp "hl_lines=6" >}}
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
{{< /highlight >}}

Aussi, seules les fonctions-membres constantes peuvent être appelées sur des objets constants ou des références constantes. Le code suivant ne compilera que si la fonction `Obj::get` a bien été marquée `const`.
```cpp
void fcn(const Obj& param)
{
    param.get();

    const Obj var;
    var.get();
};
```

{{% notice warning %}}
Il est extrêmement important de s'assurer de la **const-correctness** de votre code. Le mot-clef `const` doit être placé sur les variables, références et attributs qui ne vont pas être modifiés, ainsi que sur les fonctions-membres qui ne vont pas modifier l'état de l'objet.\
Une bonne partie des `const` n'est pas nécessaire pour faire compiler et fonctionner le programme, et c'est donc difficile, surtout au début, de prendre l'habitude de les mettre partout où ils devraient être. Cependant, même si le compilateur peut parfois s'en passer, il s'agit d'une information très utile pour le programmeur qui va lire votre code, car cela permet d'identifier très vite ce qui peut bouger et ce qui ne bougera jamais au cours de l'exécution.\
Donc demandez-vous autant que possible si vous avez bien placé les `const` partout où vous pouvez, et faites-le si ce n'est le cas 💪
{{% /notice %}}

Revenons à notre exercice. Décommentez la dernière instruction du `main`, implémentez les deux accesseurs nécessaires (sans oublier leur `const` 🙃) et vérifiez que le programme fonctionne.

{{% expand "Solution" %}}
Pour les types de retour, c'est pareil que pour les paramètres en entrée, on peut renvoyer des const-ref pour éviter les copies coûteuses de `string`.

```cpp
public:
    const std::string& get_name() const { return _name; }
    unsigned int       get_age() const  { return _age; }

    ...
```
{{% /expand %}}


