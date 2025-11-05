// Language System
let currentLanguage = 'en';

const translations = {
    en: {
        // Header
        title: '🥋 IBJJF Rules Guide',
        subtitle: 'Master Brazilian Jiu-Jitsu Competition Rules',
        backButton: 'Back',
        
        // Tabs
        tabScoring: 'Scoring System',
        tabAdvantages: 'Advantages',
        tabPenalties: 'Penalties',
        tabIllegal: 'Illegal Moves',
        tabQuiz: 'Quiz 🎯',
        
        // Common terms
        points: 'PTS',
        requirements: '✓ Requirements:',
        exceptions: '✗ No Points If:',
        advantageOnly: '✗ Advantage Only If:',
        note: 'Note:',
        examples: 'Examples:',
        awardedFor: 'Awarded For:',
        
        // Scoring Section
        takedownTitle: 'Takedown',
        takedownDesc: 'Taking opponent from standing to the ground with you landing on top in a controlled position.',
        takedownReq1: 'Opponent\'s back must touch the mat',
        takedownReq2: 'You must establish top position',
        takedownReq3: 'Hold control for 3 seconds',
        takedownNote: 'If you throw but land on bottom, the thrower gets 2 points and top person gets 1 advantage.',
        
        sweepTitle: 'Sweep',
        sweepDesc: 'Reversing position from bottom guard to top, establishing control over opponent.',
        sweepReq1: 'Must start from guard position',
        sweepReq2: 'End on top with control',
        sweepReq3: 'Maintain position for 3 seconds',
        sweepExc1: 'Opponent stands up before 3 seconds',
        sweepExc2: 'No clear control established',
        
        kneeTitle: 'Knee on Belly',
        kneeDesc: 'Placing your knee on opponent\'s torso while maintaining balance with other foot on ground.',
        kneeReq1: 'One knee on torso/belly',
        kneeReq2: 'Other foot planted on ground',
        kneeReq3: 'Hold for 3 seconds',
        kneeNote: 'If other knee is on ground = Advantage only. Switching sides does NOT give new points.',
        
        passTitle: 'Guard Pass',
        passDesc: 'Moving past opponent\'s legs to establish side control or similar dominant position.',
        passReq1: 'Start between opponent\'s legs',
        passReq2: 'Reach side control, north-south, or mount',
        passReq3: 'Be perpendicular or parallel to opponent',
        passReq4: 'Hold 3 seconds with control',
        passExc1: 'Opponent gets to knees or stands',
        passExc2: 'Position not held 3 seconds',
        
        mountTitle: 'Mount',
        mountDesc: 'Sitting on opponent\'s torso with weight distributed - one of the most dominant positions.',
        mountReq1: 'Sitting on opponent\'s torso',
        mountReq2: 'Can mount one arm, NEVER both',
        mountReq3: 'Legs/feet must NOT be on opponent\'s legs',
        mountReq4: 'Hold for 3 seconds',
        mountExc1: 'Both opponent\'s arms trapped under you',
        mountExc2: 'Mounted triangle position',
        
        backTitle: 'Back Control',
        backDesc: 'Taking opponent\'s back with hooks - the most dominant position for submissions.',
        backReq1: 'Both hooks inside opponent\'s thighs',
        backReq2: 'Heels on inner thighs',
        backReq3: 'Control of upper body',
        backReq4: 'Hold for 3 seconds',
        backExc1: 'Body triangle instead of hooks',
        backExc2: 'Crossed feet without hooks',
        backExc3: 'Both opponent\'s arms trapped',
        
        // Advantages Section
        advWhatTitle: 'What Are Advantages?',
        advWhatDesc: 'Advantages are awarded for nearly completing scoring positions or threatening submissions. They break ties when points are equal.',
        advIncompleteTitle: 'Incomplete Positions',
        advIncompleteDesc: 'These situations earn advantages instead of full points due to incomplete control.',
        advSubmissionTitle: 'Submission Attempts',
        advSubmissionDesc: 'Close submission attempts that put opponent in danger can earn advantages at referee\'s discretion.',
        advTieTitle: 'Tie-Breaking Order',
        advTieDesc: 'When scores are tied, this order determines the winner.',
        advAwardedFor1: 'Nearly completing a takedown',
        advAwardedFor2: 'Positions held less than 3 seconds',
        advAwardedFor3: 'Close submission attempts',
        advAwardedFor4: 'Almost passing guard',
        advAwardedFor5: 'Coming on top after both pull guard',
        advExample1: 'Mount with both arms trapped = Advantage',
        advExample2: 'Back control with body triangle = Advantage',
        advExample3: 'Knee on belly with other knee down = Advantage',
        advExample4: 'Guard pass but opponent stands = Advantage',
        advConsiders: 'Referee Considers:',
        advConsider1: 'Proximity to finishing',
        advConsider2: 'Amount of danger',
        advConsider3: 'Quality of technique',
        advConsider4: 'Opponent\'s defensive reaction',
        advSubNote: 'Advantages for submissions are entirely at referee\'s discretion.',
        advPriority: 'Priority:',
        advPriority1: '1. Points',
        advPriority1Sub: '(highest priority)',
        advPriority2: '2. Advantages',
        advPriority2Sub: '(second)',
        advPriority3: '3. Penalties',
        advPriority3Sub: '(fewer is better)',
        advPriority4: '4. Referee Decision',
        advPriority4Sub: '(final)',
        advTieNote: 'There are NEVER draws in IBJJF - a winner is always declared.',
        
        // Penalties Section
        penSystemTitle: 'Penalty System',
        penSystemDesc: 'IBJJF uses penalties for rule violations, stalling, and dangerous actions.',
        penProgression: 'Penalty Progression:',
        penProg1: '1st & 2nd:',
        penProg1Detail: 'Warning',
        penProg2: 'After 2nd:',
        penProg2Detail: 'Opponent gets 1 Advantage',
        penProg3: '3rd Penalty:',
        penProg3Detail: 'Opponent gets 2 Points',
        penProg4: '4th Penalty:',
        penProg4Detail: 'Disqualification',
        penStallingTitle: 'Stalling',
        penStallingDesc: 'Not engaging with opponent or avoiding action - the most common penalty.',
        penStallEx1: 'Holding position 20+ seconds without progress',
        penStallEx2: 'Running from sweeps or submissions',
        penStallEx3: 'Not attempting to pass, sweep, or submit',
        penStallEx4: 'Pulling guard then standing immediately',
        penStallEx5: 'Leaving area to avoid techniques',
        penStallNote: 'Referee says "LUTE" (fight) and gives 20 seconds. No progress = penalty.',
        penTechTitle: 'Technical Fouls',
        penTechDesc: 'Minor rule violations that accumulate toward disqualification.',
        penCommonFouls: 'Common Fouls:',
        penFoul1: 'Gripping inside gi sleeves/pants',
        penFoul2: 'Holding opponent\'s belt',
        penFoul3: 'Talking during match',
        penFoul4: 'Not following referee instructions',
        penFoul5: 'Repeatedly leaving the mat',
        penSevereTitle: 'Severe Penalties',
        penSevereDesc: 'Immediate disqualification - no warnings given for these violations.',
        penImmediateDQ: 'Immediate DQ:',
        penDQ1: 'Slamming opponent',
        penDQ2: 'Striking in any way',
        penDQ3: 'Biting or hair pulling',
        penDQ4: 'Illegal submissions for belt level',
        penDQ5: 'Disrespecting referee or opponent',
        penDQ6: 'Unsportsmanlike conduct',
        penFleeTitle: 'Fleeing The Mat',
        penFleeDesc: 'Deliberately leaving competition area to avoid techniques.',
        penPenalty: 'Penalty:',
        penFlee1: '2 Points to Opponent',
        penFlee2: 'Match restarted standing',
        penFlee3: 'Next offense = Disqualification',
        penFleeNote: 'One of the few ways to lose 2 points immediately!',
        
        // Illegal Moves Section
        illBeltTitle: 'Belt-Specific Rules',
        illBeltDesc: 'Many techniques are illegal at lower belts but become legal as you progress. Always verify your belt level restrictions!',
        illBeltNote: 'Check the official IBJJF rulebook for detailed charts showing legality by belt color and age division.',
        illSlamTitle: 'Slamming',
        illSlamDesc: 'ILLEGAL AT ALL LEVELS',
        illSlamDesc2: '- Violently throwing opponent to escape or while lifting.',
        illSlamEx1: 'Slamming to escape triangle',
        illSlamEx2: 'Slamming to escape armbar',
        illSlamEx3: 'Powerbombing from any position',
        illSlamEx4: 'Dropping opponent violently',
        illSlamResult: 'Result:',
        illSlamResultText: 'Immediate disqualification',
        illReapTitle: 'Leg Reaping',
        illReapDesc: 'When your outside leg crosses opponent\'s midline during leg entanglements.',
        illStatusBelt: 'Status by Belt:',
        illReap1: 'White/Blue/Purple:',
        illReap1Detail: 'ILLEGAL',
        illReap2: 'Brown/Black:',
        illReap2Detail: 'Legal in some contexts',
        illReapNote: 'Puts dangerous pressure on knee. Be careful in leg entanglements!',
        illNeckTitle: 'Neck Cranks',
        illNeckDesc: 'Submissions attacking the neck/spine rather than blood choke. Highly restricted.',
        illIllegal: '✗ Illegal:',
        illNeck1: 'Full nelson (all belts)',
        illNeck2: 'Crucifix neck crank',
        illNeck3: 'Twisting neck submissions',
        illNeck4: 'Spinal locks ("can opener")',
        illLegTitle: 'Leg Attacks',
        illLegDesc: 'Legality depends on belt level and age division.',
        illGeneralRules: 'General Rules:',
        illLeg1: 'Heel Hooks:',
        illLeg1Detail: 'Brown/Black only',
        illLeg2: 'Knee Bars:',
        illLeg2Detail: 'Purple and above',
        illLeg3: 'Toe Holds:',
        illLeg3Detail: 'Purple and above',
        illLeg4: 'Calf Slicers:',
        illLeg4Detail: 'Brown/Black only',
        illLeg5: 'Straight Ankle Locks:',
        illLeg5Detail: 'Most belts',
        illStrikeTitle: 'Striking & Violence',
        illStrikeDesc: 'ALWAYS ILLEGAL',
        illStrikeDesc2: '- BJJ is a grappling art only.',
        illStrike1: 'Punching or slapping',
        illStrike2: 'Kicking',
        illStrike3: 'Headbutting',
        illStrike4: 'Biting',
        illStrike5: 'Eye gouging',
        illStrike6: 'Hair pulling',
        illJointTitle: 'Small Joint Manipulation',
        illJointDesc: 'Grabbing and manipulating individual fingers or toes is illegal.',
        illNeverAllowed: '✗ Never Allowed:',
        illJoint1: 'Bending individual fingers',
        illJoint2: 'Twisting individual toes',
        illJoint3: 'Small joint locks',
        illJointNote: 'Wrist locks are legal at purple belt and above.',
        
        // Quiz
        quizTitle: '🎯 Test Your Knowledge',
        quizScore: 'Score:',
        quizQuestion: 'Question',
        quizSubmit: 'Submit Answer',
        quizNext: 'Next Question',
        quizTryAgain: 'Try Again',
        quizBackToRules: 'Back to Rules',
        quizSelectAnswer: 'Please select an answer!',
        quizResult1: 'Outstanding! You know the IBJJF rules like a black belt!',
        quizResult2: 'Great job! You have a solid understanding of the rules!',
        quizResult3: 'Good effort! Review the rules and try again!',
        quizResult4: 'Keep studying! The rules take time to master!'
    },
    fr: {
        // Header
        title: '🥋 Guide des Règles IBJJF',
        subtitle: 'Maîtrisez les Règles de Compétition de Jiu-Jitsu Brésilien',
        backButton: 'Retour',
        
        // Tabs
        tabScoring: 'Système de Points',
        tabAdvantages: 'Avantages',
        tabPenalties: 'Pénalités',
        tabIllegal: 'Mouvements Interdits',
        tabQuiz: 'Quiz 🎯',
        
        // Common terms
        points: 'PTS',
        requirements: '✓ Exigences :',
        exceptions: '✗ Pas de Points Si :',
        advantageOnly: '✗ Avantage Seulement Si :',
        note: 'Note :',
        examples: 'Exemples :',
        awardedFor: 'Attribué Pour :',
        
        // Scoring Section
        takedownTitle: 'Projection',
        takedownDesc: 'Amener l\'adversaire du debout au sol en atterrissant sur lui en position de contrôle.',
        takedownReq1: 'Le dos de l\'adversaire doit toucher le tapis',
        takedownReq2: 'Vous devez établir une position dominante',
        takedownReq3: 'Maintenir le contrôle pendant 3 secondes',
        takedownNote: 'Si vous projetez mais atterrissez en dessous, le lanceur reçoit 2 points et celui au dessus reçoit 1 avantage.',
        
        sweepTitle: 'Renversement',
        sweepDesc: 'Inverser la position depuis la garde en bas vers le dessus, en établissant le contrôle de l\'adversaire.',
        sweepReq1: 'Doit commencer en position de garde',
        sweepReq2: 'Finir au dessus avec contrôle',
        sweepReq3: 'Maintenir la position pendant 3 secondes',
        sweepExc1: 'L\'adversaire se lève avant 3 secondes',
        sweepExc2: 'Aucun contrôle clair établi',
        
        kneeTitle: 'Genou sur Ventre',
        kneeDesc: 'Placer votre genou sur le torse de l\'adversaire tout en maintenant l\'équilibre avec l\'autre pied au sol.',
        kneeReq1: 'Un genou sur le torse/ventre',
        kneeReq2: 'L\'autre pied posé au sol',
        kneeReq3: 'Maintenir pendant 3 secondes',
        kneeNote: 'Si l\'autre genou est au sol = Avantage seulement. Changer de côté ne donne PAS de nouveaux points.',
        
        passTitle: 'Passage de Garde',
        passDesc: 'Passer les jambes de l\'adversaire pour établir un contrôle latéral ou une position dominante similaire.',
        passReq1: 'Commencer entre les jambes de l\'adversaire',
        passReq2: 'Atteindre le contrôle latéral, nord-sud, ou la montée',
        passReq3: 'Être perpendiculaire ou parallèle à l\'adversaire',
        passReq4: 'Maintenir 3 secondes avec contrôle',
        passExc1: 'L\'adversaire se met à genoux ou se lève',
        passExc2: 'Position non maintenue 3 secondes',
        
        mountTitle: 'Montée',
        mountDesc: 'S\'asseoir sur le torse de l\'adversaire avec le poids distribué - une des positions les plus dominantes.',
        mountReq1: 'Assis sur le torse de l\'adversaire',
        mountReq2: 'Peut monter un bras, JAMAIS les deux',
        mountReq3: 'Les jambes/pieds ne doivent PAS être sur les jambes de l\'adversaire',
        mountReq4: 'Maintenir pendant 3 secondes',
        mountExc1: 'Les deux bras de l\'adversaire piégés sous vous',
        mountExc2: 'Position de triangle monté',
        
        backTitle: 'Contrôle du Dos',
        backDesc: 'Prendre le dos de l\'adversaire avec les crochets - la position la plus dominante pour les soumissions.',
        backReq1: 'Les deux crochets à l\'intérieur des cuisses de l\'adversaire',
        backReq2: 'Talons sur l\'intérieur des cuisses',
        backReq3: 'Contrôle du haut du corps',
        backReq4: 'Maintenir pendant 3 secondes',
        backExc1: 'Triangle du corps au lieu de crochets',
        backExc2: 'Pieds croisés sans crochets',
        backExc3: 'Les deux bras de l\'adversaire piégés',
        
        // Advantages Section
        advWhatTitle: 'Que Sont les Avantages ?',
        advWhatDesc: 'Les avantages sont attribués pour avoir presque terminé des positions de score ou menacé des soumissions. Ils brisent les égalités lorsque les points sont égaux.',
        advIncompleteTitle: 'Positions Incomplètes',
        advIncompleteDesc: 'Ces situations donnent des avantages au lieu de points complets en raison d\'un contrôle incomplet.',
        advSubmissionTitle: 'Tentatives de Soumission',
        advSubmissionDesc: 'Les tentatives de soumission proches qui mettent l\'adversaire en danger peuvent rapporter des avantages à la discrétion de l\'arbitre.',
        advTieTitle: 'Ordre de Départage',
        advTieDesc: 'Lorsque les scores sont égaux, cet ordre détermine le gagnant.',
        advAwardedFor1: 'Avoir presque complété une projection',
        advAwardedFor2: 'Positions maintenues moins de 3 secondes',
        advAwardedFor3: 'Tentatives de soumission proches',
        advAwardedFor4: 'Avoir presque passé la garde',
        advAwardedFor5: 'Être au dessus après que les deux tirent la garde',
        advExample1: 'Montée avec les deux bras piégés = Avantage',
        advExample2: 'Contrôle du dos avec triangle du corps = Avantage',
        advExample3: 'Genou sur ventre avec l\'autre genou au sol = Avantage',
        advExample4: 'Passage de garde mais l\'adversaire se lève = Avantage',
        advConsiders: 'L\'arbitre Considère :',
        advConsider1: 'Proximité de la finition',
        advConsider2: 'Niveau de danger',
        advConsider3: 'Qualité de la technique',
        advConsider4: 'Réaction défensive de l\'adversaire',
        advSubNote: 'Les avantages pour les soumissions sont entièrement à la discrétion de l\'arbitre.',
        advPriority: 'Priorité :',
        advPriority1: '1. Points',
        advPriority1Sub: '(priorité la plus élevée)',
        advPriority2: '2. Avantages',
        advPriority2Sub: '(second)',
        advPriority3: '3. Pénalités',
        advPriority3Sub: '(moins c\'est mieux)',
        advPriority4: '4. Décision de l\'Arbitre',
        advPriority4Sub: '(final)',
        advTieNote: 'Il n\'y a JAMAIS d\'égalité en IBJJF - un gagnant est toujours déclaré.',
        
        // Penalties Section
        penSystemTitle: 'Système de Pénalités',
        penSystemDesc: 'L\'IBJJF utilise des pénalités pour les violations des règles, le jeu passif et les actions dangereuses.',
        penProgression: 'Progression des Pénalités :',
        penProg1: '1ère & 2ème :',
        penProg1Detail: 'Avertissement',
        penProg2: 'Après la 2ème :',
        penProg2Detail: 'L\'adversaire obtient 1 Avantage',
        penProg3: '3ème Pénalité :',
        penProg3Detail: 'L\'adversaire obtient 2 Points',
        penProg4: '4ème Pénalité :',
        penProg4Detail: 'Disqualification',
        penStallingTitle: 'Jeu Passif',
        penStallingDesc: 'Ne pas s\'engager avec l\'adversaire ou éviter l\'action - la pénalité la plus courante.',
        penStallEx1: 'Maintenir une position 20+ secondes sans progrès',
        penStallEx2: 'Fuir les balayages ou soumissions',
        penStallEx3: 'Ne pas tenter de passer, balayer ou soumettre',
        penStallEx4: 'Tirer la garde puis se lever immédiatement',
        penStallEx5: 'Quitter la zone pour éviter les techniques',
        penStallNote: 'L\'arbitre dit "LUTE" (combattez) et donne 20 secondes. Pas de progrès = pénalité.',
        penTechTitle: 'Fautes Techniques',
        penTechDesc: 'Violations mineures des règles qui s\'accumulent vers la disqualification.',
        penCommonFouls: 'Fautes Courantes :',
        penFoul1: 'Saisir à l\'intérieur des manches/pantalons du gi',
        penFoul2: 'Tenir la ceinture de l\'adversaire',
        penFoul3: 'Parler pendant le match',
        penFoul4: 'Ne pas suivre les instructions de l\'arbitre',
        penFoul5: 'Quitter le tapis à répétition',
        penSevereTitle: 'Pénalités Sévères',
        penSevereDesc: 'Disqualification immédiate - aucun avertissement donné pour ces violations.',
        penImmediateDQ: 'DQ Immédiate :',
        penDQ1: 'Claquer l\'adversaire',
        penDQ2: 'Frapper de quelque manière que ce soit',
        penDQ3: 'Mordre ou tirer les cheveux',
        penDQ4: 'Soumissions illégales pour le niveau de ceinture',
        penDQ5: 'Manquer de respect à l\'arbitre ou l\'adversaire',
        penDQ6: 'Conduite antisportive',
        penFleeTitle: 'Fuite du Tapis',
        penFleeDesc: 'Quitter délibérément la zone de compétition pour éviter les techniques.',
        penPenalty: 'Pénalité :',
        penFlee1: '2 Points à l\'Adversaire',
        penFlee2: 'Match redémarré debout',
        penFlee3: 'Prochaine offense = Disqualification',
        penFleeNote: 'L\'une des rares façons de perdre 2 points immédiatement !',
        
        // Illegal Moves Section
        illBeltTitle: 'Règles Spécifiques par Ceinture',
        illBeltDesc: 'De nombreuses techniques sont illégales aux ceintures inférieures mais deviennent légales avec la progression. Vérifiez toujours les restrictions de votre niveau de ceinture !',
        illBeltNote: 'Consultez le règlement officiel IBJJF pour les tableaux détaillés montrant la légalité par couleur de ceinture et division d\'âge.',
        illSlamTitle: 'Claquer',
        illSlamDesc: 'ILLÉGAL À TOUS LES NIVEAUX',
        illSlamDesc2: '- Jeter violemment l\'adversaire pour s\'échapper ou en le soulevant.',
        illSlamEx1: 'Claquer pour s\'échapper d\'un triangle',
        illSlamEx2: 'Claquer pour s\'échapper d\'un armbar',
        illSlamEx3: 'Powerbomb de n\'importe quelle position',
        illSlamEx4: 'Laisser tomber l\'adversaire violemment',
        illSlamResult: 'Résultat :',
        illSlamResultText: 'Disqualification immédiate',
        illReapTitle: 'Fauchage de Jambe',
        illReapDesc: 'Lorsque votre jambe extérieure traverse la ligne médiane de l\'adversaire lors des enchevêtrements de jambes.',
        illStatusBelt: 'Statut par Ceinture :',
        illReap1: 'Blanche/Bleue/Violette :',
        illReap1Detail: 'ILLÉGAL',
        illReap2: 'Marron/Noire :',
        illReap2Detail: 'Légal dans certains contextes',
        illReapNote: 'Met une pression dangereuse sur le genou. Soyez prudent dans les enchevêtrements de jambes !',
        illNeckTitle: 'Clés de Nuque',
        illNeckDesc: 'Soumissions attaquant la nuque/colonne vertébrale plutôt qu\'étranglement sanguin. Très restreintes.',
        illIllegal: '✗ Illégal :',
        illNeck1: 'Full nelson (toutes ceintures)',
        illNeck2: 'Clé de nuque crucifix',
        illNeck3: 'Soumissions de torsion de nuque',
        illNeck4: 'Clés vertébrales ("ouvre-boîte")',
        illLegTitle: 'Attaques de Jambes',
        illLegDesc: 'La légalité dépend du niveau de ceinture et de la division d\'âge.',
        illGeneralRules: 'Règles Générales :',
        illLeg1: 'Heel Hooks :',
        illLeg1Detail: 'Marron/Noire seulement',
        illLeg2: 'Clés de Genou :',
        illLeg2Detail: 'Violette et au-dessus',
        illLeg3: 'Toe Holds :',
        illLeg3Detail: 'Violette et au-dessus',
        illLeg4: 'Calf Slicers :',
        illLeg4Detail: 'Marron/Noire seulement',
        illLeg5: 'Clés de Cheville Droites :',
        illLeg5Detail: 'La plupart des ceintures',
        illStrikeTitle: 'Coups & Violence',
        illStrikeDesc: 'TOUJOURS ILLÉGAL',
        illStrikeDesc2: '- Le BJJ est un art de grappling uniquement.',
        illStrike1: 'Donner des coups de poing ou des gifles',
        illStrike2: 'Donner des coups de pied',
        illStrike3: 'Donner des coups de tête',
        illStrike4: 'Mordre',
        illStrike5: 'Enfoncer les yeux',
        illStrike6: 'Tirer les cheveux',
        illJointTitle: 'Manipulation des Petites Articulations',
        illJointDesc: 'Saisir et manipuler des doigts ou des orteils individuels est illégal.',
        illNeverAllowed: '✗ Jamais Autorisé :',
        illJoint1: 'Plier des doigts individuels',
        illJoint2: 'Tordre des orteils individuels',
        illJoint3: 'Clés sur petites articulations',
        illJointNote: 'Les clés de poignet sont légales à la ceinture violette et au-dessus.',
        
        // Quiz
        quizTitle: '🎯 Testez Vos Connaissances',
        quizScore: 'Score :',
        quizQuestion: 'Question',
        quizSubmit: 'Soumettre la Réponse',
        quizNext: 'Question Suivante',
        quizTryAgain: 'Réessayer',
        quizBackToRules: 'Retour aux Règles',
        quizSelectAnswer: 'Veuillez sélectionner une réponse !',
        quizResult1: 'Exceptionnel ! Vous connaissez les règles IBJJF comme une ceinture noire !',
        quizResult2: 'Excellent travail ! Vous avez une bonne compréhension des règles !',
        quizResult3: 'Bon effort ! Révisez les règles et réessayez !',
        quizResult4: 'Continuez à étudier ! Les règles prennent du temps à maîtriser !',
        
        // Quiz Questions in French
        quizQ1: 'Combien de points vaut un passage de garde réussi ?',
        quizQ1Opt: ['2 points', '3 points', '4 points', '1 avantage'],
        quizQ2: 'Que se passe-t-il si vous montez sur votre adversaire mais que ses deux bras sont piégés sous votre corps ?',
        quizQ2Opt: ['4 points', '2 points', '1 avantage seulement', 'Aucun point ou avantage'],
        quizQ3: 'Combien de temps devez-vous maintenir une position de score pour obtenir des points ?',
        quizQ3Opt: ['1 seconde', '3 secondes', '5 secondes', '10 secondes'],
        quizQ4: 'Quelle position vaut 4 points ?',
        quizQ4Opt: ['Passage de garde', 'Balayage', 'Montée', 'Projection'],
        quizQ5: 'Si vous avez le contrôle du dos mais utilisez un triangle du corps au lieu de crochets, qu\'obtenez-vous ?',
        quizQ5Opt: ['4 points', '2 points', '1 avantage', 'Rien'],
        quizQ6: 'Quel est le résultat si vous claquez votre adversaire pour échapper à une soumission ?',
        quizQ6Opt: ['Faute technique', 'Avertissement', 'Disqualification immédiate', '2 points à l\'adversaire'],
        quizQ7: 'Combien de pénalités conduisent à la disqualification ?',
        quizQ7Opt: ['2 pénalités', '3 pénalités', '4 pénalités', '5 pénalités'],
        quizQ8: 'Si vous balayez votre adversaire depuis la garde, combien de points obtenez-vous ?',
        quizQ8Opt: ['0 point', '2 points', '3 points', '4 points'],
        quizQ9: 'Que se passe-t-il si vous fuyez le tapis pour éviter un balayage ?',
        quizQ9Opt: ['Avertissement', '1 avantage à l\'adversaire', '2 points à l\'adversaire', 'Disqualification'],
        quizQ10: 'Si les deux compétiteurs tirent la garde simultanément, qui obtient l\'avantage ?',
        quizQ10Opt: ['Aucun', 'Les deux', 'Celui qui arrive au dessus', 'L\'arbitre décide'],
        quizQ11: 'Le genou sur ventre vaut combien de points ?',
        quizQ11Opt: ['1 point', '2 points', '3 points', '4 points'],
        quizQ12: 'Qu\'est-ce qui brise une égalité si les points sont égaux ?',
        quizQ12Opt: ['Décision de l\'arbitre', 'Avantages', 'Poids', 'Tentatives de soumission'],
        quizQ13: 'À quel niveau de ceinture les heel hooks sont-ils généralement légaux en IBJJF ?',
        quizQ13Opt: ['Ceinture blanche', 'Ceinture bleue', 'Ceinture violette', 'Ceinture marron/noire'],
        quizQ14: 'Après combien de pénalités pour jeu passif votre adversaire obtient-il un avantage ?',
        quizQ14Opt: ['1 pénalité', '2 pénalités', '3 pénalités', '4 pénalités'],
        quizQ15: 'Si vous réalisez une projection mais atterrissez en dessous, que se passe-t-il ?',
        quizQ15Opt: ['Aucun point', 'Le lanceur reçoit 2 points, le dessus reçoit un avantage', 'Le dessus reçoit 2 points', 'Les deux reçoivent des avantages']
    }
};

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('lang' + lang.charAt(0).toUpperCase() + lang.slice(1)).classList.add('active');
    
    // Update all translatable elements
    updateTranslations();
    
    // If quiz is active and a question is displayed, refresh it with new language
    const quizSection = document.getElementById('quiz');
    const quizContent = document.getElementById('quizContent');
    if (quizSection && quizSection.classList.contains('active') && 
        quizContent && quizContent.style.display !== 'none' && 
        currentQuestionIndex >= 0 && currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    }
}

