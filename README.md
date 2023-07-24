# Portfolio-architecte-Sophie-BLUEL

Contexte: 

Vous travaillez comme développeur front-end pour l’agence ArchiWebos qui comprend 50 salariés. 
Ayant terminé votre dernier projet avec un peu d'avance, vous êtes envoyé en renfort comme développeur front-end d’une équipe 
qui travaille sur la conception du site portfolio d’une architecte d’intérieur.

Lancement du backend :

Après avoir récupéré le REPO executez la commande `npm install` pour installer les dépendances du projet

Une fois les dépendances installées lancez le projet avec la commande `npm start`


MISSIONS :

- Développer la page de présentation des travaux de l'architecte (à partir du HTML fourni) ;
- Développer la page de connexion de l'administrateur du site (le client) (code à créer de zéro) ;
- Développer la modale permettant d'uploader de nouveaux médias (code à créer from scratch).


TACHES :

1. Récupérer dynamiquement les données des travaux via l’API :

- Pour se faire il faudra utiliser la version 1 de l’API développée par Fatima.

- Après avoir cloné le REPO de l’API tu pourras voir les informations dont tu as 
besoin pour les différentes routes grâce au document Swagger. 

- Suis bien le ReadMe pour pouvoir te lancer sur l’API.


2. Ajouter le tri des projets par catégorie dans la galerie :

- Une fois que tu as récupéré les projets depuis l’API, tu vas pouvoir mettre en place 
le tri par catégorie comme on peut le voir sur la maquette. 

- Par exemple quand on cliquera sur Office, on ne verra que les travaux de cette catégorie. 


3. Intégrer la page de connexion pour le site : 

- En suivant la maquette, il faudra intégrer le formulaire de connexion au site. 

 - Lorsque le couple identifiant et mot de passe n’est pas bon pour se connecter il faut afficher le MESSAGE D'ERREUR : 

- “Erreur dans l’identifiant ou le mot de passe”

- Lorsque le couple identifiant et mot de passe est correct, alors il faut rediriger vers la page du site avec cette fois 
ci des boutons d’actions pour éditer le site.


4. Ajouter la modale pour gérer les projets :

- Créer une fenêtre modale qui s’ouvre lorsque l’on souhaite modifier la liste des projets. 

- Les projets apparaissent comme indiqué dans le design de Juan. 

- En cliquant sur l’icône de corbeille, on peut supprimer un travail


5. Créer le formulaire pour l’ajout de projet :

- Une fois que la modale est fonctionnelle et que l’on peut supprimer des projets,
 il faudra que le formulaire permette d’ajouter une image. 
 
 - Il y aura pour cela : 1 champ image pour uploader une image | 1 champ pour nommer le projet | 
 1 champ select pour choisir une catégorie parmi les catégories disponibles
 
 - Il faut nommer obligatoirement chaque image. 
 Si, il n'y a pas de titre a une image alors mettre un MESSAGE D'ERREUR.




