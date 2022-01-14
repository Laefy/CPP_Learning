---
title: "💠 Polygône"
weight: 6
---

Dans cet exercice, vous découvrirez la notion d'alias et le mécanisme d'amitié.\
Pour terminer, vous serez confronté à votre première "dangling reference".

---

Pour cet exercice, vous modifierez les fichiers :\
\- `chap-02/5-polygon/main.cpp`\
\- `chap-02/CMakeLists.txt`

Et vous ajouterez les fichiers :\
\- `chap-02/5-polygon/Polygon.h`\
\- `chap-02/5-polygon/Polygon.cpp`

La cible à compiler est `c2-5-polygon`.

---

### Présentation de l'exercice

Pour cet exercice, vous utiliserez la même méthodologie que pour l'exercice `first-class` : 
1. Décommenter la prochaine ligne du `main`.
2. Ecrire le code permettant de la faire compiler.
3. Compiler et tester.
4. Si ça ne fonctionne pas, modifier le code, et recommencer à partir de l'étape 3.
5. Si ça fonctionne, recommencer à partir de l'étape 1, jusqu'à ce que tout le code du `main` soit décommenté.

Vous aurez à implémenter une classe `Polygon` contenant un tableau dynamique de `Vertex`.

Vous ajouterez deux fichiers `Polygon.h` et `Polygon.cpp`, afin de contenir la définition de votre classe et l'implémentation de ses fonctions.

---

### Définition de la classe

Décommentez la première instruction du `main` :
```cpp
Polygon polygon;
```

Créez un nouveau fichier `Polygon.h` et ajoutez-y la définition d'une classe `Polygon`, pour le moment vide.\
Que faut-il mettre au début du header ? Que devez-vous penser à faire dans `main.cpp` ?

Décommentez la ligne associée à ce fichier dans le `CMakeLists.txt` (celui contenu dans `chap-02/5-polygon/`) afin que la compilation ajoute le fichier au programme.
Relancez la configuration du projet (dans VSCode, `CMake: Configure`), compilez et testez qu'il se lance.

{{% expand "Solution" %}}
Au début des headers, il faut écrire `#pragma once`.\
Dans le fichier `main.cpp`, on pense à inclure le nouveau fichier `Polygon.h`.

```cpp
#pragma once

class Polygon
{
};
```
{{% /expand %}}

---

### Ajout d'un sommet

Décommentez l'instruction suivante :
```cpp
polygon.add_vertex(2, 3);
```

Pour ajouter un sommet au polygône, il va déjà falloir faire en sorte que le polygône puisse en contenir.

Afin de représenter les sommets, vous allez utiliser la structure `std::pair<int, int>`.
Ajoutez un attribut `_vertices` qui puisse contenir un tableau dynamique de sommets.\
Quel doit-être le type de `_vertices` ? Dans quel header est défini `std::pair` ?

{{% expand "Solution" %}}
Les attributs doivent être placés autant que possible dans la partie privée.

```cpp
#pragma once

#include <utility>
#include <vector>

class Polygon
{
private:
    std::vector<std::pair<int, int>> _vertices;
};
```
{{% /expand %}}

Comme `std::pair<int, int>` n'est ni très lisible, ni très représentatif de ce qui va être contenu dedans, vous allez créer un **alias** `Vertex` dessus.\
Pour définir un alias (équivalent au `typedef` en C), on utilise le mot-clef `using` :
```cpp
using AliasName = OriginalType;
```

Adaptez cette instruction et placez là dans `Polygon.h`, juste avant la définition de votre classe. Modifiez la définition de `_vertices` afin d'utiliser cet alias.
{{% expand "Solution" %}}
{{< highlight cpp "hl_lines=5 10" >}}
#pragma once

#include <utility>
#include <vector>

using Vertex = std::pair<int, int>;

class Polygon
{
private:
    std::vector<Vertex> _vertices;
};
{{< /highlight >}}

{{% notice note %}}
Il est aussi possible de placer l'instruction pour définir un alias à l'intérieur d'une classe (partie privée ou publique, en fonction de si on veut pouvoir y accéder de l'extérieur ou pas), ainsi que dans le corps d'une fonction (accessible alors uniquement depuis cette fonction).
{{% /notice %}}

{{% /expand %}}

Ajoutez enfin la fonction `add_vertex` à votre classe.
Vous l'implémenterez dans un nouveau fichier `Polygon.cpp` (pensez à mettre à jour le `CMakeLists.txt` et à reconfigurer le projet).\
Pour construire un `Vertex` (aka `std::pair<int, int>`), sachez que vous pouvez lui passer deux entiers. 

{{% expand "Solution" %}}
Voici une implémentation possible pour `add_vertex` :

```cpp
void Polygon::add_vertex(int x, int y)
{
    _vertices.emplace_back(x, y);
}
```