function updateTranslations() {
    const t = translations[currentLanguage];
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            // Preserve HTML structure for elements with strong tags
            if (element.querySelector('strong') || element.innerHTML.includes('<')) {
                // For complex elements, just update text nodes
                const textNode = Array.from(element.childNodes).find(node => node.nodeType === 3);
                if (textNode) {
                    textNode.textContent = t[key];
                } else {
                    element.textContent = t[key];
                }
            } else {
                element.textContent = t[key];
            }
        }
    });
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons[0]) tabButtons[0].textContent = t.tabScoring;
    if (tabButtons[1]) tabButtons[1].textContent = t.tabAdvantages;
    if (tabButtons[2]) tabButtons[2].textContent = t.tabPenalties;
    if (tabButtons[3]) tabButtons[3].textContent = t.tabIllegal;
    if (tabButtons[4]) tabButtons[4].textContent = t.tabQuiz;
    
    // Update quiz title if visible
    const quizTitle = document.querySelector('.quiz-header h2');
    if (quizTitle) quizTitle.textContent = t.quizTitle;
}

// Tab Navigation and Quiz Logic for IBJJF Rules Guide
function switchTab(tabName, buttonEl) {
    // Remove active from all tabs and sections
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

    // Add active to clicked tab and corresponding section
    if (buttonEl) buttonEl.classList.add('active');
    document.getElementById(tabName).classList.add('active');

    // Initialize quiz if quiz tab is clicked
    if (tabName === 'quiz') {
        initQuiz();
    }
}

