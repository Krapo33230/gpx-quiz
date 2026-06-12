# DESIGN.md — Concours Police
> Lire ce fichier AVANT tout travail sur un composant visuel.
> Chaque écran choisit UN effet dans la boîte à effets ci-dessous.
> Ne pas mélanger plus de 2 effets par écran.

## 1. PALETTE
--bleu-fr:      #002395   (bleu officiel drapeau français)
--bleu-fonce:   #001249   (fond principal)
--bleu-mid:     #001E6B   (surface / cartes)
--bleu-light:   #0035A8   (accents, bordures actives)
--rouge-fr:     #EF4135   (rouge officiel drapeau français)
--rouge-fonce:  #8B0000   (rouge sombre, alertes)
--blanc:        #F0F4FF   (blanc légèrement bleuté)
--argent:       #D0D8E8   (textes secondaires)
--paper:        #dfe8f5   (fond document / cahier)
--paper-warm:   #f5f0e4   (fond formulaire officiel)
--stamp-green:  #1e6b3a   (validation)

INTERDIT : gray-100, #f3f4f6, or #c9a84c, or #e8cc80, vert #10b981, blanc pur #ffffff

## 2. TYPOGRAPHIE
- Titres institutionnels : fontWeight 900, uppercase, letterSpacing 0.08em+
- Manuscrit/cahier : Caveat (rotation ±1.5deg autorisée)
- Codes/données/labels : fontFamily monospace, uppercase, letterSpacing 0.15em+
- Corps : Inter 400/500 (system font)

## 3. RÈGLES
- border-radius : 2px maximum
- Ombres : bleu-fonce ou rouge-fr
- Fond principal : toujours --bleu-fonce sauf sections document
- Séparateurs : dégradé tricolore (bleu-fr → blanc → rouge-fr)
- Barre de progression : height 3–6px, sans border-radius, sans or

## 4. EFFETS

### EFFET-01 · Drapeau & Institutionnel
Quand : Splash, accueil, navigation
- Fond : bleu-fonce
- Bandes tricolores verticales en fond opacité 0.15 (bleu-fr / blanc / rouge-fr)
- Cards : bleu-mid, border bleu-light, coin biseauté top-right
- Badge PN : carré, border 2px blanc, fond bleu-mid, texte blanc bold

### EFFET-02 · Cahier de Révision
Quand : Listes modules, fiches révision
- Fond #dfe8f5 + lignes bleues opacité 0.55 espacement 33px
- Marge rouge-fr 3px opacité 0.6 à 68px du bord
- Spirale SVG stroke 3px, ellipses rx:12 ry:16, pattern 44px
- Perforations 22px, triple ombre
- Bords déchirés amplitude 32px
- Titres bold rotation -1deg
- Annotations rouge-fr avec flèche ➜

### EFFET-03 · Formulaire Officiel
Quand : Quiz, questions
- Fond #f5f0e4
- Filigrane diagonal "SESSION 2024" opacité 0.04
- Cases à cocher carrées style administratif
- Numérotation monospace "Q.07 / 20"
- Tampon VALIDÉ/REFUSÉ rotatif ±8deg

### EFFET-04 · Tampon & Validation
Quand : Bonne réponse, module complété
- Double bordure stamp-green ou rouge-fr
- Texte bold uppercase rotation 8deg
- Animation scale 0.4→1 durée 0.3s

### EFFET-05 · Alerte Signalétique
Quand : Mauvaise réponse, urgence
- Bandes diagonales 45deg rouge-fr/bleu-fonce 8px
- Border-left 4px rouge-fr
- Fond rouge-fonce

### EFFET-06 · Diplôme République
Quand : Résultats, certificats, rang débloqué
- Double bordure blanc : 2px solid blanc + inset 6px
- Ornements ✦ aux coins (couleur blanc)
- Bande tricolore horizontale en bas
- Shimmer blanc sur CTA

### EFFET-07 · Carte Officielle / Profil
Quand : Profil candidat
- Bande verticale gauche 8px rouge-fr
- Données 2 colonnes : label monospace + valeur Inter
- Numéro dossier monospace bottom-right
- Fond bleu-mid

## 5. COMPOSANTS RÉCURRENTS
- Badge PN : carré, border 2px --blanc, fond --bleu-mid, texte blanc bold uppercase
- Barre progression : height 6px, pas border-radius, couleur bleu-fr ou rouge-fr
- CTA principal : fond bleu-fr, texte blanc, bold uppercase
- CTA secondaire : border 2px blanc, fond transparent, texte blanc
- Séparateur : ligne dégradée bleu-fr → blanc → rouge-fr (tricolore)

## 6. JAMAIS
- border-radius > 2px
- Or (#c9a84c, #e8cc80, #7a6030) — remplacé par blanc ou rouge-fr
- Couleurs hors palette
- Effets cahier opacité < 0.4
- Spirale stroke < 2.5px
- Perforations < 20px
- Bords déchirés amplitude < 24px
- Gradients génériques bleu/violet
- Animations > 0.4s
