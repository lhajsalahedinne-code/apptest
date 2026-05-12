# 🥞 Creamy Bites - Pancake Shop Website

Une boutique de pancakes futuriste avec un design neon spectaculaire. Site statique vanilla HTML5, CSS3 et JavaScript vanilla sans dépendances externes (sauf Three.js optionnel pour l'animation du héros).

**Démo en ligne:** Ouvrez simplement `index.html` dans votre navigateur.

---

## 📋 Table des Matières

- [Caractéristiques](#caractéristiques)
- [Structure du Projet](#structure-du-projet)
- [Installation Locale](#installation-locale)
- [Pages et Fonctionnalités](#pages-et-fonctionnalités)
- [Personnalisation](#personnalisation)
- [Configuration EmailJS](#configuration-emailjs)
- [Déploiement](#déploiement)
- [Sécurité](#sécurité)
- [Raccourcis Clavier](#raccourcis-clavier)
- [Dépannage](#dépannage)

---

## ✨ Caractéristiques

### Design & UX
- **Design Futuriste Neon**: Palette de couleurs vibrante (#FF4DA6, #00E5FF, #5B2A86, #FFD166)
- **Glassmorphism**: Cartes et conteneurs avec effet de verre dépoli
- **Animations 3D**: Logo 3D rotatif avec Three.js (fallback CSS)
- **Fond Cinématique**: Particules animées et parallaxe
- **Responsive Design**: Fonctionne parfaitement sur mobile, tablette et desktop
- **Accessibilité**: Navigation au clavier, ARIA labels, contraste élevé

### Fonctionnalités
- **Panier Persistant**: Stockage localStorage, fonctionne hors ligne
- **Gestion des Produits**: Ajouter, modifier, supprimer des pancakes
- **Système de Commandes**: Formulaire de checkout avec validation
- **Admin Panel**: Authentification côté client, CRUD complet
- **Import/Export JSON**: Sauvegarde et restauration des données
- **Intégration EmailJS**: Envoi d'emails de confirmation (optionnel)
- **Recherche & Filtres**: Recherche en temps réel et filtrage par tags

### Performance
- **Lazy Loading**: Images chargées à la demande
- **Optimisation Web**: Pas de build tools, fichiers statiques purs
- **Prefers-Reduced-Motion**: Respect des préférences d'accessibilité
- **CDN**: Three.js et EmailJS via CDN (fallbacks inclus)

---

## 📁 Structure du Projet

```
creamy-bites/
├── index.html                 # Page d'accueil avec héros 3D
├── menu.html                  # Grille de produits et panier
├── checkout.html              # Formulaire de commande
├── admin.html                 # Panneau administrateur (protégé par mot de passe)
├── about.html                 # À propos et contact
├── README.md                  # Ce fichier
│
├── css/
│   └── style.css              # Styles globaux (2000+ lignes)
│
├── js/
│   └── app.js                 # Logique applicative (800+ lignes)
│
└── assets/
    └── pancakes/
        ├── pancake1.jpg       # Images de produits
        ├── pancake2.jpg
        ├── pancake3.jpg
        ├── pancake4.jpg
        ├── pancake5.jpg
        └── pancake6.jpg
```

---

## 🚀 Installation Locale

### Prérequis
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)
- Aucune installation serveur requise!

### Étapes

1. **Téléchargez le projet**
   ```bash
   # Via Git
   git clone <repository-url>
   cd creamy-bites
   
   # Ou téléchargez le ZIP et extrayez-le
   ```

2. **Ouvrez le site**
   ```bash
   # Option 1: Double-cliquez sur index.html
   
   # Option 2: Ouvrez avec un serveur local (recommandé)
   # Avec Python 3:
   python -m http.server 8000
   # Puis allez à http://localhost:8000
   
   # Avec Node.js:
   npx http-server
   # Puis allez à http://localhost:8080
   ```

3. **Testez les fonctionnalités**
   - Visitez le menu et ajoutez des produits au panier
   - Accédez au checkout pour passer une commande
   - Visitez `admin.html` (mot de passe: `hinsal.2007`)

---

## 📄 Pages et Fonctionnalités

### 🏠 Page d'Accueil (`index.html`)

**Contenu:**
- Arrière-plan cinématique avec Three.js (particules, lumières, caméra animée)
- Logo 3D rotatif "Creamy Bites" avec SVG fallback
- Tagline: "Pancakes men l-mostaqbal — Goûtez le futur"
- Deux CTA: Menu et Commander Maintenant

**Personnalisation:**
```javascript
// Dans index.html, cherchez:
// - Modifier le tagline (ligne ~150)
// - Changer les couleurs du gradient (css/style.css, variables CSS)
// - Ajuster la vitesse des animations (js/app.js, animate() function)
```

**Fallback:**
- Si Three.js ne charge pas, un gradient CSS animé s'affiche
- Fonctionne sur tous les navigateurs, même anciens

---

### 🥞 Page Menu (`menu.html`)

**Contenu:**
- Grille responsive de produits (6 pancakes par défaut)
- Recherche en temps réel
- Filtres par tags (Tous, Classique, Premium, Fruits, Chocolat)
- Panier mini-drawer

**Données de Produits:**
```javascript
// Dans js/app.js, DEFAULT_PRODUCTS (lignes 20-60)
// Modifiez les 6 pancakes:
{
  id: 1,
  name: 'Pancake Classique',
  description: 'Pancakes moelleux avec du beurre et du miel',
  price: 45,
  image: 'assets/pancakes/pancake1.jpg',
  tags: ['classic', 'vegetarian']
}
```

**Admin Panel (sur cette page):**
- Ajouter/Supprimer des pancakes (nécessite mot de passe: `hinsal.2007`)
- Exporter/Importer des produits en JSON

---

### 🛒 Page Checkout (`checkout.html`)

**Contenu:**
- Résumé du panier
- Formulaire de commande (prénom, nom, email, téléphone, adresse)
- Options de livraison (Express +50 DH, Emballage cadeau +20 DH)
- Validation côté client
- Calcul automatique de la taxe (10%)

**Après Soumission:**
- Message de confirmation en Darija: "La commande dazat, ansoniw lik lyoma!"
- Téléchargement automatique du reçu JSON
- Commande sauvegardée dans localStorage

**Intégration EmailJS:**
```javascript
// Dans checkout.html, fonction sendOrderEmail() (ligne ~400)
// Décommentez et remplacez:
// emailjs.init('YOUR_USER_ID');
// const SERVICE_ID = 'YOUR_SERVICE_ID';
// const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
```

---

### 🔐 Page Admin (`admin.html`)

**Authentification:**
- Mot de passe: `hinsal.2007`
- Prompt au chargement de la page
- ⚠️ **ATTENTION**: Authentification côté client uniquement (démo)

**Sections:**

1. **Tableau de Bord**
   - Statistiques: Nombre de produits, commandes, revenu total
   - Dernières commandes

2. **Gestion des Produits**
   - Ajouter nouveaux pancakes
   - Modifier (via prompt)
   - Supprimer (avec confirmation)
   - Table complète des produits

3. **Gestion des Commandes**
   - Voir toutes les commandes
   - Changer le statut (En attente → Complétée)
   - Exporter/Importer commandes

4. **Paramètres**
   - Exporter/Importer toutes les données
   - Réinitialiser aux produits par défaut
   - Supprimer toutes les commandes

---

### ℹ️ Page À Propos (`about.html`)

**Contenu:**
- Histoire de la marque
- Nos valeurs (6 cartes)
- Équipe (4 membres)
- Contact (email, téléphone, adresse)
- Liens sociaux (Instagram, Facebook, TikTok, Twitter)
- FAQ

**Personnalisation:**
```html
<!-- Modifiez dans about.html -->
<!-- Ligne ~150: Histoire -->
<!-- Ligne ~200: Valeurs -->
<!-- Ligne ~260: Équipe -->
<!-- Ligne ~340: Contact -->
```

---

## 🎨 Personnalisation

### Palette de Couleurs

Modifiez dans `css/style.css` (lignes 1-30):

```css
:root {
  --color-cream: #FFF7EE;           /* Fond clair */
  --color-neon-pink: #FF4DA6;       /* Rose néon (boutons, titres) */
  --color-neon-cyan: #00E5FF;       /* Cyan néon (accents) */
  --color-deep-violet: #5B2A86;     /* Violet foncé (gradients) */
  --color-accent-gold: #FFD166;     /* Or (prix, labels) */
}
```

### Logo et Branding

1. **Logo SVG** (index.html, ligne ~100):
   ```html
   <svg viewBox="0 0 400 200">
     <!-- Modifiez les formes et couleurs -->
   </svg>
   ```

2. **Texte du Logo** (header, toutes les pages):
   ```html
   <div class="logo">🥞 Creamy Bites</div>
   <!-- Remplacez "Creamy Bites" par votre nom -->
   ```

3. **Favicon** (toutes les pages):
   ```html
   <link rel="icon" type="image/svg+xml" 
     href="data:image/svg+xml,<svg>...</svg>">
   <!-- Modifiez l'emoji ou le SVG -->
   ```

### Données de Produits

1. **Ajouter/Modifier dans le Code** (js/app.js, lignes 20-60):
   ```javascript
   const DEFAULT_PRODUCTS = [
     {
       id: 1,
       name: 'Votre Pancake',
       description: 'Description',
       price: 50,
       image: 'assets/pancakes/pancake1.jpg',
       tags: ['tag1', 'tag2']
     }
   ];
   ```

2. **Via Admin Panel** (menu.html):
   - Allez à menu.html
   - Cliquez "Ajouter un Pancake"
   - Entrez le mot de passe: `hinsal.2007`
   - Remplissez le formulaire
   - Les données sont sauvegardées dans localStorage

3. **Importer/Exporter JSON**:
   ```bash
   # Exportez depuis admin.html
   # Modifiez le JSON
   # Importez via admin.html
   ```

### Images de Produits

1. **Remplacer les Placeholders**:
   ```bash
   # Supprimez les images générées:
   rm assets/pancakes/*.jpg
   
   # Ajoutez vos images:
   cp /chemin/vers/vos/images/* assets/pancakes/
   ```

2. **Noms de Fichiers**:
   - Gardez les noms: `pancake1.jpg`, `pancake2.jpg`, etc.
   - Ou modifiez dans `DEFAULT_PRODUCTS` (js/app.js)

3. **Format**:
   - JPEG, PNG, WebP supportés
   - Taille recommandée: 400x300px
   - Optimisez pour le web (< 100KB par image)

### Texte et Contenu

1. **Darija/Français**:
   - Modifiez directement dans les fichiers HTML
   - Cherchez les balises `<p>`, `<h1>`, etc.

2. **Métadonnées SEO**:
   ```html
   <!-- Dans chaque <head> -->
   <meta name="description" content="Votre description">
   <meta name="keywords" content="vos, mots-clés">
   <title>Votre Titre</title>
   ```

---

## 📧 Configuration EmailJS

### Pourquoi EmailJS?
- Envoi d'emails sans serveur backend
- Intégration simple côté client
- Gratuit jusqu'à 200 emails/mois

### Étapes

1. **Créer un Compte EmailJS**
   - Allez à https://www.emailjs.com/
   - Inscrivez-vous (gratuit)
   - Confirmez votre email

2. **Créer un Service Email**
   - Dashboard → Email Services
   - Cliquez "Add New Service"
   - Choisissez Gmail (ou autre)
   - Suivez les instructions
   - Notez le `Service ID` (ex: `service_abc123`)

3. **Créer un Template Email**
   - Dashboard → Email Templates
   - Cliquez "Create New Template"
   - Utilisez les variables:
     ```
     {{customer_name}}
     {{customer_email}}
     {{order_id}}
     {{order_date}}
     {{items}}
     {{total}}
     ```
   - Notez le `Template ID` (ex: `template_xyz789`)

4. **Obtenir votre User ID**
   - Dashboard → Account
   - Copiez votre `User ID`

5. **Configurer le Code**

   **Dans `checkout.html` (ligne ~400):**
   ```javascript
   // Décommentez et remplacez:
   EmailService.init('YOUR_USER_ID');
   
   // Dans sendOrderEmail() (ligne ~420):
   const SERVICE_ID = 'service_abc123';
   const TEMPLATE_ID = 'template_xyz789';
   
   // Décommentez emailjs.send():
   emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
   ```

6. **Tester**
   - Allez à checkout.html
   - Passez une commande test
   - Vérifiez votre email

### Fallback
- Si EmailJS n'est pas configuré, les commandes sont toujours sauvegardées localement
- Un message informe l'utilisateur que l'email n'a pas pu être envoyé

---

## 🌐 Déploiement

### Option 1: Netlify (Recommandé)

1. **Préparation**
   ```bash
   # Assurez-vous que tout fonctionne localement
   python -m http.server 8000
   ```

2. **Déployer**
   - Allez à https://netlify.com
   - Cliquez "Add new site"
   - Choisissez "Deploy manually"
   - Glissez-déposez le dossier `creamy-bites`
   - Attendez le déploiement

3. **Domaine Personnalisé**
   - Site settings → Domain management
   - Cliquez "Add custom domain"
   - Suivez les instructions

### Option 2: Vercel

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Déployer**
   ```bash
   cd creamy-bites
   vercel
   ```

3. **Suivez les prompts**
   - Sélectionnez votre projet
   - Confirmez les paramètres
   - Vercel génère une URL

### Option 3: GitHub Pages

1. **Créer un Repo GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/creamy-bites.git
   git push -u origin main
   ```

2. **Activer GitHub Pages**
   - Allez à Settings → Pages
   - Source: Branch `main`
   - Cliquez Save
   - Votre site est à `https://username.github.io/creamy-bites`

### Option 4: Hébergement Traditionnel (cPanel, etc.)

1. **Compressez le Dossier**
   ```bash
   zip -r creamy-bites.zip creamy-bites/
   ```

2. **Uploadez via FTP**
   - Connectez-vous à votre hébergement
   - Uploadez le ZIP
   - Extrayez-le
   - Accédez via votre domaine

---

## 🔒 Sécurité

### ⚠️ Avertissements Importants

1. **Authentification Admin**
   - ❌ **NE PAS UTILISER EN PRODUCTION**
   - Mot de passe visible dans le code source
   - Implémentez une authentification serveur:
     - JWT (JSON Web Tokens)
     - OAuth 2.0
     - Sessions sécurisées avec cookies HTTP-only

2. **Données Sensibles**
   - ❌ Pas de données bancaires
   - ❌ Pas de mots de passe réels
   - ✅ Stockage localStorage uniquement (navigateur local)

3. **EmailJS**
   - ❌ Ne mettez pas de clés secrètes en frontend
   - ✅ Utilisez les clés publiques EmailJS uniquement
   - ✅ Validez les données côté serveur

4. **Recommandations Production**
   ```
   ✅ Implémentez un backend (Node.js, Python, PHP)
   ✅ Utilisez HTTPS obligatoirement
   ✅ Validez et sanitisez les entrées
   ✅ Authentification robuste (JWT, OAuth)
   ✅ Base de données sécurisée
   ✅ Rate limiting sur les APIs
   ✅ CORS configuré correctement
   ✅ Logs d'audit
   ✅ Chiffrement des données sensibles
   ```

---

## ⌨️ Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| `Alt + M` | Aller au Menu |
| `Alt + O` | Commander Maintenant |
| `Alt + C` | Ouvrir/Fermer le Panier |
| `Alt + A` | Ajouter un Produit (menu.html) |
| `Alt + R` | Supprimer un Produit (menu.html) |
| `Alt + S` | Soumettre le Formulaire (checkout.html) |
| `Alt + C` | Aller à la Section Contact (about.html) |

---

## 🐛 Dépannage

### Le site ne charge pas

**Solution:**
```bash
# Vérifiez que vous utilisez un serveur local:
python -m http.server 8000
# Allez à http://localhost:8000
```

### Les images ne s'affichent pas

**Solution:**
```bash
# Vérifiez les chemins:
# - Fichiers: assets/pancakes/pancake1.jpg
# - Dans le code: 'assets/pancakes/pancake1.jpg'

# Régénérez les placeholders:
python3 create-placeholders.sh
```

### Three.js ne charge pas

**Solution:**
- C'est normal! Un fallback CSS s'affiche
- Vérifiez votre connexion internet (CDN)
- Le site fonctionne sans Three.js

### Le panier ne persiste pas

**Solution:**
```javascript
// Vérifiez localStorage dans DevTools:
// F12 → Application → Local Storage
// Cherchez "creamy_bites_cart"

// Réinitialisez:
localStorage.clear();
location.reload();
```

### Admin panel ne fonctionne pas

**Solution:**
```javascript
// Mot de passe: hinsal.2007
// Vérifiez la casse (sensible)

// Réinitialisez le mot de passe dans js/app.js:
const ADMIN_PASSWORD = 'hinsal.2007';
```

### EmailJS ne fonctionne pas

**Solution:**
```javascript
// Vérifiez dans console (F12):
console.log(emailjs); // Doit être défini

// Vérifiez les IDs:
// - User ID
// - Service ID
// - Template ID

// Testez manuellement:
// https://www.emailjs.com/docs/
```

### Erreurs de validation de formulaire

**Solution:**
```javascript
// Formats acceptés:
// Email: valide@email.com
// Téléphone: +212 6 12 34 56 78 (format marocain)

// Vérifiez dans console:
console.log(isValidEmail('test@example.com'));
console.log(isValidPhone('+212612345678'));
```

---

## 📱 Responsive Design

Le site s'adapte automatiquement:

| Écran | Breakpoint | Comportement |
|-------|-----------|--------------|
| Desktop | > 1200px | Grille 3 colonnes |
| Tablette | 768px - 1200px | Grille 2 colonnes |
| Mobile | < 768px | Grille 1 colonne |

**Tester:**
```bash
# Ouvrez DevTools (F12)
# Cliquez sur l'icône mobile
# Testez sur différentes tailles
```

---

## 🎯 Optimisations Possibles

Pour améliorer le site:

1. **Performance**
   - Minifier CSS/JS
   - Compresser les images (WebP)
   - Service Workers pour offline

2. **Fonctionnalités**
   - Système de paiement (Stripe, PayPal)
   - Authentification utilisateur
   - Historique des commandes
   - Wishlist/Favoris

3. **SEO**
   - Sitemap.xml
   - robots.txt
   - Structured data (JSON-LD)
   - Open Graph tags

4. **Analytics**
   - Google Analytics
   - Tracking des conversions
   - Heatmaps

---

## 📞 Support & Contribution

### Signaler un Bug
- Créez une issue sur GitHub
- Décrivez le problème
- Incluez des screenshots

### Contribuer
- Fork le projet
- Créez une branche (`feature/amazing-feature`)
- Committez vos changements
- Poussez et créez une Pull Request

---

## 📄 Licence

Ce projet est fourni à titre d'exemple éducatif. Utilisez-le librement pour votre boutique.

---

## 🙏 Remerciements

- **Three.js**: Pour les animations 3D
- **EmailJS**: Pour l'intégration email
- **Netlify/Vercel**: Pour l'hébergement facile

---

## 📝 Notes Finales

### Checklist Avant Production

- [ ] Remplacez les images placeholders
- [ ] Configurez EmailJS (ou désactivez)
- [ ] Changez le mot de passe admin
- [ ] Testez sur tous les navigateurs
- [ ] Testez sur mobile
- [ ] Configurez le domaine personnalisé
- [ ] Activez HTTPS
- [ ] Mettez en place un backend pour la sécurité
- [ ] Configurez les analytics
- [ ] Testez le formulaire de checkout
- [ ] Vérifiez les métadonnées SEO

### Prochaines Étapes

1. Implémentez un backend (Node.js + Express, Django, etc.)
2. Ajoutez une base de données (MongoDB, PostgreSQL)
3. Intégrez un système de paiement
4. Configurez l'authentification utilisateur
5. Mettez en place un CMS pour les produits

---

**Bon courage avec votre boutique de pancakes futuriste! 🚀✨**

Pour toute question, consultez la documentation ou contactez l'équipe de développement.
