---
title: "Questionnaire !"
weight: 100
---

Le premier objectif de ce chapitre était de vous présenter quelques classes de la STL, leurs rôles, leurs différences, dans quelles situations les utiliser et comment.\
Il avait également un deuxième objectif, qui était en quelque sorte de vous apprendre à vous débrouiller tout seul : vous devriez désormais être capable de rechercher par vous-même des informations dans la documentation, et vous devriez aussi appréhender un peu mieux qu'avant les messages du compilateur.

J'espère donc que ce chapitre a rempli ses objectifs et que vous vous sentez maintenant plus à l'aise pour programmer !​ 😀​

---

{{% test chapter=3 %}}
{{% test_item id=1 desc="3-infos-in-doc-header" %}}Citez 3 informations que vous pouvez retrouver dans l'en-tête de la documentation d'une classe.{{% /test_item %}}
{{% test_item id=2 desc="default-template-param" %}}Comment savoir s'il est nécessaire ou non de fournir un paramètre de template à une classe ?{{% /test_item %}}
{{% test_item id=3 desc="3-banned-vector-fcns-foreach" %}}Citez 3 fonctions de `vector` qu'il ne faut pas appeler à l'intérieur d'une boucle foreach.{{% /test_item %}}
{{% test_item id=4 desc="when-()-{}-diff" %}}Dans quel cas l'instanciation d'une classe via `(p1, p2, p3)` n'a pas le même comportement que l'instanciation via `{ p1, p2, p3 }` ?{{% /test_item %}}
{{% test_item id=5 desc="section-usage" %}}Quel section de la documentation faut-il regarder pour savoir rapidement comment utiliser une fonction ?{{% /test_item %}}
---
{{% test_item id=6 desc="function-array-access" %}}Quelle est la fonction définie par `vector` qui permet d'accéder à un élément avec l'expression `values[idx]` ?{{% /test_item %}}
{{% test_item id=7 desc="functions-foreach" %}}Quelles fonctions faut-il définir dans un conteneur pour pouvoir le parcourir au moyen d'une boucle foreach ?{{% /test_item %}}
{{% test_item id=8 desc="set-key-constraint" %}}Pour pouvoir utiliser un `std::set<Key>`, quelle contrainte la classe `Key` doit-elle respecter ?{{% /test_item %}}
{{% test_item id=9 desc="set-key-constraint-sign" %}}Afin de respecter cette contrainte, quelle est la signature de la fonction à définir ?{{% /test_item %}}
{{% test_item id=10 desc="queue-inner-ctn-fcns" lines=3 %}}Quelles fonctions doivent être définies dans `MyOwnContainer` pour utiliser un objet de type `std::queue<float, MyOwnContainer>` ? Indiquez leurs signatures.{{% /test_item %}}
---
{{% test_item id=11 desc="nb-elem" %}}Quelle fonction permet de connaître le nombre d'éléments d'un conteneur ?{{% /test_item %}}
{{% test_item id=12 desc="empty-container" %}}Quelle fonction permet de savoir si un conteneur est vide ?{{% /test_item %}}
{{% test_item id=13 desc="first-element" %}}Quelle fonction permet de récupérer le premier élément d'un conteneur séquentiel ?{{% /test_item %}}
{{% test_item id=14 desc="insert-dict" %}}Citez deux fonctions permettant d'ajouter des éléments dans un dictionnaire.{{% /test_item %}}
{{% test_item id=15 desc="suppress" %}}Quelle fonction permet de supprimer des éléments d'un conteneur séquentiel ?{{% /test_item %}}
{{% test_item id=16 desc="remove-all" %}}Quelle fonction permet de vider entièrement un conteneur ?{{% /test_item %}}
---
{{% test_item id=17 desc="fixed-size-array" %}}Quelle classe permet de définir un tableau de taille fixe ?{{% /test_item %}}
{{% test_item id=18 desc="a-b-c-in-array" %}}Définissez une variable de ce type, contenant les valeurs `'a'`, `'b'` et `'c'`.{{% /test_item %}}
{{% test_item id=19 desc="pass-string" %}}Quelle classe permet de passer une chaîne littérale à une fonction sans faire d'allocation dynamique et sans passer de pointeur ?{{% /test_item %}}
{{% test_item id=20 desc="unique-values-ctn" %}}Quelles classes faut-il utiliser pour représenter un ensemble de valeurs uniques ? Indiquez la complexité en temps des opérations d'insertions pour chacune d'entre elles.{{% /test_item %}}
{{% test_item id=21 desc="ret-multi-values" %}}Quelle classe permet de retourner plusieurs valeurs d'une fonction facilement ?{{% /test_item %}}
---
{{% test_item id=22 desc="first-it" %}}Comment récupérer l'itérateur de début d'un conteneur dans une variable `it` ?{{% /test_item %}}
{{% test_item id=23 desc="inc-5" %}}Comment incrémenter de 5 positions cet itérateur ?{{% /test_item %}}
{{% test_item id=24 desc="val-it" %}}Comment récupérer la valeur pointé par cette itérateur dans une variable `value` ?{{% /test_item %}}

{{% /test %}}