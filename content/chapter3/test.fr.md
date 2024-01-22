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

{{% /test %}}
