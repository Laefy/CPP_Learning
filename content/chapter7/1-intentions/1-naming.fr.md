---
title: "Nommage"
weight: 1
---

Le nommage est le premier levier qui vous permettra de rendre votre code clair.

---

### Choisir des noms clairs

La première règle à suivre est de choisir des noms clairs et explicites pour définir vos symboles.
Typiquement, évitez les variables nommées d'une seule lettre (`a`, `b`, ...), les abbréviations (`tmp`, `res`, ...) ou encore les accronymes (`am` pour dire `aircraft_manager).

Bien sûr, vous pouvez tout de même utiliser des noms à une seule lettre lorsque la signification est claire (`i` ou `it` pour les itérateurs, `x`, `y`, `z` pour les coordonnées d'un point, etc).

Enfin, trouvez des noms clairs ne s'applique pas qu'aux noms de variables.
C'est aussi important pour les noms de classes, les noms de fonctions, les valeurs d'enumération, et ainsi de suite.

---

### Nommer les litéraux

Les **litéraux** correspondent aux valeurs que vous pouvez assigner aux primitives : `0`, `1.f`, `true`, `false`, etc.

Lorsque vous passez des litéraux à une fonction, il est parfois difficile du côté de l'appelant de comprendre à quoi la valeur va servir.
```cpp
point.set_x(3.f);               // ok, 3.f correspond à la nouvelle valeur de x.
controller.update(false, 5.1);  // beaucoup moins clair... que signifie false et 5.1 ici ?
```

Pour exprimer l'intention simplement dans l'instruction précédente, vous pouvez simplement assigner les littéraux à des variables, afin de clairement indiquer à quoi elles serviront.
```cpp
const auto recursive = false;
const auto delta_time = 5.1;
controller.update(false, delta_time);
```

---

### Adapter la longueur du nom au scope

Plus le symbole 


Voici les trois règles à suivre pour améliorer votre nommage :
- choisir des noms clairs,
- adapter la longueur des symboles à la taille de leur portée,
- utiliser des conventions pour distinguer les types de symboles.





Intentions type forts -> optional
Type forts -> retourner des structures plutôt que des pairs

