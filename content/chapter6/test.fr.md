---
title: "Questionnaire !"
weight: 100
---

C'est l'heure du test ! N'oubliez pas que vous pouvez utiliser [Godbolt](https://www.godbolt.org/z/ofohb4) pour compiler et tester des petits bouts de code.\
Bon courage à vous 🙂

---

{{% test chapter=6 %}}

{{% test_item id=1 lines="1" desc="structural-loop" %}}Quel type de boucle faut-il utiliser pour modifier la structure d'un conteneur lors d'un parcours ?{{% /test_item %}}
{{% test_item id=2 lines="1" desc="use-case-for-each" %}}Dans quel cas peut-il être intéressant d'utiliser la fonction `std::for_each` ?{{% /test_item %}}

---

{{% test_item id=3 lines="1" desc="headers-algo" %}}Quels headers contiennent les algorithmes de la STL ?{{% /test_item %}}
{{% test_item id=4 lines="2" desc="ex-find-if" %}}Donnez un exemple d'utilisation de `std::find_if`. Vous pouvez considérer que les variables dont vous auriez besoin ont déjà été définies plus haut (ça s'applique aux prochaines questions aussi).{{% /test_item %}}
{{% test_item id=5 lines="1" desc="predicate" %}}Qu'est-ce qu'un prédicat ?{{% /test_item %}}
{{% test_item id=6 lines="1" desc="everything-checks" %}}Quelle fonction permet de savoir si l'ensemble des éléments d'un conteneur vérifie un prédicat ?{{% /test_item %}}
{{% test_item id=7 lines="2" desc="ex-on-map" %}}Donnez un exemple d'utilisation de cette fonction sur un `std::vector`.{{% /test_item %}}
{{% test_item id=8 lines="1" desc="min-and-max-ctn" %}}Quelle fonction permet de récupérer le minimum et le maximum d'une plage d'éléments en une seule passe ?{{% /test_item %}}

---

{{% test_item id=9 lines="3" desc="ex-rm-A" %}}Ecrivez les instructions permettant de retirer tous les noms commençant par un 'A' d'un `vector<string>`.{{% /test_item %}}
{{% test_item id=10 lines="1" desc="back_inserter" %}}A quoi sert `std::back_inserter` ?{{% /test_item %}}
{{% test_item id=11 lines="2" desc="nb-char-from-str" %}}Soit une `list<string>`. Ecrivez les instructions permettant de créer un tableau contenant le nombre de caractères de chaque élément de cette liste.{{% /test_item %}}
{{% test_item id=12 lines="2" desc="reduc" %}}Qu'est-ce qu'une réduction ? Quelles fonctions permettent d'effectuer ce genre d'opération ?{{% /test_item %}}

---

{{% test_item id=13 lines="1" desc="constant-access-it" %}}Quelle catégorie d'itérateur permet d'accéder à n'importe quel élément d'une plage en temps constant ?{{% /test_item %}}
{{% test_item id=14 lines="2" desc="deref-sign" %}}En supposant que vous avez un itérateur permettant d'itérer sur une plage de `Donkey`, quelles peuvent-être les signatures de ses opérateurs de déréférencement ?{{% /test_item %}}
{{% test_item id=15 lines="1" desc="name-++-int" %}}Comment appelle-t-on l'opérateur ayant la signature suivante : `It operator++(int)` ?{{% /test_item %}}

---

{{% test_item id=16 lines="1" desc="capture-purpose" %}}A quoi sert la capture dans une lambda ?{{% /test_item %}}
{{% test_item id=17 lines="1" desc="obj-store-lambda" %}}Quelle classe de la librairie standard permet de stocker des lambdas ?{{% /test_item %}}
{{% test_item id=18 lines="1" desc="diff-capt-ref-value" %}}Comment savoir si une variable est capturée par référence ou par valeur ?{{% /test_item %}}
{{% test_item id=19 lines="1" desc="capt-attr" %}}Comment faut-il faire pour capturer les attributs d'une classe ?{{% /test_item %}}
{{% test_item id=20 lines="1" desc="chg-value-capt" %}}Que faut-il faire pour pouvoir modifier un objet capturé par valeur ?{{% /test_item %}}
{{% test_item id=21 lines="1" desc="why-auto" %}}Pourquoi doit-on souvent utiliser `auto` pour définir des variables contenant des lambdas ?{{% /test_item %}}
{{% test_item id=22 lines="1" desc="ex-lambda" %}}Soit une lambda nommée `is_finished`, capturant un entier par référence, prenant en paramètre une `string_view` et un `float`, et retournant un `bool`. Donnez une instruction permettant d'exécuter cette lambda.{{% /test_item %}}

---

{{% /test %}}