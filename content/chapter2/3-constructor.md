---
title: "🔨 Constructeur"
weight: 3
---

Dans cet exercice, vous apprendrez à paramétrer la construction de vos objets. 

---

Pour cet exercice, vous modifierez le fichier :\
\- `chap-02/2-constructor.cpp`

La cible à compiler est `c2-2-constructor`.

---

### Constructeur à paramètres

Reprenez le code de l'exercice précédent.

Vous aviez implémenté une fonction-membre `set_name` dans la classe `Person` pour initialiser l'attribut `_name`. Or, ce serait bien d'une part de réellement pouvoir initialiser cet attribut plutôt que de le modifier après l'instanciation, et d'autre part, de supprimer ce **setter**, afin qu'une fois initialisé, il ne soit plus possible de modifier `_name`.

Pour faire cela, il va falloir que vous définissiez une fonction spéciale appelée **constructeur**.
Voici la syntaxe générique d'un constructeur :
```cpp
class ClassName
{
public:
    ClassName(type p1, type p2, ...)
        : _attribute_1 { /* value for _a1 */ }
        , _attribute_2 { /* value for _a2 */ }
        , ...
    {
        // some optional code
    }

private:
    type _attribute_1;
    type _attribute_2;
    ...
};
```

Il s'agit donc d'une fonction sans type de retour, de même nom que la classe. Les membres sont initialisés entre le prototype et le corps de la fonction, dans ce qui s'appelle la **liste d'initialisation**.

Voici un exemple de ce que cela peut donner sur une petite classe :
```cpp
class Dog
{
public:
    Dog(const std::string& breed, const std::string& name)
        : _breed { breed }
        , _name { name }
    {
        std::cout << "Dog named " << name << " has just been born!" << std::endl;
    }

private:
    std::string _breed;
    std::string _name;
};
```

Et pour instancier la classe `Dog` avec le constructeur ci-dessus, on peut écrire :
```cpp
Dog dog { "Colley", "Lassie" }; 
```

Commencez par modifier votre fonction `main`, de manière à passer le nom `"Batman"` à la construction de la variable `p`, puis supprimez l'appel à `set_name`.
Modifiez ensuite la classe `Person` pour lui ajouter un constructeur à un paramètre, dans lequel vous initialiser l'attribut `_name`. Vous n'êtes pas obligé d'initialiser `_age` dans la liste d'initialisation du constructeur, car cet attribut est déjà initialisé au niveau de sa définition (= **class initializer**).

Comme d'habitude, compilez et testez ensuite votre programme.

{{% expand "Solution" %}}
Instanciation :
```cpp
Person p { "Batman" };
```

Définition du constructeur :
```cpp
class Person
{
public:
    Person(const std::string& name)
        : _name { name }
    {}

    ...
};
```
{{% /expand %}}

Batman n'est pas né Batman. Batman est né Bruce Wayne.\
Modifiez l'instanciation de `p` de manière à passer deux paramètres `name` et `surname`.
Ajoutez l'attribut correspondant `_surname` à la classe et modifiez la définition de son constructeur afin de prendre en compte ces changements.

{{% expand "Solution" %}}
Instanciation :
```cpp
Person p { "Bruce", "Wayne" };
```

Définition du constructeur :
```cpp
class Person
{
public:
    Person(const std::string& name, const std::string& surname)
        : _name { name }
        , _surname { surname }
    {}

    ...

private:
    std::string  _name;
    std::string  _surname;
    unsigned int _age = 0u;
};
```
{{% /expand %}}

Pour terminer, renommez votre fonction `get_name` en `get_full_name` et réalisez les modifications nécessaires afin que celle-ci renvoie `"Bruce Wayne"` plutôt que `"Bruce"`.
{{% expand "Solution" %}}
La fonction `get_name` pouvait renvoyer une const-ref, car le résultat pointait sur l'espace mémoire de l'attribut `_name`.
Comme le résultat ne fait plus référence à un attribut de la classe, il est nécessaire de le renvoyer par valeur.
```cpp
std::string get_full_name() const { return _name + " " + _surname; }
```
{{% /expand %}}

---

### Le constructeur par défaut

Modifiez l'instanciation de `p` dans la fonction `main` de manière à ne plus lui passer d'arguments (comme c'était le cas avant de commencer l'exercice) :
```cpp
Person p;
```

Le programme ne compile plus alors qu'il compilait tout à l'heure.\
Commentez la définition de votre constructeur, et essayez de compiler à nouveau. Ca recompile...

**Pourquoi le programme compile quand on retire un constructeur ?**

Lorsque l'utilisateur ne définit aucun constructeur, le compilateur définit (s'il le peut) un constructeur qui n'attend aucun argument.

On appelle **constructeur par défaut** tout constructeur qui n'attend aucun paramètre. L'utilisateur et le compilateur peuvent donc tout deux définir un constructeur par défaut. Dans le cas du compilateur, on parlera d'**implémentation par défaut du constructeur par défaut**.

