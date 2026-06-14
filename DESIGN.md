# DESIGN.md — ConcoursPolice
> Lire ce fichier AVANT tout travail sur un composant visuel.
> Style cible : moderne, épuré, motivant — inspiré Duolingo / apps de quiz actuelles.

## 1. PALETTE
--bleu-fr:      #002395   (bleu officiel drapeau français)
--bleu-fonce:   #001249   (fond principal)
--bleu-mid:     #001E6B   (surface / cartes)
--bleu-light:   #0035A8   (accents, bordures actives)
--rouge-fr:     #EF4135   (rouge officiel drapeau français)
--rouge-fonce:  #8B0000   (rouge sombre, alertes)
--blanc:        #F0F4FF   (blanc légèrement bleuté)
--argent:       #D0D8E8   (textes secondaires)
--success:      #58CC02   (vert Duolingo — validations)
--warning:      #FFC800   (jaune — streak, attention)

INTERDIT : or (#c9a84c), gris génériques (#f3f4f6), blanc pur #ffffff, gradients bleu/violet génériques

## 2. TYPOGRAPHIE
- Titres : fontWeight 800–900, pas de letterSpacing excessif
- Labels : fontWeight 700, uppercase autorisé mais letterSpacing max 1.5
- Corps : fontSize 15–16, fontWeight 400–500, lineHeight 1.5
- Pas de polices custom pour l'instant (pas expo-font installé)

## 3. RÈGLES
- border-radius : 12px cards, 16px cards larges, 100px boutons pill, 8px petits éléments
- Ombres légères : elevation 3–6, shadowOpacity 0.15–0.25
- Fond principal : #001249
- Fond cartes : #001E6B ou légèrement plus clair
- Bordures : rgba(255,255,255,0.08) — subtiles

## 4. COMPOSANTS RÉCURRENTS
- Bouton principal : fond bleu-fr, texte blanc, fontWeight 800, borderRadius 100
- Bouton secondaire : border 2px blanc/bleu-light, fond transparent, borderRadius 100
- Card : fond bleu-mid, borderRadius 16, border rgba(255,255,255,0.08)
- Barre progression : height 10px, borderRadius 100, couleur success ou bleu-fr
- Cercles/badges : borderRadius 100 (cercle)
- Streak : couleur warning (#FFC800) ou danger (#EF4135)
- Séparateur tricolore : 3 segments bleu-fr / blanc / rouge-fr

## 5. STYLE GÉNÉRAL
- Beaucoup d'espace (padding généreux)
- Emojis autorisés pour rendre l'UI vivante (streak 🔥, succès ✅, XP ⚡)
- Animations : spring fluides, pas de timing trop long (max 400ms)
- Hiérarchie claire : 1 titre par section, 1 action principale par écran

## 6. JAMAIS
- border-radius < 8px sauf séparateurs/lignes
- Couleurs or, gris foncé génériques
- Effets "tampon", "parchemin", "administratif"
- letterSpacing > 2
- Animations > 400ms
- Trop de texte sur un écran
