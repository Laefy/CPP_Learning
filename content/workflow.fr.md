---
title: "Workflow"
---

Afin de pouvoir mettre en place votre environnement de travail rapidement, vous pouvez suivre les étapes ci-dessous.

---

### Récupérer le dépôt Git du cours et des TPs

1. Forkez le dépôt https://github.com/Laefy/CPP_Learning_Code/.
![](/CPP_Learning/images/workflow/01-fork.png)

2. Ouvrez une nouvelle fenêtre dans VSCode et cliquez sur "clone repository..."
![](/CPP_Learning/images/workflow/02-open_vscode.png)

3. Copiez le lien de votre dépôt créé par le fork.
![](/CPP_Learning/images/workflow/03-get_url.png)

4. Collez ce lien dans la fenêtre de VSCode et sélectionnez "Clone from URL".
![](/CPP_Learning/images/workflow/04-clone.png)

5. Choisissez le répertoire dans lequel le dépôt sera cloné.
![](/CPP_Learning/images/workflow/05-select_location.png)

6. Ouvrez le répertoire cloné dans VSCode.
![](/CPP_Learning/images/workflow/05-select_location.png)

---

### Configurer le dépôt

1. Ouvrez le menu CMake.
![](/CPP_Learning/images/workflow/07-open_cmake_view.png)

2. Cliquez sur le bouton permettant de configurer le projet (commande VSCode : `CMake: Configure`).
![](/CPP_Learning/images/workflow/08-configure.png)

3. Choisissez le compilateur à utiliser dans la liste qui vous est proposée.
![](/CPP_Learning/images/workflow/09-select_kit.png)

4. Autoriser CMake Tools à configurer IntelliSense.
![](/CPP_Learning/images/workflow/10-allow_intellisense.png)

5. L'ensemble des exécutables devraient être apparu dans le menu CMake, rangés par dossier.
![](/CPP_Learning/images/workflow/11-after_configuration.png)

---

### Programmer / Compiler / Tester

1. Retournez sur la vue du workspace et modifiez les fichiers de votre choix.
![](/CPP_Learning/images/workflow/12-file_view.png)

