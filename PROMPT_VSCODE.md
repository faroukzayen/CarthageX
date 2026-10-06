# PROMPT POUR L'IA DE VS CODE : jeu « Dans la peau d'Hannibal »

> Copiez ce fichier à la racine de votre dossier de projet, puis dites à l'IA : **« Lis PROMPT_VSCODE.md en entier et réalise le projet en suivant les étapes. »**

---

## 1. RÔLE ET OBJECTIF

Tu es un développeur front-end senior. Construis un **jeu narratif interactif en français** sur Hannibal Barca, pour le concours « L'IA au service d'Hannibal » (Festival des Francophonies de Sousse). Le joueur incarne Hannibal : à chaque étape, il choisit parmi **4 options**. Chaque option a **une image**, un **texte** et une **narration vocale**. Le joueur découvre la vie d'Hannibal et teste sa stratégie.

**Contraintes techniques :** HTML, CSS et JavaScript « vanilla », **sans framework ni build**, qui s'ouvre avec Live Server de VS Code et peut être hébergé sur un site statique. Responsive (téléphone d'abord), accessible, utilisable au clavier.

## 2. STRUCTURE DU PROJET À CRÉER

```
/index.html
/css/style.css
/js/data.js          ← tout le contenu (section 8), séparé de la logique
/js/app.js           ← logique du jeu
/js/audio.js         ← narration, volume, effets
/js/manifest.js      ← généré (images + audio trouvés)
/scripts/generate-manifest.js   ← script Node qui scanne les dossiers
/assets/images/...   ← MES images (ne pas les déplacer ni les renommer)
/assets/audio/...    ← optionnel (narration enregistrée)
```

## 3. IMAGES : PROCÉDURE OBLIGATOIRE

Mes images sont rangées dans des **dossiers portant le nom de chaque événement**. Avant d'écrire du code :
1. **Affiche l'arborescence réelle** de mon dossier d'images.
2. Associe chaque dossier à un scénario avec ce tableau de mots-clés (insensible à la casse et aux accents, `-`, `_` et espaces ignorés) :

| id | mots-clés du dossier |
|---|---|
| prologue | prologue, intro, carthage, serment |
| s01 | 221, armee, acclam |
| s02 | sagonte |
| s03 | guerre, declar |
| s04 | rhone |
| s05 | alpes |
| s06 | trebie |
| s07 | arno, marais |
| s08 | trasimene |
| s09 | vallee, boeuf, torche |
| s10 | cannes (sans « apres ») |
| s11 | apres, maharbal, rome |
| s12 | capoue |
| s13 | rappel |
| s14 | zama |
| s15 | exil |
| epilogue | epilogue, fin |

