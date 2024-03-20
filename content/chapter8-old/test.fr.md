---
title: "Questionnaire !"
weight: 100
---

C'est l'heure du test ! N'oubliez pas que vous pouvez utiliser [Godbolt](https://www.godbolt.org/z/ofohb4) pour compiler et tester des petits bouts de code.\
Bon courage à vous 🙂

---

{{% test chapter=8 %}}

{{% test_item id=1 lines="1" desc="assertion" %}}A quoi sert une assertion ?{{% /test_item %}}
{{% test_item id=2 lines="1" desc="why-no-assert-misuse" %}}Pourquoi ne faut-il pas utiliser d'assertions pour traiter une erreur d'utilisation d'un logiciel ?{{% /test_item %}}
{{% test_item id=3 lines="1" desc="assert-for-not-empty-str" %}}Ecrivez une assertion permettant de s'assurer qu'une variable `name` de type `std::string` n'est pas vide.{{% /test_item %}}

---

{{% test_item id=4 lines="1" desc="header-except-impl" %}}Dans quel header de la STL trouve-t-on les implémentations de `std::exception` ?{{% /test_item %}}
{{% test_item id=5 lines="1" desc="except-for-out-range" %}}Dans la STL, quel type d'exception pouvez-vous utiliser pour indiquer qu'une valeur n'appartient pas à la plage attendue ?{{% /test_item %}}
{{% test_item id=6 lines="1" desc="never-throw-there" %}}Où ne doit-on jamais lancer d'exceptions ?{{% /test_item %}}

---

{{% test_item id=7 lines="3" desc="throw" %}}On suppose que vous êtes dans une fonction `factorial` permettant de calculer la factorielle d'un `int` passé en paramètre. Ecrivez les instructions permettant de vérifier que cet entier n'est pas négatif, et de lancer une exception si c'est le cas.{{% /test_item %}}
{{% test_item id=8 lines="5" desc="try-catch" %}}Ecrivez maintenant le code permettant d'appeler `factorial` : si tout se passe bien, le résultat de la fonction est affiché dans `std::cout`, sinon, le message d'erreur de l'exception est affiché dans `std::cerr`.{{% /test_item %}}

---

{{% /test %}}
