---
title: "Visual Studio Code"
weight: 1
---

Pour l'IDE, nous vous conseillons d'utiliser {{< open_in_new_tab "https://code.visualstudio.com/docs/setup/setup-overview" "Visual Studio Code" />}}, car celui-ci est disponible sur toutes les plateformes (contrairement à Visual Studio tout court), qu'il est très bien documenté et que vous pourrez trouvez de nombreux tutoriels en ligne pour apprendre à l'utiliser.\
Vous trouverez ci-dessous les instructions permettant d'installer VSCode et un compilateur (g++ pour Windows et Linux, clang pour MacOS), de compiler un programme et de l'exécuter depuis VSCode.

---

### Windows

1. Installez VSCode en suivant les instructions du paragraphe {{< open_in_new_tab "https://code.visualstudio.com/docs/setup/windows" "Installation" />}}. \
Si l'installeur vous propose d'installer git, vous pouvez acceptez, cela vous fera gagner du temps pour la suite. 
2. Installez le compilateur g++ en suivant les étapes 3 et 4 de la section {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-mingw#_prerequisites" "Prerequisites" />}}.
3. Installez ensuite l'extension {{< open_in_new_tab "https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools" "C/C++" />}} (Microsoft).
	- Ouvrez l'application VSCode.
	- Allez dans View > Extensions.
	- Recherchez l'extension C/C++.
	- Cliquez sur le bouton Install.
4. Testez votre installation soit en suivant {{< open_in_new_tab "https://www.youtube.com/watch?v=RsoaVsB5Ak8" "cette vidéo" />}}, soit suivant les instructions des sections suivantes :
	- {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-mingw#_create-hello-world" "Create Hello World" />}}.
	- {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-mingw#_build-helloworldcpp" "Build helloworld.cpp" />}}.
	- {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-mingw#_debug-helloworldcpp" "Debug helloworld.cpp" />}}.

---

### Linux

1. Installez VSCode en suivant les instructions du paragraphe {{< open_in_new_tab "https://code.visualstudio.com/docs/setup/linux" "Installation" />}}.
2. Installez le compilateur g++ en suivant les instructions de la section {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-linux#_ensure-gcc-is-installed" "Ensure GCC is installed" />}}.
3. Installez ensuite l'extension {{< open_in_new_tab "https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools" "C/C++" />}} (Microsoft).
	- Ouvrez l'application VSCode.
	- Allez dans View > Extensions.
	- Recherchez l'extension C/C++.
	- Cliquez sur le bouton Install.
4. Testez votre installation soit en suivant {{< open_in_new_tab "https://www.youtube.com/watch?v=RsoaVsB5Ak8" "cette vidéo" />}}, soit suivant les instructions des sections suivantes :
	- {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-linux#_create-hello-world" "Create Hello World" />}}.
	- {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-linux#_build-helloworldcpp" "Build helloworld.cpp" />}}.
	- {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-linux#_debug-helloworldcpp" "Debug helloworld.cpp" />}}.

---

### MacOS

1. Installez VSCode en suivant les instructions du paragraphe {{< open_in_new_tab "https://code.visualstudio.com/docs/setup/mac" "Installation" />}}.
2. Installez le compilateur clang en suivant les instructions de la section {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-clang-mac#_ensure-clang-is-installed" "Ensure Clang is installed" />}}.
3. Installez ensuite l'extension {{< open_in_new_tab "https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools" "C/C++" />}} (Microsoft).
	- Ouvrez l'application VSCode.
	- Allez dans View > Extensions.
	- Recherchez l'extension C/C++.
	- Cliquez sur le bouton Install.
4. Testez votre installation soit en suivant {{< open_in_new_tab "https://www.youtube.com/watch?v=RsoaVsB5Ak8" "cette vidéo" />}}, soit suivant les instructions des sections suivantes :
	- {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-clang-mac#_create-hello-world" "Create Hello World" />}}.
	- {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-clang-mac#_build-helloworldcpp" "Build helloworld.cpp" />}}.
	- {{< open_in_new_tab "https://code.visualstudio.com/docs/cpp/config-clang-mac#_debug-helloworldcpp" "Debug helloworld.cpp" />}}.
