const WHY = {
  s01: {
    pourquoi: "Hannibal commence par assurer ses arrières. En battant les tribus voisines, il rend son armée plus riche, plus expérimentée et plus fidèle, et il évite d'être attaqué par derrière quand il partira vers l'Italie. Se lancer tout de suite contre Rome aurait été trop risqué."
  },
  s02: {
    pourquoi: "Sagonte, alliée de Rome, était une menace au cœur de son territoire. La prendre lui apportait un immense butin pour financer l'armée, et montrait à ses alliés qu'il pouvait les protéger.",
    limite: "Ce choix déclencha la guerre. Les historiens débattent encore de la responsabilité de chacun, car Hannibal voulait sans doute ce conflit."
  },
  s03: {
    pourquoi: "Rome contrôlait la mer et l'attendait en Espagne. En marchant par la terre à travers les Pyrénées, la Gaule et les Alpes, Hannibal attaquait là où personne ne l'attendait et gardait l'initiative.",
    limite: "Le prix fut énorme : des milliers d'hommes perdus en route avant même le premier combat."
  },
  s04: {
    pourquoi: "Traverser de force aurait coûté des vies. En envoyant Hannon traverser en amont, Hannibal prit les Gaulois à revers avec peu de pertes. Il appliquait un principe qu'il utilisera souvent : frapper l'ennemi par un côté qu'il ne surveille pas."
  },
  s05: {
    pourquoi: "Attendre le printemps aurait donné à Rome le temps de se préparer. Hannibal préféra payer le prix fort pour garder l'effet de surprise : arriver en Italie quand Rome croyait encore la guerre lointaine.",
    limite: "Il perdit près de la moitié de ses hommes. Les historiens discutent encore de ce coût, très lourd."
  },
  s06: {
    pourquoi: "À la Trébie, Hannibal choisit le moment et le lieu. Il fit sortir les Romains de leur camp, à jeun et dans le froid, puis les frappa par derrière avec une troupe cachée. Cette victoire lui amena les Gaulois du Nord comme alliés."
  },
  s07: {
    pourquoi: "Passer par les marais, c'était prendre la route que les Romains croyaient impossible. Il sortit derrière eux et put choisir le terrain de la prochaine bataille.",
    limite: "C'était un pari : il y perdit des hommes et la vue d'un œil. S'il avait échoué, l'armée y serait restée."
  },
  s08: {
    pourquoi: "Hannibal connaissait l'impatience de Flaminius. Le lac et les collines formaient un piège naturel : sans pouvoir se déployer, l'infanterie romaine, très forte en bataille rangée, perdait son avantage. Il transforma le terrain en arme."
  },
  s09: {
    pourquoi: "Forcer le col ou attendre aurait coûté très cher. La ruse des bœufs fit partir les gardes sans combat. Hannibal préférait tromper l'ennemi plutôt que de l'affronter de front, car son armée, loin de ses bases, ne pouvait pas se permettre des pertes inutiles.",
    limite: "Ce récit vient de Polybe et de Tite-Live, des sources romaines : certains détails peuvent être embellis."
  },
  s10: {
    pourquoi: "Hannibal ne pouvait pas égaler le nombre romain, alors il utilisa sa cavalerie, supérieure. Un centre qui recule attire les Romains dans un piège, puis les ailes et la cavalerie les encerclent. Quand une armée est encerclée, sa supériorité numérique devient un handicap : les soldats se gênent."
  },
  s11: {
    pourquoi: "Hannibal estimait qu'il ne pouvait pas prendre Rome sans machines de siège ni vivres suffisants. Il visait plutôt à détacher les alliés de Rome pour l'affaiblir à long terme, et une paix négociée après une grande victoire pouvait convenir à Carthage.",
    limite: "Maharbal et beaucoup d'historiens pensent qu'il a raté une occasion unique. Rome refusa toute négociation."
  },
  s12: {
    pourquoi: "N'ayant pas réussi à briser le siège, Hannibal tenta de forcer Rome à rappeler ses armées en menaçant la ville elle-même. C'était un dernier moyen de sauver Capoue sans bataille et de rassurer ses alliés.",
    limite: "Ça n'a pas marché : Capoue est tombée. Ce choix est souvent vu comme une manœuvre désespérée."
  },
  s13: {
    pourquoi: "Carthage était en danger et ne pouvait pas survivre sans lui. Rester en Italie, c'était abandonner sa cité. Rentrer, c'était défendre sa patrie, même sur un terrain moins favorable.",
    limite: "Ce choix l'obligea à affronter Scipion à Zama, sans bonne cavalerie."
  },
  s14: {
    pourquoi: "Hannibal manquait de cavalerie. Il comptait sur les éléphants pour désorganiser les Romains, puis sur trois lignes d'infanterie pour les user progressivement et garder ses vétérans pour la fin. Le plan était raisonnable.",
    limite: "Hannibal fut battu : ici, son choix n'a pas été 'meilleur' au sens du résultat. La supériorité de la cavalerie de Scipion et de Massinissa décida de la bataille."
  },
  s15: {
    pourquoi: "Rester à Carthage aurait mis la cité en danger, puisque Rome exigeait sa remise. Fuir lui permettait de rester libre et de continuer à gêner Rome, tout en évitant que Carthage ne paie pour lui.",
    limite: "Il passa le reste de sa vie en exil, sans jamais revoir Carthage."
  }
};

