---
title: "Ownership"
weight: 2
---
---

### Ownership

On dit qu'un objet A est le **propriétaire**, ou le **owner**, d'un objet B lorsque la destruction de A entraîne la destruction de B.\
Dans l'exercice précédent, on peut donc dire que `box` était propriétaire de `box._content`.

Considérons un autre exemple :

```cpp
std::vector<Box> boxes;

             boxes.emplace_back("gift1");
Box& gift2 = boxes.emplace_back("gift2");
Box  gift3 = boxes.emplace_back("gift3");
```
Ici, le tableau `boxes` est le propriétaire des objets `boxes[0]`, `boxes[1]` et `boxes[2]`.
Il est également propriétaire de l'objet `gift2`, puisqu'il s'agit d'une référence sur `boxes[1]`.\
En revanche, il n'est pas propriétaire de `gift3`, car `gift3` est une copie de `boxes[2]`, et que la destruction de `boxes` n'entrainera donc pas la destruction de `gift3`.

Considérons un exemple supplémentaire :

```cpp
struct Content
{
    Content(const std::string& name)
        : name { name }
    {}

    std::string name;
};

class Bag
{
public:
    Content& add(const std::string& name) { return _contents.emplace_back(name); }

private:
    std::vector<Content> _contents;
};

int main()
{
    Bag bag;
    bag.add("thing1");
    bag.add("thing2");

    return 0;
}
```

Dans le code ci-dessus, `bag._contents` est le propriétaire de `bag._contents[0]` et `bag._contents[1]`.
Aussi, `bag` est le propriétaire de `bag._contents`.

La destruction de `bag` entraînera donc la destruction de `bag._contents`, qui elle-même entraînera la destruction de `bag._contents[0]` et `bag._contents[1]`.\
La relation d'ownership est donc une relation transitive.
Si un objet A est propriétaire d'un objet B, qui lui-même est propriétaire d'un objet C, alors A est également propriétaire de C.

Analysez maintenant le code du programme `Reminders` du TP2 (vous pouvez trouver la correction [ici](https://github.com/Laefy/CPP_Learning_Code/tree/tp2_solution/tp-02)) et essayez d'identifier toutes les relations d'ownership qu'il contient.\
Déduisez-en les durées de vie des différents objets du programme.

{{% expand "Solution" %}}
`clock`:
- la durée de vie de `clock` va de la ligne 15 à la ligne 33 du `main`
- propriétaire de `clock._min_hand`, `clock._sec_hand` et `clock._events`
- mais pas de `events` (celui du `main`)

`clock._min_hand`:
- même durée de vie que `clock`, donc `main`: 15-33
- propriétaire de `clock._min_hand._minutes`

`clock._min_hand._minutes`:
- même durée de vie que `clock._min_hand`, donc `main`: 15-33

`clock._sec_hand`:
- même durée de vie que `clock`, donc `main`: 15-33
- propriétaire de `clock._sec_hand._seconds`
- mais pas de `clock._sec_hand._min_hand` (équivalent à `clock._min_hand`)

`clock._events`:
- même durée de vie que `clock`, donc `main`: 15-33
- propriétaire des éléments du tableau `clock._events`
- mais pas des éléments du tableau `events` (celui du `main`), car les éléments ont été copiés

`events`:
- sa durée de vie s'étend de `main` : 13-33
- propriétaire des éléments du tableau `events`
- mais pas des éléments du tableau `clock._events`
{{% /expand %}}

---

### Les pièges de la mémoire

Etre attentifs aux relations d'ownership permet généralement de déterminer les durées de vie des objets.
Il existe cependent des cas où cela n'est pas tout à fait vrai...

Par exemple, prenons chacun des éléments du tableau `clock._events`.
On pourrait supposer, en raison du fait que leur propriétaire est `clock._events` qu'ils ont la même durée de vie que ce dernier, mais cela n'est pas vrai.

Puisqu'un `std::vector` n'est finalement qu'un tableau dynamique, lorsque la capacité mémoire réservée pour ce dernier est atteinte, une nouvelle zone est réallouée, et les objets sont copiés dedans.\
Cela signifie donc que chaque fois qu'une réallocation mémoire a lieu, la durée de vie de chacun des `clock._events[i]` se termine, et de nouveaux objets sont créés ailleurs.

Si l'on voulait conserver des références sur les éléments de `clock._events`, il serait dans ce cas impossible de garantir la sécurité du programme.\
En effet, les objets référencés pourraient être détruits à tout moment, et leurs références invalidées sans qu'on ne le sache. 

La prochaine étape de ce chapitre sera donc de vous montrer comment contourner ce problème pour coder de manière sécurisée.
