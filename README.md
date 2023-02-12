# MyBlog

## Objectifs

L'objectif de ce projet est purement éducatif. Il fait parti de mon apprentissage du stack MERN (MongoDB, Express, React, Node.js). Il est mon premier projet NodeJS réalisé en autonomie. Il ne suit pas les directions d'une formation en particulier. Ce projet est original et s'appuie sur les références citées dans la partie "Références" de ce présent document.

## Description

MyBlog est une API qui propose à des utilisateurs de conserver et de gérer des articles.

Une fois connecté l'utilisateur peut gérer ses articles (Create/Read/Update/Delete). Il peut consulter ceux des autres utilisateurs et les commenter. Ses articles peuvent aussi être commentér par les autres utilisateurs enregistrés dans l'application.

Les articles sont publics à tous les internautes.

## Démarrage du projet

MongoDB doit être installé sur votre ordinateur. *MyBlog* a besoin d'utiliser une base de données en local pour l'environnement de développement et de test. L'environnement de production n'a pas été implémenté. Consulter le [manuel d'installation de MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/).

Au minimum, la version 18 de nodejs doit être installée sur votre ordinateur. Consulter la [documentation de NodeJs](https://nodejs.org/en/download/) ou la [documentation de nvm](https://www.linode.com/docs/guides/how-to-install-use-node-version-manager-nvm/) dans le cas de plusieurs version de NodeJS installées sur votre ordinateur.

Après avoir cloné le projet sur GitHub, placez vous dans le dépôt et installez les dépendances :

```shell
cd nom/du/depot
npm install
```

Renommer le fichier `.env-template` en `.env`. Compléter les données demandées dans ce fichier.

Assurez-vous que MongoDB soit accessible en local. Par défaut, celui-ci ouvre le port 27017 sur `localhost`.  

Lancer l'application avec la commande :

```shell
npm run dev
```

Par défaut, le server de l'application ouvre le port 3500.

Lancer les tests pour s'assurer que les services sont prêts avec cette commande :

```shell
npm run test
```

Enfin, consulter la documentation de l'API sur l'url : `http//localhost:3500/api-docs`

## Utiliser l'API

Créer un compte avec l'url [/users/new (Sign In)](http//localhost:3500/api-docs/#/Users/post_users_new).

Une fois le compte initialisé, entrez votre email et votre password pour vous logger sur [/users/login (Log In)](http//localhost:3500/api-docs/#/Users/post_users_new)

Il est possible d'utiliser le compte administrateur de test implémenté dans le fichier `.env`.

Copier le token de la réponse http et le copier dans le formulaire `Authorization` de la documentation de l'API.

il est maintenant possible d'utiliser l'ensemble des routes en tant qu'utilisateur ou administrateur si vous avez choisi le compte de test.

## Améliorations

* Mettre en place un système d'intégration continue [CI/CD](https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha#h-continuous-integration-for-nodejs) et utiliser un outil tel que `ESLint` pour analyser le code tout au long de l'écriture du code. Il sera donc mis en place dans mes prochains projets.
* Revoir la méthode pour contrer les attaques brutes-forces. `express-brut` n'est pas conseillé en environnement de production.
* Développer directement avec `Docker` pour mieux maitriser le flux de production.

## Références

Généralités sur l'architecture des applications en NodeJS / Express

* [Tutoriel de Simon Dieny](https://www.youtube.com/watch?v=NRxzvpdduvQ&t=29162s)

La gestion des logs

* [Best practices](https://www.youtube.com/watch?v=DIzJC8wRp-s)
* [Winston](https://www.youtube.com/watch?v=2UTER21MCdk)

Les tests

* [TDD](https://www.youtube.com/watch?v=M44umyYPiuo&t=420s)
* [Testing](https://www.freecodecamp.org/learn/quality-assurance/)

La base de données et ORM

* [MongoDB](https://www.youtube.com/watch?v=ExcRbA7fy_A&list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA)
* [Mongoose](https://mongoosejs.com/)

La sécurité

* [Outil JWT](https://jwt.io/)
* [JSON Web Token](https://www.npmjs.com/package/jsonwebtoken)
* [Best practices Express](https://expressjs.com/en/advanced/best-practice-security.html)
* [Check-list](https://blog.risingstack.com/node-js-security-checklist/)
* [Sanitize inputs](https://express-validator.github.io/docs)
* [Tutorial Security Certification](https://www.freecodecamp.org/learn/information-security/)