const TAGS = {
  s01: ['audace', 'prudence', 'attentisme', 'diplomatie'],
  s02: ['force', 'attentisme', 'diplomatie', 'attentisme'],
  s03: ['prudence', 'force', 'attentisme', 'audace'],
  s04: ['force', 'ruse', 'prudence', 'diplomatie'],
  s05: ['attentisme', 'audace', 'prudence', 'prudence'],
  s06: ['attentisme', 'ruse', 'force', 'prudence'],
  s07: ['prudence', 'audace', 'attentisme', 'attentisme'],
  s08: ['audace', 'attentisme', 'force', 'ruse'],
  s09: ['force', 'ruse', 'diplomatie', 'attentisme'],
  s10: ['force', 'ruse', 'audace', 'prudence'],
  s11: ['audace', 'diplomatie', 'prudence', 'attentisme'],
  s12: ['prudence', 'audace', 'attentisme', 'force'],
  s13: ['attentisme', 'audace', 'diplomatie', 'prudence'],
  s14: ['force', 'prudence', 'attentisme', 'audace'],
  s15: ['diplomatie', 'ruse', 'attentisme', 'force']
};

const PROFILS = {
  audace: {
    nom: 'Le Fonceur',
    texte: "Tu choisis souvent l'initiative et le risque calculé. Comme Hannibal à travers les Alpes, tu préfères frapper là où l'ennemi ne t'attend pas, quitte à payer un prix élevé. Ton danger : un pari manqué peut coûter toute l'armée."
  },
  ruse: {
    nom: 'Le Tacticien',
    texte: "Tu cherches à gagner en trompant l'adversaire plutôt qu'en le heurtant de front : embuscades, pièges, terrain. C'est la marque d'Hannibal à la Trébie, à Trasimène et à Cannes. Ton danger : ces plans demandent des troupes disciplinées et un ennemi qui tombe dans le piège."
  },
  force: {
    nom: 'Le Bélier',
    texte: "Tu fais confiance à la puissance et à l'affrontement direct. C'est efficace quand on a l'avantage du nombre, mais Hannibal, presque toujours moins nombreux, l'évitait. Ton danger : face à plus fort, la force seule s'épuise."
  },
  diplomatie: {
    nom: 'Le Diplomate',
    texte: "Tu cherches les alliances et les accords. Cela a compté pour Hannibal, dont la guerre reposait sur le ralliement des alliés de Rome. Ton danger : face à un adversaire décidé à ne pas négocier, comme Rome, la diplomatie seule ne suffit pas."
  },
  prudence: {
    nom: 'Le Bâtisseur',
    texte: "Tu prépares avant d'agir et tu ménages tes forces, comme Hannibal assurant ses arrières en Espagne. Ton danger : à trop préparer, on laisse l'initiative à l'adversaire."
  },
  attentisme: {
    nom: 'Le Temporisateur',
    texte: "Tu préfères attendre et user l'adversaire. C'est la stratégie de Fabius Maximus, le général romain qui a le plus gêné Hannibal en évitant le combat. Ton danger : le temps ne joue pas toujours pour toi, surtout quand tes alliés doutent."
  }
};

if (typeof window !== 'undefined') {
  window.WHY = WHY;
  window.TAGS = TAGS;
  window.PROFILS = PROFILS;
}