3. Dans chaque dossier de scénario, il doit y avoir **4 images = les 4 options dans l'ordre de la liste de la section 8** (option 1 à 4). Déduis l'ordre par un chiffre ou une lettre dans le nom du fichier (1, 2, 3, 4 ou a, b, c, d), sinon par ordre alphabétique. Dans le dossier du prologue : une ou deux images par séquence (P1, P2, P3).
4. **Écris un rapport** des correspondances et des problèmes (dossier non reconnu, nombre d'images différent de 4) et **demande-moi confirmation** avant de continuer s'il y a un doute. N'invente jamais une image.
5. Crée `scripts/generate-manifest.js` (Node, sans dépendance) qui scanne les dossiers et génère `js/manifest.js` (images + fichiers audio éventuels). Les navigateurs ne peuvent pas lister un dossier. Si Node n'est pas disponible, écris le manifest à la main. Ajoute une image de remplacement (dégradé + titre) si une image manque, sans faire planter le jeu.

## 4. DÉROULEMENT DU JEU

**Écran d'accueil** : titre, courte explication, bouton « Commencer » (nécessaire pour autoriser le son), réglages (narration oui/non, sous-titres, vitesse, volume).

**Prologue (3 séquences, sans choix)** : images en diaporama avec la narration P1, P2, P3 (section 8).

**Pour chacun des 15 scénarios :**
1. **Briefing** : titre, année, frise chronologique. Affiche le bloc « Auparavant… », le contexte et l'objectif. Narre-les. Fond : l'image de l'option 1 du scénario précédent, floutée en arrière-plan, ou une carte simple. Pas d'image d'option ici (cela dévoilerait le résultat).
2. **Choix** : 4 cartes texte (touches 1 à 4 au clavier), dans un **ordre aléatoire** à chaque partie, sans image et sans indice.
3. **Résultat** de l'option choisie : affiche **l'image de cette option** en plein écran avec un lent zoom (effet Ken Burns), et narre son texte.
   - Si c'est l'option d'Hannibal (`hannibal: true`) : badge **« Fidèle à l'histoire »** (vert) et son résultat.
   - Sinon : badge **« Autre voie (hypothèse) »** (rouge), le texte de conséquence, puis, **à la suite**, l'image et le texte de **« Ce qu'Hannibal a vraiment fait »** (image de l'option `hannibal: true`). Une note « Les historiens débattent » s'affiche si le champ `note` existe.
4. **Jauges** : Hommes, Moral, Vivres, Alliés (0 à 100, départ 100/70/70/30). Après le choix, montre les jauges de l'option choisie (en rouge si ce n'est pas Hannibal). Au scénario suivant, applique **toujours les variations d'Hannibal** (`dH`), pour suivre l'histoire réelle. Borne les valeurs entre 0 et 100.
5. Bouton « Suite » (visible dès la fin de la narration, ou immédiatement via « Passer »).

**Fin** : épilogue narré, puis bilan : score de fidélité sur 15, titre selon le score (13 à 15 : « Hannibal lui-même » ; 9 à 12 : « Stratège accompli » ; 5 à 8 : « Officier prometteur » ; 0 à 4 : « Recrue à former »), jauges finales, rappel que « fidèle ne veut pas dire infaillible : Hannibal a gagné presque toutes ses batailles mais perdu la guerre », mention **« Images et voix générées par IA : reconstitutions, pas des documents historiques »**, bouton « Rejouer ».

## 5. SON ET NARRATION

- **Narrateur parlé** (pas seulement du texte à lire). Par défaut : `speechSynthesis` du navigateur, voix `fr-FR` (choisis la meilleure voix française disponible, pitch et rate réglables).
- **Si un fichier audio existe** (`assets/audio/<id-scénario>/<partie>.mp3`, où la partie est `briefing`, `option-1` à `option-4`), il est prioritaire sur la synthèse vocale. Le manifest les référence.
- La narration démarre après une action de l'utilisateur (règles d'autoplay), s'interrompt proprement au clic sur « Passer », et ne se chevauche jamais. Annule toute voix en cours avant d'en lancer une autre.
- **Sous-titres** : le texte narré s'affiche en bas, activable/désactivable (activé par défaut).
- **Ambiance** : une boucle musicale optionnelle si `assets/audio/ambiance.mp3` existe, avec volume séparé, atténuée pendant la narration. **Effets sonores générés avec Web Audio** (sans fichier) : un court son positif pour « Fidèle », un son grave pour « Autre voie ».
- Contrôles toujours visibles : muet (touche M), volume, pause/reprise, vitesse.

## 6. DESIGN

Style cinématographique, sombre, sobre : fond sombre, accents rouge sang et or, typographie serif pour les titres. **Frise chronologique** en haut (247 → 183 av. J.-C.) avec la position actuelle. Images en pleine largeur, ratio 16:9, légères transitions fondues. Respecte `prefers-reduced-motion` (supprime les zooms) et `prefers-color-scheme`. Cibles tactiles d'au moins 44 px, contraste suffisant, `lang="fr"`, `aria-live` pour les résultats, focus visible.

## 7. RÈGLES DE QUALITÉ

