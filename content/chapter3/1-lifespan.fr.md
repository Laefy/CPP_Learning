---
title: "Durée de vie"
weight: 1
---

---

Pour cet exercice, vous modifierez les fichiers :\
\- `chap-03/1-teachers/DataBase.cpp`\
\- `chap-03/1-teachers/DataBase.h`

La cible à compiler est `c3-1-teachers`.

---

### Définition

La durée de vie d'une ressource (bloc de mémoire, flux, connection réseau, etc) correspond à la période durant laquelle cette ressource est valide.

Le C++ est un langage dans lequel nous avons la main sur la durée de vie de nos ressources.
Dans le cas d'un objet, sa durée de vie s'étend de sa construction à sa destruction.
Ce qu'il est important de noter, c'est que cette durée de vie ne coïncide pas toujours avec la portée de la variable référençant l'objet.

```cpp
void lifespan()
{
    int* five = new int { 5 };
    int& five_ref = *five;
    {
        int three = 3;
        delete five;
    }
    int ten = 10;
}
```

Dans le code ci-dessus, la portée de la variable `five_ref` s'étend de la ligne 4 à la ligne 10 (= l'accolade fermante de `lifespan`).
En revanche, la durée de vie de l'objet référencé par `five_ref` s'étend de la ligne 3 (construction du `int`) jusqu'à la ligne 7 (destruction de ce `int`).\
La variable `five_ref` est donc une dangling reference de la ligne 8 et la ligne 10. Il ne faut surtout pas s'en servir dans cette section du programme.

Réorganisez les instructions afin que la portée des variables n'excèdent pas (ou presque pas) la durée de vie des ressources qui leur sont associées. 

{{% expand "Solution" %}}
Il faut s'arranger pour que `delete five` soit exécuté juste avant la fin du bloc dans lequel `five` et `five_ref` sont définies.\
Par exemple : 
```cpp
void lifespan()
{
    {
        int* five = new int { 5 };
        int& five_ref = *five;
        delete five;
    }
    int three = 3;
    int ten = 10;
}
```
{{% /expand %}}

{{% notice tip %}}
Autant que possible, arrangez-vous pour que les portées de vos variables correspondent à la durée de vie des objets qu'elles référencent.
Evitez par exemple d'écrire un `delete` en plein milieu d'un bloc.
{{% /notice %}}

---

### Destruction intempestive

Le programme `c5-1-teachers` sert à générer une base de données référençant les différentes matières d'un cursus et les professeurs qui les enseignent.
Cette base dispose des contraintes suivantes :
- Un cursus peut avoir plusieurs matières.
- Une matière n'apparaît que dans un seul cursus.
- Une matière est enseignée par différents professeurs.
- Un professeur peut enseigner plusieurs matières.

Commencez par ajouter ce qu'il manque pour que le programme compile et remplisse son rôle.

{{% expand "Indices" %}}
- Il n'est pas possible de stocker directement des références dans les conteneurs de la STL, car les références ne sont pas réassignables.\
Que pouvez-vous utiliser à la place ?
- `std::find` est appliqué sur un `vector` de `Teacher*` (resp. `Curriculum*`) et une `string`.\
Quelle surcharge devez-vous fournir à l'opérateur pour que l'instruction compile ?\
Pensez-vous par conséquent pouvoir définir cette surcharge comme fonction-membre de `Teacher` (resp. `Curriculum`) ? 
{{% /expand %}}

{{% expand "Solution" %}}
Pour les attributs `Subject::_teachers` et `Curriculum::_subjects`, on peut utiliser respectivement un `std::set<const Teacher*>` et un `std::set<const Subject*>`.
L'insertion se fait avec `_teachers.insert(&teacher)` et `_subjects.insert(&subject)` (on récupère l'adresse de la référence pour créer un pointeur).

