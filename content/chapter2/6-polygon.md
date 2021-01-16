---
title: "💠 Polygône"
weight: 6
---

Dans cet exercice, vous implémenterez votre premier destructeur. Vous y découvrirez aussi la notion d'alias et le mécanisme d'amitié.\
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

Vous aurez à implémenter une classe `Polygon` contenant un tableau de `Vertex`, alloué dynamiquement par vos soins.

Vous ajouterez deux fichiers `Polygon.h` et `Polygon.cpp`, afin de contenir la définition de votre classe et l'implémentation de ses fonctions.
Pour que le programme puisse tenir compte de ses deux nouveaux fichiers, vous aureez à décommenter les lignes correspondantes dans le CMakeLists.txt.

Nous mettons à votre disposition la définition d'une fonction `realloc`. Ne vous embêter pas à essayer de comprendre son implémentattion, sachez juste qu'elle permet de réallouer un tableau dynamique afin de pouvoir y mettre des éléments en plus.
Vous pouvez l'utiliser de la manière suivante :
```cpp
int* array = new int[3] {};
array[0] = 0;
array[1] = 1;
array[2] = 2;

// We now want to add a fourth item in the array, which current capacity is 3.
array = realloc(array, 3, 4);

array[3] = 3;
```

---

### Définition de la classe

Décommentez la première instruction du `main` :
```cpp
Polygon polygon;
```

Créez un nouveau fichier `Polygon.h` et ajoutez-y la définition d'une classe `Polygon`, pour le moment vide.\
Que faut-il mettre au début du header ? Que devez-vous penser à faire dans `main.cpp` ?

Décommentez la ligne associée à ce fichier dans le `CMakeLists.txt`. Relancez la configuration du projet (dans VSCode, `CMake: Configure`), compilez et testez.

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

Afin de représenter les sommets, vous allez utiliser la classe `std::pair<int, int>`. Ajoutez un attribut `_vertices` qui puisse contenir un tableau dynamique de sommets alloué manuellement.
Ajoutez également un attribut `_size`, de type `size_t`, qui contiendra le nombre de sommets courants du polygône.\
Quel doit-être le type de `_vertices` ? Dans quel header est définie la classe `std::pair` ?

{{% expand "Solution" %}}
Les attributs doivent être placés autant que possible dans la partie privée.\
N'oubliez pas de leur attribuer un class-initializer, puisqu'ils sont de types primitifs (`size_t` et pointeur).

```cpp
#pragma once

#include <utility>

class Polygon
{
private:
    size_t               _size     = 0u;
    std::pair<int, int>* _vertices = nullptr;
};
```
{{% /expand %}}

Comme `std::pair<int, int>` n'est ni très lisible, ni très représentatif de ce qui va être contenu dedans, vous allez créer un **alias** `Vertex` dessus.\
Pour définir un alias en C, vous utilisiez `typedef`. En C++, vous pouvez aussi utiliser `typedef`, mais nous vous conseillons plutôt d'utiliser le mot-clef `using` :
```cpp
using AliasName = OriginalType;
```

Adaptez cette instruction et placez là dans `Polygon.h`, juste avant la définition de votre classe. Modifiez la définition de `_vertices` afin d'utiliser cet alias.
{{% expand "Solution" %}}
{{< highlight cpp "hl_lines=5 11" >}}
#pragma once

#include <utility>

using Vertex = std::pair<int, int>;

class Polygon
{
private:
    size_t  _size     = 0u;
    Vertex* _vertices = nullptr;
};
{{< /highlight >}}

{{% notice note %}}
Il est aussi possible de placer l'instruction pour définir un alias à l'intérieur d'une classe (partie privée ou publique, en fonction de si on veut pouvoir y accéder de l'extérieur ou pas), ainsi que dans le corps d'une fonction (accessible alors uniquement depuis cette fonction).
{{% /notice %}}

{{% /expand %}}

Ajoutez enfin la fonction `add_vertex` à votre classe. Vous l'implémenterez dans un nouveau fichier `Polygon.cpp` (pensez à mettre à jour le `CMakeLists.txt` et à reconfigurer le projet).\
Dans cette fonction, vous pourrez utiliser la fonction `realloc` pour augmenter la taille de votre tableau (ça marchera, même si votre tableau est initialement vide), et appeler le constructeur de `Vertex` (aka `std::pair<int, int>`) de cette manière : `Vertex { x, y }`.

{{% expand "Solution" %}}
N'oubliez pas d'inclure `"realloc.h"` dans `Polygon.cpp`.\
Voici une implémentation possible pour `add_vertex` :

```cpp
void Polygon::add_vertex(int x, int y)
{
    const auto old_size = _size;
    ++_size;

    _vertices = realloc(_vertices, old_size, _size);
    _vertices[old_size] = Vertex { x, y };
}
```
{{% /expand %}}