{{% notice tip %}}
La fonction `emplace_back` de `vector` est un peu spéciale.
On peut lui passer directement les arguments que l'on passerait au constructeur de l'objet qu'on souhaite ajouter au tableau.\
Du coup, plutôt qu'écrire `_vertices.emplace_back(Vertex { x, y })`, on peut directement écrire `_vertices.emplace_back(x, y)`.\
Plutôt pratique, non ?
{{% /notice %}}

{{% /expand %}}

Utilisez le débuggeur pour vérifier que le sommet (2,3) a correctement été ajouté au polygône.

---

### Inspection des variables

Afin de vérifier que le programme fonctionne correctement, vous allez placer un breakpoint sur la ligne `polygon.add_vertex(2, 3)` du `main`.\
Placez pour cela votre curseur sur la colonne à gauche des numéros de lignes et cliquez.
![](/CPP_Learning/images/chapter2/6-breakpoint.png)

Lancez ensuite le programme en mode Debug en utilisant le bouton dans la barre bleue en bas de l'éditeur, ou avec le shortcut Ctrl+F5.\
Votre vue devrait désormais ressembler à celle-ci si vous vous placez dans l'onglet 'Exécution' à gauche :
![](/CPP_Learning/images/chapter2/6-execution.png)

Dans la fenêtre des variables, en haut à gauche, cliquez sur la variable `polygon`, puis sur son membre `_vertices`.\
Celui-ci ne devrait rien contenir.

Appuyez ensuite sur F10 afin d'exécuter l'instruction sur la ligne sur laquelle nous sommes arrêtés.\
Vous devriez pouvoir constater que `_vertices` contient désormais le sommet (2, 3). 
![](/CPP_Learning/images/chapter2/6-vertices-2-3.png)

---

### Un ami imprimeur

Décommentez les instructions :
```cpp
polygon.add_vertex(4, 5);
polygon.add_vertex(6, 7);

std::cout << polygon << std::endl;
```

Vous allez une fois de plus implémenter un opérateur `<<` afin d'afficher le contenu de votre objet.\
Nous attendrons dans la console le résultat suivant :
```b
(2,3) (4,5) (6,7) 
```

Déclarez l'opérateur `<<` dans `Polygon.h`, et implémentez-le dans `Polygon.cpp`.
Afin de pouvoir accéder aux attributs de la classe, vous changerez dans un premier temps leur visibilité à `public`.

{{< expand "Solution" >}}
<p><code>Polygon.h</code>:
{{< highlight cpp "hl_lines=3 14 18">}}
#pragma once

#include <ostream>
#include <utility>
#include <vector>

using Vertex = std::pair<int, int>;

class Polygon
{
public:
    void add_vertex(int x, int y);

public:
    std::vector<Vertex> _vertices;
};

std::ostream& operator<<(std::ostream& stream, const Polygon& polygon);
{{< /highlight >}}
</p>
<p><code>Polygon.cpp</code>:
{{< highlight cpp >}}
std::ostream& operator<<(std::ostream& stream, const Polygon& polygon)
{
    for (const auto& v: polygon._vertices)
    {
        stream << "(" << v.first << "," << v.second << ") ";
    }

    return stream;
}
{{< /highlight >}}
</p>
{{< /expand >}}

Testez que le programme compile et fonctionne.

Vous allez maintenant remettre les attributs dans la partie privée. Pour que votre opérateur puisse toujours y accéder, vous allez lui accorder un accès privilégié en la déclarant amie de `Polygon`.
Pour cela, il suffit de placer la déclaration de la fonction dans votre classe, précédée du mot-clef `friend`. Attention, cela ne signifie pas que l'opérateur devient une fonction-membre de la classe.
Toutes les fonctions déclarées avec le mot-clef `friend` sont forcément des **fonctions libres**.

{{% expand "Solution" %}}
L'endroit où vous placez la déclaration dans la classe n'a pas d'importance. Les modificateurs de visibilité n'ont pas d'effet sur une déclaration d'amitié. 

```cpp
class Polygon
{
    friend std::ostream& operator<<(std::ostream& stream, const Polygon& polygon);

public:
    void add_vertex(int x, int y);

private:
    std::vector<Vertex> _vertices;
};
```

{{% notice tip %}}
Une déclaration de fonction amie reste une déclaration de fonction. Il est donc tout à fait possible (mais pas nécessaire) de retirer la déclaration de l'opérateur à la fin du header.
{{% /notice %}}

{{% /expand %}}

---

### Retour de référence

Décommentez les deux prochaines instructions du `main` :
```cpp
const auto& vertex = polygon.get_vertex(1);
std::cout << "(" << vertex.first << "," << vertex.second << ")" << std::endl; // -> (4,5)
```

