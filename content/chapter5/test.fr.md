---
title: "Questionnaire !"
weight: 100
---

C'est l'heure du test ! Bon courage 🙂

---

{{% test chapter=5 %}}

{{% test_item id=1 lines="1" desc="resp-owner" %}}Quel est la responsabilité du propriétaire d'une ressource ?{{% /test_item %}}
{{% test_item id=2 lines="2" desc="why-smart" %}}Quelles sont les deux raisons pour lesquelles il faut utiliser des smart pointers plutôt que des raw pointers lorsqu'on veut exprimer la notion d'ownership ?{{% /test_item %}}
{{% test_item id=3 lines="3" desc="3-smarts" %}}Quels sont les trois smart pointers proposés par la STL ? A quoi sert chacun d'entre eux ?{{% /test_item %}}
{{% test_item id=4 lines="2" desc="raw-ptr-use" %}}En C++ moderne, dans quelle(s) situation(s) est il valide d'utiliser un raw pointer ?{{% /test_item %}}
{{% test_item id=5 lines="1" desc="move-not-copy" %}}Quelle fonction de la STL permet de déplacer un objet plutôt que de le copier ?{{% /test_item %}}

---

```cpp
class SomeObjects
{
public:
    SomeObjects(std::vector<Object*> objects)
        : _objects { objects }
    {}

    ~SomeObjects()
    {
        for (auto* obj: _objects)
        {
            delete obj;
        }
    }

    ...

private:
    std::vector<Object*> _objects;
};
```

{{% test_item id=6 lines="1" desc="is-owner" %}}`SomeObjects` est-elle propriétaire des éléments contenus dans `_objects` ?{{% /test_item %}}
{{% test_item id=7 lines="7" desc="as-owner" %}}Si vous vouliez que `SomeObjects` soit propriétaire du contenu de `_objects`, comment pourriez-vous réécrire le code plus clairement ?{{% /test_item %}}
{{% test_item id=8 lines="7" desc="as-non-owner" %}}Même question si vous vouliez que `SomeObjects` ne soit pas propriétaire du contenu de `_objects`.{{% /test_item %}}

---

Pour les questions 9 à 14 :\
La classe `ResourceHolder` sert à gérer les durées de vie des ressources qu'elle contient.
On suppose que dans le programme, une ressource n'a besoin que d'un seul propriétaire à chaque instant.  

```cpp
struct Resource
{
    Resource(std::string_view name)
        : _name { name }
    {}

    std::string _name;
};

// Manages the lifetime of a group of Resources.
// Also provides access to these Resources.
class ResourceHolder
{
public:
    // Creates a new resource.
    void add_resource(std::string_view name);
    // Destroys the resource named 'name'. Does nothing if not found.
    void remove_resource(std::string_view name);

    // Takes the ownership of an existing resource.
    void acquire_resource(? resource);
    // Transfers the ownership of the resource named 'name' to the caller.
    // Return an appropriated representation of 'nothing' if not found.
    ? yield_resource(std::string_view name);

    // Provides access to the resource named 'name'.
    ? get_resource(std::string_view name) const;

private:
    using iterator = ...;
    using const_iterator = ...;

    // Returns an iterator on the resource with the given name.
    iterator find_resource(std::string_view name);
    const_iterator find_resource(std::string_view name) const;

    ? _resources;
};
```

{{% test_item id=9 lines="1" desc="resources-type" %}}Quel peut être le type de `_resources` ?{{% /test_item %}}
{{% test_item id=10 lines="3" desc="add_resource" %}}Implémentez le contenu de `add_resource`.{{% /test_item %}}
{{% test_item id=11 lines="5" desc="remove_resource" %}}Implémentez le contenu de `remove_resource` en utilisant `find_resource`.{{% /test_item %}}
{{% test_item id=12 lines="3" desc="acquire_resource" %}}Remplacez `?` dans la déclaration de `acquire_resource` et implémentez la fonction.{{% /test_item %}}
{{% test_item id=13 lines="5" desc="yield_resource" %}}Remplacez `?` dans la déclaration de `yield_resource` et implémentez la fonction.{{% /test_item %}}
{{% test_item id=14 lines="5" desc="get_resource" %}}Remplacez `?` dans la déclaration de `get_resource` et implémentez la fonction.{{% /test_item %}}
{{% /test %}}
