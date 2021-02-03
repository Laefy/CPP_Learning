---
title: "Un peu de doc..."
weight: 1
---

Pour démarrez ce chapitre, nous allons vous expliquer comment parcourir la documentation que vous trouverez sur le site {{% open_in_new_tab "https://en.cppreference.com/w/" "cppreference" /%}}.

Commencez par ouvrir {{% open_in_new_tab "https://en.cppreference.com/w/cpp/container/vector" "cette page" /%}}. Vous y trouverez la documentation de la classe `vector`.\
A première vue, son contenu peut paraître indigeste. Nous allons donc vous expliquer comment il est structuré afin que vous puissiez vous y repérer plus facilement.

---

### Documentation d'une classe

#### 1. En-tête

![](/CPP_Learning/images/chapter3/doc-vector-header.png)

Dans l'en-tête de la documentation, vous trouverez le nom de la classe, suivi du header à inclure afin de pouvoir l'utiliser.\
Une phrase décrit ensuite brièvement le rôle de la classe : on nous dit par exemple que `vector` est un conteneur séquentiel de taille dynamique.

{{% notice note %}}
Un conteneur séquentiel est un conteneur "linéaire", comme un tableau ou une liste. Les arbres et les graphes ne sont donc pas des conteneur séquentiels. 
{{% /notice %}}

On trouve ensuite une description plus détaillée, dans laquelle il est possible d'obtenir des informations sur comment le conteneur est implémenté :
- Comment les éléments sont organisés en mémoire ? (contigûs comme dans un tableau, éparpillés comme dans une liste chaînée, ...)
- Si l'utilisateur doit penser à allouer ou libérer de la mémoire. Dans le cas du `vector`, tout est géré automatiquement par la classe.
- La complexité des opérations classiques (accès, insertions, suppressions, etc),
- ...


#### 2. Paramètres de template / Spécialisations

![](/CPP_Learning/images/chapter3/doc-vector-params.png)

Les paramètres de templates correspondent aux éléments que vous devez indiquer dans les `<...>` de `vector`. Ces éléments doivent parfois respecter des contraintes, et cette section de la documentation permet d'en prendre connaissance. 

