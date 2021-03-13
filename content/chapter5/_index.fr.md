---
title: "Gestion des ressources"
chapter: true
chapterName: Chapitre 5
pre: "<b>5- </b>"
weight: 5
---

Il existe beaucoup de langages dans lequel le concept de propriété n'existe pas.
Par exemple, en Java, tout le monde et personne n'est propriétaire d'un objet.
Lorsque vous créez un objet, vous obtenez une référence que vous pouvez ensuite copier et passer à n'importe quelle autre entité du programme.
Tant qu'il existe encore au moins référence sur l'objet, celui-ci continue d'exister.
Ce mécanisme est assuré par le garbage-collector, qui s'occupe de traquer le nombre de références de chacun des objets construits.
Dès qu'un objet n'est plus référencé nulle part, il est ajouté à la liste des ressources pouvant être libérées.

Lorsque les performances ne sont pas critiques, disposer de ce genre d'outil est très pratique, puisque cela permet d'une part de ne pas avoir à libérer la mémoire soi-même, mais aussi et surtout d'éviter de libérer malencontreusement des ressources qui pourraient encore être utilisées.
Vous savez que l'un des atouts majeurs du C++, c'est les performances qu'il apporte.
C'est pour cela que la gestion de la mémoire est manuelle dans ce langage, et que l'on se retrouve parfois avec des problèmes de dangling references (comme nous l'avions vu au Chapitre 2) ou des fuites de mémoire.

Ce chapitre sera dédié à la gestion des ressources en C++.
Nous commencerons donc par présenter les concepts de durée de vie (ou **lifespan**) et d'**ownership** (ou propriété en français) d'une ressource.
Nous verrons ensuite en pratique ce que le C++ propose pour expliciter l'ownership d'une ressource et compenser l'absence de garbage-collector.
Nous vous présenterons enfin la syntaxe introduite en C++11 pour traduire la transmission de l'ownership.