// Quiz Data
const quizQuestions = [
    {
        id: 1,
        questionEn: "How many points is a successful guard pass worth?",
        optionsEn: ["2 points", "3 points", "4 points", "1 advantage"],
        correct: 1
    },
    {
        id: 2,
        questionEn: "What happens if you mount your opponent but both of their arms are trapped under your body?",
        optionsEn: ["4 points", "2 points", "1 advantage only", "No points or advantage"],
        correct: 2
    },
    {
        id: 3,
        questionEn: "How long must you hold a scoring position to be awarded points?",
        optionsEn: ["1 second", "3 seconds", "5 seconds", "10 seconds"],
        correct: 1
    },
    {
        id: 4,
        questionEn: "Which position awards 4 points?",
        optionsEn: ["Guard pass", "Sweep", "Mount", "Takedown"],
        correct: 2
    },
    {
        id: 5,
        questionEn: "If you have back control but use a body triangle instead of hooks, what do you get?",
        optionsEn: ["4 points", "2 points", "1 advantage", "Nothing"],
        correct: 2
    },
    {
        id: 6,
        questionEn: "What is the result of slamming your opponent to escape a submission?",
        optionsEn: ["Technical foul", "Warning", "Immediate disqualification", "2 points to opponent"],
        correct: 2
    },
    {
        id: 7,
        questionEn: "How many penalties lead to disqualification?",
        optionsEn: ["2 penalties", "3 penalties", "4 penalties", "5 penalties"],
        correct: 2
    },
    {
        id: 8,
        questionEn: "If you sweep your opponent from guard, how many points do you get?",
        optionsEn: ["0 points", "2 points", "3 points", "4 points"],
        correct: 1
    },
    {
        id: 9,
        questionEn: "What happens if you flee the mat to avoid a sweep?",
        optionsEn: ["Warning", "1 advantage to opponent", "2 points to opponent", "Disqualification"],
        correct: 2
    },
    {
        id: 10,
        questionEn: "If both competitors pull guard simultaneously, who gets the advantage?",
        optionsEn: ["Neither", "Both", "The one who comes on top", "The referee decides"],
        correct: 2
    },
    {
        id: 11,
        questionEn: "Knee on belly is worth how many points?",
        optionsEn: ["1 point", "2 points", "3 points", "4 points"],
        correct: 1
    },
    {
        id: 12,
        questionEn: "What breaks a tie if points are equal?",
        optionsEn: ["Referee decision", "Advantages", "Weight", "Submission attempts"],
        correct: 1
    },
    {
        id: 13,
        questionEn: "At what belt level are heel hooks typically legal in IBJJF?",
        optionsEn: ["White belt", "Blue belt", "Purple belt", "Brown/Black belt"],
        correct: 3
    },
    {
        id: 14,
        questionEn: "After how many stalling penalties does your opponent get an advantage?",
        optionsEn: ["1 penalty", "2 penalties", "3 penalties", "4 penalties"],
        correct: 1
    },
    {
        id: 15,
        questionEn: "If you achieve a takedown but land on bottom, what happens?",
        optionsEn: ["No points", "Thrower gets 2 points, top gets advantage", "Top gets 2 points", "Both get advantages"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;

    // Shuffle questions
    shuffleArray(quizQuestions);

    // Show quiz content, hide results
    document.getElementById('quizContent').style.display = 'block';
    document.getElementById('resultsContent').style.display = 'none';

    displayQuestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const t = translations[currentLanguage];

    // Update score display
    document.getElementById('scoreDisplay').textContent = `${t.quizScore} ${score}/${currentQuestionIndex}`;

    // Get question text and options based on language
    let questionText, options;
    if (currentLanguage === 'fr') {
        questionText = t[`quizQ${question.id}`] || question.questionEn;
        options = t[`quizQ${question.id}Opt`] || question.optionsEn;
    } else {
        questionText = question.questionEn;
        options = question.optionsEn;
    }

    // Display question
    document.getElementById('questionText').textContent = `${t.quizQuestion} ${currentQuestionIndex + 1}/${quizQuestions.length}: ${questionText}`;

    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => selectOption(index);
        optionsContainer.appendChild(btn);
    });

    // Reset buttons
    const submitBtn = document.getElementById('submitBtn');
    const nextBtn = document.getElementById('nextBtn');
    submitBtn.style.display = 'inline-block';
    submitBtn.textContent = t.quizSubmit;
    submitBtn.disabled = false;
    nextBtn.style.display = 'none';
    nextBtn.textContent = t.quizNext;

    selectedOption = null;
}

