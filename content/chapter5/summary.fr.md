---
title: "Synthèse"
weight: 101
---

---

### Ce qu'il faut retenir

##### Théorie

- Une ressource est généralement une entité que l'on demande à l'OS de nous "prêter", comme un bloc de mémoire, un fichier ou encore une connection réseau.\
Certains objets du programme peuvent également être considérés comme des ressources.
- Une ressource est valide de son acquisition à sa libération. La durée de vie d'une ressource fait référence est cette période de validité. 
- RAII : technique qui consiste à s'assurer qu'une ressource sera bien libérée, en l'associant à un objet (smart pointer, conteneur STL, ...).
Cet objet réalise alors la libération de la ressource dans son destructeur.
- Le propriétaire d'une ressource, c'est le composant (objet, fonction, variable) responsable de la durée de vie de cette ressource. 

##### Pratique

- La composition (= on est propriétaire) s'exprime avec `Obj object` ou `std::unique_ptr<Obj> object`.
- L'aggrégation (= on n'est pas propriétaire) s'exprime avec des références `Obj& object` ou (`Obj* object` si optionnel).

---

### Ce qu'il faut savoir faire

##### Méthodologie

- Il faut déterminer qui sera owner de qui avant de commencer à coder, afin de définir correctement l'architecture de ses classes.
- Il faut aussi définir qui aura le droit d'utiliser une ressource sans en être propriétaire.

##### Librairie standard

- Inclure les smart pointers : `#include <memory>`
- Créer un `unique_ptr<T>` : `std::make_unique<T>(p1, p2, ...)`.
- Transférer un `unique_ptr` (non-copiable) : `auto new_owner = std::move(ptr)` / `fcn(std::move(ptr))` 
- Savoir si un `unique_ptr` fait référence à un objet précis : `ptr->get() == &ref`
- Accéder au contenu d'un `unique_ptr` : `auto& obj = *ptr` / `*ptr->obj_fcn()`
- Créer des `shared_ptr<T>` : `std::make_shared<T>(p1, p2, ...)`
- Inverser deux objets : `std::swap(obj1, obj2)` dans `<utility>`

##### Langage

- `[[nodiscard]]` pour être sûr que la valeur de retour d'une fonction n'est pas ignorée.

##### Pratique

- Prévenir tous les composants qui ont une référence sur un objet avant de procéder à sa destruction.
- Ecrire `[[nodiscard]]` sur les fonctions destinées à transférer l'ownership d'une ressource.
C'est d'autant plus important de le faire lorsque le type de retour ne réalise pas la libération de la ressource à sa destruction (= sans RAII), comme les raw pointers.

---

### Ce dont il faut à peu près se souvenir

##### Librairie standard

- Utiliser un `std::reference_wrapper<T>`
- Créer des `weak_ptr<T>` : `std::weak_ptr<T> weak { some_shared_ptr }`
- Créer un `shared_ptr<T>` si utilisé avec des `weak_ptr` : `std::shared_ptr<T> p { new T { p1, p2, ... } }`