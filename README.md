# Eco-Stock - Projet Full Stack

Ce dépôt contient une application complète de gestion de stocks logistiques, composée de deux parties :

- `back-end/` : API Django REST Framework sécurisée via JWT
- `front-end/eco-stock/` : application React/Vite pour le dashboard et les opérations métier

## 🎯 Objectif général

L’objectif du projet est de fournir une solution unifiée permettant aux équipes logistiques de :

- se connecter avec un compte sécurisé
- consulter les entrepôts et les stocks
- vérifier l’état des produits (disponible, réservé, périmé)
- transférer un produit d’un entrepôt à un autre
- visualiser les indicateurs de performance en temps réel
- maintenir la synchronisation entre frontend et backend

## 📦 Architecture globale

### Backend

- Django 6.0.6
- Django REST Framework 3.17.1
- Simple JWT pour l’authentification JWT
- django-cors-headers pour autoriser les requêtes cross-origin
- SQLite pour la base de données

Points d’intérêt principaux :

- `back-end/config/settings.py`
  - configuration du backend
  - activation de `rest_framework` et `corsheaders`
  - définition des classes d’authentification JWT
  - configuration CORS autorisant `http://localhost:5173`

- `back-end/config/urls.py`
  - routes API principales : `api/`, `api/token/`, `api/token/refresh/`

- `back-end/inventaire/models.py`
  - `Warehouse` : entrepôt avec `nom`, `localisation`, `capacitee`
  - `Product` : produit avec `nom`, `quantitee`, `date_expiration`, `etat`, `entrepot`

- `back-end/inventaire/views.py`
  - `ProductViewSet` et `WarehouseViewSet`
  - action personnalisée `move` sur les produits
  - action `audit` sur les entrepôts
  - permissions `IsAuthenticatedOrReadOnly`

- `back-end/inventaire/serializer.py`
  - sérialisation de `Product` et `Warehouse`

### Frontend

- React 19
- Vite
- React Router DOM
- Axios
- Context API
- Tailwind / CSS modulaires

Points d’intérêt principaux :

- `front-end/eco-stock/src/App.jsx` : configuration des routes publiques et protégées
- `front-end/eco-stock/src/context/AuthContext.jsx` : gestion de l’authentification et du stockage du token
- `front-end/eco-stock/src/context/DataContext.jsx` : gestion globale des données warehouses/products
- `front-end/eco-stock/src/services/api.js` : configuration Axios avec injection du token et refresh automatique
- `front-end/eco-stock/src/routes/ProtectedRoute.jsx` : protection des routes privées
- `front-end/eco-stock/src/pages/Login.jsx` : interface de connexion
- `front-end/eco-stock/src/pages/Home.jsx` : dashboard de pilotage
- `front-end/eco-stock/src/pages/Warehouses.jsx` : liste des entrepôts
- `front-end/eco-stock/src/pages/WarehouseDetails.jsx` : détails d’un entrepôt et transfert de produit
- `front-end/eco-stock/src/pages/Product.jsx` : gestion des références produits

## 🔐 Sécurité et synchronisation

### Authentification / JWT

- La partie backend expose :
  - `POST /api/token/` pour obtenir `access` et `refresh`
  - `POST /api/token/refresh/` pour rafraîchir le token
- Le frontend stocke :
  - `ACCESS_TOKEN` dans `localStorage`
  - `REFRESH_TOKEN` dans `localStorage`
- Le service Axios injecte le token dans chaque requête HTTP
- En cas de `401`, le frontend tente un rafraîchissement du token, puis rejoue la requête
- Si le refresh échoue, l’utilisateur est renvoyé vers `/login`

### CORS

CORS est activé dans le backend afin de permettre aux requêtes issues du frontend sur `http://localhost:5173`.

## 🛠️ Installation et démarrage

### Backend

1. Ouvrir un terminal dans `back-end/`
2. Activer l’environnement virtuel :

