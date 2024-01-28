---
title: "Questionnaire ☑"
weight: 100
---

{{% test chapter=3 %}}

{{% test_item lines=3 %}}
Quels sont les avantages et les inconvénients de la pile par rapport du tas ?
{{% /test_item %}}

{{% test_item %}}
A quoi sert le mot-clef `delete[]` ?
{{% /test_item %}}

{{% test_item %}}
Quels sont les deux événements qui délimitent la durée de vie d'une donnée ?
{{% /test_item %}}

{{% test_item %}}
Qu'est-ce qu'une dangling-reference ?  
Donnez un exemple de situation dans lequel on peut en avoir une.
{{% /test_item %}}

---

Les prochaines questions font référence au code suivant :
```cpp
class Toto
{
public:
    Toto(int v1)
        : _v4(_v3), _v1(v1), _v2(_v5)
    {
        _v3 = 3;
    }

private:
    int _v1 = 1;
    int _v2 = 2;
    int _v3;
    int _v4 = 4;
    int _v5 = 5;
}
```

{{% test_item %}}
Dans quel ordre sont instanciés les attributs de la classe ?
{{% /test_item %}}

{{% test_item %}}
Quelles sont leurs valeurs après la construction d'une instance de `Toto` ?
{{% /test_item %}}

---

```cpp
class Dictionary
{
public:
    void add_definition(std::string word, std::string definition)
    {
        _definitions_by_words[word].emplace_back(definition);
    }

    std::vector<std::string> get_definitions(std::string word) const
    {
        return _definitions_by_words[word];
    }

    std::string get_first_definition(std::string word) const
    {
        auto it = _definitions_by_words.find(word);
        if (it != _definitions_by_words.end())
        {
            auto found_definitions = it->second;
            if (found_definitions.empty())
            {
                return found_definitions.front();
            }
        }

        auto default_value = std::string { "No definition found for " } + word;
        return default_value;
    }

private:
    std::map<std::string, std::vector<std::string>> _definitions_by_words;
};
```

{{% test_item lines=10 %}}
Réécrivez les fonctions-membres de la classe `Dictionary` de manière à éliminer les copies inutiles.  
(N'hésitez pas à aller voir la documentation de `map` si vous ne comprenez pas ce que font certaines instructions)
{{% /test_item %}}

---

Les prochaines questions concernent le code suivant :
```cpp
struct Person
{
    std::string name;
};

struct Dog
{
    std::string name;
    Person& human
};

int main()
{
    auto jean = Person { "Jean" };
    auto attila = Dog { "Attila", jean };
    auto people = std::vector<Person*> { &jean, new Person { "Pierre" } };
    return 0;
}
```

{{% test_item %}}
Qui own `jean` ?
{{% /test_item %}}

{{% test_item %}}
Qui own `attila` ?
{{% /test_item %}}

{{% test_item %}}
Qui own `attila.human` ?
{{% /test_item %}}

{{% test_item %}}
Qui own `attila.name` ?
{{% /test_item %}}

{{% test_item lines=3 %}}
`people[0]` et `people[1]` sont-ils plutôt des pointeurs ownants ou observants ?  
Justifiez.
{{% /test_item %}}

{{% test_item %}}
Quel problème associé à la mémoire peut-on relever dans ce code ? 
{{% /test_item %}}

{{% /test %}}
