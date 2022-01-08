---
title: "🧬 Clône"
weight: 4
---

Dans cet exercice, vous verrez comment implémenter un constructeur de copie et un opérateur d'assignation.\
Nous en profiterons aussi pour vous montrer comment surcharger l'opérateur `<<`.

---

Pour cet exercice, vous modifierez le fichier :\
\- `chap-02/3-clone.cpp`

La cible à compiler est `c2-3-clone`.

---

### Constructeur de copie

Dans la fonction `main`, instanciez à la suite du code existant une nouvelle instance de `Person` et initialisée là à partir de la variable `batman`. Cela se fait exactement de la même manière que si vous souhaitiez créer une copie d'une variable de type `int`.\
Affichez ensuite le contenu de cet objet, en copiant-collant l'instruction permettant d'afficher le contenu de `batman`.

{{% expand "Solution" %}}
```cpp
Person copy = batman;
std::cout << "Person named '" << copy.get_full_name() << "' is " << copy.get_age() << " years old." << std::endl;
```
{{% /expand %}}

Vous devriez obtenir le même résultat en sortie pour Batman et sa copie.

Nous aimerions maintenant avoir un clône plutôt qu'une copie. C'est-à-dire qu'au moment de l'instanciation du clône, ce serait bien qu'il vienne de naître, plutôt qu'il ait déjà 23 ans.

Pour ce faire, vous allez devoir redéfinir votre propre constructeur de copie. Je dis "redéfinir", car le compilateur (qui est gentil des fois) en a déjà défini un pour vous. Sans ça, l'instruction `Person clone = batman;` n'aurait pas pu compiler.

{{% notice note %}}
Le compilateur défini un constructeur de copie uniquement si vous n'en définissez pas un vous-même, et que chacun des attributs de votre classe est **copiable** (= disposant d'un constructeur de copie).\
Dans ce cas, l'**implémentation par défaut du constructeur de copie** appelera pour chacun des attributs de la classe son propre constructeur de copie.
{{% /notice %}}

Voici la syntaxe permettant de définir un constructeur de copie :
```cpp
class ClassName
{
public:
    ClassName(const ClassName& other)
        : _attribute_1 { /* probably other._attribute_1 */ }
        , _attribute_2 { /* probably other._attribute_2 */ }
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

Au final, il s'agit simplement d'un constructeur à 1 paramètre, ce paramètre étant une const-ref sur la classe courante.

Essayez de définir un constructeur de copie pour la classe `Person`, qui effectue la copie de l'ensemble des attributs de la classe.\
Vérifiez que vous obtenez le même résultat que précédemment.

{{% expand "Solution" %}}
```cpp
Person(const Person& other)
    : _name { other._name }
    , _surname { other._surname }
    , _age { other._age }
{}
```
{{% /expand %}}

Supprimez l'initialisation de l'attribut `_age` de la liste d'initialisation. De cette manière, le compilateur réalisera l'initialisation de `_age` à partir de son class-initializer (c'est-à-dire le `= 0u`).\
Testez le programme pour vous assurer que le clône a bien 0 an après son instanciation.

{{% expand "Solution" %}}
```cpp
class Person
{
public:
    ...

    Person(const Person& other)
        : _name { other._name }
        , _surname { other._surname }
    {}

    ...

private:
    ...
    unsigned int _age = 0u;
}
```
{{% /expand %}}

---

### Opérateur `<<`

Nous vous avons précédemment demandé de copier-coller l'instruction pour afficher le contenu de votre objet. Si vous l'avez fait, sachez que vous devriez avoir honte 😳

Afin de réaliser l'affichage en bonne-et-due forme de votre objet, vous allez implémenter une surcharge de l'opérateur `<<`.

**Qu'est-ce qu'un opérateur ?**\
C'est simplement une fonction avec un nom bizarre : `operator¤`, et pouvant être appelée en utilisant `¤` au lieu des parenthèses `()`.\
Supposons une classe `SomeClass`, avec un seul attribut `value` de type `int`. On peut alors définir un opérateur binaire `+` et l'utiliser de la manière suivante :
```cpp
// Definition
int operator+(const SomeClass& p1, const SomeClass& p2)
{
    return p1.value + p2.value;
}

