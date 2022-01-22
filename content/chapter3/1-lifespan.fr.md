---
title: "Durée de vie"
weight: 1
---
--- 

### Portée d'une variable locale

Afin de parler de durée de vie, nous allons commencer par parler de la portée de nos variables.
Comme vous le savez peut-être, la portée d'une variable définit la portion de code dans laquelle le compilateur nous permet de l'utiliser.

Si on définit une variable dans une fonction, la portée de celle-ci démarre à sa définition et se termine à la fin du bloc dans lequel celle-ci a été définie.

{{< highlight cpp "linenos=inline" >}}
 void fcn(int a)
 {
     if (a == 0)
     {
         char b = '0';
         std::cout << b << std::endl;
     }
     else
     {
         char c = '1';
         std::cout << c << std::endl;
     }
 }
{{< /highlight >}}

Dans le code ci-dessus :
- la portée de `a` démarre à la ligne 1 et termine à la ligne 13,
- la portée de `b` démarre à la ligne 5 et termine à la ligne 7,
- la portée de `c` démarre à la ligne 10 et termine à la ligne 12.

---

### Destruction d'un objet

Supposons que nous ayions une classe `Class` et que l'on déclare une variable de ce type.

Lorsque cette variable sort du scope, une fonction spéciale de `Class` est appelée.\
On appelle celle-ci le **destructeur** de l'objet.\
Le nom de cette fonction est le nom de la classe précédé d'un tilde et acceptant 0 paramètre :
```cpp
// dans le header
class Class
{
public:
    // ...
    ~Class();  // destructeur de Class.

    // ...
};

// dans le cpp
Class::~Class()
{
    // implémentation du destructeur de Class.
}
```

Comme pour le constructeur par défaut, le constructeur de copie ou l'opérateur d'assignation, le compilateur définit une implémentation par défaut du destructeur de chaque classe.\
Ainsi, même si nous n'avons jusqu'ici jamais eu à définir de destructeur pour nos classes, le destructeur existait bel et bien et était appelé à chaque fois qu'il le devait.

---

### Durée de vie d'un objet

Revenons à la notion de durée de vie.
La durée de vie d'un objet démarre de l'appel de son constructeur et termine à l'appel de son destructeur.

Lorsque l'on définit une variable locale contenant une instance d'objet, sa durée de vie correspond par conséquent à la portée de la variable dans laquelle celui-ci est placé.

{{< highlight cpp "linenos=inline" >}}
 void fcn(std::string param)                // construction de param
 {
     if (s.empty())
     {
         std::string empty = "empty";       // construction de empty
         std::cout << empty << std::endl;
     }                                      // destruction de empty
     else
     {
         std::string filled = "filled";     // construction de filled
         std::cout << filled << std::endl;
     }                                      // destruction de filled
 }                                          // destruction de param
{{< /highlight >}}

Dans le code ci-dessus :
- la portée et la durée de vie de `param` démarre à la ligne 1 et termine à la ligne 13,
- la portée et la durée de vie de `empty` démarre à la ligne 5 et termine à la ligne 7,
- la portée et la durée de vie de `filled` démarre à la ligne 10 et termine à la ligne 12.

**Qu'en est-il de la durée de vie d'un objet défini en tant qu'attribut d'une autre classe ?**

Pour le déterminer, vous allez modifier le code du programme `c3-1-box`.

Modifiez le constructeur de la classe `Box` et redéfinissez son destructeur afin qu'ils affichent `Box created` et `Box destroyed`.\
Faites de même pour `Content` et testez le programme.\
Pouvez-vous en déduire à quel moment la durée de vie de `_content` démarre, et à quel moment celle-ci termine ?

{{% expand "Solution" %}}
```cpp
struct Content
{
    Content(const std::string& name)
        : name { name }
    {
        std::cout << "Content created" << std::endl;
    }

    ~Content() { std::cout << "Content destroyed" << std::endl; }

    std::string name;
};

class Box
{
public:
    Box(const std::string& name)
        : _content { name }
    {
        std::cout << "Box created" << std::endl;
    }

    ~Box() { std::cout << "Box destroyed" << std::endl; }
    
    Content& get_content() { return _content; }

private:
    Content _content { "thing" };
};
```

On obtient la sortie suivante :
```b
box1 block begin
Content created
Box created
Box destroyed
Content destroyed
----------------
box2 block begin
Content created
Box created
Box destroyed
Content destroyed
box2 block end
```

On peut en déduire que `Box::_content` :\
\- est construit pendant l'appel du constructeur de `Box`, juste avant de rentrer dans le corps de la fonction,\
\- est détruit pendant l'appel du destructeur `Box`, juste après être sorti du corps de la fonction.
{{% /expand %}}

---

### Validité d'un objet

La durée de vie d'un objet détermine la période durant laquelle il est valide d'utiliser cet objet et son contenu.

