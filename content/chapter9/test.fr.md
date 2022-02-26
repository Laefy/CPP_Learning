---
title: "Questionnaire !"
weight: 100
---

C'est l'heure du test ! N'oubliez pas que vous pouvez utiliser [Godbolt](https://www.godbolt.org/z/ofohb4) pour compiler et tester des petits bouts de code.\
Bon courage à vous 🙂

---

{{% test chapter=9 %}}

{{% test_item id=1 lines="1" desc="template" %}}Que faut-il écrire juste avant la définition d'une classe (ou fonction) pour en faire une classe (ou fonction) templatée ?{{% /test_item %}}
{{% test_item id=2 lines="1" desc="why-header" %}}Pourquoi n'est-il pas toujours possible de placer l'implémentation des fonctions-membres d'une classe-template dans un .cpp distinct ?{{% /test_item %}}
{{% test_item id=3 lines="2" desc="constexpr" %}}Que signifie le mot-clef `constexpr` ? A quoi sert-il ?{{% /test_item %}}

---

{{% test_item id=4 lines="1" desc="tmpl-params" %}}En sachant que l'on peut instancier `AlphaRange` avec `AlphaRange<char, 'A', 'C'>`, quels peuvent-être les types de chacun des paramètres de template de `AlphaRange` ?{{% /test_item %}}
{{% test_item id=5 lines="1" desc="fcn-from-tmpl-inst" %}}`std::min` est une fonction-template. Quelle est la signature de la fonction générée lors de l'appel à `std::min(4u, 9u)` ?{{% /test_item %}}
{{% test_item id=6 lines="1" desc="bad-deduction" %}}Expliquez pourquoi l'instruction `std::max(3, 4.3f)` ne compile pas, en précisant le nom de la phase de compilation qui pose problème. Que pouvez-vous modifier dans cet appel pour régler le problème ?{{% /test_item %}}

---

{{% test_item id=7 lines="4" desc="square" %}}Ecrivez une fonction-template qui retourne le carré d'une valeur, peu importe son type.{{% /test_item %}}
{{% test_item id=8 lines="10" desc="point" %}}Définissez une structure-template `Point`, contenant deux attributs `x` et `y` de même type. Vous ajouterez deux fonctions permettant de réaliser des additions et des soustractions de `Point` avec `+` et `-`.{{% /test_item %}}

{{% /test %}}
