---
title: "Destructeur 💣"
weight: 4
---

Si le constructeur est la fonction qui permet de définir ce qu'il se passe lorsqu'un objet est instancié, vous vous doutez probablement que le **destructeur** est la fonction qui permet de définir ce qu'il se passe lorsqu'un objet est "désinstancié".

Sur cette page, nous vous expliquerons d'abord où se produit la **désinstanciation** d'un objet, et nous vous montrerons ensuite comment définir son destructeur.

---

### Désinstanciation, kesako ??

La désinstanciation, c'est tout simplement le contraire de l'instanciation.
Encore faut-il comprendre ce que signifie "instanciation"... 😵

L'instanciation d'un objet (ou d'une variable), c'est la création de cet objet :
1. On prend un bout de mémoire (déjà allouée au programme), et on décide que ce morceau de mémoire servira à stocker les données associées à l'objet (= allocation de la mémoire à l'objet).
2. On initialise le contenu de l'objet. Il faut initialiser les valeurs des attributs, mais il faut aussi parfois réserver des ressources supplémentaires. Par exemple, `std::string` doit allouer de la mémoire dynamiquement pour pouvoir stocker les caractères de la chaîne, et `std::fstream` doit demander à l'OS d'ouvrir un fichier.

La désinstanciation, c'est le processus inverse.
1. On libère les ressources réservées par l'objet au cours de sa vie.
2. On indique que le bloc de mémoire qui servait à stocker les données de l'objet peut maintenant être réutilisé pour autre chose.

En C++, une variable est instanciée à sa définition, et elle est désinstanciée à la sortie du bloc dans lequel elle a été définie :
```cpp
int fcn()
{
    auto str = std::string {};      // <- instanciation de str
    std::cin >> str;
    return str.length();
}                                   // <- désinstanciation de str

int main()
{
    for (int i = 0; i < 5; ++i)     // <- instanciation de i
    {
        int n = i * 3;              // <- instanciation de n
        std::cout << n << std::endl;
    }                               // <- désinstanciation de n (à la fin de chaque itération)
                                    // <- désinstanciation de i (à la fin de la boucle)

    return 0;
}
```

Dans le cas d'un objet, la désinstanciation entraîne l'appel de son **destructeur**.

---

### Il est temps de mourir, Batman !

Le rôle premier du destructeur est de libérer les ressources allouées par l'objet depuis son instanciation (par exemple, libération de buffers mémoire, fermeture de fichiers, fermeture de connexions réseaux, etc).  
Mais nous allons voir que nous pouvons bien faire tout ce dont on a envie dans un destructeur.

Commençons par la syntaxe :
```cpp
class ClassName
{
public:
    ~ClassName()
    {
        // some code supposed to release resources
    }
};
```

Comme pour les constructeurs, le destructeur n'a pas de type de retour.
Il a pour identifiant le nom de la classe précédé par `~` et surtout, il ne prend **aucun paramètre**.  
En effet, comme ce n'est pas vous qui appelez le destructeur, mais le compilateur qui le fait automatiquement, il ne saurait pas quoi donner comme arguments s'il en fallait.

{{% notice note %}}
Comme le destructeur ne prend aucun paramètre, il n'a qu'une seule signature possible, et il ne peut donc exister qu'une seule version de destructeur par classe.
{{% /notice %}}

1. Ouvrez le fichier `chap-02/3-destructor.cpp` et ajoutez un destructeur à la classe `Person`.  
A l'intérieur, ajoutez une instruction qui affichera, dans le cas de Batman, `"Bruce Wayne died at 23 years old"`.

{{% hidden-solution %}}
Dans le destructeur, on peut parfaitement faire appel aux autres fonctions-membre de la classe.  
Ici, on utilise `get_full_name()` pour éviter de dupliquer le code de la concaténation de chaînes.

```cpp
class Person
{
public:
    ...

    ~Person()
    {
        std::cout << get_full_name() << " died at " << _age << " years old" << std::endl;
    }

    ...
};
```
{{% /hidden-solution %}}

2. Compilez et testez le programme.  
Vous pourrez constater que je ne vous ai pas raconté de salades concernant le moment de l'appel au destructeur.

