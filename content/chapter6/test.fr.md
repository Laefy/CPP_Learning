---
title: "Questionnaire ☑"
weight: 100
---

C'est l'heure du test ! N'oubliez pas que vous pouvez utiliser [Godbolt](https://www.godbolt.org/z/ofohb4) pour compiler et tester des petits bouts de code.  
Bon courage à vous 🙂

---

{{% test chapter=6 %}}

{{% test_item %}}
Quel type de boucle faut-il utiliser pour modifier la structure d'un conteneur lors d'un parcours ?
{{% /test_item %}}

{{% test_item %}}
Dans quel cas peut-il être intéressant d'utiliser la fonction `std::for_each` ?
{{% /test_item %}}

---

{{% test_item %}}
Quels headers contiennent les algorithmes de la STL ?
{{% /test_item %}}

{{% test_item %}}
Donnez un exemple d'utilisation de `std::find_if`. Vous pouvez considérer que les variables dont vous auriez besoin ont déjà été définies plus haut (ça s'applique aux prochaines questions aussi).
{{% /test_item %}}

{{% test_item %}}
Qu'est-ce qu'un prédicat ?
{{% /test_item %}}

{{% test_item %}}
Quelle fonction permet de savoir si l'ensemble des éléments d'un conteneur vérifie un prédicat ?
{{% /test_item %}}

{{% test_item %}}
Donnez un exemple d'utilisation de cette fonction sur un `std::vector`.
{{% /test_item %}}

{{% test_item %}}
Quelle fonction permet de récupérer le minimum et le maximum d'une plage d'éléments en une seule passe ?
{{% /test_item %}}

---

{{% test_item lines="3" %}}
Ecrivez les instructions permettant de retirer tous les noms commençant par un 'A' d'un `vector<string>`.
{{% /test_item %}}

{{% test_item %}}
A quoi sert `std::back_inserter` ?
{{% /test_item %}}

{{% test_item lines="2" %}}
Soit une `list<string>`. Ecrivez les instructions permettant de créer un tableau contenant le nombre de caractères de chaque élément de cette liste.
{{% /test_item %}}

{{% test_item lines="2" %}}
Qu'est-ce qu'une réduction ? Quelles fonctions permettent d'effectuer ce genre d'opération ?
{{% /test_item %}}

---

{{% test_item %}}
Quelle catégorie d'itérateur permet d'accéder à n'importe quel élément d'une plage en temps constant ?
{{% /test_item %}}

{{% test_item lines="2" %}}
En supposant que vous avez un itérateur permettant d'itérer sur une plage de `Donkey`, quelles peuvent-être les signatures de ses opérateurs de déréférencement ?
{{% /test_item %}}

{{% test_item %}}
Comment appelle-t-on l'opérateur ayant la signature suivante : `It operator++(int)` ?
{{% /test_item %}}

---

{{% test_item %}}
A quoi sert la capture dans une lambda ?
{{% /test_item %}}

{{% test_item %}}
Quelle classe de la librairie standard permet de stocker des lambdas ?
{{% /test_item %}}

{{% test_item %}}
Comment savoir si une variable est capturée par référence ou par valeur ?
{{% /test_item %}}

{{% test_item %}}
Comment faut-il faire pour capturer les attributs d'une classe ?
{{% /test_item %}}

{{% test_item %}}
Que faut-il faire pour pouvoir modifier un objet capturé par valeur ?
{{% /test_item %}}

{{% test_item %}}
Pourquoi doit-on souvent utiliser `auto` pour définir des variables contenant des lambdas ?
{{% /test_item %}}

{{% test_item %}}
Soit une lambda nommée `is_finished`, capturant un entier par référence, prenant en paramètre une `string_view` et un 
`float`, et retournant un `bool`. Donnez une instruction permettant d'exécuter cette lambda.
{{% /test_item %}}

{{% /test %}}