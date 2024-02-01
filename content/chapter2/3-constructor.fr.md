---
title: "Constructeur 🔨"
weight: 3
---

Dans cet exercice, vous apprendrez à paramétrer la construction de vos objets.

---

### Constructeur à paramètres

Ouvrez le fichier `chap-02/2-constructor.cpp`. Il contient une correction de l'exercice précédent.

Vous aviez implémenté une fonction-membre `set_name` dans la classe `Person` pour initialiser l'attribut `_name`. Or, ce serait bien d'une part de réellement pouvoir initialiser cet attribut plutôt que de le modifier après l'instanciation, et d'autre part, de supprimer ce **setter**, afin qu'une fois initialisé, il ne soit plus possible de modifier `_name`.

Pour faire cela, il va falloir que vous définissiez une fonction spéciale appelée **constructeur**.
Voici la syntaxe générique d'un constructeur :
```cpp
class ClassName
{
public:
    ClassName(type p1, type p2, ...)
        : _attribute_1 { /* value for _attribute_1 */ }
        , _attribute_2 { /* value for _attribute_2 */ }
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
    Dog(std::string breed, std::string name)
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
Modifiez ensuite la classe `Person` pour lui ajouter un constructeur à 1 paramètre, dans lequel vous initialisez l'attribut `_name`. Vous n'êtes pas obligé d'initialiser `_age` dans la liste d'initialisation du constructeur, car cet attribut est déjà initialisé au niveau de sa définition (= **class initializer**).

Comme d'habitude, compilez et testez ensuite votre programme.

{{% hidden-solution %}}
Instanciation :
```cpp
Person p { "Batman" };
```

Définition du constructeur :
```cpp
class Person
{
public:
    Person(std::string name)
        : _name { name }
    {}

    ...
};
```
{{% /hidden-solution %}}

Batman n'est pas né Batman. Batman est né Bruce Wayne.  
Modifiez l'instanciation de `p` de manière à passer deux paramètres `name` et `surname` (qui signifie "nom de famille" et pas "surnom").  
Ajoutez l'attribut correspondant `_surname` à la classe et modifiez la définition de son constructeur afin de prendre en compte ces changements.

{{% hidden-solution %}}
Instanciation :
```cpp
Person p { "Bruce", "Wayne" };
```

Définition du constructeur :
```cpp
class Person
{
public:
    Person(std::string name, std::string surname)
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
{{% /hidden-solution %}}

Renommez votre fonction `get_name` en `get_full_name` et réalisez les modifications nécessaires afin que celle-ci renvoie `"Bruce Wayne"` plutôt que `"Bruce"`.

{{% hidden-solution %}}
```cpp
std::string get_full_name() const { return _name + " " + _surname; }
```
{{% /hidden-solution %}}

Pour terminer, supprimez le setter pour `_name`, puisque celui-ci n'est plus utilisé.

---

### Le constructeur par défaut

Modifiez l'instanciation de `p` dans la fonction `main` de manière à ne plus lui passer d'arguments (comme c'était le cas avant de commencer l'exercice) :
```cpp
Person p;
```

Oups ! Le programme ne compile plus, alors qu'il compilait tout à l'heure.  
Commentez la définition de votre constructeur, et essayez de compiler à nouveau. Ça recompile...

**Pourquoi le programme compile quand on retire un constructeur ?**

Lorsque l'utilisateur ne définit aucun constructeur, le compilateur définit (s'il le peut) un constructeur qui n'attend aucun argument.

Concernant le vocabulaire, on appelle :
- **constructeur par défaut** tout constructeur qui n'attend aucun paramètre,
- **implémentation par défaut** une implémentation fournie automatiquement par le compilateur.

