---
title: "Questionnaire ☑"
weight: 100
---

Félicitations !! Vous avez enfin terminé le Chapitre 1 ! 🥳🎉

Le questionnaire ci-dessous vous aidera à savoir si vous avez bien compris le cours ou non.  
Il n'a donc pas vocation à vous évaluer, mais à vous donnez une idée de ce que vous auriez lu trop vite ou n'auriez pas assez pratiqué.

Dans tous les cas, si vous répondez à ce questionnaire et cliquez sur le bouton `Valider`, vos réponses nous seront envoyées par mail et nous vous ferons un petit retour sur ce que vous avez réussi ou non 😉

---

{{% test chapter=1 %}}

### Général

{{% test_item %}}
Citez trois éléments qui participent à la popularité du C++.
{{% /test_item %}}

{{% test_item %}}
Donnez un inconvénient des langages compilés.
{{% /test_item %}}

{{% test_item %}}
Le C++ est-il un langage orienté-objet ?
{{% /test_item %}}

{{% test_item %}}
Quel outil en ligne vous permet de compiler et tester des petits bouts de code C++ ?
{{% /test_item %}}

---

### Types et valeurs

Les prochaines questions font référence aux instructions suivantes : 
```cpp
bool              a;
std::string       b;
std::vector<char> c;
auto              d = 4;
auto&             e = b;
```

{{% test_item %}}
Quelle est la valeur de `a` ?
{{% /test_item %}}

{{% test_item %}}
Quelle est la valeur de `b` ?
{{% /test_item %}}

{{% test_item %}}
Ecrivez l'instruction permettant d'ajouter la lettre 'A' dans le tableau `c`.
{{% /test_item %}}

{{% test_item %}}
Quel est le type de `d` ?
{{% /test_item %}}

{{% test_item %}}
Si on modifie la valeur de `e`, la valeur de `b` est-elle modifiée ?
{{% /test_item %}}

---

### Librarie standard

{{% test_item lines=3 %}}
On suppose que vous avez une variable `array` de type `std::vector<int>`.  
Ecrivez une boucle "foreach" qui parcourt le tableau et affiche son contenu dans la console.
{{% /test_item %}}

{{% test_item %}}
Déclarez une variable de type `std::stringstream`.
Ajoutez dans le flux les valeurs `3`, `"petits"` et `true`, puis affichez son contenu dans la sortie standard.
{{% /test_item %}}

{{% test_item lines=2 %}}
Ecrivez les instructions permettant de stocker dans une chaîne de caractères le prochain mot de l'entrée standard.
{{% /test_item %}}

{{% test_item %}}
Quel est le nom de la variable de flux dédiée à l'écriture des erreurs ?
{{% /test_item %}}

---

### Compilation

{{% test_item %}}
Comment évite-t-on les inclusions multiples ?
{{% /test_item %}}

{{% test_item %}}
A quoi sert le mot-clef `inline` ?
{{% /test_item %}}

{{% test_item lines=3 %}}
Lorsque le compilateur voit la déclaration d'une fonction, que fait-il ?  
Et lorsqu'il voit la définition d'une fonction ?
{{% /test_item %}}

{{% test_item %}}
Ecrivez la forward-declaration d'une `class` nommée `Toto`.
{{% /test_item %}}

{{% test_item lines=3 %}}
Que signifie l'erreur : `"fcn(char)" has not been declared` ?  
Décrivez une situation dans laquelle elle pourrait se produire.
{{% /test_item %}}

{{% test_item lines=3 %}}
Que signifie l'erreur : `multiple definition of "fcn(int, int)"` ?  
Décrivez une situation dans laquelle elle pourrait se produire.
{{% /test_item %}}

{{% test_item lines=2 %}}
Quelle est la condition pour que deux fonctions avec le même nom soient présentes dans le même programme ?
{{% /test_item %}}

{{% /test %}}