L'implémentation par défaut du constructeur par défaut (trop de "defaut", je sais) initialise les attributs de la classe selon les règles suivantes :\
1- en utilisant le class-initializer s'il est fourni (comme pour `_age`),\
2- s'il n'y a pas de class-initializer et que l'attribut est une classe, en appelant son constructeur par défaut (comme pour `_name`, qui étant une `std::string`, est construit par défaut avec la chaîne vide),\
3- s'il n'y a pas de class-initializer et que l'attribut n'est pas une classe, alors son contenu sera indéfini.

Du coup pour répondre à la question, le code originel compilait car le compilateur définissait un constructeur par défaut à la classe `Person`. Dès lors que vous avez ajouté votre propre constructeur, le compilateur a supposé que vous ne vouliez probablement plus de l'implémentation qu'il vous fournissait. Il ne vous était donc plus possible d'instancier la classe `Person` sans paramètres.

Si vous vouliez pouvoir le faire à nouveau, tout en gardant votre constructeur à 2 paramètres, vous devriez donc définir un nouveau constructeur par défaut.

```cpp
class Person
{
public:
    Person()
    {}

    Person(const std::string& name, const std::string& surname)
        : _name { name }, _surname { surname }
    {}

    ...
};
```

{{% notice note %}}
1- Si on n'initialise aucun attribut dans la liste d'initialisation d'un constructeur, alors il faut omettre complètement cette liste (écrire `Person() {}` plutôt que `Person() : {}`).\
2- Si un attribut n'est pas initialisé via la liste d'initialisation, alors il est initialisé selon les mêmes règles que celles exposées pour l'implémentation par défaut du constructeur par défaut. C'est pour cela que l'on n'a pas besoin de respécifier `_age` dans la liste d'initialisation du constructeur à 2 paramètres.
{{% /notice %}}

---

### Syntaxe d'instanciation

Nous avons vu deux manières d'instancier une classe :
- avec 0 paramètre : `Class obj;`,
- avec N paramètres : `Class obj { p1, p2, ..., pn };`.

En réalité, on peut également utiliser la syntaxe avec des `{}` lorsqu'on initialise avec 0 paramètre : `Class obj {};`\
Et on peut aussi utiliser la syntaxe avec des `()`, mais seulement si on a au moins 1 paramètre : `Class obj(p1, p2, ..., pn);`\
Et enfin, lorsqu'il n'y a qu'un seul paramètre, on peut dans certains cas utiliser `= p` : `std::string s = "Batman";`.

Ces syntaxes s'utilisent également pour l'instanciation des primitives : `int a = 1;` / `int a { 1 };` / `int a(1);` 

Pour le moment, vous pouvez considérer que ces méthodes sont plus ou moins équivalentes (évidemment, ce n'est pas le cas, sinon ce ne serait pas drôle, mais nous y reviendrons au [Chapitre 3](/chapter3/)).
Ne vous embêtez pas à mémoriser toutes ces règles par coeur. Retenez simplement que d'autres variations de syntaxe existent, pour que vous ne soyiez pas étonner si vous les rencontrez dans du code que vous n'avez pas écrit.

{{% notice info %}}
Si vous choisissez d'utiliser la syntaxe `()`, faites attention lorsque vous appelez le constructeur par défaut (= à 0 paramètre), car il faut alors complètement omettre les parenthèses.\
Si vous écrivez `Class obj();` au lieu de `Class obj;`, le compilateur va râler.
{{% /notice %}}

{{% notice note %}}
Pour initialiser des attributs dans la liste d'initialisation, il est possible d'utiliser `()` au lieu des `{}`.\
Contrairement à l'initialisation des variables, on peut par contre écrire `: _attr()` sans rien dans les parenthèses. Incompréhensible n'est-ce pas ? 😵
{{% /notice %}}

---

### À bas les setters

L'ajout de votre constructeur vous a permis de supprimer le setter pour `_name`, afin que l'on ne puisse pas modifier l'attribut après son initialisation.\
Il reste le setter pour `_age`, qui ne pose pas spécialement de problème, si ce n'est qu'on peut remonter le temps avec. Et là, c'est *Batman*, pas *Retour vers le futur* 🦇

Vous allez donc remplacer votre fonction `set_age` par une fonction `wait`, qui permet uniquement d'augmenter l'âge de votre objet. Testez que votre programme fonctionne correctement.

{{% expand "Solution" %}}
Appel :
```cpp
p.wait(23);
```

Définition :
```cpp
void wait(unsigned int years) { _age += years; }
```
{{% /expand %}}

{{% notice note %}}
Définir et utiliser des setters n'est pas forcément mauvais. Ce qui est mauvais, c'est de définir des setters pour tous les attributs d'une classe, sans prendre le temps de définir au préalable ses invariants (l'attribut `_age` ne peut pas décroitre au cours de l'exécution).
{{% /notice %}}
