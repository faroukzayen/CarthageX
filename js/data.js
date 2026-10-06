const GAME_DATA = {
  prologue: [
    {
      id: 'p1',
      title: 'P1 · Deux puissances.',
      text: 'Au troisième siècle avant notre ère, deux puissances se disputent la Méditerranée. Carthage, cité fondée par les Phéniciens sur la côte de l\'actuelle Tunisie, domine le commerce et la mer. Rome, république de paysans-soldats, étend peu à peu son pouvoir sur l\'Italie.'
    },
    {
      id: 'p2',
      title: 'P2 · La première guerre punique.',
      text: 'De 264 à 241 avant notre ère, les deux cités s\'affrontent pendant vingt-trois ans, surtout autour de la Sicile. Rome construit une flotte et finit par l\'emporter. Carthage perd la Sicile et doit payer une lourde somme. Elle en sort humiliée.'
    },
    {
      id: 'p3',
      title: 'P3 · Le serment.',
      text: 'En 247, naît à Carthage un garçon nommé Hannibal, fils du général Hamilcar Barca. En 237, son père part reconstruire la puissance de Carthage en Espagne et l\'emmène. Selon l\'historien Polybe, qui rapporte les propres paroles d\'Hannibal, l\'enfant, alors âgé d\'environ neuf ans, jure à son père de ne jamais être l\'ami de Rome.'
    }
  ],
  scenarios: [
    {
      id: 's01',
      year: '221 av. J.-C.',
      title: 'L\'armée t\'acclame',
      avant: 'Depuis ton enfance, ton père Hamilcar puis ton beau-frère Hasdrubal ont reconstruit en Espagne la puissance de Carthage.',
      contexte: 'Hasdrubal vient d\'être assassiné. À 26 ans, tu es acclamé chef de l\'armée de Carthage en Espagne : des dizaines de milliers d\'hommes, des mines d\'argent et plusieurs villes. Un traité avec Rome fixe le fleuve Èbre comme limite à ne pas dépasser. Tu as tout à prouver.',
      objectif: 'Affermir ton pouvoir et préparer l\'avenir.',
      options: [
        { texte: 'Lancer aussitôt la guerre contre Rome', resultat: 'Ton armée n\'est pas prête, tes arrières en Espagne sont instables et Carthage n\'a pas décidé la guerre. Tu risques d\'être lâché par ton propre camp.', hannibal: false },
        { texte: 'Consolider l\'Espagne en soumettant les tribus voisines', resultat: 'Tu bats les Olcades, les Vaccéens, puis une grande coalition de tribus près du fleuve Tage. Ton armée gagne en expérience et en richesse, et le sénat de Carthage confirme ton commandement.', hannibal: true },
        { texte: 'Attendre les ordres du sénat de Carthage', resultat: 'Le sénat tarde et ton armée s\'ennuie. Tu perds du temps pendant que Rome renforce ses alliés.', hannibal: false },
        { texte: 'Signer une paix durable avec Rome', resultat: 'Carthage reste sous la tutelle de Rome. Tes soldats, qui attendent une revanche, doutent de leur chef.', hannibal: false }
      ],
      dH: [0, 15, 10, 5],
      dX: [-5, -15, -5, -5]
    },
    {
      id: 's02',
      year: '219 av. J.-C.',
      title: 'Sagonte',
      avant: 'Ton armée est solide, riche et fidèle. Tu peux regarder vers le nord, vers la frontière fixée avec Rome.',
      contexte: 'Sagonte est une riche cité espagnole, au sud de l\'Èbre, donc dans ta zone. Mais elle a signé une alliance avec Rome et elle harcèle des tribus alliées de Carthage. Si tu l\'attaques, Rome peut y voir une provocation. Si tu l\'ignores, tu laisses un allié de Rome au cœur de ton territoire.',
      objectif: 'Protéger tes alliés sans perdre l\'initiative.',
      options: [
        { texte: 'Assiéger la ville', resultat: 'Après environ huit mois, Sagonte tombe. Tu prends un immense butin. Rome, qui n\'a pas secouru la ville, envoie des ambassadeurs à Carthage pour exiger que tu leur sois livré.', hannibal: true },
        { texte: 'Ignorer Sagonte', resultat: 'Sagonte continue d\'agiter les tribus alliées, et tes soldats te trouvent faible. Rome s\'en sert comme base d\'influence.', hannibal: false },
        { texte: 'Négocier avec Rome', resultat: 'Rome exige que tu cesses toute action. Tu perds ta liberté de manœuvre sans rien obtenir.', hannibal: false },
        { texte: 'Reculer devant Rome', resultat: 'Tes alliés espagnols doutent de toi et ta réputation s\'effondre.', hannibal: false }
      ],
      dH: [-5, 10, 10, 0],
      dX: [0, -15, 0, -15]
    },
    {
      id: 's03',
      year: '218 av. J.-C.',
      title: 'Rome déclare la guerre',
      avant: 'Sagonte est tombée. Rome n\'a pas répondu par les armes, mais ses ambassadeurs exigent que Carthage te livre.',
      contexte: 'Le sénat de Carthage refuse de te livrer. Selon l\'historien romain Tite-Live, un ambassadeur de Rome fait alors le geste de laisser choisir entre la paix et la guerre, et Carthage choisit la guerre. Tu es à Carthagène, avec une grande armée et des éléphants. Rome contrôle la mer et compte te combattre en Espagne et en Afrique.',
      objectif: 'Frapper Rome là où elle ne t\'attend pas.',
      options: [
        { texte: 'Défendre l\'Espagne et attendre l\'attaque', resultat: 'Rome choisit son terrain et mène la guerre loin d\'elle : l\'affrontement s\'enlise en Espagne.', hannibal: false },
        { texte: 'Embarquer l\'armée vers l\'Italie', resultat: 'La flotte romaine domine la mer : tes navires, peu nombreux, sont coulés ou bloqués.', hannibal: false },
        { texte: 'Attendre des renforts de Carthage', resultat: 'Le sénat de Carthage, divisé, tarde. Les Romains débarquent en Espagne et tu perds l\'initiative.', hannibal: false },
        { texte: 'Marcher par la terre : Pyrénées, Gaule, Alpes', resultat: 'Tu pars par la terre avec tes éléphants. Rome, qui t\'attendait en Espagne ou en mer, est prise au dépourvu.', hannibal: true }
      ],
      dH: [0, 10, -10, 5],
      dX: [-10, -15, 0, -10]
    },
    {
      id: 's04',
      year: 'Septembre 218',
      title: 'Le Rhône',
      avant: 'Tu as laissé des troupes en Espagne et traversé les Pyrénées avec plusieurs dizaines de milliers d\'hommes et des éléphants.',
      contexte: 'Tu arrives au Rhône, large et rapide. Sur l\'autre rive, des Gaulois armés veulent t\'empêcher de passer. À quelques jours de marche, une armée romaine dirigée par Scipion approche. Tes éléphants ont peur de l\'eau.',
      objectif: 'Traverser le fleuve avant l\'arrivée des Romains.',
      options: [
        { texte: 'Traverser de force', resultat: 'Sous les javelots des Gaulois, ta traversée tourne au désordre : tu perds beaucoup d\'hommes et de temps.', hannibal: false },
        { texte: 'Envoyer un détachement traverser plus haut', resultat: 'Ton lieutenant Hannon traverse en amont sur des radeaux et attaque les Gaulois par derrière, au signal de fumée. Tu passes alors l\'armée, puis les éléphants sur des radeaux couverts de terre. Quand les Romains arrivent, tu es de l\'autre côté : tu choisis de continuer vers les Alpes plutôt que de les combattre.', hannibal: true },
        { texte: 'Remonter le fleuve très loin', resultat: 'Ta colonne s\'épuise sur un long détour et les Romains te rattrapent.', hannibal: false },
        { texte: 'Payer les Gaulois', resultat: 'Les Gaulois prennent l\'argent mais ne te laissent pas passer, et tu perds ton temps.', hannibal: false }
      ],
      dH: [-5, 5, 0, 0],
      dX: [-15, -10, -10, -5]
    },
    {
      id: 's05',
      year: 'Octobre 218',
      title: 'Les Alpes',
      avant: 'Tu as franchi le Rhône et laissé les Romains derrière toi. Devant toi, les montagnes.',
      contexte: 'Tu atteins les Alpes, la plus haute chaîne d\'Europe. Personne n\'a franchi ces montagnes avec une armée et des éléphants. Nous sommes en octobre : la neige arrive, des tribus gauloises t\'attaquent depuis les hauteurs et tes hommes sont épuisés. De l\'autre côté, c\'est l\'Italie, et Rome ne t\'attend pas par là.',
      objectif: 'Atteindre l\'Italie avec une armée capable de combattre.',
      options: [
        { texte: 'Hiverner en Gaule et passer au printemps', resultat: 'Rome a tout l\'hiver pour lever des armées et verrouiller les passages : tu perds la surprise.', hannibal: false },
        { texte: 'Franchir les Alpes sans attendre', resultat: 'Après environ quinze jours dans la neige, tu atteins la plaine du Pô. Selon Polybe, il te reste environ 20 000 fantassins et 6 000 cavaliers. Tu as perdu près de la moitié de ton armée, mais Rome est stupéfaite.', hannibal: true },
        { texte: 'Longer la côte vers la Ligurie', resultat: 'Les légions romaines et Marseille, alliée de Rome, t\'attendent sur un chemin plus long et mieux gardé.', hannibal: false },
        { texte: 'Renvoyer les éléphants et alléger l\'armée', resultat: 'Sans éléphants ni nombre, tu perds ton effet de choc et les tribus gauloises doutent de ta force.', hannibal: false }
      ],
      dH: [-45, 0, -25, 10],
      dX: [-10, -15, -10, -10],
      note: 'Le col exact est encore débattu par les historiens.'
    },
    {
      id: 's06',
      year: 'Décembre 218',
      title: 'La Trébie',
      avant: 'Tu es en Italie, affaibli mais là. Rome rassemble ses armées pour te chasser.',
      contexte: 'Tu es dans la plaine du Pô, en plein hiver. Le consul Sempronius, impatient de gagner avant la fin de son mandat, campe de l\'autre côté d\'une rivière, la Trébie. Tes hommes sont fatigués, mais tu as une cavalerie numide très mobile et ton frère Magon, bon chef.',
      objectif: 'Gagner ta première bataille en Italie pour convaincre les Gaulois du Nord de s\'allier à toi.',
      options: [
        { texte: 'Attendre dans ton camp', resultat: 'Les Romains se renforcent et tes alliés gaulois, impatients, doutent de toi.', hannibal: false },
        { texte: 'Attirer les Romains hors de leur camp, puis les prendre en embuscade', resultat: 'Ta cavalerie numide provoque les Romains, qui traversent la rivière glacée sans avoir mangé. Magon, caché avec 2 000 hommes dans un ravin, les attaque par l\'arrière. Une grande partie de l\'armée romaine est détruite et les Gaulois du Nord rejoignent ton camp.', hannibal: true },
        { texte: 'Attaquer leur camp', resultat: 'Tes troupes fatiguées s\'épuisent contre des palissades solidement défendues.', hannibal: false },
        { texte: 'Éviter le combat', resultat: 'Sans victoire, les Gaulois du Nord ne te rejoignent pas et ton armée s\'affaiblit encore.', hannibal: false }
      ],
      dH: [-5, 20, 5, 25],
      dX: [-20, -15, -10, -15]
    },
    {
      id: 's07',
      year: 'Printemps 217',
      title: 'Les marais de l\'Arno',
      avant: 'Après la Trébie, tu as passé l\'hiver dans le Nord avec tes alliés gaulois.',
      contexte: 'Deux armées romaines t\'attendent sur les routes habituelles pour descendre vers le sud. Un chemin plus court passe par les marais de l\'Arno, inondés par la fonte des neiges, que les Romains croient impraticables. Le trajet durera plusieurs jours, sans pouvoir dormir sur la terre ferme.',
      objectif: 'Contourner les armées romaines pour arriver en Italie centrale.',
      options: [
        { texte: 'Contourner par les Apennins', resultat: 'Les passes sont gardées et les Romains profitent du terrain : tu perds des jours et des hommes.', hannibal: false },
        { texte: 'Traverser les marais', resultat: 'Tu traverses les marais en quatre jours et trois nuits, en perdant des hommes et des animaux. Atteint d\'une maladie des yeux, tu perds la vue d\'un œil. Mais tu sors derrière l\'armée romaine.', hannibal: true },
        { texte: 'Attendre dans la plaine du Pô', resultat: 'Les Romains se renforcent et ta réputation de chef audacieux s\'efface.', hannibal: false },
        { texte: 'Retourner en Gaule', resultat: 'Tu abandonnes l\'Italie et tes alliés gaulois se sentent trahis.', hannibal: false }
      ],
      dH: [-15, -5, -10, 5],
      dX: [-10, -10, -10, -10]
    },
    {
      id: 's08',
      year: '217 av. J.-C.',
      title: 'Le lac Trasimène',
      avant: 'Les marais traversés, tu te retrouves derrière l\'armée du consul Flaminius.',
      contexte: 'Flaminius, connu pour être impatient et téméraire, te poursuit avec une armée de plus de 25 000 hommes. Tu longes le lac Trasimène : la route passe dans une étroite bande de terrain entre le lac et des collines.',
      objectif: 'Détruire cette armée avant qu\'elle ne rejoigne l\'autre armée romaine.',
      options: [
        { texte: 'Marcher droit sur Rome en l\'ignorant', resultat: 'Sans machines de siège ni alliés, tu t\'épuises devant des murs défendus, avec Flaminius dans ton dos.', hannibal: false },
        { texte: 'Camper en plaine et attendre la bataille', resultat: 'Dans une bataille ordinaire, l\'infanterie lourde romaine a l\'avantage, et tu paies cher la victoire.', hannibal: false },
        { texte: 'Assiéger une ville proche', resultat: 'Le siège te cloue sur place et laisse aux armées romaines le temps de se rassembler.', hannibal: false },
        { texte: 'Cacher tes troupes dans les collines et attaquer dans la brume', resultat: 'Les Romains avancent en colonne dans la brume, enfermés entre collines et lac, sans pouvoir se déployer. Flaminius meurt et son armée est anéantie en quelques heures.', hannibal: true }
      ],
      dH: [-3, 15, 5, 10],
      dX: [-20, -10, -15, 0]
    },
    {
      id: 's09',
      year: 'Été 217',
      title: 'Le piège de la vallée',
      avant: 'Rome a changé de méthode. Elle nomme un dictateur, Fabius Maximus, qui refuse le combat et te suit à distance.',
      contexte: 'Tu as pillé le sud de l\'Italie, mais tu as peu d\'alliés et peu de vivres. Tu entres dans une plaine entourée de montagnes. Fabius bloque la seule sortie, un col étroit, et ses armées tiennent les collines. Tu es presque encerclé.',
      objectif: 'Sortir du piège sans combattre dans de mauvaises conditions.',
      options: [
        { texte: 'Forcer le passage', resultat: 'Les Romains tiennent les hauteurs : tu perds beaucoup d\'hommes pour rien.', hannibal: false },
        { texte: 'Lancer des bœufs aux cornes enflammées dans les collines', resultat: 'À la nuit, environ 2 000 bœufs portant des fagots enflammés sont lancés vers les hauteurs. Les Romains qui gardent le col croient à une attaque et abandonnent leur poste. Ton armée passe avec son butin.', hannibal: true },
        { texte: 'Négocier une trêve', resultat: 'Fabius n\'a aucune raison d\'accepter : il te laisse t\'épuiser dans la vallée.', hannibal: false },
        { texte: 'Attendre en espérant', resultat: 'Les vivres s\'épuisent et le moral s\'effondre.', hannibal: false }
      ],
      dH: [0, 10, 5, 0],
      dX: [-20, -20, -20, -5],
      note: 'Ce récit vient de Polybe et de Tite-Live, des sources romaines.'
    },
    {
      id: 's10',
      year: '216 av. J.-C.',
      title: 'Cannes',
      avant: 'Fabius a épuisé la patience des Romains. Le Sénat l\'a remplacé par une immense armée chargée d\'en finir.',
      contexte: 'Rome a levé la plus grande armée de son histoire : environ 80 000 hommes contre tes 50 000. Tu as la meilleure cavalerie, mais l\'infanterie romaine est plus nombreuse et plus solide. La plaine de Cannes est plate, sans obstacle : elle convient à ta cavalerie.',
      objectif: 'Vaincre une armée presque deux fois plus nombreuse.',
      options: [
        { texte: 'Aligner une ligne solide et tenir sur place', resultat: 'Une ligne rigide, moins nombreuse, finit par céder sous la masse romaine.', hannibal: false },
        { texte: 'Avancer ton centre faible, garder tes meilleures troupes sur les côtés et ta cavalerie pour encercler', resultat: 'Ton centre recule lentement : les légions s\'y enfoncent. Tes troupes de côté se rabattent, ta cavalerie fait le tour et les prend à revers. Encerclés, des dizaines de milliers de Romains périssent en un jour. Cannes est encore étudiée dans les écoles militaires.', hannibal: true },
        { texte: 'Attaquer de nuit', resultat: 'La nuit annule ta supériorité de cavalerie et la confusion profite au plus nombreux.', hannibal: false },
        { texte: 'Éviter la bataille et te retirer dans les collines', resultat: 'Loin de tes vivres, ton armée s\'affaiblit, et tu n\'obtiens jamais la victoire qui ferait basculer les alliés de Rome.', hannibal: false }
      ],
      dH: [-10, 25, 15, 25],
      dX: [-45, -30, -20, -20]
    },
    {
      id: 's11',
      year: '216 av. J.-C.',
      title: 'Après Cannes',
      avant: 'Cannes est une catastrophe pour Rome : elle n\'a presque plus d\'armée disponible.',
      contexte: 'Maharbal, ton chef de cavalerie, te presse de marcher sur Rome, à quelques jours : « Dans cinq jours, tu dînes au Capitole ! » Mais tes soldats sont fatigués, tu n\'as ni machines de siège ni assez de vivres, et Rome est entourée de hautes murailles. Autour, des peuples d\'Italie soumis à Rome hésitent à passer de ton côté.',
      objectif: 'Transformer cette victoire en victoire définitive.',
      options: [
        { texte: 'Marcher aussitôt sur Rome', resultat: 'Ton armée épuisée arrive devant des murs intacts et une ville mobilisée : un échec te coûterait tout.', hannibal: false },
        { texte: 'Proposer la paix et rallier les alliés de Rome dans le Sud', resultat: 'Rome refuse de négocier. Capoue, deuxième ville d\'Italie, et plusieurs peuples du Sud passent dans ton camp, mais Rome tient bon. Maharbal t\'aurait reproché de savoir vaincre sans savoir profiter de ta victoire.', hannibal: true },
        { texte: 'Retourner en Espagne te reconstituer', resultat: 'Tu abandonnes le terrain gagné, et les alliés hésitants restent fidèles à Rome.', hannibal: false },
        { texte: 'Attendre des renforts', resultat: 'Les Romains bloquent les renforts en Espagne, et le temps joue pour Rome.', hannibal: false }
      ],
      dH: [0, 0, 10, 25],
      dX: [-25, -15, -25, -10],
      note: 'Les historiens débattent : sans machines de siège, Rome était-elle vraiment prenable ?'
    },
    {
      id: 's12',
      year: '211 av. J.-C.',
      title: 'Capoue assiégée',
      avant: 'Rome ne s\'est pas rendue. Elle se reconstitue, et tu comptes plusieurs alliés dans le Sud, dont Capoue.',
      contexte: 'Rome assiège Capoue avec plusieurs armées. Si Capoue tombe, tes alliés italiens verront que tu ne peux pas les protéger. Tu as essayé de briser le siège, sans succès. Il te reste un coup à tenter : menacer Rome elle-même.',
      objectif: 'Sauver Capoue et rassurer tes alliés.',
      options: [
        { texte: 'Abandonner Capoue', resultat: 'Tes alliés italiens comprennent qu\'ils ne peuvent plus compter sur toi.', hannibal: false },
        { texte: 'Marcher sur Rome pour forcer les Romains à lever le siège', resultat: 'Tu campes à quelques kilomètres des murs de Rome. La ville panique, mais ne lève pas le siège de Capoue. Tu repars, et Capoue tombe.', hannibal: true },
        { texte: 'Appeler de l\'aide', resultat: 'L\'aide arrive trop tard : les renforts sont arrêtés avant de te rejoindre.', hannibal: false },
        { texte: 'Attaquer les lignes romaines autour de Capoue', resultat: 'Les tranchées romaines sont solides : tu perds des hommes sans briser le siège.', hannibal: false }
      ],
      dH: [-5, -10, -10, -20],
      dX: [-10, -15, -10, -25],
      note: 'Selon Tite-Live, Rome vendit à cette époque le terrain où tu campais, au prix normal, pour montrer sa confiance.'
    },
    {
      id: 's13',
      year: '203 av. J.-C.',
      title: 'Le rappel de Carthage',
      avant: 'Les années ont passé. Rome a tenu bon : Capoue est tombée, ton frère Hasdrubal a été battu, et un jeune général romain, Scipion, a conquis l\'Espagne.',
      contexte: 'Cela fait plus de quinze ans que tu combats en Italie sans pouvoir battre Rome. Scipion a débarqué en Afrique et menace Carthage elle-même. Le sénat te rappelle. Si tu pars, tu abandonnes l\'Italie, mais ta cité est en danger.',
      objectif: 'Sauver Carthage.',
      options: [
        { texte: 'Rester en Italie', resultat: 'Carthage tombe sans toi et tu restes isolé en Italie.', hannibal: false },
        { texte: 'Marcher sur Rome avec ce qui reste de l\'armée', resultat: 'Usée et affaiblie, ton armée échoue et Carthage reste sans défense.', hannibal: false },
        { texte: 'Aller chercher l\'aide de Philippe V de Macédoine', resultat: 'Philippe est occupé ailleurs : son aide arrive trop tard.', hannibal: false },
        { texte: 'Rentrer en Afrique défendre Carthage', resultat: 'Tu débarques à Hadrumète, l\'actuelle Sousse, après plus de quinze ans passés en Italie.', hannibal: true }
      ],
      dH: [-10, -20, -10, -20],
      dX: [-30, -30, -20, -30],
      note: 'Sousse fut ton dernier point d\'appui avant la bataille de Zama.'
    },
    {
      id: 's14',
      year: '202 av. J.-C.',
      title: 'Zama',
      avant: 'Tu es rentré à Carthage avec des vétérans fatigués et des recrues. Une trêve avec Rome a été rompue.',
      contexte: 'À Zama, en Afrique du Nord, tu affrontes Scipion, qui a pour allié le chef numide Massinissa et ses cavaliers. Tu manques de cavalerie, mais tu disposes d\'environ 80 éléphants. Tu sais que la paix de Carthage dépend de cette bataille.',
      objectif: 'Gagner cette ultime bataille pour sauver Carthage.',
      options: [
        { texte: 'Éléphants devant, puis trois lignes d\'infanterie', resultat: 'Tu places tes éléphants devant, puis trois lignes d\'infanterie. Scipion ouvre des couloirs dans son armée pour laisser passer les éléphants, que ses troupes effraient. Ta cavalerie fuit, la cavalerie de Massinissa revient et t\'attaque par derrière. Tu es vaincu, et Carthage doit accepter une paix très dure.', hannibal: true },
        { texte: 'Éléphants en réserve', resultat: 'Sans l\'effet de choc des éléphants, ta ligne tient peut-être plus longtemps, mais Scipion garde l\'avantage de la cavalerie. Les historiens pensent que la défaite restait probable.', hannibal: false },
        { texte: 'Éviter la bataille', resultat: 'Retranché sur une colline, tu laisses Scipion ravager la campagne : Carthage finit par négocier sans toi, à de mauvaises conditions.', hannibal: false },
        { texte: 'Cavalerie d\'abord', resultat: 'Ta petite cavalerie, plus faible que celle de Scipion, est vite écrasée, et ton infanterie se retrouve exposée.', hannibal: false }
      ],
      dH: [-40, -20, -10, -30],
      dX: [-40, -20, -10, -30],
      note: 'Hannibal a perdu : ce choix n\'était pas absurde, c\'est le manque de cavalerie qui a pesé.'
    },
    {
      id: 's15',
      year: '195 av. J.-C.',
      title: 'L\'exil',
      avant: 'Après Zama, tu as gouverné Carthage et réformé ses finances. Ces réformes te font des ennemis, qui te dénoncent à Rome.',
      contexte: 'Rome exige que Carthage te livre. Tu as environ 52 ans. Ta ville te protège mal. À l\'est, le roi Antiochos III cherche à combattre Rome et pourrait t\'accueillir.',
      objectif: 'Rester libre et continuer à résister à Rome.',
      options: [
        { texte: 'Rester et te défendre', resultat: 'Carthage, trop faible, finit par céder à Rome et te livrer.', hannibal: false },
        { texte: 'Fuir vers l\'Orient', resultat: 'Tu quittes Carthage de nuit et gagnes la Syrie auprès d\'Antiochos III. Tu ne reverras jamais ta ville.', hannibal: true },
        { texte: 'Te rendre à Rome', resultat: 'Tu marcherais dans Rome en prisonnier, exposé à l\'humiliation.', hannibal: false },
        { texte: 'Lever une armée contre le pouvoir de Carthage', resultat: 'Une guerre civile affaiblirait encore la cité que tu veux protéger.', hannibal: false }
      ],
      dH: [-10, -10, -10, -30],
      dX: [-30, -30, -20, -30]
    }
  ],
  epilogue: 'Antiochos est battu par Rome, et Hannibal doit fuir de nouveau. Il trouve refuge chez le roi Prusias de Bithynie, en Asie Mineure. Quand Rome exige qu\'on le lui livre, vers 183 avant notre ère, il choisit de s\'empoisonner plutôt que d\'être pris. Selon Tite-Live, il aurait dit qu\'il était temps de libérer Rome de son angoisse. Hannibal laisse l\'image d\'un génie tactique : il a gagné presque toutes ses batailles, mais perdu la guerre. Presque tout ce que nous savons de lui vient de ses ennemis.'
};

if (typeof window !== 'undefined') {
  window.GAME_DATA = GAME_DATA;
}