2. Dans la barre bleue en bas, cliquez sur le bouton de lancement (si vous en avez plusieurs, utilisez celui à droite de l'insecte).\
L'exécutable sera compilé automatiquement s'il n'est pas à jour.  
![](/CPP_Learning/images/workflow/13-first_run.png)

3. Sélectionnez la cible à exécuter.
![](/CPP_Learning/images/workflow/14-select_exe.png)

4. Si le programme a correctement compilé, il devrait s'être exécuté dans le terminal.\
Vous devriez aussi voir apparaître le nom de la cible à-côté du bouton de lancement. 
![](/CPP_Learning/images/workflow/15-current_exe.png)

5. Supposons maintenant que vous souhaitiez travailler sur un autre programme.\
Cliquez sur le nom de la cible à-côté du bouton de lancement.
![](/CPP_Learning/images/workflow/16-change_exe.png)

6. Sélectionnez la nouvelle cible à exécuter.
![](/CPP_Learning/images/workflow/17-select_new_exe.png)

7. Cliquez enfin sur l'un des deux boutons de lancement :\
\- insecte : exécution en mode debug (Ctrl+F5)\
\- lecture : exécution sans debug (Shift+F5)
![](/CPP_Learning/images/workflow/18-run_or_debug.png)

---

### Sauvegarder son travail avec Git

1. Exécutez la commande `git status` pour voir les fichiers modifiés.
![](/CPP_Learning/images/workflow/19-git_status.png)

2. Utilisez ensuite `git add` sur les fichiers dont vous voulez sauvegarder les changements (`git add .` pour tout ajouter).
![](/CPP_Learning/images/workflow/20-git_add.png)

3. Entrez ensuite la commande `git commit -m "un message décrivant vos changements"` afin de sauvegarder les changements sur votre disque.  
![](/CPP_Learning/images/workflow/21-git_commit.png)

---

### Récupérer les derniers exercices du cours et du TP

1. Exécutez la commande `git remote add upstream https://github.com/Laefy/CPP_Learning_Code.git` pour que votre dépôt local puisse faire référence au dépôt du cours avec l'identifiant `upstream`.\
Vous pouvez utiliser les commandes `git remote -v show` pour afficher la liste de tous les dépôts distants suivis par votre dépôt local :\
\- `origin` fait généralement référence au dépôt cloné,\
\- `upstream` fait généralement référence au dépôt forké.
![](/CPP_Learning/images/workflow/22-git_remote.png)

2. Utilisez ensuite `git fetch upstream` afin de télécharger dans les branches du dépôt pointé par `upstream`.
![](/CPP_Learning/images/workflow/23-git_fetch.png)

3. Exécutez `git branch -a` pour vérifier que les branches de `upstream` ont bien été récupérées dans votre dépôt.\
Le but de la prochaine manipulation sera d'intégrer les changements de la branche `upstream/master` dans votre branche locale.
![](/CPP_Learning/images/workflow/24-git_branch.png)

4. Exécutez la commande `git merge upstream/master` afin de récupérer les changements de la branche.\
Dans l'image suivante, on voit qu'il n'y a eu aucun nouveau changement sur le dépôt du cours.
![](/CPP_Learning/images/workflow/25-git_merge_none.png)

5. Si après quelques jours, vous pensez que des changements ont eu lieu sur le dépôt distant, vous pouvez réexécuter les commandes `git fetch upstream` et `git merge upstream/master`.
Ici, de nouveaux changements ont été détectés et récupérés sur la branche locale `master`.
![](/CPP_Learning/images/workflow/26-git_merge_new.png)

---

### Résoudre les conflits

1. Supposons que vous ayiez modifié le fichier CMakeLists.txt à un moment, pour ajouter un commentaire dedans.\
Vous avez bien entendu sauvegardé votre changement en appelant `git add CMakeLists.txt` puis `git commit -m "..."`.
![](/CPP_Learning/images/workflow/27-git_commit.png)

2. Vous lancez ensuite `git fetch upstream` et `git merge upstream/master` pour récupérer les derniers changements du cours.\
Hélas, ces changements contenaient également des modifications autour de la ligne que vous aviez modifié dans le fichier `CMakeLists.txt`.
Votre branche locale se retrouve donc dans un état de conflit.
![](/CPP_Learning/images/workflow/28-git_merge_conflict.png)

3. Vous pouvez constater dans la sortie sur le terminal que le conflit concerne effectivement le fichier `CMakeLists.txt`, mais ce n'est pas forcément ce qu'il y a de plus lisible.\
Ouvrez du coup le menu SourceControl dans VSCode.
![](/CPP_Learning/images/workflow/29-git_check_conflict.png)

4. Vous pouvez maintenant voir clairement la liste de tous les fichiers contenant des conflits. Ici, il n'y a que `CMakeLists.txt`.\
Cliquez sur ce fichier afin de l'ouvrir dans l'éditeur.\
Vos propres modifications apparaissent dans la partie "Current Change", et les modifications que vous essayez de merger apparaissent dans la partie "Incoming Change".
![](/CPP_Learning/images/workflow/30-git_explain_conflict.png)

5. Vous pouvez cliquer sur l'une des options juste au-dessus du conflit pour choisir les modifications que vous préférez garder.\
Vous pouvez aussi éditer le fichier à la main directement.
![](/CPP_Learning/images/workflow/31-git_quick_action.png)

6. Ici, vous avez décidé de conserver les nouveaux changements ("Accept Incoming Change") et avez sauvegardé le fichier.\
Mais vous avez finalement des regrets...\
Pour revenir en arrière, exécutez la commande `git merge --abort`.
![](/CPP_Learning/images/workflow/32-git_merge_abort.png)

7. Vous devriez constater que tous les fichiers sont revenus à l'état qu'ils avaient avant d'essayer de merger.\
Entrez de nouveau la commande `git merge upstream/master`.
![](/CPP_Learning/images/workflow/33-git_merge_retry.png)

8. Ce coup-ci, vous décidez d'éditer le fichier à la main, afin de conserver les deux commentaires : le vôtre et celui du cours.
![](/CPP_Learning/images/workflow/34-git_resolve_conflict.png)

9. Lancez la commande `git status` pour être sûr de ne rien oublier.\
Ici, le fichier CMakeLists.txt apparaît toujours dans la liste des fichiers à merger.
![](/CPP_Learning/images/workflow/35-git_merge_status.png)

10. Utilisez `git add CMakeLists.txt` pour valider la résolution du conflit dans ce fichier, puis finalement le merge avec `git commit`.\
Un fichier devrait s'ouvrir dans l'éditeur configuré pour git (VSCode dans la capture, mais s'agira probablement d'un autre éditeur chez-vous).
Sauvegardez et fermez ce fichier pour enregistrer le commit.
![](/CPP_Learning/images/workflow/36-git_merge_commit.png)

11. Utilisez maintenant la commande `git log` pour vérifier que vous avez bien récupérer les changements de la branche `upstream/master`.
![](/CPP_Learning/images/workflow/37-git_log.png)

12. Vous devriez voir apparaitre la liste des derniers commits de votre branche local (du moins récent en bas au plus récent en haut).\
Vous pouvez voir que vous êtes bien à jour de la branche `upstream/master`, car son nom apparaît à-côté de l'un des commits.\
Ensuite, vous trouvez la liste de vos propres commits.\
Pour terminer, le commit du merge que vous venez de réaliser apparaît tout en haut de la liste.
![](/CPP_Learning/images/workflow/38-git_log_result.png)
