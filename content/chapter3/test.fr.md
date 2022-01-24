---
title: "Questionnaire !"
weight: 100
---

C'est l'heure du test ! Bon courage 🙂

---

{{% test chapter=3 %}}

{{% test_item id=1 lines="1" desc="lifespan" %}}Comment définir la période de validité d'un objet ?{{% /test_item %}}
{{% test_item id=2 lines="2" desc="unique_ptr" %}}Citez une bonne raison d'allouer de la mémoire via un `unique_ptr` plutôt que via un pointeur simple (avec `new`).{{% /test_item %}}
{{% test_item id=3 lines="1" desc="transfert" %}}Quelle fonction de la librarie standard permet de transférer le contenu d'un objet dans un autre ?{{% /test_item %}}

---

```cpp
class A
{
public:
    ...

private:
    B&                 _b;
    const C&           _c;
    D                  _d;
    std::unique_ptr<E> _e;
};

int main()
{
    A a;
    return 0;
}
```

{{% test_item id=4 lines="1" desc="owner" %}}De quel(s) objet(s) `a` est-il propriétaire parmis `a._b`, `a._c`, `a._d` et `a._e` ?{{% /test_item %}}
{{% test_item id=5 lines="2" desc="owner-trv" %}}`a` est-il propriétaire de `*a._e` ? Justifiez.{{% /test_item %}}

---

Les questions 6 à 10 font référence au code ci-dessous :

```cpp
#include <memory>
#include <string>
#include <vector>

struct Resource
{
    Resource(const std::string& content)
        : _content { content }
    {}

    std::string _content;
};

// Index objects of type Resource and handle their lifespans.
class ResourceManager
{
public:
    // Create a new resource.
    // Return the index where the resource was created.
    size_t create(const std::string& content);

    // Destroy the resource at the given index.
    // The other elements keep the same index, we do not reorganize the array.
    void destroy(size_t index);

    // Take the ownership of an existing resource.
    // Return the index where the resource was placed.
    size_t acquire(std::unique_ptr<Resource> resource);

    // Transfer the resource at the given index to the caller.
    std::unique_ptr<Resource> yield(size_t index);

    // Provide access to the resource at the given index.
    Resource& get(size_t index) const;

private:
    std::vector<std::unique_ptr<Resource>> _resources;
};
```
Pensez à implémenter vos fonctions dans GodBolt pour vous assurez qu'elles compilent avant de soumettre le questionnaire. 

{{% test_item id=6 lines="3" desc="create" %}}Implémentez le contenu de `create`.{{% /test_item %}}
{{% test_item id=7 lines="3" desc="destroy" %}}Implémentez le contenu de `destroy`.{{% /test_item %}}
{{% test_item id=8 lines="3" desc="acquire" %}}Implémentez le contenu de `acquire_resource`.{{% /test_item %}}
{{% test_item id=9 lines="3" desc="yield" %}}Implémentez le contenu de `yield`.{{% /test_item %}}
{{% test_item id=10 lines="3" desc="get" %}}Implémentez le contenu de `get`.{{% /test_item %}}
{{% /test %}}
