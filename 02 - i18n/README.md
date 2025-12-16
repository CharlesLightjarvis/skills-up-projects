# Guide d'internationalisation (i18n) avec React + TanStack Router

Guide complet pour mettre en place l'internationalisation dans une application React utilisant TanStack Router.

## 📦 Installation

Installez les packages nécessaires :

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

**Packages installés :**

- `i18next` : Bibliothèque core pour la gestion des traductions
- `react-i18next` : Intégration React pour i18next
- `i18next-browser-languagedetector` : Détection automatique de la langue du navigateur

## 📁 Structure des dossiers

Créez la structure suivante dans votre projet :

```
src/
├── i18n/
│   ├── locales/
│   │   ├── en.json
│   │   └── fr.json
│   └── config.ts
├── hooks/
│   └── useLocaleTranslation.ts
└── routes/
    ├── index.tsx
    └── profile.tsx
```

## 🌍 Fichiers de traduction

Organisez vos traductions par namespace (page/domaine) dans des fichiers JSON séparés par langue.

### src/i18n/locales/en.json

```json
{
  "home": {
    "welcome": "Welcome to my i18n app",
    "description": "This is a multilingual application"
  },
  "profile": {
    "title": "User Profile",
    "edit": "Edit profile"
  }
}
```

### src/i18n/locales/fr.json

```json
{
  "home": {
    "welcome": "Bienvenue dans mon app i18n",
    "description": "Ceci est une application multilingue"
  },
  "profile": {
    "title": "Profil utilisateur",
    "edit": "Modifier le profil"
  }
}
```

## ⚙️ Configuration i18next

### src/i18n/config.ts

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import fr from './locales/fr.json'

i18n
  .use(LanguageDetector) // Détecte automatiquement la langue du navigateur
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    // lng: 'fr', // ⚠️ À enlever pour activer la détection automatique
    fallbackLng: 'en', // Langue par défaut si non supportée
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
    detection: {
      // Ordre de détection : localStorage d'abord, puis navigateur
      order: ['localStorage', 'navigator'],
      // Sauvegarde le choix de l'utilisateur dans localStorage
      caches: ['localStorage'],
      // Clé utilisée dans localStorage (important !)
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
```

**Options importantes :**

- `order` : Ordre de priorité pour détecter la langue (localStorage en premier pour persister le choix)
- `caches` : Où sauvegarder la langue choisie
- `lookupLocalStorage` : Nom de la clé dans le localStorage (crucial pour la persistance)

## 🎣 Hook personnalisé

Créez un hook réutilisable pour simplifier l'utilisation dans vos composants.

### src/hooks/useLocaleTranslation.ts

```typescript
import { useTranslation } from 'react-i18next'

export function useLocaleTranslation() {
  const { t, i18n } = useTranslation()

  return {
    t, // Fonction de traduction
    currentLang: i18n.language, // Langue active
    changeLanguage: i18n.changeLanguage, // Changer de langue
    languages: ['en', 'fr'], // Langues supportées
  }
}
```

## 🔌 Initialisation dans l'app

Importez la configuration i18n dans votre point d'entrée **avant** le rendu de l'application.

### src/main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n/config' // ⚠️ Important : importer avant l'App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

## 🎯 Utilisation dans les composants

### Page Home - src/routes/index.tsx

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { useLocaleTranslation } from '@/hooks/useLocaleTranslation'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { t, changeLanguage, currentLang, languages } = useLocaleTranslation()

  return (
    <div>
      <h1>{t('home.welcome')}</h1>
      <p>{t('home.description')}</p>
      <p>Langue actuelle : {currentLang}</p>

      {/* Boutons de changement de langue */}
      <div>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            disabled={currentLang === lang}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
```

### Page Profile - src/routes/profile.tsx

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { useLocaleTranslation } from '@/hooks/useLocaleTranslation'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { t, currentLang } = useLocaleTranslation()

  return (
    <div>
      <h1>{t('profile.title')}</h1>
      <button>{t('profile.edit')}</button>
      <p>Langue : {currentLang}</p>
    </div>
  )
}
```

## 🎨 Utilisation des traductions

### Syntaxe de base

```typescript
// Traduction simple
t('home.welcome') // "Welcome to my i18n app"

// Traduction avec namespace
t('profile.title') // "User Profile"
```

### Organisation par namespace

Organisez vos traductions par domaine fonctionnel pour une meilleure maintenabilité :

```json
{
  "home": { ... },      // Page d'accueil
  "profile": { ... },   // Page profil
  "common": { ... },    // Éléments communs (header, footer, etc.)
  "auth": { ... }       // Authentification
}
```

## 🔍 Débogage

### Vérifier le localStorage

1. Ouvrez les DevTools du navigateur
2. Allez dans **Application** → **Local Storage**
3. Cherchez la clé `i18nextLng`
4. La valeur doit changer quand vous changez de langue

### Console de débogage

Ajoutez des logs pour vérifier le fonctionnement :

```typescript
function HomePage() {
  const { t, currentLang } = useLocaleTranslation()

  console.log('Langue actuelle:', currentLang)
  console.log('localStorage:', localStorage.getItem('i18nextLng'))

  // ...
}
```

## ✅ Avantages de cette approche

- **Détection automatique** : Utilise la langue du navigateur par défaut
- **Persistance** : Le choix de l'utilisateur est sauvegardé
- **Organisation** : Traductions organisées par namespace/page
- **Réutilisable** : Hook personnalisé pour simplifier l'utilisation
- **Type-safe** : Compatible avec TypeScript
- **Performance** : Pas de re-render inutiles

## 🚀 Aller plus loin

### Ajouter une nouvelle langue

1. Créez `src/i18n/locales/ar.json`
2. Ajoutez-le dans `config.ts` :

```typescript
import ar from './locales/ar.json'

i18n.init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar }, // Nouvelle langue
  },
  // ...
})
```

3. Mettez à jour le hook :

```typescript
languages: ['en', 'fr', 'ar']
```

### Interpolation de variables

```json
{
  "greeting": "Hello {{name}}!"
}
```

```typescript
t('greeting', { name: 'John' }) // "Hello John!"
```

### Pluralisation

```json
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}
```

```typescript
t('items', { count: 1 }) // "1 item"
t('items', { count: 5 }) // "5 items"
```

### Backend (optionnel)

Si vous avez besoin de charger les traductions depuis un backend :

```typescript
import Backend from 'i18next-http-backend'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/api/locales/{{lng}}/{{ns}}.json',
    },
    // ... reste de la config
  })
```

---

**🎉 C'est tout !** Votre app est maintenant entièrement internationalisée avec persistance de la langue et détection automatique.
