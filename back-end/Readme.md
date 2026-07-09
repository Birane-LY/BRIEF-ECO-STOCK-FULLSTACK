# Eco-Stock — API de gestion d'inventaire

API REST développée avec **Django REST Framework (DRF)** pour la gestion des entrepôts (`Warehouse`) et des produits (`Product`), avec authentification **JWT**.

---

## 1. Prérequis

- Python 3.x
- Django
- Django REST Framework
- djangorestframework-simplejwt

```bash
pip install django djangorestframework djangorestframework-simplejwt
```

---

## 2. Installation et démarrage

```bash
# Cloner / se placer dans le projet
cd config

# Appliquer les migrations
python manage.py makemigrations
python manage.py migrate

# Créer un superutilisateur (pour l'admin + tests JWT)
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

L'API est accessible sur `http://127.0.0.1:8000/api/`.

---

## 3. Modèles

### `Warehouse`
| Champ | Type | Description |
|---|---|---|
| `nom` | CharField | Nom de l'entrepôt |
| `localisation` | CharField | Localisation |
| `capacite` | IntegerField/DecimalField | Capacité de stockage |

### `Product`
| Champ | Type | Description |
|---|---|---|
| `nom` | CharField | Nom du produit |
| `quantite` | IntegerField | Quantité en stock |
| `date_expiration` | DateField | Date de péremption |
| `etat` | CharField (choices) | `disponible`, `reserve`, `perime` |
| `entrepot` | ForeignKey → Warehouse | Entrepôt de rattachement (relation 1-N) |

**Règle de relation** : un `Warehouse` (1) peut contenir plusieurs `Product` (N). La clé étrangère `entrepot` est donc portée par `Product`.

---

## 4. Authentification — JWT

L'API utilise `djangorestframework-simplejwt`. Toutes les actions d'**écriture** (POST, PUT, PATCH, DELETE) nécessitent d'être authentifié. La **lecture** (GET) reste publique (`IsAuthenticatedOrReadOnly`).

### Obtenir un token

```
POST /api/token/
```
Body (JSON) :
```json
{
    "username": "mon_utilisateur",
    "password": "mon_mot_de_passe"
}
```
Réponse :
```json
{
    "refresh": "xxxxx...",
    "access": "xxxxx..."
}
```

- **`access`** : token de courte durée, à envoyer à chaque requête protégée.
- **`refresh`** : token de longue durée, sert à obtenir un nouveau `access` sans se reconnecter.

### Utiliser le token

Ajouter le header suivant à chaque requête protégée :
```
Authorization: Bearer <access_token>
```

### Rafraîchir le token

```
POST /api/token/refresh/
```
Body (JSON) :
```json
{
    "refresh": "xxxxx..."
}
```
Réponse : un nouveau `access`.

---

## 5. Endpoints

Générés automatiquement via `DefaultRouter` (pas de `path()` manuel pour le CRUD).

### Produits — `/api/produits/`

| Méthode | URL | Description | Auth requise |
|---|---|---|---|
| GET | `/api/produits/` | Liste des produits | Non |
| POST | `/api/produits/` | Créer un produit | Oui |
| GET | `/api/produits/{id}/` | Détail d'un produit | Non |
| PUT/PATCH | `/api/produits/{id}/` | Modifier un produit | Oui |
| DELETE | `/api/produits/{id}/` | Supprimer un produit | Oui |
| **POST** | **`/api/produits/{id}/move/`** | **Transférer un produit vers un autre entrepôt** (refusé si `etat == perime`) | Oui |

**Body attendu pour `move`** :
```json
{
    "entrepot": 2
}
```
(`2` = id de l'entrepôt de destination)

### Entrepôts — `/api/entrepots/`

| Méthode | URL | Description | Auth requise |
|---|---|---|---|
| GET | `/api/entrepots/` | Liste des entrepôts | Non |
| POST | `/api/entrepots/` | Créer un entrepôt | Oui |
| GET | `/api/entrepots/{id}/` | Détail d'un entrepôt | Non |
| PUT/PATCH | `/api/entrepots/{id}/` | Modifier un entrepôt | Oui |
| DELETE | `/api/entrepots/{id}/` | Supprimer un entrepôt | Oui |
| **GET** | **`/api/entrepots/{id}/audit/`** | **Nombre total de produits dans cet entrepôt** | Non |

**Réponse de `audit`** :
```json
{
    "nombre de produits total ": 5
}
```

---

## 6. Tester avec Postman

1. **Obtenir un token** : `POST /api/token/` avec `username`/`password` dans le Body (raw JSON).
2. **Copier la valeur de `access`**.
3. Pour toute requête protégée : onglet **Authorization** → type **Bearer Token** → coller le token (sans le mot "Bearer", Postman l'ajoute automatiquement).
4. Body des requêtes : onglet **Body** → **raw** → format **JSON**.

---

## 7. Points d'architecture à retenir

- **`ModelViewSet`** fournit automatiquement tout le CRUD (list, retrieve, create, update, destroy) — pas besoin d'écrire `get`/`post`/`put`/`delete` à la main.
- **`@action`** permet d'ajouter des routes personnalisées (`move`, `audit`) en plus du CRUD standard, sans sortir du ViewSet.
- **`perform_create`** est le point d'accroche pour injecter une logique automatique à la création (utilisé dans l'exercice précédent pour associer l'auteur — non utilisé ici car `Product`/`Warehouse` n'ont pas de notion de propriétaire).
- **`IsAuthenticatedOrReadOnly`** : lecture libre pour tous, écriture réservée aux utilisateurs connectés.
- Le **Router** (`DefaultRouter`) génère toutes les URLs du CRUD + actions personnalisées automatiquement à partir d'une seule ligne `router.register(...)`.

---

## 8. Pistes d'amélioration futures

- Pagination sur les listes (`/produits/`, `/entrepots/`).
- Filtrage des produits par `etat` ou par `entrepot` (via `django-filter`).
- Documentation interactive (Swagger/OpenAPI) via `drf-spectacular`.
- Tests automatisés (`APITestCase`) pour `move` et `audit`.
- Gestion des permissions plus fines (ex: seul le gestionnaire d'un entrepôt peut le modifier).