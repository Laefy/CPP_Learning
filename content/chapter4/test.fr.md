---
title: "Questionnaire !"
weight: 100
---

Vous avez terminé le Chapitre 4 ! C'est donc maintenant le moment de connecter vos neurones pour répondre aux questions suivantes.\
Bon courage à vous 🙂

---

{{% test chapter=4 %}}

{{% test_item id=1 desc="class-polymorph" %}}Qu'est-ce qu'une classe polymorphe ?{{% /test_item %}}
{{% test_item id=2 lines="5" desc="poly-code" %}}Définissez une classe polymorphe `Nothing` qui ne fait rien.{{% /test_item %}}
{{% test_item id=3 lines="2" desc="abstract-class" %}}Comment représenter une classe abstraite en C++ ?{{% /test_item %}}
---
Les questions 4 à 6 font référence au code suivant :

```cpp
class A
{
public:
    virtual int  fcn1(int p1, int p2) const { return p1 * p2; }
    virtual void fcn2(const char* str) = 0;
    virtual void fcn3(bool) {}
    const char*  fcn4() { return "artichaut"; }
};

class B : A
{
public:
    int fcn1(int p1, int p2) { return p1 + p2; }

    void fcn2(const char*) override {}

    void fcn3(bool b)
    {
        if (b)
        {
            A::fcn3(b);
        }
    }
    
    const char* fcn4() { return "sopalin"; }
};

int main()
{
    A* a = new B();

    a->fcn1(1, 3);
    a->fcn2("la la la");
    a->fcn3(false);
    a->fcn4();

    return 0;
}
```

{{% test_item id=4 lines=3 desc="compile-error" %}}Le programme ci-dessus ne compile pas. Pourquoi et que faut-il faire pour le corriger ?{{% /test_item %}}
{{% test_item id=5 lines=3 desc="exec-issues" %}}En plus du problème de compilation, on peut relever trois erreurs de programmation qui pourraient générer des problèmes à l'exécution. Quelles sont-elles et que faut-il faire pour les corriger ?{{% /test_item %}}
{{% test_item id=6 lines=4 desc="called-fcns" %}}Pour chacun des appels sur `a`, indiquez quelle fonction sera appelée (`A::fcnX` ou `B::fcnX`) et justifiez. Vous considérerez que vous n'avez pas effectué les corrections de la question précédente.{{% /test_item %}}

---

Pour les questions 7 et 8, vous pouvez partir de [là](https://godbolt.org/z/nzsWWszvP) pour tester votre code.
{{% test_item id=7 lines=10 desc="some-code" %}}Définissez une classe `SharedStuff` contenant un attribut `_value` accessible uniquement depuis ses classes dérivées. Ajoutez un constructeur à 1 paramètre pour initialiser ce membre.{{% /test_item %}}
{{% test_item id=8 lines=10 desc="some-code" %}}Définissez une classe `MoreStuff` héritant de `SharedStuff` et contenant un attribut `_value2`. Définissez les fonctions nécessaires permettant d'instancier un objet de ce type, et d'afficher les valeurs de ses deux membres dans la console.{{% /test_item %}}

---

Pour les questions 9 et 10, vous pouvez partir de [là](https://godbolt.org/z/vfzzGTsTT) pour tester votre code.
{{% test_item id=9 lines=10 desc="some-code" %}}Définissez une classe `Food` contenant une fonction virtuelle pure `miam_miam`. Cette fonction doit servir à afficher le nom de l'aliment dans la console.{{% /test_item %}}
{{% test_item id=10 lines=10 desc="some-code" %}}Définissez une classe `Nutella` héritant de `Food`. Ajoutez ce qu'il faut pour rendre cette classe instanciable.{{% /test_item %}}

{{% /test %}}

