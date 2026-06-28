export const QUESTIONS_LOGIQUE_2 = [
  // ── SYLLOGISMES ──────────────────────────────────────────────────────────────
  {
    id: 'L031',
    categorie: 'LOGIQUE',
    enonce: 'Tous les chiens sont des mammifères. Tous les mammifères respirent. Conclusion ?',
    options: [
      'Certains chiens ne respirent pas',
      'Tous les chiens respirent',
      'Les mammifères sont tous des chiens',
      'On ne peut rien conclure',
    ],
    correctIndex: 1,
    explication:
      'Syllogisme en chaîne : chiens ⊂ mammifères ⊂ êtres qui respirent. Donc tous les chiens respirent.',
  },
  {
    id: 'L032',
    categorie: 'LOGIQUE',
    enonce: 'Aucun gardien n\'est menteur. Marc est gardien. Conclusion ?',
    options: [
      'Marc est peut-être menteur',
      'Marc est menteur',
      'Marc n\'est pas menteur',
      'Marc n\'est pas gardien',
    ],
    correctIndex: 2,
    explication:
      'Aucun gardien ∈ menteurs. Marc ∈ gardiens. Donc Marc ∉ menteurs — Marc n\'est pas menteur.',
  },
  {
    id: 'L033',
    categorie: 'LOGIQUE',
    enonce: 'Certains agents sont des femmes. Toutes les femmes aiment le sport. Peut-on dire que certains agents aiment le sport ?',
    options: [
      'Oui, certainement',
      'Non, aucun agent n\'aime le sport',
      'On ne peut pas conclure',
      'Tous les agents aiment le sport',
    ],
    correctIndex: 0,
    explication:
      'Les agents-femmes (sous-ensemble non vide) aiment toutes le sport. Donc oui, certains agents aiment le sport.',
  },
  {
    id: 'L034',
    categorie: 'LOGIQUE',
    enonce: 'Si P → Q et Q → R, alors si P est vrai, R est :',
    options: ['Faux', 'Vrai', 'Inconnu', 'Impossible'],
    correctIndex: 1,
    explication:
      'Syllogisme hypothétique : P→Q et Q→R impliquent P→R. Si P est vrai, alors R est vrai.',
  },
  {
    id: 'L035',
    categorie: 'LOGIQUE',
    enonce: 'Tous les stagiaires travaillent dur. Luc ne travaille pas dur. Qu\'en déduit-on ?',
    options: [
      'Luc est peut-être stagiaire',
      'Luc n\'est pas stagiaire',
      'Luc est paresseux',
      'Rien ne peut être conclu',
    ],
    correctIndex: 1,
    explication:
      'Contraposée : si ¬travaille dur → ¬stagiaire. Luc ne travaille pas dur, donc Luc n\'est pas stagiaire.',
  },
  // ── DÉDUCTIONS LOGIQUES ───────────────────────────────────────────────────────
  {
    id: 'L036',
    categorie: 'LOGIQUE',
    enonce: 'Si aujourd\'hui il pleut, je prends un parapluie. Je n\'ai pas pris de parapluie. Conclusion ?',
    options: [
      'Il pleut',
      'Il ne pleut pas',
      'J\'ai un parapluie',
      'On ne peut pas savoir',
    ],
    correctIndex: 1,
    explication:
      'Modus tollens : P→Q, ¬Q ⊢ ¬P. Sans parapluie (¬Q), donc il ne pleut pas (¬P).',
  },
  {
    id: 'L037',
    categorie: 'LOGIQUE',
    enonce: 'A ou B est coupable (au moins un). A n\'est pas coupable. Conclusion ?',
    options: ['A est coupable', 'B est coupable', 'Ni A ni B', 'On ne sait pas'],
    correctIndex: 1,
    explication:
      'Disjonction : A ∨ B. A est faux. Par le syllogisme disjonctif, B est coupable.',
  },
  {
    id: 'L038',
    categorie: 'LOGIQUE',
    enonce: '"Il est impossible que Paul soit à la fois en réunion et en patrouille." Paul est en réunion. Où est-il ?',
    options: [
      'En patrouille aussi',
      'Pas en patrouille',
      'En réunion et en patrouille',
      'On ne peut pas savoir',
    ],
    correctIndex: 1,
    explication:
      '¬(Réunion ∧ Patrouille). Réunion est vraie, donc Patrouille doit être fausse.',
  },
  {
    id: 'L039',
    categorie: 'LOGIQUE',
    enonce: 'Cinq suspects. L\'un deux est l\'auteur. Ali a un alibi. Bob aussi. Carlos aussi. Dina aussi. Qui est l\'auteur ?',
    options: ['Ali', 'Bob', 'Carlos', 'Le cinquième suspect'],
    correctIndex: 3,
    explication:
      'Déduction par élimination : Ali, Bob, Carlos et Dina ont un alibi. Le cinquième (restant) est l\'auteur.',
  },
  {
    id: 'L040',
    categorie: 'LOGIQUE',
    enonce: 'Si je travaille, je réussis. Si je réussis, je suis heureux. Je ne suis pas heureux. Que conclure ?',
    options: [
      'Je travaille et je réussis',
      'Je ne travaille pas',
      'Je suis peut-être heureux',
      'Je réussis sans être heureux',
    ],
    correctIndex: 1,
    explication:
      'Chaîne : Travail→Réussite→Heureux. Contraposée de la chaîne : ¬Heureux→¬Réussite→¬Travail. Donc je ne travaille pas.',
  },
  // ── PROBLÈMES D'ÂGE ET DE RELATIONS ─────────────────────────────────────────
  {
    id: 'L041',
    categorie: 'LOGIQUE',
    enonce: 'Paul a 3 fois l\'âge de sa fille. Dans 12 ans, il aura 2 fois son âge. Quel est l\'âge actuel de Paul ?',
    options: ['36 ans', '24 ans', '30 ans', '42 ans'],
    correctIndex: 0,
    explication:
      'Soit f l\'âge de la fille. Paul = 3f. Dans 12 ans : 3f+12 = 2(f+12) → 3f+12 = 2f+24 → f = 12. Paul = 3×12 = 36 ans.',
  },
  {
    id: 'L042',
    categorie: 'LOGIQUE',
    enonce: 'La somme des âges de deux frères est 30. L\'un est 4 ans plus âgé que l\'autre. Quel est l\'âge du plus jeune ?',
    options: ['13 ans', '14 ans', '12 ans', '15 ans'],
    correctIndex: 0,
    explication:
      'Soit x le plus jeune. x + (x+4) = 30 → 2x = 26 → x = 13 ans.',
  },
  {
    id: 'L043',
    categorie: 'LOGIQUE',
    enonce: 'Marie a le double de l\'âge de sa nièce. Il y a 5 ans, elle avait le triple. Quel est l\'âge actuel de la nièce ?',
    options: ['8 ans', '10 ans', '12 ans', '15 ans'],
    correctIndex: 1,
    explication:
      'Soit n l\'âge de la nièce. Marie = 2n. Il y a 5 ans : 2n−5 = 3(n−5) → 2n−5 = 3n−15 → n = 10 ans.',
  },
  {
    id: 'L044',
    categorie: 'LOGIQUE',
    enonce: 'Pierre est plus âgé qu\'Anne. Anne est plus jeune que Léa. Léa est plus jeune que Pierre. Qui est le plus jeune ?',
    options: ['Pierre', 'Léa', 'Anne', 'On ne peut pas savoir'],
    correctIndex: 2,
    explication:
      'Ordre des âges : Pierre > Léa > Anne. Anne est donc la plus jeune.',
  },
  {
    id: 'L045',
    categorie: 'LOGIQUE',
    enonce: 'Il y a 3 ans, Lucas avait la moitié de l\'âge qu\'il aura dans 7 ans. Quel est son âge actuel ?',
    options: ['11 ans', '13 ans', '15 ans', '17 ans'],
    correctIndex: 1,
    explication:
      'Soit x l\'âge actuel. Il y a 3 ans : x−3. Dans 7 ans : x+7. Équation : x−3 = (x+7)/2 → 2(x−3) = x+7 → 2x−6 = x+7 → x = 13 ans. Vérif : 13−3 = 10 ; (13+7)/2 = 10 ✓.',
  },
  // ── VITESSE / DISTANCE / TEMPS ───────────────────────────────────────────────
  {
    id: 'L046',
    categorie: 'LOGIQUE',
    enonce: 'Un train parcourt 360 km en 3 h. Quelle est sa vitesse moyenne ?',
    options: ['100 km/h', '110 km/h', '120 km/h', '130 km/h'],
    correctIndex: 2,
    explication: 'V = D/t = 360/3 = 120 km/h.',
  },
  {
    id: 'L047',
    categorie: 'LOGIQUE',
    enonce: 'Un cycliste roule à 18 km/h. Combien de temps lui faut-il pour parcourir 54 km ?',
    options: ['2 h', '2 h 30', '3 h', '3 h 30'],
    correctIndex: 2,
    explication: 't = D/V = 54/18 = 3 heures.',
  },
  {
    id: 'L048',
    categorie: 'LOGIQUE',
    enonce: 'Deux voitures partent de la même ville en sens opposés à 80 km/h et 100 km/h. Après 2 heures, quelle distance les sépare ?',
    options: ['160 km', '200 km', '320 km', '360 km'],
    correctIndex: 3,
    explication:
      'Vitesse relative en sens opposés = 80+100 = 180 km/h. En 2 h : 180×2 = 360 km.',
  },
  {
    id: 'L049',
    categorie: 'LOGIQUE',
    enonce: 'Alice met 4 h à rejoindre Bob à 60 km/h. Si elle roule à 80 km/h, combien de temps met-elle ?',
    options: ['2 h', '2 h 30', '3 h', '3 h 30'],
    correctIndex: 2,
    explication:
      'Distance = 60×4 = 240 km. Nouveau temps = 240/80 = 3 heures.',
  },
  {
    id: 'L050',
    categorie: 'LOGIQUE',
    enonce: 'Un coureur fait 100 m en 12,5 s. Quelle est sa vitesse en km/h ?',
    options: ['24 km/h', '28 km/h', '28,8 km/h', '30 km/h'],
    correctIndex: 2,
    explication:
      'V = 100/12,5 = 8 m/s. En km/h : 8×3 600/1 000 = 28,8 km/h.',
  },
  {
    id: 'L051',
    categorie: 'LOGIQUE',
    enonce: 'Un train de 200 m traverse un tunnel de 800 m à 50 m/s. Combien de temps met-il ?',
    options: ['16 s', '20 s', '18 s', '22 s'],
    correctIndex: 1,
    explication:
      'Le train doit parcourir sa longueur + le tunnel = 200+800 = 1 000 m. t = 1 000/50 = 20 s.',
  },
  // ── CALCULS DE POURCENTAGE ───────────────────────────────────────────────────
  {
    id: 'L052',
    categorie: 'LOGIQUE',
    enonce: 'Un article coûte 80 €. Il est soldé à 25 %. Quel est le nouveau prix ?',
    options: ['55 €', '60 €', '65 €', '70 €'],
    correctIndex: 1,
    explication:
      'Réduction = 80×0,25 = 20 €. Prix soldé = 80−20 = 60 €.',
  },
  {
    id: 'L053',
    categorie: 'LOGIQUE',
    enonce: 'Un salaire de 2 000 € augmente de 8 %. Quel est le nouveau salaire ?',
    options: ['2 080 €', '2 100 €', '2 120 €', '2 160 €'],
    correctIndex: 3,
    explication:
      'Augmentation = 2 000×0,08 = 160 €. Nouveau salaire = 2 000+160 = 2 160 €.',
  },
  {
    id: 'L054',
    categorie: 'LOGIQUE',
    enonce: '30 % de 450 élèves ont réussi le concours. Combien d\'élèves ont réussi ?',
    options: ['115', '125', '135', '145'],
    correctIndex: 2,
    explication: '0,30 × 450 = 135 élèves.',
  },
  {
    id: 'L055',
    categorie: 'LOGIQUE',
    enonce: 'Un prix passe de 200 € à 250 €. Quel est le pourcentage d\'augmentation ?',
    options: ['20 %', '25 %', '28 %', '30 %'],
    correctIndex: 1,
    explication:
      '(250−200)/200 × 100 = 50/200 × 100 = 25 %.',
  },
  {
    id: 'L056',
    categorie: 'LOGIQUE',
    enonce: 'Après une baisse de 20 %, un produit coûte 160 €. Quel était le prix initial ?',
    options: ['180 €', '192 €', '200 €', '210 €'],
    correctIndex: 2,
    explication:
      'Prix initial × 0,80 = 160. Prix initial = 160/0,80 = 200 €.',
  },
  // ── PROBLÈMES DE MÉLANGE ─────────────────────────────────────────────────────
  {
    id: 'L057',
    categorie: 'LOGIQUE',
    enonce: 'On mélange 2 L d\'un sirop à 30 % de sucre avec 3 L d\'un sirop à 20 % de sucre. Quelle est la concentration du mélange ?',
    options: ['22 %', '24 %', '25 %', '26 %'],
    correctIndex: 1,
    explication:
      'Sucre total = 2×0,30 + 3×0,20 = 0,60+0,60 = 1,20 L. Volume total = 5 L. Concentration = 1,20/5 = 0,24 = 24 %.',
  },
  {
    id: 'L058',
    categorie: 'LOGIQUE',
    enonce: 'On mélange du café à 5 €/kg et du café à 8 €/kg pour obtenir 6 kg à 6,50 €/kg. Quelle quantité de café à 5 € utilise-t-on ?',
    options: ['2 kg', '3 kg', '4 kg', '5 kg'],
    correctIndex: 1,
    explication:
      'Soit x kg à 5 €. (6−x) kg à 8 €. Équation : 5x + 8(6−x) = 6×6,50 = 39 → 5x+48−8x = 39 → −3x = −9 → x = 3 kg. Vérif : 3×5 + 3×8 = 15+24 = 39 ✓. On utilise 3 kg de café à 5 €.',
  },
  {
    id: 'L059',
    categorie: 'LOGIQUE',
    enonce: 'Un récipient contient 10 L d\'alcool pur. On prélève 2 L et on remplace par de l\'eau. Quelle est la concentration en alcool après l\'opération ?',
    options: ['70 %', '75 %', '80 %', '85 %'],
    correctIndex: 2,
    explication:
      'On retire 2/10 = 20 % du contenu, soit 2 L d\'alcool. Alcool restant = 10−2 = 8 L dans 10 L. Concentration = 8/10 = 80 %.',
  },
  // ── PROBLÈMES DE TRAVAIL ─────────────────────────────────────────────────────
  {
    id: 'L060',
    categorie: 'LOGIQUE',
    enonce: 'Ahmed réalise un travail en 6 jours, et Brice en 12 jours. En combien de jours le font-ils ensemble ?',
    options: ['3 jours', '4 jours', '5 jours', '6 jours'],
    correctIndex: 1,
    explication:
      'Ahmed : 1/6 par jour. Brice : 1/12 par jour. Ensemble : 1/6+1/12 = 2/12+1/12 = 3/12 = 1/4 par jour. Durée = 4 jours.',
  },
  {
    id: 'L061',
    categorie: 'LOGIQUE',
    enonce: 'Carole peint une chambre en 8 h. Sa sœur la peint en 12 h. En travaillant ensemble, combien de temps mettent-elles ?',
    options: ['4 h', '4 h 48 min', '5 h', '5 h 20 min'],
    correctIndex: 1,
    explication:
      'Ensemble : 1/8+1/12 = 3/24+2/24 = 5/24 par heure. Durée = 24/5 = 4,8 h = 4 h 48 min.',
  },
  {
    id: 'L062',
    categorie: 'LOGIQUE',
    enonce: 'Un robinet remplit un réservoir en 6 h, un autre le vide en 4 h. Le réservoir est plein. Les deux robinets sont ouverts simultanément. En combien de temps sera-t-il vide ?',
    options: ['10 h', '12 h', '14 h', '16 h'],
    correctIndex: 1,
    explication:
      'Remplissage : +1/6 par heure. Vidange : −1/4 par heure. Net = 1/6−1/4 = 2/12−3/12 = −1/12 par heure (vidange nette). Le réservoir se vide à raison de 1/12 par heure. Temps pour vider = 12 heures.',
  },
  {
    id: 'L063',
    categorie: 'LOGIQUE',
    enonce: 'Trois ouvriers construisent un mur en 9 jours. Combien d\'ouvriers faut-il pour le construire en 3 jours ?',
    options: ['6', '7', '8', '9'],
    correctIndex: 3,
    explication:
      'Travail total = 3×9 = 27 ouvriers-jours. Pour 3 jours : 27/3 = 9 ouvriers.',
  },
  {
    id: 'L064',
    categorie: 'LOGIQUE',
    enonce: 'Dana fait un rapport en 6 jours. Après 2 jours de travail seul, Élie l\'aide et ils terminent ensemble en 2 jours. En combien de jours Élie aurait-il fait seul ce rapport ?',
    options: ['4 jours', '6 jours', '8 jours', '12 jours'],
    correctIndex: 1,
    explication:
      'Dana fait 2/6 = 1/3 en 2 jours. Reste 2/3. Ensemble en 2 jours : 2×(1/6 + 1/e) = 2/3 → 1/6+1/e = 1/3 → 1/e = 1/3−1/6 = 1/6 → e = 6 jours. Élie aurait mis 6 jours seul. Vérif : 2×(1/6+1/6) = 2×(2/6) = 2/3 ✓.',
  },
  // ── TABLEAUX DE VÉRITÉ SIMPLES ───────────────────────────────────────────────
  {
    id: 'L065',
    categorie: 'LOGIQUE',
    enonce: 'P est vrai, Q est faux. Quelle est la valeur de "P ET Q" ?',
    options: ['Vrai', 'Faux', 'Impossible à déterminer', 'Ni vrai ni faux'],
    correctIndex: 1,
    explication:
      'P ∧ Q est vrai uniquement si P et Q sont tous deux vrais. Q est faux, donc P ∧ Q = Faux.',
  },
  {
    id: 'L066',
    categorie: 'LOGIQUE',
    enonce: 'P est faux, Q est faux. Quelle est la valeur de "P OU Q" ?',
    options: ['Vrai', 'Faux', 'Vrai uniquement si P', 'On ne peut pas savoir'],
    correctIndex: 1,
    explication:
      'P ∨ Q est vrai si au moins un des deux est vrai. Les deux sont faux, donc P ∨ Q = Faux.',
  },
  {
    id: 'L067',
    categorie: 'LOGIQUE',
    enonce: 'P est vrai, Q est vrai. Quelle est la valeur de "NON P ET Q" ?',
    options: ['Vrai', 'Faux', 'Identique à P', 'Identique à Q'],
    correctIndex: 1,
    explication:
      '¬P = Faux (car P est vrai). ¬P ∧ Q = Faux ∧ Vrai = Faux.',
  },
  {
    id: 'L068',
    categorie: 'LOGIQUE',
    enonce: 'Quelle proposition est toujours vraie quelle que soit la valeur de P ?',
    options: ['P ET NON P', 'P OU NON P', 'P ET P', 'NON P OU P ET P'],
    correctIndex: 1,
    explication:
      'P ∨ ¬P est une tautologie (toujours vraie), appelée principe du tiers exclu.',
  },
  // ── PUZZLES DE POSITIONNEMENT ─────────────────────────────────────────────────
  {
    id: 'L069',
    categorie: 'LOGIQUE',
    enonce: 'Alice est à gauche de Bernard. Bernard est à gauche de Claire. Qui est au milieu ?',
    options: ['Alice', 'Bernard', 'Claire', 'On ne peut pas savoir'],
    correctIndex: 1,
    explication:
      'Ordre : Alice — Bernard — Claire. Bernard est au milieu.',
  },
  {
    id: 'L070',
    categorie: 'LOGIQUE',
    enonce: 'Cinq personnes sont en rang : D est à la 2e place. E est juste après D. F est avant D. G est en dernière position. Quelle est la position de F ?',
    options: ['1ère', '3ème', '4ème', 'On ne peut pas savoir'],
    correctIndex: 0,
    explication:
      'D est 2e, F est avant D → F est 1er. E est juste après D → E est 3e. G est 5e (dernier). Reste la 4e place pour la 5e personne.',
  },
  {
    id: 'L071',
    categorie: 'LOGIQUE',
    enonce: 'Six livres sont sur une étagère. Le rouge est entre le bleu et le vert. Le bleu est à gauche du rouge. Le jaune est à droite du vert. Quel est l\'ordre possible ?',
    options: [
      'Bleu — Rouge — Vert — Jaune',
      'Vert — Rouge — Bleu — Jaune',
      'Jaune — Bleu — Rouge — Vert',
      'Rouge — Bleu — Vert — Jaune',
    ],
    correctIndex: 0,
    explication:
      'Bleu à gauche de Rouge, Rouge entre Bleu et Vert → Bleu—Rouge—Vert. Jaune à droite de Vert → Bleu—Rouge—Vert—Jaune.',
  },
  {
    id: 'L072',
    categorie: 'LOGIQUE',
    enonce: 'Dans une file, Hugo est devant Iris. Iris est devant Julien. Kem est derrière Julien. Qui est dernier ?',
    options: ['Iris', 'Julien', 'Kem', 'Hugo'],
    correctIndex: 2,
    explication:
      'Ordre : Hugo → Iris → Julien → Kem. Kem est le dernier.',
  },
  {
    id: 'L073',
    categorie: 'LOGIQUE',
    enonce: 'Quatre maisons alignées. La verte est à droite de la bleue. La rouge est à gauche de la bleue. La jaune est entre la rouge et la bleue. Ordre de gauche à droite ?',
    options: [
      'Rouge — Jaune — Bleue — Verte',
      'Bleue — Rouge — Jaune — Verte',
      'Rouge — Bleue — Jaune — Verte',
      'Verte — Bleue — Jaune — Rouge',
    ],
    correctIndex: 0,
    explication:
      'Rouge à gauche de Bleue. Jaune entre Rouge et Bleue → Rouge—Jaune—Bleue. Verte à droite de Bleue → Rouge—Jaune—Bleue—Verte.',
  },
  // ── PROBLÈMES D'EMPLOI DU TEMPS ───────────────────────────────────────────────
  {
    id: 'L074',
    categorie: 'LOGIQUE',
    enonce: 'Un agent travaille 5 jours sur 7. Il a travaillé lundi, mardi et mercredi. Il ne travaille pas le jeudi. Il ne travaille pas non plus le dimanche. Travaille-t-il vendredi ?',
    options: ['Oui, certainement', 'Non', 'On ne sait pas', 'Cela dépend du planning'],
    correctIndex: 0,
    explication:
      'Il travaille 5 jours/7 et a 2 jours de repos. Repos confirmés : jeudi et dimanche (2 jours). Il a donc travaillé ou travaillera les 5 autres jours : L, M, Me, V, S. Vendredi est obligatoirement travaillé.',
  },
  {
    id: 'L075',
    categorie: 'LOGIQUE',
    enonce: 'Une réunion dure 1 h 45 min. Elle commence à 10 h 30. À quelle heure se termine-t-elle ?',
    options: ['11 h 45', '12 h', '12 h 15', '12 h 30'],
    correctIndex: 2,
    explication:
      '10 h 30 + 1 h 45 = 10 h 30 + 1 h + 45 min = 11 h 30 + 45 min = 12 h 15.',
  },
  {
    id: 'L076',
    categorie: 'LOGIQUE',
    enonce: 'Un gardien effectue 3 rotations de 8 h par semaine. Combien d\'heures travaille-t-il en 4 semaines ?',
    options: ['72 h', '84 h', '96 h', '108 h'],
    correctIndex: 2,
    explication:
      'Par semaine : 3×8 = 24 h. En 4 semaines : 24×4 = 96 h.',
  },
  {
    id: 'L077',
    categorie: 'LOGIQUE',
    enonce: 'Deux agents se relayent toutes les 6 heures. Le premier commence à 6 h. À quelle heure le second commence-t-il son 3e tour de garde ?',
    options: ['18 h le jour J', '0 h (minuit)', '12 h le lendemain', '6 h le lendemain'],
    correctIndex: 2,
    explication:
      'Tour 1 du 1er : 6 h → 12 h. Tour 1 du 2nd : 12 h → 18 h. Tour 2 du 1er : 18 h → 0 h. Tour 2 du 2nd : 0 h → 6 h. Tour 3 du 1er : 6 h → 12 h (lendemain). Tour 3 du 2nd : commence à 12 h le lendemain.',
  },
  // ── DÉDUCTIONS PAR ÉLIMINATION ───────────────────────────────────────────────
  {
    id: 'L078',
    categorie: 'LOGIQUE',
    enonce: 'Quatre suspects : 1 seul a commis le vol. Alex dit que c\'est Ben. Ben dit que c\'est Claire. Claire dit que c\'est Alex. Dave ne dit rien. Si un seul dit la vérité, qui est le coupable ?',
    options: ['Alex', 'Ben', 'Claire', 'Dave'],
    correctIndex: 2,
    explication:
      'Si Claire est coupable : Alex dit "Ben" (faux), Ben dit "Claire" (vrai, 1 seul vrai ✓), Claire dit "Alex" (faux). Un seul dit la vérité. Claire est la coupable.',
  },
  {
    id: 'L079',
    categorie: 'LOGIQUE',
    enonce: 'Trois boîtes : une contient des pommes, une des oranges, une les deux. Les étiquettes sont toutes incorrectes. La boîte "Pommes+Oranges" contient en fait… On tire une pomme de cette boîte. Que contient-elle ?',
    options: ['Des pommes seulement', 'Des oranges seulement', 'Les deux fruits', 'On ne peut pas savoir'],
    correctIndex: 0,
    explication:
      'L\'étiquette est fausse → la boîte "Pommes+Oranges" contient soit des pommes seules, soit des oranges seules. On tire une pomme → elle contient des pommes seulement.',
  },
  {
    id: 'L080',
    categorie: 'LOGIQUE',
    enonce: 'Léa, Marc et Nina ont respectivement une voiture rouge, bleue et verte (dans un ordre inconnu). Léa n\'a pas la rouge. Marc n\'a pas la bleue. Nina n\'a pas la verte. Qui a la voiture rouge ?',
    options: ['Léa', 'Marc', 'Nina', 'On ne peut pas savoir'],
    correctIndex: 1,
    explication:
      'Léa ≠ rouge, Marc ≠ bleue, Nina ≠ verte. Léa possible : bleue ou verte. Marc possible : rouge ou verte. Nina possible : rouge ou bleue. Si Marc = rouge → Léa ∈ {bleue, verte}, Nina ∈ {bleue} → Nina=bleue, Léa=verte. Cohérent. Marc a la voiture rouge.',
  },
  {
    id: 'L081',
    categorie: 'LOGIQUE',
    enonce: 'Il y a 5 maisons de couleurs différentes habitées par 5 personnes de nationalités différentes. L\'Anglais habite la maison rouge. Le Suédois a un chien. Le Danois boit du thé. La maison verte est à gauche de la blanche. Qui habite la maison verte ? (déduction partielle)',
    options: [
      'L\'Anglais',
      'Le Suédois',
      'Ni l\'Anglais ni le Suédois avec certitude',
      'Le Danois',
    ],
    correctIndex: 2,
    explication:
      'L\'Anglais habite le rouge (≠ vert). Le Suédois a un chien — aucune info sur sa couleur à ce stade. Le Danois boit du thé — sans lien direct à la maison verte. On ne peut pas conclure avec certitude sans données supplémentaires.',
  },
  // ── PROBLÈMES DE PARTAGE ÉQUITABLE ───────────────────────────────────────────
  {
    id: 'L082',
    categorie: 'LOGIQUE',
    enonce: 'Un héritage de 72 000 € est partagé entre trois enfants dans le rapport 2 : 3 : 4. Quelle est la part la plus grande ?',
    options: ['16 000 €', '24 000 €', '32 000 €', '36 000 €'],
    correctIndex: 2,
    explication:
      'Total parts = 2+3+4 = 9. Part la plus grande = (4/9)×72 000 = 32 000 €.',
  },
  {
    id: 'L083',
    categorie: 'LOGIQUE',
    enonce: 'On partage 90 bonbons entre deux enfants dans le rapport 2 : 7. Combien le plus grand en reçoit-il ?',
    options: ['18', '56', '63', '70'],
    correctIndex: 3,
    explication:
      'Total parts = 2+7 = 9. Part la plus grande = (7/9)×90 = 70 bonbons. Vérif : (2/9)×90 = 20 et 20+70 = 90 ✓.',
  },
  {
    id: 'L084',
    categorie: 'LOGIQUE',
    enonce: 'Trois associés partagent un bénéfice de 45 000 € proportionnellement à leurs apports : 10 000 €, 15 000 € et 25 000 €. Combien reçoit celui qui a apporté 15 000 € ?',
    options: ['9 000 €', '13 500 €', '15 000 €', '20 250 €'],
    correctIndex: 1,
    explication:
      'Total apports = 50 000 €. Part = (15 000/50 000)×45 000 = 0,3×45 000 = 13 500 €.',
  },
  // ── RAISONNEMENT PAR L'ABSURDE ────────────────────────────────────────────────
  {
    id: 'L085',
    categorie: 'LOGIQUE',
    enonce: 'Supposons qu\'il existe un plus grand nombre entier N. Alors N+1 est aussi un entier et N+1 > N. C\'est absurde. Donc :',
    options: [
      'N+1 n\'est pas un entier',
      'Il n\'existe pas de plus grand entier',
      'N est infini',
      'Tout nombre a un successeur sauf le plus grand',
    ],
    correctIndex: 1,
    explication:
      'L\'hypothèse "il existe un plus grand entier" mène à une contradiction (N+1 > N). Par l\'absurde, il n\'existe pas de plus grand entier.',
  },
  {
    id: 'L086',
    categorie: 'LOGIQUE',
    enonce: 'Supposons que √2 soit rationnel, donc √2 = p/q (irréductible). Alors 2 = p²/q², donc p² = 2q² — p est pair. Or si p est pair, q doit l\'être aussi : contradiction. Conclusion ?',
    options: [
      '√2 est rationnel',
      '√2 est irrationnel',
      'p/q n\'est pas irréductible',
      'La démonstration est fausse',
    ],
    correctIndex: 1,
    explication:
      'L\'hypothèse "√2 rationnel" mène à "p et q sont tous deux pairs", contredisant l\'irréductibilité. Par l\'absurde, √2 est irrationnel.',
  },
  // ── PROBLÈMES DE RENDEMENT ────────────────────────────────────────────────────
  {
    id: 'L087',
    categorie: 'LOGIQUE',
    enonce: 'Une machine produit 120 pièces en 4 heures. Combien de pièces produit-elle en 10 heures ?',
    options: ['250', '280', '300', '320'],
    correctIndex: 2,
    explication:
      'Cadence = 120/4 = 30 pièces/heure. En 10 h : 30×10 = 300 pièces.',
  },
  {
    id: 'L088',
    categorie: 'LOGIQUE',
    enonce: 'Un imprimante imprime 40 pages par minute. Combien de temps faut-il pour imprimer un document de 300 pages ?',
    options: ['6 min 30 s', '7 min', '7 min 30 s', '8 min'],
    correctIndex: 2,
    explication:
      '300/40 = 7,5 minutes = 7 min 30 s.',
  },
  {
    id: 'L089',
    categorie: 'LOGIQUE',
    enonce: 'Un atelier a un rendement de 85 %. S\'il doit fournir 340 pièces conformes, combien doit-il en produire en tout ?',
    options: ['380', '390', '400', '420'],
    correctIndex: 2,
    explication:
      'Production totale × 0,85 = 340. Production totale = 340/0,85 = 400 pièces.',
  },
  {
    id: 'L090',
    categorie: 'LOGIQUE',
    enonce: 'Deux usines produisent ensemble 1 800 unités en 6 jours. L\'usine A seule produit 200 unités/jour. Combien l\'usine B en produit-elle par jour ?',
    options: ['75', '100', '125', '150'],
    correctIndex: 1,
    explication:
      'Production totale = 1 800. Par jour ensemble = 1 800/6 = 300. Usine B = 300−200 = 100 unités/jour.',
  },
  // ── SÉRIES ET SUITES ─────────────────────────────────────────────────────────
  {
    id: 'L091',
    categorie: 'LOGIQUE',
    enonce: 'Quelle est la prochaine valeur de la suite : 1, 4, 9, 16, 25, … ?',
    options: ['30', '34', '36', '38'],
    correctIndex: 2,
    explication:
      'Suite des carrés parfaits : 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36.',
  },
  {
    id: 'L092',
    categorie: 'LOGIQUE',
    enonce: 'Suite : 2, 3, 5, 8, 13, 21, … Quel est le terme suivant ?',
    options: ['29', '32', '34', '36'],
    correctIndex: 2,
    explication:
      'Suite de Fibonacci : chaque terme = somme des deux précédents. 13+21 = 34.',
  },
  {
    id: 'L093',
    categorie: 'LOGIQUE',
    enonce: 'Suite : 100, 95, 85, 70, 50, … Quel est le terme suivant ?',
    options: ['20', '25', '30', '35'],
    correctIndex: 1,
    explication:
      'Différences : −5, −10, −15, −20, −25. Prochain terme = 50−25 = 25.',
  },
  {
    id: 'L094',
    categorie: 'LOGIQUE',
    enonce: 'Suite : 3, 6, 12, 24, 48, … Quel est le terme suivant ?',
    options: ['72', '84', '96', '108'],
    correctIndex: 2,
    explication:
      'Suite géométrique de raison 2 : 48×2 = 96.',
  },
  {
    id: 'L095',
    categorie: 'LOGIQUE',
    enonce: 'Suite de lettres : A, C, F, J, O, … Quelle est la lettre suivante ?',
    options: ['T', 'U', 'V', 'W'],
    correctIndex: 1,
    explication:
      'Décalages : +2, +3, +4, +5, +6. A(1)+2=C(3), C+3=F(6), F+4=J(10), J+5=O(15), O+6=U(21). Lettre suivante : U.',
  },
  // ── PROBLÈMES COMBINÉS (NIVEAU AVANCÉ) ───────────────────────────────────────
  {
    id: 'L096',
    categorie: 'LOGIQUE',
    enonce: 'Un capital de 5 000 € est placé à 4 % par an (intérêts simples). Combien obtient-on au bout de 3 ans ?',
    options: ['5 500 €', '5 600 €', '5 700 €', '5 800 €'],
    correctIndex: 1,
    explication:
      'Intérêts = 5 000 × 0,04 × 3 = 600 €. Capital final = 5 000+600 = 5 600 €.',
  },
  {
    id: 'L097',
    categorie: 'LOGIQUE',
    enonce: 'Dans un groupe de 50 étudiants, 30 parlent anglais et 25 parlent espagnol. 10 parlent les deux. Combien ne parlent ni l\'un ni l\'autre ?',
    options: ['5', '10', '15', '20'],
    correctIndex: 0,
    explication:
      'Formule inclusion-exclusion : |A∪B| = 30+25−10 = 45. Ne parlent ni l\'un ni l\'autre = 50−45 = 5.',
  },
  {
    id: 'L098',
    categorie: 'LOGIQUE',
    enonce: 'Un groupe de 120 personnes : 40 % sont des femmes. Parmi les hommes, 25 % ont moins de 30 ans. Combien d\'hommes ont moins de 30 ans ?',
    options: ['15', '18', '20', '22'],
    correctIndex: 1,
    explication:
      'Femmes = 120×0,40 = 48. Hommes = 120−48 = 72. Hommes < 30 ans = 72×0,25 = 18.',
  },
  {
    id: 'L099',
    categorie: 'LOGIQUE',
    enonce: 'Un camion part à 8 h à 60 km/h. Une voiture part au même endroit à 9 h à 90 km/h. À quelle heure la voiture rattrape-t-elle le camion ?',
    options: ['10 h', '10 h 30', '11 h', '11 h 30'],
    correctIndex: 2,
    explication:
      'À 9 h, le camion a 1 h d\'avance, soit 60 km. La voiture gagne 90−60 = 30 km/h sur le camion. Temps pour combler : 60/30 = 2 h. La voiture rattrape à 9 h+2 h = 11 h.',
  },
  {
    id: 'L100',
    categorie: 'LOGIQUE',
    enonce: 'Un commerçant achète un article 150 € et le revend avec un bénéfice de 20 %. Il accorde ensuite une remise de 10 % sur le prix de vente. Quel est son bénéfice ou sa perte réelle par rapport au prix d\'achat ?',
    options: ['Bénéfice de 8 %', 'Bénéfice de 10 %', 'Perte de 2 %', 'Ni gain ni perte'],
    correctIndex: 0,
    explication:
      'Prix de vente initial = 150×1,20 = 180 €. Après remise 10 % : 180×0,90 = 162 €. Bénéfice réel = 162−150 = 12 €. Taux = 12/150 = 8 %.',
  },
];
