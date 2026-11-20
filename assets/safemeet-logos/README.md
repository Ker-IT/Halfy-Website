# SafeMeet : kit de logos

Couleurs extraites de votre visuel : bleu `#2665EC`, rouge `#EE4949`.
Tous les fichiers sont sur **fond transparent**, sauf ceux où la plateforme l'interdit
ou l'exige (voir « Exceptions »). Ouvrez `preview-sheet.png` pour un aperçu.

## Contenu

| Dossier | Fichiers | Usage |
|---|---|---|
| `svg/` | lockup, symbole, wordmark (couleur et blanc), symbole monochrome | Sources vectorielles, à privilégier partout où le SVG est accepté |
| `web/` | logos PNG (lockup 400/800/1600 px, symbole 128 à 1024 px, wordmark), versions `-white` pour fonds sombres | Site, emails, documents |
| `web/` | `favicon.ico` (16/32/48), `favicon.svg`, `favicon-16/32/48.png`, `icon-192.png`, `icon-512.png` | Favicons et PWA |
| `web/` | `apple-touch-icon.png` (180), `icon-maskable-512.png`, `og-image-1200x630.png` | Exceptions opaques (voir plus bas) |
| `ios/` | `AppIcon-1024.png` | Icône App Store / Xcode |
| `ios/` | `AppIcon-1024-foreground-transparent.png`, `...-mono-white.png` | Calques pour les variantes sombre/teintée d'iOS 18 (optionnel) |
| `android/adaptive/` | `ic_launcher_foreground-*`, `ic_launcher_monochrome-*` (mdpi à xxxhdpi), XML d'icône adaptative | Icône adaptative Android 8+ et icône thématique Android 13+ |
| `android/legacy/` | `ic_launcher-*`, `ic_launcher_round-*` | Android 7 et antérieur |
| `android/notification/` | `ic_stat_notification-*` (24 à 96 px) | Icône de notification (blanc sur transparent) |
| `android/` | `playstore-icon-512.png` | Fiche Google Play |
| `expo/` | `icon.png`, `adaptive-icon.png`, `adaptive-icon-monochrome.png`, `splash-icon(.png/-dark.png)`, `favicon.png`, `notification-icon.png` | Projet Expo/React Native (votre app mobile) |

## Exceptions : fichiers non transparents (volontairement)

- **iOS `AppIcon-1024.png`** : Apple exige un carré opaque, sans canal alpha ni coins arrondis (iOS arrondit lui-même).
- **`apple-touch-icon.png`** : iOS remplit la transparence en noir.
- **`icon-maskable-512.png`** : une icône maskable doit être pleine pour que le masque s'applique.
- **`playstore-icon-512.png`** : Google Play applique son propre masque sur un carré plein.
- **`og-image-1200x630.png`** : les réseaux sociaux n'affichent pas toujours la transparence correctement.
- **`android/legacy/`** : icônes aux formes arrondies/rondes pour les anciennes versions d'Android.

## Intégration Expo (`app.json`, à adapter selon votre version d'Expo)

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "monochromeImage": "./assets/adaptive-icon-monochrome.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": { "favicon": "./assets/favicon.png" },
    "plugins": [
      ["expo-splash-screen", {
        "image": "./assets/splash-icon.png",
        "imageWidth": 200,
        "backgroundColor": "#FFFFFF",
        "dark": { "image": "./assets/splash-icon-dark.png", "backgroundColor": "#0B1020" }
      }],
      ["expo-notifications", { "icon": "./assets/notification-icon.png", "color": "#2665EC" }]
    ]
  }
}
```

## Intégration web (`<head>`)

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta property="og:image" content="https://votre-domaine/og-image-1200x630.png">
```

Dans `manifest.webmanifest`, déclarez `icon-192.png` et `icon-512.png` (purpose `any`),
et `icon-maskable-512.png` (purpose `maskable`).

## Android natif (hors Expo)

Copiez chaque fichier de `android/adaptive/` vers le dossier `mipmap-<densité>/` correspondant
en le renommant `ic_launcher_foreground.png` et `ic_launcher_monochrome.png`. Même principe pour
`legacy/` (`ic_launcher.png`, `ic_launcher_round.png`) et `notification/` (`drawable-<densité>/ic_stat_notification.png`).
Placez les deux XML dans `values/` et `mipmap-anydpi-v26/`.

## Limites de ce kit

Ces fichiers ont été **vectorisés à partir de l'image PNG fournie** (1448 px), pas à partir d'un
fichier source du designer. Les formes sont fidèles, mais les contours du mot « SafeMeet » peuvent
différer très légèrement de la police d'origine. Pour une identité définitive (impression, packaging),
demandez le fichier vectoriel original (SVG, AI ou PDF) et régénérez les exports.
