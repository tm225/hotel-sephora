# Sephora Hôtel — Site web

Site vitrine du Sephora Hôtel : présentation de l'établissement, des chambres,
des espaces communs et des informations de réservation.

## Structure du projet

```
.
├── index.html          -> page unique du site
├── images/              -> toutes les photos utilisées sur le site
├── .nojekyll            -> désactive le traitement Jekyll sur GitHub Pages
└── README.md
```

## Avant de publier

Dans `index.html`, remplacer les trois champs marqués `[À compléter]`
(section "Réservation" vers la fin du fichier) par :
- l'adresse exacte de l'hôtel
- le numéro de téléphone / WhatsApp
- l'adresse e-mail

## Mettre en ligne avec GitHub Pages

1. Aller dans **Settings** du dépôt (⚙️ en haut du dépôt)
2. Dans le menu de gauche, cliquer sur **Pages**
3. Sous "Build and deployment" → **Source**, choisir **Deploy from a branch**
4. Choisir la branche **main** et le dossier **/ (root)**, puis **Save**
5. Après une à deux minutes, le site est en ligne à l'adresse indiquée en haut
   de la page Pages (généralement `https://<utilisateur>.github.io/<depot>/`)

Toute future modification (nouvelle photo, texte corrigé) mise en ligne sur la
branche `main` sera automatiquement republiée en quelques minutes.