// Call
SomeClass c1 { 3 };
SomeClass c2 { 6 };
int res = c1 + c2; // -> 9
``` 

**C'est quoi une surcharge ?**\
En C++, on peut définir des fonctions qui ont le même nom, du moment qu'elles ne prennent pas le même nombre de paramètres, ou bien que ces paramètres sont de types différents. Il s'agit du mécanisme de **surcharge** de fonctions.

L'opérateur `<<` a déjà été défini, puisque vous l'avez utilisé afin d'afficher des `string` et des `int` dans le flux `cout`.\
Votre objectif est de surcharger cet opérateur, de manière à pouvoir écrire :
```cpp
std::cout << batman << std::endl;
```

Votre surcharge acceptera deux paramètres, car `<<` est un opérateur binaire :\
\- le premier doit être du même type que `std::cout`. Recherchez dans la documentation de la librairie standard le type de cette variable.\
\- le second doit être du même type que `batman`, c'est-à-dire de type `Person`.\
Pour le type de retour, vous devez utiliser `std::ostream&`, car c'est ce qui vous permet de concaténer plusieurs `<<` dans la même instruction.

Sachant que vous utiliserez un passage par référence pour le premier argument et par const-ref pour le deuxième, quel sera la signature de votre surcharge ?
{{% expand "Solution" %}}
```cpp
std::ostream& operator<<(std::ostream& stream, const Person& person)
```
{{% /expand %}}

Définissez le code de cette fonction entre la classe `Person` et la fonction `main`. Vous pouvez utiliser le premier argument comme valeur de retour. 

{{% expand "Solution" %}}
```cpp
std::ostream& operator<<(std::ostream& stream, const Person& person)
{
    return stream << "Person named '" << person.get_full_name() << "' is " << person.get_age() << " years old.";
}
```

{{% notice note %}}
Afin de pouvoir être utilisé en série, l'opérateur `<<` est toujours supposé retourner son premier paramètre. Le résultat de `(stream << ... << ... )` devrait donc être `stream`. Il est donc possible (mais pas nécessaire) d'écrire `return stream << ... << ...;` directement, au lieu de faire le `return stream;` sur une ligne séparée.
{{% /notice %}}

{{% /expand %}}

Modifiez la fonction `main` afin qu'elle utilise l'opérateur `<<` que vous venez de définir et testez que le programme fonctionne comme avant.

{{% expand "Solution" %}}
```cpp
Person batman { "Bruce", "Wayne" };
batman.wait(23);
std::cout << batman << std::endl;

Person clone = batman;
std::cout << clone << std::endl;
```
{{% /expand %}}

---

### Opérateur d'assignation

Lorsqu'on rédéfinit le constructeur de copie, il est souvent nécessaire de redéfinir également l'opérateur d'assignation.\
"Redéfinir", car ici encore, le compilateur fournit une implémentation par défaut de cette fonction.

Ajoutez le code suivant à votre `main`:
```cpp
Person assigned_clone { "Batman", "2" };
std::cout << assigned_clone << std::endl;

assigned_clone = batman;
std::cout << assigned_clone << std::endl;
```

Si vous essayez de compiler, vous devriez constater que ça ne fonctionne pas...\
Rappelez-vous, nous avions modifié les variables membres `_name` et `_surname` afin d'indiquer qu'elles étaient constantes.\
Puisque l'on veut maintenant avoir la possibilité de réassigner le contenu d'une personne, il faut commencer par retirer les const sur ses variables membre.

{{% notice tip %}}
Vous vous dites peut-être que ce n'est pas très gentil de vous faire ajouter des const pour les retirer ensuite.\
En réalité, il est préférable de toujours réadapté le code au besoin que nous avons à un instant T, c'est-à-dire ne pas trop anticipé.\
C'est seulement au moment où le besoin évolue (ici, on décide que l'on veut maintenant pouvoir réassigner une personne) que l'on doit mettre à jour le code et si besoin modifier les invariants (désormais, le nom et le prénom d'une personne peuvent changer au cours de l'exécution du programme).  
{{% /notice %}}

Recompilez et lancez le programme. Vous devriez constater que l'âge de `assigned_clone` est de 23 ans.

Pour être cohérent avec ce que nous avons fait précédemment, nous allons dire que l'âge d'une instance de `Person` n'est pas modifiée au moment de sa réassignation.\
Seul son nom change. 
Puisque l'**implémentation par défaut de l'opérateur d'assignation** modifie l'âge de notre instance, nous allons le redéfinir.

Voici le code permettant de redéfinir l'opérateur d'assignation d'une classe :
```cpp
ClassName& operator=(const ClassName& other)
{
    if (this != &other)
    {
        _attribute_1 = /* probably other._attribute_1; */
        _attribute_2 = /* probably other._attribute_2; */
        ...
    }

    return *this;
}
```

**Qui est `this` ?**\
Comme en Java, `this` fait référence à l'instance courante de la classe. Attention cependant, en C++, `this` est un pointeur. C'est d'ailleurs pour cela qu'on renvoie `*this` et non `this`.

**Pourquoi la comparaison entre `this` et `&other` ?**\
Il est très important de réaliser cette comparaison, en particulier dans le cas ou l'un des attributs de la classe est un objet alloué dynamiquement.\
En effet, pour réaliser la copie de `other._attr`, vous allez devoir allouer de la mémoire supplémentaire et stocker son pointeur dans `this->_attr`. Sauf que si `this` et `other` font référence au même objet, en modifiant `this->_attr`, vous allez également écraser `other._attr` et donc perdre l'adresse du bloc alloué dans `other._attr`.\
C'est comme ça qu'on se retrouve avec des fuites de mémoire et un PC qui rame.

Implémentez l'opérateur d'assignation de manière à ne copier que les attributs `_name` et `_surname`. Testez que le programme fonctionne comme prévu.

{{% expand "Solution" %}}
```cpp
Person& operator=(const Person& other)
{
    if (this != &other)
    {
        _name = other._name;
        _surname = other._surname;
    }

    return *this;
}
```
{{% /expand %}}