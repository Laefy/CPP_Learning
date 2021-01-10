---
title: "Questionnaire !"
weight: 100
---

Vous pensiez que le Chapitre 2 serait plus léger que le Chapitre 1 ? Désolée de vous avoir déçus 😅\
Mais bon, vous l'avez enfin terminé, donc vous pouvez être fiers de vous ! 😀

---

Avant de nous quitter pour aller savourer ce moment, vous devriez profiter que le chapitre soit bien frais dans votre tête pour répondre au questionnaire ci-dessous. Nous vous rappelons que si vous êtes en M1 à l'UGE, il participera à votre notation.

Rappel du barème :
- si vous répondez plutôt bien aux questions : 3/3
- si vous répondez passablement bien aux questions : 2/3
- si vous ne répondez pas du tout bien aux questions : 1/2
- si vous ne répondez pas aux questions du tout : 0/3

L'objectif de ce questionnaire étant de s'assurer que vous avez pris le temps de comprendre le cours et de faire les exercices, vous pouvez avoir la note maximale même si vous n'avez pas toutes les bonnes réponses. C'est donc un moyen facile de remonter sa moyenne 🙂

Une fois que vous avez terminé, cliquez sur le bouton `Validez` pour que le résultat nous soit envoyé par mail. Bon courage à vous !

---

{{% test url="https://formspree.io/f/xzbkyawz" %}}
{{% test_item id=1 %}}Quel est le terme C++ permettant de désigner les "méthodes" d'une classe ?{{% /test_item %}}
{{% test_item id=2 %}}Supposons une classe `Cercle` disposant d'un attribut `_points` de type `std::vector<point>`. Quel invariant cette classe pourrait-elle décider d'enforcer ?{{% /test_item %}}
{{% test_item id=3 %}}Citez une règle permettant de respecter le principe d'encapsulation en C++.{{% /test_item %}}
---
{{% test_item id=4 %}}En quoi consiste la méthodologie TDD ?{{% /test_item %}}
{{% test_item id=5 %}}Donnez un avantage de cette pratique.{{% /test_item %}}
---
{{% test_item id=6 %}}Quel est le nom de la fonctionnalité permettant d'initialiser un attribut sur la même ligne que sa définition ?{{% /test_item %}}
{{% test_item id=7 %}}Dans un constructeur, comment s'appelle la zone dans laquelle on initialise les attributs de la classe ?{{% /test_item %}}
{{% test_item id=8 %}}A quoi fait-on généralement référence lorsque l'on parle d'implémentation par défaut ?{{% /test_item %}}
{{% test_item id=9 %}}Quand est-ce qu'une référence devient une dangling reference ?{{% /test_item %}}
{{% test_item id=10 %}}Dans l'implémentation d'une fonction-membre, quel mot-clef permet de faire référence à l'instance courante ?{{% /test_item %}}
{{% test_item id=11 %}}Quelles sont les 4 fonctions vues dans ce chapitre que le compilateur peut générer automatiquement ?{{% /test_item %}}
---
{{% test_item id=12 %}}A quoi sert `#pragma once` ?{{% /test_item %}}
{{% test_item id=13 %}}Supposons une fonction-membre `bool hello() const` définie dans une classe `Greetings`. Que faut-il faire pour l'implémenter dans un .cpp séparé ?{{% /test_item %}}
{{% test_item id=14 %}}Soit un attribut statique déclaré par `static float _attr` dans une classe `UneClasse`. Comment faut-il faire pour le définir ?{{% /test_item %}}
{{% test_item id=15 %}}La ligne `static int Toto::fcn_static() { return 1; }` placée dans un fichier `Toto.cpp` ne compile. Pourtant, `fcn_static` a été déclarée comme il faut dans la classe `Toto` et l'include a été fait. Quel est le problème ?{{% /test_item %}}
---
{{% test_item id=16 %}}Donnez la signature de l'opérateur `<<` permettant d'afficher le contenu une variable de type `Cat` dans un flux de sortie.{{% /test_item %}}
{{% test_item id=17 %}}Quelle instruction permet de définir un alias `SmallerName` sur le type suivant : `std::unique_ptr<std::array<std::string, 3>>` ?{{% /test_item %}}
---
{{% test_item id=18 %}}Comment désigne-t-on le constructeur d'une classe acceptant 0 paramètre ?{{% /test_item %}}
{{% test_item id=19 %}}Afin de construire un objet à partir d'un autre de même type, quel est le nom du constructeur à appeler ?{{% /test_item %}}
{{% test_item id=20 %}}Donnez la signature de l'opérateur d'assignation d'une class `Mouse`.{{% /test_item %}}
{{% test_item id=21 %}}Donnez la signature du destructeur d'une classe `Dying`.{{% /test_item %}}
---
A partir du code ci-dessous, indiquez si les instructions (que l'on suppose hors de la classe) compilent ou non. Si c'est le cas, décrivez leur effet.
```cpp
class Dog
{
public:
    Dog();
    Dog(const std::string& str);
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

{{% test_item id=22 %}}`Dog d; auto v = d.get();`{{% /test_item %}}
{{% test_item id=23 %}}`Dog d; print(std::cout, d);`{{% /test_item %}}
{{% test_item id=24 %}}`Dog::speak();`{{% /test_item %}}
{{% test_item id=25 %}}`Dog d = "chien";`{{% /test_item %}}
{{% test_item id=26 %}}`const Dog d; d.set(8);`{{% /test_item %}}
{{% test_item id=27 %}}`Dog d; d.move();`{{% /test_item %}}
{{% test_item id=28 %}}`Dog d; std::cout << d._nb << std::endl;`{{% /test_item %}}
{{% test_item id=29 %}}`Dog d();`{{% /test_item %}}
{{% test_item id=30 %}}`Dog d; Dog::call(d);`{{% /test_item %}}
{{% test_item id=31 %}}`Dog d { -1, 3 };`{{% /test_item %}}
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
{{% test_item id=32 %}}Ce code ne compile pas pour deux raisons. Quelles sont-elles ?{{% /test_item %}}
{{% test_item id=33 %}}Que pouvez-vous faire pour que le constructeur à 1 paramètre soit déterministe ?{{% /test_item %}}

{{% /test %}}