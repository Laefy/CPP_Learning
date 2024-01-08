---
title: "Présentation du langage"
weight: 1
---

Cette page vous présentera quelques caractéristiques du C++, les différences avec d'autres langages que vous avez étudiés jusque là, pourquoi est-ce que certains disent que C++ est compliqué, alors que pas forcément, et ce qui fait que le langage est aussi utilisé aujourd'hui. Promis, c'est la seule page du cours où vous trouverez autant de pavés 🙂

---

### Quelques caractéristiques

C++ est un langage de programmation informatique inventé dans les années 1980 par un informaticien nommé Bjarne Stroustrup. Il s'agit d'un langage...

##### ... Compilé

Tout comme le C, le C++ est un langage compilé. Nous aurons donc besoin d'un compilateur afin de générer le programme exécutable à partir de son code source. \
Contrairement aux langages interprétés (Python) ou semi-interprétés (Java), une fois le programme compilé, celui-ci peut directement être exécuté par le système d'exploitation. \
L'avantage est que le programme est généralement plus rapide à exécuter, puisqu'il n'est pas nécessaire de passer par un interpréteur. \
En revanche, l'exécutable ne sera pas portable et il faudra recompiler le programme pour chacun des systèmes sur lequel il devra être exécuté.
Cela implique donc soit de fournir les exécutables pour l'ensemble des systèmes que l'on souhaite supporter, soit de distribuer son code-source pour que chacun puisse compiler le programme pour le système qu'il utilise.

##### ... Orienté-objet

Comme le Java, C++ est un langage orienté-objet.
On pourra donc y définir des classes, dotées de fonctions membres et d'attributs, définir des relations d'héritage entre elles et redéfinir le comportement de base des classes mères dans les classes filles. \
Cependant, le C++ n'est pas un langage purement orienté-objet. On peut définir des fonctions en dehors de toute classe (on parle alors de fonctions libres), voire même implémenter des programmes complets sans définir la moindre classe.

##### ... Générique

Un langage est dit générique s'il permet d'appliquer un même algorithme sur différents types de données. Dans le cas du C++, la généricité s'exprime via les mécanismes suivants : \
\- le polymorphisme : on peut passer un objet de type Chien à une fonction recevant un objet de type Animal, \
\- la surcharge : on peut définir différentes fonctions avec le même nom, dès lors qu'elles acceptent un nombre différent de paramètres, ou que ces paramètres ne sont pas de même type, \
\- les templates (ou "patrons" en français, mais nous utiliserons toujours le terme anglais dans ce cours) : il est possible de définir des types et fonctions permettant de travailler avec des paramètres génériques.

---

### Un langage complexe ?

Le C++ est un langage qui est souvent qualifié de complexe.

Pour commencer, celui-ci ne dispose pas de garbage-collector.
Il faut donc manipuler avec soin la mémoire allouée, penser à la libérer lorsqu'elle n'est plus utilisée et faire attention de manière générale à la durée de vie des entités du programme.

Ensuite, le code produit en C++ peut rapidement devenir illisible.
Les espaces et tabulations n'étant pas significatifs comme en Python, le C++ repose sur l'utilisation de `()`, `{}` et `;` pour délimiter les expressions, instructions et blocs d'exécutions.
L'utilisation de symboles ne se limite pas à ça. On retrouve également l'utilisation de `<>` (templates), `::` (namespaces) ou encore `[]` (tableaux).
Finalement, lorsque tous ces caractères se retrouvent encapsulés les uns dans les autres, il peut être difficile de déchiffrer certains bouts de code.

{{% notice tip %}}
Il est toujours possible de rendre son code plus clair en définissant des variables pour expliciter des expressions, ou des fonctions pour extraire un ensemble d'instructions.
{{% /notice %}}

Enfin, pour préserver la rétro-compatibilité du C++, très peu de nouveaux mots-clefs ont été ajoutés au fil des versions. 
La syntaxe des nouvelles fonctionnalités se base donc souvent sur la réutilisation de mots-clefs déjà existants, mais utilisés dans un autre contexte, ou encore sur l'utilisation de caractères spéciaux.\
Les lambdas du C++ par exemple se présentent sous la forme suivante : `[c1, c2](int p1, int p2) { return (c1 + p1) - (c2 + p2); }`.\
Pas très digeste, n'est-ce pas ? 🙄

Ces différents points font du C++ un langage plutôt difficile à aborder.
Mais en réalité, une fois la syntaxe démystifiée et le concept de durée de vie des entités intégré, il devient relativement aisé de le comprendre et de programmer avec ! 🏆

---

### Un langage populaire

C++ est l'un des rares langages orientés-objet permettant une gestion extrèmement fine de la mémoire et des composants matériel de la machine.
Il est également très performant, ce qui fait de lui le langage de prédilection dans des domaines pour lesquels la performance est critique : systèmes d'exploitation, systèmes embarqués, pilotes, moteurs de recherche, jeux vidéos, moteurs de rendu 3D, etc.

Mais C++ ne se limite pas qu'à ces domaines. Il est un des langages de programmation les plus utilisés à travers le monde pour le développement d'applications ou d'API.
Cette popularité peut s'expliquer par le fait qu'il est extrêmement bien documenté et qu'il dispose d'une large communauté à laquelle s'adresser en cas de difficulté.
On peut aussi supposer que les nombreuses évolutions qu'il a connues depuis une dizaine d'années, autant pour apporter de nouvelles fonctionnalités que pour le rendre plus intuitif à utiliser, ont participé à son succès.

Un autre aspect important et apprécié du C++ est qu'il s'agit d'un langage sans surprise. Le standard spécifie tout ce qui est supporté, et surtout, tout ce qui ne l'est pas (undefined behavior). Si quelque chose est supporté, alors le standard définit un comportement que les compilateurs devront garantir quelque soit la machine sur laquelle le programme sera exécuté. Cela permet aux programmeurs d'être assurés que ce qui doit fonctionner fonctionnera effectivement, et de ne pas s'étonner si ce qui est spécifié comme undefined behavior ne fonctionne pas comme ils l'espéraient.

---

### Liens utiles

- {{< open_in_new_tab "https://en.cppreference.com/w/" "Documentation du langage et de la librairie standard" />}}
- {{< open_in_new_tab "https://www.godbolt.org/" "Pour compiler du code avec plein de compilateurs différents, et même l'exécuter" />}}
- {{< open_in_new_tab "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines" "Bonnes pratiques" />}}
- {{< open_in_new_tab "https://isocpp.org/faq" "Une super FAQ" />}}
- {{< open_in_new_tab "https://isocpp.org/std/the-standard" "Informations sur le standard" />}}
