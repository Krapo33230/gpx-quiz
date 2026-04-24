/**
 * Banque de questions – Concours Gardien de la Paix
 * Chaque question : { id, categorie, enonce, options, correctIndex, explication }
 */

export const CATEGORIES = {
  DROIT:     { label: 'Droit & Institutions',   emoji: '⚖️',  color: '#1A3F7A' },
  CULTURE:   { label: 'Culture Générale',        emoji: '🌍',  color: '#2B7A5B' },
  LOGIQUE:   { label: 'Logique & Raisonnement',  emoji: '🧠',  color: '#7A2B6A' },
  SECURITE:  { label: 'Sécurité & Police',       emoji: '🚔',  color: '#7A4B1A' },
  FRANÇAIS:  { label: 'Français & Expression',   emoji: '📝',  color: '#1A6A7A' },
};

export const QUESTIONS = [
  // ─── DROIT & INSTITUTIONS ────────────────────────────────────────────────────
  {
    id: 'D001',
    categorie: 'DROIT',
    enonce: 'Quelle est la durée maximale de la garde à vue pour un crime ou délit de droit commun ?',
    options: ['12 heures', '24 heures', '48 heures', '72 heures'],
    correctIndex: 2,
    explication: 'La garde à vue de droit commun dure 24h, renouvelable une fois par un magistrat, soit 48h maximum (art. 63 CPP).',
  },
  {
    id: 'D002',
    categorie: 'DROIT',
    enonce: 'Qui dirige la Police Nationale en France ?',
    options: [
      'Le Préfet de Police de Paris',
      'Le Directeur Général de la Police Nationale (DGPN)',
      'Le Ministre de l\'Intérieur',
      'Le Procureur de la République',
    ],
    correctIndex: 1,
    explication: 'La Police Nationale est placée sous l\'autorité du DGPN, lui-même rattaché au Ministre de l\'Intérieur.',
  },
  {
    id: 'D003',
    categorie: 'DROIT',
    enonce: 'À quel âge la responsabilité pénale est-elle pleine et entière en France ?',
    options: ['15 ans', '16 ans', '18 ans', '21 ans'],
    correctIndex: 2,
    explication: 'La majorité pénale est fixée à 18 ans. Entre 13 et 18 ans, les mineurs bénéficient d\'une atténuation de responsabilité.',
  },
  {
    id: 'D004',
    categorie: 'DROIT',
    enonce: 'Quel article de la Constitution de 1958 définit la France comme une République ?',
    options: ['Article 1', 'Article 2', 'Article 3', 'Article 4'],
    correctIndex: 0,
    explication: 'L\'article 1er dispose : "La France est une République indivisible, laïque, démocratique et sociale."',
  },
  {
    id: 'D005',
    categorie: 'DROIT',
    enonce: 'Qu\'est-ce qu\'un flagrant délit ?',
    options: [
      'Un crime commis la nuit',
      'Un crime ou délit en train de se commettre ou qui vient de se commettre',
      'Un crime commis en récidive',
      'Un délit commis par plusieurs personnes',
    ],
    correctIndex: 1,
    explication: 'Le flagrant délit (art. 53 CPP) désigne un crime ou délit en cours ou qui vient juste d\'être commis. Il permet des pouvoirs d\'enquête étendus.',
  },
  {
    id: 'D006',
    categorie: 'DROIT',
    enonce: 'Quelle juridiction juge les crimes en France ?',
    options: ['Le Tribunal correctionnel', 'Le Tribunal judiciaire', 'La Cour d\'assises', 'La Cour d\'appel'],
    correctIndex: 2,
    explication: 'La Cour d\'assises est compétente pour juger les crimes (infractions punies de plus de 10 ans de réclusion).',
  },
  {
    id: 'D007',
    categorie: 'DROIT',
    enonce: 'Quel est le rôle du parquet (ministère public) ?',
    options: [
      'Défendre les accusés',
      'Juger les affaires pénales',
      'Mettre en œuvre l\'action publique au nom de la société',
      'Instruire les affaires civiles',
    ],
    correctIndex: 2,
    explication: 'Le parquet (procureur, substituts) représente la société et exerce l\'action publique pour poursuivre les infractions.',
  },

  // ─── CULTURE GÉNÉRALE ────────────────────────────────────────────────────────
  {
    id: 'C001',
    categorie: 'CULTURE',
    enonce: 'Combien y a-t-il de régions métropolitaines en France depuis la réforme de 2016 ?',
    options: ['13', '17', '22', '26'],
    correctIndex: 0,
    explication: 'La loi NOTRe de 2015, appliquée au 1er janvier 2016, a réduit les régions métropolitaines de 22 à 13.',
  },
  {
    id: 'C002',
    categorie: 'CULTURE',
    enonce: 'Quel est le symbole de la République française ?',
    options: ['La croix de Lorraine', 'Marianne', 'Le coq gaulois', 'La fleur de lys'],
    correctIndex: 1,
    explication: 'Marianne est le symbole officiel de la République. Elle figure sur le buste présent dans toutes les mairies.',
  },
  {
    id: 'C003',
    categorie: 'CULTURE',
    enonce: 'Quelle est la devise de la République française ?',
    options: [
      'Travail, famille, patrie',
      'Honneur et patrie',
      'Liberté, Égalité, Fraternité',
      'Dieu, la France, le Roi',
    ],
    correctIndex: 2,
    explication: '"Liberté, Égalité, Fraternité" est la devise républicaine consacrée par l\'article 2 de la Constitution.',
  },
  {
    id: 'C004',
    categorie: 'CULTURE',
    enonce: 'Quel est le premier droit proclamé par la Déclaration des droits de l\'Homme et du Citoyen de 1789 ?',
    options: [
      'Le droit à la liberté d\'expression',
      'Que les hommes naissent et demeurent libres et égaux en droits',
      'Le droit de propriété',
      'Le droit à un procès équitable',
    ],
    correctIndex: 1,
    explication: 'L\'article 1er de la DDHC 1789 : "Les hommes naissent et demeurent libres et égaux en droits."',
  },
  {
    id: 'C005',
    categorie: 'CULTURE',
    enonce: 'Quel est le département français le plus peuplé ?',
    options: ['Paris (75)', 'Nord (59)', 'Bouches-du-Rhône (13)', 'Rhône (69)'],
    correctIndex: 1,
    explication: 'Le Nord (59) est le département métropolitain le plus peuplé avec environ 2,6 millions d\'habitants.',
  },
  {
    id: 'C006',
    categorie: 'CULTURE',
    enonce: 'Qui est l\'actuel chef de l\'État français (en 2024) ?',
    options: ['François Hollande', 'Nicolas Sarkozy', 'Emmanuel Macron', 'Édouard Philippe'],
    correctIndex: 2,
    explication: 'Emmanuel Macron est Président de la République depuis mai 2017, réélu en avril 2022.',
  },
  {
    id: 'C007',
    categorie: 'CULTURE',
    enonce: 'En quelle année la Déclaration des droits de l\'Homme et du Citoyen a-t-elle été adoptée ?',
    options: ['1789', '1793', '1804', '1814'],
    correctIndex: 0,
    explication: 'La DDHC a été adoptée par l\'Assemblée nationale constituante le 26 août 1789.',
  },

  // ─── LOGIQUE & RAISONNEMENT ──────────────────────────────────────────────────
  {
    id: 'L001',
    categorie: 'LOGIQUE',
    enonce: 'Complétez la série : 2, 5, 11, 23, 47, …',
    options: ['89', '94', '95', '96'],
    correctIndex: 2,
    explication: 'Chaque terme est égal à (2 × terme précédent) + 1 : 2×47+1 = 95.',
  },
  {
    id: 'L002',
    categorie: 'LOGIQUE',
    enonce: 'Si tous les policiers sont des fonctionnaires, et que Jean est policier, alors :',
    options: [
      'Jean est peut-être fonctionnaire',
      'Jean est certainement fonctionnaire',
      'Jean n\'est pas fonctionnaire',
      'On ne peut pas conclure',
    ],
    correctIndex: 1,
    explication: 'Syllogisme classique : si A⊂B et Jean∈A, alors Jean∈B. Jean est certainement fonctionnaire.',
  },
  {
    id: 'L003',
    categorie: 'LOGIQUE',
    enonce: 'Quel est le nombre manquant ? 3, 6, 12, 24, ?',
    options: ['36', '42', '48', '52'],
    correctIndex: 2,
    explication: 'Chaque terme est multiplié par 2 : 24 × 2 = 48.',
  },
  {
    id: 'L004',
    categorie: 'LOGIQUE',
    enonce: 'Marie a 3 ans de plus que Luc. Dans 5 ans, Marie aura 20 ans. Quel âge a Luc maintenant ?',
    options: ['12 ans', '14 ans', '15 ans', '17 ans'],
    correctIndex: 0,
    explication: 'Marie aura 20 ans dans 5 ans, donc elle a 15 ans. Luc a 15 - 3 = 12 ans.',
  },
  {
    id: 'L005',
    categorie: 'LOGIQUE',
    enonce: 'Un magasin vend des articles à -30 %. Un article coûtait 80 €. Quel est son nouveau prix ?',
    options: ['50 €', '54 €', '56 €', '62 €'],
    correctIndex: 2,
    explication: '30 % de 80 = 24 €. Prix réduit = 80 - 24 = 56 €.',
  },

  // ─── SÉCURITÉ & POLICE ───────────────────────────────────────────────────────
  {
    id: 'S001',
    categorie: 'SECURITE',
    enonce: 'Quelle est la police judiciaire chargée des enquêtes criminelles complexes au niveau national ?',
    options: ['BRI', 'DCPJ (Direction Centrale de la Police Judiciaire)', 'RAID', 'GIGN'],
    correctIndex: 1,
    explication: 'La DCPJ coordonne et dirige les enquêtes judiciaires les plus complexes au niveau national.',
  },
  {
    id: 'S002',
    categorie: 'SECURITE',
    enonce: 'Qu\'est-ce que la PTS (Police Technique et Scientifique) ?',
    options: [
      'Une unité d\'intervention rapide',
      'Le service chargé de la collecte et l\'analyse des indices scientifiques sur les scènes de crime',
      'La formation continue des policiers',
      'Un service de renseignement intérieur',
    ],
    correctIndex: 1,
    explication: 'La PTS intervient sur les scènes d\'infraction pour relever les traces et indices (empreintes, ADN, etc.).',
  },
  {
    id: 'S003',
    categorie: 'SECURITE',
    enonce: 'Quel numéro d\'urgence permet d\'appeler la Police Nationale ?',
    options: ['15', '17', '18', '112'],
    correctIndex: 1,
    explication: 'Le 17 est le numéro d\'urgence de la Police Nationale (le 15 = SAMU, le 18 = Pompiers, le 112 = numéro européen).',
  },
  {
    id: 'S004',
    categorie: 'SECURITE',
    enonce: 'À quel ministère est rattachée la Police Nationale ?',
    options: [
      'Ministère de la Justice',
      'Ministère de la Défense',
      'Ministère de l\'Intérieur',
      'Ministère de la Fonction Publique',
    ],
    correctIndex: 2,
    explication: 'La Police Nationale est placée sous l\'autorité du Ministre de l\'Intérieur.',
  },
  {
    id: 'S005',
    categorie: 'SECURITE',
    enonce: 'Quel est le rôle de l\'IGPN (Inspection Générale de la Police Nationale) ?',
    options: [
      'Former les nouveaux policiers',
      'Contrôler et enquêter sur les comportements des policiers',
      'Coordonner les opérations de maintien de l\'ordre',
      'Gérer les effectifs de la police',
    ],
    correctIndex: 1,
    explication: 'L\'IGPN, surnommée "la police des polices", contrôle le bon fonctionnement des services et enquête sur les manquements.',
  },

  // ─── FRANÇAIS & EXPRESSION ───────────────────────────────────────────────────
  {
    id: 'F001',
    categorie: 'FRANÇAIS',
    enonce: 'Quelle est la nature du mot souligné : "Il court *vite*."',
    options: ['Adjectif qualificatif', 'Adverbe', 'Verbe', 'Nom commun'],
    correctIndex: 1,
    explication: '"Vite" modifie le verbe "court" : c\'est un adverbe de manière.',
  },
  {
    id: 'F002',
    categorie: 'FRANÇAIS',
    enonce: 'Quel est le synonyme de "perspicace" ?',
    options: ['Distrait', 'Clairvoyant', 'Arrogant', 'Calme'],
    correctIndex: 1,
    explication: '"Perspicace" signifie qui perçoit, discerne avec finesse : synonyme de clairvoyant, lucide, pénétrant.',
  },
  {
    id: 'F003',
    categorie: 'FRANÇAIS',
    enonce: 'Quelle est la définition du mot "circonspect" ?',
    options: [
      'Qui agit avec impulsivité',
      'Qui fait preuve de prudence et de réserve',
      'Qui est très bavard',
      'Qui est courageux',
    ],
    correctIndex: 1,
    explication: '"Circonspect" (du latin circumspectus : regarder autour) désigne quelqu\'un de prudent, réservé, qui réfléchit avant d\'agir.',
  },
  {
    id: 'F004',
    categorie: 'FRANÇAIS',
    enonce: 'Choisissez la phrase correctement orthographiée :',
    options: [
      'Les policiers ce sont mobilisés.',
      'Les policiers se sont mobilisés.',
      'Les policiers se sont mobilisez.',
      'Les policiers ce sont mobiliser.',
    ],
    correctIndex: 1,
    explication: '"Se sont" = pronom réfléchi + auxiliaire être. Participe passé "mobilisés" accordé avec le sujet masculin pluriel.',
  },
  {
    id: 'F005',
    categorie: 'FRANÇAIS',
    enonce: 'Quel est l\'antonyme (contraire) de "coupable" ?',
    options: ['Condamné', 'Suspect', 'Innocent', 'Prévenu'],
    correctIndex: 2,
    explication: 'L\'antonyme de "coupable" est "innocent" : celui dont la culpabilité n\'a pas été établie.',
  },

  // ══════════════════════════════════════════════════════
  // DROIT & INSTITUTIONS (15 questions supplémentaires)
  // ══════════════════════════════════════════════════════
  {
    id: 'D008',
    categorie: 'DROIT',
    enonce: 'Quelle est la durée maximale d\'une retenue douanière ?',
    options: ['6 heures', '12 heures', '24 heures', '48 heures'],
    correctIndex: 1,
    explication: 'La retenue douanière ne peut excéder 12 heures (art. 323 du Code des douanes), renouvelable une fois par le procureur.',
  },
  {
    id: 'D009',
    categorie: 'DROIT',
    enonce: 'Qu\'est-ce que la légitime défense en droit pénal français ?',
    options: [
      'Le droit de se venger d\'une agression passée',
      'La permission de frapper en premier si on se sent menacé',
      'Le droit de se défendre face à une atteinte injustifiée, à condition que la riposte soit proportionnée',
      'Un droit réservé aux forces de l\'ordre',
    ],
    correctIndex: 2,
    explication: 'Art. 122-5 du Code pénal : la légitime défense exige une atteinte injustifiée, une riposte nécessaire et proportionnée, simultanée à l\'agression.',
  },
  {
    id: 'D010',
    categorie: 'DROIT',
    enonce: 'Quelle juridiction est compétente pour les délits (infractions punies de 2 mois à 10 ans d\'emprisonnement) ?',
    options: ['Le tribunal de police', 'Le tribunal correctionnel', 'La cour d\'assises', 'Le juge de proximité'],
    correctIndex: 1,
    explication: 'Le tribunal correctionnel juge les délits. Le tribunal de police juge les contraventions et la cour d\'assises les crimes.',
  },
  {
    id: 'D011',
    categorie: 'DROIT',
    enonce: 'Quel est le rôle du juge d\'instruction ?',
    options: [
      'Prononcer la condamnation',
      'Informer les victimes de leurs droits',
      'Mener les investigations pour établir la vérité avant le jugement',
      'Défendre les intérêts de l\'État',
    ],
    correctIndex: 2,
    explication: 'Le juge d\'instruction est un magistrat indépendant qui instruit à charge et à décharge pour établir les faits avant renvoi en jugement.',
  },
  {
    id: 'D012',
    categorie: 'DROIT',
    enonce: 'Qu\'est-ce que la présomption d\'innocence ?',
    options: [
      'Tout suspect est considéré coupable jusqu\'à preuve du contraire',
      'Toute personne est considérée innocente tant que sa culpabilité n\'a pas été légalement établie',
      'Un privilège accordé aux mineurs',
      'Une règle de procédure civile uniquement',
    ],
    correctIndex: 1,
    explication: 'Principe fondamental (art. 9 DDHC, art. préliminaire CPP) : la charge de la preuve incombe à l\'accusation, pas à la défense.',
  },
  {
    id: 'D013',
    categorie: 'DROIT',
    enonce: 'Quelle est la différence entre un crime, un délit et une contravention ?',
    options: [
      'Ce sont des synonymes selon les régions',
      'La distinction se fait selon la gravité et la peine encourue',
      'La distinction se fait selon la nationalité de l\'auteur',
      'Un crime est commis la nuit, un délit le jour',
    ],
    correctIndex: 1,
    explication: 'Tripartition pénale : contravention (amende), délit (jusqu\'à 10 ans), crime (plus de 10 ans de réclusion). La gravité détermine la juridiction compétente.',
  },
  {
    id: 'D014',
    categorie: 'DROIT',
    enonce: 'Qui peut ordonner le placement en détention provisoire ?',
    options: [
      'Le procureur de la République',
      'Le juge d\'instruction seul',
      'Le juge des libertés et de la détention (JLD)',
      'Le préfet',
    ],
    correctIndex: 2,
    explication: 'Depuis 2000, seul le JLD (juge des libertés et de la détention) peut ordonner la détention provisoire, garantissant l\'indépendance de la décision.',
  },
  {
    id: 'D015',
    categorie: 'DROIT',
    enonce: 'Quel texte consacre le droit à un avocat dès le début de la garde à vue ?',
    options: [
      'La loi du 15 juin 2000 sur la présomption d\'innocence',
      'La loi du 14 avril 2011 réformant la garde à vue',
      'Le décret du 20 mai 2009',
      'L\'ordonnance du 2 novembre 1945',
    ],
    correctIndex: 1,
    explication: 'La loi du 14 avril 2011 (suite aux arrêts CEDH Salduz) a consacré le droit à un entretien de 30 min avec un avocat dès le début de la GAV. La loi du 3 juin 2016 a ensuite étendu ce droit à l\'assistance complète lors des auditions.',
  },
  {
    id: 'D016',
    categorie: 'DROIT',
    enonce: 'Qu\'est-ce qu\'une ordonnance pénale ?',
    options: [
      'Une décision du préfet en matière pénale',
      'Une procédure simplifiée permettant de juger sans audience pour certaines infractions mineures',
      'Une mesure d\'expulsion',
      'Un acte du parquet classant une affaire',
    ],
    correctIndex: 1,
    explication: 'L\'ordonnance pénale (art. 495 CPP) permet au tribunal correctionnel de statuer sans débat contradictoire pour des délits peu graves listés par la loi.',
  },
  {
    id: 'D017',
    categorie: 'DROIT',
    enonce: 'Quelle est la durée de prescription de l\'action publique pour un crime de droit commun ?',
    options: ['5 ans', '10 ans', '20 ans', '30 ans'],
    correctIndex: 2,
    explication: 'Depuis la loi du 27 février 2017, la prescription des crimes de droit commun est de 20 ans (art. 7 CPP). Elle est imprescriptible pour les crimes contre l\'humanité.',
  },
  {
    id: 'D018',
    categorie: 'DROIT',
    enonce: 'Qu\'est-ce que la comparution immédiate ?',
    options: [
      'L\'obligation pour un suspect de se rendre au commissariat',
      'Une procédure permettant de juger une personne le jour même de sa déferrement au parquet',
      'La convocation d\'un témoin',
      'Un mode d\'exécution de peine',
    ],
    correctIndex: 1,
    explication: 'La comparution immédiate (art. 395 CPP) permet un jugement rapide pour des délits punis d\'au moins 2 ans d\'emprisonnement quand les preuves sont réunies.',
  },
  {
    id: 'D019',
    categorie: 'DROIT',
    enonce: 'Quelle est la condition d\'âge pour la responsabilité pénale des mineurs en France ?',
    options: [
      'Aucun âge minimum, tout mineur est pénalement responsable',
      'À partir de 10 ans',
      'À partir de 13 ans avec atténuation jusqu\'à 18 ans',
      'Seulement à partir de 16 ans',
    ],
    correctIndex: 2,
    explication: 'Le code de la justice pénale des mineurs (2021) fixe une présomption d\'irresponsabilité sous 13 ans. Entre 13 et 18 ans : responsabilité atténuée.',
  },
  {
    id: 'D020',
    categorie: 'DROIT',
    enonce: 'Qu\'est-ce que la mise en examen ?',
    options: [
      'La condamnation définitive d\'un accusé',
      'L\'acte du juge d\'instruction indiquant qu\'il existe des indices graves rendant vraisemblable la participation d\'une personne à une infraction',
      'La simple convocation par le procureur',
      'La garde à vue d\'une personne',
    ],
    correctIndex: 1,
    explication: 'La mise en examen (ex-inculpation) est décidée par le juge d\'instruction quand des indices graves et concordants existent. Elle n\'est pas une condamnation.',
  },
  {
    id: 'D021',
    categorie: 'DROIT',
    enonce: 'Quel est le principe "non bis in idem" ?',
    options: [
      'Nul ne peut être jugé deux fois pour les mêmes faits',
      'Tout jugement doit être rendu en deux instances',
      'La peine doit être proportionnée au crime',
      'Nul ne peut être condamné sans avocat',
    ],
    correctIndex: 0,
    explication: '"Non bis in idem" signifie qu\'une personne acquittée ou condamnée définitivement ne peut être rejugée pour les mêmes faits (art. 6 CESDH, art. 368 CPP).',
  },
  {
    id: 'D022',
    categorie: 'DROIT',
    enonce: 'Qu\'est-ce que l\'enquête préliminaire ?',
    options: [
      'Une enquête menée uniquement en flagrance',
      'Une enquête diligentée par les officiers de police judiciaire sans réquisition du procureur, hors flagrance',
      'Une enquête menée par le juge d\'instruction',
      'Une procédure réservée aux douanes',
    ],
    correctIndex: 1,
    explication: 'L\'enquête préliminaire (art. 75 CPP) est menée sous l\'autorité du procureur, sans urgence de flagrance, avec des pouvoirs d\'investigation limités.',
  },

  // ══════════════════════════════════════════════════════
  // CULTURE GÉNÉRALE (15 questions supplémentaires)
  // ══════════════════════════════════════════════════════
  {
    id: 'C008',
    categorie: 'CULTURE',
    enonce: 'Quel est le rôle du Conseil constitutionnel ?',
    options: [
      'Juger les crimes contre l\'État',
      'Contrôler la conformité des lois à la Constitution',
      'Gérer le budget de l\'État',
      'Nommer les ministres',
    ],
    correctIndex: 1,
    explication: 'Le Conseil constitutionnel vérifie que les lois respectent la Constitution, soit avant promulgation (art. 61), soit par QPC (art. 61-1) depuis 2010.',
  },
  {
    id: 'C009',
    categorie: 'CULTURE',
    enonce: 'Quelle est la durée du mandat présidentiel en France ?',
    options: ['4 ans', '5 ans', '6 ans', '7 ans'],
    correctIndex: 1,
    explication: 'Depuis la réforme constitutionnelle de 2000 (quinquennat), le mandat présidentiel est de 5 ans, renouvelable une fois (depuis 2008).',
  },
  {
    id: 'C010',
    categorie: 'CULTURE',
    enonce: 'Comment s\'appelle le Parlement français ?',
    options: [
      'Le Sénat uniquement',
      'L\'Assemblée nationale uniquement',
      'Le Congrès',
      'Le Parlement, composé de l\'Assemblée nationale et du Sénat',
    ],
    correctIndex: 3,
    explication: 'Le Parlement français est bicaméral : l\'Assemblée nationale (577 députés élus au suffrage universel direct) et le Sénat (348 sénateurs élus au suffrage indirect).',
  },
  {
    id: 'C011',
    categorie: 'CULTURE',
    enonce: 'Qu\'est-ce que la laïcité en France ?',
    options: [
      'L\'interdiction de toute religion sur le territoire',
      'La religion catholique comme religion d\'État',
      'La neutralité de l\'État à l\'égard des religions et la liberté de conscience',
      'L\'obligation d\'être athée pour les fonctionnaires',
    ],
    correctIndex: 2,
    explication: 'La loi du 9 décembre 1905 sépare l\'Église de l\'État. La laïcité garantit la liberté de conscience et la neutralité des institutions publiques.',
  },
  {
    id: 'C012',
    categorie: 'CULTURE',
    enonce: 'Quel est le rôle du préfet ?',
    options: [
      'Représenter le Parlement dans le département',
      'Représenter l\'État et le gouvernement dans le département ou la région',
      'Diriger le conseil général',
      'Superviser les tribunaux locaux',
    ],
    correctIndex: 1,
    explication: 'Le préfet est nommé en Conseil des ministres. Il représente l\'État, met en œuvre les politiques gouvernementales et assure l\'ordre public dans son ressort.',
  },
  {
    id: 'C013',
    categorie: 'CULTURE',
    enonce: 'Quelle est la capitale administrative de la France ?',
    options: ['Lyon', 'Marseille', 'Paris', 'Strasbourg'],
    correctIndex: 2,
    explication: 'Paris est la capitale et le siège des principaux pouvoirs (Élysée, Assemblée nationale, Sénat, ministères). Strasbourg accueille notamment le Parlement européen.',
  },
  {
    id: 'C014',
    categorie: 'CULTURE',
    enonce: 'Combien y a-t-il de départements en France métropolitaine ?',
    options: ['87', '95', '96', '101'],
    correctIndex: 1,
    explication: 'La France métropolitaine compte 95 départements (de 01 à 95, sans 20 divisé en 2A/2B pour la Corse). En ajoutant les DOM, on atteint 101 départements.',
  },
  {
    id: 'C015',
    categorie: 'CULTURE',
    enonce: 'Quel est l\'hymne national français ?',
    options: ['Le Chant du départ', 'La Marseillaise', 'La Brabançonne', 'L\'Internationale'],
    correctIndex: 1,
    explication: 'La Marseillaise, composée par Rouget de Lisle en 1792, est l\'hymne national depuis 1795. Elle est consacrée à l\'article 2 de la Constitution de 1958.',
  },
  {
    id: 'C016',
    categorie: 'CULTURE',
    enonce: 'Quelle institution est chargée de contrôler les comptes publics en France ?',
    options: ['Le Conseil d\'État', 'La Cour des comptes', 'Le Tribunal des conflits', 'La Cour de cassation'],
    correctIndex: 1,
    explication: 'La Cour des comptes contrôle la régularité des comptes de l\'État et des organismes publics. Elle publie un rapport annuel et peut saisir la justice financière.',
  },
  {
    id: 'C017',
    categorie: 'CULTURE',
    enonce: 'Qu\'est-ce que le droit de grève en France ?',
    options: [
      'Un droit interdit aux fonctionnaires',
      'Un droit constitutionnel reconnu à tous les travailleurs sans restriction',
      'Un droit constitutionnel encadré par la loi, avec des restrictions pour certains services',
      'Un droit accordé uniquement au secteur privé',
    ],
    correctIndex: 2,
    explication: 'Le droit de grève est reconnu par le préambule de 1946 (Constitution). Il s\'exerce dans le cadre de la loi, avec des restrictions pour les services publics essentiels.',
  },
  {
    id: 'C018',
    categorie: 'CULTURE',
    enonce: 'Quel est le rôle du médiateur de la République (Défenseur des droits) ?',
    options: [
      'Juger les litiges entre citoyens',
      'Défendre les droits et libertés des citoyens face aux administrations',
      'Gérer les conflits diplomatiques',
      'Contrôler la police nationale',
    ],
    correctIndex: 1,
    explication: 'Le Défenseur des droits (créé en 2011, art. 71-1 Constitution) regroupe plusieurs autorités dont le Médiateur. Il traite les réclamations contre les administrations.',
  },
  {
    id: 'C019',
    categorie: 'CULTURE',
    enonce: 'Quelle est la principale mission de l\'Union européenne ?',
    options: [
      'Former une armée commune en Europe',
      'Imposer une religion unique en Europe',
      'Promouvoir la paix, ses valeurs et le bien-être de ses peuples, notamment via le marché unique',
      'Remplacer les gouvernements nationaux',
    ],
    correctIndex: 2,
    explication: 'Selon l\'art. 3 du Traité sur l\'Union européenne, l\'UE vise la paix, la prospérité, la liberté, la sécurité et le marché intérieur commun.',
  },
  {
    id: 'C020',
    categorie: 'CULTURE',
    enonce: 'Quel est le suffrage utilisé pour élire le Président de la République en France ?',
    options: [
      'Suffrage indirect par les grands électeurs',
      'Suffrage universel direct à deux tours',
      'Vote au Parlement',
      'Désignation par le Conseil constitutionnel',
    ],
    correctIndex: 1,
    explication: 'Depuis 1962 (référendum), le Président est élu au suffrage universel direct à deux tours. Si aucun candidat n\'obtient la majorité absolue au 1er tour, un 2e tour est organisé.',
  },
  {
    id: 'C021',
    categorie: 'CULTURE',
    enonce: 'Qu\'est-ce que la naturalisation ?',
    options: [
      'Le droit d\'asile accordé aux réfugiés',
      'L\'acquisition de la nationalité française par décision de l\'État pour un étranger',
      'Le droit de vote accordé aux étrangers',
      'L\'enregistrement d\'une naissance',
    ],
    correctIndex: 1,
    explication: 'La naturalisation permet à un étranger résidant en France (généralement 5 ans) d\'acquérir la nationalité française par décret, sous conditions d\'intégration.',
  },
  {
    id: 'C022',
    categorie: 'CULTURE',
    enonce: 'Quelle est la date de la fête nationale française ?',
    options: ['1er mai', '8 mai', '14 juillet', '11 novembre'],
    correctIndex: 2,
    explication: 'Le 14 juillet commémore la prise de la Bastille (1789) et la Fête de la Fédération (1790). Il est fête nationale depuis la loi du 6 juillet 1880.',
  },

  // ══════════════════════════════════════════════════════
  // LOGIQUE & RAISONNEMENT (10 questions supplémentaires)
  // ══════════════════════════════════════════════════════
  {
    id: 'L006',
    categorie: 'LOGIQUE',
    enonce: 'Complétez la série : 1, 4, 9, 16, 25, …',
    options: ['30', '34', '36', '49'],
    correctIndex: 2,
    explication: 'Ce sont les carrés des entiers : 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36.',
  },
  {
    id: 'L007',
    categorie: 'LOGIQUE',
    enonce: 'Si aucun policier n\'est criminel, et que Paul est policier, que peut-on conclure ?',
    options: [
      'Paul est peut-être criminel',
      'Paul n\'est certainement pas criminel',
      'Paul pourrait devenir criminel',
      'On ne peut rien conclure',
    ],
    correctIndex: 1,
    explication: 'Syllogisme : si l\'ensemble des policiers est disjoint de l\'ensemble des criminels, et Paul ∈ policiers, alors Paul ∉ criminels. Conclusion certaine.',
  },
  {
    id: 'L008',
    categorie: 'LOGIQUE',
    enonce: 'Un train roule à 120 km/h. Combien de temps met-il pour parcourir 300 km ?',
    options: ['1h30', '2h', '2h30', '3h'],
    correctIndex: 2,
    explication: 'Temps = Distance ÷ Vitesse = 300 ÷ 120 = 2,5 heures = 2h30.',
  },
  {
    id: 'L009',
    categorie: 'LOGIQUE',
    enonce: 'Complétez : ABDC, CDFE, EFHG, …',
    options: ['GHIJ', 'GHJI', 'GIJH', 'IJGH'],
    correctIndex: 1,
    explication: 'Chaque groupe commence 2 lettres après le précédent (AB→CD→EF→GH). Les 2 dernières lettres sont inversées : DC, FE, HG → JI. Donc GHJI.',
  },
  {
    id: 'L010',
    categorie: 'LOGIQUE',
    enonce: 'Dans un groupe de 30 élèves, 18 pratiquent le football et 15 le basket. 7 pratiquent les deux. Combien ne pratiquent aucun sport ?',
    options: ['2', '3', '4', '5'],
    correctIndex: 2,
    explication: 'Formule inclusion-exclusion : football OU basket = 18 + 15 - 7 = 26. Ne pratiquant aucun sport : 30 - 26 = 4.',
  },
  {
    id: 'L011',
    categorie: 'LOGIQUE',
    enonce: 'Le mot POLICE contient 6 lettres. Combien de fois la lettre I apparaît-elle dans DISCIPLINE ?',
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explication: 'D-I-S-C-I-P-L-I-N-E : les lettres I sont aux positions 2, 5 et 8. Il y a 3 fois la lettre I.',
  },
  {
    id: 'L012',
    categorie: 'LOGIQUE',
    enonce: 'Si A > B et B > C, quelle affirmation est forcément vraie ?',
    options: ['C > A', 'A = C', 'A > C', 'B = A'],
    correctIndex: 2,
    explication: 'Par transitivité de la relation "supérieur à" : si A > B et B > C, alors nécessairement A > C.',
  },
  {
    id: 'L013',
    categorie: 'LOGIQUE',
    enonce: 'Un fonctionnaire gagne 2 200 € net. Il reçoit une prime de 15 %. Quel est son revenu total ce mois ?',
    options: ['2 415 €', '2 450 €', '2 530 €', '2 545 €'],
    correctIndex: 2,
    explication: '15 % de 2 200 = 330 €. Revenu total = 2 200 + 330 = 2 530 €.',
  },
  {
    id: 'L014',
    categorie: 'LOGIQUE',
    enonce: 'Tous les chiens sont des animaux. Rex est un animal. Peut-on conclure que Rex est un chien ?',
    options: [
      'Oui, certainement',
      'Non, on ne peut pas conclure',
      'Oui, probablement',
      'Non, Rex ne peut pas être un chien',
    ],
    correctIndex: 1,
    explication: 'Erreur logique classique : "Tous les chiens sont animaux" ne signifie pas que tous les animaux sont chiens. Rex pourrait être un chat, un oiseau, etc.',
  },
  {
    id: 'L015',
    categorie: 'LOGIQUE',
    enonce: 'Quelle figure complète la série : △ ○ □ △△ ○○ □□ △△△ ○○○ … ?',
    options: ['□□', '□□□', '△△△△', '○○○○'],
    correctIndex: 1,
    explication: 'La série répète le cycle triangle-cercle-carré avec une répétition croissante : 1-1-1, 2-2-2, 3-3-3. Après ○○○, c\'est □□□.',
  },

  // ══════════════════════════════════════════════════════
  // SÉCURITÉ & POLICE (10 questions supplémentaires)
  // ══════════════════════════════════════════════════════
  {
    id: 'S006',
    categorie: 'SECURITE',
    enonce: 'Qu\'est-ce que la BAC (Brigade Anti-Criminalité) ?',
    options: [
      'Une unité spécialisée dans les enquêtes financières',
      'Une unité de voie publique intervenant en civil, principalement la nuit, pour lutter contre la délinquance',
      'Le service de protection des personnalités',
      'Une brigade de gendarmerie',
    ],
    correctIndex: 1,
    explication: 'La BAC est une unité de police nationale travaillant en civil, souvent la nuit, pour interpeller les auteurs d\'infractions en flagrant délit.',
  },
  {
    id: 'S007',
    categorie: 'SECURITE',
    enonce: 'Quel est le rôle de la DCRI (devenue DGSI) ?',
    options: [
      'La police judiciaire criminelle',
      'Le renseignement intérieur et la protection du territoire national',
      'La coopération internationale policière',
      'La gestion des frontières',
    ],
    correctIndex: 1,
    explication: 'La DGSI (créée en 2014, en remplacement de la DCRI) est le service de renseignement intérieur autonome, rattaché au Ministère de l\'Intérieur. Elle est chargée du contre-espionnage, contre-terrorisme et de la cybersécurité.',
  },
  {
    id: 'S008',
    categorie: 'SECURITE',
    enonce: 'Quelle est la différence entre la Police nationale et la Gendarmerie nationale ?',
    options: [
      'Aucune différence, ce sont les mêmes forces',
      'La Police est civile (Ministère de l\'Intérieur), la Gendarmerie est une force militaire placée sous l\'autorité du Ministère de l\'Intérieur depuis 2009',
      'La Gendarmerie s\'occupe uniquement des crimes, la Police des délits',
      'La Police est nationale, la Gendarmerie est locale',
    ],
    correctIndex: 1,
    explication: 'La Police nationale est une force civile. La Gendarmerie est une force militaire placée sous l\'autorité du Ministère de l\'Intérieur depuis 2009 (loi du 3 août 2009), tout en conservant son statut militaire. Elle est compétente principalement en zones rurales et périurbaines.',
  },
  {
    id: 'S009',
    categorie: 'SECURITE',
    enonce: 'Qu\'est-ce que l\'OPJ (Officier de Police Judiciaire) ?',
    options: [
      'Tout fonctionnaire de police',
      'Un magistrat du parquet',
      'Un fonctionnaire habilité à mener des enquêtes judiciaires, exercer les pouvoirs de police judiciaire et diriger les APJ',
      'Un grade de la Police nationale uniquement',
    ],
    correctIndex: 2,
    explication: 'L\'OPJ est habilité par le procureur général. Il peut placer en GAV, effectuer des perquisitions, des saisies et dirige les agents de police judiciaire (APJ).',
  },
  {
    id: 'S010',
    categorie: 'SECURITE',
    enonce: 'Quel est le numéro national d\'urgence commun à toute l\'Europe ?',
    options: ['15', '17', '18', '112'],
    correctIndex: 3,
    explication: 'Le 112 est le numéro d\'urgence européen, accessible dans tous les pays de l\'UE. Il redirige vers les services compétents (police, pompiers, SAMU).',
  },
  {
    id: 'S011',
    categorie: 'SECURITE',
    enonce: 'Qu\'est-ce que le maintien de l\'ordre ?',
    options: [
      'La surveillance des frontières',
      'L\'ensemble des techniques et dispositifs visant à prévenir et encadrer les manifestations et troubles à l\'ordre public',
      'L\'arrestation des délinquants',
      'La protection des bâtiments officiels',
    ],
    correctIndex: 1,
    explication: 'Le maintien de l\'ordre est assuré principalement par les CRS (Compagnies Républicaines de Sécurité) et les gendarmes mobiles lors de manifestations ou d\'émeutes.',
  },
  {
    id: 'S012',
    categorie: 'SECURITE',
    enonce: 'Qu\'est-ce que l\'INTERPOL ?',
    options: [
      'La police de l\'Union européenne',
      'Une organisation internationale facilitant la coopération policière entre 196 pays membres',
      'La brigade criminelle française',
      'Un tribunal pénal international',
    ],
    correctIndex: 1,
    explication: 'INTERPOL (Organisation Internationale de Police Criminelle) coordonne la coopération policière mondiale via des notices (rouges, bleues…) et des bases de données partagées.',
  },
  {
    id: 'S013',
    categorie: 'SECURITE',
    enonce: 'Quelle unité d\'élite de la Police nationale intervient en cas de prise d\'otages ou d\'actes terroristes ?',
    options: ['BAC', 'BRI', 'RAID', 'CRS'],
    correctIndex: 2,
    explication: 'Le RAID (Recherche Assistance Intervention Dissuasion) est l\'unité d\'intervention d\'élite de la Police nationale pour les situations les plus dangereuses.',
  },
  {
    id: 'S014',
    categorie: 'SECURITE',
    enonce: 'Qu\'est-ce que la police municipale ?',
    options: [
      'Une force nationale sous autorité préfectorale',
      'Une force locale sous autorité du maire, complémentaire de la Police nationale',
      'Un service de sécurité privée',
      'La même chose que la Police nationale en zone urbaine',
    ],
    correctIndex: 1,
    explication: 'La police municipale relève du maire. Elle exerce des pouvoirs de police administrative locale (stationnement, tranquillité publique) et des missions limitées de police judiciaire.',
  },
  {
    id: 'S015',
    categorie: 'SECURITE',
    enonce: 'Quel document doit présenter un policier lors d\'un contrôle d\'identité ?',
    options: [
      'Aucun document n\'est obligatoire',
      'Sa carte professionnelle s\'il est en civil, ou son uniforme et son matricule suffit en tenue',
      'Son passeport',
      'Une autorisation du procureur',
    ],
    correctIndex: 1,
    explication: 'Un policier en civil doit présenter sa carte professionnelle tricolore. En tenue, l\'uniforme et le numéro de matricule visible sur l\'épaule suffisent à l\'identification.',
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Retourne les questions d'une catégorie. */
export function getByCategorie(categorie) {
  return QUESTIONS.filter(q => q.categorie === categorie);
}

/** Mélange et retourne n questions aléatoires. */
export function getRandomQuestions(n = 10, categorie = null) {
  const pool = categorie ? getByCategorie(categorie) : [...QUESTIONS];
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(n, pool.length));
}

/** Retourne les questions d'une session "Entraînement éclair" (5 questions variées). */
export function getFlashSession() {
  return getRandomQuestions(5);
}

/** Retourne les questions d'un quiz complet (toutes les catégories, 20 questions). */
export function getFullSession() {
  return getRandomQuestions(20);
}
