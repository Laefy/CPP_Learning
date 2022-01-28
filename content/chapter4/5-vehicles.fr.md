---
title: "🚗 Véhicule partagé"
weight: 5
---

Pour terminer ce chapitre, nous allons voir comment faire pour accéder directement aux attributs de votre classe de base,
comment appeler la fonction parent depuis la rédéfinition de cette fonction dans la classe-fille et enfin, comment modéliser des classes abstraites.

---

Pour cet exercice, vous modifierez les fichiers :\
\- `chap-04/3-vehicles/Program.cpp`\
\- `chap-04/3-vehicles/Vehicle.h`\
\- `chap-04/3-vehicles/Car.h`\
\- `chap-04/3-vehicles/Scooter.h`

La cible à compiler est `c4-3-vehicles`.

---

### Introduction du permis

Dans le programme que l'on vous fournit, n'importe qui peut conduire n'importe quoi.
Mais avec les nouvelles régulations, les conducteurs de voiture doivent maintenant être un possession d'un permis B pour rouler.

Modifiez la classe `Driver` de manière à pouvoir savoir si un conducteur à passer son permis ou non.
A la construction, aucun conducteur n'a son permis et il peut l'obtenir ensuite via une fonction `pass_car_licence_exam`.

{{% expand "Solution" %}}
```cpp
class Driver
{
public:
    void pass_car_licence_exam()
    {
        _has_car_licence = true; 
    }

    bool has_car_licence() const
    {
        return _has_car_licence;
    }

private:
    bool _has_car_licence = false;
};
```
{{% /expand %}}

Il va maintenant falloir que vous utilisiez cette fonction depuis `Car`.
Le problème, c'est que `_driver` n'est accessible que depuis `Vehicle`, car c'est un attribut privé.
Afin de pouvoir y accéder depuis les sous-classes, changez sa visibilité à `protected`.

Modifiez ensuite l'implémentation de `Car::drive`, de façon à ce que si le conduteur n'ait pas son permis, la voiture n'avance pas.

{{% expand "Solution" %}}
```cpp
class Vehicle
{
public:
    ...

protected:
    const Driver& _driver;
};

class Car : public Vehicle
{
    ...

    unsigned int drive() const override
    {
        if (_driver.has_car_licence())
        {
            std::cout << "Vrooooom!" << std::endl;
            return _speed;
        }
        else
        {
            std::cerr << "No car licence detected..." << std::endl;
            return 0u;
        }
    }
    
    ...
};
```
{{% /expand %}}

---

### Voiture volante

La nouvelle mode maintenant, ce sont les voitures volantes.
Les voitures volantes ont toutes les fonctionnalités des voitures normales, si ce n'est que lorsque vous rouler en l'air, vous allez 10x plus vite qu'en roulant au sol.

Introduisez la classe `FlyingCar`, dérivée de `Car`, et redéfinissez sa fonction `drive` pour parcourir 10 fois la distance que vous auriez parcouru avec une voiture normale.

{{% expand "Solution" %}}
On peut :
- soit créer un nouvel attribut `flying_speed`, et l'utiliser dans `FlyingCar::drive`,
- soit rendre `Car::_speed` `protected`, et retourner `10u * _speed` dans `FlyingCar::drive`.

```cpp
class FlyingCar: public Car
{
public:
    FlyingCar(const Driver& driver, unsigned int speed)
        : Car { driver, speed }
        , _flying_speed { 10u * speed }
    {}

    unsigned int drive() const override
    {
        std::cout << "Sweeesh!" << std::endl;
        return _flying_speed;
    }

private:
    unsigned int _flying_speed = 0;
};
```
{{% /expand %}}

Chaque fois qu'une nouvelle technologie arrive sur le marché, les régulations mettent un peu de temps à arriver.
Dans le cas de la voiture volante, le conducteur doit désormais être en possession d'un permis de l'air pour pouvoir s'en servir.
Commencez par ajouter ce qu'il faut dans `Driver` pour passer le permis adéquat et savoir s'il l'a.

{{% expand "Solution" %}}
```cpp
class Driver
{
public:
    ...

    void pass_air_licence_exam()
    {
        _has_air_licence = true; 
    }

    bool has_air_licence() const
    {
        return _has_air_licence;
    }

private:
    ...
    bool _has_air_licence = false;
};
```
{{% /expand %}}

Vous allez maintenant devoir modifier la fonction `FlyingCar::drive`, afin que le conducteur ne puisse utiliser le mode volant que s'il est équippé d'un permis de l'air.
Autrement, s'il a son permis classique, il peut utiliser le mode roulant.

