---
title: "Gestion mémoire"
chapter: true
chapterName: Chapitre 3
pre: "<b>3- </b>"
weight: 4
draft: true
---

Il existe beaucoup de langages dans lequel le concept de propriété n'existe pas.
Par exemple, en Java, tout le monde et personne n'est propriétaire d'un objet.
Lorsque vous créez un objet, vous obtenez une référence que vous pouvez ensuite copier et passer à n'importe quelle autre entité du programme.
Tant qu'il existe encore au moins référence sur l'objet, celui-ci continue d'exister.
Ce mécanisme est assuré par le garbage-collector, qui s'occupe de traquer le nombre de références de chacun des objets construits.
Dès qu'un objet n'est plus référencé nulle part, il est ajouté à la liste des ressources pouvant être libérées.

Lorsque les performances ne sont pas critiques, disposer de ce genre d'outil est très pratique, puisque cela permet d'une part de ne pas avoir à libérer la mémoire soi-même, mais aussi et surtout d'éviter de libérer malencontreusement des ressources qui pourraient encore être utilisées.
Vous savez que l'un des atouts majeurs du C++, c'est les performances qu'il apporte.
C'est pour cela que la gestion de la mémoire est manuelle dans ce langage, et que l'on se retrouve parfois avec des problèmes de dangling references ou des fuites de mémoire.

Ce chapitre sera dédié à la gestion mémoire en C++.
Nous commencerons par présenter les concepts de durée de vie (ou **lifespan**) et d'**ownership** (ou propriété en français) d'un objet.
Nous verrons ensuite comment éviter les problèmes récurrents liés à une mauvaise gestion de la mémoire, comme les fuites mémoires ou les dangling references.