```bash
cd back-end
source env/bin/activate
```

3. Installer les dépendances si nécessaire :

```bash
pip install -r requirement.txt
```

4. Appliquer les migrations Django :

```bash
python manage.py migrate
```

5. Créer un superutilisateur (facultatif pour tests) :

```bash
python manage.py createsuperuser
```

6. Lancer le serveur :

```bash
python manage.py runserver
```

Le backend sera disponible par défaut sur `http://127.0.0.1:8000/`.

### Frontend

1. Ouvrir un terminal dans `front-end/eco-stock/`
2. Installer les dépendances :

```bash
npm install
```

3. Créer un fichier `.env` à la racine de `front-end/eco-stock/` :

```env
VITE_API_URL=http://localhost:8000
```

4. Lancer le frontend :

```bash
npm run dev
```

Le frontend sera disponible sur l’URL affichée par Vite, généralement `http://localhost:5173/`.

## 📡 Points d’intégration importants

### API attendues

- `POST /api/token/`
- `POST /api/token/refresh/`
- `GET /api/warehouses/`
- `GET /api/warehouses/:id/`
- `GET /api/produits/`
- `GET /api/produits/:id/`
- `POST /api/produits/:id/move/`

### Règles métier front/back

- `Product.move` vérifie l’état du produit et refuse le transfert si le produit est `perime`
- Le frontend désactive l’action de transfert pour les produits périmés
- La synchronisation est requise après chaque modification d’état API

## ✨ Fonctionnalités disponibles

### Backend

- gestion CRUD des entrepôts
- gestion CRUD des produits
- transfert de produit entre entrepôts
- audit d’un entrepôt (nombre de produits)
- authentification JWT
- CORS configuré pour le frontend

### Frontend

- page de connexion sécurisée
- dashboard de pilotage
- affichage des entrepôts et des stocks
- affichage des produits par entrepôt
- page de détails produit et visualisation des ratios dispo/périmé
- transferts de produit conditionnels
- rafraîchissement automatique des données
- routes privées et protection par token

## 🧪 Tests et développement

### Backend

- les tests Django sont disponibles dans `back-end/inventaire/tests.py`
- le fichier est actuellement vide, mais la structure est prête pour ajouter des tests unitaires

### Frontend

- pas encore de tests unitaires inclus, mais la structure est conçue pour être étendue
- les composants sont séparés par domaine (`components`, `pages`, `table`, `context`)

## 📝 Notes de déploiement

- En production, passez `DEBUG=False` dans `back-end/config/settings.py`
- configurez `ALLOWED_HOSTS` dans le backend
- sécurisez la clé `SECRET_KEY`
- utilisez un backend de base de données plus robuste qu’un fichier SQLite
- servez le frontend en production via un serveur statique ou une plateforme compatible Vite

## 🔧 Remarques techniques

- Le backend utilise `rest_framework_simplejwt.authentication.JWTAuthentication`
- Le frontend utilise la Context API pour l’authentification et les données globales
- `front-end/eco-stock/src/services/api.js` gère la logique de refresh token et l’injection automatique du header
- `front-end/eco-stock/src/routes/ProtectedRoute.jsx` protège les routes privées

## 📁 Structure du repository

```
FULL-STACK/
├── back-end/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── inventaire/
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── serializer.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── migrations/
│   ├── db.sqlite3
│   ├── manage.py
│   └── requirement.txt
├── front-end/
│   └── eco-stock/
│       ├── package.json
│       ├── src/
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   ├── context/
│       │   ├── pages/
│       │   ├── services/
│       │   └── routes/
│       └── README.md
```

## 📬 Utilisation rapide

- démarrez le backend Django
- démarrez le frontend Vite
- ouvrez le navigateur sur `http://localhost:5173`
- connectez-vous puis naviguez dans le dashboard

---

Ce README couvre l’ensemble du projet front + back, depuis l’installation jusqu’au fonctionnement du dashboard Eco-Stock.
