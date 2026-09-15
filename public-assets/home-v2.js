;(function(){
  var API_BASE = 'https://hidden-term-f2d0.timotiniurie49.workers.dev';
  var ARTICLE_LIMIT = 2;
  var state = {
    lang: getSavedLang(),
    news: [],
    wines: [],
    articles: [],
    lessons: [],
    overlayItem: null
  };

  var ui = {
    it: {
      headerTag: 'Edizione Editoriale',
      heroTitle: 'Home Page Editoriale',
      heroSub: 'Una lettura sobria del vino tra notizie, approfondimenti e formazione.',
      winesTitle: '3 cantine del Giorno',
      winesSub: 'Tre cantine del mondo in rotazione automatica: paesaggi, stile di casa e identita territoriale.',
      winesPill: '3 cantine',
      winesFootnote: '',
      briefTitle: 'Notizia breve',
      briefPill: 'Oggi',
      newsTitle: 'Segnale del Giorno',
      newsLabel: 'Flash',
      carouselTag: 'Una notizia',
      newsFootnote: 'Un solo segnale editoriale, aggiornato ogni mattina in 4 lingue',
      newsFallbackTitle: 'La raccolta inizia con segnali stabili nelle aree collinari europee',
      newsFallbackExcerpt: 'Un quadro prudente ma ordinato apre la settimana: maturazione regolare, vendemmie osservate con attenzione e mercati in cerca di riferimenti affidabili.',
      newsFallbackSource: 'Redazione Sommelier World',
      articlesTitle: 'Il Sapere del Vino',
      articlesSub: 'Storia, terroir e tecnica del vino in due letture editoriali selezionate.',
      articlesFootnote: 'Due articoli selezionati per la home',
      lessonsTitle: 'Lezioni di Degustazione',
      lessonsSub: 'Tre moduli in rotazione settimanale, uno per livello.',
      lessonsFootnote: 'Cambiano ogni settimana con rotazione automatica',
      readMore: 'Leggi',
      openLink: 'Apri fonte',
      backHome: 'Torna alla home',
      close: 'Chiudi',
      quickNavTitle: 'Percorsi',
      navHome: 'Home',
      navSearch: 'Produttori',
      navTerroir: 'Terroir',
      navSommelier: 'Sommelier',
      navMenu: 'Eventi',
      source: 'Fonte',
      articleKind: 'Articolo',
      lessonKind: 'Lezione',
      wineKind: 'Cantina',
      loadingNews: 'Caricamento notizie in corso...',
      weeklyRotation: 'Rotazione settimanale',
      level1: 'Livello 1',
      level2: 'Livello 2',
      level3: 'Livello 3'
    },
    en: {
      headerTag: 'Editorial Edition',
      heroTitle: 'Editorial Home Page',
      heroSub: 'A sober reading of wine through news, essays and study.',
      winesTitle: '3 Wineries of the Day',
      winesSub: 'Three wineries from around the world on automatic rotation: landscape, house style and territorial identity.',
      winesPill: '3 wineries',
      winesFootnote: '',
      briefTitle: 'Brief news',
      briefPill: 'Today',
      newsTitle: 'Signal of the Day',
      newsLabel: 'Brief',
      carouselTag: 'One item',
      newsFootnote: 'A single editorial signal, updated every morning in 4 languages',
      newsFallbackTitle: 'Harvest monitoring begins with stable signs across European hillside vineyards',
      newsFallbackExcerpt: 'A cautious yet orderly picture opens the week: even ripening, close harvest monitoring and markets looking for reliable reference points.',
      newsFallbackSource: 'Sommelier World Desk',
      articlesTitle: 'Wine Knowledge',
      articlesSub: 'History, terroir and wine technique in two selected editorial readings.',
      articlesFootnote: 'Two selected articles for the home page',
      lessonsTitle: 'Tasting Lessons',
      lessonsSub: 'Three weekly rotating modules, one for each level.',
      lessonsFootnote: 'They change weekly with automatic rotation',
      readMore: 'Read',
      openLink: 'Open source',
      backHome: 'Back to home',
      close: 'Close',
      quickNavTitle: 'Paths',
      navHome: 'Home',
      navSearch: 'Producers',
      navTerroir: 'Terroir',
      navSommelier: 'Sommelier',
      navMenu: 'Events',
      source: 'Source',
      articleKind: 'Article',
      lessonKind: 'Lesson',
      wineKind: 'Winery',
      loadingNews: 'Loading daily news...',
      weeklyRotation: 'Weekly rotation',
      level1: 'Level 1',
      level2: 'Level 2',
      level3: 'Level 3'
    },
    fr: {
      headerTag: 'Edition Editoriale',
      heroTitle: 'Page d accueil editoriale',
      heroSub: 'Une lecture sobre du vin entre nouvelles, articles et formation.',
      winesTitle: '3 caves du Jour',
      winesSub: 'Trois caves du monde en rotation automatique: paysage, style de maison et identite territoriale.',
      winesPill: '3 caves',
      winesFootnote: '',
      briefTitle: 'Breve nouvelle',
      briefPill: 'Aujourd hui',
      newsTitle: 'Signal du Jour',
      newsLabel: 'Flash',
      carouselTag: 'Une note',
      newsFootnote: 'Un seul signal editorial, mis a jour chaque matin en 4 langues',
      newsFallbackTitle: 'La surveillance des vendanges commence avec des signaux stables dans les vignobles collinaires europeens',
      newsFallbackExcerpt: 'Le debut de semaine reste prudent mais ordonne: maturation reguliere, vendanges suivies de pres et marches en quete de reperes fiables.',
      newsFallbackSource: 'Redaction Sommelier World',
      articlesTitle: 'Le Savoir du Vin',
      articlesSub: 'Histoire, terroir et technique du vin dans deux lectures editoriales selectionnees.',
      articlesFootnote: 'Deux articles selectionnes pour la page d accueil',
      lessonsTitle: 'Lecons de Degustation',
      lessonsSub: 'Trois modules en rotation hebdomadaire, un pour chaque niveau.',
      lessonsFootnote: 'Changent chaque semaine avec rotation automatique',
      readMore: 'Lire',
      openLink: 'Ouvrir la source',
      backHome: 'Retour a l accueil',
      close: 'Fermer',
      quickNavTitle: 'Parcours',
      navHome: 'Accueil',
      navSearch: 'Producteurs',
      navTerroir: 'Terroir',
      navSommelier: 'Sommelier',
      navMenu: 'Evenements',
      source: 'Source',
      articleKind: 'Article',
      lessonKind: 'Lecon',
      wineKind: 'Cave',
      loadingNews: 'Chargement des nouvelles...',
      weeklyRotation: 'Rotation hebdomadaire',
      level1: 'Niveau 1',
      level2: 'Niveau 2',
      level3: 'Niveau 3'
    },
    ru: {
      headerTag: 'Редакционная версия',
      heroTitle: 'Редакционная главная страница',
      heroSub: 'Спокойное чтение мира вина через новости, статьи и обучение.',
      winesTitle: '3 винодельни дня',
      winesSub: 'Три винодельни мира в автоматической ротации: пейзаж, стиль хозяйства и территориальный характер.',
      winesPill: '3 винодельни',
      winesFootnote: '',
      briefTitle: 'Короткая новость',
      briefPill: 'Сегодня',
      newsTitle: 'Сигнал дня',
      newsLabel: 'Коротко',
      carouselTag: 'Одна заметка',
      newsFootnote: 'Один редакционный сигнал, обновляемый каждое утро на 4 языках',
      newsFallbackTitle: 'Наблюдение за сбором урожая начинается на фоне стабильных сигналов в европейских холмистых виноградниках',
      newsFallbackExcerpt: 'Неделя открывается осторожной, но ровной картиной: равномерное созревание, внимательный контроль сбора и рынки, ищущие надежные ориентиры.',
      newsFallbackSource: 'Редакция Sommelier World',
      articlesTitle: 'Знание о вине',
      articlesSub: 'История, терруар и техника вина в двух отобранных редакционных материалах.',
      articlesFootnote: 'Два отобранных материала для главной страницы',
      lessonsTitle: 'Уроки дегустации',
      lessonsSub: 'Три модуля с еженедельной ротацией, по одному на каждый уровень.',
      lessonsFootnote: 'Меняются еженедельно в автоматической ротации',
      readMore: 'Читать',
      openLink: 'Открыть источник',
      backHome: 'Назад на главную',
      close: 'Закрыть',
      quickNavTitle: 'Разделы',
      navHome: 'Главная',
      navSearch: 'Производители',
      navTerroir: 'Терруар',
      navSommelier: 'Сомелье',
      navMenu: 'События',
      source: 'Источник',
      articleKind: 'Статья',
      lessonKind: 'Урок',
      wineKind: 'Винодельня',
      loadingNews: 'Загрузка новостей...',
      weeklyRotation: 'Недельная ротация',
      level1: 'Уровень 1',
      level2: 'Уровень 2',
      level3: 'Уровень 3'
    }
  };

  var articles = [
    {
      id: 'art_cellars',
      it: {
        title: 'Le cantine silenziose di Tokaj',
        intro: 'Nella geologia di Tokaj il tempo non scorre soltanto: si deposita nelle pareti di tufo e governa il ritmo dell affinamento.',
        body: 'Tokaj non e soltanto un nome storico. E un sistema di luoghi, umidita, muffe nobili e gallerie in cui la maturazione prende una forma quasi architettonica. Le cantine scavate nel tufo trattengono una temperatura stabile e una respirazione lenta, ideale per vini che chiedono calma.\n\nIl grande punto di forza di questa area non e un singolo vitigno, ma la relazione tra Furmint, Harslevelu, ventilazione delle colline e nebbie autunnali. La Botrytis cinerea non e un accidente decorativo: e una lente che concentra, alleggerisce, ridefinisce il frutto.\n\nQuando si studia Tokaj conviene guardare meno all immagine del vino dolce in senso generico e piu al concetto di precisione. Anche nelle versioni piu ricche, il centro del vino resta guidato dall acidita. E questa struttura, piu ancora della dolcezza, a spiegare la sua longevita.\n\nPer questo Tokaj resta una lezione attuale: dimostra che il lusso nel vino non coincide con l eccesso, ma con la disciplina del dettaglio.',
      },
      en: {
        title: 'The Silent Cellars of Tokaj',
        intro: 'In Tokaj, time does not merely pass: it settles into the tuff walls and shapes the pace of ageing.',
        body: 'Tokaj is not only a historical name. It is a system of places, humidity, noble mould and underground galleries where maturation becomes almost architectural. The cellars carved into tuff maintain a stable temperature and a slow breath, ideal for wines that require patience.\n\nThe real strength of the area is not a single grape but the relation between Furmint, Harslevelu, hillside ventilation and autumn fog. Botrytis cinerea is not a decorative accident: it is a lens that concentrates, lightens and redefines fruit.\n\nWhen studying Tokaj, it helps to look less at the generic idea of sweet wine and more at precision. Even in richer versions, the core remains driven by acidity. That structure, more than sweetness, explains its longevity.\n\nThat is why Tokaj still matters today: it proves that luxury in wine is not excess, but discipline in detail.',
      },
      fr: {
        title: 'Les caves silencieuses de Tokaj',
        intro: 'A Tokaj, le temps ne passe pas seulement: il se depose dans les murs de tuf et regle le rythme de l elevage.',
        body: 'Tokaj n est pas seulement un nom historique. C est un systeme de lieux, d humidite, de moisissure noble et de galeries ou la maturation devient presque architecturale. Les caves creusees dans le tuf gardent une temperature stable et une respiration lente, ideale pour des vins qui demandent de la patience.\n\nLa vraie force de la region ne repose pas sur un seul cepage, mais sur la relation entre le Furmint, le Harslevelu, l aeration des collines et les brouillards d automne. La Botrytis cinerea n est pas un accident decoratif: c est une lentille qui concentre, allege et redefine le fruit.\n\nPour etudier Tokaj, il faut regarder moins l image generique du vin doux et davantage l idee de precision. Meme dans les versions les plus riches, le centre du vin reste guide par l acidite. C est cette structure, plus encore que le sucre, qui explique la longevite.\n\nTokaj reste ainsi une lecon actuelle: le luxe du vin ne reside pas dans l exces, mais dans la discipline du detail.',
      },
      ru: {
        title: 'Тихие погреба Токая',
        intro: 'В Токае время не просто проходит: оно оседает в стенах туфа и задает ритм выдержки.',
        body: 'Токай это не только историческое имя. Это система мест, влажности, благородной плесени и подземных галерей, где созревание становится почти архитектурным процессом. Погреба, вырубленные в туфе, удерживают стабильную температуру и медленное дыхание, идеальное для вин, которым нужна выдержка.\n\nСила региона заключается не в одном сорте, а в связи между Furmint, Harslevelu, вентиляцией склонов и осенними туманами. Botrytis cinerea здесь не декоративная случайность, а линза, которая концентрирует, облегчает и заново определяет фрукт.\n\nИзучая Токай, полезно меньше думать о нем как о просто сладком вине и больше как о модели точности. Даже в самых насыщенных версиях центр вина удерживается кислотностью. Именно эта структура, а не только сахар, объясняет его долговечность.\n\nПоэтому Токай важен и сегодня: он показывает, что роскошь в вине это не избыток, а дисциплина деталей.',
      }
    },
    {
      id: 'art_limestone',
      it: {
        title: 'Perche il calcare cambia lo Chardonnay',
        intro: 'Il calcare non aggiunge aromi in modo diretto, ma cambia la tensione, la trama e il modo in cui un vino resta in bocca.',
        body: 'Quando si parla di suolo calcareo si cade spesso in formule troppo rapide. Il calcare non e un aroma, non profuma di gesso nel senso piu semplice del termine e non funziona come un ingrediente. Lavora piuttosto sul drenaggio, sulla disponibilita idrica e sul modo in cui la vite regola il proprio equilibrio.\n\nPer lo Chardonnay questo e decisivo. In molti contesti, il vitigno tende a mostrare la propria parte piu ampia e generosa. Il calcare, invece, lo richiama verso una linea piu sobria: piu tensione acida, meno larghezza inutile, maggiore definizione del finale.\n\nPer questo due Chardonnay vinificati allo stesso modo possono apparire profondamente diversi se provengono da matrici geologiche opposte. Dove il terreno trattiene troppo, il vino puo allargarsi. Dove il substrato drena e costringe la radice a un rapporto piu selettivo con l acqua, la lettura si fa piu nervosa, piu salina, piu nitida.\n\nIl calcare non garantisce automaticamente la grandezza, ma spesso fornisce la grammatica ideale per uno Chardonnay di precisione.',
      },
      en: {
        title: 'Why Limestone Changes Chardonnay',
        intro: 'Limestone does not add aromas directly, yet it changes tension, texture and the way a wine lingers on the palate.',
        body: 'When people speak about limestone soils, they often rely on shortcuts. Limestone is not an aroma, it does not smell like chalk in any literal way and it does not act like an ingredient. Instead, it shapes drainage, water availability and the way the vine regulates its own balance.\n\nFor Chardonnay this matters enormously. In many contexts the grape naturally shows its broad and generous side. Limestone calls it back toward a stricter line: more acid tension, less unnecessary width and greater definition in the finish.\n\nThat is why two Chardonnays made in the same way may feel profoundly different when they come from opposing geological matrices. Where soils retain too much, the wine may spread. Where the subsoil drains and forces the root to negotiate water more selectively, the wine becomes more nervous, more saline and more precise.\n\nLimestone does not automatically guarantee greatness, but it often provides the ideal grammar for a precise Chardonnay.',
      },
      fr: {
        title: 'Pourquoi le calcaire change le Chardonnay',
        intro: 'Le calcaire n ajoute pas d aromes directement, mais il change la tension, la texture et la persistance du vin.',
        body: 'Quand on parle de sols calcaires, on tombe souvent dans des formules trop rapides. Le calcaire n est pas un arome, il ne sent pas simplement la craie et il ne fonctionne pas comme un ingredient. Il agit plutot sur le drainage, sur la disponibilite de l eau et sur la facon dont la vigne regle son equilibre.\n\nPour le Chardonnay, c est decisif. Dans de nombreux contextes, le cepage montre volontiers son cote ample et genereux. Le calcaire le rappelle au contraire vers une ligne plus stricte: davantage de tension acide, moins de largeur inutile et une meilleure definition finale.\n\nAinsi, deux Chardonnays vinifies de la meme facon peuvent paraitre tres differents s ils viennent de matrices geologiques opposees. Lorsque le sol retient trop, le vin s elargit. Lorsque le sous-sol draine et oblige la racine a negocier l eau plus finement, le vin devient plus nerveux, plus salin, plus precis.\n\nLe calcaire ne garantit pas automatiquement la grandeur, mais il fournit souvent la grammaire ideale d un Chardonnay de precision.',
      },
      ru: {
        title: 'Почему известняк меняет Шардоне',
        intro: 'Известняк не добавляет ароматов напрямую, но меняет напряжение, текстуру и послевкусие вина.',
        body: 'Когда говорят об известняковых почвах, часто используют слишком быстрые формулы. Известняк это не аромат, не буквальный запах мела и не ингредиент. Он влияет на дренаж, доступность воды и на то, как лоза выстраивает собственное равновесие.\n\nДля Шардоне это особенно важно. Во многих условиях сорт склонен показывать широкую и щедрую сторону. Известняк возвращает его к более строгой линии: больше кислотного напряжения, меньше лишней широты и более ясный финал.\n\nПоэтому два Шардоне, сделанные одинаково, могут казаться очень разными, если происходят из разных геологических матриц. Там, где почва удерживает слишком много влаги, вино расплывается. Там, где подстилающий слой дренирует и заставляет корни точнее работать с водой, вино становится более нервным, соленым и точным.\n\nИзвестняк не гарантирует величия автоматически, но часто дает идеальную грамматику для точного Шардоне.',
      }
    },
    {
      id: 'art_barolo_cask',
      it: {
        title: 'La lunga vita del Barolo in botte',
        intro: 'La botte non serve solo a cedere legno: nel Barolo tradizionale e soprattutto uno strumento di ordine.',
        body: 'Nel lessico contemporaneo la botte grande viene spesso raccontata in negativo, come semplice assenza di marcatura aromatica. In realta il suo ruolo e molto piu ricco. Nel Barolo la botte lunga e un dispositivo di assestamento: allinea tannino, frutto e respiro del vino.\n\nIl Nebbiolo entra in cantina con una materia spesso severa. Tannino, acidita e profilo floreale non si presentano gia risolti. L affinamento in legno grande permette una micro-ossigenazione lenta che non cerca di addolcire il vino, ma di ordinarlo.\n\nQuesto spiega perche la tradizione langarola non abbia mai pensato il tempo come un ostacolo. Il tempo e un ingrediente strutturale. Un Barolo che passa troppo in fretta dal tino alla bottiglia rischia di essere eloquente ma non ancora composto.\n\nLa botte, in questo senso, non cancella il cru: gli costruisce una sintassi leggibile.',
      },
      en: {
        title: 'The Long Life of Barolo in Cask',
        intro: 'Cask is not there simply to give wood flavour: in traditional Barolo it is above all an instrument of order.',
        body: 'In contemporary language, large casks are often described negatively, as the mere absence of aromatic imprint. In truth their role is richer. In Barolo, long ageing in large cask is a device of settlement: it aligns tannin, fruit and breath.\n\nNebbiolo enters the cellar with material that is often severe. Tannin, acidity and floral profile do not arrive already resolved. Ageing in large wood allows a slow micro-oxygenation that does not try to sweeten the wine, but to organise it.\n\nThat explains why the Langhe tradition never considered time an obstacle. Time is a structural ingredient. A Barolo that moves too quickly from vat to bottle may be eloquent, yet not fully composed.\n\nIn that sense, cask does not erase the cru. It gives the cru a readable syntax.',
      },
      fr: {
        title: 'La longue vie du Barolo en botte',
        intro: 'La botte ne sert pas seulement a transmettre du bois: dans le Barolo traditionnel, elle est surtout un instrument d ordre.',
        body: 'Dans le langage contemporain, la grande botte est souvent decrite negativement, comme simple absence de marquage aromatique. En realite son role est beaucoup plus riche. Dans le Barolo, le long passage en grand bois est un outil de mise en place: il aligne tanin, fruit et respiration du vin.\n\nLe Nebbiolo entre en cave avec une matiere souvent severe. Tanin, acidite et profil floral n arrivent pas deja resolus. L elevage en grand contenant permet une micro-oxygénation lente qui ne cherche pas a adoucir le vin, mais a l ordonner.\n\nCela explique pourquoi la tradition des Langhe n a jamais considere le temps comme un obstacle. Le temps est un ingredient structurel. Un Barolo qui passe trop vite de la cuve a la bouteille peut etre eloquent sans etre encore compose.\n\nLa botte, dans ce sens, n efface pas le cru: elle lui donne une syntaxe lisible.',
      },
      ru: {
        title: 'Долгая жизнь Бароло в бочке',
        intro: 'Большая бочка нужна не только для дерева: в традиционном Бароло это прежде всего инструмент порядка.',
        body: 'В современном языке большую бочку часто описывают отрицательно, как простое отсутствие ароматической отметки дуба. На самом деле ее роль гораздо богаче. В Бароло длинная выдержка в большой бочке выстраивает порядок между танином, фруктом и дыханием вина.\n\nNebbiolo приходит в погреб с материалом, который нередко суров. Танин, кислотность и цветочный профиль не бывают уже собранными воедино. Выдержка в большом дереве позволяет медленную микрооксигенацию, цель которой не смягчить вино, а организовать его.\n\nЭто объясняет, почему традиция Ланге никогда не считала время препятствием. Время здесь структурный ингредиент. Бароло, слишком быстро переходящее из чанa в бутылку, может быть выразительным, но еще не собранным.\n\nВ этом смысле бочка не стирает крю: она дает ему читаемый синтаксис.',
      }
    },
    {
      id: 'art_sparkling_precision',
      it: {
        title: 'Come la presa di spuma costruisce precisione',
        intro: 'Nel vino spumante di qualita la seconda fermentazione non e un effetto speciale: e una costruzione di struttura.',
        body: 'La presa di spuma viene spesso spiegata soltanto come fase tecnica. In realta e un passaggio che ridisegna completamente la forma sensoriale del vino. Non aggiunge solo anidride carbonica: modifica la percezione dell acidita, la continuita del sorso e la gestione della materia.\n\nQuando il vino base e ben calibrato, le bollicine non coprono ma cesellano. Rendono piu leggibile il profilo agrumato, piu netta la salinita, piu elegante l ingresso gustativo. Se il vino base e invece impreciso, la spuma amplifica il difetto.\n\nPer questo le grandi bollicine nascono prima della presa di spuma, nel lavoro sul vino fermo. La tecnica successiva valorizza o svela cio che era gia presente.\n\nLo spumante migliore non e quello piu rumoroso, ma quello in cui la pressione diventa linguaggio.',
      },
      en: {
        title: 'How Secondary Fermentation Builds Precision',
        intro: 'In fine sparkling wine, the second fermentation is not a special effect: it is an act of structure.',
        body: 'Secondary fermentation is often explained merely as a technical phase. In truth it reshapes the sensory form of the wine. It does not only add carbon dioxide: it changes the perception of acidity, the continuity of the sip and the management of texture.\n\nWhen the base wine is well calibrated, bubbles do not cover but refine. They make citrus notes clearer, salinity sharper and the opening of the palate more elegant. When the base wine is imprecise, the foam amplifies the flaw.\n\nThat is why great sparkling wine begins before the prise de mousse, in the work on still wine. The later technique enhances or reveals what was already there.\n\nThe best sparkling wine is not the noisiest one, but the one in which pressure becomes language.',
      },
      fr: {
        title: 'Comment la prise de mousse construit la precision',
        intro: 'Dans les grands vins effervescents, la seconde fermentation n est pas un effet special: c est une construction de structure.',
        body: 'La prise de mousse est souvent presentee comme une simple phase technique. En realite, elle redessine completement la forme sensorielle du vin. Elle n ajoute pas seulement du gaz carbonique: elle modifie la perception de l acidite, la continuite du gout et la gestion de la matiere.\n\nQuand le vin de base est bien calibre, les bulles ne couvrent pas, elles ciselent. Elles rendent les notes d agrumes plus lisibles, la salinite plus nette et l attaque plus elegante. Si le vin de base est imprécis, la mousse amplifie le defaut.\n\nC est pourquoi les grandes bulles naissent avant la prise de mousse, dans le travail sur le vin tranquille. La technique ulterieure ne fait que valoriser ou reveler ce qui etait deja present.\n\nLe meilleur effervescent n est pas le plus bruyant, mais celui dans lequel la pression devient langage.',
      },
      ru: {
        title: 'Как вторичное брожение создает точность',
        intro: 'В высококлассных игристых винах вторичное брожение это не эффект, а построение структуры.',
        body: 'Вторичное брожение часто объясняют только как техническую фазу. На деле оно полностью перестраивает сенсорную форму вина. Оно не просто добавляет углекислый газ: оно меняет восприятие кислотности, непрерывность глотка и работу текстуры.\n\nКогда базовое вино выверено, пузырьки не скрывают, а уточняют. Они делают цитрусовый профиль яснее, соленость четче, а вход во вкус более элегантным. Если же базовое вино неточно, пена лишь усиливает недостаток.\n\nИменно поэтому великие игристые начинаются еще до вторичного брожения, на стадии тихого вина. Последующая техника только усиливает или обнаруживает то, что уже заложено.\n\nЛучшее игристое не самое шумное, а то, где давление становится языком.',
      }
    },
    {
      id: 'art_altitude',
      it: {
        title: 'Leggere esposizione e quota in vigneto',
        intro: 'Esposizione e altitudine non sono dettagli cartografici: sono due forze che cambiano maturita, ombra, ritmo e persino tono aromatico.',
        body: 'La stessa varieta puo parlare con timbro molto diverso a seconda della quota e dell orientamento del vigneto. L altitudine riduce temperature medie, allunga le escursioni termiche e spesso ritarda il calendario di maturazione. L esposizione, invece, regola il modo in cui luce e calore colpiscono la pianta durante la giornata.\n\nUn versante est riceve un risveglio rapido ma tende a evitare le ore piu dure del pomeriggio. Un versante ovest accumula piu calore tardivo e puo spingere il frutto verso maturazioni piu marcate. In alta quota, poi, la luce puo diventare piu incisiva anche quando la temperatura media resta moderata.\n\nLeggere un vigneto significa percio combinare questi fattori, non isolarli. Non basta dire alto o basso, fresco o caldo. Serve capire come il sito distribuisce energia nel tempo.\n\nIl terroir non e un fondale immobile: e una regia quotidiana.',
      },
      en: {
        title: 'Reading Exposure and Altitude in the Vineyard',
        intro: 'Exposure and altitude are not map details: they are forces that reshape ripeness, shade, rhythm and even aromatic tone.',
        body: 'The same grape can speak with a very different voice depending on altitude and vineyard orientation. Altitude lowers average temperatures, widens diurnal shifts and often delays the timing of ripening. Exposure, meanwhile, controls how light and warmth strike the vine through the day.\n\nAn east-facing slope receives a quick awakening yet often avoids the hardest afternoon hours. A west-facing slope stores more late warmth and may push fruit toward riper tones. At high altitude, light itself can grow more incisive even when average temperature remains moderate.\n\nReading a vineyard therefore means combining these factors, not isolating them. It is not enough to say high or low, cool or warm. One must understand how the site distributes energy over time.\n\nTerroir is not a static backdrop. It is a daily direction.',
      },
      fr: {
        title: 'Lire exposition et altitude au vignoble',
        intro: 'Exposition et altitude ne sont pas des details cartographiques: ce sont des forces qui changent la maturite, l ombre, le rythme et meme le ton aromatique.',
        body: 'Un meme cepage peut parler d une voix tres differente selon l altitude et l orientation du vignoble. L altitude abaisse les temperatures moyennes, accentue les amplitudes thermiques et retarde souvent la maturation. L exposition, elle, regle la facon dont la lumiere et la chaleur frappent la vigne pendant la journee.\n\nUn cote est recoit un reveil rapide mais evite souvent les heures les plus dures de l apres-midi. Un cote ouest accumule plus de chaleur tardive et peut pousser le fruit vers des maturites plus marquees. En altitude, la lumiere elle-meme peut devenir plus incisive meme lorsque la temperature moyenne reste moderee.\n\nLire un vignoble, c est donc combiner ces facteurs et non les isoler. Il ne suffit pas de dire haut ou bas, frais ou chaud. Il faut comprendre comment le site distribue l energie dans le temps.\n\nLe terroir n est pas un decor immobile: c est une mise en scene quotidienne.',
      },
      ru: {
        title: 'Как читать экспозицию и высоту виноградника',
        intro: 'Экспозиция и высота это не картографические детали, а силы, меняющие зрелость, тень, ритм и даже ароматический тон.',
        body: 'Один и тот же сорт может говорить по-разному в зависимости от высоты и ориентации участка. Высота снижает средние температуры, усиливает суточные колебания и часто сдвигает сроки созревания. Экспозиция же определяет, как свет и тепло воздействуют на лозу в течение дня.\n\nСклон восточной экспозиции получает быстрое утреннее пробуждение, но чаще избегает самых жестких часов дня. Склон западной экспозиции накапливает больше позднего тепла и может толкать плод к более зрелому профилю. На большой высоте и сама световая энергия становится резче даже при умеренной средней температуре.\n\nПоэтому читать виноградник значит соединять эти факторы, а не разбирать их по одному. Недостаточно сказать высоко или низко, прохладно или тепло. Нужно понимать, как участок распределяет энергию во времени.\n\nТерруар это не неподвижный фон, а ежедневная режиссура.',
      }
    },
    {
      id: 'art_service',
      it: {
        title: 'La disciplina del servizio e della decantazione',
        intro: 'Servire bene un vino non significa esibirsi: significa togliere attrito tra bottiglia, tavolo e bicchiere.',
        body: 'La decantazione viene spesso trattata come gesto teatrale. Ma nel servizio serio ogni scelta ha una funzione precisa. Si decanta per separare deposito, per ossigenare una fase troppo chiusa, per dare al vino un margine di distensione. Non si decanta per principio.\n\nAnche il tempo nel decanter va misurato. Un vino giovane e contratto puo beneficiare di un apertura anticipata. Un vino maturo e delicato, invece, puo perdere rapidamente dettagli se esposto troppo a lungo.\n\nLa stessa logica vale per la temperatura di servizio, per la scelta del calice e per il ritmo del versaggio. Il servizio corretto non invade il vino: lo mette in condizione di parlare con meno interferenze.\n\nIn una grande sala, l eleganza del servizio coincide quasi sempre con la sobrieta.',
      },
      en: {
        title: 'The Discipline of Service and Decanting',
        intro: 'Serving wine well is not a performance: it is the removal of friction between bottle, table and glass.',
        body: 'Decanting is often treated like a theatrical gesture. In serious service, however, every choice has a specific function. One decants to separate sediment, to oxygenate a wine that is still too closed, or to give the liquid room to settle. One does not decant by default.\n\nTime in decanter must also be measured. A young and tight wine may benefit from an early opening. A mature and delicate wine, by contrast, may lose detail quickly when left exposed for too long.\n\nThe same logic applies to service temperature, glass selection and pouring rhythm. Correct service does not invade the wine. It creates the conditions for the wine to speak with fewer interferences.\n\nIn a great dining room, elegance in service almost always coincides with restraint.',
      },
      fr: {
        title: 'La discipline du service et de la decantation',
        intro: 'Bien servir un vin n est pas une demonstration: c est supprimer les frottements entre la bouteille, la table et le verre.',
        body: 'La decantation est souvent traitee comme un geste theatrale. Dans un service serieux, pourtant, chaque choix a une fonction precise. On decante pour separer le depot, pour oxygener une phase encore trop fermee, pour donner au vin une marge de detente. On ne decante pas par principe.\n\nLe temps passe en carafe doit lui aussi etre mesure. Un vin jeune et contracte peut beneficier d une ouverture anticipee. Un vin mature et delicat, au contraire, peut perdre vite ses details s il reste trop longtemps expose.\n\nLa meme logique vaut pour la temperature de service, le choix du verre et le rythme du versage. Le bon service n envahit pas le vin: il lui permet de parler avec moins d interferences.\n\nDans une grande salle, l elegance du service coincide presque toujours avec la sobriete.',
      },
      ru: {
        title: 'Дисциплина подачи и декантации',
        intro: 'Правильно подать вино значит не устраивать спектакль, а убрать лишнее трение между бутылкой, столом и бокалом.',
        body: 'Декантацию часто воспринимают как театральный жест. Но в серьезном сервисе каждое действие имеет точную функцию. Декантируют, чтобы отделить осадок, чтобы дать кислород слишком закрытому вину или чтобы позволить ему расправиться. Декантация не должна быть автоматической.\n\nВремя в декантере тоже нужно измерять. Молодое и зажатое вино может выиграть от раннего раскрытия. Зрелое и хрупкое, напротив, быстро теряет детали при слишком долгом контакте с воздухом.\n\nТа же логика относится к температуре подачи, выбору бокала и ритму наливания. Правильный сервис не вторгается в вино: он создает условия, в которых вино говорит с меньшими помехами.\n\nВ хорошем зале элегантность сервиса почти всегда совпадает со сдержанностью.',
      }
    }
  ];

  var lessonsPool = [
    makeLesson('ais_foundation_sheet', 'level1',
      'Introduzione alla degustazione', 'Introduction to Tasting', 'Introduction a la degustation', 'Введение в дегустацию',
      'Un modulo essenziale per imparare a leggere il vino in tre tempi: vista, naso e bocca.', 'An essential module for reading wine through sight, nose and palate.', 'Un module essentiel pour lire le vin par la vue, le nez et la bouche.', 'Базовый модуль по чтению вина через зрение, аромат и вкус.',
      'La degustazione ordinata non cerca subito il giudizio. Cerca prima un metodo. Nel primo livello del percorso la scheda serve a costruire una sequenza: osservazione visiva, analisi olfattiva, valutazione gustativa e sintesi finale.\n\nQuesto approccio rende comparabili vini molto diversi e riduce gli errori di impressione. La chiarezza del colore, la consistenza nel bicchiere, l intensita aromatica e la qualita del tannino non sono dettagli isolati: fanno parte di una lettura coerente.\n\nLa lezione invita a usare parole semplici ma precise, evitando descrizioni vaghe e automatismi.',
      'Orderly tasting does not begin with judgement. It begins with method. In the first level of the programme, the tasting sheet builds a sequence: visual observation, aroma analysis, palate assessment and final synthesis.\n\nThat structure makes very different wines comparable and reduces impressionistic error. Colour, texture in the glass, aromatic intensity and tannin quality belong to one coherent reading.\n\nThe lesson encourages simple yet precise language, avoiding vague habits.',
      'La degustation ordonnee ne commence pas par le jugement mais par la methode. Au premier niveau du parcours, la fiche construit une sequence: observation visuelle, analyse olfactive, evaluation gustative et synthese finale.\n\nCette structure permet de comparer des vins tres differents et de reduire l erreur impressionniste. Couleur, texture, intensite aromatique et qualite du tanin appartiennent a une meme lecture.\n\nLa lecon privilegie un langage simple mais precis.',
      'Упорядоченная дегустация начинается не с оценки, а с метода. На первом уровне программы карта дегустации выстраивает последовательность: визуальное наблюдение, анализ аромата, оценка во вкусе и итоговый синтез.\n\nТакая структура позволяет сравнивать очень разные вина и снижать риск субъективной ошибки. Цвет, плотность, интенсивность аромата и качество танина входят в единое чтение.\n\nУрок учит говорить просто, но точно.'
    ),
    makeLesson('ais_tech_memory', 'level2',
      'Analisi sensoriale: fase visiva', 'Sensory Analysis: Visual Phase', 'Analyse sensorielle: phase visuelle', 'Сенсорный анализ: визуальная фаза',
      'Come trasformare la vista in informazione utile senza fermarsi alla superficie del colore.', 'How to turn visual cues into useful information beyond surface colour.', 'Comment transformer la vue en information utile au dela de la couleur.', 'Как превратить визуальные признаки в полезную информацию.',
      'La fase visiva non serve a decorare la degustazione. Serve a formulare ipotesi. Limpidezza, tonalita, densita e vivacita aiutano a intuire evoluzione, estratto, possibile vinificazione e stato di conservazione.\n\nUn bianco scarico e teso non parla come un bianco dorato e viscoso. Un rosso trasparente con unghia aranciata non va letto come un rosso fitto e violaceo. La vista non conclude, ma orienta l ascolto delle fasi successive.\n\nLa lezione insiste su un principio: guardare bene significa gia degustare meglio.',
      'The visual phase does not decorate tasting. It forms hypotheses. Clarity, hue, density and brightness help infer development, extract, possible vinification and conservation state.\n\nA pale tense white does not speak like a golden viscous white. A transparent red with orange rim must not be read like a dense purple red. Sight does not conclude, but guides the next stages.\n\nThe lesson insists on one principle: looking well already means tasting better.',
      'La phase visuelle ne sert pas a embellir la degustation. Elle sert a formuler des hypotheses. Limpidite, teinte, densite et vivacite aident a deviner evolution, extrait, mode de vinification et etat de conservation.\n\nUn blanc leger et tendu ne parle pas comme un blanc dore et visqueux. Un rouge transparent a bord tuilé ne se lit pas comme un rouge dense et violace. La vue n acheve pas, elle oriente.\n\nLa lecon rappelle qu observer correctement, c est deja mieux deguster.',
      'Визуальная фаза нужна не для украшения дегустации, а для построения гипотез. Прозрачность, оттенок, плотность и блеск помогают понять стадию развития, экстракт, возможную винификацию и состояние вина.\n\nБледное и напряженное белое не читается так же, как золотистое и вязкое. Прозрачное красное с кирпичным краем нельзя интерпретировать как плотное фиолетовое. Зрение не завершает анализ, а направляет его.\n\nУрок подчеркивает: хорошо смотреть значит лучше дегустировать.'
    ),
    makeLesson('ais_pairing_texture', 'level3',
      'Abbinamenti per trama e struttura', 'Pairing by Texture and Structure', 'Accords par texture et structure', 'Сочетания по текстуре и структуре',
      'Oltre le analogie facili: il piatto va letto nella sua densita reale, non nel nome.', 'Beyond easy analogies: the dish must be read through real density, not by its name.', 'Au dela des analogies faciles: il plat doit etre lu dans sa densite reelle.', 'Выход за пределы простых аналогий: блюдо нужно читать по реальной плотности.',
      'Nel livello avanzato del percorso l abbinamento non si risolve con una lista di eccezioni. Si parte dalla struttura del piatto: grassezza, succulenza, tendenza dolce, aromaticita, persistenza. Solo dopo si sceglie il vino.\n\nQuesto metodo permette di evitare errori classici: rossi troppo estratti su preparazioni leggere, bianchi troppo fragili su salse intense, bollicine usate senza capire il ruolo della texture.\n\nLa lezione mostra come il vino giusto sia spesso quello che corregge o completa il piatto, non quello che gli assomiglia in modo superficiale.',
      'In the advanced level of the programme, pairing is not solved by a list of exceptions. One begins with the structure of the dish: fat, succulence, sweetness tendency, aroma and persistence. Only then is wine selected.\n\nThis method avoids classic mistakes: reds that are too extracted for light dishes, whites too fragile for intense sauces, sparkling wines chosen without understanding texture.\n\nThe lesson shows that the right wine often corrects or completes a dish rather than merely resembling it.',
      'Au niveau avance du parcours, l accord ne se resout pas par une liste d exceptions. On part de la structure du plat: gras, succulence, tendance sucree, aromaticite et persistance. Ce n est qu ensuite que l on choisit le vin.\n\nCette methode evite des erreurs classiques: rouges trop extraits sur plats legers, blancs trop fragiles sur sauces intenses, bulles utilisees sans comprendre la texture.\n\nLa lecon montre que le bon vin corrige ou complete souvent le plat au lieu de lui ressembler superficiellement.',
      'На продвинутом уровне программы сочетание не строится на списке исключений. Сначала анализируют структуру блюда: жирность, сочность, сладковатую тенденцию, ароматичность и продолжительность вкуса. Лишь затем выбирают вино.\n\nТакой метод помогает избежать типичных ошибок: слишком экстрактивных красных к легким блюдам, слишком хрупких белых к насыщенным соусам, игристых без понимания текстуры.\n\nУрок показывает, что правильное вино часто дополняет или корректирует блюдо, а не просто похоже на него.'
    ),
    makeLesson('ais_foundation_service', 'level1',
      'Sequenza del servizio', 'Sequence of Service', 'Sequence du service', 'Последовательность сервиса',
      'Un servizio ordinato costruisce fiducia al tavolo e prepara la lettura corretta del vino.', 'Orderly service builds trust at the table and prepares the correct reading of the wine.', 'Un service ordonne construit la confiance et prepare la bonne lecture du vin.', 'Упорядоченный сервис создает доверие и готовит правильное восприятие вина.',
      'Presentazione della bottiglia, apertura, assaggio, primo versaggio e controllo del tavolo sono tappe che devono apparire naturali. L obiettivo non e la teatralita ma la precisione.\n\nNel primo livello del percorso il servizio viene insegnato come grammatica professionale: ogni gesto deve avere una logica e una misura.\n\nLa lezione insiste anche sul rapporto tra temperatura, bicchiere e tempo di permanenza nel calice.',
      'Bottle presentation, opening, tasting, first pour and table control must appear natural. The goal is not theatre but precision.\n\nAt the first level of the programme, service is taught as professional grammar: every gesture must have logic and measure.\n\nThe lesson also links temperature, glassware and time in the glass.',
      'Presentation de la bouteille, ouverture, gout de controle, premier service et surveillance de la table doivent paraitre naturels. Le but n est pas le theatre mais la precision.\n\nAu premier niveau du parcours, le service est enseigne comme une grammaire professionnelle: chaque geste doit avoir une logique et une mesure.\n\nLa lecon relie aussi temperature, verre et temps dans le calice.',
      'Подача бутылки, открытие, контрольная проба, первая подача и наблюдение за столом должны выглядеть естественно. Цель не театр, а точность.\n\nНа первом уровне программы сервис преподается как профессиональная грамматика: каждый жест должен иметь логику и меру.\n\nУрок также связывает температуру, бокал и время вина в бокале.'
    ),
    makeLesson('ais_tech_regions', 'level2',
      'Mappare l Italia per denominazioni', 'Mapping Italy Through Denominations', 'Cartographier l Italie par appellations', 'Карта Италии через апелласьоны',
      'Le regioni non si memorizzano per elenco: si comprendono per famiglie stilistiche e geografie produttive.', 'Regions are not memorised as lists but understood through style families and productive geographies.', 'Les regions ne se retiennent pas comme des listes mais comme des familles de style.', 'Регионы запоминаются не списком, а через стиль и производственную географию.',
      'L Italia del vino e una pluralita di sistemi. Il metodo del percorso invita a raggruppare per assi utili: Piemonte del Nebbiolo, Toscana del Sangiovese, Nord-Est dei bianchi di precisione, Sud mediterraneo e insulare.\n\nQuesto non riduce la complessita, la rende leggibile. Un candidato che sa ordinare la geografia risponde meglio anche alle domande su vitigni, suoli e abbinamenti.\n\nLa lezione propone una mappa mentale da usare in degustazione e in servizio.',
      'Italian wine is a plurality of systems. The programme method groups them through useful axes: Piedmont of Nebbiolo, Tuscany of Sangiovese, the North-East of precise whites, and the Mediterranean South and islands.\n\nThis does not reduce complexity; it makes it readable. A candidate who can order geography will answer better on grapes, soils and pairing.\n\nThe lesson offers a mental map for tasting and service.',
      'Le vin italien est une pluralite de systemes. La methode du parcours propose de les regrouper selon des axes utiles: Piemont du Nebbiolo, Toscane du Sangiovese, Nord-Est des blancs precis, Sud mediterraneen et insulaire.\n\nCela ne reduit pas la complexite, cela la rend lisible. Un candidat qui ordonne bien la geographie repond mieux aussi sur les cepages, les sols et les accords.\n\nLa lecon offre une carte mentale pour la degustation et le service.',
      'Итальянское вино это множество систем. Метод программы предлагает группировать их по полезным осям: Пьемонт Неббиоло, Тоскана Санджовезе, северо-восток точных белых, юг и острова Средиземноморья.\n\nЭто не упрощает чрезмерно, а делает сложность читаемой. Кандидат, который хорошо выстраивает географию, лучше отвечает и на вопросы о сортах, почвах и сочетаниях.\n\nУрок предлагает ментальную карту для дегустации и сервиса.'
    ),
    makeLesson('ais_advanced_cellar', 'level3',
      'Annate, cantina e decisione di servizio', 'Vintages, Cellar and Service Decisions', 'Millesimes, cave et decision de service', 'Винтаж, погреб и решение по сервису',
      'Nel livello avanzato la tecnica si misura con il tempo: capire quando aprire, aspettare, decantare o non toccare.', 'At advanced level, technique is measured against time: when to open, wait, decant or leave untouched.', 'Au niveau avance, la technique se mesure au temps: ouvrir, attendre, carafer ou ne pas toucher.', 'На продвинутом уровне техника проверяется временем: когда открыть, ждать, декантировать или не трогать.',
      'L eta del vino non basta. Serve leggere la stagione, il produttore, il formato e la conservazione. Un grande vino giovane puo avere bisogno di aria, ma anche un vino vecchio puo chiedere energia se la bottiglia e stata custodita bene.\n\nQuesta lezione unisce degustazione e servizio. Il sommelier non interpreta solo il vino in astratto: prende una decisione concreta per quel tavolo, in quel momento.\n\nIl valore professionale sta nel saper spiegare una scelta senza trasformarla in dogma.',
      'Age alone is not enough. One must read the season, producer, bottle format and storage. A great young wine may need air, yet an old wine can still require energy if the bottle has been well kept.\n\nThis lesson brings tasting and service together. The sommelier does not interpret wine in the abstract: the sommelier makes a concrete decision for that table, at that time.\n\nProfessional value lies in explaining a choice without turning it into dogma.',
      'L age du vin ne suffit pas. Il faut lire le millesime, le producteur, le format et la conservation. Un grand vin jeune peut demander de l air, mais un vin age peut encore avoir besoin d energie si la bouteille a ete bien gardee.\n\nCette lecon unit degustation et service. Le sommelier n interprete pas seulement le vin en theorie: il prend une decision concrete pour cette table, a cet instant.\n\nLa vraie valeur professionnelle reside dans la capacite d expliquer une decision sans la transformer en dogme.',
      'Одного возраста вина недостаточно. Нужно учитывать сезон, производителя, формат бутылки и хранение. Великое молодое вино может нуждаться в воздухе, но и зрелое вино может требовать энергии, если бутылка хорошо сохранялась.\n\nЭтот урок соединяет дегустацию и сервис. Сомелье интерпретирует не абстрактное вино, а принимает конкретное решение для конкретного стола в конкретный момент.\n\nПрофессиональная ценность состоит в умении объяснить решение, не превращая его в догму.'
    )
  ];

  var wineCatalog = [
    { id: 'wine_001', name: 'Pipeño "Cacique" — Cacique Maravilla', country: 'Cile', region: 'Itata', style: 'Rosso tradizionale', grapes: 'Pais', note: 'Rustico e vivo: frutto diretto, poca estrazione e un anima contadina.' },
    { id: 'wine_002', name: 'Cinsault da vecchie vigne (artigianale)', country: 'Cile', region: 'Itata', style: 'Rosso leggero', grapes: 'Cinsault', note: 'Tannino fine e sorso agile: il Cile piu sottile, lontano dal legno.' },
    { id: 'wine_003', name: 'Carignan "VIGNO style"', country: 'Cile', region: 'Maule', style: 'Rosso strutturato', grapes: 'Carignan', note: 'Densita e acidita: un rosso serio che nasce da vigne antiche e suoli poveri.' },
    { id: 'wine_004', name: 'Sauvignon Blanc di costa', country: 'Cile', region: 'Leyda / San Antonio', style: 'Bianco teso', grapes: 'Sauvignon Blanc', note: 'Sale e agrume: la costa pacifica spinge freschezza e dettaglio.' },
    { id: 'wine_005', name: 'Semillon da vigne vecchie', country: 'Cile', region: 'Maule', style: 'Bianco storico', grapes: 'Semillon', note: 'Cera e agrume: un vitigno spesso dimenticato, perfetto per un bianco profondo.' },

    { id: 'wine_006', name: 'Chateau Musar (stile Bekaa)', country: 'Libano', region: 'Valle della Bekaa', style: 'Rosso iconico', grapes: 'Blend bordolese e mediterraneo', note: 'Evoluzione e spezie: un classico non convenzionale, spesso sorprendente a tavola.' },
    { id: 'wine_007', name: 'Obaideh (bianco locale)', country: 'Libano', region: 'Valle della Bekaa', style: 'Bianco da uve autoctone', grapes: 'Obaideh', note: 'Erbe secche e frutta gialla: identita locale e struttura, senza eccessi.' },
    { id: 'wine_008', name: 'Merwah (bianco di montagna)', country: 'Libano', region: 'Monte Libano', style: 'Bianco sapido', grapes: 'Merwah', note: 'Freschezza in quota: un bianco mediterraneo che rimane verticale.' },
    { id: 'wine_009', name: 'Cinsault mediterraneo', country: 'Libano', region: 'Bekaa', style: 'Rosso medio-leggero', grapes: 'Cinsault', note: 'Speziato e floreale: un rosso per chi ama eleganza piu che potenza.' },
    { id: 'wine_010', name: 'Syrah di altitudine', country: 'Libano', region: 'Bekaa', style: 'Rosso intenso', grapes: 'Syrah', note: 'Frutto scuro e pepe: la quota rende il sorso piu pulito e teso.' },

    { id: 'wine_011', name: 'Cabernet Sauvignon (alture)', country: 'Israele', region: 'Golan Heights', style: 'Rosso strutturato', grapes: 'Cabernet Sauvignon', note: 'Altitudine e sole: maturita piena ma con una linea piu fresca del previsto.' },
    { id: 'wine_012', name: 'Carignan mediterraneo', country: 'Israele', region: 'Giudea', style: 'Rosso speziato', grapes: 'Carignan', note: 'Acidita e pepe: un classico del Mediterraneo in versione locale.' },
    { id: 'wine_013', name: 'Gewurztraminer secco', country: 'Israele', region: 'Alta Galilea', style: 'Bianco aromatico', grapes: 'Gewurztraminer', note: 'Aromi netti ma finale asciutto: profumo e disciplina.' },
    { id: 'wine_014', name: 'Grenache (stile mediterraneo)', country: 'Israele', region: 'Negev (zone fresche)', style: 'Rosso succoso', grapes: 'Grenache', note: 'Frutto rosso e spezie: un rosso solare, ma non pesante.' },
    { id: 'wine_015', name: 'Roussanne / Marsanne (blend)', country: 'Israele', region: 'Galilea', style: 'Bianco ampio', grapes: 'Roussanne, Marsanne', note: 'Fiori secchi e frutta matura: un bianco di tavola, ricco ma equilibrato.' },

    { id: 'wine_016', name: 'Saperavi (qvevri o tradizionale)', country: 'Georgia', region: 'Kakheti', style: 'Rosso profondo', grapes: 'Saperavi', note: 'Colore e struttura: tannino vero e frutto scuro, con identita netta.' },
    { id: 'wine_017', name: 'Rkatsiteli (qvevri)', country: 'Georgia', region: 'Kakheti', style: 'Bianco macerato', grapes: 'Rkatsiteli', note: 'Tannino lieve e erbe: un bianco che si beve come un rosso chiaro.' },
    { id: 'wine_018', name: 'Mtsvane (bianco secco)', country: 'Georgia', region: 'Kartli', style: 'Bianco fresco', grapes: 'Mtsvane', note: 'Agrume e mela: un volto piu leggero della Georgia, molto gastronomico.' },
    { id: 'wine_019', name: 'Tsolikouri (bianco)', country: 'Georgia', region: 'Imereti', style: 'Bianco sapido', grapes: 'Tsolikouri', note: 'Sorso asciutto e salino: perfetto con piatti semplici e grigliati.' },
    { id: 'wine_020', name: 'Chinuri (metodo tradizionale)', country: 'Georgia', region: 'Kartli', style: 'Spumante', grapes: 'Chinuri', note: 'Bollicina fine e acidita: alternativa curiosa ai classici europei.' },

    { id: 'wine_021', name: 'Feteasca Neagra', country: 'Moldavia', region: 'Codru', style: 'Rosso medio', grapes: 'Feteasca Neagra', note: 'Prugna e spezia: un autoctono da scoprire, spesso con buon rapporto qualita prezzo.' },
    { id: 'wine_022', name: 'Feteasca Alba', country: 'Moldavia', region: 'Stefan Voda', style: 'Bianco secco', grapes: 'Feteasca Alba', note: 'Fiori e frutta bianca: semplice, pulito, da tavola.' },
    { id: 'wine_023', name: 'Rara Neagra', country: 'Moldavia', region: 'Valul lui Traian', style: 'Rosso leggero', grapes: 'Rara Neagra', note: 'Sottile e succoso: tannino gentile, grande bevibilita.' },
    { id: 'wine_024', name: 'Viorica (aromatico secco)', country: 'Moldavia', region: 'Codru', style: 'Bianco aromatico', grapes: 'Viorica', note: 'Aromi floreali ma finale asciutto: profumo senza dolcezza.' },
    { id: 'wine_025', name: 'Saperavi in Moldavia', country: 'Moldavia', region: 'Sud', style: 'Rosso intenso', grapes: 'Saperavi', note: 'Interpretazione diversa del vitigno: piu morbida, ma sempre scura e tannica.' },

    { id: 'wine_026', name: 'Feteasca Neagra (colline)', country: 'Romania', region: 'Dealu Mare', style: 'Rosso strutturato', grapes: 'Feteasca Neagra', note: 'Frutto scuro e spezie dolci: un rosso moderno con radici locali.' },
    { id: 'wine_027', name: 'Feteasca Alba', country: 'Romania', region: 'Transilvania', style: 'Bianco fresco', grapes: 'Feteasca Alba', note: 'Freschezza naturale e profilo pulito: un bianco di clima piu fresco.' },
    { id: 'wine_028', name: 'Grasa de Cotnari (secco o abboccato)', country: 'Romania', region: 'Cotnari', style: 'Bianco aromatico', grapes: 'Grasa de Cotnari', note: 'Miele e frutta: tradizione dolce, ma spesso anche versioni secche interessanti.' },
    { id: 'wine_029', name: 'Tamaioasa Romaneasca', country: 'Romania', region: 'Moldova', style: 'Bianco aromatico', grapes: 'Tamaioasa Romaneasca', note: 'Uva aromatica: se ben vinificata resta precisa e non stucchevole.' },
    { id: 'wine_030', name: 'Negru de Dragasani', country: 'Romania', region: 'Dragasani', style: 'Rosso speziato', grapes: 'Negru de Dragasani', note: 'Un autoctono raro: frutto e spezie con buon equilibrio.' },

    { id: 'wine_031', name: 'Areni Noir', country: 'Armenia', region: 'Vayots Dzor', style: 'Rosso elegante', grapes: 'Areni', note: 'Altitudine e finezza: un rosso sottile, spesso piu floreale che potente.' },
    { id: 'wine_032', name: 'Voskehat (bianco)', country: 'Armenia', region: 'Aragatsotn', style: 'Bianco strutturato', grapes: 'Voskehat', note: 'Frutta gialla e erbe: un bianco serio, con buona consistenza.' },
    { id: 'wine_033', name: 'Kangun (bianco)', country: 'Armenia', region: 'Ararat', style: 'Bianco secco', grapes: 'Kangun', note: 'Semplice e pulito: ottimo per capire il profilo locale senza filtri.' },
    { id: 'wine_034', name: 'Areni rosato', country: 'Armenia', region: 'Vayots Dzor', style: 'Rosato', grapes: 'Areni', note: 'Sorso leggero e fragrante: un rosato di montagna.' },
    { id: 'wine_035', name: 'Khndoghni / Sireni', country: 'Armenia', region: 'Artsakh', style: 'Rosso intenso', grapes: 'Sireni', note: 'Raro e scuro: un rosso per chi ama profondita e tannino.' },

    { id: 'wine_036', name: 'Kalecik Karasi', country: 'Turchia', region: 'Ankara', style: 'Rosso medio', grapes: 'Kalecik Karasi', note: 'Frutto rosso e spezia: uno dei rossi turchi piu delicati.' },
    { id: 'wine_037', name: 'Okuzgozu', country: 'Turchia', region: 'Elazig', style: 'Rosso fresco', grapes: 'Okuzgozu', note: 'Acidita e frutto: spesso piu slanciato di quanto ci si aspetti.' },
    { id: 'wine_038', name: 'Bogazkere', country: 'Turchia', region: 'Diyarbakir', style: 'Rosso tannico', grapes: 'Bogazkere', note: 'Tannino deciso: un rosso per carni e piatti ricchi.' },
    { id: 'wine_039', name: 'Narince', country: 'Turchia', region: 'Tokat', style: 'Bianco secco', grapes: 'Narince', note: 'Fiori e agrume: bianco mediterraneo con buona freschezza.' },
    { id: 'wine_040', name: 'Emir (bianco di altopiano)', country: 'Turchia', region: 'Cappadocia', style: 'Bianco teso', grapes: 'Emir', note: 'Sapidita e agrume: un bianco raro, spesso molto verticale.' },

    { id: 'wine_041', name: 'Xinomavro', country: 'Grecia', region: 'Naoussa', style: 'Rosso austero', grapes: 'Xinomavro', note: 'Tannino e acidita: un rosso da tempo, per chi ama struttura e profumi complessi.' },
    { id: 'wine_042', name: 'Assyrtiko', country: 'Grecia', region: 'Santorini', style: 'Bianco salino', grapes: 'Assyrtiko', note: 'Sale e limone: uno dei bianchi piu tesi del Mediterraneo.' },
    { id: 'wine_043', name: 'Moschofilero', country: 'Grecia', region: 'Mantinia', style: 'Bianco aromatico secco', grapes: 'Moschofilero', note: 'Fiori e agrume: profumo, ma con finale asciutto e fresco.' },
    { id: 'wine_044', name: 'Agiorgitiko', country: 'Grecia', region: 'Nemea', style: 'Rosso succoso', grapes: 'Agiorgitiko', note: 'Frutto rosso e spezia: un rosso accogliente, facile ma non banale.' },
    { id: 'wine_045', name: 'Vidiano', country: 'Grecia', region: 'Creta', style: 'Bianco mediterraneo', grapes: 'Vidiano', note: 'Frutta gialla e erbe: un bianco cretese che regge bene la tavola.' },

    { id: 'wine_046', name: 'Commandaria', country: 'Cipro', region: 'Colline di Limassol', style: 'Vino dolce storico', grapes: 'Xynisteri, Mavro', note: 'Dattero e spezie: un dolce mediterraneo con storia lunghissima.' },
    { id: 'wine_047', name: 'Xynisteri (secco)', country: 'Cipro', region: 'Pafos', style: 'Bianco secco', grapes: 'Xynisteri', note: 'Sapidita e frutta: un bianco semplice che racconta l isola.' },
    { id: 'wine_048', name: 'Maratheftiko', country: 'Cipro', region: 'Pafos', style: 'Rosso speziato', grapes: 'Maratheftiko', note: 'Autoctono raro: frutto e pepe, spesso molto gastronomico.' },
    { id: 'wine_049', name: 'Yiannoudi', country: 'Cipro', region: 'Troodos', style: 'Rosso medio', grapes: 'Yiannoudi', note: 'Un rosso emergente dell isola: frutto scuro e trama fine.' },
    { id: 'wine_050', name: 'Spumante da Xynisteri', country: 'Cipro', region: 'Troodos', style: 'Spumante', grapes: 'Xynisteri', note: 'Bollicina mediterranea: acidita e frutto sobrio.' },

    { id: 'wine_051', name: 'Rebula / Ribolla Gialla', country: 'Slovenia', region: 'Goriska Brda', style: 'Bianco secco', grapes: 'Rebula', note: 'Sapidita e agrume: un bianco adatto a tutto pasto.' },
    { id: 'wine_052', name: 'Rebula macerata', country: 'Slovenia', region: 'Brda', style: 'Bianco macerato', grapes: 'Rebula', note: 'Tannino leggero e erbe: un orange wine di grande personalita.' },
    { id: 'wine_053', name: 'Teran', country: 'Slovenia', region: 'Carso', style: 'Rosso acido', grapes: 'Refosk', note: 'Acidita spinta e ferro: un rosso unico, spesso sorprendente con piatti grassi.' },
    { id: 'wine_054', name: 'Pinela', country: 'Slovenia', region: 'Vipava', style: 'Bianco secco', grapes: 'Pinela', note: 'Delicato e fresco: un bianco raro, ottimo come aperitivo.' },
    { id: 'wine_055', name: 'Zelen', country: 'Slovenia', region: 'Vipava', style: 'Bianco secco', grapes: 'Zelen', note: 'Erbe e agrume: un autoctono poco noto, molto pulito.' },

    { id: 'wine_056', name: 'Plavac Mali', country: 'Croazia', region: 'Dalmazia', style: 'Rosso mediterraneo', grapes: 'Plavac Mali', note: 'Sole e frutto: un rosso intenso, ideale con griglia e spezie.' },
    { id: 'wine_057', name: 'Posip', country: 'Croazia', region: 'Korcula', style: 'Bianco mediterraneo', grapes: 'Posip', note: 'Frutta gialla e sale: bianco di mare con buona struttura.' },
    { id: 'wine_058', name: 'Grasevina', country: 'Croazia', region: 'Slavonia', style: 'Bianco secco', grapes: 'Grasevina', note: 'Semplice e versatile: perfetto per una cucina leggera.' },
    { id: 'wine_059', name: 'Teran (Istria)', country: 'Croazia', region: 'Istria', style: 'Rosso fresco', grapes: 'Teran', note: 'Acidita e frutto: un rosso agile da abbinamenti moderni.' },
    { id: 'wine_060', name: 'Malvazija Istarska', country: 'Croazia', region: 'Istria', style: 'Bianco secco', grapes: 'Malvazija', note: 'Agrume e fiori: bianco adriatico, spesso molto gastronomico.' },

    { id: 'wine_061', name: 'Furmint secco', country: 'Ungheria', region: 'Tokaj', style: 'Bianco teso', grapes: 'Furmint', note: 'Acidita e pietra: Tokaj non e solo dolce, anche secco e precisissimo.' },
    { id: 'wine_062', name: 'Harslevelu', country: 'Ungheria', region: 'Tokaj', style: 'Bianco secco', grapes: 'Harslevelu', note: 'Fiori e frutta: piu morbido del Furmint, ma con buona energia.' },
    { id: 'wine_063', name: 'Kadarka', country: 'Ungheria', region: 'Szekszard', style: 'Rosso leggero', grapes: 'Kadarka', note: 'Speziato e sottile: grande alternativa per chi ama rossi leggeri.' },
    { id: 'wine_064', name: 'Kekfrankos', country: 'Ungheria', region: 'Sopron', style: 'Rosso medio', grapes: 'Kekfrankos', note: 'Frutto e pepe: un rosso centro-europeo molto moderno.' },
    { id: 'wine_065', name: 'Aszu (dolce)', country: 'Ungheria', region: 'Tokaj', style: 'Vino dolce', grapes: 'Furmint, Harslevelu', note: 'Zafferano e albicocca: dolcezza sostenuta da acidita, grande longevita.' },

    { id: 'wine_066', name: 'Blaufrankisch', country: 'Austria', region: 'Burgenland', style: 'Rosso speziato', grapes: 'Blaufrankisch', note: 'Acidita e pepe: un rosso elegante, spesso con grande bevibilita.' },
    { id: 'wine_067', name: 'Gruner Veltliner', country: 'Austria', region: 'Wachau', style: 'Bianco secco', grapes: 'Gruner Veltliner', note: 'Pepe bianco e lime: un bianco preciso, perfetto a tavola.' },
    { id: 'wine_068', name: 'Gemischter Satz', country: 'Austria', region: 'Vienna', style: 'Bianco da campo', grapes: 'Field blend', note: 'Miscela di vigne: un bianco storico, oggi molto attuale per freschezza.' },
    { id: 'wine_069', name: 'Zweigelt', country: 'Austria', region: 'Burgenland', style: 'Rosso fruttato', grapes: 'Zweigelt', note: 'Ciliegia e pepe: rosso quotidiano, pulito e affidabile.' },
    { id: 'wine_070', name: 'Riesling secco', country: 'Austria', region: 'Kamptal', style: 'Bianco teso', grapes: 'Riesling', note: 'Agrume e pietra: un Riesling asciutto, nitido e gastronomico.' },

    { id: 'wine_071', name: 'Riesling trocken', country: 'Germania', region: 'Mosel', style: 'Bianco secco', grapes: 'Riesling', note: 'Acidita e agrume: anche in versione secca resta un bianco di precisione.' },
    { id: 'wine_072', name: 'Spatburgunder', country: 'Germania', region: 'Baden', style: 'Rosso elegante', grapes: 'Pinot Noir', note: 'Pinot di clima fresco: profumo e leggerezza senza fragilita.' },
    { id: 'wine_073', name: 'Silvaner', country: 'Germania', region: 'Franconia', style: 'Bianco secco', grapes: 'Silvaner', note: 'Semplice e serio: bianco gastronomico, spesso sottovalutato.' },
    { id: 'wine_074', name: 'Riesling feinherb', country: 'Germania', region: 'Nahe', style: 'Bianco semi-secco', grapes: 'Riesling', note: 'Un filo di zucchero per bilanciare: perfetto su spezie e piccante.' },
    { id: 'wine_075', name: 'Scheurebe secca', country: 'Germania', region: 'Pfalz', style: 'Bianco aromatico', grapes: 'Scheurebe', note: 'Ribes e agrume: aromaticita netta, ma senza dolcezza.' },

    { id: 'wine_076', name: 'Savagnin (ouillé)', country: 'Francia', region: 'Jura', style: 'Bianco strutturato', grapes: 'Savagnin', note: 'Noci e agrume: il Jura senza velo, ricco ma preciso.' },
    { id: 'wine_077', name: 'Trousseau', country: 'Francia', region: 'Jura', style: 'Rosso leggero', grapes: 'Trousseau', note: 'Fragola e spezia: rosso fine, perfetto per chi ama il sorso.' },
    { id: 'wine_078', name: 'Poulsard', country: 'Francia', region: 'Jura', style: 'Rosso chiarissimo', grapes: 'Poulsard', note: 'Quasi trasparente, ma gustoso: un rosso di grande delicatezza.' },
    { id: 'wine_079', name: 'Pinot Gris (secco)', country: 'Francia', region: 'Alsazia', style: 'Bianco ricco', grapes: 'Pinot Gris', note: 'Frutta gialla e spezie: secco e pieno, da piatti saporiti.' },
    { id: 'wine_080', name: 'Sylvaner', country: 'Francia', region: 'Alsazia', style: 'Bianco secco', grapes: 'Sylvaner', note: 'Sottile e fresco: un bianco che cresce con la cucina.' },

    { id: 'wine_081', name: 'Bobal', country: 'Spagna', region: 'Utiel-Requena', style: 'Rosso succoso', grapes: 'Bobal', note: 'Frutto e acidita: un rosso spagnolo meno scontato, spesso ottimo valore.' },
    { id: 'wine_082', name: 'Treixadura (blend)', country: 'Spagna', region: 'Ribeiro', style: 'Bianco secco', grapes: 'Treixadura', note: 'Fiori e agrume: bianco atlantico, più sottile dell Albariño classico.' },
    { id: 'wine_083', name: 'Godello', country: 'Spagna', region: 'Valdeorras', style: 'Bianco strutturato', grapes: 'Godello', note: 'Pietra e frutta: un bianco serio, con buona profondita.' },
    { id: 'wine_084', name: 'Mencia', country: 'Spagna', region: 'Bierzo', style: 'Rosso elegante', grapes: 'Mencia', note: 'Floreale e minerale: un rosso moderno, fine e profumato.' },
    { id: 'wine_085', name: 'Listan Negro', country: 'Spagna', region: 'Canarie', style: 'Rosso vulcanico', grapes: 'Listan Negro', note: 'Vulcano e sale: un rosso leggero, ma pieno di carattere.' },

    { id: 'wine_086', name: 'Baga', country: 'Portogallo', region: 'Bairrada', style: 'Rosso tannico', grapes: 'Baga', note: 'Tannino e acidita: rosso serio e longevo, spesso sottovalutato.' },
    { id: 'wine_087', name: 'Encruzado', country: 'Portogallo', region: 'Dao', style: 'Bianco strutturato', grapes: 'Encruzado', note: 'Fiori e pietra: un bianco portoghese molto completo.' },
    { id: 'wine_088', name: 'Touriga Nacional (rosso secco)', country: 'Portogallo', region: 'Douro', style: 'Rosso intenso', grapes: 'Touriga Nacional', note: 'Viola e spezie: grande profumo e struttura, anche fuori dal Porto.' },
    { id: 'wine_089', name: 'Alvarinho', country: 'Portogallo', region: 'Vinho Verde', style: 'Bianco secco', grapes: 'Alvarinho', note: 'Agrume e sale: fresco e preciso, perfetto per pesce.' },
    { id: 'wine_090', name: 'Bical', country: 'Portogallo', region: 'Bairrada', style: 'Bianco secco', grapes: 'Bical', note: 'Freschezza e corpo: un bianco meno noto ma molto utile a tavola.' },

    { id: 'wine_091', name: 'Nerello Mascalese', country: 'Italia', region: 'Etna', style: 'Rosso di vulcano', grapes: 'Nerello Mascalese', note: 'Finezza e sale: un rosso che unisce tannino leggero e energia minerale.' },
    { id: 'wine_092', name: 'Carricante', country: 'Italia', region: 'Etna', style: 'Bianco teso', grapes: 'Carricante', note: 'Agrume e pietra: un bianco di quota, molto lineare.' },
    { id: 'wine_093', name: 'Timorasso', country: 'Italia', region: 'Colli Tortonesi', style: 'Bianco strutturato', grapes: 'Timorasso', note: 'Corpo e acidita: bianco italiano che regge bene anche il tempo.' },
    { id: 'wine_094', name: 'Pecorino (secco)', country: 'Italia', region: 'Abruzzo / Marche', style: 'Bianco sapido', grapes: 'Pecorino', note: 'Agrume e erbe: bianco moderno, molto gastronomico.' },
    { id: 'wine_095', name: 'Aglianico (alto profilo)', country: 'Italia', region: 'Vulture', style: 'Rosso strutturato', grapes: 'Aglianico', note: 'Tannino e profondita: un rosso da attendere, ma molto completo.' },

    { id: 'wine_096', name: 'Kadarka (Vojvodina style)', country: 'Serbia', region: 'Fruška Gora', style: 'Rosso leggero', grapes: 'Kadarka', note: 'Spezie e frutto: un rosso sottile in un area poco conosciuta.' },
    { id: 'wine_097', name: 'Prokupac', country: 'Serbia', region: 'Zupa', style: 'Rosso medio', grapes: 'Prokupac', note: 'Autoctono serbo: frutto e acidita, con profilo originale.' },
    { id: 'wine_098', name: 'Tamjanika (secco)', country: 'Serbia', region: 'Zupa', style: 'Bianco aromatico', grapes: 'Tamjanika', note: 'Profumo intenso ma secco: un aromatico che resta pulito.' },
    { id: 'wine_099', name: 'Vranac', country: 'Montenegro', region: 'Skadar', style: 'Rosso intenso', grapes: 'Vranac', note: 'Scuro e speziato: un rosso balcanico potente, ottimo con carne.' },
    { id: 'wine_100', name: 'Plavina', country: 'Croazia', region: 'Dalmazia', style: 'Rosso leggero', grapes: 'Plavina', note: 'Frutto e sale: un rosso semplice ma identitario.' },

    { id: 'wine_101', name: 'Crljenak / Zinfandel locale', country: 'Croazia', region: 'Dalmazia', style: 'Rosso alcolico', grapes: 'Crljenak', note: 'Concentrazione e frutto: la radice adriatica di un vitigno famoso.' },
    { id: 'wine_102', name: 'Mavrud', country: 'Bulgaria', region: 'Tracia', style: 'Rosso tannico', grapes: 'Mavrud', note: 'Tannino vero e frutto scuro: un rosso bulgaro di carattere.' },
    { id: 'wine_103', name: 'Melnik (Shiroka Melnishka Loza)', country: 'Bulgaria', region: 'Struma Valley', style: 'Rosso speziato', grapes: 'Melnik', note: 'Spezie e frutto: raro e interessante, spesso molto gastronomico.' },
    { id: 'wine_104', name: 'Pamid', country: 'Bulgaria', region: 'Danubio', style: 'Rosso leggero', grapes: 'Pamid', note: 'Vino semplice e fresco: un rosso quotidiano, da bere giovane.' },
    { id: 'wine_105', name: 'Misket (bianco aromatico)', country: 'Bulgaria', region: 'Tracia', style: 'Bianco aromatico secco', grapes: 'Misket', note: 'Aromi delicati e finale asciutto: alternativa ai classici aromatici.' },

    { id: 'wine_106', name: 'Tannat', country: 'Uruguay', region: 'Canelones', style: 'Rosso strutturato', grapes: 'Tannat', note: 'Tannino e frutto: Uruguay ha fatto del Tannat una specialita riconoscibile.' },
    { id: 'wine_107', name: 'Albariño (Atlantico sud)', country: 'Uruguay', region: 'Maldonado', style: 'Bianco secco', grapes: 'Albariño', note: 'Sale e agrume: un volto atlantico, fresco e preciso.' },
    { id: 'wine_108', name: 'Petit Manseng (secco)', country: 'Uruguay', region: 'Canelones', style: 'Bianco strutturato', grapes: 'Petit Manseng', note: 'Frutta e acidita: bianco con corpo, ma finale teso.' },
    { id: 'wine_109', name: 'Marselan', country: 'Uruguay', region: 'Canelones', style: 'Rosso moderno', grapes: 'Marselan', note: 'Frutto scuro e tannino morbido: un rosso contemporaneo e pulito.' },
    { id: 'wine_110', name: 'Tannat rosato', country: 'Uruguay', region: 'Atlantico', style: 'Rosato', grapes: 'Tannat', note: 'Struttura ma freschezza: un rosato diverso dal solito.' },

    { id: 'wine_111', name: 'Chenin Blanc (old vines)', country: 'Sudafrica', region: 'Swartland', style: 'Bianco secco', grapes: 'Chenin Blanc', note: 'Cera e frutto: un bianco serio, spesso da vigne vecchie.' },
    { id: 'wine_112', name: 'Cinsault', country: 'Sudafrica', region: 'Western Cape', style: 'Rosso leggero', grapes: 'Cinsault', note: 'Bevibilita e frutto: rosso agile, perfetto leggermente fresco.' },
    { id: 'wine_113', name: 'Pinotage (interpretazione moderna)', country: 'Sudafrica', region: 'Stellenbosch', style: 'Rosso', grapes: 'Pinotage', note: 'Quando e pulito: frutto scuro e spezie, senza eccessi.' },
    { id: 'wine_114', name: 'Grenache (Cape)', country: 'Sudafrica', region: 'Swartland', style: 'Rosso succoso', grapes: 'Grenache', note: 'Sole e freschezza: un rosso mediterraneo con passo moderno.' },
    { id: 'wine_115', name: 'Semillon (Cape)', country: 'Sudafrica', region: 'Franschhoek', style: 'Bianco strutturato', grapes: 'Semillon', note: 'Cera e agrume: bianco profondo, spesso adatto a piatti ricchi.' },

    { id: 'wine_116', name: 'Koshu', country: 'Giappone', region: 'Yamanashi', style: 'Bianco leggero', grapes: 'Koshu', note: 'Delicato e preciso: ideale su cucina fine e sapori umami.' },
    { id: 'wine_117', name: 'Muscat Bailey A', country: 'Giappone', region: 'Yamanashi', style: 'Rosso leggero', grapes: 'Muscat Bailey A', note: 'Frutto e leggerezza: rosso semplice, spesso servito fresco.' },
    { id: 'wine_118', name: 'Delaware (secco)', country: 'Giappone', region: 'Osaka', style: 'Bianco aromatico', grapes: 'Delaware', note: 'Uva poco comune: profumo delicato e finale asciutto.' },
    { id: 'wine_119', name: 'Koshu sur lie', country: 'Giappone', region: 'Yamanashi', style: 'Bianco secco', grapes: 'Koshu', note: 'Più corpo: lavoro sulle fecce per dare profondita senza perdere finezza.' },
    { id: 'wine_120', name: 'Merlot (zona fresca)', country: 'Giappone', region: 'Nagano', style: 'Rosso elegante', grapes: 'Merlot', note: 'Clima piu fresco: profilo piu sobrio e lineare.' },

    { id: 'wine_121', name: 'Carmenere', country: 'Cile', region: 'Colchagua', style: 'Rosso morbido', grapes: 'Carmenere', note: 'Erbe e frutto scuro: un classico cileno, ma ben fatto resta equilibrato.' },
    { id: 'wine_122', name: 'Pinot Noir (zona fresca)', country: 'Cile', region: 'Casablanca', style: 'Rosso elegante', grapes: 'Pinot Noir', note: 'Fragola e spezie: la costa rende il Pinot piu fine e leggero.' },
    { id: 'wine_123', name: 'Malbec di altura', country: 'Argentina', region: 'Valle de Uco', style: 'Rosso intenso', grapes: 'Malbec', note: 'Altitudine e freschezza: frutto pieno ma finale piu teso.' },
    { id: 'wine_124', name: 'Torrontes secco', country: 'Argentina', region: 'Salta', style: 'Bianco aromatico secco', grapes: 'Torrontes', note: 'Profumo intenso, ma secco: se ben fatto e molto gastronomico.' },
    { id: 'wine_125', name: 'Criolla (interpretazione leggera)', country: 'Argentina', region: 'Mendoza', style: 'Rosso leggero', grapes: 'Criolla', note: 'Un ritorno alle uve storiche: frutto chiaro e grande bevibilita.' },

    { id: 'wine_126', name: 'Mencia (alta quota)', country: 'Spagna', region: 'Ribeira Sacra', style: 'Rosso elegante', grapes: 'Mencia', note: 'Pendenza e freschezza: un rosso fine, con nervo e profumo.' },
    { id: 'wine_127', name: 'Aligoté', country: 'Francia', region: 'Bourgogne', style: 'Bianco secco', grapes: 'Aligote', note: 'Agrume e sale: il bianco alternativo di Borgogna, se ben fatto e brillante.' },
    { id: 'wine_128', name: 'Assyrtiko (continentale)', country: 'Grecia', region: 'Drama', style: 'Bianco teso', grapes: 'Assyrtiko', note: 'Versione diversa di un classico: piu frutto, ma sempre molta energia.' },
    { id: 'wine_129', name: 'Schiava', country: 'Italia', region: 'Alto Adige', style: 'Rosso leggero', grapes: 'Schiava', note: 'Frutto e leggerezza: un rosso da bere fresco, perfetto con salumi.' },
    { id: 'wine_130', name: 'Verdicchio (classico)', country: 'Italia', region: 'Castelli di Jesi', style: 'Bianco secco', grapes: 'Verdicchio', note: 'Mandorla e sale: bianco versatile, spesso sorprendente con il tempo.' },

    { id: 'wine_131', name: 'Saperavi (qvevri) - selezione', country: 'Georgia', region: 'Kakheti', style: 'Rosso profondo', grapes: 'Saperavi', note: 'Una lettura tradizionale: tannino e frutto con un profilo piu terroso.' },
    { id: 'wine_132', name: 'Rkatsiteli (secco)', country: 'Georgia', region: 'Kartli', style: 'Bianco secco', grapes: 'Rkatsiteli', note: 'Più lineare: agrume e erbe con finale asciutto.' },
    { id: 'wine_133', name: 'Feteasca Regala', country: 'Romania', region: 'Transilvania', style: 'Bianco secco', grapes: 'Feteasca Regala', note: 'Freschezza e fiori: un bianco semplice ma ben riconoscibile.' },
    { id: 'wine_134', name: 'Rara Neagra (secco)', country: 'Moldavia', region: 'Sud', style: 'Rosso leggero', grapes: 'Rara Neagra', note: 'Bevibilita e frutto: un rosso quotidiano, molto utile a tavola.' },
    { id: 'wine_135', name: 'Areni (secco)', country: 'Armenia', region: 'Vayots Dzor', style: 'Rosso elegante', grapes: 'Areni', note: 'Un rosso di montagna: profumi fini e sorso scorrevole.' },

    { id: 'wine_136', name: 'Field blend di montagna', country: 'Portogallo', region: 'Douro', style: 'Rosso', grapes: 'Vigne miste', note: 'Vecchie vigne e complessita: un rosso che unisce molte uve in un solo sorso.' },
    { id: 'wine_137', name: 'Listan Blanco', country: 'Spagna', region: 'Canarie', style: 'Bianco vulcanico', grapes: 'Listan Blanco', note: 'Vulcano e sale: bianco salino, molto diretto e originale.' },
    { id: 'wine_138', name: 'Chenin Blanc (coastal)', country: 'Sudafrica', region: 'Walker Bay', style: 'Bianco secco', grapes: 'Chenin Blanc', note: 'Influenza marina: profilo piu fresco e teso.' },
    { id: 'wine_139', name: 'Tannat (Atlantico)', country: 'Uruguay', region: 'Maldonado', style: 'Rosso strutturato', grapes: 'Tannat', note: 'Più freschezza: il mare aiuta a contenere potenza e calore.' },
    { id: 'wine_140', name: 'Koshu (selezione), Giappone', country: 'Giappone', region: 'Yamanashi', style: 'Bianco leggero', grapes: 'Koshu', note: 'Finezza assoluta: un bianco da abbinamenti delicati e puliti.' }
  ];

  var cellarCatalog = [
    { id: 'cellar_001', name: 'Cacique Maravilla', country: 'Cile', region: 'Valle del Itata', style: 'Cantina artigianale', grapes: 'Pipeño, Pais, Cinsault', note: 'Vecchie vigne, fermentazioni essenziali e un profilo diretto: racconta il Cile rurale piu vivo.' },
    { id: 'cellar_002', name: 'Chateau Musar', country: 'Libano', region: 'Valle della Bekaa', style: 'Cantina iconica mediterranea', grapes: 'Musar Rouge, Obaideh, Merwah', note: 'Una casa storica che unisce tempo, altitudine e un carattere fuori dagli schemi.' },
    { id: 'cellar_003', name: 'Domaine du Castel', country: 'Israele', region: 'Judean Hills', style: 'Cantina di collina', grapes: 'Cabernet Sauvignon, Chardonnay', note: 'Precisione bordolese riletta in un paesaggio luminoso e collinare.' },
    { id: 'cellar_004', name: 'Pheasant\'s Tears', country: 'Georgia', region: 'Kakheti', style: 'Qvevri e vitigni autoctoni', grapes: 'Saperavi, Rkatsiteli', note: 'Una delle firme che rende leggibile la Georgia del qvevri senza folklore superficiale.' },
    { id: 'cellar_005', name: 'Purcari', country: 'Moldavia', region: 'Stefan Voda', style: 'Cantina storica di confine', grapes: 'Feteasca Neagra, Negru de Purcari', note: 'Mette insieme tradizione moldava e lettura moderna del vino da invecchiamento.' },
    { id: 'cellar_006', name: 'Prince Stirbey', country: 'Romania', region: 'Dragasani', style: 'Cantina di territorio', grapes: 'Cramposie, Feteasca Neagra, Novac', note: 'Un riferimento per capire la Romania attraverso autoctoni, misura e profondita.' },
    { id: 'cellar_007', name: 'Zorah', country: 'Armenia', region: 'Vayots Dzor', style: 'Cantina di altitudine', grapes: 'Areni, Voskehat', note: 'Fra rocce, quota e vigne antiche, offre un volto serio e contemporaneo dell Armenia.' },
    { id: 'cellar_008', name: 'Kavaklidere', country: 'Turchia', region: 'Ankara e Cappadocia', style: 'Pioniera moderna', grapes: 'Kalecik Karasi, Emir', note: 'Una chiave utile per leggere la Turchia del vino tra tradizione locale e linguaggio internazionale.' },
    { id: 'cellar_009', name: 'Estate Argyros', country: 'Grecia', region: 'Santorini', style: 'Cantina insulare', grapes: 'Assyrtiko, Vinsanto', note: 'Vento, sale e vigne basse: una cantina che fa capire perche Santorini e unica.' },
    { id: 'cellar_010', name: 'Royal Tokaji', country: 'Ungheria', region: 'Tokaj', style: 'Cantina di precisione', grapes: 'Furmint, Harslevelu, Aszu', note: 'Botrytis, acidita e cantina: Tokaj qui si legge con ordine e nitidezza.' },
    { id: 'cellar_011', name: 'Sadie Family Wines', country: 'Sudafrica', region: 'Swartland', style: 'Vecchie vigne del Capo', grapes: 'Chenin Blanc, Grenache, Cinsault', note: 'Vecchie parcelle, luce forte e stile sobrio: il Capo piu serio e piu libero.' },
    { id: 'cellar_012', name: 'Grace Wine', country: 'Giappone', region: 'Yamanashi', style: 'Precisione giapponese', grapes: 'Koshu', note: 'Una casa chiave per capire finezza, pulizia e misura nel vino giapponese.' },
    { id: 'cellar_013', name: 'Bodega Garzon', country: 'Uruguay', region: 'Maldonado', style: 'Cantina atlantica', grapes: 'Tannat, Albarino', note: 'Vento oceanico e granito aiutano a leggere l Uruguay oltre la sola potenza del Tannat.' },
    { id: 'cellar_014', name: 'Suertes del Marques', country: 'Spagna', region: 'Tenerife', style: 'Vigne vulcaniche', grapes: 'Listan Negro, Listan Blanco', note: 'Lava, quota e Atlantico: una cantina che spiega il carattere delle Canarie.' },
    { id: 'cellar_015', name: 'Domaine Tissot', country: 'Francia', region: 'Jura', style: 'Cantina di artigianato fine', grapes: 'Savagnin, Trousseau, Poulsard', note: 'Per capire il Jura moderno serve una casa capace di tenere insieme materia, sale e dettaglio.' },
    { id: 'cellar_016', name: 'Nikolaihof', country: 'Austria', region: 'Wachau', style: 'Cantina storica biodinamica', grapes: 'Gruner Veltliner, Riesling', note: 'Una lettura austera e luminosa della Wachau, dove la cantina lavora per sottrazione.' },
    { id: 'cellar_017', name: 'J.J. Prum', country: 'Germania', region: 'Mosel', style: 'Cantina di pendenza', grapes: 'Riesling', note: 'Piu che una cantina di marca, e una lezione di finezza, zucchero e acidita in equilibrio.' },
    { id: 'cellar_018', name: 'Movia', country: 'Slovenia', region: 'Brda', style: 'Cantina di confine', grapes: 'Rebula, Pinot Grigio', note: 'Una firma utile per leggere il dialogo tra Brda, Collio e macerazioni contemporanee.' },
    { id: 'cellar_019', name: 'Bibich', country: 'Croazia', region: 'Dalmazia', style: 'Dalmazia contemporanea', grapes: 'Debit, Plavina, Babic', note: 'Mare, pietra e cucina adriatica: qui la Croazia del vino prende una forma molto chiara.' },
    { id: 'cellar_020', name: 'Benanti', country: 'Italia', region: 'Etna', style: 'Cantina di vulcano', grapes: 'Carricante, Nerello Mascalese', note: 'Serve per leggere l Etna con disciplina: meno mito, piu suolo, quota e contrasto.' },
    { id: 'cellar_021', name: 'Niepoort', country: 'Portogallo', region: 'Douro e Bairrada', style: 'Cantina storica e inquieta', grapes: 'Field blend, Baga, Rabigato', note: 'Una casa che collega tradizione e sperimentazione senza perdere leggibilita territoriale.' }
  ];

  function makeLesson(id, level, itTitle, enTitle, frTitle, ruTitle, itIntro, enIntro, frIntro, ruIntro, itBody, enBody, frBody, ruBody) {
    return {
      id: id,
      level: level,
      it: { title: itTitle, intro: itIntro, body: itBody },
      en: { title: enTitle, intro: enIntro, body: enBody },
      fr: { title: frTitle, intro: frIntro, body: frBody },
      ru: { title: ruTitle, intro: ruIntro, body: ruBody }
    };
  }

  function getSavedLang() {
    try {
      var l = (window.getLang && window.getLang()) || localStorage.getItem('sw_lang') || 'it';
      return ui[l] ? l : 'it';
    } catch(e) {
      return 'it';
    }
  }

  function t(key) {
    return (ui[state.lang] && ui[state.lang][key]) || (ui.it && ui.it[key]) || key;
  }

  function injectStyles() {
    if (document.getElementById('sw-home-v2-style')) return;
    var style = document.createElement('style');
    style.id = 'sw-home-v2-style';
    style.textContent = [
      ':root{--bg-color:#0a0602;--accent-color:#d4af37;--home-panel:rgba(255,255,255,0.02);--home-border:rgba(212,175,55,0.2);--home-text:#f5efe2;--home-muted:rgba(245,239,226,0.68);--home-soft:rgba(212,175,55,0.08);}',
      '#page-home.sw-home-v2,#homeBlock_news.sw-home-v2{background:radial-gradient(circle at top, rgba(212,175,55,0.06), transparent 34%),var(--bg-color);padding:24px 16px 118px;color:var(--home-text);font-family:"Cormorant Garamond",serif;}',
      '.sw-home-v2-shell{max-width:1200px;margin:0 auto;}',
      '/* NAV ORIGINALE SEMPRE VISIBILE IN ALTO */ ',
      'body.sw-home-v2-bottom-nav-mode .nav-top,body.sw-home-v2-bottom-nav-mode .nav-tabs{display:flex !important;}',
      '.sw-home-v2-header{display:flex;align-items:flex-start;justify-content:flex-end;gap:16px;margin-bottom:12px;padding:4px 0 8px;}',
      '.sw-home-v2-brand{min-width:0;}',
      '.sw-home-v2-tag{font-family:Cinzel,serif;font-size:10px;letter-spacing:0.28em;color:rgba(212,175,55,0.62);text-transform:uppercase;margin-bottom:8px;}',
      '.sw-home-v2-logo{font-family:Cinzel,serif;font-size:clamp(24px,4vw,38px);line-height:1.05;color:var(--accent-color);letter-spacing:0.14em;text-transform:uppercase;}',
      '.sw-home-v2-langbar,.sw-home-v2-overlay-lang{display:flex;gap:14px;flex-wrap:wrap;justify-content:flex-end;align-items:center;}',
      '.sw-home-v2-langbtn{background:transparent;border:0;border-bottom:1px solid transparent;border-radius:0;color:rgba(245,239,226,0.58);padding:4px 0;font-family:Cinzel,serif;font-size:11px;letter-spacing:0.22em;cursor:pointer;transition:all .25s ease;}',
      '.sw-home-v2-langbtn.active,.sw-home-v2-langbtn:hover{color:var(--accent-color);border-color:rgba(212,175,55,0.48);box-shadow:none;background:transparent;}',
      '.sw-home-v2-panel{margin-bottom:28px;background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));border:1px solid var(--home-border);border-radius:10px;padding:22px 20px;box-shadow:0 16px 30px rgba(0,0,0,0.16);}',
      '.sw-home-v2-hero{min-height:220px;display:flex;align-items:flex-end;position:relative;overflow:hidden;background:linear-gradient(180deg, rgba(34,20,10,0.18), rgba(10,6,2,0.75)),radial-gradient(circle at 20% 0%, rgba(212,175,55,0.18), transparent 36%),linear-gradient(135deg, rgba(39,25,18,0.9), rgba(10,6,2,0.94));}',
      '.sw-home-v2-hero:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg, rgba(212,175,55,0.08), transparent 28%, transparent 72%, rgba(212,175,55,0.06));pointer-events:none;}',
      '.sw-home-v2-hero-content{position:relative;z-index:1;max-width:680px;}',
      '.sw-home-v2-hero-title{margin:0 0 12px;font-family:Cinzel,serif;font-size:clamp(34px,5vw,58px);line-height:1.06;color:#f4ead2;letter-spacing:0.08em;text-transform:uppercase;}',
      '.sw-home-v2-hero-sub{margin:0;max-width:560px;color:var(--home-muted);font-size:22px;line-height:1.35;}',
      '.sw-home-v2-block-head{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:16px;}',
      '.sw-home-v2-block-titlewrap{display:flex;align-items:center;gap:12px;}',
      '.sw-home-v2-block-mark{width:11px;height:11px;border:1px solid rgba(212,175,55,0.5);border-radius:2px;flex:0 0 auto;}',
      '.sw-home-v2-block-title{margin:0;font-family:Cinzel,serif;font-size:clamp(20px,2vw,28px);color:var(--accent-color);letter-spacing:0.08em;text-transform:uppercase;}',
      '.sw-home-v2-pill{display:inline-flex;align-items:center;justify-content:center;padding:7px 12px;border-radius:999px;border:1px solid rgba(212,175,55,0.24);background:rgba(212,175,55,0.08);color:rgba(245,239,226,0.82);font-family:Cinzel,serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;}',
      '.sw-home-v2-lead{margin:0 0 18px;color:var(--home-muted);font-size:20px;line-height:1.35;max-width:760px;}',
      '.sw-home-v2-news-stage{padding:18px;border-radius:10px;border:1px solid rgba(212,175,55,0.18);background:linear-gradient(180deg, rgba(212,175,55,0.08), rgba(255,255,255,0.02));}',
      '.sw-home-v2-news-feature{display:flex;flex-direction:column;gap:10px;padding:18px;border-radius:10px;background:rgba(255,255,255,0.035);border:1px solid rgba(212,175,55,0.16);}',
      '.sw-home-v2-news-meta{display:flex;justify-content:space-between;gap:10px;align-items:center;color:rgba(212,175,55,0.72);font-family:Cinzel,serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;}',
      '.sw-home-v2-news-feature h3,.sw-home-v2-article-card h3,.sw-home-v2-lesson-card h3{margin:0;font-family:Cinzel,serif;color:#f4ead2;line-height:1.18;}',
      '.sw-home-v2-news-feature h3{font-size:30px;}',
      '.sw-home-v2-news-feature p,.sw-home-v2-article-card p,.sw-home-v2-lesson-card p,.sw-home-v2-wine-card p{margin:0;color:var(--home-muted);font-size:21px;line-height:1.45;}',
      '.sw-home-v2-news-footer{display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;margin-top:14px;color:rgba(245,239,226,0.56);font-size:17px;}',
      '.sw-home-v2-news-dots{display:flex;align-items:center;gap:8px;}',
      '.sw-home-v2-news-dots span{display:block;width:28px;height:3px;border-radius:99px;background:rgba(245,239,226,0.2);}',
      '.sw-home-v2-news-dots span.active{background:var(--accent-color);}',
      '.sw-home-v2-actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center;}',
      '.sw-home-v2-link,.sw-home-v2-button{display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;border-radius:999px;border:1px solid var(--home-border);font-family:Cinzel,serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent-color);text-decoration:none;background:transparent;cursor:pointer;transition:all .25s ease;}',
      '.sw-home-v2-link:hover,.sw-home-v2-button:hover,.sw-home-v2-globalnav button:hover,.sw-home-v2-article-card:hover,.sw-home-v2-lesson-card:hover,.sw-home-v2-wine-card:hover{transform:translateY(-3px);box-shadow:0 16px 32px rgba(0,0,0,0.22);}',
      '.sw-home-v2-grid{display:grid;grid-template-columns:1fr;gap:16px;}',
      '.sw-home-v2-articles-grid{display:grid;grid-template-columns:1fr;gap:14px;}',
      '.sw-home-v2-article-card,.sw-home-v2-lesson-card{padding:18px;display:flex;flex-direction:column;gap:10px;cursor:pointer;transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid var(--home-border);border-radius:10px;}',
      '.sw-home-v2-article-card h3,.sw-home-v2-lesson-card h3{font-size:24px;}',
      '.sw-home-v2-kicker{font-family:Cinzel,serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(212,175,55,0.72);}',
      '.sw-home-v2-card-media{position:relative;overflow:hidden;border-radius:8px;min-height:170px;background:linear-gradient(135deg, rgba(54,32,17,0.9), rgba(16,10,5,0.96));border:1px solid rgba(212,175,55,0.12);}',
      '.sw-home-v2-card-media img,.sw-home-v2-card-media svg{display:block;width:100%;height:100%;min-height:170px;object-fit:cover;}',
      '.sw-home-v2-card-media.is-fallback{display:flex;align-items:flex-end;}',
      '.sw-home-v2-card-media.is-fallback img{display:none;}',
      '.sw-home-v2-card-media:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.48));pointer-events:none;}',
      '.sw-home-v2-card-badge{position:absolute;left:12px;top:12px;z-index:1;padding:5px 8px;border-radius:999px;border:1px solid rgba(212,175,55,0.22);background:rgba(10,6,2,0.58);font-family:Cinzel,serif;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#f4ead2;}',
      '.sw-home-v2-card-fallback{position:relative;z-index:1;padding:14px;display:flex;flex-direction:column;gap:6px;}',
      '.sw-home-v2-card-fallback strong{font-family:Cinzel,serif;font-size:16px;line-height:1.15;color:#f4ead2;}',
      '.sw-home-v2-card-fallback span{font-size:14px;line-height:1.3;color:rgba(245,239,226,0.8);}',
      '.sw-home-v2-wines-grid{display:grid;grid-template-columns:1fr;gap:14px;}',
      '.sw-home-v2-wine-card{padding:16px;display:flex;flex-direction:column;gap:10px;cursor:pointer;transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(212,175,55,0.18);border-radius:10px;}',
      '.sw-home-v2-wine-card h3{margin:0;font-family:Cinzel,serif;color:#f4ead2;line-height:1.18;font-size:20px;}',
      '.sw-home-v2-wine-meta{display:flex;gap:10px;flex-wrap:wrap;align-items:center;font-family:Cinzel,serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(212,175,55,0.72);}',
      '.sw-home-v2-brief-strip{margin-top:16px;padding:12px 14px;border-radius:10px;border:1px solid rgba(212,175,55,0.16);background:rgba(255,255,255,0.02);display:flex;gap:12px;flex-wrap:wrap;align-items:center;}',
      '.sw-home-v2-brief-strip strong{font-family:Cinzel,serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(212,175,55,0.72);}',
      '.sw-home-v2-brief-text{min-width:0;flex:1 1 420px;color:rgba(245,239,226,0.72);font-size:17px;line-height:1.35;}',
      '.sw-home-v2-note{margin-top:14px;text-align:center;color:rgba(245,239,226,0.5);font-size:17px;}',
      '.sw-home-v2-globalnav{display:none !important;}',
      '#sw-fab-main{display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;}',
      '[id^="sw-fab"]{display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;}',
      '#sw-memory-badge{display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;}',
      '.sw-home-v2-globalnav-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;padding:12px;border:1px solid rgba(212,175,55,0.24);border-radius:14px;background:rgba(10,6,2,0.94);backdrop-filter:blur(10px);box-shadow:0 20px 40px rgba(0,0,0,0.3);}',
      '.sw-home-v2-globalnav button{padding:12px 10px;background:rgba(255,255,255,0.02);border:1px solid rgba(212,175,55,0.14);border-radius:10px;color:var(--accent-color);font-family:Cinzel,serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;transition:transform .3s ease, box-shadow .3s ease, border-color .3s ease;}',
      '.sw-home-v2-globalnav button.active{background:rgba(212,175,55,0.1);border-color:rgba(212,175,55,0.4);color:#f4ead2;}',
      '.sw-home-v2-overlay{position:fixed;inset:0;z-index:9999;background:#0a0602;display:none;overflow:auto;padding:24px 16px 40px;}',
      '.sw-home-v2-overlay.visible{display:block;}',
      '.sw-home-v2-overlay-shell{max-width:960px;margin:0 auto;border:1px solid var(--home-border);border-radius:10px;padding:22px;background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));}',
      '.sw-home-v2-overlay-top{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;}',
      '.sw-home-v2-overlay-kind{font-family:Cinzel,serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(212,175,55,0.72);margin-bottom:10px;}',
      '.sw-home-v2-overlay h2{margin:0 0 12px;font-family:Cinzel,serif;font-size:clamp(28px,4vw,44px);line-height:1.08;color:var(--accent-color);}',
      '.sw-home-v2-overlay-media{margin:0 0 18px;overflow:hidden;border-radius:10px;border:1px solid rgba(212,175,55,0.16);background:linear-gradient(135deg, rgba(54,32,17,0.9), rgba(16,10,5,0.96));}',
      '.sw-home-v2-overlay-media img,.sw-home-v2-overlay-media svg{display:block;width:100%;height:auto;max-height:360px;object-fit:cover;}',
      '.sw-home-v2-overlay-intro{font-size:24px;color:var(--home-text);margin:0 0 18px;line-height:1.35;font-style:italic;}',
      '.sw-home-v2-overlay-body p{margin:0 0 16px;color:var(--home-muted);font-size:24px;line-height:1.5;}',
      '.sw-home-v2-hidden{display:none !important;}',
      '@media (min-width: 860px){.sw-home-v2-articles-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.sw-home-v2-grid{grid-template-columns:repeat(3,minmax(0,1fr));}.sw-home-v2-wines-grid{grid-template-columns:repeat(3,minmax(0,1fr));}}',
      '@media (max-width: 859px){.sw-home-v2-header{justify-content:flex-start;}.sw-home-v2-langbar,.sw-home-v2-overlay-lang{justify-content:flex-start;}.sw-home-v2-hero-title{font-size:34px;}.sw-home-v2-hero-sub,.sw-home-v2-news-feature p,.sw-home-v2-article-card p,.sw-home-v2-lesson-card p,.sw-home-v2-wine-card p{font-size:20px;}.sw-home-v2-news-feature h3{font-size:24px;}.sw-home-v2-article-card h3,.sw-home-v2-lesson-card h3{font-size:22px;}.sw-home-v2-overlay-intro{font-size:22px;}.sw-home-v2-overlay-body p{font-size:22px;}.sw-home-v2-globalnav{left:10px;right:10px;bottom:10px;}.sw-home-v2-globalnav-inner{grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;padding:10px;}.sw-home-v2-globalnav button{font-size:10px;letter-spacing:0.1em;padding:10px 6px;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function waitForHomeTarget() {
    return new Promise(function(resolve){
      var tries = 0;
      function check() {
        var target = document.getElementById('homeBlock_news') || document.getElementById('page-home');
        if (target) return resolve(target);
        tries += 1;
        if (tries > 200) return resolve(null);
        setTimeout(check, 80);
      }
      check();
    });
  }

  function hideLegacyBlocks() {
    ['homeNewsPromoSection', 'homeBlock_bottiglia', 'slDots'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.classList.add('sw-home-v2-hidden');
    });
  }

  function getApiBase() {
    return String(window.SRV || API_BASE || '').replace(/\/+$/, '');
  }

  function isLocalPreview() {
    try {
      var h = String((window.location && window.location.hostname) || '').toLowerCase();
      return h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0';
    } catch(e) {
      return false;
    }
  }

  function normalizeNews(raw) {
    var list = [];
    if (Array.isArray(raw)) list = raw;
    else if (raw && Array.isArray(raw.items)) list = raw.items;
    else if (raw && Array.isArray(raw.news)) list = raw.news;
    else if (raw && Array.isArray(raw.articles)) list = raw.articles;
    else if (raw && raw.item) list = [raw.item];
    return list.map(function(item, idx){
      return {
        id: item.id || ('news_' + idx),
        title: item.title || item.titolo || item.headline || t('newsFallbackTitle'),
        excerpt: item.excerpt || item.intro || item.summary || item.testo || item.body || item.description || t('newsFallbackExcerpt'),
        source: item.source || item.source_name || item.fonte || item.author || t('newsFallbackSource'),
        link: item.link || item.source_url || item.url || item.href || '#'
      };
    }).filter(function(item){
      return item.title && item.excerpt;
    });
  }

  async function fetchDailyNews() {
    if (isLocalPreview()) {
      return [{
        id: 'fallback',
        title: t('newsFallbackTitle'),
        excerpt: t('newsFallbackExcerpt'),
        source: t('newsFallbackSource'),
        link: '#'
      }];
    }
    var url = API_BASE + '/api/daily-wine-news';
    var attempts = [
      function(){ return fetch(url, { method: 'GET' }); },
      function(){ return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); }
    ];
    for (var i = 0; i < attempts.length; i += 1) {
      try {
        var res = await attempts[i]();
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var json = await res.json();
        var normalized = normalizeNews(json);
        if (normalized.length) return normalized.slice(0, 3);
      } catch(e) {}
    }
    return [{
      id: 'fallback',
      title: t('newsFallbackTitle'),
      excerpt: t('newsFallbackExcerpt'),
      source: t('newsFallbackSource'),
      link: '#'
    }];
  }

  function getDayNumberUTC(date) {
    var d = date || new Date();
    var ms = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    return Math.floor(ms / 86400000);
  }

  function langText(it, en, fr, ru) {
    if (state.lang === 'en') return en;
    if (state.lang === 'fr') return fr;
    if (state.lang === 'ru') return ru;
    return it;
  }

  function inferWineTheme(entry) {
    var text = [entry && entry.title, entry && entry.region, entry && entry.country, entry && entry.style, entry && entry.grapes, entry && entry.note, entry && entry.intro].join(' ').toLowerCase();
    if (/georgia|qvevri|kakheti|amber|orange|anfora/.test(text)) return 'amphora';
    if (/tokaj|sauternes|botry|passito|dolce|sweet|late harvest/.test(text)) return 'cellar';
    if (/etna|volcan|vulcan/.test(text)) return 'volcanic';
    if (/spum|champagne|franciacorta|cava|prosecco/.test(text)) return 'sparkling';
    if (/pipe|pais|maule|old vine|old vines|vecchie vigne/.test(text)) return 'oldvines';
    if (/israel|lebanon|libano|santorini|greek|grecia|coast|sea|marine|mediterr/.test(text)) return 'coast';
    if (/moldova|romania|alto adige|andes|mountain|hill|colline/.test(text)) return 'hills';
    if (/chalk|calcare|limestone|chablis/.test(text)) return 'limestone';
    return 'vineyard';
  }

  function inferLessonTheme(item) {
    var text = [item && item.title, item && item.intro, item && item.body].join(' ').toLowerCase();
    if (/affin|botte|legno|acciaio|steel|oak|cantina/.test(text)) return 'cellar';
    if (/anfora|qvevri/.test(text)) return 'amphora';
    if (/degust|calice|profum|palato|aroma/.test(text)) return 'tasting';
    if (/serviz|tavol|decant|temperatura/.test(text)) return 'service';
    if (/region|denomin|territ|terroir|suolo|soil/.test(text)) return 'vineyard';
    return 'study';
  }

  function inferArticleTheme(item) {
    var text = [item && item.title, item && item.intro, item && item.body, Array.isArray(item && item.tags) ? item.tags.join(' ') : ''].join(' ').toLowerCase();
    if (/tokaj|cantina|cellar|botry/.test(text)) return 'cellar';
    if (/calcare|chalk|limestone|chablis/.test(text)) return 'limestone';
    if (/anfora|qvevri/.test(text)) return 'amphora';
    if (/mare|sea|coast|mediterr/.test(text)) return 'coast';
    if (/degust|aroma|palato/.test(text)) return 'tasting';
    if (/serviz|temperatura|decant/.test(text)) return 'service';
    return 'vineyard';
  }

  function inferTheme(item, kind) {
    if (kind === 'wine') return inferWineTheme(item || {});
    if (kind === 'lesson') return inferLessonTheme(item || {});
    return inferArticleTheme(item || {});
  }

  function getWineAngle(entry) {
    var theme = inferWineTheme(entry || {});
    if (theme === 'amphora') return 'Parla di anfora, materia e ritmo antico piu che di semplice frutto.';
    if (theme === 'cellar') return 'Il suo fascino sta nella lentezza dell affinamento e nella precisione dell equilibrio.';
    if (theme === 'volcanic') return 'Racconta un paesaggio teso, minerale e segnato dall energia del suolo.';
    if (theme === 'sparkling') return 'Conta per energia, precisione del perlage e facilita di abbinamento.';
    if (theme === 'oldvines') return 'Ha il carattere delle vecchie vigne: profilo vivo, diretto e poco addomesticato.';
    if (theme === 'coast') return 'Porta nel bicchiere luce, ventilazione e una lettura salina del territorio.';
    if (theme === 'hills') return 'Si capisce bene attraverso altitudine, escursione termica e nitidezza del sorso.';
    if (theme === 'limestone') return 'La sua forza e nella tensione: meno larghezza, piu precisione e allungo.';
    return 'Conviene leggerlo attraverso territorio, equilibrio e riconoscibilita del profilo.';
  }

  function buildWineIntro(entry) {
    var note = String(entry && (entry.note || entry.intro || entry.excerpt) || '').trim();
    var angle = getWineAngle(entry || {});
    if (!note) return angle;
    if (note.length > 120) return note;
    return note + ' ' + angle;
  }

  function buildWineBody(entry) {
    var parts = [];
    var note = buildWineIntro(entry);
    if (note) parts.push('Perche interessante: ' + note);
    if (entry.region || entry.country) {
      parts.push('Origine: ' + [entry.region, entry.country].filter(Boolean).join(', '));
    }
    if (entry.grapes) parts.push('Uve: ' + entry.grapes);
    if (entry.style) parts.push('Stile: ' + entry.style);
    parts.push('Da cercare per: ' + getWineAngle(entry));
    return parts.join('\n\n');
  }

  function normalizeWineEntry(item, idx) {
    var id = item.id || ('wine_' + idx);
    var name = item.name || item.title || '';
    var note = buildWineIntro(item || {});
    var entry = {
      id: id,
      kind: 'wine',
      title: name,
      intro: note,
      body: item.body || buildWineBody(item),
      country: item.country || '',
      region: item.region || '',
      style: item.style || '',
      grapes: item.grapes || '',
      image_url: item.image_url || '',
      image_alt: item.image_alt || ''
    };
    if (!entry.body) entry.body = buildWineBody(entry);
    return entry;
  }

  function getDailyWinesFromCatalog() {
    var perDay = 3;
    var totalDays = Math.max(1, Math.floor(cellarCatalog.length / perDay));
    var dayBlock = getDayNumberUTC(new Date()) % totalDays;
    var picked = [];
    for (var i = 0; i < perDay; i += 1) {
      var index = dayBlock + (i * totalDays);
      if (cellarCatalog[index]) picked.push(normalizeWineEntry(cellarCatalog[index], index));
    }
    return picked;
  }

  function normalizeWines(raw) {
    var list = [];
    if (Array.isArray(raw)) list = raw;
    else if (raw && Array.isArray(raw.items)) list = raw.items;
    else if (raw && Array.isArray(raw.wines)) list = raw.wines;
    return list.map(function(item, idx){
      if (!item) return null;
      if (item.name || item.country || item.region || item.grapes || item.style || item.note) return normalizeWineEntry(item, idx);
      return normalizeHomeEntry(item, 'wine', idx);
    }).filter(Boolean);
  }

  async function fetchDailyWines() {
    return getDailyWinesFromCatalog();
  }

  function getWeekNumber(date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  function getWeeklyLessons() {
    var start = getWeekNumber(new Date()) % lessonsPool.length;
    var picked = [];
    for (var i = 0; i < 3; i += 1) {
      picked.push(lessonsPool[(start + i) % lessonsPool.length]);
    }
    return picked;
  }

  function getText(block) {
    if (!block) return { title: '', intro: '', body: '' };
    if (block.translations) {
      return (block.translations[state.lang] || block.translations.it || { title: '', intro: '', body: '' });
    }
    if (block[state.lang] || block.it) {
      return block[state.lang] || block.it;
    }
    return {
      title: block.title || '',
      intro: block.intro || block.excerpt || '',
      body: block.body || block.excerpt || block.intro || ''
    };
  }

  function getPreviewLine(text) {
    var source = String((text && text.body) || '').split('\n\n')[0].trim();
    if (!source) return '';
    if (source.length <= 140) return source;
    return source.slice(0, 137).trim() + '...';
  }

  function getArticlesForView() {
    return state.articles.length ? state.articles : articles;
  }

  function getLessonsForView() {
    return state.lessons.length ? state.lessons : getWeeklyLessons();
  }

  function getWinesForView() {
    return state.wines.length ? state.wines : getDailyWinesFromCatalog();
  }

  function getContentList(kind) {
    if (kind === 'lesson') return getLessonsForView();
    if (kind === 'wine') return getWinesForView();
    if (kind === 'news') return state.news;
    return getArticlesForView();
  }

  function normalizeHomeEntry(item, kind, idx) {
    var text = getText(item);
    return {
      id: item.id || (kind + '_' + idx),
      kind: kind,
      slug: item.slug || '',
      level: item.level || '',
      title: item.title || text.title || '',
      intro: item.intro || item.excerpt || text.intro || '',
      body: item.body || text.body || item.excerpt || '',
      source: item.source || item.source_name || item.fonte || '',
      link: item.link || item.source_url || item.url || '#',
      image_url: item.image_url || '',
      image_alt: item.image_alt || '',
      tags: Array.isArray(item.tags) ? item.tags : [],
      reading_minutes: item.reading_minutes || 0
    };
  }

  function normalizeHomeContent(raw) {
    return {
      news: normalizeNews(raw && raw.news).slice(0, 1),
      wines: normalizeWines(raw && raw.wines).slice(0, 5),
      articles: (raw && Array.isArray(raw.articles) ? raw.articles : []).slice(0, ARTICLE_LIMIT).map(function(item, idx){
        return normalizeHomeEntry(item, 'article', idx);
      }),
      lessons: (raw && Array.isArray(raw.lessons) ? raw.lessons : []).slice(0, 3).map(function(item, idx){
        return normalizeHomeEntry(item, 'lesson', idx);
      })
    };
  }

  function getLocalHomeFallback() {
    return {
      news: [],
      wines: getDailyWinesFromCatalog(),
      articles: articles.slice(0, ARTICLE_LIMIT),
      lessons: getWeeklyLessons()
    };
  }

  function refreshOverlayItemReference() {
    if (!state.overlayItem || !state.overlayItem.item) return;
    var current = findContent(state.overlayItem.kind, state.overlayItem.item.id);
    if (current) state.overlayItem.item = current;
  }

  function applyHomeContent(content) {
    var next = content || {};
    state.news = Array.isArray(next.news) ? next.news : [];
    state.wines = Array.isArray(next.wines) ? next.wines : [];
    state.articles = Array.isArray(next.articles) ? next.articles : [];
    state.lessons = Array.isArray(next.lessons) ? next.lessons : [];
    refreshOverlayItemReference();
  }

  async function fetchHomeContent() {
    if (isLocalPreview()) {
      var localFallback = getLocalHomeFallback();
      localFallback.news = await fetchDailyNews();
      localFallback.wines = await fetchDailyWines();
      return localFallback;
    }
    var url = getApiBase() + '/api/home/content?lang=' + encodeURIComponent(state.lang);
    try {
      var res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var json = await res.json();
      var normalized = normalizeHomeContent(json);
      if (normalized.news.length || normalized.wines.length || normalized.articles.length || normalized.lessons.length) {
        if (!normalized.news.length) normalized.news = await fetchDailyNews();
        if (!normalized.wines.length) normalized.wines = await fetchDailyWines();
        if (!normalized.articles.length) normalized.articles = getLocalHomeFallback().articles;
        if (!normalized.lessons.length) normalized.lessons = getLocalHomeFallback().lessons;
        return normalized;
      }
    } catch(e) {}

    var fallback = getLocalHomeFallback();
    fallback.news = await fetchDailyNews();
    fallback.wines = await fetchDailyWines();
    return fallback;
  }

  async function reloadHomeContent(target) {
    if (!target) return;
    var content = await fetchHomeContent();
    applyHomeContent(content);
    renderHome(target);
    if (state.overlayItem) renderOverlay();
    updateGlobalBottomNav();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeSvgText(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getThemeLabel(theme) {
    var labels = {
      amphora: langText('Anfora', 'Amphora', 'Amphore', 'Qvevri'),
      cellar: langText('Cantina', 'Cellar', 'Cave', 'Pogreb'),
      volcanic: langText('Suolo vulcanico', 'Volcanic soil', 'Sol volcanique', 'Vulkanicheskaia pochva'),
      sparkling: langText('Metodo spumante', 'Sparkling method', 'Methode effervescente', 'Igristyi metod'),
      oldvines: langText('Vecchie vigne', 'Old vines', 'Vieilles vignes', 'Starye lozy'),
      coast: langText('Paesaggio costiero', 'Coastal landscape', 'Paysage cotier', 'Primorskii peizazh'),
      hills: langText('Colline e altitudine', 'Hills and altitude', 'Collines et altitude', 'Kholmy i vysota'),
      limestone: langText('Calcare', 'Limestone', 'Calcaire', 'Izvestniak'),
      tasting: langText('Degustazione', 'Tasting', 'Degustation', 'Degustatsiia'),
      service: langText('Servizio', 'Service', 'Service', 'Servis'),
      study: langText('Formazione', 'Study', 'Formation', 'Obuchenie'),
      vineyard: langText('Vigneto', 'Vineyard', 'Vignoble', 'Vinogradnik')
    };
    return labels[theme] || labels.vineyard;
  }

  function getThemePalette(theme) {
    if (theme === 'amphora') return { primary: '#d8a96a', secondary: '#5f3d21', glow: 'rgba(216,169,106,0.18)' };
    if (theme === 'cellar') return { primary: '#d4af37', secondary: '#4a2a17', glow: 'rgba(212,175,55,0.16)' };
    if (theme === 'volcanic') return { primary: '#e06c43', secondary: '#401d17', glow: 'rgba(224,108,67,0.16)' };
    if (theme === 'sparkling') return { primary: '#f0d77c', secondary: '#40361a', glow: 'rgba(240,215,124,0.16)' };
    if (theme === 'oldvines') return { primary: '#b86a4d', secondary: '#3b2119', glow: 'rgba(184,106,77,0.16)' };
    if (theme === 'coast') return { primary: '#73b8c9', secondary: '#183542', glow: 'rgba(115,184,201,0.18)' };
    if (theme === 'hills') return { primary: '#8fb06d', secondary: '#23311b', glow: 'rgba(143,176,109,0.16)' };
    if (theme === 'limestone') return { primary: '#d8d0bb', secondary: '#3a3327', glow: 'rgba(216,208,187,0.18)' };
    if (theme === 'tasting') return { primary: '#be6b92', secondary: '#321926', glow: 'rgba(190,107,146,0.16)' };
    if (theme === 'service') return { primary: '#8aa4c8', secondary: '#1f2938', glow: 'rgba(138,164,200,0.16)' };
    return { primary: '#d4af37', secondary: '#2c1b11', glow: 'rgba(212,175,55,0.16)' };
  }

  function getIllustrationMotif(theme, palette) {
    var primary = palette.primary;
    var secondary = palette.secondary;
    var glow = palette.glow;
    if (theme === 'amphora') {
      return '<ellipse cx="350" cy="312" rx="82" ry="116" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><path d="M350 176c-26 0-42 20-42 40v28c0 16-20 32-20 64 0 54 28 120 62 120s62-66 62-120c0-32-20-48-20-64v-28c0-20-16-40-42-40z" fill="rgba(0,0,0,0.08)" stroke="' + primary + '" stroke-width="4"/><ellipse cx="586" cy="316" rx="70" ry="100" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><path d="M586 196c-22 0-36 18-36 36v24c0 14-18 28-18 56 0 46 24 102 54 102s54-56 54-102c0-28-18-42-18-56v-24c0-18-14-36-36-36z" fill="rgba(0,0,0,0.08)" stroke="' + primary + '" stroke-width="4"/>';
    }
    if (theme === 'cellar') {
      return '<path d="M250 360c0-92 74-166 166-166s166 74 166 166" fill="none" stroke="' + primary + '" stroke-width="6"/><rect x="238" y="360" width="356" height="78" rx="14" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><circle cx="340" cy="396" r="42" fill="rgba(0,0,0,0.08)" stroke="' + primary + '" stroke-width="4"/><circle cx="494" cy="396" r="42" fill="rgba(0,0,0,0.08)" stroke="' + primary + '" stroke-width="4"/><line x1="382" y1="396" x2="452" y2="396" stroke="' + primary + '" stroke-width="4"/>';
    }
    if (theme === 'volcanic') {
      return '<path d="M312 392l132-210 132 210z" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><path d="M444 182l28 54h-56z" fill="' + secondary + '"/><path d="M178 430c92-50 172-50 264 0 102-54 190-54 282 0" fill="none" stroke="' + primary + '" stroke-width="4"/><path d="M210 464c86-38 160-38 234 0 86-42 164-42 244 0" fill="none" stroke="' + primary + '" stroke-width="3"/>';
    }
    if (theme === 'sparkling') {
      return '<rect x="428" y="138" width="104" height="248" rx="30" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><rect x="452" y="102" width="56" height="54" rx="14" fill="rgba(255,255,255,0.06)" stroke="' + primary + '" stroke-width="4"/><circle cx="326" cy="240" r="14" fill="' + glow + '" stroke="' + primary + '" stroke-width="3"/><circle cx="292" cy="282" r="22" fill="' + glow + '" stroke="' + primary + '" stroke-width="3"/><circle cx="350" cy="294" r="18" fill="' + glow + '" stroke="' + primary + '" stroke-width="3"/><circle cx="628" cy="214" r="16" fill="' + glow + '" stroke="' + primary + '" stroke-width="3"/><circle cx="662" cy="252" r="24" fill="' + glow + '" stroke="' + primary + '" stroke-width="3"/>';
    }
    if (theme === 'oldvines') {
      return '<path d="M420 430c-22-78 6-132 84-164 18-8 28-22 30-42" fill="none" stroke="' + primary + '" stroke-width="8" stroke-linecap="round"/><path d="M420 430c18-54 4-108-40-156" fill="none" stroke="' + primary + '" stroke-width="6" stroke-linecap="round"/><circle cx="562" cy="238" r="24" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><circle cx="592" cy="272" r="22" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><circle cx="548" cy="286" r="18" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><path d="M178 452c92-44 166-44 252 0 98-48 186-48 282 0" fill="none" stroke="' + primary + '" stroke-width="4"/>';
    }
    if (theme === 'coast') {
      return '<circle cx="678" cy="180" r="48" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><path d="M120 430c94-54 180-54 276 0 104-64 210-64 328 0" fill="none" stroke="' + primary + '" stroke-width="5"/><path d="M120 474c108-22 188-22 270 0 94-24 192-24 320 0" fill="none" stroke="' + primary + '" stroke-width="4"/><path d="M202 386l46-76 46 76" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><path d="M314 396l56-96 56 96" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/>';
    }
    if (theme === 'hills' || theme === 'vineyard') {
      return '<path d="M122 430c96-56 184-56 280 0 98-62 196-62 312 0" fill="none" stroke="' + primary + '" stroke-width="5"/><path d="M156 466c92-36 168-36 242 0 86-40 176-40 274 0" fill="none" stroke="' + primary + '" stroke-width="4"/><line x1="242" y1="330" x2="242" y2="418" stroke="' + primary + '" stroke-width="4"/><line x1="334" y1="302" x2="334" y2="430" stroke="' + primary + '" stroke-width="4"/><line x1="448" y1="300" x2="448" y2="438" stroke="' + primary + '" stroke-width="4"/><line x1="572" y1="326" x2="572" y2="422" stroke="' + primary + '" stroke-width="4"/>';
    }
    if (theme === 'limestone') {
      return '<path d="M202 250h514" stroke="' + primary + '" stroke-width="5"/><path d="M178 308h562" stroke="' + primary + '" stroke-width="4"/><path d="M212 366h486" stroke="' + primary + '" stroke-width="5"/><path d="M230 422h430" stroke="' + primary + '" stroke-width="4"/><path d="M308 442c52-56 104-80 156-72 40 6 78 28 114 66" fill="none" stroke="' + primary + '" stroke-width="5"/>';
    }
    if (theme === 'tasting') {
      return '<path d="M330 196h112c0 74-16 116-56 150v84" fill="none" stroke="' + primary + '" stroke-width="5"/><line x1="386" y1="430" x2="386" y2="470" stroke="' + primary + '" stroke-width="5"/><line x1="336" y1="470" x2="436" y2="470" stroke="' + primary + '" stroke-width="5"/><path d="M520 208h116c0 64-18 106-58 138v84" fill="none" stroke="' + primary + '" stroke-width="5"/><line x1="578" y1="430" x2="578" y2="470" stroke="' + primary + '" stroke-width="5"/><line x1="528" y1="470" x2="628" y2="470" stroke="' + primary + '" stroke-width="5"/>';
    }
    if (theme === 'service') {
      return '<path d="M332 430c0-90 72-162 160-162 42 0 76-16 100-46" fill="none" stroke="' + primary + '" stroke-width="6"/><circle cx="600" cy="214" r="44" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/><path d="M236 462h458" stroke="' + primary + '" stroke-width="5"/><rect x="414" y="310" width="92" height="120" rx="16" fill="' + glow + '" stroke="' + primary + '" stroke-width="4"/>';
    }
    return '<path d="M122 430c96-56 184-56 280 0 98-62 196-62 312 0" fill="none" stroke="' + primary + '" stroke-width="5"/>';
  }

  function getThemeSubtitle(item, kind, theme) {
    if (kind === 'wine') {
      return [item.region, item.grapes, getThemeLabel(theme)].filter(Boolean).join(' · ');
    }
    if (kind === 'lesson') {
      return [getThemeLabel(theme), Array.isArray(item.tags) ? item.tags[0] : ''].filter(Boolean).join(' · ');
    }
    return ((Array.isArray(item.tags) && item.tags.length) ? item.tags.slice(0, 2).join(' · ') : getThemeLabel(theme));
  }

  function getAutoImageAlt(item, kind, theme) {
    if (item && item.image_alt) return String(item.image_alt);
    var title = item && item.title ? String(item.title) : 'Sommelier World';
    return langText(
      'Illustrazione editoriale per ' + title + ': ' + getThemeLabel(theme).toLowerCase(),
      'Editorial illustration for ' + title + ': ' + getThemeLabel(theme).toLowerCase(),
      'Illustration editoriale pour ' + title + ' : ' + getThemeLabel(theme).toLowerCase(),
      'Redaktsionnaia illiustratsiia dlia ' + title + ': ' + getThemeLabel(theme).toLowerCase()
    );
  }

  function buildIllustrationSvg(item, kind) {
    var theme = inferTheme(item || {}, kind);
    var palette = getThemePalette(theme);
    var primary = palette.primary;
    var soft = '#f5efe2';
    var muted = 'rgba(245,239,226,0.72)';
    var badge = kind === 'wine' ? (item.country || getThemeLabel(theme)) : getThemeLabel(theme);
    var title = item && item.title ? String(item.title) : 'Sommelier World';
    var subtitle = getThemeSubtitle(item || {}, kind, theme);
    var motif = getIllustrationMotif(theme, palette);
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">',
      '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#24160d"/><stop offset="100%" stop-color="#0a0602"/></linearGradient></defs>',
      '<rect width="960" height="640" fill="url(#bg)"/>',
      '<circle cx="160" cy="110" r="140" fill="' + palette.glow + '"/>',
      '<circle cx="820" cy="520" r="180" fill="rgba(128,0,32,0.16)"/>',
      motif,
      '<text x="70" y="470" fill="' + primary + '" font-family="Georgia, serif" font-size="20" letter-spacing="4">' + escapeSvgText(String(badge || '').toUpperCase()) + '</text>',
      '<text x="70" y="520" fill="' + soft + '" font-family="Georgia, serif" font-size="34">' + escapeSvgText(title) + '</text>',
      subtitle ? '<text x="70" y="560" fill="' + muted + '" font-family="Georgia, serif" font-size="22">' + escapeSvgText(subtitle) + '</text>' : '',
      '</svg>'
    ].join('');
    return svg;
  }

  function resolveImageUrl(item, kind) {
    var explicitUrl = item && item.image_url ? String(item.image_url) : '';
    return explicitUrl;
  }

  function getPlaceholderMeta(item, kind) {
    if (kind === 'wine') {
      return {
        badge: (item.country || 'Wine'),
        title: item.grapes || item.region || 'Wine Selection',
        subtitle: item.style || item.country || ''
      };
    }
    return {
      badge: kind === 'article' ? 'Editorial' : 'Sommelier',
      title: (item.reading_minutes ? (item.reading_minutes + ' min') : 'Sommelier World'),
      subtitle: (Array.isArray(item.tags) && item.tags.length ? item.tags.slice(0, 2).join(' · ') : '')
    };
  }

  function renderCardMedia(item, kind) {
    var meta = getPlaceholderMeta(item || {}, kind);
    var imageUrl = resolveImageUrl(item, kind);
    var imageAlt = getAutoImageAlt(item, kind, inferTheme(item || {}, kind));
    if (!imageUrl) {
      return [
        '<div class="sw-home-v2-card-media">',
          '<div class="sw-home-v2-card-badge">', escapeHtml(meta.badge), '</div>',
          buildIllustrationSvg(item || {}, kind),
        '</div>'
      ].join('');
    }
    return [
      '<div class="sw-home-v2-card-media">',
        '<div class="sw-home-v2-card-badge">', escapeHtml(meta.badge), '</div>',
        '<img src="', escapeHtml(imageUrl), '" alt="', escapeHtml(imageAlt), '" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.classList.add(\'is-fallback\')">',
        '<div class="sw-home-v2-card-fallback">',
          '<strong>', escapeHtml(meta.title), '</strong>',
          meta.subtitle ? '<span>' + escapeHtml(meta.subtitle) + '</span>' : '',
        '</div>',
      '</div>'
    ].join('');
  }

  function renderNewsShowcase() {
    var items = state.news.length ? state.news : [{
      id: 'loading',
      title: t('loadingNews'),
      excerpt: t('newsFallbackExcerpt'),
      source: t('newsFallbackSource'),
      link: '#'
    }];
    var featured = items[0];
    return [
      '<div class="sw-home-v2-news-stage">',
        '<article class="sw-home-v2-news-feature">',
          '<div class="sw-home-v2-news-meta">',
            '<span>', escapeHtml(t('newsLabel')), ' 1/', items.length, '</span>',
            '<span>', escapeHtml(featured.source), '</span>',
          '</div>',
          '<h3>', escapeHtml(featured.title), '</h3>',
          '<p>', escapeHtml(featured.excerpt), '</p>',
          '<div class="sw-home-v2-actions">',
            featured.link && featured.link !== '#' ? '<a class="sw-home-v2-link" href="' + escapeHtml(featured.link) + '" target="_blank" rel="noopener">' + escapeHtml(t('openLink')) + '</a>' : '',
          '</div>',
        '</article>',
        '<div class="sw-home-v2-news-footer">',
          '<div class="sw-home-v2-news-dots">', items.length > 1 ? '<span class="active"></span>' : '', '</div>',
          '<div>', escapeHtml(t('newsFootnote')), '</div>',
        '</div>',
      '</div>'
    ].join('');
  }

  function renderWineCards() {
    return getWinesForView().map(function(item){
      var wineSpecs = [item.style, item.grapes].filter(Boolean).join(' · ');
      var preview = [item.region, item.country].filter(Boolean).join(' · ');
      return [
        '<article class="sw-home-v2-wine-card" data-kind="wine" data-id="', escapeHtml(item.id), '">',
          renderCardMedia(item, 'wine'),
          '<div class="sw-home-v2-wine-meta">',
            '<span>', escapeHtml(preview), '</span>',
          '</div>',
          '<h3>', escapeHtml(item.title || ''), '</h3>',
          '<p>', escapeHtml(item.intro || ''), '</p>',
          wineSpecs ? '<p>' + escapeHtml(wineSpecs) + '</p>' : '',
        '</article>'
      ].join('');
    }).join('');
  }

  function renderBriefStrip() {
    var item = state.news && state.news.length ? state.news[0] : {
      id: 'loading',
      title: t('loadingNews'),
      excerpt: t('newsFallbackExcerpt'),
      source: t('newsFallbackSource'),
      link: '#'
    };
    var parts = [];
    if (item.title) parts.push(item.title);
    if (item.excerpt) parts.push(item.excerpt);
    return [
      '<div class="sw-home-v2-brief-strip">',
        '<strong>', escapeHtml(t('briefTitle')), '</strong>',
        '<div class="sw-home-v2-brief-text">', escapeHtml(parts.join(' — ')), '</div>',
        item.link && item.link !== '#' ? '<a class="sw-home-v2-link" href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener">' + escapeHtml(t('openLink')) + '</a>' : '',
      '</div>'
    ].join('');
  }

  function renderArticleCards() {
    return getArticlesForView().map(function(item){
      var tx = getText(item);
      var preview = getPreviewLine(tx);
      return [
        '<article class="sw-home-v2-article-card" data-kind="article" data-id="', escapeHtml(item.id), '">',
          renderCardMedia({
            title: tx.title,
            intro: tx.intro,
            body: tx.body,
            image_url: item.image_url,
            image_alt: item.image_alt,
            reading_minutes: item.reading_minutes,
            tags: item.tags
          }, 'article'),
          '<div class="sw-home-v2-kicker">', escapeHtml(t('articleKind')), '</div>',
          '<h3>', escapeHtml(tx.title), '</h3>',
          '<p>', escapeHtml(tx.intro), '</p>',
          preview ? '<p>' + escapeHtml(preview) + '</p>' : '',
        '</article>'
      ].join('');
    }).join('');
  }

  function levelLabel(level) {
    if (level === 'level1') return t('level1');
    if (level === 'level2') return t('level2');
    return t('level3');
  }

  function renderLessonCards() {
    return getLessonsForView().map(function(item){
      var tx = getText(item);
      var preview = getPreviewLine(tx);
      return [
        '<article class="sw-home-v2-lesson-card" data-kind="lesson" data-id="', escapeHtml(item.id), '">',
          renderCardMedia({
            title: tx.title,
            intro: tx.intro,
            body: tx.body,
            image_url: item.image_url,
            image_alt: item.image_alt,
            tags: [levelLabel(item.level)]
          }, 'lesson'),
          '<div class="sw-home-v2-kicker">', escapeHtml(levelLabel(item.level)), '</div>',
          '<h3>', escapeHtml(tx.title), '</h3>',
          '<p>', escapeHtml(tx.intro), '</p>',
          preview ? '<p>' + escapeHtml(preview) + '</p>' : '',
        '</article>'
      ].join('');
    }).join('');
  }

  function getBottomNavItems() {
    return [
      { page: 'home', label: t('navHome') },
      { page: 'producers', label: t('navSearch') },
      { page: 'explore', label: t('navTerroir') },
      { page: 'sommelier', label: t('navSommelier') },
      { page: 'eventi', label: t('navMenu') }
    ];
  }

  function renderBottomNav() {
    return getBottomNavItems().map(function(item){
      return '<button type="button" data-page="' + item.page + '">' + escapeHtml(item.label) + '</button>';
    }).join('');
  }

  function renderHome(target) {
    if (!target) return;
    target.classList.add('sw-home-v2');
    target.innerHTML = [
      '<div class="sw-home-v2-shell">',
        '<header class="sw-home-v2-header">',
          '<div class="sw-home-v2-langbar">',
            langButton('it', 'ITA'),
            langButton('en', 'ENG'),
            langButton('fr', 'FRA'),
            langButton('ru', 'RUS'),
          '</div>',
        '</header>',
        '<section class="sw-home-v2-panel sw-home-v2-hero">',
          '<div class="sw-home-v2-hero-content">',
            '<div class="sw-home-v2-tag">', escapeHtml(t('headerTag')), '</div>',
            '<h1 class="sw-home-v2-hero-title">SOMMELIER WORLD</h1>',
            '<p class="sw-home-v2-hero-sub">', escapeHtml(t('heroSub')), '</p>',
          '</div>',
        '</section>',
        '<section class="sw-home-v2-panel">',
          '<div class="sw-home-v2-block-head">',
            '<div class="sw-home-v2-block-titlewrap">',
              '<span class="sw-home-v2-block-mark"></span>',
              '<h2 class="sw-home-v2-block-title">', escapeHtml(t('winesTitle')), '</h2>',
            '</div>',
            '<div class="sw-home-v2-pill">', escapeHtml(t('winesPill')), '</div>',
          '</div>',
          '<p class="sw-home-v2-lead">', escapeHtml(t('winesSub')), '</p>',
          '<div class="sw-home-v2-wines-grid">', renderWineCards(), '</div>',
          renderBriefStrip(),
          '<div class="sw-home-v2-note">', escapeHtml(t('winesFootnote')), '</div>',
        '</section>',
        '<section class="sw-home-v2-panel">',
          '<div class="sw-home-v2-block-head">',
            '<div class="sw-home-v2-block-titlewrap">',
              '<span class="sw-home-v2-block-mark"></span>',
              '<h2 class="sw-home-v2-block-title">', escapeHtml(t('articlesTitle')), '</h2>',
            '</div>',
          '</div>',
          '<p class="sw-home-v2-lead">', escapeHtml(t('articlesSub')), '</p>',
          '<div class="sw-home-v2-articles-grid">', renderArticleCards(), '</div>',
          '<div class="sw-home-v2-note">', escapeHtml(t('articlesFootnote')), '</div>',
        '</section>',
        '<section class="sw-home-v2-panel">',
          '<div class="sw-home-v2-block-head">',
            '<div class="sw-home-v2-block-titlewrap">',
              '<span class="sw-home-v2-block-mark"></span>',
              '<h2 class="sw-home-v2-block-title">', escapeHtml(t('lessonsTitle')), '</h2>',
            '</div>',
            '<div class="sw-home-v2-pill">', escapeHtml(t('weeklyRotation')), '</div>',
          '</div>',
          '<div class="sw-home-v2-grid">', renderLessonCards(), '</div>',
          '<div class="sw-home-v2-note">', escapeHtml(t('lessonsFootnote')), '</div>',
        '</section>',
      '</div>'
    ].join('');
    bindHomeEvents(target);
    document.body.classList.add('sw-home-v2-ready');
    ensureOverlay();
    ensureGlobalBottomNav();
    updateGlobalBottomNav();
  }

  function ensureGlobalBottomNav() {
    var nav = document.getElementById('swHomeV2GlobalNav');
    if (!nav) {
      nav = document.createElement('div');
      nav.id = 'swHomeV2GlobalNav';
      nav.className = 'sw-home-v2-globalnav';
      document.body.appendChild(nav);
    }
    nav.innerHTML = '<div class="sw-home-v2-globalnav-inner">' + renderBottomNav() + '</div>';
    nav.querySelectorAll('button[data-page]').forEach(function(btn){
      btn.onclick = function() {
        var page = btn.getAttribute('data-page');
        if (window.showPage) window.showPage(page);
        updateGlobalBottomNav();
      };
    });
    return nav;
  }

  function getActivePageKey() {
    var active = document.querySelector('.page.active[id^="page-"]');
    return active ? active.id.replace(/^page-/, '') : 'home';
  }

  function updateGlobalBottomNav() {
    var nav = ensureGlobalBottomNav();
    var activePage = getActivePageKey();
    // NAV BOTTOM DUPLICATA SEMPRE NASCOSTA: usiamo la NAV TOP ORIGINALE
    nav.classList.add('hidden');
    document.body.classList.remove('sw-home-v2-bottom-nav-mode');
  }

  function startPageObserver() {
    if (window.__swHomeV2PageObserverStarted) return;
    window.__swHomeV2PageObserverStarted = true;
    var pages = document.querySelectorAll('.page[id^="page-"]');
    var observer = new MutationObserver(function(mutations){
      var shouldUpdate = mutations.some(function(mutation){
        var id = mutation.target && mutation.target.id;
        return id && id.indexOf('page-') === 0;
      });
      if (shouldUpdate) updateGlobalBottomNav();
    });
    pages.forEach(function(page){
      observer.observe(page, {
        attributes: true,
        attributeFilter: ['class']
      });
    });
  }

  function langButton(lang, label) {
    return '<button type="button" class="sw-home-v2-langbtn' + (state.lang === lang ? ' active' : '') + '" data-set-lang="' + lang + '">' + label + '</button>';
  }

  function findContent(kind, id) {
    var list = getContentList(kind);
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function bindHomeEvents(target) {
    target.querySelectorAll('[data-set-lang]').forEach(function(btn){
      btn.onclick = function() {
        setLang(btn.getAttribute('data-set-lang'));
      };
    });
    target.querySelectorAll('[data-kind][data-id]').forEach(function(el){
      el.addEventListener('click', function(ev){
        var id = el.getAttribute('data-id');
        var kind = el.getAttribute('data-kind');
        var item = findContent(kind, id);
        if (item) {
          ev.preventDefault();
          openOverlay(kind, item);
        }
      });
    });
  }

  function ensureOverlay() {
    var overlay = document.getElementById('swHomeV2Overlay');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'swHomeV2Overlay';
    overlay.className = 'sw-home-v2-overlay';
    overlay.innerHTML = '<div class="sw-home-v2-overlay-shell"></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(ev){
      if (ev.target === overlay) closeOverlay();
    });
    return overlay;
  }

  function openOverlay(kind, item) {
    state.overlayItem = { kind: kind, item: item };
    renderOverlay();
  }

  function renderOverlay() {
    var overlay = ensureOverlay();
    if (!state.overlayItem) return;
    var content = getText(state.overlayItem.item);
    var shell = overlay.querySelector('.sw-home-v2-overlay-shell');
    var bodyParts = String(content.body || '').split('\n\n').filter(function(part){ return part.trim(); });
    var overlayImageUrl = resolveImageUrl(state.overlayItem.item, state.overlayItem.kind);
    var overlayImageAlt = getAutoImageAlt(state.overlayItem.item, state.overlayItem.kind, inferTheme(state.overlayItem.item || {}, state.overlayItem.kind));
    shell.innerHTML = [
      '<div class="sw-home-v2-overlay-top">',
        '<div>',
          '<div class="sw-home-v2-overlay-kind">', escapeHtml(state.overlayItem.kind === 'lesson' ? t('lessonKind') : (state.overlayItem.kind === 'wine' ? t('wineKind') : t('articleKind'))), '</div>',
          '<h2>', escapeHtml(content.title), '</h2>',
        '</div>',
        '<div class="sw-home-v2-overlay-lang">',
          langButton('it', 'ITA'),
          langButton('en', 'ENG'),
          langButton('fr', 'FRA'),
          langButton('ru', 'RUS'),
        '</div>',
      '</div>',
      '<div class="sw-home-v2-overlay-media">' + (overlayImageUrl ? '<img src="' + escapeHtml(overlayImageUrl) + '" alt="' + escapeHtml(overlayImageAlt) + '" loading="lazy" onerror="this.parentNode.style.display=\'none\'">' : buildIllustrationSvg(state.overlayItem.item || {}, state.overlayItem.kind)) + '</div>',
      '<p class="sw-home-v2-overlay-intro">', escapeHtml(content.intro), '</p>',
      '<div class="sw-home-v2-overlay-body">', bodyParts.map(function(part){ return '<p>' + escapeHtml(part) + '</p>'; }).join(''), '</div>',
      '<div class="sw-home-v2-actions" style="margin-top:22px;">',
        '<button type="button" class="sw-home-v2-button" id="swHomeBackBtn">', escapeHtml(t('backHome')), '</button>',
        '<button type="button" class="sw-home-v2-button" id="swHomeCloseBtn">', escapeHtml(t('close')), '</button>',
      '</div>'
    ].join('');
    shell.querySelectorAll('[data-set-lang]').forEach(function(btn){
      btn.onclick = function() {
        setLang(btn.getAttribute('data-set-lang'));
      };
    });
    shell.querySelector('#swHomeBackBtn').onclick = closeOverlay;
    shell.querySelector('#swHomeCloseBtn').onclick = closeOverlay;
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    updateGlobalBottomNav();
  }

  function closeOverlay() {
    state.overlayItem = null;
    var overlay = document.getElementById('swHomeV2Overlay');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
    updateGlobalBottomNav();
  }

  function refreshHomeLanguage() {
    state.lang = getSavedLang();
    var target = document.getElementById('homeBlock_news') || document.getElementById('page-home');
    if (target) {
      renderHome(target);
      if (state.overlayItem) renderOverlay();
      reloadHomeContent(target);
    }
    updateGlobalBottomNav();
  }

  function syncWithGlobalLanguage() {
    if (window.__swHomeV2LangSyncInstalled) return;
    window.__swHomeV2LangSyncInstalled = true;

    if (typeof window.setLang === 'function' && window.setLang !== setLang) {
      var originalGlobalSetLang = window.setLang;
      window.setLang = function(lang) {
        var result = originalGlobalSetLang(lang);
        refreshHomeLanguage();
        return result;
      };
    }

    window.addEventListener('storage', function(ev){
      if (ev.key === 'sw_lang') refreshHomeLanguage();
    });
  }

  function setLang(lang) {
    if (!ui[lang]) return;
    if (window.setLang && window.setLang !== setLang) {
      window.setLang(lang);
      return;
    }
    try { localStorage.setItem('sw_lang', lang); } catch(e) {}
    state.lang = getSavedLang();
    var target = document.getElementById('homeBlock_news') || document.getElementById('page-home');
    renderHome(target);
    if (state.overlayItem) renderOverlay();
    updateGlobalBottomNav();
    reloadHomeContent(target);
  }

  async function init() {
    injectStyles();
    hideLegacyBlocks();
    syncWithGlobalLanguage();
    ensureGlobalBottomNav();
    startPageObserver();
    var target = await waitForHomeTarget();
    if (!target) {
      updateGlobalBottomNav();
      return;
    }
    renderHome(target);
    await reloadHomeContent(target);
    updateGlobalBottomNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  (function addFloatingExtras() {
    var css = [
      '/* Floating Goblet Draggable */',
      '.sw-floating-goblet{',
      '  position:fixed;right:18px;bottom:88px;width:52px;height:52px;border-radius:50%;',
      '  background:radial-gradient(circle at 28% 26%, #4a4a4a 0%, #2c2c2c 62%, #181818 100%);',
      '  border:1.5px solid rgba(255,255,255,0.1);',
      '  box-shadow:0 12px 30px rgba(0,0,0,.45), 0 0 0 1px rgba(0,0,0,.25);',
      '  z-index:1099;display:flex;align-items:center;justify-content:center;',
      '  cursor:grab;touch-action:none;user-select:none;',
      '  transition:box-shadow .2s ease, transform .2s ease, border-color .2s ease;overflow:hidden;',
      '}',
      '.sw-floating-goblet:active{cursor:grabbing;}',
      '.sw-floating-goblet:hover{',
      '  border-color:rgba(255,255,255,.28);',
      '  box-shadow:0 18px 40px rgba(0,0,0,.58), 0 0 0 1px rgba(0,0,0,.3);transform:translateY(-2px);',
      '}',
      '.sw-floating-goblet svg{width:50px;height:50px;display:block;}',
      'body.sw-os-windows .sw-floating-goblet{right:26px;bottom:96px;width:60px;height:60px;}',
      'body.sw-os-windows .sw-floating-goblet svg{width:58px;height:58px;}',
      '@media (max-width: 859px){.sw-floating-goblet{right:12px;bottom:76px;width:48px;height:48px;}.sw-floating-goblet svg{width:46px;height:46px;}}',
      '/* Floating Book FISSO */',
      '.sw-floating-book{',
      '  position:fixed;left:18px;bottom:88px;width:52px;height:52px;border-radius:50%;',
      '  background:radial-gradient(circle at 28% 26%, #2a4620 0%, #1a2e14 62%, #0e1c0a 100%);',
      '  border:1.5px solid rgba(255,255,255,0.09);',
      '  box-shadow:0 12px 30px rgba(0,0,0,.45), 0 0 0 1px rgba(0,0,0,.22);',
      '  z-index:1098;display:flex;align-items:center;justify-content:center;',
      '  cursor:pointer;touch-action:manipulation;user-select:none;',
      '  transition:box-shadow .2s ease, transform .2s ease, border-color .2s ease;overflow:hidden;',
      '}',
      '.sw-floating-book:hover{',
      '  border-color:rgba(140,200,90,.35);',
      '  box-shadow:0 18px 40px rgba(0,0,0,.58), 0 0 0 1px rgba(0,0,0,.3);transform:translateY(-2px);',
      '}',
      '.sw-floating-book svg{width:44px;height:44px;display:block;}',
      '@media (max-width: 859px){.sw-floating-book{left:12px;bottom:76px;width:48px;height:48px;}.sw-floating-book svg{width:42px;height:42px;}}'
    ].join('\n');
    var s = document.createElement('style');
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);

    function ensureFloatingGoblet() {
      var g = document.getElementById('swFloatingGoblet');
      if (g) return g;
      g = document.createElement('div');
      g.id = 'swFloatingGoblet';
      g.className = 'sw-floating-goblet';
      g.setAttribute('role', 'button');
      g.setAttribute('title', langText('Apri Sommelier: abbinamenti e servizio', 'Open Sommelier: pairings & service', 'Ouvrir Sommelier : accords et service', 'Открыть раздел сомелье: сочетания и сервировка'));
      g.innerHTML = [
        '<svg viewBox="0 0 64 64" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="Calice Vino Rosso">',
          '<defs>',
            '<radialGradient id="gobWineRed" cx="50%" cy="25%" r="75%">',
              '<stop offset="0%" stop-color="#ff5466"/>',
              '<stop offset="28%" stop-color="#dc263a"/>',
              '<stop offset="62%" stop-color="#9a0a1c"/>',
              '<stop offset="100%" stop-color="#5c000c"/>',
            '</radialGradient>',
            '<linearGradient id="gobGlass" x1="0" x2="1" y1="0" y2="0">',
              '<stop offset="0%" stop-color="#fafcfe" stop-opacity="0.98"/>',
              '<stop offset="28%" stop-color="#e7edf5" stop-opacity="0.86"/>',
              '<stop offset="60%" stop-color="#b5bfcb" stop-opacity="0.55"/>',
              '<stop offset="100%" stop-color="#86909d" stop-opacity="0.78"/>',
            '</linearGradient>',
            '<linearGradient id="gobStemGold" x1="0" x2="0" y1="0" y2="1">',
              '<stop offset="0%" stop-color="#f2dfa4"/>',
              '<stop offset="50%" stop-color="#c79b3d"/>',
              '<stop offset="100%" stop-color="#6c4c10"/>',
            '</linearGradient>',
            '<linearGradient id="gobBaseGold" x1="0" x2="0" y1="0" y2="1">',
              '<stop offset="0%" stop-color="#e9c774"/>',
              '<stop offset="55%" stop-color="#a2751e"/>',
              '<stop offset="100%" stop-color="#4a3208"/>',
            '</linearGradient>',
          '</defs>',
          '<circle cx="32" cy="32" r="30" fill="#000000"/>',
          '<circle cx="32" cy="32" r="29.2" fill="none" stroke="url(#gobStemGold)" stroke-width="0.8" stroke-opacity="0.55"/>',
          '<path d="M13.8 14.2 C12.4 19.8 12.2 25.6 16 32.4 C20.2 40.2 27.4 44 32 44.6 C36.6 44 43.8 40.2 48 32.4 C51.8 25.6 51.6 19.8 50.2 14.2 L13.8 14.2 Z" fill="url(#gobGlass)" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.22"/>',
          '<path d="M20.4 15.6 L19.8 16.6 C19.3 18.8 19 21.6 18.9 24.8 C19.5 21.2 20.2 17.8 21.3 15.6 Z" fill="#ffffff" opacity="0.72"/>',
          '<path d="M41.8 15.8 C42.4 17.8 42.9 21 43 24.4 C42.6 20.8 42.1 18 41.8 16.2 Z" fill="#ffffff" opacity="0.18"/>',
          '<path d="M17.6 20 C21.8 21.4 27 22 32 22 C37 22 42.2 21.4 46.4 20 C45.6 35.6 38.6 42.4 32 43.4 C25.4 42.4 18.4 35.6 17.6 20 Z" fill="url(#gobWineRed)"/>',
          '<path d="M19.2 20.8 C23.4 22.4 27.4 23 32 23 C36.6 23 40.6 22.4 44.8 20.8 C43.4 25.6 38 29.6 32 29.8 C26 29.6 20.6 25.6 19.2 20.8 Z" fill="#ff6472" opacity="0.42"/>',
          '<ellipse cx="32" cy="21.2" rx="8.4" ry="1.1" fill="#ffffff" opacity="0.22"/>',
          '<rect x="30.2" y="44.8" width="3.6" height="9.6" rx="1" fill="url(#gobStemGold)"/>',
          '<path d="M28.6 45.2 L35.4 45.2 L35.8 54.4 L28.2 54.4 Z" fill="url(#gobStemGold)" opacity="0.95"/>',
          '<ellipse cx="32" cy="54.6" rx="14.8" ry="2.6" fill="url(#gobBaseGold)"/>',
          '<ellipse cx="32" cy="54" rx="12.6" ry="1.2" fill="#f6e1a0" opacity="0.45"/>',
          '<ellipse cx="32" cy="55.1" rx="11" ry="0.8" fill="#2a1c06" opacity="0.55"/>',
        '</svg>'
      ].join('');
      document.body.appendChild(g);

      (function bindDrag(){
        var drag = { x: 0, y: 0, startX: 0, startY: 0, dragging: false, moved: false };
        var SAVE_KEY = 'sw_floating_goblet_pos';
        try {
          var saved = localStorage.getItem(SAVE_KEY);
          if (saved) {
            try {
              var pos = JSON.parse(saved);
              if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
                g.style.left = pos.x + 'px';
                g.style.top = pos.y + 'px';
                g.style.right = 'auto';
                g.style.bottom = 'auto';
              }
            } catch(e){}
          }
        } catch(e){}

        function startDrag(ev) {
          var pt = ev.touches ? ev.touches[0] : ev;
          var rect = g.getBoundingClientRect();
          drag.dragging = true; drag.moved = false;
          drag.startX = pt.clientX - rect.left;
          drag.startY = pt.clientY - rect.top;
          g.style.right = 'auto'; g.style.bottom = 'auto';
          if (ev.cancelable) try { ev.preventDefault(); } catch(e){}
        }
        function moveDrag(ev) {
          if (!drag.dragging) return;
          var pt = ev.touches ? ev.touches[0] : ev;
          var maxX = window.innerWidth - g.offsetWidth - 6;
          var maxY = window.innerHeight - g.offsetHeight - 6;
          var nx = Math.max(6, Math.min(maxX, pt.clientX - drag.startX));
          var ny = Math.max(6, Math.min(maxY, pt.clientY - drag.startY));
          var rect = g.getBoundingClientRect();
          if (!drag.moved && (Math.abs(nx - rect.left) > 5 || Math.abs(ny - rect.top) > 5)) drag.moved = true;
          g.style.left = nx + 'px'; g.style.top = ny + 'px';
        }
        function endDrag() {
          if (!drag.dragging) return;
          drag.dragging = false;
          try {
            localStorage.setItem(SAVE_KEY, JSON.stringify({ x: parseFloat(g.style.left || '0'), y: parseFloat(g.style.top || '0') }));
          } catch(e){}
          if (!drag.moved) {
            if (window.showPage) window.showPage('sommelier');
            updateGlobalBottomNav();
          }
        }
        g.addEventListener('mousedown', startDrag, { passive: false });
        window.addEventListener('mousemove', moveDrag);
        window.addEventListener('mouseup', endDrag);
        g.addEventListener('touchstart', startDrag, { passive: false });
        window.addEventListener('touchmove', moveDrag, { passive: false });
        window.addEventListener('touchend', endDrag, { passive: true });
      })();
      return g;
    }

    function ensureFloatingBook() {
      var b = document.getElementById('swFloatingBook');
      if (b) return b;
      b = document.createElement('div');
      b.id = 'swFloatingBook';
      b.className = 'sw-floating-book';
      b.setAttribute('role', 'button');
      b.setAttribute('title', langText('Apri il Manuale di Studio', 'Open Study Manual', 'Ouvrir le Manuel d\'Etude', 'Открыть Учебное Руководство'));
      b.innerHTML = [
        '<svg viewBox="0 0 64 64" role="img" xmlns="http://www.w3.org/2000/svg" aria-label="Libro Manuale di Studio">',
          '<defs>',
            '<linearGradient id="swBkCover" x1="0" x2="1" y1="0" y2="1">',
              '<stop offset="0%" stop-color="#3a1a0e"/>',
              '<stop offset="100%" stop-color="#1c0a04"/>',
            '</linearGradient>',
            '<linearGradient id="swBkSpine" x1="0" x2="1" y1="0" y2="0">',
              '<stop offset="0%" stop-color="#120604"/>',
              '<stop offset="100%" stop-color="#33120a"/>',
            '</linearGradient>',
            '<linearGradient id="swBkPages" x1="0" x2="1" y1="0" y2="0">',
              '<stop offset="0%" stop-color="#efe6cf"/>',
              '<stop offset="100%" stop-color="#d9cdab"/>',
            '</linearGradient>',
            '<linearGradient id="swBkGilt" x1="0" x2="1" y1="0" y2="0">',
              '<stop offset="0%" stop-color="#c5963d"/>',
              '<stop offset="50%" stop-color="#efd27d"/>',
              '<stop offset="100%" stop-color="#a77822"/>',
            '</linearGradient>',
          '</defs>',
          '<circle cx="32" cy="32" r="30" fill="#000000"/>',
          '<g transform="translate(11,13)">',
            '<rect x="0" y="0" width="42" height="38" rx="2" fill="url(#swBkCover)" stroke="#ffffff" stroke-width="0.8" stroke-opacity="0.12"/>',
            '<rect x="0" y="0" width="5.5" height="38" rx="1.2" fill="url(#swBkSpine)"/>',
            '<rect x="4.6" y="0" width="0.7" height="38" fill="#000000" opacity="0.6"/>',
            '<rect x="3.6" y="0" width="0.6" height="38" fill="#e9c56a" opacity="0.35"/>',
            '<path d="M5 2.6 L41 1.8 L41 3 L5 3.8 Z" fill="url(#swBkPages)"/>',
            '<path d="M5 36 L41 35 L41 35.7 L5 36.7 Z" fill="url(#swBkPages)"/>',
            '<rect x="41" y="2.5" width="0.9" height="33" fill="#efe6cf" opacity="0.85"/>',
            '<path d="M41.9 3.2 L42.5 3 L42.5 35.6 L41.9 35.4 Z" fill="#d9cdab"/>',
            '<rect x="9.2" y="7" width="29" height="3.6" rx="1.2" fill="url(#swBkGilt)" opacity="0.85"/>',
            '<text x="23.7" y="10.1" text-anchor="middle" font-family="Georgia, serif" font-size="3.2" font-weight="700" fill="#f6e6bf" letter-spacing="0.8">MANUALE</text>',
            '<rect x="9.2" y="13.2" width="29" height="2.2" rx="0.8" fill="url(#swBkGilt)" opacity="0.6"/>',
            '<text x="23.7" y="20.8" text-anchor="middle" font-family="Georgia, serif" font-size="2.4" font-weight="600" fill="#f4dfa8" letter-spacing="0.7">SOMMELIER</text>',
            '<text x="23.7" y="24.4" text-anchor="middle" font-family="Georgia, serif" font-size="2.3" font-weight="600" fill="#efd48f" letter-spacing="0.7">WORLD</text>',
            '<line x1="10.4" y1="28.4" x2="37.2" y2="28.4" stroke="#a97a24" stroke-width="0.5" opacity="0.85"/>',
            '<line x1="10.4" y1="30.2" x2="37.2" y2="30.2" stroke="#a97a24" stroke-width="0.5" opacity="0.75"/>',
            '<line x1="10.4" y1="32" x2="32.2" y2="32" stroke="#a97a24" stroke-width="0.5" opacity="0.6"/>',
            '<path d="M11 9 C11 7.5 12.6 6.8 14.4 6.8 L32.8 6.8 C34.6 6.8 36.2 7.5 36.2 9" fill="none" stroke="#d2a23e" stroke-width="0.7" opacity="0.65"/>',
            '<rect x="9.2" y="33.6" width="29" height="2.4" rx="1" fill="url(#swBkGilt)" opacity="0.85"/>',
          '</g>',
        '</svg>'
      ].join('');
      document.body.appendChild(b);
      b.addEventListener('click', function(){
        if (window.showPage) window.showPage('study');
        if (typeof window.loadStudyArea === 'function') {
          window.loadStudyArea();
        } else {
          setTimeout(function(){ if (typeof window.loadStudyArea === 'function') window.loadStudyArea(); }, 140);
        }
        if (typeof updateGlobalBottomNav === 'function') updateGlobalBottomNav();
      });
      return b;
    }

    function mount() {
      try {
        document.querySelectorAll('[id^="sw-fab"], #sw-memory-badge').forEach(function(el){
          if (el && el.parentNode) el.parentNode.removeChild(el);
        });
      } catch(e){}
      try { ensureFloatingGoblet(); } catch(e){}
      try { ensureFloatingBook(); } catch(e){}
    }
    if (document.body) mount();
    else document.addEventListener('DOMContentLoaded', mount, { once: true });
    setTimeout(mount, 600);
    setTimeout(mount, 1800);
    setTimeout(mount, 3500);
  })();
})();