En C++, il est possible de créer des objets dynamiquement avec les mots-clefs `new` et `delete`.\
Testez le code suivant et déterminez les durées de vie des objets `box` et `box->_content` à partir de l'output du programme.
{{< highlight cpp "linenos=inline" >}}
 int main()
 {
     std::cout << "Main begin" << std::endl;
 
     Box* box = new Box("gift");
     std::cout << box->get_content().name << std::endl;
     delete box;
 
     std::cout << "Main end" << std::endl;
     return 0;
 }
{{< /highlight >}}

{{% expand "Solution" %}}
```b
Main begin
Content created
Box created
gift
Box destroyed
Content destroyed
Main end
```

Les durées de vie des objets `box` et `box->_content` démarrent à la ligne 5 (`new`) et s'achèvent à la ligne 7 (`delete`).
{{% /expand %}}

Analysez maintenant le code ci-dessous.\
Quelle est selon vous la durée de vie de la variable `content` ?
{{< highlight cpp "linenos=inline" >}}
 int main()
 {
     std::cout << "Main start" << std::endl;
 
     Box* box        = new Box("gift");
     Content content = box->get_content();
 
     std::cout << content.name << std::endl;
 
     delete box;
 
     content.name = "chocolate";
     std::cout << content.name << std::endl;
 
     std::cout << "Main end" << std::endl;
     return 0;
 }
{{< /highlight >}}

Testez le code pour vérifier ce qu'il se passe réellement.

Pour mieux comprendre, vous allez redéfinir le constructeur de copie de `Content` afin qu'il affiche `Content copied`.
Combien d'objets de type `Content` ont donc été créés par le programme précédent ? Quelles étaient leurs durées de vie respectives ?

{{% expand "Solution" %}}
```b
Main start
Content created
Box created
Content copied
gift
Box destroyed
Content destroyed
chocolate
Main end
Content destroyed
```

Deux objets de type `Content` ont été créés par le programme.\
La durée de vie du premier, `box->_content`, démarre à la ligne 5 (construction de `*box`) et termine à la ligne 10 (destruction de `*box`).\
La durée de vie du second, `content`, démarre à la ligne 6 (copie de `box->_content`) et termine à la ligne 17 (sortie du `main`).
{{% /expand %}}

Analysez enfin le code suivant.\
Quelle est maintenant la durée de vie de `content_ref` ? A votre avis, que peut-il se passer lors de l'exécution de la ligne 12 ?\
Commentez ensuite la ligne 12 et retestez une dernière fois le programme.
{{< highlight cpp "linenos=inline" >}}
 int main()
 {
     std::cout << "Main start" << std::endl;
 
     Box* box             = new Box("gift");
     Content& content_ref = box->get_content();
 
     std::cout << content_ref.name << std::endl;
 
     delete box;
 
     content_ref.name = "chocolate";
     std::cout << content_ref.name << std::endl;
 
     std::cout << "Main end" << std::endl;
     return 0;
 }
{{< /highlight >}}

{{% expand "Solution" %}}
Comme `content_ref` est une référence, la variable correspond au même objet que `box->_content`.
Sa durée de vie s'étend donc de la ligne 5 à la ligne 10 du programme.

De mon côté, le programme déclenche forcément une segfault.\
Lorsque la ligne 12 est commentée, le programme crashe sur la ligne 13 (accès à `content_ref.name`) et lorsqu'elle est décommenté, il crashe à la sortie du programme.

En réalité, on est dans une situation qualifiée d'**undefined behavior**.
Le comportement exact du programme dépendra donc de votre compilateur et de la manière dont votre système d'exploitation gère les accès mémoire.
{{% /expand %}}


Les différents tests effectués nous permettent de conclure les points suivants.\
Tant qu'on manipule des objets via des variables qui ne sont pas des références, ces objets existent forcément au moment de l'utilisation et il n'y a aucun risque d'avoir un problème.\
En revanche, dès lors que l'on manipule des objets via des références, il est nécessaire d'être prudent, car la portée de la variable ne correspondra pas nécessairement à la durée de vie de l'objet référencé.

---

### Lien avec la mémoire

La durée de vie d'un objet est étroitement liée à la mémoire du programme.

Lorsqu'on construit un objet dynamiquement, le programme demande au système d'exploitation de réserver une zone dans la mémoire qui servira à contenir les données de l'objet.
Lorsque cet objet est détruit, le programme rend la mémoire au système, qui pourra la réattribuée à un autre processus.
Pour éviter de corrompre les données des autres programmes, le système devrait empêcher votre programme d'aller écrire dans de la mémoire libérée en déclenchant une segfault.

C'est donc pour cette raison que l'on peut considérer que la durée de vie de l'objet définit la région du code dans laquelle il est valide de l'utiliser.