Utilisez le débuggeur pour vérifier que le sommet (2,3) a correctement été ajouté au polygône.

---

### Destruction

Bien joué, vous venez de générer une fuite de mémoire. J'espère que vous êtes pas fiers 😑\
Si vous ne me croyez pas, vous pouvez installer l'utilitaire {{% open_in_new_tab "https://www.valgrind.org/" "Valgrind" /%}} et lancer votre programme avec.

Afin de supprimer cette fuite, il va falloir demander que lors de leur destruction, les instances de `Polygon` libèrent la mémoire qu'elles ont allouée.
Pour cela, vous allez définir un **destructeur** qui viendra remplacer celui que le compilateur vous a généré par défaut.

Un destructeur est une fonction sans type de retour, qui a pour nom `~ClassName` et qui ne prend aucun paramètre. Il est appelé automatiquement par le compilateur dès que l'on sort d'un bloc (corps de fonction, boucle ou `if` / `else`) dans lequel on a définit des variables. Il est aussi appelé sur les variables allouées dynamiquement lorsque l'on utilise `delete`.

Essayez de définir un destructeur dans la classe `Polygon` qui exécutera la libération mémoire de l'attribut `_vertices`.\
Sachant que `_vertices` est un tableau, et non pas un pointeur sur un unique `Vertex`, quel mot-clef devez-vous utiliser pour libérer la mémoire ? 

{{% notice tip %}}
Pour définir un destructeur, c'est comme pour définir un constructeur par défaut, mais sans la liste d'initialisation et avec un `~` devant le nom.\
Et pour tapper le symbole `~` sur un clavier français, il faut utiliser la combinaison AltGr+2 deux fois (comme pour les `¨`).
{{% /notice %}}

{{% expand "Solution" %}}
N'oubliez pas d'inclure `"realloc.h"` dans `Polygon.cpp`.\
Voici une implémentation possible pour `add_vertex` :

```cpp
Polygon::~Polygon()
{
    delete[] _vertices;
}
```
{{% /expand %}}

Si vous avez défini le destructeur directement dans le header, déplacez son implémentation dans `Polygon.cpp`.

---

### Inspection d'un tableau

Décommentez les deux instructions suivantes :
```cpp
polygon.add_vertex(4, 5);
polygon.add_vertex(6, 7);
```

Compilez et utilisez le débuggeur pour inspecter la valeur de `polygon._vertices`.\
Comme vous pouvez le constater, dans la section `Variables`, le débuggeur suppose que `_vertices` pointe sur un unique `Vertex`, et il ne vous affiche donc que la première valeur :
![](/CPP_Learning/images/vscode-debug-array.png)

Afin de pouvoir inspecter les 3 cases du tableau `_vertices`, vous pouvez placer l'expression `*polygon._vertices@3` dans la section `Watch` (si ça ne fonctionne pas, essayez `polygon._vertices, 3` ou `(Vertex[3]) polygon`) :
![](/CPP_Learning/images/vscode-watch-array.png)

---

### Un ami imprimeur

Décommentez l'instruction :
```cpp
std::cout << polygon << std::endl;
```

Vous allez une fois de plus implémenter un opérateur `<<` afin d'afficher le contenu de votre objet.\
Nous attendrons dans la console le résultat suivant :
```b
(2,3) (4,5) (6,7) 
```

Déclarez l'opérateur `<<` dans `Polygon.h`, et implémentez-le dans `Polygon.cpp`. Afin de pouvoir accéder aux attributs de la classe, vous changerez dans un premier temps leur visibilité à `public`.

{{< expand "Solution" >}}
<p><code>Polygon.h</code>:
{{< highlight cpp "hl_lines=3 15 20">}}
#pragma once

#include <ostream>
#include <utility>

using Vertex = std::pair<int, int>;

class Polygon
{
public:
    ~Polygon();

    void add_vertex(int x, int y);

public:
    size_t  _size     = 0u;
    Vertex* _vertices = nullptr;
};

std::ostream& operator<<(std::ostream& stream, const Polygon& polygon);
{{< /highlight >}}
</p>
<p><code>Polygon.cpp</code>:
{{< highlight cpp >}}
std::ostream& operator<<(std::ostream& stream, const Polygon& polygon)
{
    for (size_t i = 0; i < polygon._size; ++i)
    {
        const auto& v = polygon._vertices[i];
        stream << "(" << v.first << "," << v.second << ") ";
    }

    return stream;
}
{{< /highlight >}}
</p>
{{< /expand >}}

Testez que le programme compile et fonctionne.

Vous allez maintenant remettre les attributs dans la partie privée. Pour que votre opérateur puisse toujours y accéder, vous allez lui accorder un accès privilégié en la déclarant amie de `Polygon`.
Pour cela, il suffit de placer la déclaration du la fonction dans votre classe, précédée du mot-clef `friend`. Attention, cela ne signifie pas que l'opérateur devient une fonction-membre de la classe.
Toutes les fonctions déclarées avec le mot-clef `friend` sont forcément des **fonctions libres**.

