---
title: "Décrire l'intention"
chapter: false
weight: 1
---

Lorsque vous écrivez du code, celui-ci va s'adresser à plusieurs cibles :
1. Le compilateur : afin d'obtenir un programme exécutable, votre code devra être syntaxiquement correct pour que le compilateur puisse le comprendre et générer le binaire associé.
2. Le client : c'est bien d'avoir un programme qui compile, mais il faut également que celui-ci réponde aux besoins formulés par le client.
Autrement, votre dur labeur ne pourra être apprécié à sa juste valeur.
3. Les programmeurs : il est rare que vous écriviez le programme idéal d'une seule traite...
Vous ou vos collègues devront relire et adapter votre code afin de le faire évoluer et de corriger les éventuels bugs.

Satisfaire le compilateur n'est généralement pas trop compliqué.\
Satisfaire le client l'est déjà plus.\
Satisfaire les programmeurs est en revanche un chemin semé d'embûches.

Pour commencer, les contraintes de délai font qu'on peut avoir tendance à coder vite et mal.
En plus, vous n'appréciez pas forcément vos collègues, donc pourquoi perdre du temps à leur simplifier la vie ?

La première raison de prendre le temps d'écrire du code clair, c'est que c'est vous le premier qui aller avoir besoin de le relire.
On passe généralement 80% des son temps à lire du code, pour seulement 20% à en écrire du nouveau.
Donc autant vous évitez des migraines à essayer de comprendre ce que vous étiez en train d'essayer de faire 6 mois plus tôt.
La seconde raison, c'est que prendre le temps d'écrire du code clair vous en fera gagner sur le long terme.
Faire évoluer du code compréhensible, ce n'est pas simple, mais ça l'est beaucoup plus que de faire évoluer du code cracra.

Nous allons donc maintenant nous intéresser au premier levier qui permet de rendre votre code compréhensible.
Il s'agit de l'**intention**.
Cela signifie que lorsque vous codez, vous ne devez pas seulement faire du code qui fonctionne, vous devez aussi faire l'effort de communiquer ce que vous essayiez de faire.

Nous verrons donc dans cette partie quatre points qui permettent d'exprimer cette intention :
- le nommage,
- le typage,
- la constness,
- les smart-pointers.