function selectOption(index) {
    // Only allow selection if answer hasn't been submitted
    if (document.getElementById('submitBtn').style.display === 'none') return;

    selectedOption = index;

    // Remove selected class from all options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selected class to clicked option
    document.querySelectorAll('.option-btn')[index].classList.add('selected');
}

function checkAnswer() {
    const t = translations[currentLanguage];
    if (selectedOption === null) {
        alert(t.quizSelectAnswer);
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option-btn');

    // Disable all option buttons
    options.forEach((btn, index) => {
        btn.classList.add('disabled');
        btn.onclick = null;

        // Highlight correct answer
        if (index === question.correct) {
            btn.classList.add('correct');
        }

        // Highlight incorrect answer if selected
        if (index === selectedOption && index !== question.correct) {
            btn.classList.add('incorrect');
        }
    });

    // Update score if correct
    if (selectedOption === question.correct) {
        score++;
    }

    // Update buttons
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';

    // Update score display
    document.getElementById('scoreDisplay').textContent = `${t.quizScore} ${score}/${currentQuestionIndex + 1}`;
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const t = translations[currentLanguage];
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let emoji, message;

    if (percentage >= 90) {
        emoji = '🏆';
        message = t.quizResult1;
    } else if (percentage >= 75) {
        emoji = '🥈';
        message = t.quizResult2;
    } else if (percentage >= 60) {
        emoji = '🥉';
        message = t.quizResult3;
    } else {
        emoji = '📚';
        message = t.quizResult4;
    }

    document.getElementById('quizContent').style.display = 'none';
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.style.display = 'block';
    resultsContent.innerHTML = `
        <div class="results-container">
            <div class="results-emoji">${emoji}</div>
            <div class="results-score">${score}/${quizQuestions.length}</div>
            <div class="results-percentage">${percentage}%</div>
            <div class="results-message">${message}</div>
            <div class="quiz-actions">
                <button class="quiz-btn" onclick="initQuiz()">${t.quizTryAgain}</button>
                <button class="quiz-btn" onclick="backToRules()">${t.quizBackToRules}</button>
            </div>
        </div>
    `;
}

function backToRules() {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.getElementById('points').classList.add('active');
}


// Expose functions to window for onclick handlers
window.switchTab = switchTab;
window.switchLanguage = switchLanguage;
window.initQuiz = initQuiz;
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;
window.backToRules = backToRules;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Points section is already active by default
    // Set default language to English
    updateTranslations();
});
