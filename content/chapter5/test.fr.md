---
title: "Questionnaire !"
weight: 100
---

C'est l'heure du test ! Bon courage 🙂

---

{{% test chapter=5 %}}

{{% test_item id=1 lines="1" desc="raw pointer" %}}Quel est la responsabilité du propriétaire d'une ressource.{{% /test_item %}}
{{% test_item id=2 lines="2" desc="raw pointer" %}}Quelles sont les deux raisons pour lesquelles il faut utiliser des smart pointers plutôt que des raw pointers lorsqu'on veut exprimer la notion d'ownership ?{{% /test_item %}}
{{% test_item id=3 lines="3" desc="raw pointer" %}}Quels sont les trois smart pointers proposés par la STL ? A quoi sert chacun d'entre eux ?{{% /test_item %}}
{{% test_item id=4 lines="2" desc="raw pointer" %}}En C++ moderne, dans quelle(s) situation(s) est il valide d'utiliser raw pointer ?{{% /test_item %}}
{{% test_item id=5 lines="1" desc="raw pointer" %}}Quelle fonction de la STL permet de déplacer un objet plutôt que de le copier ?{{% /test_item %}}

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
            delete _objects;
        }
    }

    ...

private:
    std::vector<Object*> _objects;
};
```

{{% test_item id=6 lines="1" desc="abstract-class" %}}`SomeObjects` est-elle propriétaire des éléments contenus dans `_objects` ?{{% /test_item %}}
{{% test_item id=7 lines="7" desc="abstract-class" %}}Si vous vouliez que `SomeObjects` soit propriétaire du contenu de `_objects`, comment pourriez-vous réécrire le code plus clairement ?{{% /test_item %}}
{{% test_item id=8 lines="7" desc="abstract-class" %}}Même question si vous vouliez que `SomeObjects` ne soit pas propriétaire du contenu de `_objects`.{{% /test_item %}}

---

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
    // Destroys the resource named 'name'. Does nothing if not found.S
    void remove_resource(std::string_view name);

    // Takes the ownership of an existing resource.
    void acquire_resource(? resource);
    // Transfers the ownership of the resource named 'name' to the caller.
    // Return 'nothing' if not found.
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

{{% test_item id=9 lines="1" desc="abstract-class" %}}Quel peut être le type de `_resources` ?{{% /test_item %}}
{{% test_item id=10 lines="3" desc="abstract-class" %}}Implémentez le contenu de `add_resource`.{{% /test_item %}}
{{% test_item id=11 lines="5" desc="abstract-class" %}}Implémentez le contenu de `remove_resource` en utilisant `find_resource`.{{% /test_item %}}
{{% test_item id=12 lines="3" desc="abstract-class" %}}Remplacez `?` dans la déclaration de `acquire_resource` et implémentez la fonction.{{% /test_item %}}
{{% test_item id=13 lines="5" desc="abstract-class" %}}Remplacez `?` dans la déclaration de `yield_resource` et implémentez la fonction.{{% /test_item %}}
{{% test_item id=14 lines="5" desc="abstract-class" %}}Remplacez `?` dans la déclaration de `get_resource` et implémentez la fonction.{{% /test_item %}}
{{% /test %}}