(function(){
  try {
    var s = document.createElement('style');
    s.id = 'sw-hard-cleanup-style';
    s.textContent = '#sw-memory-badge,#sw-fab-main,[id^="sw-fab"]{display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important;transform:scale(0) !important;width:0 !important;height:0 !important;overflow:hidden !important;position:absolute !important;left:-9999px !important;top:-9999px !important;}';
    (document.head || document.documentElement).appendChild(s);
  } catch(e){}
  function hardClean() {
    try {
      var sel = '#sw-memory-badge,#sw-fab-main,[id^="sw-fab"]';
      document.querySelectorAll(sel).forEach(function(el){
        if (el && el.parentNode) { try { el.parentNode.removeChild(el); } catch(e){} }
      });
    } catch(e){}
  }
  hardClean();
  if (document.body) {
    hardClean();
  } else {
    document.addEventListener('DOMContentLoaded', hardClean, { once: true });
  }
  try {
    var obs = new MutationObserver(function(muts){
      var hit = false;
      for (var i=0;i<muts.length;i++) {
        var m = muts[i];
        if (m.addedNodes && m.addedNodes.length) {
          for (var j=0;j<m.addedNodes.length;j++) {
            var n = m.addedNodes[j];
            if (n && n.nodeType === 1) {
              var id = (n.id||'').toString();
              if (id === 'sw-memory-badge' || id === 'sw-fab-main' || (id && id.indexOf('sw-fab') === 0)) {
                hit = true; break;
              }
              if (n.querySelector && (n.querySelector('#sw-memory-badge') || n.querySelector('[id^="sw-fab"]'))) {
                hit = true; break;
              }
            }
          }
        }
        if (hit) break;
      }
      if (hit) hardClean();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  } catch(e){}
  for (var k=0;k<10;k++) setTimeout(hardClean, 500 + k*700);
  setTimeout(hardClean, 8000);
  setTimeout(hardClean, 15000);
})();
