# DESIGN.md — Concours Police
> Lire ce fichier AVANT tout travail sur un composant visuel.
> Chaque écran choisit UN effet dans la boîte à effets ci-dessous.
> Ne pas mélanger plus de 2 effets par écran.

## 1. PALETTE
--navy:        #0a1628
--navy-mid:    #0f2040
--navy-light:  #1a3560
--gold:        #c9a84c
--gold-light:  #e8cc80
--gold-dim:    #7a6030
--silver:      #d0d8e8
--white:       #f0f4ff
--paper:       #dfe8f5
--paper-warm:  #f5f0e4
--red-alert:   #c0392b
--stamp-green: #1e6b3a

INTERDIT : gray-100, #f3f4f6, bleu #3b82f6, vert #10b981, blanc pur #ffffff

## 2. TYPOGRAPHIE
- Titres institutionnels : Cinzel (letter-spacing min 0.08em)
- Manuscrit/cahier : Caveat (rotation ±1.5deg autorisée)
- Codes/données/labels : Courier Prime (uppercase + letter-spacing 0.15em+)
- Corps : Inter 400/500

## 3. RÈGLES CSS
- border-radius : 2px maximum
- Ombres : box-shadow custom navy ou gold
- Fond : toujours --navy sauf sections document

## 4. EFFETS

### EFFET-01 · Institutionnel Navy
Quand : Dashboard, accueil, navigation
- Texture fond : repeating-linear-gradient lignes fines opacité 0.012
- Cards : navy-mid, border gold-dim, coin biseauté top-right
- Badge SVG étoile 12 branches PN en stroke gold

### EFFET-02 · Cahier de Révision
Quand : Listes modules, fiches révision
- Fond #dfe8f5 + lignes bleues opacité 0.55 espacement 33px
- Marge rouge 3px opacité 0.6 à 68px du bord
- Spirale SVG stroke 3px, ellipses rx:12 ry:16, pattern 44px
- Perforations 22px, triple ombre
- Bords déchirés amplitude 32px
- Titres Caveat 2rem bold rotation -1deg
- Annotations rouges avec flèche ➜

### EFFET-03 · Formulaire Officiel
Quand : Quiz, questions
- Fond #f5f0e4
- Filigrane diagonal "SESSION 2024" opacité 0.04
- Cases à cocher carrées style administratif
- Numérotation Courier Prime "Q.07 / 20"
- Tampon VALIDÉ/REFUSÉ rotatif ±8deg

### EFFET-04 · Tampon & Validation
Quand : Bonne réponse, module complété
- Double bordure stamp-green ou stamp-red
- Texte Cinzel bold uppercase rotation 8deg
- Animation scale 0.4→1 durée 0.3s

### EFFET-05 · Alerte Signalétique
Quand : Mauvaise réponse, urgence
- Bandes diagonales 45deg rouge/navy 8px
- Border-left 4px red-alert
- Fond #1a0a06 → #2d1008

### EFFET-06 · Parchemin & Diplôme
Quand : Résultats, certificats, rang débloqué
- Double bordure gold : 2px solid gold-dim + inset 6px
- Ornements ✦ aux coins
- Sceau SVG PN avec halo pulsé
- Shimmer doré sur CTA

### EFFET-07 · Carte d'Identité / Profil
Quand : Profil candidat
- Bande verticale gauche 8px gold
- Hologramme SVG cercles concentriques opacité 0.08
- Données 2 colonnes : label Courier Prime + valeur Inter
- Numéro dossier Courier Prime bottom-right

## 5. COMPOSANTS RÉCURRENTS
- Badge PN : étoile 12 branches stroke gold, fill navy-mid, texte Cinzel
- Barre progression : height 6px, pas border-radius, glow gold à l'extrémité
- CTA : dégradé gold-dim→gold, couleur navy, Cinzel bold, shimmer animé
- Séparateur : ligne dégradée transparent→gold-dim→transparent

## 6. JAMAIS
- border-radius > 2px
- Couleurs hors palette
- Effets cahier opacité < 0.4
- Spirale stroke < 2.5px
- Perforations < 20px
- Bords déchirés amplitude < 24px
- Gradients bleu/violet génériques
- Animations > 0.4s