Dans une fonction redéfinie, il est possible de faire appel au comportement défini dans la classe parente. 
Pour cela, on utilise la syntaxe suivante :
```cpp
class DerivedClass : public BaseClass
{
    void DerivedClass::fcn(int a) override
    {
        // Calling base behavior.
        BaseClass::fcn(a);

        // Then executing specific behavior.
        ...
    }
};
```

Utilisez la syntaxe ci-dessus pour faire appel au comportement de base de `drive` dans le cas où le conducteur n'a pas son permis de l'air.\
Testez ensuite les trois situations suivantes :\
\- si le conducteur a son permis de l'air => mode volant,\
\- sinon, si le conducteur a son permis classique => mode roulant,\
\- sinon => la voiture n'avance pas.

{{% expand "Solution" %}}
```cpp
class FlyingCar : public Car
{
    ...

    unsigned int drive() const override
    {
        if (_driver.has_air_licence())
        {
            std::cout << "Sweeesh!" << std::endl;
            return _flying_speed;
        }
        else
        {
            return Car::drive();
        }
    }
    
    ...
};
```
{{% /expand %}}

---

### Véhicule abstrait

Avec le code actuel, il est tout à fait possible d'instancier des classes `Vehicle`.
Cependant, cette classe ne devrait pas être instanciable, puisqu'elle est juste là pour définir l'interface que tous les véhicules doivent implémenter.
En Java, vous auriez d'ailleurs probablement défini le type `Vehicle` en utilisant une interface, ou éventuellement une classe abstraite.

En C++, il n'existe pas pas de mot-clef permettant de définir des interfaces ou des classes abstraites.
Vous pouvez néanmoins empêcher un utilisateur d'instancier une classe qui ne devrait pas l'être via deux mécanismes.

**1. Constructeur protégé**

On place le constructeur de la classe dans la partie `protected`. Ainsi, seule la classe elle-même et les sous-classes peuvent appeler le constructeur de l'objet.

```cpp
class AbstractClass
{
protected:
    AbstractClass() { /* Can only be instanciated from current and child classes  */ }

public:
    virtual ~AbstractClass() {}

    virtual void fcn_a(int p);
    virtual void fcn_b() const;
};
```

Déclarez le constructeur de `Vehicle` dans la partie protégée de la classe, et essayez d'instancier un `Vehicle` depuis le `main`. Quelle erreur de compilation obtenez-vous ? 

{{% expand "Solution" %}}
```cpp
class Vehicle
{
protected:
    Vehicle(const Driver& driver)
        : _driver { driver }
    {}

public:
    virtual ~Vehicle() {}

    ...
};
```

A l'instanciation, on obtient une erreur du style :
```bash
'Vehicle::Vehicle': cannot access protected member declared in class 'Vehicle'
```
{{% /expand %}}

**2. Fonction virtuelle pure**

Une fonction virtuelle pure est une déclaration de fonction sans implémentation.
Si vous essayez d'instancier une classe contenant des fonctions virtuelles pures, le compilateur ne vous laissera pas faire.

Lorsque vous héritez d'une classe contenant des fonctions virtuelles pures, vous pouvez les redéfinir comme n'importe quelle autre fonction virtuelle.
Vous pourrez ensuite instancier ces classes-filles, du moment que vous avez bien fourni une définition à chacune des fonctions virtuelles pures de la classe de base.

Pour déclarer une fonction virtuelle pure, il faut écrire `= 0;` tout au bout de sa déclaration :
```cpp
class Interface
{
public:
    virtual ~Interface() {}

    virtual void fcn_a(int p) {}    // Classic virtual function.
    virtual void fcn_b() const = 0; // Pure virtual function, that needs to be redefined in the derived class so that they can be instanciated.
};
```

Remettez le constructeur de `Vehicle` dans la partie publique, puis supprimez l'implémentation de `Vehicle::drive` et transformez-la en fonction virtuelle pure.\
Quelles erreurs de compilation obtenez-vous maintenant ?

{{% expand "Solution" %}}
```cpp
class Vehicle
{
protected:
    Vehicle(const Driver& driver)
        : _driver { driver }
    {}

public:
    virtual ~Vehicle() {}

    virtual unsigned int drive() const = 0;

    ...
};
```

A l'instanciation, on obtient quelque chose comme :
```bash
'Vehicle': cannot instantiate abstract class
see declaration of 'Vehicle'
due to following members:
'unsigned int Vehicle::drive(void) const': is abstract
```
{{% /expand %}}