{{% expand "Solution" %}}
L'endroit où vous placez la déclaration dans la classe n'a pas d'importance. Les modificateurs de visibilité n'ont pas d'effet sur une déclaration d'amitié. 

```cpp
class Polygon
{
    friend std::ostream& operator<<(std::ostream& stream, const Polygon& polygon);

public:
    ~Polygon();

    void add_vertex(int x, int y);

    const Vertex& get_vertex(size_t idx) const;

private:
    size_t  _size     = 0u;
    Vertex* _vertices = nullptr;
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

Implémentez la fonction `get_vertex` direction dans la définition de la classe.\
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
    polygon.add_vertex(8, 9);

    std::cout << "(" << vertex.first << "," << vertex.second << ")" << std::endl; // -> ???
```

Dans ces deux instructions, on commence par ajouter un nouveau sommet au polygône, puis on essaye d'afficher une nouvelle fois la variable `vertex`, qui est censée contenir le deuxième sommet du polygône.

Testez le programme et constatez le problème.

**Pourquoi la dernière instruction n'affiche pas `(4,5)`, comme c'était le cas sur la ligne d'au-dessus ?**

Afin de répondre à cette question, vous allez débugger votre programme par itérations.

Placez un breakpoint sur l'instruction réalisant le dernier affichage correct et lancez le programme avec `CMake: Debug`.\
Dans la section `watch`, entrez l'expression qui vous permettra de visualiser le contenu de la variable `vertex`.\
Exécutez l'instruction courante en appuyant sur F10 (vous pouvez aussi utiliser les boutons en haut de l'éditeur, mais c'est moins pratique je trouve).\
Recommencez jusqu'à ce que la corruption de `vertex`. Quelle instruction semble être responsable du problème ?

{{% expand "Solution" %}}
C'est à la suite de l'exécution de `polygon.add_vertex(8, 9);` que `vertex` change de valeurs.
![](/CPP_Learning/images/vscode-dangling-ref.png)
{{% /expand %}}

Relancez le programme avec le même breakpoint.

Vous allez maintenant entrer à l'intérieur des appels de fonctions, pour identifier plus précisemment d'où le bug provient.
Afin de pouvoir suivre le contenu de la variable `vertex` en étant à l'intérieur des sous-fonctions, vous allez devoir récupérer l'adresse de cette variable et la recaster en `Vertex*` :
![](/CPP_Learning/images/vscode-watch-addr.png)
![](/CPP_Learning/images/vscode-watch-copy.png)
![](/CPP_Learning/images/vscode-watch-cast.png)

Vous devriez maintenant avoir les mêmes valeurs dans `vertex` que dans `(Vertex*)(0xUneAdresse)` :
![](/CPP_Learning/images/vscode-watch-cast-res.png)

Avancez jusqu'à l'instruction `polygon.add_vertex(8, 9);` avec F10.\
Entrez maintenant à l'intérieur de l'appel en utilisant F11.\
Itérez dans la fonction avec F10 jusqu'à ce les valeurs du sommet dans votre Watch changent. Où est le problème ?

C'est la réallocation du tableau `_vertices` qui est responsable de la corruption de `_vertex`. Eh oui, les références, ce ne sont en fait que des pointeurs un peu plus jolis.\
`_vertex` pointe sur le même emplacement que `_vertices[1]`, sauf que `_vertices` est entre temps réalloué et la mémoire utilisée par le tableau d'origine est libérée. Or, à aucun moment `_vertex` n'est prévenu qu'il faut aller pointer sur la mémoire du nouveau tableau. D'ailleurs, `_vertex` étant une référence et non un pointeur, il n'est pas possible de modifier la zone vers laquelle elle pointe après son initialisation.

{{% notice info %}}
Ce problème est courant et porte le nom de **dangling reference**. En français, cela se traduit subtilement par "référence pendouillante". Dès lors que vous avez une référence qui pointe sur de la mémoire qui a été libérée en court de route, vous faites face à une dangling reference. Il faut donc être prudent lorsque vous utilisez des références : essayez de vous assurer, avant d'utiliser une référence, que la durée de vie de la variable d'origine se bien supérieure à la durée de vie des références qui seront créées dessus.
{{% /notice %}}

Pour corriger le bug, vous pouvez déclarer la variable `vertex` en tant que copie plutôt qu'en tant que référence (vous pouvez conserver la référence en type de retour par contre). L'avantage, c'est que vous n'avez pas à vous préoccuper des éventuelles dangling references. L'inconvénient, c'est que si les valeurs du sommet sont modifiées dans le polygône, `vertex` conservera les anciennes valeurs.