Implémentez la fonction `get_vertex` directement dans la définition de la classe.\
Puisqu'il s'agit d'un getter, et qu'un getter n'est pas censé modifier l'instance sur laquelle il est appelé, que faut-il ajouter à la signature de `get_vertex` ?\
Dans le `main`, la variable `vertex` est déclarée avec `const auto&`. Quel devrait être son type ? Déduisez-en le type de retour attendu pour la fonction.

{{% expand "Solution" %}}
Les fonction-membres qui ne modifient pas l'état de l'objet doivent ajouter `const` à la fin de leur signature, derrière la liste de leurs paramètres.\
La variable étant nommée `vertex`, elle devrait logiquement contenir un `Vertex`. Comme elle est déclarée avec `const auto&`, on en déduit qu'elle sera de type `const Vertex&`.

```cpp
class Polygon
{
    ...
    
    const Vertex& get_vertex(size_t idx) const
    {
        return _vertices[idx];
    }
    
    ...
};
```
{{% /expand %}}

Vous allez maintenant déplacer l'implémentation de la fonction dans le fichier `Polygon.cpp`. Notez bien que le mot-clef `const` fait partie de la signature de la fonction (contrairement à `static` ou `friend`).

{{% expand "Solution" %}}
Comme `const` fait partie de la signature de la fonction, il doit apparaître non seulement dans sa déclaration, mais aussi dans sa définition.

`Polygon.h` :
```cpp
class Polygon
{
    ...
    const Vertex& get_vertex(size_t idx) const;
    ...
};
```

`Polygon.cpp` :
```cpp
const Vertex& Polygon::get_vertex(size_t idx) const
{
    return _vertices[idx];
}
```
{{% /expand %}}

---

### Une référence pendouillante 😱

Décommentez le restant du `main` :
```cpp
for (auto i = 0; i < 200; ++i)
{
    polygon.add_vertex(i, i * 2);
}

std::cout << "(" << vertex.first << "," << vertex.second << ")" << std::endl; //-> ???
```

Dans ces instructions, on commence par ajouter de nombreux sommets au polygône, puis on essaye d'afficher une nouvelle fois la variable `vertex`, qui est censée contenir le deuxième sommet du polygône.

Testez le programme et constatez le problème.

**Pourquoi la dernière instruction n'affiche pas `(4,5)`, comme c'était le cas sur la ligne d'au-dessus ?**

Afin de répondre à cette question, vous allez une nouvelle fois utiliser le débuggeur.

Placez un breakpoint sur l'instruction réalisant le dernier affichage correct et lancez le programme en mode Debug (Ctrl+F5).\
Exécutez l'instruction courante en appuyant sur F10 (vous pouvez aussi utiliser les boutons en haut de l'éditeur, mais c'est moins pratique je trouve).\
Recommencez jusqu'à ce que le contenu de `vertex` change. Quelle instruction semble être responsable du problème ?

{{% expand "Solution" %}}
C'est à la suite de l'exécution de l'un des `polygon.add_vertex(i, i * 2)` que `vertex` change de valeur (de mon côté, il s'agit de la seconde itération).
![](/CPP_Learning/images/chapter2/6-corruption.png)
{{% /expand %}}

**Que se passe-t-il en réalité ?**

Lorsque l'on ajoute des éléments à un `vector`, celui-ci réserve une zone dans la mémoire d'une certaine taille afin de les stocker.
Si cette zone est pleine, la prochaine insertion déclenchera une réallocation mémoire, afin de réserver une nouvelle zone plus grande et de libérer la précédente.\
Généralement, lorsque de la mémoire est libérée, celle-ci se retrouve souillée de garbage values.

Ici, comme `vertex` est une référence, son contenu reflète le contenu de l'espace mémoire depuis lequel elle a été initialisée.
Lorsque le tableau est réalloué, la zone mémoire pointée par `vertex` est libérée et par conséquent, cette denière accède désormais à des valeurs arbitraires. 

{{% notice info %}}
Ce problème est courant et porte le nom de **dangling reference**. En français, cela se traduit subtilement par "référence pendouillante".
Dès lors que vous avez une référence qui pointe sur de la mémoire qui a été libérée en court de route, vous faites face à une dangling reference.\
Il faut donc être prudent lorsque vous utilisez des références : essayez de vous assurer, avant d'utiliser une référence, que la durée de vie de la variable d'origine est au moins supérieure à la durée de vie des références qui seront créées dessus.
{{% /notice %}}

Pour corriger le bug, vous pouvez déclarer la variable `vertex` en tant que copie plutôt qu'en tant que référence (vous pouvez conserver la référence en type de retour par contre). L'avantage, c'est que vous n'avez pas à vous préoccuper des éventuelles dangling references.
L'inconvénient, c'est que si les valeurs du sommet sont modifiées dans le polygône, `vertex` conservera les anciennes valeurs.