---

### Destruction en cascade

1. Définissez maintenant une classe `Batmobile`, qui aura un attribut `_batman` de type `Person`.  
Vous initialiserez ce champs au moyen d'un class-initializer avec les arguments `"Bruce"` et `"Wayne"`.  
Petite question au passage, pourquoi ne pouvez-vous pas définir la classe `Batmobile` avant la classe `Person` ?

{{% hidden-solution %}}
Il faut forcément définir la classe `Batmobile` après la classe `Person`, car le compilateur a besoin de connaître la classe `Person` pour compiler la définition de l'attribut `_batman`.

```cpp
class Batmobile
{
private:
    Person _batman { "Bruce", "Wayne" };
};
```
{{% /hidden-solution %}}

1. Ajoutez un destructeur à `Batmobile` qui affiche la phrase suivante : `"The Batmobile has been destroyed!"`.  
Remplacez ensuite le contenu du `main` par :
```cpp
int main()
{
    {
        Batmobile batmobile;
    }

    std::cout << "After block" << std::endl;
    return 0;
}
```

Pouvez-vous prédire ce que le programme va afficher ?

{{% hidden-solution %}}
On pense bien à définir le destructeur dans la partie publique de la classe, sinon, il ne peut pas être appelé dans le `main`.
```cpp
class Batmobile
{
public:
    ~Batmobile()
    {
        std::cout << "The Batmobile has been destroyed!" << std::endl;
    }

private:
    Person _batman { "Bruce", "Wayne" };
};
```

Le programme affiche les lignes suivantes :
```b
"The Batmobile has been destroyed!"
"Bruce Wayne died at 23 years old"
```
{{% /hidden-solution %}}

On constate que le destructeur de `Person` est appelé juste après l'exécution du corps du destructeur de `Batmobile`.

En réalité, le destructeur ne se limite pas aux instructions que vous avez écrites entre les `{}`.  
Il procède également à la désinstanciation des attributs de la classe, et comme nous l'avons vu à la partie précédente, cela entraîne l'appel au destructeur de chacun d'entre eux.

La destruction d'un objet entraîne donc récursivement la destruction de chacun de ses attributs.

```cpp {hl_lines=[9,25,35]}
class Person
{
public:
    ...

    ~Person()
    {
        std::cout << get_full_name() << " died at " << _age << " years old" << std::endl;
    } // <- désinstanciation de _age, _surname et _name

    ...

private:
    std::string  _name;
    std::string  _surname;
    unsigned int _age = 0u;
};

class Batmobile
{
public:
    ~Batmobile()
    {
        std::cout << "The Batmobile has been destroyed!" << std::endl;
    } // <- désinstanciation de _batman

private:
    Person _batman { "Bruce", "Wayne" };
};

int main()
{
    {
        Batmobile batmobile;
    } // <- désinstanciation de batmobile

    std::cout << "After block" << std::endl;
    return 0;
}
```

---

### Implémentation par défaut

Supprimez le destructeur de `Batmobile`.  
Que va-t-il se passer à l'exécution ?

{{% hidden-solution %}}
Le programme affiche maintenant :
```b
"Bruce Wayne died at 0 years old"
```

Le destructeur de `Person` est donc appelé, même si il n'y a plus le code du destructeur de `Batmobile`.
{{% /hidden-solution %}}

Encore une fois, si on ne définit pas explicitement de destructeur, le compilateur en produit un pour nous : on parle d'**implémentation par défaut du destructeur**.  
A l'exécution, celui-ci se contente de désinstancier les attributs de la classe.

---

### Synthèse

- Le contraire de l'**instanciation** est la **désinstanciation**.
- La désinstanciation d'un objet provoque l'appel à son **destructeur**, qui se définit avec `~ClassName() { ... }`.
- Une variable locale est désinstanciée lorsqu'on sort du bloc dans lequel elle est définit.
- Un attribut est désinstancié lorsque le destructeur de la classe est appelé.
- Si on ne définit pas explicitement le destructeur d'une classe, le compilateur génère l'**implémentation par défaut** du destructeur.