On peut ici voir que pour utiliser un `vector<T>`, il faut que `T` soit constructible par copie (= contructeur par copie disponible) et assignable par copie (= opérateur d'assignation par copie disponible).

**Qu'en est-il d'`Allocator` ? Pourquoi n'avons nous pas eu à fournir de valeur pour ce paramètre à `vector` ?**\
Nous n'étudierons pas dans ce cours le rôle du paramètre `Allocator`. Cependant, sachez que si vous avez pu écrire `vector<int>` plutôt que `vector<int, allocator>` jusqu'ici, c'est parce que ce paramètre a une valeur par défaut. Pour connaître la valeur par défaut éventuelle d'un paramètre de template, vous pouvez retourner voir [l'en-tête](./#1-en-tête) de la page.

Juste après les paramètres, vous trouvez des informations sur les éventuelles spécialisations de la classe.\
Une spécialisation est une version un peu modifiée de la classe, qui sera utilisée à la place de la version de base si on lui donne  des paramètres de template particuliers.\
Sur cette page, on vous dit que si vous utilisez des `vector<bool>`, alors l'implémentation de la classe est adaptée de manière à occuper moins d'espace en mémoire.  

#### 3. Invalidation d'itérateurs

On trouve ensuite la liste des fonctions qui, lorsqu'elles sont appelées, invalident les itérateurs. Nous étudierons les itérateurs et leur invalidation dans le [Chapitre 6](/chapter6).
![](/CPP_Learning/images/chapter3/doc-vector-it.png)

{{% notice warning %}}

Sachez que si vous êtes en train de parcourir un conteneur au moyen d'une boucle **foreach**, vous ne devez utiliser aucune fonction pouvant invalider l'itérateur `end()`.\
Dans le cas du `vector`, si vous regardez le tableau, cela élimine donc toutes les fonctions qui ne sont pas des opérations de lecture seule.
{{% /notice %}}

#### 4. Types membres

La section suivante donne la liste des types définis à l'intérieur de la classe. On ne s'intéressera pas à son contenu pour le moment.
![](/CPP_Learning/images/chapter3/doc-vector-types.png)

#### 5. Fonctions

On trouve enfin la liste des fonctions que l'on va pouvoir utiliser sur la classe. C'est cette partie que vous consulterez le plus souvent.
![](/CPP_Learning/images/chapter3/doc-vector-fcns.png)

Cette liste est organisée en catégories, dont la première contient toujours le constructeur, le destructeur et l'opérateur d'assignation (et parfois quelques autres fonctions).
Sur chaque ligne est indiquée le nom de la fonction, une brève description de ce qu'elle fait, la version à partir de laquelle elle est disponible et sa visibilité.

#### 6. Exemple

Tout en bas de la page, vous trouvez généralement un exemple permettant de comprendre très rapidement comme la classe peut s'utiliser.
![](/CPP_Learning/images/chapter3/doc-vector-ex.png)


---

### Documentation d'une fonction

Cliquez maintenant sur la fonction `emplace_back`, afin d'ouvrir la page contenant sa documentation. Nous détaillerons seulement les sections les plus importantes.

#### 1. En-tête

![](/CPP_Learning/images/chapter3/doc-fcn-header.png)

Dans l'en-tête des pages de documentation de fonctions, vous trouverez les signatures des différentes surcharges de la fonction, ainsi que les versions pour lesquelles elles sont disponibles.\
Vous pouvez par exemple voir qu'initialement, `emplace_back` ne retournait rien, et qu'à partir de C++17, elle retourne une référence.

En-dessous des signatures des surcharges, vous trouvez le détail ce que la fonction fait pendant son appel.

#### 2. Paramètres

![](/CPP_Learning/images/chapter3/doc-fcn-params.png)

Vous trouvez ici pour chaque paramètre attendu par la fonction, ce que celle-ci compte en faire. Notez par exemple que dans le cas de `emplace_back`, les arguments sont directement transmis au constructeur de l'élément à insérer.\
Si vous avez une classe `Person` dont le constructeur attend un prénom et un nom, vous pouvez donc écrire le code suivant :
```cpp
std::vector<Person> persons;
persons.emplace_back("Bruce", "Wayne");
persons.emplace_back("Clark", "Kent");
``` 

En dessous des paramètres de la fonction, on vous indique les éventuelles contraintes sur les paramètres de template. Si on souhaite appeler `emplace_back` sur un `std::vector<Person>`, il faut que `Person` soit `MoveInsertable` et `EmplaceConstructible`. Vous pouvez cliquer sur chacune de ces contraintes si vous désirez savoir ce qu'elles impliquent.

#### 3. Valeur de retour
 
![](/CPP_Learning/images/chapter3/doc-fcn-return.png)

On vous indique simplement ce que la fonction vous renvoie.

#### 4. Exceptions

![](/CPP_Learning/images/chapter3/doc-fcn-exceptions.png)

Il est possible de lancer des exceptions en C++. Cette section indique la liste des exceptions que la fonction peut lancer et ce qu'il se passe dans ce cas-là.\
Pour `emplace_back`, on voit que si une exception est lancée par le move constructor de l'élément, alors le comportement de la fonction est indéfini (undefined behavior).

#### 5. Exemples

![](/CPP_Learning/images/chapter3/doc-fcn-ex.png)

En fin de page, vous trouverez finalement le ou les exemples d'utilisation de la fonction.

{{% notice tip %}}
Le premier réflexe à avoir lorsque vous voulez savoir comment utiliser une fonction, c'est d'aller voir les exemples. Vous pourrez généralement récupérer et adapter le code qui vous est présenté à votre cas d'utilisation personnel.   
{{% /notice %}}

---

### Mission de recherche

Vous allez maintenant partir en mission. Votre objectif est de collecter les renseignements nécessaires pour répondre aux questions suivantes :
1. Quelle est la complexité d'insertion dans une `std::map` ?
2. Quelles différences y a-t-il entre les fonctions `push_back()` et `emplace_back()` de la classe `std::vector` ? 
3. Quelle fonction permet de savoir si un conteneur est vide ?
4. Quelle est la différence entre `std::vector::size()` et `std::vector::capacity()` ?
5. A quoi sert la classe `std::stack` ?
6. Quelle fonction permet de retirer le dernier élément d'un objet de type `std::queue` ?

{{% expand "Solution" %}}
1/ On peut trouver ce genre d'information dans l'en-tête de la documentation de la classe `map`. Il y est indiqué que les opérations de recherche, suppression et insertion sont de complexité logarithmique.

2/ En comparant les signatures de `push_back` et `emplace_back`, on se rend compte qu'il faut fournir directement à `push_back` l'élément à insérer (un seul élément de type `T`), alors qu'on peut fournir à `emplace_back` les paramètres permettant de construire le nouvel élément.

3/ En regardant sur les pages de différentes classes de conteneurs (`vector`, `array`, `map`, `set`, etc), on se rend qu'elles ont toutes une fonction membre `empty()`, qui renvoie `true` si le conteneur est vide.

4/ Il suffit de lire la description des deux fonctions pour se rendre compte que `size()` renvoie le nombre d'éléments du tableau, tandis que `capacity()` renvoie le nombre d'éléments pouvant tenir dans l'espace mémoire actuellement alloué par le tableau. L'exemple fourni sur la page de `capacity()` met bien en valeur cette distinction.

5/ D'après la description dans l'en-tête de `stack`, il s'agit d'une pile LIFO (last-in-first-out).

6/ En parcourant la liste des fonctions sur la page de `std::queue`, on se rend compte qu'il n'existe pas de fonction permettant de retirer son dernier élément.
{{% /expand %}}


