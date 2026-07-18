# Eco-Stock - Frontend

Ce README documente la partie frontend de l’application Eco-Stock, développée avec React et Vite. L’interface permet aux équipes logistiques de consulter les entrepôts, de suivre les stocks, de transférer des produits et d’exploiter des données de supervision en lien avec l’API Django existante.

## 🚀 Objectif

Construire un tableau de bord opérationnel pour :

- authentifier les utilisateurs avec JWT
- afficher la liste des entrepôts et le stock global
- consulter les produits par entrepôt
- visualiser l’état des produits (disponible, réservé, périmé)
- transférer un produit vers un autre entrepôt
- garantir une synchronisation continue avec l’API
- protéger les routes et rediriger automatiquement en cas d’erreur 401

## 🧠 Architecture frontend

Technologies principales :

- React 19
- Vite
- React Router DOM
- Axios
- Context API
- Tailwind / CSS modulaires

### Structure des dossiers

- `src/App.jsx` : routes principales et protection des pages
- `src/context/AuthContext.jsx` : gestion de l’authentification JWT et stockage local
- `src/context/DataContext.jsx` : état global des entrepôts et produits
- `src/services/api.js` : service Axios avec injection automatique du token et refresh token
- `src/routes/ProtectedRoute.jsx` : protection des pages privées
- `src/pages/Login.jsx` : page de connexion sécurisée
- `src/pages/Home.jsx` : dashboard et résumé des entrepôts
- `src/pages/Warehouses.jsx` : affichage de la liste des entrepôts
- `src/pages/WarehouseDetails.jsx` : détails d’un entrepôt et gestion des transferts
- `src/pages/Product.jsx` : gestion produits et ajout/modification
- `src/components/` : composants UI partagés (layout, transferts, etc.)
- `src/table/` : composants de tableau pour afficher les inventaires

## ✅ Fonctionnalités implémentées

### Authentification

- connexion à l’API via JWT
- stockage local de `ACCESS_TOKEN` et `REFRESH_TOKEN`
- contexte React `AuthContext` pour gérer l’état utilisateur
- redirection automatique vers `/login` si l’utilisateur n’est pas authentifié

### Sécurité API

- Axios injecte automatiquement le header `Authorization: Bearer <token>`
- Intercepteur de réponse gère les erreurs `401`
- Rafraîchissement du token via `/api/token/refresh/`
- file d’attente pour les requêtes en attente pendant le refresh
- déconnexion automatique si le refresh échoue

### Dashboard et supervision

- page d’accueil `Home` avec cartes KPI et liste des entrepôts
- calcul de capacité utilisée et ratio d’occupation
- audit rapide par entrepôt
- visualisation des proportions disponible / périmé
- mise à jour dynamique de l’affichage après chaque action API

### Gestion des stocks

- liste des produits par entrepôt
- pages de détails produit et d’entrepôt
- action de transfert conditionnelle :
  - transfert bloqué si le produit est périmé
  - transfert déclenché vers un autre entrepôt via l’API
- création, modification et suppression de produits
- filtrage par entrepôt sur la page produits

## 🔌 Intégration backend

La partie frontend attend une API Django avec ces points d’entrée :

- `POST /api/token/` : obtention des tokens JWT
- `POST /api/token/refresh/` : rafraîchissement du token
- `GET /api/warehouses/` : liste des entrepôts
- `GET /api/warehouses/:id/` : détails d’un entrepôt
- `GET /api/produits/` : liste des produits
- `GET /api/produits/:id/` : détails d’un produit
- `POST /api/produits/:id/move/` : transfert de produit

> Assurez-vous que le backend autorise le CORS pour le domaine du frontend (`http://localhost:5173`).

## ⚙️ Configuration et exécution

### Prérequis

- Node.js 20+ ou compatible
- npm
- Backend Django en écoute

### Installation

```bash
cd front-end/eco-stock
npm install
```

### Variables d’environnement

Le frontend lit l’URL de l’API depuis `VITE_API_URL`.

Créer un fichier `.env` à la racine de `front-end/eco-stock` avec :

```env
VITE_API_URL=http://localhost:8000
```

### Développement

```bash
npm run dev
```

### Build de production

```bash
npm run build
```

### Aperçu après build

```bash
npm run preview
```

## 🎯 Flux utilisateur

- l’utilisateur démarre sur `/login`
- après connexion, il est redirigé vers `/`
- les pages privées sont protégées via `ProtectedRoute`
- l’état global des stocks utilise `DataContext`
- chaque requête API contient automatiquement le token JWT
- si le token expire, le refresh token est utilisé avant de rejouer la requête
- si le refresh échoue, l’utilisateur est redirigé vers `/login`

## 🧩 Composants clés

- `AuthContext` : gestion du cycle de vie utilisateur / token
- `DataContext` : état global `warehouses` + `products`
- `api.js` : service Axios + intercepteurs
- `ProtectedRoute` : verrouillage des routes privées
- `Layout` : structure commune du dashboard
- `ProductTable` : affichage des produits avec actions
- `TransferPanel` : transfert de produit vers un autre entrepôt

## 📌 Conseils de développement

- utiliser le token `ACCESS_TOKEN` en localStorage pour la session
- maintenir l’API backend compatible avec les endpoints attendus
- conserver la logique de refresh dans `src/services/api.js`
- utiliser le tri/filtrage côté frontend pour l’UX rapide
- garder `DataProvider` comme point unique de synchronisation globale

## 📚 Notes

- Le frontend est conçu pour refléter l’état réel de la base de données après chaque succès API
- Les produits périmés sont identifiés et leur transfert est désactivé
- L’objectif est de fournir un outil de pilotage opérationnel pour les équipes logistiques

---

Pour aller plus loin, documenter les conventions de nommage dans `src/components/` et centraliser les appels API dans `src/services/api.js` permet de rendre l’application encore plus maintenable.
