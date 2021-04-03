---
title: "Assertions"
weight: 1
---

---

### Types d'erreurs

Lorsqu'une erreur se produit dans un logiciel, il s'agit soit d'une erreur de programmation, soit d'une erreur d'utilisation du logiciel.

Voici quelques exemples :
1. Un pointeur null a été déréférencé : erreur de programmation.
2. Le programme a demandé à l'utilisateur de rentrer une image, mais celui-ci a fournit un fichier texte : erreur d'utilisation.
3. On a écrit dans la case `array.size()` de `array` : erreur de programmation.
4. L'utilisateur a entraîné "-34" alors que le programme attendait un entier positif : erreur d'utilisation.
5. On a inversé une condition dans un `if`, ce qui fait que le résultat n'était pas le bon : erreur de programmation.

Qu'il s'agisse d'une erreur de programmation ou d'une erreur d'utilisation, le programme peut parfois entrer dans un état instable.
Si on est chanceux, il va crasher immédiatement.
Si on n'est moins chanceux, on peut se retrouver avec un crash à l'autre bout du programme (le cauchemar de l'écrasement mémoire 😱), ou encore un bug qui semble n'avoir aucun rapport avec l'erreur d'origine, et qui n'arrive qu'une fois tous les 3 mois, quand les planètes sont alignées.

Afin d'éviter ce genre de déboires, il est nécessaire de détecter les erreurs le plus tôt possible pour adapter le comportement du programme.

Dans le cas des erreurs de programmation, on interrompera son exécution immédiatement.
Si possible, on essayera de fournir des détails sur l'origine du problème (nom du fichier, numéro de ligne, instruction, raison du crash, ...).

Et dans le cas des erreurs d'utilisation, on indiquera à l'utilisateur avec un joli message d'erreur ce qu'il a mal fait, et comment il aurait dû le faire.
On essayera aussi de faire en sorte que le programme puisse continuer son exécution normalement. 

---

### Qu'est-ce qu'une assertion ?

Une assertion est une expression qui doit toujours être évaluée à vraie.

En C++, le but des assertions, c'est de faire crasher brutalement le programme si une condition n'est pas respectée, afin d'éviter que des problèmes plus difficiles à identifier ne se manifestent par la suite.
```cpp
void AnimalCenter::adopt_dog(Someone& someone)
{
    // If you don't like dogs, then you shouldn't end up here!
    assert(someone.like_dog());

    someone.receive(_dogs.front());
    _dogs.pop_front();
}
```

Comme on l'a dit plus haut, seules les erreurs de programmation sont censées entraîner la fin du programme.
Les assertions vont donc servir à identifier ce type d'erreurs, pour aider les programmeurs à corriger les failles de leur programme.

Normalement, une fois la phase de production et de debug d'un logiciel terminée, plus aucune assertion n'est censée échouée.
Puisqu'il n'est pas nécessaire d'évaluer des conditions supposées être toujours vraies, les assertions sont du coup généralement désactivées avant de déployer le programme chez le client.
Cela permet de gagner en performances.

{{% notice info %}}
Il ne faut **jamais** utiliser des assertions pour traiter des erreurs d'utilisation.
Personne n'a envie de voir son logiciel crasher juste avant la sauvegarde d'un document, parce qu'il a essayé de mettre un accent dans le nom du fichier, ou parce que le disque dur était plein.
En plus, comme les assertions sont désactivées une fois le logiciel déployé, votre client risque de se retrouver avec des bugs que vous n'aurez jamais rencontrés.
{{% /notice %}}

---

### Comment asserter ?

En C++, il est possible d'utiliser la macro `assert` disponible dans le header `<cassert>`.

---

##### Utilisation de `assert`

Celle-ci prend en paramètre une condition.
Si elle est évaluée à vraie, alors le programme continue.
Autrement, le programme est interrompu et un message d'erreur est affiché.
Ce dernier présente le contenu de l'assertion, le chemin du fichier et le numéro de la ligne où elle est écrite.   

```cpp
class Class
{
public:
    void initialize(unsigned int p1, unsigned int p2)
    {
        // On peut vérifier la validité des paramètres qu'on nous donne (IllegalArgumentException en Java).
        assert(p1 < p2 && p2 < 100);

        // On peut aussi vérifier les pré-conditions de la fonction courante (IllegalStateException en Java).
        assert(!_attr.is_valid()); // on n'est pas censé appeler Class::initialize() si _attr est déjà valide. 

        // On peut également vérifier les post-conditions d'une fonction que l'on appelle.
        _attr.set_params(p1, p2);
        assert(_attr.is_valid()); // _attr.set_params() est censé rendre _attr valid. 
    }

    void process(std::unique_ptr<int> value)
    {
        // Paramètre
        assert(value != nullptr); // On attend un pointeur non-null.

        // Pré-condition de Class::process
        assert(_attr.is_valid()); // Class::process() ne doit pas être appelée si _attr n'est pas valide. 

        // Post-condition de _attr::process
        _attr.process(std::move(value));
        assert(_attr.is_valid()); // _attr.process() n'est pas censé modifier la validité de _attr.
    }

private:
    Attr _attr;
};

class Square
{
public:
    void do_stuff(...)
    {
        // On peut également vérifier les invariants d'une classe.
        assert(all_segments_have_same_length());
        do_some_stuff();
        assert(all_segments_have_same_length());
        do_some_other_stuff();
        assert(all_segments_have_same_length());
    }

private:
    bool all_segments_have_same_length() const { return ...; }

    std::array<Point, 4> _points;  
};
```

{{% notice note %}}
La [programmation par contrat](https://fr.wikipedia.org/wiki/Programmation_par_contrat) est un paradigme qui consiste à vérifier tout un tas d'assertions au cours de l'exécution d'un programme pour s'assurer qu'il est bien dans l'état attendu.
Un mécanisme de programmation par contrat aurait dû être introduit nativement dans le langage en C++20, mais cela n'a finalement pas eu lieu.
Pour l'instant, les macros de type `assert` restent donc l'outil standard pour essayer de programmer par contrat en C++.    
{{% /notice %}}


Comme `assert` n'est pas très verbeux, il est possible d'ajouter `&& "un message"` au contenu de l'assertion.
Si la condition est vérifiée, alors `&& "un message"` ne changera rien, car une chaîne de caractères convertie en `bool` vaut forcément `true`. 
Et si l'assertion échoue, la condition complète sera affichée dans le message d'erreur. 
```cpp
// Si l'assertion échoue, on aura comme message :
// Assertion failed: _attr_.is_valid() && "you probably need to call Initialize() function", file ###.cpp, line ### 
assert(_attr_.is_valid() && "you probably need to call initialize() function");
```

---

##### Désactivation en Release

Il faut savoir que lorsque la constante `NDEBUG` est définie, la macro `assert` ne fait plus rien.
En particulier, son contenu n'est plus évalué.
Ce système permet donc de désactiver les assertions en release.

```cpp
#define NDEBUG

#include <cassert>
#include <iostream>

void this_will_never_be_called()
{
    std::cout << "You can't see me... I'm a shadow..." << std::endl;
}

int main()
{
    assert(this_will_never_be_called());
    return 0;
}
```

{{% notice warning %}}
Attention à ne pas appeler n'importe quelle fonction à l'intérieur d'un `assert`.
Par exemple, si vous écrivez quelque chose comme `assert(my_set.insert(value))`, soyez bien conscient que l'insertion n'aura lieu que si vous êtes en mode debug. 
{{% /notice %}}

{{% notice tip %}}
Il n'est pas nécessaire d'écrire `#define NDEBUG` dans tous les fichiers lorsqu'on veut passer en Release.
Des arguments peuvent être fournis à la commande de compilation pour définir des constantes (`gcc -c *.cpp -o program -DNDEBUG`) sans avoir à changer les sources.
D'ailleurs, par défaut, CMake ajoute tout seul `-DNDEBUG` à la ligne de commande de la build Release.
{{% /notice %}}

---

##### Redéfinir son propre assert

Si vous trouvez que `assert` ne vous donne pas suffisamment d'informations, vous pouvez tout à fait définir votre propre macro d'assertion.
Par exemple, celle-ci vous permettra d'afficher le contenu d'une variable :

```cpp
#ifndef NDEBUG

#define super_assert(cdn, msg)                                                  \
    if (!cdn)                                                                   \
    {                                                                           \
        std::cerr << "Assertion failed: " << #cdn                               \
                  << "\nLocation: " << __FILE__ << " (ln." << __LINE__ << ")"   \
                  << "\nReason: " << msg                                        \
                  << std::endl;                                                 \
        std::terminate();                                                       \
    }

#else
#define super_assert(cdn, msg) ;
#endif

void fcn(int value)
{
    super_assert(value > -100 && value < 100, value);
    ...
};
```
