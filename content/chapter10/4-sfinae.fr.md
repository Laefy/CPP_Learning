---
title: "SFINAE"
weight: 4
draft: true
---

Nous allons maintenant vous expliquer ce que signifie SFINAE, le besoin auquel ce mécanisme répond et comment le mettre en oeuvre dans votre code. 

---

### Le besoin

Supposons que nous voulious classe permettant d'afficher le contenu d'une variable sous forme de chaîne de caractères ainsi que sa catégorie parmi :
- entier,
- flottant,
- chaînes de caractères,
- conteneur.



 (`int`, `unsigned`, `double`, `float`, etc), une string ou une .





### La substitution

La substitution correspond à l'étape pendant laquelle le compilateur essaye de déterminer les paramètres d'une fonction-template à partir des arguments qui sont fournis à son appel :
```cpp

int main()
{

}
```

---

### SFINAE 

SFINAE signifie : "substitution failure is not an error".

Cela veut dire que si le compilateur n'arrive pas à substituer les paramètres de template à partir des arguments passés à une fonction, il ne va pas générer d'erreur de compilation.
Il va simplement tenter de trouver une autre fonction à appeler.