Le compilateur définit donc une **implémentation par défaut du constructeur par défaut** (oui, c'est long à dire) si le programmeur ne définit **aucun** constructeur.

L'implémentation par défaut du constructeur par défaut initialise les attributs de la classe selon les règles suivantes :
1. Si un class-initializer est fourni, on l'utilise (comme pour `_age`).
2. S'il n'y a pas de class-initializer et que l'attribut est une classe, on appelle son constructeur par défaut (comme pour `_name` qui, étant une `std::string`, est construit par défaut avec la chaîne vide).
3. S'il n'y a pas de class-initializer et que l'attribut n'est pas une classe, alors il ne se passe rien, et le contenu de l'attribut est donc indéfini.

Du coup, pour répondre à la question, le code original compilait car le compilateur définissait un constructeur par défaut pour la classe `Person`.  
Cependant, dès que vous avez introduit votre propre constructeur, le compilateur a supposé que vous n'aviez plus besoin de l'implémentation par défaut qu'il fournissait et l'a supprimé.  
Il n'était alors plus possible d'instancier la classe `Person` sans spécifier d'arguments.

Si vous voulez instancier une `Person` sans argument tout en conservant votre constructeur à 2 paramètres, vous devez définir explicitement un constructeur par défaut (c'est-à-dire un constructeur sans paramètre).

```cpp
class Person
{
public:
    Person()
    {}

    Person(std::string name, std::string surname)
        : _name { name }, _surname { surname }
    {}

    ...
};
```

{{% notice note %}}
1\. Si aucun attribut n'est initialisé dans la liste d'initialisation d'un constructeur, il est nécessaire d'omettre complètement cette liste (c'est-à-dire écrire `Person() {}` plutôt que `Person() : {}`).  
2\. Si un attribut n'est pas initialisé via la liste d'initialisation, il est automatiquement initialisé selon les mêmes règles que celles définies pour l'implémentation par défaut du constructeur par défaut. C'est la raison pour laquelle il n'est pas nécessaire de spécifier à nouveau `_age` dans la liste d'initialisation du constructeur à 2 paramètres.
{{% /notice %}}

---

### Syntaxe pour l'instanciation

Nous avons vu deux manières d'instancier une classe :
- avec 0 paramètre : `Class obj;`,
- avec N paramètres : `Class obj { p1, p2, ..., pn };`.

En réalité, on peut également utiliser la syntaxe avec des `{}` lorsqu'on initialise avec 0 paramètre : `Class obj {};`\
Et on peut aussi utiliser la syntaxe avec des `()`, mais seulement si on a au moins 1 paramètre : `Class obj(p1, p2, ..., pn);`\
Et enfin, lorsqu'il n'y a qu'un seul paramètre, on peut dans certains cas utiliser `= p` : `std::string s = "Batman";`.

Ces syntaxes s'utilisent également pour l'instanciation des variables de types fondamentaux : `int a = 1;` / `int a { 1 };` / `int a(1);` 

Pour le moment, vous pouvez considérer que ces méthodes sont plus ou moins équivalentes (évidemment, ce n'est pas le cas, sinon ce ne serait pas drôle, mais nous y reviendrons un peu plus tard).  
Comme indiqué dans le Chapitre 1, ne vous embêtez pas à mémoriser toutes ces règles par coeur.
Retenez simplement que d'autres variantes de syntaxe existent, pour que vous ne soyiez pas étonnés si vous les rencontrez dans du code que vous n'avez pas écrit.

{{% notice info %}}
Si vous choisissez d'utiliser la syntaxe `()`, faites attention lorsque vous appelez le constructeur par défaut (= à 0 paramètre), car il faut alors complètement omettre les parenthèses.  
Si vous écrivez `Class obj();` au lieu de `Class obj;`, le compilateur va râler.
{{% /notice %}}

{{% notice note %}}
Pour initialiser des attributs dans la liste d'initialisation, il est possible d'utiliser `()` au lieu des `{}`.\
Contrairement à l'initialisation des variables, on peut écrire `: _attr()` sans rien dans les parenthèses. Incompréhensible n'est-ce pas ? 😵
{{% /notice %}}

---

### À bas les setters

L'ajout de votre constructeur vous a permis de supprimer le setter pour `_name`, afin que l'on ne puisse plus modifier l'attribut après son initialisation.  
Il reste le setter pour `_age`, qui ne pose pas spécialement de problème, si ce n'est qu'on peut remonter le temps avec. Et là, c'est *Batman*, pas *Retour vers le futur* 🦇

Vous allez donc remplacer votre fonction `set_age` par une fonction `wait`, qui permet d'augmenter l'âge de votre objet.
Celle-ci prendra en paramètre le nombre d'années à attendre.
Testez que votre programme fonctionne correctement.

{{% hidden-solution %}}
Appel :
```cpp
p.wait(23);
```

Définition :
```cpp
void wait(unsigned int years) { _age += years; }
```
{{% /hidden-solution %}}

{{% notice note %}}
Définir et utiliser des setters n'est pas forcément une mauvaise pratique. Ce qui est mauvais, c'est de définir des setters pour tous les attributs d'une classe, sans prendre le temps de définir au préalable ses invariants (l'âge d'une personne ne peut pas décroître au cours de l'exécution).
{{% /notice %}}

---

### Synthèse

- Un **constructeur** est une fonction-membre sans type de retour et ayant pour identifiant le nom de la classe.
- La **liste d'initialisation** permet d'initialiser les attributs de la classe.
- Si un attribut est initialisé directement sur la ligne de sa définition, on parle de **class-initializer**.
- Si un constructeur n'a aucun paramètre, alors il s'agit du **constructeur par défaut** de la classe.
- Il est préférable d'initialiser les attributs via des **class-initializer** ou la **liste d'initialisation**, plutôt que de réassigner leur valeur après la construction.
- Si on ne définit aucun constructeur, le compilateur génère l'**implémentation par défaut** du constructeur par défaut.

{{% notice warning %}}
Attention à ne pas confondre **constructeur par défaut**, et **implémentation par défaut** fournie par le compilateur.  
Vous pouvez très bien implémenter vous-même un constructeur par défaut, et le compilateur peut fournir une implémentation par défaut pour d'autres fonctions que le constructeur. 
{{% /notice %}}