Pour l'opérateur d'égalité, on est obligé de définir un opérateur libre, car le premier paramètre n'est pas un `const Teacher&` (resp. `const Curriculum&`) mais un `const Teacher*` (resp. `const Curriculum*`).
On peut néanmoins le déclarer ami de `Teacher` (resp. `Curriculum`) afin d'accéder à ses attributs privés.
```cpp
class Teacher
{
public:
    ...
    friend bool operator==(const Teacher* teacher, const std::string& name)
    {
        return teacher->_name == name;
    }
    ...
};

class Curriculum
{
public:
    ...
    friend bool operator==(const Curriculum* curriculum, const std::string& name)
    {
        return curriculum->_name == name;
    }
    ...
};
```

Enfin, pour l'affichage, on peut simplement accéder aux éléments de chaque `set` en bouclant dessus et en déréférençant les pointeurs :
```cpp
class Subject
{
public:
    ...
    friend std::ostream& operator<<(std::ostream& stream, const Subject& subject)
    {
        stream << "-> Subject " << subject._name << " teached by: ";

        for (const auto* teacher : subject._teachers)
        {
            stream << *teacher << ", ";
        }

        return stream;
    }
    ...
};

class Curriculum
{
public:
    ...
    friend std::ostream& operator<<(std::ostream& stream, const Curriculum& curriculum)
    {
        stream << "Curriculum <" << curriculum._name << ">";

        for (const auto* subject : curriculum._subjects)
        {
            stream << *subject << std::endl;
        }

        return stream;
    }
    ...
};
```
{{% /expand %}}

Comme de temps en temps, les professeurs partent à la retraite, rajoutez une fonctionnalité permettant de supprimer un professeur de la base.

{{% expand "Solution" %}}
```cpp
else if (command == "r")
{
    std::string name;
    std::cin >> name;

    const auto teacher_it = std::find(teachers.begin(), teachers.end(), name);
    if (teacher_it == teachers.end())
    {
        continue;
    }

    auto* teacher = *teacher_it;
    teachers.erase(teacher_it);
    delete teacher;
}
```

{{% notice info %}}
Il ne faut pas écrire `teachers.erase(teacher_it)` suivi de `delete *teacher_it`, car `erase` invalide `teacher_it`. Il n'est donc plus valide de le déréférencer ensuite.\
Il est également déconseillé de faire l'inverse : `delete *teacher_it` suivi de `teachers.erase(teacher_it)`, car `teachers` contient alors une dangling reference, ce qui pourrait constituer une faille si quelqu'un venait rajouter du code entre ces deux lignes.\
La bonne solution est de créer une variable temporaire pour déréférencer l'itérateur avant son invalidation et libérer la mémoire seulement après avoir supprimé la référence du tableau.
{{% /notice %}}

{{% /expand %}}

Que se passe-t-il si vous essayiez d'afficher le contenu d'une matière qu'un professeur retraité enseignait ?\
Que faut-il que vous ajoutiez à la classe `Subject` pour avoir la possibilité de supprimer un professeur de la base de manière sûre ?

{{% expand "Solution" %}}
Lorsque cette situation se produit, le programme rentre dans un état instable, résultant d'un accès à de la mémoire libérée.
En effet, au moment d'afficher le contenu de la matière, on tente d'accéder à chacun des éléments de `_teachers` alors que l'un d'entre eux vient d'être détruit (= dangling reference).

Pour régler ce problème, il faudrait que `Subject` propose une fonction permettant de retirer l'un de ses professeurs, et que l'on appelle cette fonction sur toutes les matières avant de détruire le contenu de `teacher`.

Dans `Subject` :
```cpp
void remove_teacher(const Teacher& teacher)
{
    _teachers.erase(&teacher);
}
```

Dans le `main` :
```cpp
auto* teacher = *teacher_it;
for (auto* subject : subjects)
{
    subject->remove_teacher(*teacher);
}

teachers.erase(teacher_it);
delete teacher;
```

{{% /expand %}}