- **Ne modifie pas les textes historiques** de la section 8 (tu peux corriger l'orthographe seulement). N'invente aucun fait, aucune citation d'Hannibal.
- Sépare strictement contenu (`data.js`) et logique. Code commenté, fonctions courtes.
- Aucune clé API dans le code client. Aucune dépendance externe obligatoire (polices système).
- Teste : un scénario en entier, le cas « image manquante », le cas « pas de voix française », l'écran de 360 px de large. Décris-moi ce que tu as vérifié et ce que tu n'as pas pu vérifier.
- Procède **par étapes** : (1) rapport sur les images, (2) squelette et données, (3) logique de jeu, (4) audio, (5) design, (6) bilan et README (comment lancer, comment ajouter de l'audio). Arrête-toi à la fin de chaque étape pour que je valide.
- *(Phase 2, optionnelle, seulement si je le demande)* : un débrief final généré par IA via un petit serveur qui garde la clé API.

---

## 8. CONTENU (à placer dans `js/data.js`)

Format de chaque scénario : `id, year, title, avant (« Auparavant »), contexte, objectif, options[4] {texte, resultat, hannibal}, dH (variations Hommes/Moral/Vivres/Alliés si Hannibal), dX (si autre choix), note`.
Dans chaque scénario, l'option marquée ⭐ est celle d'Hannibal. **L'ordre ci-dessous = l'ordre des 4 images du dossier.**

### PROLOGUE (narration seule)
- **P1 · Deux puissances.** « Au troisième siècle avant notre ère, deux puissances se disputent la Méditerranée. Carthage, cité fondée par les Phéniciens sur la côte de l'actuelle Tunisie, domine le commerce et la mer. Rome, république de paysans-soldats, étend peu à peu son pouvoir sur l'Italie. »
- **P2 · La première guerre punique.** « De 264 à 241 avant notre ère, les deux cités s'affrontent pendant vingt-trois ans, surtout autour de la Sicile. Rome construit une flotte et finit par l'emporter. Carthage perd la Sicile et doit payer une lourde somme. Elle en sort humiliée. »
- **P3 · Le serment.** « En 247, naît à Carthage un garçon nommé Hannibal, fils du général Hamilcar Barca. En 237, son père part reconstruire la puissance de Carthage en Espagne et l'emmène. Selon l'historien Polybe, qui rapporte les propres paroles d'Hannibal, l'enfant, alors âgé d'environ neuf ans, jure à son père de ne jamais être l'ami de Rome. »

### S01 · 221 av. J.-C. · L'armée t'acclame (id: s01)
- **avant :** Depuis ton enfance, ton père Hamilcar puis ton beau-frère Hasdrubal ont reconstruit en Espagne la puissance de Carthage.
- **contexte :** Hasdrubal vient d'être assassiné. À 26 ans, tu es acclamé chef de l'armée de Carthage en Espagne : des dizaines de milliers d'hommes, des mines d'argent et plusieurs villes. Un traité avec Rome fixe le fleuve Èbre comme limite à ne pas dépasser. Tu as tout à prouver.
- **objectif :** Affermir ton pouvoir et préparer l'avenir.
- Options :
  1. Lancer aussitôt la guerre contre Rome → *Ton armée n'est pas prête, tes arrières en Espagne sont instables et Carthage n'a pas décidé la guerre. Tu risques d'être lâché par ton propre camp.*
  2. ⭐ Consolider l'Espagne en soumettant les tribus voisines → *Tu bats les Olcades, les Vaccéens, puis une grande coalition de tribus près du fleuve Tage. Ton armée gagne en expérience et en richesse, et le sénat de Carthage confirme ton commandement.*
  3. Attendre les ordres du sénat de Carthage → *Le sénat tarde et ton armée s'ennuie. Tu perds du temps pendant que Rome renforce ses alliés.*
  4. Signer une paix durable avec Rome → *Carthage reste sous la tutelle de Rome. Tes soldats, qui attendent une revanche, doutent de leur chef.*
- dH = [0, 15, 10, 5] · dX = [-5, -15, -5, -5]

### S02 · 219 av. J.-C. · Sagonte (id: s02)
- **avant :** Ton armée est solide, riche et fidèle. Tu peux regarder vers le nord, vers la frontière fixée avec Rome.
- **contexte :** Sagonte est une riche cité espagnole, au sud de l'Èbre, donc dans ta zone. Mais elle a signé une alliance avec Rome et elle harcèle des tribus alliées de Carthage. Si tu l'attaques, Rome peut y voir une provocation. Si tu l'ignores, tu laisses un allié de Rome au cœur de ton territoire.
- **objectif :** Protéger tes alliés sans perdre l'initiative.
- Options :
  1. ⭐ Assiéger la ville → *Après environ huit mois, Sagonte tombe. Tu prends un immense butin. Rome, qui n'a pas secouru la ville, envoie des ambassadeurs à Carthage pour exiger que tu leur sois livré.*
  2. Ignorer Sagonte → *Sagonte continue d'agiter les tribus alliées, et tes soldats te trouvent faible. Rome s'en sert comme base d'influence.*
  3. Négocier avec Rome → *Rome exige que tu cesses toute action. Tu perds ta liberté de manœuvre sans rien obtenir.*
  4. Reculer devant Rome → *Tes alliés espagnols doutent de toi et ta réputation s'effondre.*
- dH = [-5, 10, 10, 0] · dX = [0, -15, 0, -15]

### S03 · 218 av. J.-C. · Rome déclare la guerre (id: s03)
- **avant :** Sagonte est tombée. Rome n'a pas répondu par les armes, mais ses ambassadeurs exigent que Carthage te livre.
- **contexte :** Le sénat de Carthage refuse de te livrer. Selon l'historien romain Tite-Live, un ambassadeur de Rome fait alors le geste de laisser choisir entre la paix et la guerre, et Carthage choisit la guerre. Tu es à Carthagène, avec une grande armée et des éléphants. Rome contrôle la mer et compte te combattre en Espagne et en Afrique.
- **objectif :** Frapper Rome là où elle ne t'attend pas.
- Options :
  1. Défendre l'Espagne et attendre l'attaque → *Rome choisit son terrain et mène la guerre loin d'elle : l'affrontement s'enlise en Espagne.*
  2. Embarquer l'armée vers l'Italie → *La flotte romaine domine la mer : tes navires, peu nombreux, sont coulés ou bloqués.*
  3. Attendre des renforts de Carthage → *Le sénat de Carthage, divisé, tarde. Les Romains débarquent en Espagne et tu perds l'initiative.*
  4. ⭐ Marcher par la terre : Pyrénées, Gaule, Alpes → *Tu pars par la terre avec tes éléphants. Rome, qui t'attendait en Espagne ou en mer, est prise au dépourvu.*
- dH = [0, 10, -10, 5] · dX = [-10, -15, 0, -10]

### S04 · Septembre 218 · Le Rhône (id: s04)
- **avant :** Tu as laissé des troupes en Espagne et traversé les Pyrénées avec plusieurs dizaines de milliers d'hommes et des éléphants.
- **contexte :** Tu arrives au Rhône, large et rapide. Sur l'autre rive, des Gaulois armés veulent t'empêcher de passer. À quelques jours de marche, une armée romaine dirigée par Scipion approche. Tes éléphants ont peur de l'eau.
- **objectif :** Traverser le fleuve avant l'arrivée des Romains.
- Options :
  1. Traverser de force → *Sous les javelots des Gaulois, ta traversée tourne au désordre : tu perds beaucoup d'hommes et de temps.*
  2. ⭐ Envoyer un détachement traverser plus haut → *Ton lieutenant Hannon traverse en amont sur des radeaux et attaque les Gaulois par derrière, au signal de fumée. Tu passes alors l'armée, puis les éléphants sur des radeaux couverts de terre. Quand les Romains arrivent, tu es de l'autre côté : tu choisis de continuer vers les Alpes plutôt que de les combattre.*
  3. Remonter le fleuve très loin → *Ta colonne s'épuise sur un long détour et les Romains te rattrapent.*
  4. Payer les Gaulois → *Les Gaulois prennent l'argent mais ne te laissent pas passer, et tu perds ton temps.*
- dH = [-5, 5, 0, 0] · dX = [-15, -10, -10, -5]

### S05 · Octobre 218 · Les Alpes (id: s05)
- **avant :** Tu as franchi le Rhône et laissé les Romains derrière toi. Devant toi, les montagnes.
- **contexte :** Tu atteins les Alpes, la plus haute chaîne d'Europe. Personne n'a franchi ces montagnes avec une armée et des éléphants. Nous sommes en octobre : la neige arrive, des tribus gauloises t'attaquent depuis les hauteurs et tes hommes sont épuisés. De l'autre côté, c'est l'Italie, et Rome ne t'attend pas par là.
- **objectif :** Atteindre l'Italie avec une armée capable de combattre.
- Options :
  1. Hiverner en Gaule et passer au printemps → *Rome a tout l'hiver pour lever des armées et verrouiller les passages : tu perds la surprise.*
  2. ⭐ Franchir les Alpes sans attendre → *Après environ quinze jours dans la neige, tu atteins la plaine du Pô. Selon Polybe, il te reste environ 20 000 fantassins et 6 000 cavaliers. Tu as perdu près de la moitié de ton armée, mais Rome est stupéfaite.*
  3. Longer la côte vers la Ligurie → *Les légions romaines et Marseille, alliée de Rome, t'attendent sur un chemin plus long et mieux gardé.*
  4. Renvoyer les éléphants et alléger l'armée → *Sans éléphants ni nombre, tu perds ton effet de choc et les tribus gauloises doutent de ta force.*
- note : Le col exact est encore débattu par les historiens.
- dH = [-45, 0, -25, 10] · dX = [-10, -15, -10, -10]

### S06 · Décembre 218 · La Trébie (id: s06)
- **avant :** Tu es en Italie, affaibli mais là. Rome rassemble ses armées pour te chasser.
- **contexte :** Tu es dans la plaine du Pô, en plein hiver. Le consul Sempronius, impatient de gagner avant la fin de son mandat, campe de l'autre côté d'une rivière, la Trébie. Tes hommes sont fatigués, mais tu as une cavalerie numide très mobile et ton frère Magon, bon chef.
- **objectif :** Gagner ta première bataille en Italie pour convaincre les Gaulois du Nord de s'allier à toi.
- Options :
  1. Attendre dans ton camp → *Les Romains se renforcent et tes alliés gaulois, impatients, doutent de toi.*
  2. ⭐ Attirer les Romains hors de leur camp, puis les prendre en embuscade → *Ta cavalerie numide provoque les Romains, qui traversent la rivière glacée sans avoir mangé. Magon, caché avec 2 000 hommes dans un ravin, les attaque par l'arrière. Une grande partie de l'armée romaine est détruite et les Gaulois du Nord rejoignent ton camp.*
  3. Attaquer leur camp → *Tes troupes fatiguées s'épuisent contre des palissades solidement défendues.*
  4. Éviter le combat → *Sans victoire, les Gaulois du Nord ne te rejoignent pas et ton armée s'affaiblit encore.*
- dH = [-5, 20, 5, 25] · dX = [-20, -15, -10, -15]

### S07 · Printemps 217 · Les marais de l'Arno (id: s07)
- **avant :** Après la Trébie, tu as passé l'hiver dans le Nord avec tes alliés gaulois.
- **contexte :** Deux armées romaines t'attendent sur les routes habituelles pour descendre vers le sud. Un chemin plus court passe par les marais de l'Arno, inondés par la fonte des neiges, que les Romains croient impraticables. Le trajet durera plusieurs jours, sans pouvoir dormir sur la terre ferme.
- **objectif :** Contourner les armées romaines pour arriver en Italie centrale.
- Options :
  1. Contourner par les Apennins → *Les passes sont gardées et les Romains profitent du terrain : tu perds des jours et des hommes.*
  2. ⭐ Traverser les marais → *Tu traverses les marais en quatre jours et trois nuits, en perdant des hommes et des animaux. Atteint d'une maladie des yeux, tu perds la vue d'un œil. Mais tu sors derrière l'armée romaine.*
  3. Attendre dans la plaine du Pô → *Les Romains se renforcent et ta réputation de chef audacieux s'efface.*
  4. Retourner en Gaule → *Tu abandonnes l'Italie et tes alliés gaulois se sentent trahis.*
- dH = [-15, -5, -10, 5] · dX = [-10, -10, -10, -10]

### S08 · 217 av. J.-C. · Le lac Trasimène (id: s08)
- **avant :** Les marais traversés, tu te retrouves derrière l'armée du consul Flaminius.
- **contexte :** Flaminius, connu pour être impatient et téméraire, te poursuit avec une armée de plus de 25 000 hommes. Tu longes le lac Trasimène : la route passe dans une étroite bande de terrain entre le lac et des collines.
- **objectif :** Détruire cette armée avant qu'elle ne rejoigne l'autre armée romaine.
- Options :
  1. Marcher droit sur Rome en l'ignorant → *Sans machines de siège ni alliés, tu t'épuises devant des murs défendus, avec Flaminius dans ton dos.*
  2. Camper en plaine et attendre la bataille → *Dans une bataille ordinaire, l'infanterie lourde romaine a l'avantage, et tu paies cher la victoire.*
  3. Assiéger une ville proche → *Le siège te cloue sur place et laisse aux armées romaines le temps de se rassembler.*
  4. ⭐ Cacher tes troupes dans les collines et attaquer dans la brume → *Les Romains avancent en colonne dans la brume, enfermés entre collines et lac, sans pouvoir se déployer. Flaminius meurt et son armée est anéantie en quelques heures.*
- dH = [-3, 15, 5, 10] · dX = [-20, -10, -15, 0]

### S09 · Été 217 · Le piège de la vallée (id: s09)
- **avant :** Rome a changé de méthode. Elle nomme un dictateur, Fabius Maximus, qui refuse le combat et te suit à distance.
- **contexte :** Tu as pillé le sud de l'Italie, mais tu as peu d'alliés et peu de vivres. Tu entres dans une plaine entourée de montagnes. Fabius bloque la seule sortie, un col étroit, et ses armées tiennent les collines. Tu es presque encerclé.
- **objectif :** Sortir du piège sans combattre dans de mauvaises conditions.
- Options :
  1. Forcer le passage → *Les Romains tiennent les hauteurs : tu perds beaucoup d'hommes pour rien.*
  2. ⭐ Lancer des bœufs aux cornes enflammées dans les collines → *À la nuit, environ 2 000 bœufs portant des fagots enflammés sont lancés vers les hauteurs. Les Romains qui gardent le col croient à une attaque et abandonnent leur poste. Ton armée passe avec son butin.*
  3. Négocier une trêve → *Fabius n'a aucune raison d'accepter : il te laisse t'épuiser dans la vallée.*
  4. Attendre en espérant → *Les vivres s'épuisent et le moral s'effondre.*
- note : Ce récit vient de Polybe et de Tite-Live, des sources romaines.
- dH = [0, 10, 5, 0] · dX = [-20, -20, -20, -5]

### S10 · 216 av. J.-C. · Cannes (id: s10)
- **avant :** Fabius a épuisé la patience des Romains. Le Sénat l'a remplacé par une immense armée chargée d'en finir.
- **contexte :** Rome a levé la plus grande armée de son histoire : environ 80 000 hommes contre tes 50 000. Tu as la meilleure cavalerie, mais l'infanterie romaine est plus nombreuse et plus solide. La plaine de Cannes est plate, sans obstacle : elle convient à ta cavalerie.
- **objectif :** Vaincre une armée presque deux fois plus nombreuse.
- Options :
  1. Aligner une ligne solide et tenir sur place → *Une ligne rigide, moins nombreuse, finit par céder sous la masse romaine.*
  2. ⭐ Avancer ton centre faible, garder tes meilleures troupes sur les côtés et ta cavalerie pour encercler → *Ton centre recule lentement : les légions s'y enfoncent. Tes troupes de côté se rabattent, ta cavalerie fait le tour et les prend à revers. Encerclés, des dizaines de milliers de Romains périssent en un jour. Cannes est encore étudiée dans les écoles militaires.*
  3. Attaquer de nuit → *La nuit annule ta supériorité de cavalerie et la confusion profite au plus nombreux.*
  4. Éviter la bataille et te retirer dans les collines → *Loin de tes vivres, ton armée s'affaiblit, et tu n'obtiens jamais la victoire qui ferait basculer les alliés de Rome.*
- dH = [-10, 25, 15, 25] · dX = [-45, -30, -20, -20]

### S11 · 216 av. J.-C. · Après Cannes (id: s11)
- **avant :** Cannes est une catastrophe pour Rome : elle n'a presque plus d'armée disponible.
- **contexte :** Maharbal, ton chef de cavalerie, te presse de marcher sur Rome, à quelques jours : « Dans cinq jours, tu dînes au Capitole ! » Mais tes soldats sont fatigués, tu n'as ni machines de siège ni assez de vivres, et Rome est entourée de hautes murailles. Autour, des peuples d'Italie soumis à Rome hésitent à passer de ton côté.
- **objectif :** Transformer cette victoire en victoire définitive.
- Options :
  1. Marcher aussitôt sur Rome → *Ton armée épuisée arrive devant des murs intacts et une ville mobilisée : un échec te coûterait tout.*
  2. ⭐ Proposer la paix et rallier les alliés de Rome dans le Sud → *Rome refuse de négocier. Capoue, deuxième ville d'Italie, et plusieurs peuples du Sud passent dans ton camp, mais Rome tient bon. Maharbal t'aurait reproché de savoir vaincre sans savoir profiter de ta victoire.*
  3. Retourner en Espagne te reconstituer → *Tu abandonnes le terrain gagné, et les alliés hésitants restent fidèles à Rome.*
  4. Attendre des renforts → *Les Romains bloquent les renforts en Espagne, et le temps joue pour Rome.*
- note : Les historiens débattent : sans machines de siège, Rome était-elle vraiment prenable ?
- dH = [0, 0, 10, 25] · dX = [-25, -15, -25, -10]

### S12 · 211 av. J.-C. · Capoue assiégée (id: s12)
- **avant :** Rome ne s'est pas rendue. Elle se reconstitue, et tu comptes plusieurs alliés dans le Sud, dont Capoue.
- **contexte :** Rome assiège Capoue avec plusieurs armées. Si Capoue tombe, tes alliés italiens verront que tu ne peux pas les protéger. Tu as essayé de briser le siège, sans succès. Il te reste un coup à tenter : menacer Rome elle-même.
- **objectif :** Sauver Capoue et rassurer tes alliés.
- Options :
  1. Abandonner Capoue → *Tes alliés italiens comprennent qu'ils ne peuvent plus compter sur toi.*
  2. ⭐ Marcher sur Rome pour forcer les Romains à lever le siège → *Tu campes à quelques kilomètres des murs de Rome. La ville panique, mais ne lève pas le siège de Capoue. Tu repars, et Capoue tombe.*
  3. Appeler de l'aide → *L'aide arrive trop tard : les renforts sont arrêtés avant de te rejoindre.*
  4. Attaquer les lignes romaines autour de Capoue → *Les tranchées romaines sont solides : tu perds des hommes sans briser le siège.*
- note : Selon Tite-Live, Rome vendit à cette époque le terrain où tu campais, au prix normal, pour montrer sa confiance.
- dH = [-5, -10, -10, -20] · dX = [-10, -15, -10, -25]

### S13 · 203 av. J.-C. · Le rappel de Carthage (id: s13)
- **avant :** Les années ont passé. Rome a tenu bon : Capoue est tombée, ton frère Hasdrubal a été battu, et un jeune général romain, Scipion, a conquis l'Espagne.
- **contexte :** Cela fait plus de quinze ans que tu combats en Italie sans pouvoir battre Rome. Scipion a débarqué en Afrique et menace Carthage elle-même. Le sénat te rappelle. Si tu pars, tu abandonnes l'Italie, mais ta cité est en danger.
- **objectif :** Sauver Carthage.
- Options :
  1. Rester en Italie → *Carthage tombe sans toi et tu restes isolé en Italie.*
  2. Marcher sur Rome avec ce qui reste de l'armée → *Usée et affaiblie, ton armée échoue et Carthage reste sans défense.*
  3. Aller chercher l'aide de Philippe V de Macédoine → *Philippe est occupé ailleurs : son aide arrive trop tard.*
  4. ⭐ Rentrer en Afrique défendre Carthage → *Tu débarques à Hadrumète, l'actuelle Sousse, après plus de quinze ans passés en Italie.*
- note : Sousse fut ton dernier point d'appui avant la bataille de Zama.
- dH = [-10, -20, -10, -20] · dX = [-30, -30, -20, -30]

### S14 · 202 av. J.-C. · Zama (id: s14)
- **avant :** Tu es rentré à Carthage avec des vétérans fatigués et des recrues. Une trêve avec Rome a été rompue.
- **contexte :** À Zama, en Afrique du Nord, tu affrontes Scipion, qui a pour allié le chef numide Massinissa et ses cavaliers. Tu manques de cavalerie, mais tu disposes d'environ 80 éléphants. Tu sais que la paix de Carthage dépend de cette bataille.
- **objectif :** Gagner cette ultime bataille pour sauver Carthage.
- Options :
  1. ⭐ Éléphants devant, puis trois lignes d'infanterie → *Tu places tes éléphants devant, puis trois lignes d'infanterie. Scipion ouvre des couloirs dans son armée pour laisser passer les éléphants, que ses troupes effraient. Ta cavalerie fuit, la cavalerie de Massinissa revient et t'attaque par derrière. Tu es vaincu, et Carthage doit accepter une paix très dure.*
  2. Éléphants en réserve → *Sans l'effet de choc des éléphants, ta ligne tient peut-être plus longtemps, mais Scipion garde l'avantage de la cavalerie. Les historiens pensent que la défaite restait probable.*
  3. Éviter la bataille → *Retranché sur une colline, tu laisses Scipion ravager la campagne : Carthage finit par négocier sans toi, à de mauvaises conditions.*
  4. Cavalerie d'abord → *Ta petite cavalerie, plus faible que celle de Scipion, est vite écrasée, et ton infanterie se retrouve exposée.*
- note : Hannibal a perdu : ce choix n'était pas absurde, c'est le manque de cavalerie qui a pesé.
- dH = [-40, -20, -10, -30] · dX = [-40, -20, -10, -30]

### S15 · 195 av. J.-C. · L'exil (id: s15)
- **avant :** Après Zama, tu as gouverné Carthage et réformé ses finances. Ces réformes te font des ennemis, qui te dénoncent à Rome.
- **contexte :** Rome exige que Carthage te livre. Tu as environ 52 ans. Ta ville te protège mal. À l'est, le roi Antiochos III cherche à combattre Rome et pourrait t'accueillir.
- **objectif :** Rester libre et continuer à résister à Rome.
- Options :
  1. Rester et te défendre → *Carthage, trop faible, finit par céder à Rome et te livrer.*
  2. ⭐ Fuir vers l'Orient → *Tu quittes Carthage de nuit et gagnes la Syrie auprès d'Antiochos III. Tu ne reverras jamais ta ville.*
  3. Te rendre à Rome → *Tu marcherais dans Rome en prisonnier, exposé à l'humiliation.*
  4. Lever une armée contre le pouvoir de Carthage → *Une guerre civile affaiblirait encore la cité que tu veux protéger.*
- dH = [-10, -10, -10, -30] · dX = [-30, -30, -20, -30]

### ÉPILOGUE (narration seule)
« Antiochos est battu par Rome, et Hannibal doit fuir de nouveau. Il trouve refuge chez le roi Prusias de Bithynie, en Asie Mineure. Quand Rome exige qu'on le lui livre, vers 183 avant notre ère, il choisit de s'empoisonner plutôt que d'être pris. Selon Tite-Live, il aurait dit qu'il était temps de libérer Rome de son angoisse. Hannibal laisse l'image d'un génie tactique : il a gagné presque toutes ses batailles, mais perdu la guerre. Presque tout ce que nous savons de lui vient de ses ennemis. »
