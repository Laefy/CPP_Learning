---
title: "Questionnaire ☑"
weight: 100
---

{{% test chapter=2 %}}

{{% test_item %}}
Quel est le terme C++ permettant de désigner les "méthodes" d'une classe ?
{{% /test_item %}}

{{% test_item %}}
Supposons une classe `Cercle` disposant d'un attribut `_points` de type `std::vector<point>`. Quel invariant cette classe pourrait-elle décider d'enforcer ?
{{% /test_item %}}

{{% test_item %}}
Citez une règle permettant de respecter le principe d'encapsulation en C++.
{{% /test_item %}}

---

{{% test_item %}}
En quoi consiste la méthodologie TDD ?
{{% /test_item %}}

{{% test_item %}}
Donnez un avantage de cette pratique.
{{% /test_item %}}

---

{{% test_item %}}
Quel est le nom de la fonctionnalité permettant d'initialiser un attribut sur la même ligne que sa définition ?
{{% /test_item %}}

{{% test_item %}}
Quel nom donne-t-on au constructeur d'une classe acceptant 0 paramètre ?
{{% /test_item %}}

{{% test_item %}}
Dans un constructeur, comment s'appelle la zone dans laquelle on initialise les attributs de la classe ?
{{% /test_item %}}

{{% test_item %}}
A quoi fait-on généralement référence lorsque l'on parle d'implémentation par défaut ?
{{% /test_item %}}

---

{{% test_item %}}
Supposons une fonction-membre `bool hello() const` définie dans une classe `Greetings`.  
Que faut-il faire pour l'implémenter dans un .cpp séparé ?
{{% /test_item %}}

{{% test_item %}}
Soit un attribut statique déclaré par `static float _attr` dans une classe `UneClasse`.  
Comment faut-il faire pour le définir ?
{{% /test_item %}}

{{% test_item %}}
La ligne `static int Toto::fcn_static() { return 1; }` placée dans un fichier `Toto.cpp` ne compile pas.
Pourtant, `fcn_static` a été déclarée comme il faut dans la classe `Toto` et l'include a été fait.  
Quel est le problème ?
{{% /test_item %}}

---

{{% test_item %}}
Donnez la signature de l'opérateur `<<` permettant d'afficher le contenu une variable de type `Cat` dans un flux de sortie.
{{% /test_item %}}

{{% test_item %}}
Quelle instruction permet de définir un alias `SmallerName` sur le type suivant : `std::unique_ptr<std::array<std::string, 3>>` 
{{% /test_item %}}

---

Les deux prochaines questions font référence à cette classe :
```cpp
class Toto
{
public:
    Toto() : Toto(3), _value2(5)
    {}

    Toto(int v1) : _value1(v1)
    {}

private:
    int _value1;
    int _value2;
}
```

{{% test_item %}}
Ce code ne compile pas pour deux raisons. Quelles sont-elles ?
{{% /test_item %}}

{{% test_item %}}
Essayez d'identifier un autre problème lié au constructeur à 1 paramètre.  
Il ne s'agit pas d'un problème de compilation.
{{% /test_item %}}

{{% /test %}}

<!-- 
A partir du code ci-dessous, indiquez si les instructions (que l'on suppose en dehors de la classe) compilent ou non.  
Si ce n'est pas le cas, précisez la raison.
```cpp
class Dog
{
public:
    Dog();
    Dog(int v1, int v2);

    void set(int v);
    int get() const;

    static int _nb;
    static void call(const Dog& d);

private:
    void move();

    static void speak();
    friend void print(std::ostream& stream, const Dog& dog);
};
```

{{% test_item %}}
`Dog d; auto v = d.get();`
{{% /test_item %}}

{{% test_item %}}
`Dog d; print(std::cout, d);`
{{% /test_item %}}

{{% test_item %}}
`Dog::speak();`
{{% /test_item %}}

{{% test_item %}}
`auto a = Dog::get();`
{{% /test_item %}}

{{% test_item %}}
`Dog d1; Dog d2 = d1;`
{{% /test_item %}}

{{% test_item %}}
`const Dog d; d.set(8);`
{{% /test_item %}}

{{% test_item %}}
`Dog d; d.move();`
{{% /test_item %}}

{{% test_item %}}
`std::cout << Dog::_nb << std::endl;`
{{% /test_item %}}

{{% test_item %}}
`Dog d();`
{{% /test_item %}}

{{% test_item %}}
`Dog d; Dog::call(d);`
{{% /test_item %}}

{{% test_item %}}
`Dog d { -1, 3 };`
{{% /test_item %}} -->
