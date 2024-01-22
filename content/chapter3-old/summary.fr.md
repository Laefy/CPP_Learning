---
title: "Synthèse"
weight: 101
---

---

### Ce qu'il faut retenir

##### Théorie

- La durée de vie d'un objet s'étend de sa construction à sa destruction.
- Lorsque la durée de vie d'un objet s'achève, il n'est plus valide de l'utiliser.
- La portée d'une référence peut excéder la durée de vie de l'objet référencé (=> dangling reference).
- Un objet A est propriétaire d'un objet B si la destruction de A entraîne celle de B.
- Aucune copie n'est faite lorsqu'on initialise une variable avec la valeur de retour d'une fonction (mandatory copy-elision)

##### Pratique

- Un `unique_ptr` n'est pas copiable.
- `nullptr` au lieu de `NULL` ou `null`

---

### Ce qu'il faut savoir faire

##### Méthodologie

- Déterminer les relations d'ownership entre les objets d'un programme.
- Déterminer les durées de vie des objets d'un programme.
- Identifiez les objets qui peuvent provoquer des réallocations intempestives (`std::vector`, `std::string`, etc).

##### Librairie standard

- Header pour `unique_ptr` et `make_unique` : `<memory>`
- Header pour `move` : `<utility>`
- Créer un `unique_ptr<T>` : `std::make_unique<T>(p1, p2, ...)`.
- Déplacer le contenu d'un `unique_ptr` dans un autre : `auto target_ptr = std::move(ptr)` / `fcn(std::move(ptr))` 
- Accéder au contenu d'un `unique_ptr` : `auto& obj = *ptr` / `ptr->member_fcn()`

##### Pratique

- Définir un destructeur : `~Class() { ... }` (éventuellement préfixé par `Class::` si défini en dehors de la classe).
