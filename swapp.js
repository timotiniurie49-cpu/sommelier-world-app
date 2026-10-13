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

  var _T = window.i18nLang && window.i18nLang();
  var _curLang = (_T && _T.lang) ? _T.lang.toUpperCase() : 'IT';
  var tr = function(it,en,fr,ru){
    return _curLang === 'EN' ? en : (_curLang==='FR' ? fr : (_curLang==='RU' ? ru : it));
  };
  try { window.tr = tr; } catch(_e){}
  try { window._swCurLang = _curLang; } catch(_e){}

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
      articlesTitle: '✦ Storie & Segreti del Vino ✦',
      articlesSub: 'Approfondimenti, aneddoti storici e tecniche di degustazione in due letture premium selezionate.',
      articlesFootnote: '',
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
      articlesTitle: '✦ Wine Stories & Secrets ✦',
      articlesSub: 'Deep dives, historical anecdotes and tasting techniques in two premium selected readings.',
      articlesFootnote: '',
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
      articlesTitle: '✦ Histoires & Secrets du Vin ✦',
      articlesSub: 'Approfondissements, anecdotes historiques et techniques de degustation dans deux lectures premium selectionnees.',
      articlesFootnote: '',
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
      articlesTitle: '✦ Истории и тайны вина ✦',
      articlesSub: 'Глубокие материалы, исторические анекдоты и техники дегустации в двух премиальных статьях.',
      articlesFootnote: '',
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

  try {
    window.CATALOGO_VINI_MONDO = (window.CATALOGO_VINI_MONDO || []).concat(cellarCatalog || []);
  } catch(e) {}

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
      '/* ============================================================ ',
      '   PAGINA PRODUTTORI ( #page-producers )',
      '   ============================================================ */',
      '#page-producers{background:radial-gradient(circle at top, rgba(212,175,55,0.06), transparent 34%),#0a0602;padding:24px 16px 118px;color:#f5efe2;font-family:"Cormorant Garamond",serif;min-height:100vh;}',
      '#page-producers .sw-producers-hero{max-width:1100px;margin:0 auto 18px;padding:22px 20px;border-radius:10px;border:1px solid rgba(212,175,55,.18);background:linear-gradient(135deg,rgba(212,175,55,.10),rgba(124,10,20,.08));}',
      '#page-producers .sw-producers-title{font-family:Cinzel,serif;font-size:clamp(22px,3vw,34px);color:#d4af37;letter-spacing:.12em;text-transform:uppercase;margin:0 0 6px;}',
      '#page-producers .sw-producers-sub{margin:0;color:rgba(245,239,226,.62);font-size:19px;line-height:1.35;max-width:780px;}',
      '#page-producers .sw-producers-group{max-width:1100px;margin:20px auto 0;}',
      '#page-producers .sw-label-etichette{font-family:Cinzel,serif;font-size:.62rem;letter-spacing:.12em;color:rgba(212,175,55,.7);}',
      '.sw-home-v2-etichette-block{margin-top:20px;padding-top:16px;border-top:1px solid rgba(212,175,55,.14);}',
      '.sw-home-v2-etichette-title{font-family:Cinzel,serif;font-size:.64rem;letter-spacing:.18em;color:#d4af37;margin-bottom:14px;}',
      '.sw-home-v2-etichetta{padding:14px 16px;border-radius:10px;border:1px solid rgba(212,175,55,.14);background:rgba(212,175,55,.04);margin-bottom:10px;}',
      '.sw-home-v2-etichetta-head{display:flex;gap:12px;align-items:baseline;justify-content:space-between;flex-wrap:wrap;margin-bottom:4px;}',
      '.sw-home-v2-etichetta-name{font-family:Cinzel,serif;font-size:.96rem;color:#f5efe2;letter-spacing:.02em;}',
      '.sw-home-v2-etichetta-vintage{font-family:"IM Fell English",serif;font-style:italic;color:rgba(245,239,226,.58);font-size:.82rem;}',
      '.sw-home-v2-etichetta-grapes{font-size:.72rem;color:rgba(212,175,55,.65);margin-bottom:6px;}',
      '.sw-home-v2-etichetta-desc{font-size:.88rem;color:rgba(245,239,226,.74);line-height:1.55;}',
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
    var picked = [];

    try {
      var st = getState();
      var seedFallback = [];
      if ((!st || !Array.isArray(st.restaurants) || !st.restaurants.length) && Array.isArray(window.SW_SEED_PRODUCERS) && window.SW_SEED_PRODUCERS.length) {
        seedFallback = window.SW_SEED_PRODUCERS.map(function(r){
          return Object.assign({}, r, { is_restaurant: true, public_card: true });
        });
      }
      var restSource = (st && Array.isArray(st.restaurants) && st.restaurants.length) ? st.restaurants : seedFallback;
      if (restSource && restSource.length) {
        var tutti = restSource.filter(function(r){ return r && r.name && r.slug; });
        var dayN = getDayNumberUTC(new Date());
        var seeded = tutti.slice().sort(function(a,b){
          var va = (((a.slug||'').charCodeAt(0)||0) + dayN * 7) % 100;
          var vb = (((b.slug||'').charCodeAt(0)||0) + dayN * 11) % 100;
          return va - vb;
        });
        var poolPriority = seeded.filter(function(r){ return r.plan === 'elite' || r.plan === 'pro' || r.plan === 'premium'; });
        var pool = (poolPriority.length >= 3 ? poolPriority : seeded).slice(0, Math.min(12, seeded.length));
        for (var j = 0; j < pool.length && picked.length < perDay; j += 1) {
          var r = pool[j];
          var rFull = null;
          try { var raw = LS().getItem('swl_restaurant_' + r.slug); if (raw) rFull = JSON.parse(raw); } catch(_e){ rFull = null; }
          var merged = Object.assign({}, r || {}, rFull || {});
          var regionLine = [r.city, r.region, r.country].filter(Boolean).join(' · ');
          var vd = Array.isArray(r.vini_desc) ? r.vini_desc : (rFull && Array.isArray(rFull.vini_desc) ? rFull.vini_desc : []);
          var grapesRaw = Array.isArray(merged.vitigni) ? merged.vitigni.join(', ') : (merged.vitigni_main || merged.grapes || '');
          var history = (rFull && (rFull.storia || rFull.history)) ? (rFull.storia || rFull.history).toString().split(/\n{2,}/)[0].substring(0,240) : (merged.note || '');
          picked.push(normalizeWineEntry({
            id: 'rest_' + r.slug,
            slug: r.slug,
            is_restaurant: true,
            name: r.name,
            title: r.name,
            country: r.country || r.nazione || '',
            region: r.region || r.regione || '',
            city: r.city || r.citta || '',
            tipology: r.tipology || merged.tipology || 'cantina',
            style: (merged.style || merged.etichette_nr || 'cantina').toString(),
            grapes: grapesRaw,
            image_url: r.img_profile_url || r.img_vineyard_url || r.img_cantina2_url || merged.img_profile || merged.img_cover || '',
            image_alt: r.name + ' ' + regionLine,
            intro: [r.emoji ? r.emoji + '  ' : '', regionLine, grapesRaw ? tr('Vitigni: ', 'Grapes: ', 'Cépages: ', 'Виноград: ') + grapesRaw : ''].filter(Boolean).join(' · '),
            body: history || grapesRaw || regionLine,
            plan: r.plan || 'start',
            etichette: vd.length || merged.etichette_nr || 0
          }, picked.length));
        }
      }
    } catch(e) {}

    if (picked.length < perDay) {
      var need = perDay - picked.length;
      var totalDays = Math.max(1, Math.floor(cellarCatalog.length / perDay));
      var dayBlock = getDayNumberUTC(new Date()) % totalDays;
      for (var i = 0; i < perDay && picked.length < perDay; i += 1) {
        var index = dayBlock + (i * totalDays);
        if (cellarCatalog[index]) picked.push(normalizeWineEntry(cellarCatalog[index], index));
      }
      if (picked.length < perDay && cellarCatalog.length) {
        for (var k = 0; k < cellarCatalog.length && picked.length < perDay; k += 1) {
          picked.push(normalizeWineEntry(cellarCatalog[k], k));
        }
      }
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
  try { window.escapeHtml = escapeHtml; } catch(_e){}

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
        '<section id="homeDailyBlock" class="sw-home-v2-panel">',
          '<div style="max-width:1100px;margin:20px auto 0;padding:0 8px;">',
            '<div style="display:grid;grid-template-columns:1.55fr 1fr;gap:14px;">',
              '<div id="swHomeNewsOfDay" onclick="if(window.openArticleReader&&window._homeNewsArt)window.openArticleReader(window._homeNewsArt)" style="position:relative;min-height:300px;cursor:pointer;overflow:hidden;border-radius:14px;border:1px solid rgba(212,175,55,.28);background:linear-gradient(180deg,rgba(0,0,0,0) 38%, rgba(12,3,1,.96) 100%),url(https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=85) center/cover no-repeat #1a0e07;padding:22px 24px 20px;box-shadow:0 20px 40px rgba(80,10,10,.32);transition:transform .25s;">',
                '<div style="position:absolute;top:14px;left:18px;">',
                  '<div style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;font-family:Cinzel,serif;font-size:.38rem;letter-spacing:2px;background:rgba(220,30,40,.82);color:#fff;border-radius:12px;">🔴 OGGI — NOTIZIA</div>',
                  '<div style="font-family:Cinzel,serif;font-size:.34rem;letter-spacing:2px;color:rgba(245,239,226,.55);margin-top:7px;padding-left:2px;" id="swHomeNewsDate"></div>',
                '</div>',
                '<div style="position:absolute;bottom:18px;left:24px;right:24px;">',
                  '<div id="swHomeNewsCat" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:3px;color:#d4af37;margin-bottom:8px;"> </div>',
                  '<h2 id="swHomeNewsTit" style="font-family:Cormorant Garamond,serif;font-size:1.65rem;line-height:1.22;color:#F5EFE2;margin:0 0 10px;font-weight:600;letter-spacing:.2px;"> </h2>',
                  '<p id="swHomeNewsTxt" style="font-family:IM Fell English,serif;font-style:italic;font-size:.9rem;line-height:1.65;color:rgba(245,239,226,.78);margin:0 0 10px;max-width:72ch;"> </p>',
                  '<div style="font-family:Cinzel,serif;font-size:.4rem;letter-spacing:2px;color:rgba(212,175,55,.8);padding-left:1px;">✦ LEGGI L\'ARTICOLO COMPLETO →</div>',
                '</div>',
              '</div>',
              '<div style="position:relative;min-height:300px;overflow:hidden;border-radius:14px;border:1px solid rgba(200,160,70,.35);background:radial-gradient(ellipse at 30% 0%, rgba(212,175,55,.16), transparent 65%),linear-gradient(180deg, #0e0601 0%, #1a0d02 100%);padding:22px 22px 20px;box-shadow:0 20px 40px rgba(60,35,5,.35);">',
                '<div style="position:absolute;top:14px;right:16px;">',
                  '<div style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;font-family:Cinzel,serif;font-size:.38rem;letter-spacing:2px;background:rgba(212,175,55,.14);color:#E8D89B;border-radius:12px;border:1px solid rgba(212,175,55,.45);">✦ CURIOSITÀ DI OGGI</div>',
                '</div>',
                '<div style="margin-top:48px;">',
                  '<div style="text-align:center;font-size:2.3rem;margin-bottom:12px;" id="swHomeCurEmoji">✨</div>',
                  '<h3 id="swHomeCurTit" style="font-family:Cinzel,serif;font-size:.85rem;line-height:1.45;color:#f8e8b8;margin:0 0 14px;letter-spacing:.6px;text-align:center;"> </h3>',
                  '<p id="swHomeCurTxt" style="font-family:Cormorant Garamond,serif;font-size:1.05rem;line-height:1.78;color:rgba(245,239,226,.85);margin:0;text-align:justify;"> </p>',
                '</div>',
                '<div style="position:absolute;bottom:16px;left:22px;right:22px;font-family:Cinzel,serif;font-size:.34rem;letter-spacing:2.5px;color:rgba(212,175,55,.62);text-align:center;">✦ N° <span id="swHomeCurDayN">0</span> · DEL 2026 ✦</div>',
              '</div>',
            '</div>',
          '</div>',
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
      '</div>'
    ].join('');
    bindHomeEvents(target);
    document.body.classList.add('sw-home-v2-ready');
    ensureOverlay();
    ensureGlobalBottomNav();
    updateGlobalBottomNav();
    if (typeof window.renderHomeDailyBlock === 'function') {
      try { window.renderHomeDailyBlock(); } catch(_e){}
    }
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
          if (item.is_restaurant === true && item.slug) {
            try { window.location.hash = '#producers'; } catch(e){}
            try { window.showPage && window.showPage('producers'); } catch(e){}
            setTimeout(function(){
              try { if (window.swOpenProducerPublic) window.swOpenProducerPublic(item.slug); } catch(e){}
            }, 180);
            return;
          }
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
    var overlay = ensureOverlay();
    try {
      document.body.style.overflow = 'hidden';
      overlay.style.display = 'flex';
    } catch(_e){}
    renderOverlay();
  }
  try { window.openOverlay = openOverlay; } catch(_e){}

  function closeOverlay() {
    state.overlayItem = null;
    var ov = document.getElementById('swHomeV2Overlay');
    if (ov) {
      ov.style.display = 'none';
      var shell = ov.querySelector('.sw-home-v2-overlay-shell');
      if (shell) shell.innerHTML = '';
    }
    try { document.body.style.overflow = ''; } catch(_e){}
  }
  try { window.closeOverlay = closeOverlay; } catch(_e){}

  function renderOverlay() {
    var overlay = ensureOverlay();
    if (!state.overlayItem) return;
    var content = getText(state.overlayItem.item);
    var shell = overlay.querySelector('.sw-home-v2-overlay-shell');

    if (state.overlayItem.kind === 'producer') {
      var r = state.overlayItem.item || {};
      var nameCant = r.name || r.nome || 'Cantina';
      var paese = r.country || r.nazione || r.paese || '';
      var regione = r.region || r.regione || '';
      var citta = r.city || r.citta || '';
      var lineTop = [citta, regione, paese].filter(Boolean).join(' · ');
      var foto = r.img_profile_url || r.img_vineyard_url || r.img_cantina2_url || r.foto || '';
      var storia = String(r.storia || r.history || r.description || '').trim();
      var vitRaw = r.vitigni_main || r.vitigni || r.grapes || '';
      var vitigni = Array.isArray(r.vitigni) ? r.vitigni : (vitRaw.toString().split(/[,，、;]/).map(function(s){return s.trim();}).filter(Boolean));
      var planLabel = r.plan === 'elite' ? '✦ ELITE' : (r.plan === 'pro' || r.plan === 'premium' ? 'PRO' : 'START');
      var planColor = r.plan === 'elite' ? '#d4af37' : (r.plan === 'pro' || r.plan === 'premium' ? '#60a5fa' : '#4ade80');
      var tipIcons = {ristorante:'🍽️', cantina:'🍇', enoteca:'🍾', hotel:'🏨', altro:'📍'};
      var iconTip = tipIcons[r.tipology || 'altro'] || '📍';
      var meta = [];
      if (r.altitudine || r.altitude) meta.push('🏔️ ' + (r.altitudine || r.altitude));
      if (r.suolo || r.soil) meta.push('🌱 ' + (r.suolo || r.soil));
      if (r.founded_year || r.anno_fondazione) meta.push('📅 ' + (r.founded_year || r.anno_fondazione));
      var etichetteCount = (Array.isArray(r.vini_desc) ? r.vini_desc.length : 0) || (r.etichette_nr || r.catalog_labels || r.labels_count || 0);
      if (etichetteCount) meta.push('🍾 ' + tr('Etichette','Labels','Étiquettes','Этикетки') + ': ' + etichetteCount);
      if (r.certificazioni || r.certifications) {
        var cArr = Array.isArray(r.certificazioni) ? r.certificazioni : (Array.isArray(r.certifications) ? r.certifications : (r.certificazioni || r.certifications || '').toString().split(/[,，、;]/).map(function(s){return s.trim();}).filter(Boolean));
        if (cArr.length) meta.push('✅ ' + cArr.join(', '));
      }
      var etichetteHtml = '';
      if (Array.isArray(r.vini_desc) && r.vini_desc.length) {
        var rows = [];
        for (var wvi = 0; wvi < r.vini_desc.length; wvi++) {
          var wv = r.vini_desc[wvi] || {};
          var wvName = String(wv.name || wv.nome || wv.label || 'Etichetta ' + (wvi+1)).trim();
          var wvVintage = String(wv.vintage || wv.annata || (wv.sans_annee === true ? 's.a.' : '')).trim();
          var wvGrapes = String(wv.grapes || wv.vitigni || '').trim();
          var wvDesc = String(wv.description || wv.descrizione || wv.note || '').trim();
          rows.push([
            '<div class="sw-home-v2-etichetta">',
              '<div class="sw-home-v2-etichetta-head">',
                '<span class="sw-home-v2-etichetta-name">', escapeHtml(wvName), '</span>',
                wvVintage ? '<span class="sw-home-v2-etichetta-vintage">· ' + escapeHtml(wvVintage) + '</span>' : '',
              '</div>',
              wvGrapes ? '<div class="sw-home-v2-etichetta-grapes">🍇 ' + escapeHtml(wvGrapes) + '</div>' : '',
              wvDesc ? '<div class="sw-home-v2-etichetta-desc">' + escapeHtml(wvDesc).replace(/\n/g,'<br>') + '</div>' : '',
            '</div>'
          ].join(''));
        }
        etichetteHtml = [
          '<div class="sw-home-v2-etichette-block">',
            '<div class="sw-home-v2-etichette-title">🍾 ' + tr('LE NOSTRE ETICHETTE','OUR LABELS','NOS ÉTIQUETTES','НАШИ ЭТИКЕТКИ') + ' · ' + r.vini_desc.length + '</div>',
            rows.join(''),
          '</div>'
        ].join('');
      }
      shell.innerHTML = [
        '<div class="sw-home-v2-overlay-top" style="align-items:flex-start;flex-wrap:wrap;gap:12px;">',
          '<div style="flex:1;min-width:220px;">',
            '<div class="sw-home-v2-overlay-kind" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">',
              '<span style="padding:2px 8px;border-radius:4px;background:rgba(212,175,55,.14);border:1px solid rgba(212,175,55,.3);color:#d4af37;font-size:.52rem;letter-spacing:.1em;">🏆 ' + tr('SCHEDA PRODUTTORE','PRODUCER CARD','FICHE PRODUCTEUR','КАРТОЧКА ПРОИЗВОДИТЕЛЯ') + '</span>',
              '<span style="padding:2px 8px;border-radius:4px;border:1px solid '+planColor+';color:'+planColor+';">'+iconTip+' '+planLabel+'</span>',
            '</div>',
            '<h2 style="margin-top:10px;font-family:\'Playfair Display\',serif;">', escapeHtml(nameCant), '</h2>',
            lineTop ? '<div style="font-family:\'IM Fell English\',serif;font-style:italic;color:rgba(245,239,226,.55);margin-top:4px;">'+escapeHtml(lineTop)+'</div>' : '',
          '</div>',
          '<div class="sw-home-v2-overlay-lang" style="gap:4px;">',
            langButton('it', 'ITA'), langButton('en', 'ENG'), langButton('fr', 'FRA'), langButton('ru', 'RUS'),
          '</div>',
        '</div>',
        '<div class="sw-home-v2-overlay-media" style="max-height:320px;">' + (foto ? '<img src="'+escapeHtml(foto)+'" alt="'+escapeHtml(nameCant)+'" loading="lazy" style="width:100%;max-height:320px;object-fit:cover;border-radius:10px;" onerror="this.parentNode.style.display=\'none\'">' : '<div style="height:180px;border-radius:10px;background:linear-gradient(135deg,rgba(212,175,55,.18),rgba(0,0,0,.4));display:flex;align-items:center;justify-content:center;font-size:3rem;">'+iconTip+'</div>') + '</div>',
        meta.length ? '<div style="margin:14px 0 6px;display:flex;flex-wrap:wrap;gap:6px;">'+meta.map(function(m){return '<span style="padding:4px 10px;border-radius:20px;background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.18);color:rgba(245,239,226,.78);font-size:.68rem;">'+escapeHtml(m)+'</span>';}).join('')+'</div>' : '',
        vitigni && vitigni.length ? '<p class="sw-home-v2-overlay-intro" style="margin-top:6px;"><strong style="color:#d4af37;">🍇 '+tr('Vitigni','Grapes','Cépages','Сорта винограда')+':</strong> '+escapeHtml(vitigni.join(' · '))+'</p>' : '',
        storia ? '<div class="sw-home-v2-overlay-body"><h3 style="font-family:Cinzel,serif;color:#d4af37;font-size:.64rem;letter-spacing:.15em;margin-bottom:8px;">📜 '+tr('LA STORIA','HISTORY','HISTOIRE','ИСТОРИЯ')+'</h3>'+storia.split(/\n{2,}/).filter(function(p){return p.trim();}).map(function(p){return '<p style="line-height:1.72;">'+escapeHtml(p.replace(/\n/g,'<br>'))+'</p>';}).join('')+'</div>' : '',
        etichetteHtml,
        (r.sito_web || r.website || r.instagram || r.facebook) ? '<div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(212,175,55,.14);display:flex;gap:10px;flex-wrap:wrap;">' +
          (r.sito_web || r.website ? '<a href="'+escapeHtml(r.sito_web || r.website)+'" target="_blank" rel="noopener noreferrer" style="padding:8px 14px;border-radius:8px;border:1px solid rgba(212,175,55,.3);color:#d4af37;font-family:Cinzel,serif;font-size:.56rem;letter-spacing:.12em;text-decoration:none;">🌐 '+tr('Sito','Site','Site','Сайт')+'</a>' : '') +
          (r.instagram ? '<a href="'+escapeHtml(r.instagram)+'" target="_blank" rel="noopener noreferrer" style="padding:8px 14px;border-radius:8px;border:1px solid rgba(236,72,153,.3);color:#ec4899;font-family:Cinzel,serif;font-size:.56rem;letter-spacing:.12em;text-decoration:none;">📸 Instagram</a>' : '') +
          (r.facebook ? '<a href="'+escapeHtml(r.facebook)+'" target="_blank" rel="noopener noreferrer" style="padding:8px 14px;border-radius:8px;border:1px solid rgba(59,130,246,.3);color:#60a5fa;font-family:Cinzel,serif;font-size:.56rem;letter-spacing:.12em;text-decoration:none;">📘 Facebook</a>' : '') +
        '</div>' : '',
        '<div class="sw-home-v2-actions" style="margin-top:22px;justify-content:flex-end;">',
          '<button type="button" class="sw-home-v2-button" id="swHomeCloseBtn">✕ '+escapeHtml(tr('Chiudi','Close','Fermer','Закрыть'))+'</button>',
        '</div>'
      ].join('');
      shell.querySelectorAll('[data-set-lang]').forEach(function(btn){ btn.onclick = function() { setLang(btn.getAttribute('data-set-lang')); }; });
      var cbs = shell.querySelectorAll('#swHomeBackBtn, #swHomeCloseBtn');
      cbs.forEach(function(b){ b.onclick = closeOverlay; });
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      updateGlobalBottomNav();
      return;
    }

    if (state.overlayItem.kind === 'custom') {
      var htmlCust = state.overlayItem.item || {};
      shell.innerHTML = [
        '<div class="sw-home-v2-overlay-top" style="align-items:flex-start;flex-wrap:wrap;gap:10px;">',
          '<div style="flex:1;min-width:200px;">',
            '<h2 style="margin-top:6px;font-family:\'Playfair Display\',serif;font-size:1.2rem;">', escapeHtml(htmlCust.title || 'Info'), '</h2>',
          '</div>',
          '<div class="sw-home-v2-overlay-lang" style="gap:4px;">',
            langButton('it', 'ITA'), langButton('en', 'ENG'), langButton('fr', 'FRA'), langButton('ru', 'RUS'),
          '</div>',
        '</div>',
        '<div style="margin:14px 0 4px;">', String(htmlCust.html || '').trim(), '</div>',
        '<div class="sw-home-v2-actions" style="justify-content:flex-end;margin-top:18px;">',
          '<button type="button" class="sw-home-v2-button" id="swHomeCloseBtnCustom">✕ '+escapeHtml(tr('Chiudi','Close','Fermer','Закрыть'))+'</button>',
        '</div>'
      ].join('');
      shell.querySelectorAll('[data-set-lang]').forEach(function(btn){ btn.onclick = function() { setLang(btn.getAttribute('data-set-lang')); }; });
      var cl = shell.querySelector('#swHomeCloseBtnCustom');
      if (cl) cl.onclick = closeOverlay;
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
      updateGlobalBottomNav();
      return;
    }

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
    if (overlay) {
      overlay.classList.remove('visible');
      overlay.style.display = 'none';
      var shell = overlay.querySelector('.sw-home-v2-overlay-shell');
      if (shell) shell.innerHTML = '';
    }
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
      '/* Nascondi floating icons in Area Ristoranti / Dashboard */',
      '#page-dashboard.active ~ .sw-floating-goblet,',
      '#page-dashboard.active ~ .sw-floating-book,',
      'body.sw-in-dashboard .sw-floating-goblet,',
      'body.sw-in-dashboard .sw-floating-book{ display:none !important; }',
      '/* Floating Goblet Draggable */',
      '.sw-floating-goblet{',
      '  position:fixed;right:18px;bottom:88px;width:58px;height:58px;border-radius:50%;',
      '  background:radial-gradient(circle at 28% 26%, #fff8f5 0%, #f3e7df 62%, #e6d5c9 100%);',
      '  border:2px solid rgba(150,30,40,0.55);',
      '  box-shadow:0 12px 30px rgba(80,10,15,.32), 0 0 0 1px rgba(0,0,0,.08), inset 0 2px 6px rgba(255,255,255,.65);',
      '  z-index:1099;display:flex;align-items:center;justify-content:center;',
      '  cursor:grab;touch-action:none;user-select:none;',
      '  transition:box-shadow .2s ease, transform .2s ease, border-color .2s ease;overflow:hidden;',
      '}',
      '.sw-floating-goblet:active{cursor:grabbing;}',
      '.sw-floating-goblet:hover{',
      '  border-color:rgba(180,20,30,.85);',
      '  box-shadow:0 18px 40px rgba(80,10,15,.45), 0 0 0 1px rgba(0,0,0,.1), inset 0 2px 6px rgba(255,255,255,.75);transform:translateY(-2px);',
      '}',
      '.sw-floating-goblet svg{width:54px;height:54px;display:block;}',
      'body.sw-os-windows .sw-floating-goblet{right:26px;bottom:96px;width:66px;height:66px;}',
      'body.sw-os-windows .sw-floating-goblet svg{width:62px;height:62px;}',
      '@media (max-width: 859px){.sw-floating-goblet{right:12px;bottom:76px;width:52px;height:52px;}.sw-floating-goblet svg{width:48px;height:48px;}}',
      '/* Floating Book FISSO — HOME ONLY + colore chiaro studio */',
      '.sw-floating-book{',
      '  position:fixed;left:18px;bottom:88px;width:58px;height:58px;border-radius:50%;',
      '  background:linear-gradient(135deg, #fbf6e8 0%, #f2e6c8 45%, #e5d3a2 100%);',
      '  border:2px solid rgba(180,140,60,0.55);',
      '  box-shadow:0 12px 30px rgba(90,60,15,.28), 0 0 0 1px rgba(0,0,0,.07), inset 0 2px 6px rgba(255,255,255,.8);',
      '  z-index:1098;display:flex;align-items:center;justify-content:center;',
      '  cursor:pointer;touch-action:manipulation;user-select:none;',
      '  transition:box-shadow .2s ease, transform .2s ease, border-color .2s ease;overflow:hidden;',
      '}',
      '.sw-floating-book:hover{',
      '  border-color:rgba(180,140,60,.85);',
      '  box-shadow:0 18px 40px rgba(90,60,15,.42), 0 0 0 1px rgba(0,0,0,.1), inset 0 2px 6px rgba(255,255,255,.9);transform:translateY(-2px);',
      '}',
      '.sw-floating-book svg{width:48px;height:48px;display:block;}',
      '@media (max-width: 859px){.sw-floating-book{left:12px;bottom:76px;width:52px;height:52px;}.sw-floating-book svg{width:44px;height:44px;}}'
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
            '<radialGradient id="swGobletRed5" cx="50%" cy="45%" r="55%">',
              '<stop offset="0%" stop-color="#ff6b7e"/>',
              '<stop offset="55%" stop-color="#cf1e32"/>',
              '<stop offset="100%" stop-color="#7a0216"/>',
            '</radialGradient>',
            '<radialGradient id="swGobletBase5" cx="50%" cy="40%" r="60%">',
              '<stop offset="0%" stop-color="#6f7680"/>',
              '<stop offset="100%" stop-color="#2f353d"/>',
            '</radialGradient>',
          '</defs>',
          /* Bicchiere = COPPE rossa (tipo screenshot emoji): */
          /* Coppa esterna contorno + rosso */
          '<path d="M14.5 13.2 C13.6 19 14 24.8 16.5 31.2 C19 38.4 25.3 41.2 32 41.2 C38.7 41.2 45 38.4 47.5 31.2 C50 24.8 50.4 19 49.5 13.2 Z"',
            ' fill="url(#swGobletRed5)" stroke="#1f1515" stroke-width="2.1" stroke-linejoin="round"/>',
          /* Riflesso bianco sulla sinistra (punto luce) */
          '<path d="M20.4 15 C19.6 18 19.4 21.6 20 25.4 C22 23.8 23.8 20.2 25 15 Z" fill="#ffffff" opacity="0.92"/>',
          /* Linea orizzontale lucentezza superficie vino */
          '<path d="M17.6 24 C23.2 25.2 27.2 25.5 32 25.5 C36.8 25.5 40.8 25.2 46.4 24 C45.2 30.8 39.6 38.6 32 38.6 C24.4 38.6 18.8 30.8 17.6 24 Z" fill="#ff8c9a" opacity="0.55"/>',
          /* Stelo */
          '<rect x="29.4" y="41.4" width="5.2" height="8.2" rx="1.3" fill="#2b2b2b" stroke="#121212" stroke-width="1.3"/>',
          /* Base ovale */
          '<ellipse cx="32" cy="51.4" rx="14.2" ry="3.6" fill="url(#swGobletBase5)" stroke="#0e0e0e" stroke-width="1.6"/>',
          /* Luce sulla base */
          '<rect x="20.8" y="50.7" width="22.4" height="1.2" rx="0.6" fill="#ffffff" opacity="0.38"/>',
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
              var winW = window.innerWidth || 1280;
              var winH = window.innerHeight || 720;
              var minX = Math.max(12, winW - 160);
              var minY = Math.max(12, winH - 200);
              if (pos && typeof pos.x === 'number' && typeof pos.y === 'number'
                  && pos.x > 4 && pos.y > 4
                  && pos.x <= winW - 20 && pos.y <= winH - 20
                  && !(pos.x < 100 && pos.y < 100)) {
                g.style.left = pos.x + 'px';
                g.style.top = pos.y + 'px';
                g.style.right = 'auto';
                g.style.bottom = 'auto';
              } else {
                try { localStorage.removeItem(SAVE_KEY); } catch(_){}
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
            '<linearGradient id="swBkCoverLt" x1="0" x2="1" y1="0" y2="1">',
              '<stop offset="0%" stop-color="#f5ecd3"/>',
              '<stop offset="55%" stop-color="#e6d2a5"/>',
              '<stop offset="100%" stop-color="#c8a664"/>',
            '</linearGradient>',
            '<linearGradient id="swBkSpineLt" x1="0" x2="1" y1="0" y2="0">',
              '<stop offset="0%" stop-color="#8a6628"/>',
              '<stop offset="100%" stop-color="#b58841"/>',
            '</linearGradient>',
            '<linearGradient id="swBkPagesLt" x1="0" x2="1" y1="0" y2="0">',
              '<stop offset="0%" stop-color="#fffaf0"/>',
              '<stop offset="100%" stop-color="#f0e4c8"/>',
            '</linearGradient>',
            '<linearGradient id="swBkGiltLt" x1="0" x2="1" y1="0" y2="0">',
              '<stop offset="0%" stop-color="#d4a84a"/>',
              '<stop offset="50%" stop-color="#f6dd8a"/>',
              '<stop offset="100%" stop-color="#b38a2e"/>',
            '</linearGradient>',
            '<radialGradient id="swBkShine" cx="30%" cy="26%" r="70%">',
              '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>',
              '<stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>',
            '</radialGradient>',
          '</defs>',
          /* Libro aperto / semi-aperto design elegante chiaro */
          '<g transform="translate(11,13)">',
            /* Pages edge on right */
            '<path d="M41.5 3 L43 2.8 L43 35.2 L41.5 35 Z" fill="url(#swBkPagesLt)" opacity="0.95"/>',
            /* Cover principale */
            '<rect x="0" y="0" width="42" height="38" rx="2.2" fill="url(#swBkCoverLt)" stroke="#8a6628" stroke-width="1.4"/>',
            /* Lucentezza copertina (dà sensazione di cartolucida/cuoio chiaro) */
            '<rect x="0.1" y="0.1" width="41.8" height="37.8" rx="2.1" fill="url(#swBkShine)"/>',
            /* Dorso libro */
            '<rect x="0" y="0" width="5.8" height="38" rx="1.4" fill="url(#swBkSpineLt)"/>',
            /* Linee decorative dorso */
            '<rect x="4.7" y="0" width="0.9" height="38" fill="#000000" opacity="0.28"/>',
            '<rect x="3.7" y="0" width="0.6" height="38" fill="#fff3c5" opacity="0.65"/>',
            /* Testi superiori e inferiori pagina */
            '<path d="M5 2.8 L41 2 L41 3.2 L5 4 Z" fill="url(#swBkPagesLt)"/>',
            '<path d="M5 35.4 L41 34.6 L41 35.2 L5 36 Z" fill="url(#swBkPagesLt)"/>',
            /* Fascia dorata alta */
            '<rect x="8.2" y="6.6" width="30" height="3.2" rx="1.2" fill="url(#swBkGiltLt)" opacity="0.92"/>',
            '<text x="23.2" y="9" text-anchor="middle" font-family="Georgia, serif" font-size="2.9" font-weight="700" fill="#6a4a10" letter-spacing="1.1">MANUALE</text>',
            /* Fascia dorata media */
            '<rect x="8.2" y="12.2" width="30" height="2" rx="0.8" fill="url(#swBkGiltLt)" opacity="0.65"/>',
            /* Titolo centrale stilizzato */
            '<text x="23.2" y="19.8" text-anchor="middle" font-family="Georgia, serif" font-size="2.5" font-weight="700" fill="#7a5316" letter-spacing="0.8">SOMMELIER</text>',
            '<text x="23.2" y="23.4" text-anchor="middle" font-family="Georgia, serif" font-size="2.4" font-weight="700" fill="#7a5316" letter-spacing="0.8">WORLD</text>',
            /* Righe per simulare pagine/scritte */
            '<line x1="9.6" y1="27.4" x2="36.4" y2="27.4" stroke="#9c7228" stroke-width="0.5" opacity="0.88"/>',
            '<line x1="9.6" y1="29.2" x2="36.4" y2="29.2" stroke="#9c7228" stroke-width="0.5" opacity="0.78"/>',
            '<line x1="9.6" y1="31" x2="31.4" y2="31" stroke="#9c7228" stroke-width="0.5" opacity="0.65"/>',
            /* Arricciatura copertina (curva top) */
            '<path d="M10 8.6 C10 7.2 11.6 6.6 13.4 6.6 L31.8 6.6 C33.6 6.6 35.2 7.2 35.2 8.6" fill="none" stroke="#c18f38" stroke-width="0.75" opacity="0.75"/>',
            /* Fascia dorata bassa + foglia */
            '<rect x="8.2" y="32.6" width="30" height="2.6" rx="1" fill="url(#swBkGiltLt)" opacity="0.92"/>',
            '<text x="23.2" y="34.5" text-anchor="middle" font-family="Georgia, serif" font-size="2" fill="#6a4a10" letter-spacing="0.6">◆ STUDIO ◆</text>',
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

    function inDashboard() {
      try {
        var pd = document.getElementById('page-dashboard');
        if (pd && pd.classList && pd.classList.contains('active')) return true;
        var hash = (location.hash || '').toLowerCase();
        if (hash.indexOf('dashboard') >= 0) return true;
      } catch(e){}
      return false;
    }

    function mount() {
      try {
        document.querySelectorAll('[id^="sw-fab"], #sw-memory-badge').forEach(function(el){
          if (el && el.parentNode) el.parentNode.removeChild(el);
        });
      } catch(e){}
      try { ensureFloatingGoblet(); } catch(e){}
      try { ensureFloatingBook(); } catch(e){}
      try {
        if (inDashboard()) document.body.classList.add('sw-in-dashboard');
        else document.body.classList.remove('sw-in-dashboard');
      } catch(e){}
    }

    if (document.body) mount();
    else document.addEventListener('DOMContentLoaded', mount, { once: true });
    setTimeout(mount, 600);
    setTimeout(mount, 1800);
    setTimeout(mount, 3500);
    window.addEventListener('hashchange', function(){ setTimeout(mount, 200); });
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

/* ============================================================
   REGISTRAZIONE PUBBLICA CANTINE & RISTORANTI (MONDO, 4 LINGUE)
   + SEZIONE HOME: RICERCA CARTE PUBBLICHE + SPOT ELITE
   ============================================================ */
(function(){
  try {
    var T = window.i18nLang && window.i18nLang();
    var curLang = (T && T.lang) ? T.lang.toUpperCase() : 'IT';
    var tr = function(it,en,fr,ru){
      return curLang === 'EN' ? en : (curLang==='FR' ? fr : (curLang==='RU' ? ru : it));
    };
    try { window.tr = tr; } catch(_e){}
    var escapeHtml = window.escapeHtml || function(value){
      return String(value || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    };
    var openOverlay = window.openOverlay || function(){};
    var closeOverlay = window.closeOverlay || function(){};

    /* ----------- HELPERS generici ----------- */
    function slugify(s) {
      return (s||'').toString().toLowerCase()
        .replace(/[àáâãäåāąă]/g,'a').replace(/[æ]/g,'ae')
        .replace(/[çćčĉċ]/g,'c').replace(/[ðđ]/g,'d')
        .replace(/[èéêëēęě]/g,'e').replace(/[ģğ]/g,'g')
        .replace(/[ĥ]/g,'h')
        .replace(/[ìíîïīĩ]/g,'i').replace(/[ı]/g,'i')
        .replace(/[ĵ]/g,'j').replace(/[ķ]/g,'k').replace(/[ĺľļł]/g,'l')
        .replace(/[ñńņň]/g,'n')
        .replace(/[òóôõöøōőŏ]/g,'o').replace(/[œ]/g,'oe')
        .replace(/[ŕřŗ]/g,'r').replace(/[śšşșŝ]/g,'s')
        .replace(/[ťţț]/g,'t').replace(/[þ]/g,'th')
        .replace(/[ùúûüűūů]/g,'u').replace(/[ýÿ]/g,'y')
        .replace(/[źżž]/g,'z')
        .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').substring(0, 72) || 'area-' + Math.floor(Math.random()*9000+1000);
    }
    function LS() { return window.localStorage; }

    /* ===== SWL Cloudflare Worker Sync (offline-first, best-effort upload only) ===== */
    window.SWL_WORKER_BASE = (typeof window.SWL_WORKER_BASE === 'string' && window.SWL_WORKER_BASE.length)
      ? window.SWL_WORKER_BASE
      : 'https://hidden-term-f2d0.timotiniurie49.workers.dev';

    window._swlFetch = function(path, opts, timeoutMs) {
      timeoutMs = typeof timeoutMs === 'number' ? timeoutMs : 3000;
      var base = (window.SWL_WORKER_BASE || '').replace(/\/+$/, '');
      if (!base) return Promise.resolve(null);
      var ctrl = null;
      try { ctrl = (typeof AbortController === 'function') ? new AbortController() : null; } catch(e) {}
      var to = null;
      var p = fetch(base + path, Object.assign({}, opts || {}, { signal: ctrl ? ctrl.signal : void 0 }))
        .then(function(r){ return r.json && r.json().catch(function(){ return null; }); return null; })
        .catch(function(){ return null; })
        .then(function(data){ if (to) { clearTimeout(to); to = null; } return data; });
      if (ctrl) to = setTimeout(function(){ try { ctrl.abort(); } catch(e){} }, timeoutMs);
      return p;
    };

    function getState() {
      try {
        var ls = LS();
        var raw = ls ? (ls.getItem('swl_master_state') || '{}') : '{}';
        return JSON.parse(raw) || { restaurants: [] };
      } catch(e){ return { restaurants: [] }; }
    }
    function setState(s) {
      try { LS().setItem('swl_master_state', JSON.stringify(s)); } catch(e){}
      try {
        window._swlFetch('/api/swl/master_state', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(s || { restaurants: [] })
        }, 3500).catch(function(){});
      } catch(e){}
    }
    function saveRest(r) {
      try { LS().setItem('swl_restaurant_' + r.slug, JSON.stringify(r)); } catch(e){}
      try { LS().setItem('swl_wines_' + r.slug, JSON.stringify([])); } catch(e){}
      try {
        if (r && r.slug) {
          window._swlFetch('/api/swl/restaurants/' + encodeURIComponent(r.slug), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(r || {})
          }, 3500).catch(function(){});
        }
      } catch(e){}
    }

    /* ============================================================
       REGISTRAZIONE PUBBLICA - registerRestaurant() globale
       ============================================================ */
    window.registerRestaurant = function() {
      var el = function(id){ return document.getElementById(id); };
      var status = el('regStatus');
      var name = ((el('regName') || {}).value || '').trim();
      var tip = (el('regTipology') || {}).value || 'ristorante';
      var cur = (el('regCurrency') || {}).value || 'EUR';
      var city = (el('regCity') || {}).value || '';
      var region = (el('regRegion') || {}).value || '';
      var country = (el('regCountry') || {}).value || '';
      var address = (el('regAddress') || {}).value || '';
      var email = (el('regEmail') || {}).value || '';
      var pwd = (el('regPwd') || {}).value || '';
      var pub = (el('regPublic') || {}).checked === true;
      var storia = ((el('regStoria') || {}).value || '').substring(0, 2000);
      var imgProfile = (el('regImgProfile') || {}).value || '';
      var imgCover = (el('regImgCover') || {}).value || '';
      var emoji = ((el('regEmoji') || {}).value || '').substring(0, 4);
      var terrain = (el('regTerrain') || {}).value || '';
      var grapes = (el('regGrapes') || {}).value || '';
      var wineCount = parseInt((el('regWineCount') || {}).value || '0', 10);
      var certs = (el('regCerts') || {}).value || '';
      var founded = (el('regFounded') || {}).value || '';
      var website = (el('regWebsite') || {}).value || '';
      var social = (el('regSocial') || {}).value || '';

      if (!name || !city || !country || !email || pwd.length < 6) {
        status.style.color = '#f88';
        status.textContent = tr(
          'Completa tutti i campi. La password deve essere di almeno 6 caratteri.',
          'Please fill in all fields. Password must be at least 6 characters.',
          'Merci de remplir tous les champs. Le mot de passe doit contenir au moins 6 caractères.',
          'Заполните все поля. Пароль должен содержать минимум 6 символов.'
        );
        return;
      }

      var slug = slugify(name);
      var st = getState();
      if (!st || !Array.isArray(st.restaurants)) st = { restaurants: [] };
      var dup = st.restaurants.find(function(x){ return x.slug === slug; });
      if (dup) slug = slug + '-' + Math.floor(Math.random()*900+100);

      var rest = {
        slug: slug,
        name: name,
        tipology: tip,
        currency: cur,
        city: city,
        region: region || country,
        country: country,
        address: address,
        email: email,
        password_hash: 'pwd',
        plan: 'start',
        wines: wineCount || 0,
        public_card: pub === true,
        created_at: Date.now(),
        lang: curLang.toLowerCase(),
        description: storia,
        story: storia,
        img_profile: imgProfile,
        img_cover: imgCover,
        emoji: emoji,
        terrain: terrain,
        grapes: grapes,
        wine_count: isNaN(wineCount) ? 0 : wineCount,
        certifications: certs,
        founded_year: founded,
        website: website,
        social: social
      };
      saveRest(rest);

      st.restaurants.push(rest);
      setState(st);

      status.style.color = '#a7f3d0';
      status.innerHTML = '✅ ' + tr('Attendere···', 'Loading…', 'Patientez…', 'Загрузка…');

      setTimeout(function(){
        if (window.location) {
          try {
            window.location.hash = '#dashboard';
            window.setSession && window.setSession({
              slug: slug,
              email: email,
              at: Date.now(),
              superAdmin: false,
              plan: 'start'
            });
          } catch(e){}
          try {
            if (window.location && window.location.reload) setTimeout(function(){ window.location.reload(); }, 400);
          } catch(e){}
        }
      }, 700);

      try {
        window.showPage && window.showPage('dashboard');
      } catch(e){}
    };

    (function bindRegStoriaCounter() {
      function attach() {
        var ta = document.getElementById('regStoria');
        var cnt = document.getElementById('regStoriaCnt');
        if (!ta || !cnt) return false;
        function update() {
          var v = (ta.value || '').substring(0, 2000);
          ta.value = v;
          cnt.textContent = v.length;
        }
        ta.addEventListener('input', update);
        update();
        return true;
      }
      if (!attach()) {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', attach, { once: true });
        } else {
          var tries = 0;
          var tm = setInterval(function(){
            if (attach() || ++tries > 20) clearInterval(tm);
          }, 250);
        }
      }
    })();

    /* ============================================================
       SEZIONE HOME: RICERCA CARTE PUBBLICHE + SPOT ELITE
       ============================================================ */
    window.buildCardSearchSection = function() {
      var sectionId = 'sw-home-cardsearch';
      var box = document.getElementById(sectionId);
      if (!box) return;

      var st = getState();
      var all = (st && Array.isArray(st.restaurants)) ? st.restaurants : [];
      var pubblici = all.filter(function(r){ return r && r.public_card === true; });

      // Spot ELITE (priorità): quelli con plan === 'elite' OR primi 1)
      var elites = pubblici.filter(function(r){ return r.plan === 'elite'; });
      var spot = elites[0] || pubblici[0] || null;

      var tipIcons = {
        ristorante: '🍽️', cantina: '🍇', enoteca: '🍾', hotel: '🏨', altro: '📍'
      };
      function cardHtml(r) {
        var t = r.tipology || 'altro';
        var icon = tipIcons[t] || '📍';
        return [
          '<a href="#dashboard" data-sw-slug="' + r.slug + '" class="sw-card-grid-item"',
          ' style="display:block;padding:16px 14px;text-decoration:none;color:inherit;border:1px solid rgba(212,175,55,.18);border-radius:10px;background:rgba(212,175,55,.04);transition:all .25s;cursor:pointer;"',
          ' onmouseover="this.style.borderColor=\'rgba(212,175,55,.5)\';this.style.background=\'rgba(212,175,55,.09)\';"',
          ' onmouseout="this.style.borderColor=\'rgba(212,175,55,.18)\';this.style.background=\'rgba(212,175,55,.04)\';"',
          ' onclick="event.preventDefault();window.swOpenCard(\'' + r.slug + '\');">',
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">',
              '<div style="display:flex;align-items:center;gap:8px;">',
                '<div style="width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.25);">' + icon + '</div>',
                '<div style="min-width:0;">',
                  '<div style="font-family:Cinzel,serif;font-size:.78rem;color:#e8e2cc;letter-spacing:.02em;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px;">' + (r.name || '') + '</div>',
                  '<div style="font-size:.68rem;color:rgba(245,239,226,.55);margin-top:2px;">' + (r.city || '') + (r.city && r.region ? ' · ' : '') + (r.region || '') + '</div>',
                '</div>',
              '</div>',
              (r.plan === 'elite' ? '<div style="flex-shrink:0;padding:2px 6px;border-radius:4px;background:linear-gradient(180deg,#f2dfa3,#c7a84e);color:#3a2a08;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:.12em;box-shadow:0 1px 6px rgba(212,175,55,.4);">✦ ELITE</div>' : (r.plan === 'pro' ? '<div style="flex-shrink:0;padding:2px 6px;border-radius:4px;background:rgba(59,130,246,.15);color:#93c5fd;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:.12em;border:1px solid rgba(59,130,246,.25);">PRO</div>' : '<div style="flex-shrink:0;padding:2px 6px;border-radius:4px;background:rgba(74,222,128,.1);color:#86efac;font-family:Cinzel,serif;font-size:.44rem;letter-spacing:.12em;border:1px solid rgba(74,222,128,.2);">START</div>')),
            '</div>',
            '<div style="display:flex;gap:6px;align-items:center;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px dashed rgba(212,175,55,.1);">',
              '<div style="font-size:.62rem;color:rgba(212,175,55,.65);">🍾 ' + (r.wines || 0) + ' ' + tr('vini','wines','vins','вин') + '</div>',
              '<div style="font-size:.62rem;color:#d4af37;font-weight:600;">' + tr('VEDI CARTA →','VIEW CARD →','VOIR CARTE →','СМОТРЕТЬ →') + '</div>',
            '</div>',
          '</a>'
        ].join('');
      }

      var spotHtml = '';
      if (spot) {
        var icon = tipIcons[spot.tipology||'altro'] || '📍';
        spotHtml = [
          '<div style="margin:4px 0 24px;position:relative;overflow:hidden;border-radius:14px;border:1.5px solid rgba(212,175,55,.45);background:linear-gradient(135deg,rgba(212,175,55,.16),rgba(212,175,55,.03) 50%,rgba(124,10,20,.12));padding:22px 20px;box-shadow:0 8px 32px rgba(0,0,0,.35);">',
            '<div style="position:absolute;top:10px;right:12px;padding:3px 9px;border-radius:4px;background:linear-gradient(180deg,#f4d58e,#c99f3a);color:#3a2a08;font-family:Cinzel,serif;font-size:.46rem;letter-spacing:.14em;box-shadow:0 2px 10px rgba(212,175,55,.35);">✦ ' + tr('SPONSORIZZATO · ELITE','SPONSORED · ELITE','SPONSORISÉ · ÉLITE','СПОНСОР · ELITE') + '</div>',
            '<div style="display:flex;align-items:center;gap:16px;">',
              '<div style="width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;background:rgba(0,0,0,.3);border:1.5px solid rgba(212,175,55,.5);flex-shrink:0;">' + icon + '</div>',
              '<div style="flex:1;min-width:0;">',
                '<div style="font-family:Cinzel,serif;font-size:1.05rem;color:#fff2cc;letter-spacing:.03em;margin-bottom:2px;">' + (spot.name || '') + '</div>',
                '<div style="font-family:\'IM Fell English\',serif;font-style:italic;font-size:.88rem;color:rgba(245,239,226,.62);">' + (spot.city || '') + (spot.city && spot.region ? ' · ' : '') + (spot.region || '') + '</div>',
                '<div style="margin-top:6px;font-size:.72rem;color:rgba(212,175,55,.7);">' + (spot.plan==='elite' ? 'Piano ELITE · ' : '') + '🍾 ' + (spot.wines || 0) + ' ' + tr('vini in carta','wines on list','vins sur la carte','вин в карте') + '</div>',
              '</div>',
              '<button type="button" onclick="window.swOpenCard && window.swOpenCard(\'' + spot.slug + '\')" style="flex-shrink:0;padding:11px 18px;border-radius:8px;background:linear-gradient(180deg,#f5d48f,#c29a36);border:1.5px solid rgba(120,85,0,.5);color:#2a1d00;font-family:Cinzel,serif;font-size:.62rem;letter-spacing:.14em;cursor:pointer;box-shadow:0 4px 16px rgba(212,175,55,.35);">',
                tr('VEDERE LA CARTA →','VIEW CARD →','VOIR LA CARTE →','СМОТРЕТЬ КАРТУ →'),
              '</button>',
            '</div>',
          '</div>'
        ].join('');
      }

      var listaHtml = '';
      if (!pubblici.length) {
        listaHtml = '<div style="padding:18px;text-align:center;font-style:italic;color:rgba(245,239,226,.55);">' + tr(
          '🔜 Presto online le prime Carte dei Vini del mondo. Se hai una cantina o ristorante: registrati e pubblica la tua!',
          '🔜 First wine lists coming soon. If you own a cellar or restaurant: register and publish yours!',
          '🔜 Prochainement les premières cartes des vins du monde. Cave ou restaurant : inscrivez-vous et publiez la vôtre !',
          '🔜 Скоро здесь появятся первые винные карты мира. Если у вас винодельня или ресторан — зарегистрируйтесь и опубликуйте свою!'
        ) + '</div>';
      } else {
        var cards = pubblici.map(function(r){ return cardHtml(r); }).join('');
        listaHtml = [
          '<div id="swCardGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-top:8px;">' + cards + '</div>'
        ].join('');
      }

      box.innerHTML = [
        '<div style="padding:6px 4px 16px;">',
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px;">',
            '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px;">',
              '<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:.22em;color:var(--oro);">✦ ' + tr('LE CARTE DEI VINI DEL MONDO','WORLD WINE LISTS','LES CARTES DES VINS DU MONDE','МИРОВЫЕ ВИННЫЕ КАРТЫ') + ' ✦</div>',
            '</div>',
            '<button type="button" onclick="window.location.hash=\'#register\';window.showPage && window.showPage(\'register\');" style="flex-shrink:0;padding:9px 16px;border-radius:8px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.3);color:var(--oroChiaro);font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.14em;cursor:pointer;">＋ ' + tr('REGISTRA LA TUA CANTINA','REGISTER YOUR CELLAR','ENREGISTRER VOTRE CAVE','ЗАРЕГИСТРИРОВАТЬ ВИНОДЕЛЬНЮ') + '</button>',
          '</div>',

          '<div style="margin-bottom:16px;padding:14px;background:rgba(212,175,55,.05);border:1px solid rgba(212,175,55,.18);border-radius:10px;">',
            '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">',
              '<div style="flex:1;min-width:220px;">',
                '<input type="search" id="swCardSearchInput" oninput="window.swFilterCardGrid(this.value)" placeholder="🔍 ' + tr('Cerca: nome, città, regione…', 'Search: name, city, region…', 'Recherche : nom, ville, région…', 'Поиск: название, город, регион…') + '" style="width:100%;padding:10px 12px;border-radius:8px;background:rgba(0,0,0,.35);border:1px solid rgba(212,175,55,.25);color:#f5efe2;font-size:.88rem;">',
              '</div>',
              '<select id="swCardTipSel" onchange="window.swFilterCardGrid(document.getElementById(\'swCardSearchInput\').value)" style="padding:10px 10px;border-radius:8px;background:rgba(0,0,0,.35);border:1px solid rgba(212,175,55,.25);color:#f5efe2;font-family:Cinzel,serif;font-size:.62rem;letter-spacing:.1em;min-width:160px;">',
                '<option value="" selected>' + tr('TUTTE LE TIPOLOGIE','ALL TYPES','TOUS LES TYPES','ВСЕ ТИПЫ') + '</option>',
                '<option value="ristorante">🍽️ ' + tr('Ristoranti','Restaurants','Restaurants','Рестораны') + '</option>',
                '<option value="cantina">🍇 ' + tr('Cantine','Cellars','Caves','Винодельни') + '</option>',
                '<option value="enoteca">🍾 ' + tr('Enotoche','Wine Bars','Enotecas','Винные бары') + '</option>',
                '<option value="hotel">🏨 ' + tr('Hotel','Hotels','Hôtels','Отели') + '</option>',
                '<option value="altro">📍 ' + tr('Altro','Other','Autres','Другое') + '</option>',
              '</select>',
              '<select id="swCardPlanSel" onchange="window.swFilterCardGrid(document.getElementById(\'swCardSearchInput\').value)" style="padding:10px 10px;border-radius:8px;background:rgba(0,0,0,.35);border:1px solid rgba(212,175,55,.25);color:#f5efe2;font-family:Cinzel,serif;font-size:.62rem;letter-spacing:.1em;min-width:160px;">',
                '<option value="" selected>' + tr('TUTTI I PIANI','ALL PLANS','TOUS LES PLANS','ВСЕ ТАРИФЫ') + '</option>',
                '<option value="elite">✦ ELITE (premium)</option>',
                '<option value="pro">PRO</option>',
                '<option value="start">START</option>',
              '</select>',
            '</div>',
          '</div>',
          spotHtml,
          listaHtml,
        '</div>'
      ].join('');
    };

    window.swFilterCardGrid = function(q) {
      var grid = document.getElementById('swCardGrid');
      if (!grid) return;
      q = (q||'').toString().toLowerCase().trim();
      var selTip = document.getElementById('swCardTipSel');
      var selPlan = document.getElementById('swCardPlanSel');
      var tip = (selTip && selTip.value) || '';
      var plan = (selPlan && selPlan.value) || '';
      var items = grid.querySelectorAll('.sw-card-grid-item');
      for (var i=0;i<items.length;i++) {
        var it = items[i];
        var slug = it.getAttribute('data-sw-slug') || '';
        var text = (it.innerText || it.textContent || '').toLowerCase();
        var show = true;
        if (q && text.indexOf(q) < 0 && slug.indexOf(q) < 0) show = false;
        if (show && tip) {
          var st = getState();
          var r = st.restaurants && st.restaurants.find ? st.restaurants.find(function(x){return x.slug===slug;}) : null;
          if (r && r.tipology !== tip) show = false;
        }
        if (show && plan) {
          var st2 = getState();
          var r2 = st2.restaurants && st2.restaurants.find ? st2.restaurants.find(function(x){return x.slug===slug;}) : null;
          if (r2 && r2.plan !== plan) show = false;
        }
        it.style.display = show ? '' : 'none';
      }
    };

    window.swOpenProducerPublic = function(slug) {
      try {
        var slugOK = String(slug || '').trim();
        if (!slugOK) return;
        var rFull = null;
        try {
          var raw = LS().getItem('swl_restaurant_' + slugOK);
          if (raw) try { rFull = JSON.parse(raw); } catch(e){ rFull = null; }
        } catch(e){ rFull = null; }
        if (!rFull && Array.isArray(window.SW_SEED_PRODUCERS)) {
          rFull = window.SW_SEED_PRODUCERS.find(function(x){ return x && x.slug === slugOK; }) || null;
          if (rFull) {
            try { LS().setItem('swl_restaurant_' + slugOK, JSON.stringify(rFull)); } catch(_e1){}
            try {
              var _wk = 'swl_wines_' + slugOK;
              if (!LS().getItem(_wk)) LS().setItem(_wk, JSON.stringify([]));
            } catch(_e2){}
          }
        }
        var rSummary = null;
        try {
          var st = getState();
          if (st && Array.isArray(st.restaurants)) {
            rSummary = st.restaurants.find(function(x){ return x && x.slug === slugOK; }) || null;
          }
          if (!rSummary && rFull) {
            rSummary = {
              slug: rFull.slug, name: rFull.name, plan: rFull.plan, tipology: rFull.tipology,
              city: rFull.city, region: rFull.region, country: rFull.country,
              public_card: true, is_restaurant: true, wines: 0,
              vitigni: Array.isArray(rFull.vitigni) ? rFull.vitigni.slice(0,6) : null,
              etichette_nr: rFull.etichette_nr || (Array.isArray(rFull.vini_desc) ? rFull.vini_desc.length : 0)
            };
            st = st || { restaurants: [] };
            if (!st.restaurants) st.restaurants = [];
            st.restaurants.push(rSummary);
            setState(st);
          }
        } catch(e){}
        var final = Object.assign({}, rSummary || {}, rFull || {});
        final.slug = slugOK;
        if (!final.name && !final.nome) final.name = slugOK;
        if (!Array.isArray(final.vini_desc) && rFull && Array.isArray(rFull.vini_desc)) final.vini_desc = rFull.vini_desc.slice();
        try { openOverlay('producer', final); } catch(e1){
          try { window.openOverlay && window.openOverlay('producer', final); } catch(e2){}
        }
      } catch(e){}
    };

    window.swOpenCard = function(slug) {
      try { window.swOpenProducerPublic && window.swOpenProducerPublic(slug); } catch(e){}
    };

    window.renderProducerPage = function() {
      try {
        var page = document.getElementById('page-producers');
        if (!page) return;
        var eliteDiv = document.getElementById('eliteProducers');
        var premDiv = document.getElementById('premiumProducers');
        var basicDiv = document.getElementById('basicProducers');
        if (!eliteDiv && !premDiv && !basicDiv) return;
        var st = getState();
        var all = (st && Array.isArray(st.restaurants)) ? st.restaurants.slice() : [];
        if (!all.length && Array.isArray(window.SW_SEED_PRODUCERS) && window.SW_SEED_PRODUCERS.length) {
          all = window.SW_SEED_PRODUCERS.slice();
          try {
            setState({
              restaurants: all.map(function(r){
                return {
                  slug: r.slug, name: r.name, plan: r.plan, tipology: r.tipology,
                  city: r.city, region: r.region, country: r.country,
                  public_card: true, is_restaurant: true, wines: 0,
                  vitigni: Array.isArray(r.vitigni) ? r.vitigni.slice(0,6) : null,
                  etichette_nr: r.etichette_nr || 0
                };
              })
            });
            for (var _fi = 0; _fi < window.SW_SEED_PRODUCERS.length; _fi++) {
              var _r = window.SW_SEED_PRODUCERS[_fi];
              try { LS().setItem('swl_restaurant_' + _r.slug, JSON.stringify(_r)); } catch(_e1){}
              try {
                var _wkey = 'swl_wines_' + _r.slug;
                if (!LS().getItem(_wkey)) LS().setItem(_wkey, JSON.stringify([]));
              } catch(_e2){}
            }
          } catch(_eSe){}
        }
        try {
          var hero = page.querySelector('.sw-producers-hero') || page.querySelector('[data-sw-prod-hero]');
          if (!hero) {
            var wrap = document.createElement('div');
            wrap.setAttribute('data-sw-prod-hero', '1');
            wrap.className = 'sw-producers-hero';
            wrap.innerHTML = [
              '<div class="sw-producers-title">🏆 ' + tr('Produttori del Mondo','World Producers','Producteurs du Monde','Мировые Производители') + '</div>',
              '<div class="sw-producers-sub">' +
                tr('Cantina per cantina, le storie e le etichette del vino mondiale. Clicca una scheda per conoscere territorio, vitigni e linea produttiva.','Winery by winery, the stories and labels of world wine. Click any card to discover territory, grapes and production.','Cave par cave, les histoires et les étiquettes du vin mondial. Cliquez une fiche pour découvrir territoire, cépages et ligne de production.','Винодельня за винодельней: истории и этикетки мирового вина. Нажмите карточку, чтобы узнать территорию, сорта винограда и производство.') +
              '</div>'
            ].join('');
            if (eliteDiv && eliteDiv.parentNode) eliteDiv.parentNode.insertBefore(wrap, eliteDiv);
          }
        } catch(_he){}
        if (!all.length) {
          try {
            var wrap = function(html) { return '<div style="padding:14px 18px;text-align:center;font-style:italic;color:rgba(245,239,226,.55);">'+html+'</div>'; };
            var empty = wrap(tr(
              '🔜 Presto online le prime schede cantina. Registra la tua nella sezione Home!',
              '🔜 First producer cards coming soon. Register yours in the Home section!',
              '🔜 Premières fiches cave à venir. Inscrivez la vôtre dans la section Accueil !',
              '🔜 Скоро здесь появятся первые карточки производителей. Зарегистрируйте свою на главной!'
            ));
            if (eliteDiv) eliteDiv.innerHTML = empty;
            if (premDiv) premDiv.innerHTML = '';
            if (basicDiv) basicDiv.innerHTML = '';
          } catch(e){}
          return;
        }
        var elites = all.filter(function(r){ return r && (r.plan === 'elite'); });
        var prems = all.filter(function(r){ return r && (r.plan === 'pro' || r.plan === 'premium'); });
        var basics = all.filter(function(r){ return r && (r.plan !== 'elite' && r.plan !== 'pro' && r.plan !== 'premium'); });
        var tipIcons = {ristorante:'🍽️', cantina:'🍇', enoteca:'🍾', hotel:'🏨', altro:'📍'};
        function cardHtml(r, isElite) {
          if (!r || !r.slug) return '';
          var t = r.tipology || 'altro';
          var icon = tipIcons[t] || '📍';
          var nome = r.name || r.nome || 'Cantina';
          var citta = r.city || r.citta || '';
          var regione = r.region || r.regione || '';
          var paese = r.country || r.nazione || r.paese || '';
          var line = [citta, regione, paese].filter(Boolean).join(' · ');
          var foto = r.img_profile_url || r.img_vineyard_url || r.img_cantina2_url || r.foto || '';
          var piano = r.plan === 'elite' ? 'ELITE' : (r.plan === 'pro' || r.plan === 'premium' ? 'PRO' : 'START');
          var bg = isElite === true
            ? 'background:linear-gradient(135deg,rgba(212,175,55,.16),rgba(212,175,55,.03) 50%,rgba(124,10,20,.1));border-color:rgba(212,175,55,.45);'
            : 'background:rgba(212,175,55,.04);border-color:rgba(212,175,55,.18);';
          var vitRaw = r.vitigni_main || r.grapes || '';
          var vitArr = Array.isArray(r.vitigni) ? r.vitigni : (vitRaw.toString().split(/[,，、;]/).map(function(s){return s.trim();}).filter(Boolean));
          var numEtichette = (Array.isArray(r.vini_desc) ? r.vini_desc.length : 0) || r.etichette_nr || r.labels_count || r.catalog_labels || 0;
          return [
            '<div data-sw-slug="'+escapeHtml(r.slug)+'" class="sw-producer-card-item"',
            ' style="display:block;padding:16px 14px;text-decoration:none;color:inherit;border:1px solid;',bg,'border-radius:12px;cursor:pointer;transition:all .25s;margin-bottom:12px;"',
            ' onmouseover="this.style.borderColor=\'rgba(212,175,55,.55)\';this.style.background=\'rgba(212,175,55,.1)\';"',
            ' onmouseout="this.style.borderColor=\'\';this.style.background=\'\';"',
            ' onclick="window.swOpenProducerPublic && window.swOpenProducerPublic(\''+r.slug.replace(/'/g,'\\\'')+'\');">',
              '<div style="display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;">',
                '<div style="display:flex;gap:12px;align-items:center;flex:1;min-width:0;">',
                  foto ? '<img src="'+escapeHtml(foto)+'" alt="" onerror="this.style.display=\'none\'" style="width:56px;height:56px;border-radius:12px;object-fit:cover;border:1.5px solid rgba(212,175,55,.35);flex-shrink:0;">' : ('<div style="width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.55rem;background:rgba(212,175,55,.1);border:1.5px solid rgba(212,175,55,.25);flex-shrink:0;">'+icon+'</div>'),
                  '<div style="min-width:0;flex:1;">',
                    '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:4px;">',
                      '<div style="font-family:Cinzel,serif;font-size:.82rem;color:#f5efe2;letter-spacing:.01em;line-height:1.2;">'+escapeHtml(nome)+'</div>',
                      (r.plan === 'elite' ? '<span style="padding:2px 8px;border-radius:4px;background:linear-gradient(180deg,#f2dfa3,#c7a84e);color:#3a2a08;font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.12em;box-shadow:0 1px 6px rgba(212,175,55,.4);">✦ '+piano+'</span>' : (r.plan === 'pro' || r.plan === 'premium' ? '<span style="padding:2px 8px;border-radius:4px;background:rgba(59,130,246,.15);color:#93c5fd;font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.12em;border:1px solid rgba(59,130,246,.25);">'+piano+'</span>' : '<span style="padding:2px 8px;border-radius:4px;background:rgba(74,222,128,.1);color:#86efac;font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.12em;border:1px solid rgba(74,222,128,.2);">'+piano+'</span>')),
                    '</div>',
                    line ? '<div style="font-size:.68rem;color:rgba(245,239,226,.55);">'+escapeHtml(line)+'</div>' : '',
                    vitArr.length ? '<div style="margin-top:5px;font-size:.62rem;color:rgba(212,175,55,.6);">🍇 '+escapeHtml(vitArr.slice(0,5).join(' · '))+'</div>' : '',
                    numEtichette ? '<div style="margin-top:4px;"><span class="sw-label-etichette">🍾 '+escapeHtml(String(numEtichette))+' ' + escapeHtml(tr('etichette','labels','étiquettes','этикеток')) + '</span></div>' : '',
                  '</div>',
                '</div>',
                '<div style="flex-shrink:0;font-family:Cinzel,serif;font-size:.54rem;letter-spacing:.12em;color:#d4af37;">→ '+tr('SCHEDA','CARD','FICHE','КАРТА')+'</div>',
              '</div>',
            '</div>'
          ].join('');
        }
        function groupHtml(list, isElite, title) {
          if (!list || !list.length) return '';
          return [
            '<div class="sw-producers-group" style="padding:8px 14px 6px;">',
              title ? '<div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:.22em;color:rgba(212,175,55,.55);margin:4px 0 10px 2px;">✦ '+escapeHtml(title)+' ✦</div>' : '',
              list.map(function(r){return cardHtml(r, isElite);}).filter(Boolean).join(''),
            '</div>'
          ].join('');
        }
        if (eliteDiv) eliteDiv.innerHTML = groupHtml(elites, true, tr('ELITE · LE MIGLIORI','ELITE · TOP','ÉLITE · LE MEILLEURES','ELITE · ЛУЧШИЕ'));
        if (premDiv) premDiv.innerHTML = groupHtml(prems, false, tr('PRO · CANTINE SELEZIONATE','PRO · SELECTED','PRO · SÉLECTIONNÉES','PRO · ВЫБОР'));
        if (basicDiv) basicDiv.innerHTML = groupHtml(basics, false, tr('START · TUTTE LE CANTINE','START · ALL CELLARS','START · TOUTES LES CAVES','START · ВСЕ ПРОИЗВОДИТЕЛИ'));
      } catch(e){}
    };

    /* ============================================================
       SEED CANTINE DIMOSTRATIVE (inizializzazione auto se LS vuoto)
       Piano: ELITE | PRO | START. Campi: storia 800-1800 char,
       vitigni[], vini_desc[] (lista etichette DESCRITTIVE separate
       dalla Carta dei Vini PDF). Usato come demo per clienti veri.
       ============================================================ */
    window.SW_SEED_PRODUCERS = [
      {
        slug: 'tenuta-san-leonardo-1724',
        name: 'Tenuta San Leonardo 1724',
        plan: 'elite',
        tipology: 'cantina',
        city: 'Trento',
        region: 'Trentino Alto Adige',
        country: 'Italia',
        founded_year: 1724,
        anno_fondazione: 1724,
        altitudine: '280 m s.l.m.',
        altitude: '280 m s.l.m.',
        suolo: 'Ghiaia profonda, alluvioni antiche Adige, scheletro calcareo',
        soil: 'Ghiaia profonda, alluvioni antiche Adige, scheletro calcareo',
        vitigni: ['Cabernet Sauvignon','Merlot','Carmenère','Cabernet Franc','Malbo Gentile','Bianchetta Trevigiana','Noah'],
        vitigni_main: 'Cabernet Sauvignon, Merlot, Carmenère',
        etichette_nr: 10,
        certificazioni: ['DOC','Vigneti Alleanza Biodiversità','Famiglia Storica 1724'],
        certifications: ['DOC','Vigneti Alleanza Biodiversità','Famiglia Storica 1724'],
        public_card: true,
        is_restaurant: true,
        sito_web: 'https://www.tenutasanleonardo.it',
        website: 'https://www.tenutasanleonardo.it',
        instagram: 'https://instagram.com/tenutasanleonardo1724',
        facebook: 'https://facebook.com/tenutasanleonardo',
        img_profile_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1000&q=80&auto=format&fit=crop',
        storia: 'Tenuta San Leonardo 1724 è nella storia del vino italiano. Da quasi trecento anni, una sola famiglia — i Guerrieri Gonzaga — coltiva circa 100 ettari di vigneti nella piana alluvionale dell\'Adige, a Nord di Trento, a 280 metri di altitudine, con terreni profondi e ghiaiosi che regolano l\'apporto idrico alle radici con una precisione quasi acquedottistica.\n\nIl maestro è, da sempre, un "Bordeaux blend" interpretato in chiave alpino-mediterranea: il San Leonardo. Nasce da Cabernet Sauvignon, Merlot, una piccola percentuale di Carmenère e un tocco intangibile di "terroir trentino": acidità tesa, tannino maturo, un sottobosco minerale che si svela dopo otto anni in bottiglia.\n\nPiù che una semplice etichetta, San Leonardo è un "palinsesto di famiglia". Nel 2024, 300 anni dopo il primo documento, la tenuta continua a produrre ogni anno esattamente lo stesso numero di bottiglie (circa 350.000), senza aumentare la superficie dei vigneti, per difendere l\'identità della parcella "Pianetto San Leonardo" che costituisce il cuore storico dell\'assemblaggio.\n\nOggi la linea produttiva comprende vini bianchi di montagna (Bianchetta Trevigiana, Müller Thurgau), rosati sapidi, e la linea "San Leonardo Classic" per il ristorante. La cantina ipogea del 1600 (ancora in uso) utilizza esclusivamente botti rovere Allier da 228 litri, con passaggio in legno mai superiore al 30% del nuovo.\n\nVisite degustazione solo su prenotazione: 11 am tutti i giorni da aprile a ottobre, con tour in 4 lingue.',
        vini_desc: [
          { name: 'San Leonardo · Vigna "Pianetto"', vintage: 2018, grapes: 'Cabernet Sauvignon 60% · Merlot 30% · Carmenère 10%', description: 'Bottiglia simbolo. 24 mesi barrique Allier, 6 anni in bottiglia. Tannino setoso, ribes nero, tabacco, grafite minerale. Longevità: 20+ anni.' },
          { name: 'San Leonardo · Classico', vintage: 2020, grapes: 'Cabernet Sauvignon 55% · Merlot 35% · Cabernet Franc 10%', description: 'L\'etichetta quotidiana per la carta ristorante. 14 mesi rovere, 2 anni bottiglia. Frutto nero, liquirizia, passaggio di pepe nero.' },
          { name: 'San Leonardo · Bianchetta di San Vito', vintage: 2023, grapes: 'Bianchetta Trevigiana 100%', description: 'Vigneto "San Vito" — 42 anni. Bianco di montagna salino: fiori di sambuco, mela golden, chiusura mandorlata. Perfetto antipasto e primi di pesce.' },
          { name: 'Guido Alessi · Malbo Gentile', vintage: 2021, grapes: 'Malbo Gentile 100%', description: 'Raro vitigno autoctono riscoperto nel 1998. Media struttura, ciliegia sotto spirito, finale erbaceo. Servito 16°C.' },
          { name: 'Leonardino · Rosé Trento DOC', sans_annee: true, vintage: 's.a.', grapes: 'Pinot Nero 60% · Chardonnay 40%', description: 'Metodo Classico, 36 mesi sui lieviti. Note di crosta di pane, fragola bianca, perlage fine e persistente. Aperitivo e cucina fusion.' },
          { name: 'Casa Luigia · Chardonnay', vintage: 2022, grapes: 'Chardonnay 100%', description: 'Vigna "Albera" esposizione sud. 8 mesi barrique (20% nuovo). Burro chiarificato, mela cotogna, vaniglia elegante, fondo minerale.' },
          { name: '1724 · Riserva Storica', vintage: 2016, grapes: 'Cabernet Sauvignon 70% · Merlot 20% · Carmenère 10%', description: 'Solo annate eccellenti. 36 mesi rovere, 8+ anni bottiglia prima dell\'uscita. Cassa di legno, 6 bottiglie per cliente.' },
          { name: 'Mulino · Merlot', vintage: 2022, grapes: 'Merlot 100%', description: 'Vigna "Mulino Nuovo". Prugna nera matura, sottobosco, tannino vellutato. Costo contenuto, ideale per seconde carni.' },
          { name: 'Vino Santo Trentino', vintage: 2017, grapes: 'Nosiola 100%', description: 'Appassimento 7 mesi su graticci. Oro antico, fico secco, mandorla tostata, miele di acacia. 50cl.' },
          { name: 'Grappa di San Leonardo', vintage: 2020, grapes: 'Vinaccia Cabernet/Merlot', description: 'Distillazione discontinua rame. 42 mesi botti di rovere ex-San Leonardo. 42% vol. Note di caramello e liquirizia.' }
        ]
      },
      {
        slug: 'chateau-margaux',
        name: 'Château Margaux',
        plan: 'elite',
        tipology: 'cantina',
        city: 'Margaux',
        region: 'Bordeaux · Médoc',
        country: 'Francia',
        founded_year: 1590,
        anno_fondazione: 1590,
        altitudine: '14 m s.l.m.',
        altitude: '14 m s.l.m.',
        suolo: 'Terreno ghiaioso terzo terrazzo Garonna, sabbie silicee, sotto suolo argilloso-calcareo',
        soil: 'Terreno ghiaioso terzo terrazzo Garonna, sabbie silicee, sotto suolo argilloso-calcareo',
        vitigni: ['Cabernet Sauvignon','Merlot','Cabernet Franc','Petit Verdot','Pavillon Blanc'],
        vitigni_main: 'Cabernet Sauvignon 87% · Merlot 9% · Cabernet Franc · Petit Verdot',
        etichette_nr: 6,
        certificazioni: ['Premier Grand Cru Classé 1855 · 1er GCC','ISO 22000','Biodiversità Vigneti Médoc'],
        certifications: ['Premier Grand Cru Classé 1855','ISO 22000','Biodiversité Médoc'],
        public_card: true,
        is_restaurant: true,
        sito_web: 'https://www.chateau-margaux.com',
        website: 'https://www.chateau-margaux.com',
        instagram: 'https://instagram.com/chateaumargaux',
        facebook: 'https://facebook.com/ChateauMargauxOfficiel',
        img_profile_url: 'https://images.unsplash.com/photo-1508371523897-93b5bb0d2d6a?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1579281742533-3bbac9abba70?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1000&q=80&auto=format&fit=crop',
        storia: 'Château Margaux, Premier Grand Cru Classé di Bordeaux dal 1855, è considerato da generazioni di critici il più "femminile" dei cinque 1er Cru Médoc — non per potenza, ma per finezza aromatica, un equilibrio quasi levigato dove il tannino non si mostra mai in forma grezza.\n\nLa tenuta occupa 262 ettari nel "terrazzo terzo" della Garonna, uno dei più antichi e profondi terreni ghiaiosi di Bordeaux. Il Cabernet Sauvignon domina (87%), seguito da una piccola quota di Merlot per portare rotondità, Cabernet Franc per profumo floreale e Petit Verdot per la guardia lunghissima.\n\nIl nome del vino non coincide con la denominazione tecnica: Margaux AOC è la sola denominazione permessa. Il "Grand Vin" (1a etichetta) vede solo il 30-35% della produzione totale; il resto confluisce nel Pavillon Rouge (2a etichetta) o viene venduto sfuso alla cooperativa.\n\nLa cantina di fermentazione, restaurata nel 2015 dall\'architetto Norman Foster, combina la tradizione di 80 tini di rovere singoli per parcella con tecniche di vinificazione a freddo e controllo termico millimetrico. L\'invecchiamento medio del Grand Vin è 18-24 mesi in rovere francese, con un rinnovo del nuovo legno che varia tra il 60% e il 100% in base all\'annata.\n\nIl Château Margaux 2015 ha ottenuto 100/100 da Robert Parker, lo stesso punteggio storico delle annate 1900, 1945, 1961, 1982, 1990, 2000 e 2009. Oggi, a capo del progetto tecnico ci sono il direttore generale Philippe Bascaules e l\'oenologo-consulente Paul Pontallier (in memoriam).',
        vini_desc: [
          { name: 'Grand Vin · Château Margaux 1er GCC', vintage: 2019, grapes: 'Cabernet Sauvignon 87% · Merlot 9% · Cabernet Franc 3% · Petit Verdot 1%', description: 'Prima etichetta. 24 mesi barrique 100% nuovo. Violetta, ribes, legno tostato elegante, grafite. Guardia: 30-70 anni.' },
          { name: 'Pavillon Rouge · 2e Vin', vintage: 2020, grapes: 'Cabernet Sauvignon 76% · Merlot 18% · Petit Verdot 5% · Cabernet Franc 1%', description: '2a etichetta storica del Château. 18 mesi rovere (40% nuovo). Più accessibile, ma con la stessa struttura verticale. Grand cru "giovanile".' },
          { name: 'Pavillon Blanc', vintage: 2022, grapes: 'Sauvignon Blanc 100%', description: 'Pochissimi casi in tutto il mondo. Frutta tropicale matura, minerale calcareo, acidità brillante. Longevità: 10-15 anni, unico tra i bianchi bordolesi.' },
          { name: 'Margaux de Château Margaux · 3e Vin', vintage: 2021, grapes: 'Cabernet Sauvignon 68% · Merlot 27% · Petit Verdot 5%', description: '3a etichetta introdotta nel 2013. 14 mesi rovere 15% nuovo. Per introdurre il château a clienti nuovi senza rinunciare al DNA.' },
          { name: 'Château Margaux · La Dame Blanche', vintage: 2020, grapes: 'Sauvignon Blanc 90% · Sémillon 10%', description: 'Edizione limitata 800 casse. Invecchiato 12 mesi in barrique usate. Bianco raro del Château per ristoranti stellati.' },
          { name: 'Château Margaux · Cuvée Spéciale Famille Lurton', vintage: 2016, grapes: 'Cabernet Sauvignon 92% · Merlot 8%', description: 'Solo per clienti storici, non in commercio. 36 mesi in botte, 10 anni in bottiglia prima dell\'uscita.' }
        ]
      },
      {
        slug: 'zorah-vayots-dzor',
        name: 'Zorah · Vayots Dzor',
        plan: 'pro',
        tipology: 'cantina',
        city: 'Yeghegnadzor',
        region: 'Vayots Dzor',
        country: 'Armenia',
        founded_year: 1998,
        anno_fondazione: 1998,
        altitudine: '1.400-1.600 m s.l.m.',
        altitude: '1.400-1.600 m s.l.m.',
        suolo: 'Basalto vulcanico, terrazzi sassosi, scheletro roccioso Areni',
        soil: 'Basalto vulcanico, terrazzi sassosi, scheletro roccioso Areni',
        vitigni: ['Areni Nero','Voskehat','Kangun','Rkatsiteli (Georgia)'],
        vitigni_main: 'Areni Nero · Voskehat',
        etichette_nr: 8,
        certificazioni: ['PGI Vayots Dzor · Armenia','Biodinamico Demeter (vigneto Alpeni)','Vegano OK'],
        certifications: ['PGI Vayots Dzor','Biodinamico Alpeni','Vegan'],
        public_card: true,
        is_restaurant: true,
        sito_web: 'https://zorah.am',
        website: 'https://zorah.am',
        instagram: 'https://instagram.com/zorahwines',
        facebook: 'https://facebook.com/zorahwines',
        img_profile_url: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1508371523897-93b5bb0d2d6a?w=1000&q=80&auto=format&fit=crop',
        storia: 'Zorah è la cantina che ha fatto rinascere il vitigno Areni Nero, considerato per secoli un "non-vino" da contadini poveri dell\'Armenia montana. Oggi il vino simbolo dell\'azienda — Karasi — ha ottenuto 92 punti da Wine Enthusiast, primo vino armeno della storia a superare questa soglia.\n\nLa cantina sorge a 1.400 metri nel Vayots Dzor, la regione tra le montagne del Caucaso dove nel 2007 gli archeologi hanno trovato la cantina più antica del mondo: 6.100 anni, in un sistema di grotte collegate da cunicoli, dotata di torchio, tini di argilla e semi di uva perfettamente conservati.\n\nIl nome Zorah (in armeno "origine") ha un solo obiettivo: produrre vini il più vicino possibile all\'identità del vitigno e del suolo basaltico. Le fermentazioni sono spontanee, senza aggiunta di lieviti selezionati. La macerazione carbonica è vietata in azienda: ogni uva Areni deve appassire 3 giorni su graticci prima di essere pigiata dolcemente con torchio pneumatico.\n\nLa linea produttiva oggi conta 8 etichette: 4 da Areni Nero, 2 da Voskehat (vitigno bianco autoctono aromatico), 1 rosato, 1 Kangun in anfora Georgia (qvevri, 8 mesi). Negli ultimi anni l\'azienda ha aperto un ristorante stellato (1 stella Michelin 2024, Guida Gault Millau Armenia) proprio accanto alla cantina, con menù che abbinano esclusivamente vini di produzione interna.',
        vini_desc: [
          { name: 'Karasi · Areni Nero', vintage: 2022, grapes: 'Areni Nero 100%', description: 'Etichetta top. 18 mesi anfore argilla Armenia "Karasi", 6 mesi bottiglia. Frutto scuro, pepe lungo, minerale vulcanico. 92 pt WE 2024.' },
          { name: 'Areni · Classico', vintage: 2023, grapes: 'Areni Nero 100%', description: 'Linea ristorante. 8 mesi cemento, 3 mesi bottiglia. Ciliegia acerba, scorza d\'arancia amara, tannino giovane. Servito 16°C.' },
          { name: 'Voskehat · Bianco', vintage: 2023, grapes: 'Voskehat 100%', description: 'Vitigno "grano d\'oro". Contatto con bucce 24h, 6 mesi acciaio. Pesca bianca, anice, miele d\'acacia, acidità viva.' },
          { name: 'Qvevri · Areni Riserva', vintage: 2021, grapes: 'Areni Nero 100%', description: 'Fermentazione 8 mesi in anfora georgiana interrata. Vino "ambrino-nero", sentori di cuoio, tabacco, frutta secca. Longevo 15+ anni.' },
          { name: 'Vayots · Rosé Sole', vintage: 2023, grapes: 'Areni Nero 100% · Saignée', description: 'Saignée, 48h macerazione leggera. Melagrana, pompelmo rosa, sale dell\'Himalaya. Grande aperitivo montagna.' },
          { name: 'Kangun · Qvevri Orange', vintage: 2021, grapes: 'Kangun 100%', description: 'Macerazione 6 mesi anfora. Vino arancione, tè earl grey, arancia candita, tannino astringente pulito.' },
          { name: 'Rkatsiteli · In Qvevri', vintage: 2022, grapes: 'Rkatsiteli 100%', description: 'Vitigno georgiano piantato 1999. Zenzero, scorza limone amara, mela cotogna. 5 mesi anfora.' },
          { name: 'Archeologie · Cuvée 6100', vintage: 2020, grapes: 'Areni Nero 70% · Areni Bianco 20% · Kangun 10%', description: 'Cuvée ispirata alla cantina 4100 aC. Mix di uve storiche. Cassa di legno numerata 1-6100.' }
        ]
      },
      {
        slug: 'cacique-maravilla-itata',
        name: 'Cacique Maravilla · Itata',
        plan: 'pro',
        tipology: 'cantina',
        city: 'Quirihue',
        region: 'Valle del Itata',
        country: 'Cile',
        founded_year: 2012,
        anno_fondazione: 2012,
        altitudine: '180 m s.l.m.',
        altitude: '180 m s.l.m.',
        suolo: 'Suoli granitici, sabbie marine, argilla compatta costiera',
        soil: 'Suoli granitici, sabbie marine, argilla compatta costiera',
        vitigni: ['Pais','Cinsault','Moscatel d\'Alessandria','Gewürztraminer'],
        vitigni_main: 'Pais · Cinsault · Moscatel',
        etichette_nr: 7,
        certificazioni: ['DO Valle del Itata','Vino Agricolo · Sin Aportes','Macerazione Carbonica Certificata'],
        certifications: ['Valle del Itata DO','Natural Wine · no additives','Carbonic'],
        public_card: true,
        is_restaurant: true,
        sito_web: 'https://caciquemaravilla.cl',
        website: 'https://caciquemaravilla.cl',
        instagram: 'https://instagram.com/caciquemaravilla',
        facebook: 'https://facebook.com/caciquemaravillaitata',
        img_profile_url: 'https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=1000&q=80&auto=format&fit=crop',
        storia: 'Cacique Maravilla è, letteralmente, la "resistenza" del vitigno Pais in Cile. Per oltre 150 anni, il Pais — introdotto dai conquistadores spagnoli nel 1540 — è stato considerato un vino "da contadini", per questo quasi estirpato negli anni Novanta a favore di Cabernet e Merlot industriali.\n\nOggi, due giovani vignaioli indipendenti gestiscono 3,5 ettari di vecchie viti (l\'età media delle piante è 74 anni), sopravvissute in un angolo remoto del Itata dove le strade sterrate non arrivano d\'inverno. La cantina non possiede fermentini inox: solo giare di 2.000 litri, cemento "egg", due tini di rovere usato.\n\nTutti i vini vengono prodotti in quantità minimali (tra 200 e 800 bottiglie per etichetta), con zero solforosa aggiunta in cantina, zero zuccheri, zero lieviti selezionati. L\'unica aggiunta tollerata è una micro-dose di solforosa all\'imbottigliamento (massimo 15mg/l, rispetto ai 150mg/l consentiti dal Cile).\n\nLa cantina produce 7 etichette: 4 rossi da Pais (mac. carbonica, 10 giorni pelle, 30 giorni pelle, 1 anno giare), 1 bianco da Moscatel d\'Alessandria, 1 Cinsault rosato, 1 Gewürztraminer "orange". Vengono venduti esclusivamente a ristoranti in 18 nazioni: dal Giappone (rest. Kikunoi) a Londra (Brae) fino a Milano (Ratanà) e Roma (Retrobottega).',
        vini_desc: [
          { name: 'Pipeño · Pais Macerazione Carbonica', vintage: 2022, grapes: 'Pais 100% · Vigne 70+ anni', description: 'MC completa 14 giorni in giare. Lampone, ciliegia, pepe di Sichuan, bollicina naturale. "Chill red". Bevi fresco 12-13°C.' },
          { name: 'Valle · Pais 30 gg Pelle', vintage: 2021, grapes: 'Pais 100% · Vecchie viti', description: 'Macerazione lunga 30 gg in giare cemento. 8 mesi rovere 3a passaggio. Mora, tabacco, prugna, tannino quasi inesistente.' },
          { name: 'Yumbel · Cinsault', vintage: 2022, grapes: 'Cinsault 100% · Vigneto 45 anni', description: 'Raro Cinsault Itata. 12 gg macerazione. Frutta rossa, sottobosco, leggero frizzantino naturale. Medaglia oro Decanter 2024.' },
          { name: 'Maravilla · Pais Riserva 1 anno Jarra', vintage: 2020, grapes: 'Pais 100%', description: '12 mesi giare terracotta. 5 mg/l solforosa TOTALE. Frutta matura, crosta di pane, chiusura minerale.' },
          { name: 'Moskatel · Bianco Macerato', vintage: 2023, grapes: 'Moscatel d\'Alessandria 100%', description: '7 giorni pelle, 4 mesi cemento uovo. Fiori d\'arancio amaro, mela, petto di pera, tannino gentile.' },
          { name: 'Rosé · Cinsault Saignée', vintage: 2023, grapes: 'Cinsault 100% · Saignée 6h', description: 'Colore cipolla. Fragolina di bosco, agrumi, sale atlantico. Perfetto con ceviche e cruditè.' },
          { name: 'Gewürztraminer · Orange', vintage: 2022, grapes: 'Gewürztraminer 100%', description: '1 mese macerazione, 6 mesi giare. Cannella, chiodo, petalo di rosa, polpa di albicocca secca.' }
        ]
      },
      {
        slug: 'domaine-tissot-jura',
        name: 'Domaine Tissot · Jura',
        plan: 'start',
        tipology: 'cantina',
        city: 'Arbois',
        region: 'Jura',
        country: 'Francia',
        founded_year: 1975,
        anno_fondazione: 1975,
        altitudine: '340 m s.l.m.',
        altitude: '340 m s.l.m.',
        suolo: 'Marne giurassiana, calcari Lias, clays profondi azoto bassi',
        soil: 'Marne giurassiana, calcari Lias, clays profondi azoto bassi',
        vitigni: ['Savagnin','Trousseau','Poulsard','Chardonnay'],
        vitigni_main: 'Savagnin · Trousseau · Poulsard',
        etichette_nr: 9,
        certificazioni: ['Jura AOC · Crémant du Jura','Agriculture Raisonnée HVE 3'],
        certifications: ['AOC Jura','HVE 3'],
        public_card: true,
        is_restaurant: true,
        sito_web: 'https://www.domainetissot-jura.com',
        website: 'https://www.domainetissot-jura.com',
        instagram: 'https://instagram.com/domainetissot',
        facebook: 'https://facebook.com/domainetissotjura',
        img_profile_url: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1579281742533-3bbac9abba70?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1000&q=80&auto=format&fit=crop',
        storia: 'Il Domaine Tissot, gestito da Stéphane Tissot e dalla moglie Bénédicte Tissot-Tuffier, è considerato il riferimento moderno del Jura: il cantina che ha fatto capire al mondo che il Jura non è "solo" il famoso Vin Jaune ossidato, ma anche vini bianchi freschi e di precisione, rosati e rossi di Trousseau con grande gastronomia.\n\nL\'azienda è ad Arbois, 34 ettari in biologia "raisonnée" (HVE level 3, certificazione alta qualità ambientale francese). Stéphane Tissot è famoso per la filosofia: "meno è di più" — ogni anno, l\'intero team decide insieme i parametri di pressatura, zucchero residuo, solforosa, non esistono ricette standard.\n\nUn punto chiave: il Savagnin Tissot NON viene prodotto esclusivamente in versione "voile" (ossidato stile Vin Jaune). Oggi oltre 4 etichette Savagnin sono "non-voile": fermentazioni controllate, ossigeno eliminato, vini che ricordano un grand cru Chablis ma con la mineralità marna del Giura.',
        vini_desc: [
          { name: 'Savagnin · Voile · Vin Jaune Style', vintage: 2018, grapes: 'Savagnin 100%', description: '6 anni in botte 228l non riempite. Apertura "curry", noci pecan, mallo di noce. Il classico del Jura. Abbinamento Comté AOC 36 mesi.' },
          { name: 'Savagnin · Non Voile', vintage: 2022, grapes: 'Savagnin 100%', description: 'Fermentazione inox controllata. Nessuna ossigenazione volontaria. Crosta di pane bianco, agrumi bianchi, minerale marna.' },
          { name: 'Trousseau · Les Bruyères', vintage: 2021, grapes: 'Trousseau 100%', description: 'Vigneto "Bruyère". 18 mesi rovere Francois Frères. Lampone, cuoio, spezie dolci. Longevo 8-12 anni.' },
          { name: 'Poulsard · Rosé Nature', vintage: 2023, grapes: 'Poulsard 100%', description: 'Vitigno raro Jura. Colore rosa pallido quasi bianco. Fragola bianca, petalo rosa, acidità brillante, frizzantino residuo.' },
          { name: 'Chardonnay · La Gravière', vintage: 2022, grapes: 'Chardonnay 100%', description: '12 mesi barrique 2a pass. Mela golden, burro chiarificato, chiusura salina. Prezzo entry-level per il Jura di qualità.' },
          { name: 'Crémant du Jura · Brut Nature', vintage: 's.a.', sans_annee: true, grapes: 'Chardonnay 70% · Savagnin 20% · Poulsard 10%', description: 'Dosaggio zero, 36 mesi sui lieviti. Perlage fine, crosta, mela verde, lievito. Bollicina "per intellettuali".' },
          { name: 'Trousseau · Les Chailloux · Vieilles Vignes', vintage: 2020, grapes: 'Trousseau 100% · VV 65 anni', description: 'Cuvée top. 24 mesi rovere, 3 anni bottiglia. Ciliegia sotto spirito, prugna secca, rosa canina. Tannino fine.' },
          { name: 'Macération · Savagnin Orange', vintage: 2022, grapes: 'Savagnin 100%', description: '21 giorni contatto con bucce, senza controllo ossigeno. The earl grey, miele di castagno, scorza limone amara.' },
          { name: 'Vin de Paille · Savagnin + Chardonnay', vintage: 2019, grapes: 'Savagnin 60% · Chardonnay 40%', description: 'Appassimento 3 mesi su graticci. 14 mesi botte. Oro. Miele di castagno, noce moscata, albicocca candita. 37.5cl.' }
        ]
      }
    ,
      {
        slug: 'vega-sicilia-ribera',
        plan: 'elite',
        tipology: 'cantina',
        name: 'Vega Sicilia · Único',
        city: 'Valbuena de Duero',
        region: 'Ribera del Duero',
        country: 'Spagna',
        founded_year: 1864,
        altitudine: '750 m s.l.m.',
        suolo: 'Calcareo-argilloso con ciottoli terziari',
        vitigni: ['Tinto Fino (Tempranillo) 80%', 'Cabernet Sauvignon 10%', 'Merlot 6%', 'Malbec 4%'],
        etichette_nr: 6,
        certificazioni: ['DO Ribera del Duero', 'BIO da 2022'],
        sito_web: 'https://vega-sicilia.com',
        website: 'https://vega-sicilia.com',
        instagram: 'https://instagram.com/vegausicilia',
        facebook: 'https://facebook.com/vegausicilia',
        img_profile_url: 'https://images.unsplash.com/photo-1547778136-cf8ce392a896?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1000&q=80&auto=format&fit=crop',
        storia: 'Vega Sicilia è la cantina storica spagnola fondata nel 1864 da Don Eloy Lecanda y Chaves, che tornato dalla Borgogna dopo 10 anni di apprendistato portò in Spagna le barriques di rovere francese e i vitigni bordolesi.\n\nIl nome Vega-Sicilia è il nome della località dove sorge la tenuta (1.000 ettari totali, 260 vitati), nella Ribera del Duero, a 750 metri di altitudine, clima continentale estremo (estate 40°C inverno -12°C, 13° escursione termica giornaliera in vendemmia).\n\nIl mito Único nasce 1915, oggi è tra i 10 vini più rari e costosi del mondo: 14-16 anni totale di affinamento (6 anni botte grandi rovere Allier + 8 anni bottiglia), solo annate eccezionali, 6.000 bottiglie annate medie.\n\nLa famiglia Alvarez (proprietari dal 1982) ha trasformato il brand in "status symbol tra re, capi di stato e chef stellati". Nel 2012 ha aperto una seconda tenuta: Alión (Tempranillo puro) e Pintía (Toro). 2022 ha annunciato conversione integrale BIO entro il 2027 di tutti i vigneti.',
        vini_desc: [
          { name: 'Único · Gran Reserva', vintage: 2011, grapes: 'Tinto Fino 80% · Cabernet Sauvignon 10% · Merlot 6% · Malbec 4%', description: 'Cuvée top 14 anni totale. 6 barriques grandi Allier + 8 bottiglia. Frutto nero, tabacco da pipa, liquirizia, vaniglia borbonica, minerale ferroso. 100/100 Parker 2023.' },
          { name: 'Único · Reserva Especial', vintage: 2008, grapes: 'Stesso blend Único', description: 'Annate "sagrada familia" (2004, 2008, 2012). Blended tra anni perfetti. 3 milioni € asta Sotheby 2023 per case 12 bot.' },
          { name: 'Valbuena 5º', vintage: 2019, grapes: 'Tinto Fino 92% · Merlot 8%', description: 'Linea entry della famiglia. 5 anni totale (3 botte, 2 bottiglia). Ribes nero, cacao, spezie dolci. Prezzo medio 180€.' },
          { name: 'Alión', vintage: 2020, grapes: 'Tinto Fino 100% · Tenuta Alión', description: 'Tenuta separata 2000. 18 mesi barriques nuove. Moderno, succoso, frutto maturo. 2ª cuvée prestigio 98 pt JS.' },
          { name: 'Pintía · Toro', vintage: 2021, grapes: 'Tinta de Toro 100%', description: 'Zona Toro. 14 mesi rovere. More, prugna secca, pepe nero, struttura potente.' },
          { name: 'Macán · Rioja DOC (joint venture Benjamín Rothschild)', vintage: 2017, grapes: 'Tempranillo 60% · Cabernet Sauvignon 40%', description: 'Joint-venture 2004 con Rothschild. Rioja alta. Blend bordolese-spagnolo. Equilibrio perfetto.' }
        ]
      }
    ,
      {
        slug: 'gaja-langhe-barbaresco',
        plan: 'elite',
        tipology: 'cantina',
        name: 'Gaja · Piemonte',
        city: 'Barbaresco',
        region: 'Langhe · Piemonte',
        country: 'Italia',
        founded_year: 1859,
        altitudine: '320-380 m s.l.m.',
        suolo: 'Marnoso-arenacea, sabbie e argille liguri',
        vitigni: ['Nebbiolo 100%', 'Barbera 100%', 'Chardonnay 100%', 'Sauvignon Blanc 100%'],
        etichette_nr: 9,
        certificazioni: ['DOCG Barbaresco', 'DOC Langhe', 'ISO 22000'],
        sito_web: 'https://gaja.it',
        website: 'https://gaja.it',
        instagram: 'https://instagram.com/gajawine',
        facebook: 'https://facebook.com/gajawines',
        img_profile_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=1000&q=80&auto=format&fit=crop',
        storia: "Fondata a Barbaresco da Giovanni Gaja nel 1859, diventata sotto la guida di Angelo Gaja (1961-oggi, classe 1939) la cantina italiana più famosa del mondo secondo Decanter 2024. \"Re del Barbaresco\" — Decanter l'ha definita nel 2013 \"il produttore di Nebbiolo più influente della Storia\".\n\nAngelo Gaja ha rivoluzionato l'enologia piemontese negli anni '70: primo a utilizzare la fermentazione a freddo per i bianchi, primo a usare barriques francesi da 225l invece delle botti grandi tradizionali, primo a piantare vitigni internazionali (Chardonnay, Cabernet Sauvignon) nel Piemonte DOC.\n\nI vigneti storici sono 4 cru: Sori' San Lorenzo (10 ettari, acquistato 1964), Costa Russi (7 ettari 1967), Sori' Tildin (3 ettari 1970) e Gromis (2 ettari 1990).\n\nDal 2000 la famiglia Gaja ha investito anche in Toscana (Ca' Marcanda — Bolgheri, 55 ettari) e in Sicilia (Sp10 — Noto, Nero d'Avola + Frappato). 2024 ha festeggiato i 165 anni con la prima Annata \"1859 Collection\" a base Barbaresco Riserva del 1996 ri-bottigliato + 2020. Il nome Gaja è diventato oggi sinonimo di \"italianità di lusso\" nel vino, come Ferrari per l'auto.",
        vini_desc: [
          { name: 'Barbaresco · Sori\' San Lorenzo · DOCG', vintage: 2019, grapes: 'Nebbiolo 100%', description: 'Cru storico. 24 mesi barriques nuove (50%) + 2 anni bottiglia. Rosa canina, catrame, ciliegia concentrata, polvere di liquirizia. Prezzo 950€.' },
          { name: 'Barbaresco · Costa Russi · DOCG', vintage: 2019, grapes: 'Nebbiolo 100%', description: 'Cru più elegante. 24 mesi 60% nuove barriques. Viola, prugna rossa, polvere di tè, tannino di seta. Longevo 40+ anni.' },
          { name: 'Barbaresco · Sori\' Tildin · DOCG', vintage: 2019, grapes: 'Nebbiolo 100%', description: 'Cru "tensissimo". Escursione termica massima. Tabacco, cuoio, terra battuta, caffè tostato.' },
          { name: 'Darmagi · Cabernet Sauvignon · Langhe DOC', vintage: 2020, grapes: 'Cabernet Sauvignon 100%', description: 'Il "pazzo" di Angelo (1978 primo anno). Piemonte che fa Bordeaux. 98 pt Wine Spectator 2024.' },
          { name: 'Rossj-Bass · Chardonnay · Langhe DOC', vintage: 2022, grapes: 'Chardonnay 100%', description: '10 mesi barriques sur lies. Mele golden, brioche, minerale. Chardonnay italiano top 5.' },
          { name: 'Sperss · Barolo · DOCG', vintage: 2019, grapes: 'Nebbiolo 100% · Serralunga d\'Alba', description: 'Entrata Gaja in Barolo 1988. 24 mesi 40% barriques nuove. Rosa canina, mallo, polvere minerale di langa.' },
          { name: 'Ca\' Marcanda · Magari · Bolgheri DOC', vintage: 2019, grapes: 'Cabernet Sauvignon 50% · Merlot 25% · Cabernet Franc 25%', description: 'Toscana Gaja. 18 mesi 35% barriques nuove. Ribes, tabacco dolce, fava tostata, succosissimo.' },
          { name: 'Sp10 · Nero d\'Avola + Frappato · Sicilia DOC', vintage: 2021, grapes: 'Nero d\'Avola 70% · Frappato 30%', description: 'Sicilia 2016. 12 mesi cemento + 3 barriques. Prugnola, gelsomino, frutto rosso maturo.' },
          { name: 'Barbera d\'Alba · DOC', vintage: 2022, grapes: 'Barbera 100%', description: 'Linea daily drink. 8 mesi rovere seconda scelta. Frutta nera, succoso, acidità brillante. 92 pt.' }
        ]
      }
    ,
      {
        slug: 'domaine-romanee-conti-drc',
        plan: 'elite',
        tipology: 'cantina',
        name: 'Domaine de la Romanée-Conti · DRC',
        city: 'Vosne-Romanée',
        region: 'Côte de Nuits · Borgogna',
        country: 'Francia',
        founded_year: 1232,
        altitudine: '240-280 m s.l.m.',
        suolo: 'Argilla marnosa con scheletro calcareo Kimmeridgiano',
        vitigni: ['Pinot Nero 100%', 'Chardonnay 100%'],
        etichette_nr: 8,
        certificazioni: ['AOC Grand Cru', 'BIO Ecocert'],
        sito_web: 'https://domainelaromaneeconti.com',
        website: 'https://domainelaromaneeconti.com',
        instagram: 'https://instagram.com/drc_wines',
        facebook: 'https://facebook.com/domainelaromaneeconti',
        img_profile_url: 'https://images.unsplash.com/photo-1550005792-1a20b2d4c5c4?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1580537577109-bf1de2a5d6f3?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1532373017969-97231575002f?w=1000&q=80&auto=format&fit=crop',
        storia: 'La Domaine de la Romanée-Conti (DRC) è considerata universalmente la cantina più leggendaria del mondo, i cui vini sono quotati all\'asta tra i 5.000 € e i 550.000 € a bottiglia.\n\nLe origini della Romanée-Conti risalgono addirittura al 1232, quando l\'Abbaye di Saint-Vivant vendette la parcella di 1,8 ettari chiamata "Clos de La Romanée" al cavaliere Philippe de Croonembourg. Nel 1760 fu acquistata da Louis François I de Bourbon, Principe di Conti, che la ribattezzò "Romanée-Conti" e per oltre 100 anni non permise a nessuno (compreso Re Luigi XIV) di berla se non a Palazzo Reale.\n\nOggi il de Villaine (famiglia proprietaria dal 1794) possiede 27 ettari totali distribuiti in 8 Grand Cru monocru della Côte de Nuits. La produzione annua totale è appena 7.000 casse (84.000 bottiglie, per paragone: Château Margaux produce 200.000 bottiglie).\n\nAubert de Villaine, enologo in carica dal 1974 al 2024, ha imposto dal 1988 la regola "solo vino di parcella" — ogni singola etichetta proviene da un solo vigneto, nessun blending.\n\nIl mito DRC è stato confermato dall\'asta Christie\'s del 2024 a Hong Kong: una singola bottiglia Romanée-Conti 1945 (10 anni dopo la vendemmia) è stata aggiudicata a 558.000 US$, record mondiale per un vino Pinot Nero.',
        vini_desc: [
          { name: 'Romanée-Conti · Grand Cru · Monopole', vintage: 2019, grapes: 'Pinot Nero 100% · 1,8 ettari monocru', description: 'Il Re dei Re. 1,8 ettari solo, 3.600 bottiglie max. 22 mesi 100% rovere francese nuovo. Ciliegia di Vignola, spezie, seta, terra forestale. 100/100 ogni critico.' },
          { name: 'La Tâche · Grand Cru · Monopole', vintage: 2019, grapes: 'Pinot Nero 100% · 6,06 ettari', description: 'Cru più "rustico" DRC. 22 mesi 100% rovere nuovo. More, mirtilli selvatici, pepe lungo, muschio. Longevo 50 anni.' },
          { name: 'Richebourg · Grand Cru', vintage: 2019, grapes: 'Pinot Nero 100% · 3,5 ettari', description: '"Il vino da tavola di Versailles" Luigi XV. Seducente, dolce tannino, rosa, ribes, miele.' },
          { name: 'Romanée-Saint-Vivant · Grand Cru', vintage: 2019, grapes: 'Pinot Nero 100% · 5,2 ettari', description: 'Cru più femminile. Violette, frutto rosso, lievità, eleganza assoluta.' },
          { name: 'Grands Échezeaux · Grand Cru', vintage: 2019, grapes: 'Pinot Nero 100% · 3,5 ettari', description: 'Cru "potente". 22 mesi. Tabacco, prugna secca, caramello, struttura. Prezzo entry.' },
          { name: 'Échezeaux · Grand Cru', vintage: 2019, grapes: 'Pinot Nero 100% · 4,4 ettari', description: 'Cru giovanile. Mirtilli, fava tostata, floreale. 95 pt JR.' },
          { name: 'Montrachet · Grand Cru · Chardonnay', vintage: 2020, grapes: 'Chardonnay 100% · 0,68 ettari', description: 'Miglior Chardonnay del mondo. 22 mesi 100% rovere nuovo. Burro chiarificato, limone sfumato, miele acacia, minerale di marna. Raro.' },
          { name: 'Corton · Grand Cru · Chardonnay', vintage: 2020, grapes: 'Chardonnay 100% · 2,2 ettari', description: 'Cru Bianco più accessibile. 18 mesi 75% rovere nuovo. Pera, brioche, agrume candito.' }
        ]
      }
    ,
      {
        slug: 'penfolds-grange-australia',
        plan: 'elite',
        tipology: 'cantina',
        name: 'Penfolds · Grange · Australia',
        city: 'Adelaide',
        region: 'Barossa Valley · South Australia',
        country: 'Australia',
        founded_year: 1844,
        altitudine: '180-350 m s.l.m.',
        suolo: 'Terreni rosso-terrosi terra rossa + calcare',
        vitigni: ['Shiraz 96% · Cabernet Sauvignon 4% (Grange)', 'Cabernet Sauvignon 60%', 'Shiraz 100% (St Henri)', 'Chardonnay', 'Pinot Nero'],
        etichette_nr: 10,
        certificazioni: ['ACO Organic (Bin 131)', 'Grange Classified Australia 1° Growth'],
        sito_web: 'https://penfolds.com',
        website: 'https://penfolds.com',
        instagram: 'https://instagram.com/penfolds',
        facebook: 'https://facebook.com/penfolds',
        img_profile_url: 'https://images.unsplash.com/photo-1546399379-a2b9544a648b?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1517758802938-a18ce662b658?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1000&q=80&auto=format&fit=crop',
        storia: 'La Penfolds è la cantina australiana più vecchia e famosa del mondo, fondata nel 1844 da Christopher Rawson Penfold, medico inglese emigrato in Australia, che credeva che il vino fosse un medicinale (così etichettava i suoi vini "per uso terapeutico").\n\nOggi Penfolds è il nome più prestigioso d\'Australia: le Grange, etichetta top, sono il "Château Latour dell\'Emisfero Sud" — primo vino non-bordolese e non-borgognone ad entrare nel Classico Mondiale "100 Grandi Vini della Storia" di Wine Spectator 2022.\n\nMax Schubert, il "padre di Grange" (1951 prima annata), copiò i metodi della Borgogna ma con uve Shiraz calde Barossa: 20 mesi rovere 100% nuovo americano 50% + francese 50%, assemblaggio tra diverse annate (multiregional blending), 5 anni in bottiglia prima dell\'immissione.\n\nNel 1991 Grange 1951 alla prima asta Christie\'s UK fece 28.000 sterline, da quel giorno il marchio è diventato globale. Oggi l\'azienda produce altre linee: St Henri (Shiraz vecchie botti, no nuovo legno), Bin 707 (Cabernet Sauvignon), Bin 131 (Gamma BIO), e le cuvée "Superblend" (France + Australia).\n\nNel 2024 Penfolds ha aperto "Penfolds Magill Estate Tasting House" nel cuore di Barossa, esclusivamente per clienti VIP: 2.500 AUD a persona, 15 portate con 8 Grange verticali 1990-2020.',
        vini_desc: [
          { name: 'Grange · Bin 95 · Shiraz · Annata', vintage: 2019, grapes: 'Shiraz 96% · Cabernet Sauvignon 4%', description: 'Cuvée top. 20 mesi (50% rovere americano nuovo, 50% francese nuovo) + 5 anni bottiglia. Prugna secca, cacao amaro, vaniglia bourbon, cioccolato fondente, tannino vellutato. 99 pt JS.' },
          { name: 'St Henri · Shiraz · Annata', vintage: 2020, grapes: 'Shiraz 100%', description: 'Antitesi di Grange. NESSUN legno nuovo. 18 mesi grandi botti rovere vecchio. Frutto puro, succoso, pepe nero, cioccolato al latte. Prezzo 1/3 di Grange.' },
          { name: 'Bin 707 · Cabernet Sauvignon', vintage: 2021, grapes: 'Cabernet Sauvignon 100%', description: '"Cugino alto di Grange". 18 mesi 70% rovere nuovo. Ribes, cassis, fava tostata, spezie dolci. 98 pt WS.' },
          { name: 'Bin 131 · Shiraz + Mataro · Organic', vintage: 2022, grapes: 'Shiraz 85% · Mataro 15%', description: 'Linea BIO ACO. 14 mesi 25% rovere nuovo. More, liquirizia, pepe, minerale ferroso.' },
          { name: 'Yattarna · Chardonnay', vintage: 2022, grapes: 'Chardonnay 100% · Adelaide Hills', description: 'Miglior Chardonnay australiano. 12 mesi 40% rovere nuovo sur lies. Mela golden, brioche, limone sfumato, agrumato.' },
          { name: 'Bin 23 · Pinot Nero', vintage: 2023, grapes: 'Pinot Nero 100% · Tasmania', description: 'Entry-level. Ciliegia, fragolina, petaloso, acidità brillante. 92 pt.' },
          { name: 'Bin 389 · Cabernet + Shiraz', vintage: 2021, grapes: 'Cabernet Sauvignon 53% · Shiraz 47%', description: '"Baby Grange". 12 mesi 40% rovere nuovo. Bilanciato, beverino. 95 pt.' },
          { name: 'Bin 407 · Cabernet Sauvignon', vintage: 2021, grapes: 'Cabernet Sauvignon 100%', description: 'Fratello minore Bin 707. 12 mesi. Ribes, mentolo, cacao. Accessibile.' },
          { name: 'Superblend · 802A · France + Australia', vintage: 2018, grapes: 'Shiraz 45% · Grenache 30% · Touriga 15% · Cabernet Franc 10%', description: 'Blend tra Rhône e Barossa. 20 mesi. Viola scuro, erbe mediterranee, frutto maturo, complesso.' },
          { name: 'Magill Estate · Shiraz Single Vineyard', vintage: 2019, grapes: 'Shiraz 100% · Magill', description: 'Vigneto storico 1844. 14 mesi. More, mirtillo, tabacco dolce, memoria storica.' }
        ]
      }
    ,
      {
        slug: 'opus-one-napa-valley',
        plan: 'elite',
        tipology: 'cantina',
        name: 'Opus One · Napa Valley',
        city: 'Oakville',
        region: 'Napa Valley · California',
        country: 'Stati Uniti',
        founded_year: 1981,
        altitudine: '35-90 m s.l.m.',
        suolo: 'Graveloso alluvionale (terreno tipo Pomerol)',
        vitigni: ['Cabernet Sauvignon 79% · Cabernet Franc 8% · Merlot 8% · Petit Verdot 4% · Malbec 1%'],
        etichette_nr: 5,
        certificazioni: ['Napa Valley AVA', 'Green Medal Napa Green 2023'],
        sito_web: 'https://opusonewinery.com',
        website: 'https://opusonewinery.com',
        instagram: 'https://instagram.com/opusonewinery',
        facebook: 'https://facebook.com/opusone',
        img_profile_url: 'https://images.unsplash.com/photo-1566737538612-5b6023e58aa0?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=1000&q=80&auto=format&fit=crop',
        storia: 'Opus One è la joint-venture più famosa nella storia del vino: fondata nel 1980 a Oakville (Napa Valley) dal Barone Philippe de Rothschild (Château Mouton Rothschild, Premier Grand Cru Classé) e da Robert Mondavi (il "padre del vino californiano").\n\nIl nome "Opus One" (latino "La Prima Opera") fu scelto perché entrambe le famiglie lo considerarono il loro lavoro più importante dopo i rispettivi vini di casa. Annata di debutto 1979, commercializzata 1984 a 500 USD la bottiglia (1.700 USD oggi corretti inflazione), un prezzo scandaloso per l\'epoca.\n\nOggi Opus One è gestita da Constellation Brands, che ha acquistato il 50% di Rothschild 2019. Ha 140 ettari di vigneti solo Oakville, produzione annua di 25.000 casse (300.000 bottiglie) — nessun vino sfuso o seconda linea di qualità inferiore. Metodo di vinificazione: rigorosamente bordolese — 22 mesi in 100% botti nuove rovere francese, assemblaggio blenda di 5 vitigni.\n\nIl design dell\'etichetta è ispirato ai ritratti incisi del 1700: i volti sono Barone Rothschild (sx) e Robert Mondavi (dx) uniti. Edificio cantina progettato da Julio de la Peña, ispirato a villa Palladiana Vicentina.\n\nNel 2020 Opus One ha vinto il "World\'s Most Admired Wine Brand" da Drinks International, primo californiano di sempre.',
        vini_desc: [
          { name: 'Opus One · Grand Cuvée · Napa Valley', vintage: 2021, grapes: 'Cabernet Sauvignon 79% · Cabernet Franc 8% · Merlot 8% · Petit Verdot 4% · Malbec 1%', description: 'Cuvée unica 140 ettari. 22 mesi 100% rovere francese nuovo (60% Taransaud, 30% Darnajou, 10% Vicard). Ribes nero, tabacco da pipa, noce moscata, vaniglia, liquirizia, minerale ghiaioso. 98+ pt JS. 500€.' },
          { name: 'Opus One · Overture · Napa Valley · 2nd Wine', vintage: 'Multi-annata', sans_annee: true, grapes: 'Stesso blend Opus One', description: '2° vino della tenuta. Blending multi-annate 2018-2020-2021. 14 mesi rovere di secondo passaggio. Più giovabile, beverino. 1/3 del prezzo Opus.' },
          { name: 'Mondavi · To Kalon Vineyard · Cabernet Sauvignon', vintage: 2021, grapes: 'Cabernet Sauvignon 100%', description: 'Vigneto storico To Kalon 1968. 18 mesi 80% rovere nuovo. Ribes, fava tostata, cacao. 97 pt WS.' },
          { name: 'Mouton Cadet · Héritage · Bordeaux · Opus One Selection', vintage: 2020, grapes: 'Cabernet Sauvignon 70% · Merlot 30%', description: 'Collaborazione Rothschild-Opus. Bordeaux sup. 12 mesi. Ribes, spezie, ottimo rapporto qualità prezzo.' },
          { name: 'Mondavi · Pinot Nero · Carneros', vintage: 2023, grapes: 'Pinot Nero 100%', description: '10 mesi 30% rovere. Ciliegia, fragola, petali, acidità brillante. Daily drink 91 pt.' }
        ]
      }
    ,
      {
        slug: 'chateau-musar-bekaa',
        plan: 'pro',
        tipology: 'cantina',
        name: 'Château Musar · Libano',
        city: 'Gazir · Bekaa Valley',
        region: 'Valli della Bekaa · Monte Libano',
        country: 'Libano',
        founded_year: 1930,
        altitudine: '1.000 m s.l.m.',
        suolo: 'Calcareo e pietrisco fluviale',
        vitigni: ['Cinsault 40% · Carignan 30% · Grenache 20% · Mourvèdre 10% (rosso) · Obaideh 60% · Merwah 40% (bianco)'],
        etichette_nr: 7,
        certificazioni: ['Pays du Levant BIO', 'Fairtrade'],
        sito_web: 'https://chateaumusar.com.lb',
        website: 'https://chateaumusar.com.lb',
        instagram: 'https://instagram.com/chateaumusar',
        facebook: 'https://facebook.com/chateaumusarlebanon',
        img_profile_url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1510501846009-f38e10df94f0?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1000&q=80&auto=format&fit=crop',
        storia: 'Château Musar è la cantina del Libano che ha fatto conoscere il vino del Vicino Oriente in Occidente, unica azienda vinicola della regione a vincere 3 Decanter Awards per 10 anni consecutivi.\n\nGaston Hochar, fondatore 1930 (figlio di emigranti libanesi che erano rientrati dal Cile), fece durante la guerra civile libanese (1975-1990) di tutto per proteggere la cantina: trasportò tutta la produzione in 4 cisterne petroliere nascoste nella montagna, fece venire il lievito da Parigi via elicottero durante i cessate il fuoco.\n\nOggi la cantina è gestita da Ronald e Serge Hochar, nipoti. Il segreto di Musar è l\'altitudine (1.000 m Bekaa, 18 gradi escursione termica notte-giorno, uve mature ma non disidratate) e i vitigni quasi estinti del Levante: Obaideh (antenato dello Chardonnay secondo ampelografi 2020) e Merwah (antenato del Semillon).\n\nStile unico: le annate vengono rilasciate 5-7 anni dopo la vendemmia per un invecchiamento lungo. I vini rossi Musar sviluppano note di sottobosco, liquirizia, cuoio, pepe rosa, tabacco dolce, stile "bordolese 50 anni fa, ma con sole 4.500 m di altitudine polare".\n\nLinee di punta: Château Musar Rosso, Château Musar Bianco, Hochar Père et Fils, Musar Jeune (per i giovani). 2024 l\'annata 2013 Château Musar Red vinta il "World Shiraz / Cinsault Trophy" Decanter 2024 a Londra.',
        vini_desc: [
          { name: 'Château Musar · Red · 2013 Annata', vintage: 2013, grapes: 'Cinsault 40% · Carignan 30% · Grenache 20% · Mourvèdre 10%', description: '11 anni di invecchiamento prima dell\'immissione. 18 mesi rovere francese. Tabacco dolce, pepe rosa, ribes nero, terra di montagna, cuoio. 96 pt JR.' },
          { name: 'Château Musar · White · 2017', vintage: 2017, grapes: 'Obaideh 60% · Merwah 40%', description: 'Bianco più longevo del Medio Oriente. 7 anni di invecchiamento prima del rilascio. Miele d\'acacia, crosta, agrume arancio amaro, mineralità. 95 pt.' },
          { name: 'Hochar Père et Fils · Red', vintage: 2019, grapes: 'Cinsault 45% · Carignan 25% · Syrah 20% · Cabernet Sauvignon 10%', description: '2° linea. 12 mesi rovere. More, liquirizia, succoso. Prezzo entry. 92 pt.' },
          { name: 'Musar Jeune · Red', vintage: 2022, grapes: 'Cinsault 50% · Syrah 50%', description: 'Linea giovane. Nessun invecchiamento legno. Frutto fresco, pepe nero, beverino 15€.' },
          { name: 'Musar Jeune · White', vintage: 2023, grapes: 'Obaideh 70% · Viognier 30%', description: 'Fermentazione a freddo. Pesca bianca, fiori, agrumi. Summer drink.' },
          { name: 'Rosé · Cinsault · Bekaa', vintage: 2022, grapes: 'Cinsault 60% · Grenache 40%', description: 'Salato, frutto rosso, spuma leggera. Perfetto con meze libanesi.' },
          { name: 'Museum Release 1987 · Red · Cuvée 50 Anniversario', vintage: 1987, grapes: 'Carignan 50% · Cinsault 50%', description: 'Ristampa 30 anni. Cuoio, tabacco, mallo di noce, marmellata di prugne rara.' }
        ]
      }
    ,
      {
        slug: 'billecart-salmon-champagne',
        plan: 'pro',
        tipology: 'cantina',
        name: 'Billecart-Salmon · Champagne Aÿ',
        city: 'Mareuil-sur-Aÿ',
        region: 'Champagne · Côte des Bar',
        country: 'Francia',
        founded_year: 1818,
        altitudine: '80-110 m s.l.m.',
        suolo: 'Gesso cretaceo · marne Belemnite · sabbie',
        vitigni: ['Pinot Nero 50% · Chardonnay 30% · Meunier 20% (linea Brut)', '100% Chardonnay (Blanc de Blancs)', '100% Pinot Nero (Blanc de Noirs)'],
        etichette_nr: 10,
        certificazioni: ['Champagne AOC · Grand Cru', 'Sustainable Viticulture VDC'],
        sito_web: 'https://billecart-salmon.com',
        website: 'https://billecart-salmon.com',
        instagram: 'https://instagram.com/billecartsalmon',
        facebook: 'https://facebook.com/billecartsalmon',
        img_profile_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1601372511873-2a118ea73978?w=1000&q=80&auto=format&fit=crop',
        storia: 'Champagne Billecart-Salmon è la maison di Champagne fondata nel 1818 a Mareuil-sur-Aÿ (Côte des Bar, Grand Cru), da Nicolas Billecart e Elisabeth Salmon, coniugi, che unirono i vigneti di famiglia.\n\nÈ una delle poche case di Champagne rimasta 100% in mano alla famiglia originaria, un unicum nel panorama champagne mondiale (dominata da multinazionali LVMH, Pernod-Ricard, Vranken).\n\nIl punto forte è il dosaggio basso e la longevità: Billecart-Salmon Brut Sous Bois è rimasto in classifica "Top 10 Champagne al mondo" da Decanter per 12 anni consecutivi, e la cuvée "Nicolas François Billecart" (Annata Grand Cru) è considerato tra i 5 migliori champagne "non-Krug" del mondo.\n\nLe metodologie di Billecart-Salmon: 1) "Reserve perpétuelle" dal 1964 — assemblaggio annuale di 1% di vini base annate storiche (anche 30 anni fa); 2) Doppia fermentazione su lieviti selezionati di origine Champagne; 3) Affinamento minimo 6 anni sur lies, ben oltre i 18 mesi obbligatori legge AOC per annate.\n\nCelebre è la cuvée rosé "Salmon": primo champagne rosa della storia (1818 la prima commercializzazione), metodo saignée 100% Pinot Noir Grand Cru — ancora oggi la linea Rosé Billecart-Salmon è una delle più vendute al mondo.',
        vini_desc: [
          { name: 'Brut · Reserve · Champagne AOC', vintage: 's.a.', sans_annee: true, grapes: 'Pinot Nero 50% · Chardonnay 30% · Meunier 20%', description: 'Linea base. 3 anni sur lies. Dosaggio 8 g/l. Crosta di pane, mela verde, brioche, limone. Ottimo tutti i giorni. 40€. 93 pt.' },
          { name: 'Brut · Sous Bois · Barrique Fermenté', vintage: 's.a.', sans_annee: true, grapes: 'Pinot Nero 60% · Chardonnay 40%', description: 'Fermentazione 100% in barriques di rovere. 4 anni sur lies. Tostato, nocciola, miele. Top 10 Decanter 12 anni consec. 95 pt.' },
          { name: 'Blanc de Blancs · Grand Cru · Chardonnay', vintage: 's.a.', sans_annee: true, grapes: 'Chardonnay 100% · Grand Cru Mesnil', description: 'Côte des Blancs. 5 anni. Limone sfumato, brioche, crostata di mela. Eleganza. 94 pt JR.' },
          { name: 'Blanc de Noirs · Grand Cru · Pinot Nero', vintage: 's.a.', sans_annee: true, grapes: 'Pinot Nero 100% · Grand Cru Verzenay', description: 'Costa nera. Frutto rosso, fragola, lievito. Bollicina importante.' },
          { name: 'Champagne Rosé · Salmon Brut · Saignée 100%', vintage: 's.a.', sans_annee: true, grapes: 'Pinot Nero 60% · Chardonnay 40%', description: 'Cuvée storica 1818. Saignée. Fragola, lampone, cremoso, fruttato. Champagne rosato top mondiale.' },
          { name: 'Nicolas François Billecart · Grand Cru Annata', vintage: 2012, grapes: 'Pinot Nero 70% · Chardonnay 30% · 10 Grand Cru', description: 'Prestigio. 10 anni sur lies, dosaggio 6 g/l. Rosa canina, crostata, brioche, tabacco dolce. 99 pt JS 2023.' },
          { name: 'Elisabeth Salmon · Rosé Annata · Grand Cru', vintage: 2014, grapes: 'Pinot Nero 75% · Chardonnay 25%', description: 'Cuvée dedicata a Elisabeth Salmon (fondatrice 1818), solo annate. 10 anni. Rosato complesso, fragola secca, liquirizia, caramello.' },
          { name: 'Cuvée Louis Salmon · Blanc de Blancs Annata', vintage: 2015, grapes: '100% Chardonnay · 10 Grand Cru', description: '9 anni sur lies. Agrumi, miele d\'acacia, brioche, minerale gessoso.' },
          { name: 'Extra Brut · Zéro Dosage', vintage: 's.a.', sans_annee: true, grapes: 'Chardonnay 50% · Pinot Nero 50%', description: 'Dosaggio 0 g/l. Salino, minerale, mela verde acerba, perlage fine. Abbinamento ostriche.' },
          { name: 'Demi-Sec · Millesime', vintage: 2016, grapes: 'Pinot Nero 60% · Meunier 20% · Chardonnay 20%', description: 'Dolce. 40 g/l. Miele, pastiera, canditi, digestivo.' }
        ]
      }
    ,
      {
        slug: 'felton-road-central-otago',
        plan: 'pro',
        tipology: 'cantina',
        name: 'Felton Road · Central Otago · NZ',
        city: 'Bannockburn',
        region: 'Central Otago · Isola Sud Nuova Zelanda',
        country: 'Nuova Zelanda',
        founded_year: 1991,
        altitudine: '250-350 m s.l.m.',
        suolo: 'Limo sabbioso · argilla · loess · scisti',
        vitigni: ['Pinot Nero 100% · Bannockburn', 'Riesling 100%', 'Chardonnay 100%'],
        etichette_nr: 7,
        certificazioni: ['BIOGRO NZ Certified 100% Organic', 'Demeter Biodynamic', 'Central Otago Pinot Noir DOC'],
        sito_web: 'https://feltonroad.com',
        website: 'https://feltonroad.com',
        instagram: 'https://instagram.com/feltonroad',
        facebook: 'https://facebook.com/feltonroadwines',
        img_profile_url: 'https://images.unsplash.com/photo-1625517236224-7eb99ab5f768?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1600612459829-5656e71cbca9?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1517758802938-a18ce662b658?w=1000&q=80&auto=format&fit=crop',
        storia: 'Felton Road è la cantina neozelandese più famosa del mondo, capostipite del Pinot Nero del Nuovo Mondo, numero 1 al mondo Decanter 2023 per la categoria "Pinot Nero fuori Borgogna".\n\nFondata nel 1991 da stuart mac loughlin e Blair Walter, a Bannockburn, Central Otago (la regione vitivinicola più meridionale del mondo, a 45° parallelo, con luce ultravioletta altissima e 19°C escursione termica notte-giorno).\n\nDa subito adottarono la biodinamica Demeter (anno 2000 certificazione), una scelta molto rara per l\'epoca in Nuova Zelanda: preparati 500/501 (letame di vacca in corno/silice), no erbicidi, no fertilizzanti sintetici, vigneti lavorati a mano con trattori a cavalli.\n\nLa fama di Felton Road esplose con l\'annata 2003 Pinot Nero Bannockburn: Wine Spectator 96/100, primo Pinot Nero Nuova Zelanda ad entrare nella TOP 100 mondiale.\n\nOggi la cantina ha 35 ettari vitati in 4 parcelle storiche: Bannockburn (18 ettari), Cornish Point (9), Calvert (6), Mount Edward (2). Produzione 18.000 casse anno — il 85% va all\'estero (USA, UK, Giappone, Hong Kong, Singapore).\n\nI vini si distinguono per il "terroir di montagna": acidità altissima, purità di frutto, complessità floreale, longevità 15-20 anni, cosa rarissima per il Pinot Nero Nuovo Mondo.',
        vini_desc: [
          { name: 'Pinot Nero · Block 3 · Bannockburn', vintage: 2021, grapes: 'Pinot Nero 100% · Clone UCD5', description: 'Cru top. 18 mesi 45% barriques francesi nuove. Ciliegia, gelsomino, spezie dolci, seta. 97 pt WS 2024. 120€.' },
          { name: 'Pinot Nero · Cornish Point · Vineyard', vintage: 2021, grapes: 'Pinot Nero 100% · MV6 clone', description: 'Vigneto Cornish Point. 16 mesi 30% barriques nuove. Ciliegia, fragola selvatica, tabacco, floreale. 95 pt JR.' },
          { name: 'Pinot Nero · Calvert · Vineyard', vintage: 2022, grapes: 'Pinot Nero 100% · Dijon 115 clone', description: 'Vigneto giovane 2014. 14 mesi 20% barriques. Rosa canina, lampone, polvere minerale. 93 pt.' },
          { name: 'Pinot Nero · Mount Edward · Vineyard', vintage: 2020, grapes: 'Pinot Nero 100%', description: 'Parcelletta 2 ettari, più alta quota 350m. 18 mesi. Pepe rosa, sottobosco, salvia. 95 pt.' },
          { name: 'Chardonnay · Elms Vineyard', vintage: 2022, grapes: 'Chardonnay 100%', description: '12 mesi 35% barriques nuove sur lies. Mela, burro chiarificato, agrumi, minerale. 94 pt.' },
          { name: 'Riesling · Dry · Bannockburn', vintage: 2023, grapes: 'Riesling 100%', description: 'Fermentazione acciaio. Agrume, pesca, mela verde, con acidità pazzesca. Longevo 10 anni.' },
          { name: 'Pinot Gris · Off-Dry', vintage: 2023, grapes: 'Pinot Gris 100%', description: 'Poco dolce, 32 g/l zucchero. Pesca, albicocca, spezie. Abbinamento cibo etnico asiatico.' }
        ]
      }
    ,
      {
        slug: 'tablas-creek-paso-robles',
        plan: 'pro',
        tipology: 'cantina',
        name: 'Tablas Creek · Paso Robles Rhône Blend · USA',
        city: 'Paso Robles',
        region: 'Central Coast · California',
        country: 'Stati Uniti',
        founded_year: 1997,
        altitudine: '240-300 m s.l.m.',
        suolo: 'Limoso · calcareo · argilla · caliche (roccia calcarea)',
        vitigni: ['Grenache 40% · Syrah 30% · Mourvèdre 20% · Counoise 10% · (Esprit de Beaucastel Blend)', 'Roussanne · Grenache Blanc · Picpoul (bianchi)', 'Viognier'],
        etichette_nr: 9,
        certificazioni: ['BIO · Demeter · Biodynamic', 'CCOF Organic', 'Paso Robles AVA'],
        sito_web: 'https://tablascreek.com',
        website: 'https://tablascreek.com',
        instagram: 'https://instagram.com/tablascreek',
        facebook: 'https://facebook.com/tablascreekvineyard',
        img_profile_url: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1510501846009-f38e10df94f0?w=1000&q=80&auto=format&fit=crop',
        storia: 'Tablas Creek è la joint-venture fondata nel 1989 tra il Perrin Family (Château de Beaucastel, Châteauneuf-du-Pape Premier Cru) e Robert Haas (importatore statunitense di vini francesi).\n\nObiettivo: creare in California il "vero" stile Châteauneuf-du-Pape, utilizzando gli stessi vitigni (es. Counoise, Picpoul, Vaccarèse quasi estinti nel Nuovo Mondo) e metodo biodinamico.\n\nPer 8 anni i Perrin piantarono solo portainnesti clonati direttamente dalle parcelle Beaucastel di Châteauneuf: Grenache clone 383, Syrah clone 300, Mourvèdre clone 221, Counoise clone 414, Roussanne clone 125.\n\nAnnata di debutto 1997 Esprit de Beaucastel Tablas Creek. Oggi la cantina ha 120 ettari, 100% biodinamica Demeter. Produzione 25.000 casse annue.\n\nLa produzione è guidata dall\'enologo Jason Haas, figlio di Robert, che applica i principi: "Nessun irrigazione artificiale (dry farm), concimazione solo con rinterro dei tralci, raccolta manuale in 4 passaggi.\n\nTablas Creek ha vinto 5 volte il "Winemaker of the Year" da Wine & Spirits Magazine (2018-2023). Nel 2024 ha lanciato una linea "Tablas Creek Clonal Series" dedicata a 8 vitigni rari del Rhône piantati a singolo clone.',
        vini_desc: [
          { name: 'Esprit de Beaucastel · Tablas Creek Rouge', vintage: 2021, grapes: 'Grenache 40% · Syrah 30% · Mourvèdre 20% · Counoise 10%', description: 'Cuvée top. 24 mesi 100% rovere francese (30% nuove). Lampone, erbe provenzali, tabacco dolce, olive nere, minerale. 97 pt. 120€.' },
          { name: 'Esprit de Beaucastel · Tablas Creek Blanc', vintage: 2022, grapes: 'Roussanne 60% · Grenache Blanc 25% · Picpoul 15%', description: 'Bianco di punta. 18 mesi 25% barriques. Pesca, miele, finocchio selvatico, agrumi arancio. 95 pt JR.' },
          { name: 'Patelin de Tablas · Rouge', vintage: 2022, grapes: 'Grenache 55% · Syrah 30% · Mourvèdre 15%', description: '2° linea. 12 mesi cemento. More, liquirizia, erbe. Prezzo entry 40€. 91 pt.' },
          { name: 'Patelin de Tablas · Blanc', vintage: 2023, grapes: 'Roussanne 60% · Viognier 30% · Grenache Blanc 10%', description: 'Fermentazione acciaio. Pesca bianca, fiori d\'arancio, albicocca, beverino.' },
          { name: 'Côtes de Tablas · Rouge', vintage: 2021, grapes: 'Grenache 50% · Syrah 35% · Mourvèdre 15%', description: 'Linea entry. 8 mesi cemento. Lampone, pepe nero, succoso. 28€.' },
          { name: 'Grenache Blanc · Single Vineyard', vintage: 2022, grapes: 'Grenache Blanc 100%', description: 'Vitigno raro. 8 mesi 15% rovere. Pesca, limone, fiore bianco, minerale calcareo.' },
          { name: 'Syrah · Single Vineyard · Adelaida', vintage: 2022, grapes: 'Syrah 100%', description: 'Puro clone 300 Syrah. 14 mesi 20% barriques. Viola scuro, pepe, olive nere, potente.' },
          { name: 'Viognier · Single Vineyard', vintage: 2023, grapes: 'Viognier 100%', description: 'Fermentazione in acciaio + 2 mesi sur lies. Viola, gelsomino, albicocca, aromi esplosivi.' },
          { name: 'Counoise · Single Clone · Rare Clonal', vintage: 2020, grapes: 'Counoise 100% · Clone 414', description: 'Vitigno rarissimo (meno di 50 ettari nel mondo). Pepe rosa, ciliegia, petaloso, longevo. Limited 900 bottiglie.' }
        ]
      }
    ,
      {
        slug: 'weingut-muri-gries-alto-adige',
        plan: 'start',
        tipology: 'cantina',
        name: 'Weingut Muri-Gries · Alto Adige',
        city: 'Bolzano',
        region: 'Alto Adige · Südtirol',
        country: 'Italia',
        founded_year: 1048,
        altitudine: '260-350 m s.l.m.',
        suolo: 'Ghiaioso · porfido · colluviale · depositi fluviali Adige',
        vitigni: ['Pinot Grigio 100%', 'Sylvaner 100%', 'Lagrein 100%', 'Vernatsch 100%', 'Gewürztraminer 100%', 'Sauvignon Blanc', 'Müller-Thurgau'],
        etichette_nr: 8,
        certificazioni: ['Alto Adige DOC', 'BIO · 2020', 'Südtiroler Weingüter Gütegemeinschaft'],
        sito_web: 'https://weingut-muri-gries.it',
        website: 'https://weingut-muri-gries.it',
        instagram: 'https://instagram.com/weingutmurigries',
        facebook: 'https://facebook.com/murigriesweingut',
        img_profile_url: 'https://images.unsplash.com/photo-1511920339912-73925a4d9c0b?w=800&q=80&auto=format&fit=crop',
        img_vineyard_url: 'https://images.unsplash.com/photo-1563229693-117a4f0f5b33?w=1000&q=80&auto=format&fit=crop',
        img_cantina2_url: 'https://images.unsplash.com/photo-1546399379-a2b9544a648b?w=1000&q=80&auto=format&fit=crop',
        storia: 'Il Weingut Muri-Gries di Bolzano è la cantina più vecchia dell\'Alto Adige (1048 d.C. fondata dal monastero benedettino dei Monaci di Muri, Svizzera, oggi Abbazia di Muri-Gries). È oggi gestita dalla comunità monastica.\n\nLa piccola realtà (16 ettari vitati, tutti collinari sopra i 260m nella conca bolzanina, affacciati sulle Dolomiti, UNESCO) produce solo 50.000 bottiglie all\'anno — nessun vino in vendita all\'ingrosso, solo nei ristoranti stellati altoatesini e nella piccola enoteca del monastero.\n\nIl monaco enologo dal 2012 è Padre Martin Werlen, che ha iniziato la conversione biologica nel 2020. "Facciamo vino da 1.000 anni per il consumo della comunità — oggi solo per chi lo trova. Nessun marketing, nessuna asta, solo annate vere" (cit. dalla presentazione 2024).\n\nLa linea tradizionale: Lagrein Scuro (vino rosso autoctono), Vernatsch (Schiava), Pinot Grigio, Sylvaner, Gewürztraminer. Annate limitate a causa della grandine frequente nel 2015 e 2018.\n\nPer i "vini del monastero" si usa ancora il torchio verticale in legno del 1890 per la schiacciatura delle uve, mentre la fermentazione avviene in tini di acciaio inox moderni. I vini sono leggeri, di 12,5-13°, puliti, con una tipicità "di montagna" (acidità più elevata di quelle trentine).\n\nLa cuvée più famosa è "Abbazia Lagrein Scuro 2019" — 4 stelle Gambero Rosso 2024.',
        vini_desc: [
          { name: 'Lagrein Scuro · Riserva · Abbazia · Alto Adige DOC', vintage: 2019, grapes: 'Lagrein 100% · Vigneto Muri', description: 'Cuvée top 3 stelle. 24 mesi grandi botti di rovere Slavonia 2° passaggio. Amarena, cioccolato fondente, viola, polvere di porfido. 93 pt GR.' },
          { name: 'Vernatsch · Alto Adige DOC', vintage: 2022, grapes: 'Vernatsch 100% (Schiava)', description: 'Vitigno locale. 8 mesi cemento + 2 inox. Ciliegia, fragola, succoso, spuma, beverino. 12,5°. 18€.' },
          { name: 'Pinot Grigio · Alto Adige DOC', vintage: 2023, grapes: 'Pinot Grigio 100%', description: 'Fermentazione fredda 16°C acciaio. Pesca bianca, agrumi, mandarino, minerale porfido. 90 pt.' },
          { name: 'Sylvaner · Alto Adige DOC', vintage: 2023, grapes: 'Sylvaner 100%', description: 'Vitigno del sud Tirolo. Erbe fresche, mela verde, finocchio selvatico. Perfetto con speck e canederli.' },
          { name: 'Gewürztraminer · Alto Adige DOC', vintage: 2023, grapes: 'Gewürztraminer 100%', description: 'Litchi, rosa, zenzero, speziato. Abbinamento con cucina asiatica, curry, stinco di maiale.' },
          { name: 'Sauvignon Blanc · Alto Adige DOC', vintage: 2022, grapes: 'Sauvignon Blanc 100%', description: '7 mesi acciaio. Pompelmo, foglia di pomodoro, agrumi. Acidità brillante.' },
          { name: 'Müller-Thurgau · Cantina Sociale Line', vintage: 2023, grapes: 'Müller-Thurgau 100%', description: 'Linea entry, venduto solo nella botteghina monastica. Mela, fiori, frizzantino leggero. 9€.' },
          { name: 'Weihnachtswein · Natale del Monastero', vintage: 2022, grapes: 'Vernatsch 60% · Lagrein 40% · speziato', description: 'Vin brulé del monastero. Spezie, chiodi di garofano, cannella. Ricetta antica 1200. Natale 500 bottiglie anno.' }
        ]
      }
    ];

    (function autoSeedEnsure() {
      try {
        var ls = LS();
        if (!ls) return;
        var master = { restaurants: [] };
        try {
          var raw = ls.getItem('swl_master_state');
          if (raw) {
            var s = JSON.parse(raw || '{}');
            if (s && Array.isArray(s.restaurants)) master = s;
          }
        } catch(e){ master = { restaurants: [] }; }
        var existingSlugs = {};
        for (var ex=0; ex<master.restaurants.length; ex++) {
          if (master.restaurants[ex] && master.restaurants[ex].slug) existingSlugs[master.restaurants[ex].slug] = true;
        }
        var added = 0;
        for (var i = 0; i < window.SW_SEED_PRODUCERS.length; i++) {
          var rest = window.SW_SEED_PRODUCERS[i];
          if (!existingSlugs[rest.slug]) {
            master.restaurants.push({
              slug: rest.slug, name: rest.name, plan: rest.plan, tipology: rest.tipology,
              city: rest.city, region: rest.region, country: rest.country,
              public_card: true, is_restaurant: true, wines: 0,
              vitigni: Array.isArray(rest.vitigni) ? rest.vitigni.slice(0,6) : null,
              etichette_nr: rest.etichette_nr || 0
            });
            added++;
          }
          ls.setItem('swl_restaurant_' + rest.slug, JSON.stringify(rest));
          try {
            var wKey = 'swl_wines_' + rest.slug;
            if (!ls.getItem(wKey)) ls.setItem(wKey, JSON.stringify([]));
          } catch(_w){}
        }
        if (added > 0) {
          ls.setItem('swl_master_state', JSON.stringify(master));
          try { console && console.log && console.log('[swl-seed] ✅ Aggiunte '+added+' cantine demo seed in localStorage'); } catch(_c){}
        } else {
          try { console && console.log && console.log('[swl-seed] ℹ️ 5 cantine demo già presenti, nessuna aggiunta.'); } catch(_c){}
        }
      } catch(e) {
        try { console && console.log && console.log('[swl-seed] errore:', e); } catch(_c){}
      }
    })();

    /* Inietta sezione SOLO in #page-producers (NON in home!).
       Home usa SOLO "3 CANTINE DEL GIORNO" pescate dal pool master;
       TUTTE le cantine (ELITE/PRO/START) sono visibili SOLAMENTE nella
       pagina #page-producers (tab 🏆 PRODUTTORI) come richiesto. */
    function mountSection() {
      try {
        var pp = document.getElementById('page-producers');
        if (!pp) { setTimeout(mountSection, 400); return; }
        if (!document.getElementById('sw-producers-mounted')) {
          var flag = document.createElement('span');
          flag.id = 'sw-producers-mounted';
          flag.style.display = 'none';
          pp.appendChild(flag);
        }
        /* HOME: 3 CANTINE DEL GIORNO è gestita da buildDailyWinesCarousel()
           nella PRIMA IIFE (L ~600) — NON aggiungiamo altre card in home. */
        window.renderProducerPage && window.renderProducerPage();
      } catch(e){}
    }
    if (document.body) mountSection();
    else document.addEventListener('DOMContentLoaded', mountSection, { once: true });
    setTimeout(mountSection, 800);
    setTimeout(mountSection, 2200);
    setTimeout(function(){ window.renderProducerPage && window.renderProducerPage(); }, 3200);

/* =========================================================
   WORKFLOW CANTINE: PENDING → APPROVAZIONE ADMIN → LOGIN → EDIT
   ========================================================= */
window.sha256Hex = async function(str) {
  try {
    var buf = new TextEncoder().encode(String(str||''));
    var hash = await crypto.subtle.digest('SHA-256', buf);
    var arr = Array.from(new Uint8Array(hash));
    return arr.map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
  } catch(e) { return null; }
};
window.swSlugify = function(name) {
  return String(name||'').toLowerCase()
    .replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e').replace(/[ìíîï]/g,'i')
    .replace(/[òóôõö]/g,'o').replace(/[ùúûü]/g,'u').replace(/[ñ]/g,'n').replace(/[ç]/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').substring(0,80) || ('cantina-'+Math.random().toString(36).slice(2,8));
};
function swLS() { try { return (typeof localStorage!=='undefined') ? localStorage : null; } catch(e){ return null; } }
window.swLS = swLS;
window.swGetMasterState = function() {
  try { var ls=swLS(); if (!ls) return {restaurants:[]}; var raw=ls.getItem('swl_master_state'); if (!raw) return {restaurants:[]}; var s=JSON.parse(raw); return (s && Array.isArray(s.restaurants)) ? s : {restaurants:[]}; } catch(e){ return {restaurants:[]}; }
};
window.swSetMasterState = function(s) { try { var ls=swLS(); if (ls) ls.setItem('swl_master_state', JSON.stringify(s||{restaurants:[]})); } catch(e){} };
window.swUploadAsync = function(key, value) {
  try {
    var W = 'https://hidden-term-f2d0.timotiniurie49.workers.dev';
    var ctrl = new AbortController();
    setTimeout(function(){ try { ctrl.abort(); } catch(_){} }, 3000);
    fetch(W+'/api/swl/'+encodeURIComponent(key), {
      method:'PUT', signal: ctrl.signal, headers:{'Content-Type':'application/json'},
      body: JSON.stringify({value: value||''})
    }).catch(function(){});
  } catch(e){}
};
var _swSelPkg = 'elite';
window.selectPkg = function(pkg) {
  _swSelPkg = String(pkg||'basic').toLowerCase().replace('premium','pro').replace('basic','start');
  ['pkg_elite','pkg_premium','pkg_basic'].forEach(function(id){
    try {
      var el=document.getElementById(id); if (!el) return;
      var match = (id==='pkg_elite'&&_swSelPkg==='elite')||(id==='pkg_premium'&&_swSelPkg==='pro')||(id==='pkg_basic'&&_swSelPkg==='start');
      el.style.outline = match ? '2px solid #D4AF37' : '';
    } catch(_){}
  });
  try {
    var badge=document.getElementById('prodFormBadge');
    if (badge) badge.textContent = (_swSelPkg==='pro'?'PREMIUM':(_swSelPkg==='start'?'BASIC':'ELITE')).toUpperCase();
    var f=document.getElementById('prodForm'); if (f) f.style.display='block';
    f && f.scrollIntoView && f.scrollIntoView({behavior:'smooth', block:'center'});
  } catch(_){}
};
window.submitProd = async function() {
  try {
    var nome = (document.getElementById('prodNome')||{}).value||'';
    var email = (document.getElementById('prodEmail')||{}).value||'';
    if (!nome || !email) { try { document.getElementById('prodStatus').innerHTML='<span style="color:#ff6b6b;">❌ Nome Cantina e Email obbligatori</span>'; } catch(_){} return; }
    var slug = window.swSlugify(nome);
    var ls = swLS(); if (!ls) return;
    var suffix = 2;
    while (ls.getItem('swl_restaurant_'+slug)) { slug = window.swSlugify(nome)+'-'+suffix; suffix++; }
    var record = {
      slug: slug, plan: _swSelPkg, tipology: 'cantina', name: nome, email: email,
      flag_wine: (document.getElementById('prodVino')||{}).value||'',
      img_profile_url: (document.getElementById('prodFoto')||{}).value||'',
      region: (document.getElementById('prodRegione')||{}).value||'',
      country: '', city: '', status: 'pending',
      status_note: 'Registrazione semplice da #page-producers — in attesa approvazione',
      submitted_at: Date.now(), password_hash: '', vini_desc: [], storia: '',
      vitigni: [], certificazioni: [], etichette_nr: 0, founded_year: null,
      altitudine: '', suolo: '', sito_web: '', website: '', instagram: '', facebook: ''
    };
    ls.setItem('swl_restaurant_'+slug, JSON.stringify(record));
    swUploadAsync('restaurant_'+slug, record);
    try {
      var st = document.getElementById('prodStatus');
      if (st) st.innerHTML = '<span style="color:#86efac;">✅ Grazie! Richiesa <b>'+escapeHtml(nome)+'</b> in attesa.<br>Email entro 24h. <small style="opacity:.55;">slug: '+escapeHtml(slug)+'</small></span>';
      ['prodNome','prodVino','prodFoto','prodRegione','prodEmail'].forEach(function(id){ try { var x=document.getElementById(id); if(x) x.value=''; } catch(_){} });
      document.getElementById('prodForm').style.display='none';
    } catch(_){}
  } catch(e) { try { console.log('submitProd err',e); } catch(_){} }
};
window.registerRestaurant = async function() {
  try {
    var nome = (document.getElementById('regName')||{}).value||'';
    var tipologia = (document.getElementById('regTipology')||{}).value||'ristorante';
    var email = (document.getElementById('regEmail')||{}).value||'';
    var pwd = (document.getElementById('regPwd')||{}).value||'';
    if (!nome || !email || !pwd || pwd.length < 6) {
      try { var st=document.getElementById('regStatus'); if (st) st.innerHTML='<span style="color:#ff6b6b;">❌ Nome, Email e Password (min 6) obbligatori</span>'; } catch(_){}
      return;
    }
    var slug = window.swSlugify(nome);
    var ls = swLS(); if (!ls) return;
    var suffix = 2;
    while (ls.getItem('swl_restaurant_'+slug)) { slug = window.swSlugify(nome)+'-'+suffix; suffix++; }
    var pwHash = await window.sha256Hex(pwd);
    var vitStr = (document.getElementById('regGrapes')||{}).value||'';
    var vitigni = vitStr ? vitStr.split(/[,;·]/).map(function(s){return s.trim();}).filter(Boolean) : [];
    var certsStr = (document.getElementById('regCerts')||{}).value||'';
    var certs = certsStr ? certsStr.split(/[,;·]/).map(function(s){return s.trim();}).filter(Boolean) : [];
    var record = {
      slug: slug, plan: tipologia==='cantina' ? 'start' : 'pro', tipology: tipologia,
      name: nome, country: (document.getElementById('regCountry')||{}).value||'',
      city: (document.getElementById('regCity')||{}).value||'',
      region: (document.getElementById('regRegion')||{}).value||'',
      address: (document.getElementById('regAddress')||{}).value||'',
      currency: (document.getElementById('regCurrency')||{}).value||'EUR',
      email: email, password_hash: pwHash || '',
      storia: (document.getElementById('regStoria')||{}).value||'',
      img_profile_url: (document.getElementById('regImgProfile')||{}).value||'',
      img_vineyard_url: (document.getElementById('regImgCover')||{}).value||'',
      emoji: (document.getElementById('regEmoji')||{}).value||'',
      altitudine: (document.getElementById('regTerrain')||{}).value||'', suolo: '',
      vitigni: vitigni, etichette_nr: parseInt((document.getElementById('regWineCount')||{}).value||'0') || 0,
      certificazioni: certs, founded_year: parseInt((document.getElementById('regFounded')||{}).value||'0') || null,
      website: (document.getElementById('regWebsite')||{}).value||'',
      sito_web: (document.getElementById('regWebsite')||{}).value||'',
      instagram: (document.getElementById('regSocial')||{}).value||'',
      facebook: (document.getElementById('regSocial')||{}).value||'',
      vini_desc: [], public_card: (document.getElementById('regPublic')||{}).checked === true,
      status: tipologia === 'cantina' ? 'pending' : 'approved',
      status_note: tipologia==='cantina' ? 'Registrazione completa — in attesa admin' : 'Ristorante — approvazione automatica',
      submitted_at: Date.now()
    };
    ls.setItem('swl_restaurant_'+slug, JSON.stringify(record));
    swUploadAsync('restaurant_'+slug, record);
    if (tipologia !== 'cantina') {
      var master = window.swGetMasterState();
      master.restaurants.push({
        slug: record.slug, name: record.name, plan: record.plan, tipology: record.tipology,
        city: record.city, region: record.region, country: record.country,
        public_card: !!record.public_card, is_restaurant: true, wines: 0,
        vitigni: (record.vitigni||[]).slice(0,6), etichette_nr: record.etichette_nr||0
      });
      window.swSetMasterState(master);
      swUploadAsync('master_state', master);
      try { ls.setItem('swl_wines_'+slug, JSON.stringify([])); } catch(_){}
    }
    try {
      var st = document.getElementById('regStatus');
      if (st) {
        if (tipologia==='cantina') {
          st.innerHTML = '<span style="color:#86efac;">✅ <b>'+escapeHtml(nome)+'</b> in attesa approvazione. Ti contatteremo via email.<br><small style="opacity:.55;">slug: '+escapeHtml(slug)+'</small></span>';
        } else {
          try { ls.setItem('swl_producer_session', JSON.stringify({slug:slug, ts:Date.now(), tip:tipologia})); } catch(_){}
          st.innerHTML = '<span style="color:#86efac;">✅ Area creata: <b>'+escapeHtml(nome)+'</b>! Reindirizzamento Dashboard...</span>';
          setTimeout(function(){ try { window.location.hash='#dashboard'; window.showPage && window.showPage('dashboard'); } catch(_){} }, 1800);
        }
      }
      ['regName','regCity','regCountry','regRegion','regAddress','regEmail','regPwd','regStoria','regImgProfile','regImgCover','regEmoji','regTerrain','regGrapes','regWineCount','regCerts','regFounded','regWebsite','regSocial'].forEach(function(id){ try { var x=document.getElementById(id); if(x && x.type==='checkbox') x.checked=false; else if(x) x.value=''; } catch(_){} });
    } catch(_){}
  } catch(e) { try { console.log('registerRestaurant err',e); } catch(_){} }
};
try {
  document.addEventListener('input', function(e){
    try {
      if (e.target && e.target.id==='regStoria') {
        var n = String(e.target.value||'').length;
        var cnt = document.getElementById('regStoriaCnt'); if (cnt) cnt.textContent = n;
        if (n>2000) e.target.value = e.target.value.substring(0,2000);
      }
    } catch(_){}
  });
} catch(_){}
window.swShowProducerLogin = function() {
  try {
    var html = '<div style="max-width:440px;width:96%;margin:auto;">'
      +'<div style="text-align:center;margin-bottom:22px;">'
      +'<div style="font-family:Cinzel;font-size:.5rem;letter-spacing:3px;color:#D4AF37;margin-bottom:6px;">✦ AREA RISERVATA ✦</div>'
      +'<div style="font-family:Playfair Display,serif;font-size:1.5rem;color:#fff;">Come vuoi accedere?</div>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:18px;">'
      +'<button onclick="window.swGoRestaurantDashboard()" style="padding:18px 16px;background:linear-gradient(135deg,rgba(212,175,55,.18),rgba(212,175,55,.06));border:1px solid rgba(212,175,55,.45);border-radius:10px;color:#E8D89B;font-family:Cinzel;font-size:.56rem;letter-spacing:2px;cursor:pointer;text-align:left;transition:all .2s;">'
      +'<div style="font-size:1.3rem;margin-bottom:4px;">🗝️</div>'
      +'<div style="font-size:.62rem;font-weight:700;color:#fff;">Area Ristoranti</div>'
      +'<div style="font-family:IM Fell English,serif;font-style:italic;color:rgba(245,239,226,.5);font-size:.74rem;margin-top:3px;">Carta dei Vini · Inventario · Dashboard</div>'
      +'</button>'
      +'<button onclick="window.swShowCantinaLoginForm()" style="padding:18px 16px;background:linear-gradient(135deg,rgba(120,140,255,.16),rgba(120,140,255,.05));border:1px solid rgba(120,140,255,.4);border-radius:10px;color:#c7d2fe;font-family:Cinzel;font-size:.56rem;letter-spacing:2px;cursor:pointer;text-align:left;transition:all .2s;">'
      +'<div style="font-size:1.3rem;margin-bottom:4px;">🔐</div>'
      +'<div style="font-size:.62rem;font-weight:700;color:#fff;">Area Cantine</div>'
      +'<div style="font-family:IM Fell English,serif;font-style:italic;color:rgba(245,239,226,.5);font-size:.74rem;margin-top:3px;">Scheda pubblica · Vini · Modifica dati</div>'
      +'</button>'
      +'</div>'
      +'<div style="text-align:center;"><button onclick="window.closeOverlay && window.closeOverlay();window.showPage && window.showPage(\'register\')" style="padding:10px 16px;background:transparent;border:1px solid rgba(212,175,55,.2);border-radius:6px;color:rgba(212,175,55,.55);font-family:Cinzel;font-size:.5rem;letter-spacing:1.5px;cursor:pointer;">Non hai un account? Registrati</button></div>'
      +'</div>';
    openOverlay('custom', { html: html, title: '🔐 Accesso' });
  } catch(e) { try { console.log('swShowProducerLogin err',e); } catch(_){} }
};
window.swGoRestaurantDashboard = function() {
  try {
    window.closeOverlay && window.closeOverlay();
    window.location.hash = '#dashboard';
    if (window.showPage) window.showPage('dashboard');
  } catch(e){}
};
window.swShowCantinaLoginForm = function() {
  try {
    var html = '<div style="max-width:440px;width:96%;margin:auto;">'
      +'<div style="text-align:center;margin-bottom:20px;">'
      +'<div style="font-family:Cinzel;font-size:.5rem;letter-spacing:3px;color:#D4AF37;margin-bottom:6px;">✦ AREA CANTINE ✦</div>'
      +'<div style="font-family:Playfair Display,serif;font-size:1.5rem;color:#fff;">Accedi alla tua Cantina</div>'
      +'<div style="font-family:IM Fell English,serif;font-style:italic;color:rgba(245,239,226,.45);margin-top:4px;">Cantina · Ristorante · Enoteca</div>'
      +'</div>'
      +'<div style="margin-bottom:14px;"><label style="display:block;font-family:Cinzel;font-size:.48rem;letter-spacing:2px;color:rgba(212,175,55,.6);margin-bottom:6px;">EMAIL *</label><input type="email" id="swLgnEmail" placeholder="tu@tuocantina.com" style="padding:12px 14px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.25);border-radius:6px;color:#fff;width:100%;box-sizing:border-box;font-size:.9rem;"></div>'
      +'<div style="margin-bottom:18px;"><label style="display:block;font-family:Cinzel;font-size:.48rem;letter-spacing:2px;color:rgba(212,175,55,.6);margin-bottom:6px;">PASSWORD *</label><input type="password" id="swLgnPwd" placeholder="La tua password" onkeydown="if(event.key==\'Enter\')window.swProducerLoginSubmit()" style="padding:12px 14px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.25);border-radius:6px;color:#fff;width:100%;box-sizing:border-box;font-size:.9rem;"></div>'
      +'<div id="swLgnStatus" style="text-align:center;min-height:22px;font-family:IM Fell English,serif;font-style:italic;margin-bottom:14px;"></div>'
      +'<button class="cta-btn" onclick="window.swProducerLoginSubmit()" style="width:100%;font-size:.64rem;letter-spacing:2px;margin-bottom:10px;">✦ ACCEDI</button>'
      +'<button onclick="window.swShowProducerLogin()" style="width:100%;padding:10px;background:transparent;border:1px solid rgba(212,175,55,.15);border-radius:6px;color:rgba(212,175,55,.5);font-family:Cinzel;font-size:.48rem;letter-spacing:1.5px;cursor:pointer;">← Indietro</button>'
      +'</div>';
    openOverlay('custom', { html: html, title: '🔐 Login Cantina' });
  } catch(e) { try { console.log('swShowCantinaLoginForm err',e); } catch(_){} }
};
window.swProducerLoginSubmit = async function() {
  try {
    var email = String((document.getElementById('swLgnEmail')||{}).value||'').toLowerCase().trim();
    var pw = (document.getElementById('swLgnPwd')||{}).value||'';
    var statusEl = document.getElementById('swLgnStatus');
    if (!email || !pw) { if (statusEl) statusEl.innerHTML='<span style="color:#ff6b6b;">❌ Inserisci email e password</span>'; return; }
    var pwHash = await window.sha256Hex(pw);
    var ls = swLS(); if (!ls) return;
    var matched = null;
    var matchedRole = 'owner';
    var matchedEmail = email;
    try {
      for (var k in ls) {
        if (k && k.indexOf('swl_restaurant_')===0) {
          try {
            var raw = ls.getItem(k); if (!raw) continue;
            var rec = JSON.parse(raw);
            if (!rec) continue;
            if (rec.email && String(rec.email).toLowerCase().trim()===email && rec.password_hash && rec.password_hash===pwHash) {
              matched = rec; matchedRole = 'owner'; matchedEmail = rec.email; break;
            }
            if (Array.isArray(rec.users)) {
              for (var ui=0; ui<rec.users.length; ui++) {
                var u = rec.users[ui] || {};
                if (u.email && String(u.email).toLowerCase().trim()===email && u.password_hash && u.password_hash===pwHash) {
                  matched = rec; matchedRole = u.role || 'viewer'; matchedEmail = u.email; break;
                }
              }
              if (matched) break;
            }
          } catch(_){}
        }
      }
    } catch(_){}
    if (!matched) { if (statusEl) statusEl.innerHTML='<span style="color:#ff6b6b;">❌ Credenziali errate</span>'; return; }
    if (matched.status==='pending') { if (statusEl) statusEl.innerHTML='<span style="color:#fbbf24;">⏳ Scheda in attesa approvazione. Ti contatteremo via email.</span>'; return; }
    if (matched.status==='rejected') { if (statusEl) statusEl.innerHTML='<span style="color:#ff6b6b;">❌ Richiesta rifiutata. Contattaci.</span>'; return; }
    try { ls.setItem('swl_producer_session', JSON.stringify({slug:matched.slug, ts:Date.now(), email:matchedEmail, role:matchedRole})); } catch(_){}
    if (statusEl) statusEl.innerHTML='<span style="color:#86efac;">✅ Accesso riuscito ('+matchedRole.toUpperCase()+')! Apertura Dashboard...</span>';
    setTimeout(function(){
      try {
        window.closeOverlay && window.closeOverlay();
        if (matched.tipology==='cantina') {
          window.location.hash='#page-producer-dashboard';
          window.showPage && window.showPage('producer-dashboard');
          setTimeout(function(){ window.swRenderProducerDashboard && window.swRenderProducerDashboard(matched.slug); }, 200);
        } else {
          window.location.hash='#dashboard';
          window.showPage && window.showPage('dashboard');
        }
      } catch(_){}
    }, 900);
  } catch(e) { try { console.log('swProducerLoginSubmit err',e); } catch(_){} }
};
window.swLogoutProducer = function() {
  try { swLS() && swLS().removeItem('swl_producer_session'); } catch(_){}
  try { alert('Logout effettuato'); } catch(_){}
  try { window.location.hash='#page-home'; window.showPage && window.showPage('home'); } catch(_){}
};
window.swGetProducerSession = function() {
  try { var ls=swLS(); if (!ls) return null; var raw=ls.getItem('swl_producer_session'); if (!raw) return null; var s=JSON.parse(raw); if (!s || !s.slug) return null; return s; } catch(e){ return null; }
};
function swRenderUsersSection(slug, r) {
  try {
    var users = Array.isArray(r.users) ? r.users : [];
    var sess = window.swGetProducerSession ? window.swGetProducerSession() : null;
    var myEmail = sess ? (sess.email||'').toLowerCase() : '';
    var safeSlug = slug.replace(/'/g,"\\'");
    var rows = '';
    rows += '<tr style="background:rgba(212,175,55,.08);"><td style="padding:8px;">'+escapeHtml(r.name||'Cantina')+'</td><td style="padding:8px;">'+escapeHtml(r.email||'')+'</td><td style="padding:8px;color:#D4AF37;">👑 OWNER</td><td style="padding:8px;color:rgba(255,255,255,.3);">—</td></tr>';
    for (var i=0; i<users.length; i++) {
      var u = users[i] || {};
      var uRole = u.role || 'viewer';
      var isMe = String(u.email||'').toLowerCase() === myEmail;
      var roleBadge = uRole==='owner'?'👑 OWNER':(uRole==='editor'?'✏️ EDITOR':'👁 VIEWER');
      var color = uRole==='owner'?'#D4AF37':(uRole==='editor'?'#93c5fd':'#fbbf24');
      var delBtn = isMe ? '<span style="color:rgba(255,255,255,.3);">—</span>' : '<button onclick="window.swRemoveRestaurantUser(\''+safeSlug+'\',\''+escapeHtml(String(u.email||'').replace(/'/g,"\\'"))+'\')" style="padding:4px 10px;border:1px solid rgba(255,107,107,.3);background:transparent;border-radius:4px;color:#fca5a5;font-family:Cinzel;font-size:.44rem;cursor:pointer;">🗑 Rimuovi</button>';
      var roleSel = '<select onchange="window.swChangeUserRole(\''+safeSlug+'\',\''+escapeHtml(String(u.email||'').replace(/'/g,"\\'"))+'\',this.value)" style="padding:4px 8px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.25);border-radius:4px;color:#fff;font-size:.7rem;">'
        + '<option value="viewer"'+(uRole==='viewer'?' selected':'')+'>👁 Viewer</option>'
        + '<option value="editor"'+(uRole==='editor'?' selected':'')+'>✏️ Editor</option>'
        + '</select>';
      rows += '<tr style="border-bottom:1px solid rgba(212,175,55,.1);"><td style="padding:8px;">'+escapeHtml(u.name||u.email||'Utente')+(isMe?' <span style="color:#D4AF37;font-size:.7rem;">(tu)</span>':'')+'</td><td style="padding:8px;">'+escapeHtml(u.email||'')+'</td><td style="padding:8px;color:'+color+';">'+roleBadge+'</td><td style="padding:8px;display:flex;gap:6px;align-items:center;">'+roleSel+delBtn+'</td></tr>';
    }
    var html = '<div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(212,175,55,.2);">'
      +'<div style="font-family:Cinzel;font-size:.5rem;letter-spacing:3px;color:rgba(212,175,55,.55);margin-bottom:6px;">◆ 👥 GESTIONE UTENTI</div>'
      +'<div style="font-family:IM Fell English,serif;font-style:italic;color:rgba(245,239,226,.42);margin-bottom:16px;font-size:.82rem;">Aggiungi utenti con permessi limitati. Viewer = sola lettura, Editor = può modificare ma non gestire utenti.</div>'
      +'<div style="overflow-x:auto;margin-bottom:20px;"><table style="width:100%;border-collapse:collapse;font-size:.85rem;color:rgba(245,239,226,.8);">'
      +'<thead><tr style="text-align:left;font-family:Cinzel;font-size:.44rem;letter-spacing:2px;color:rgba(212,175,55,.5);border-bottom:1px solid rgba(212,175,55,.2);">'
      +'<th style="padding:8px;">NOME</th><th style="padding:8px;">EMAIL</th><th style="padding:8px;">RUOLO</th><th style="padding:8px;">AZIONI</th>'
      +'</tr></thead><tbody>'+rows+'</tbody></table></div>'
      +'<div style="padding:16px;background:rgba(0,0,0,.25);border:1px solid rgba(212,175,55,.15);border-radius:8px;">'
      +'<div style="font-family:Cinzel;font-size:.46rem;letter-spacing:2px;color:rgba(212,175,55,.5);margin-bottom:12px;">➕ NUOVO UTENTE</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr auto;gap:10px;align-items:end;">'
      +'<div><label style="display:block;font-family:Cinzel;font-size:.4rem;letter-spacing:1px;color:rgba(212,175,55,.4);margin-bottom:4px;">NOME</label><input id="nu_nome" placeholder="Mario Rossi" style="padding:8px 10px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:4px;color:#fff;width:100%;box-sizing:border-box;font-size:.82rem;"></div>'
      +'<div><label style="display:block;font-family:Cinzel;font-size:.4rem;letter-spacing:1px;color:rgba(212,175,55,.4);margin-bottom:4px;">EMAIL *</label><input id="nu_email" type="email" placeholder="mario@esempio.com" style="padding:8px 10px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:4px;color:#fff;width:100%;box-sizing:border-box;font-size:.82rem;"></div>'
      +'<div><label style="display:block;font-family:Cinzel;font-size:.4rem;letter-spacing:1px;color:rgba(212,175,55,.4);margin-bottom:4px;">PASSWORD *</label><input id="nu_pwd" type="password" placeholder="min 6 caratteri" style="padding:8px 10px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:4px;color:#fff;width:100%;box-sizing:border-box;font-size:.82rem;"></div>'
      +'<div><label style="display:block;font-family:Cinzel;font-size:.4rem;letter-spacing:1px;color:rgba(212,175,55,.4);margin-bottom:4px;">RUOLO</label><select id="nu_role" style="padding:8px 10px;background:rgba(0,0,0,.4);border:1px solid rgba(212,175,55,.2);border-radius:4px;color:#fff;width:100%;box-sizing:border-box;font-size:.82rem;"><option value="viewer">👁 Viewer (sola lettura)</option><option value="editor">✏️ Editor (modifica)</option></select></div>'
      +'<button onclick="window.swAddRestaurantUser(\''+safeSlug+'\')" style="padding:8px 16px;background:linear-gradient(135deg,#D4AF37,#b8941f);border:none;border-radius:4px;color:#0A0A0A;font-family:Cinzel;font-size:.48rem;letter-spacing:1px;cursor:pointer;font-weight:700;white-space:nowrap;">➕ AGGIUNGI</button>'
      +'</div><div id="nu_status" style="margin-top:10px;min-height:18px;font-family:IM Fell English,serif;font-style:italic;font-size:.8rem;"></div>'
      +'</div></div>';
    return html;
  } catch(e) { return ''; }
}
window.swAddRestaurantUser = async function(slug) {
  try {
    var name = String((document.getElementById('nu_nome')||{}).value||'').trim();
    var email = String((document.getElementById('nu_email')||{}).value||'').toLowerCase().trim();
    var pwd = (document.getElementById('nu_pwd')||{}).value||'';
    var role = (document.getElementById('nu_role')||{}).value || 'viewer';
    var st = document.getElementById('nu_status');
    if (!email || !pwd) { if (st) st.innerHTML='<span style="color:#ff6b6b;">❌ Email e password obbligatorie</span>'; return; }
    if (pwd.length < 6) { if (st) st.innerHTML='<span style="color:#ff6b6b;">❌ Password minimo 6 caratteri</span>'; return; }
    var ls = swLS(); if (!ls) return;
    var raw = ls.getItem('swl_restaurant_'+slug); if (!raw) return;
    var r = JSON.parse(raw);
    if (!Array.isArray(r.users)) r.users = [];
    for (var i=0; i<r.users.length; i++) {
      if (String(r.users[i].email||'').toLowerCase() === email) {
        if (st) st.innerHTML='<span style="color:#ff6b6b;">❌ Utente con questa email già esistente</span>'; return;
      }
    }
    if (String(r.email||'').toLowerCase() === email) {
      if (st) st.innerHTML='<span style="color:#ff6b6b;">❌ Questa email è già dell\'Owner</span>'; return;
    }
    var pwHash = await window.sha256Hex(pwd);
    r.users.push({ name: name||email, email: email, password_hash: pwHash, role: role, created_at: Date.now() });
    ls.setItem('swl_restaurant_'+slug, JSON.stringify(r));
    try { swUploadAsync('restaurant_'+slug, r); } catch(_){}
    if (st) st.innerHTML='<span style="color:#86efac;">✅ Utente '+escapeHtml(name||email)+' aggiunto come '+role.toUpperCase()+'</span>';
    setTimeout(function(){ window.swRenderProducerDashboard && window.swRenderProducerDashboard(slug); }, 600);
  } catch(e){ try { console.log('swAddRestaurantUser err',e); } catch(_){} }
};
window.swRemoveRestaurantUser = function(slug, email) {
  try {
    if (!confirm('Rimuovere l\'utente '+email+'?')) return;
    var ls = swLS(); if (!ls) return;
    var raw = ls.getItem('swl_restaurant_'+slug); if (!raw) return;
    var r = JSON.parse(raw);
    if (!Array.isArray(r.users)) r.users = [];
    r.users = r.users.filter(function(u){ return String(u.email||'').toLowerCase() !== String(email||'').toLowerCase(); });
    ls.setItem('swl_restaurant_'+slug, JSON.stringify(r));
    try { swUploadAsync('restaurant_'+slug, r); } catch(_){}
    window.swRenderProducerDashboard && window.swRenderProducerDashboard(slug);
  } catch(e){ try { console.log('swRemoveRestaurantUser err',e); } catch(_){} }
};
window.swChangeUserRole = function(slug, email, newRole) {
  try {
    var ls = swLS(); if (!ls) return;
    var raw = ls.getItem('swl_restaurant_'+slug); if (!raw) return;
    var r = JSON.parse(raw);
    if (!Array.isArray(r.users)) return;
    for (var i=0; i<r.users.length; i++) {
      if (String(r.users[i].email||'').toLowerCase() === String(email||'').toLowerCase()) {
        r.users[i].role = newRole;
        break;
      }
    }
    ls.setItem('swl_restaurant_'+slug, JSON.stringify(r));
    try { swUploadAsync('restaurant_'+slug, r); } catch(_){}
    window.swRenderProducerDashboard && window.swRenderProducerDashboard(slug);
  } catch(e){ try { console.log('swChangeUserRole err',e); } catch(_){} }
};
window.swRenderProducerDashboard = function(slug) {
  try {
    var pg = document.getElementById('page-producer-dashboard');
    if (!pg) return;
    var ls = swLS(); if (!ls) return;
    var raw = ls.getItem('swl_restaurant_'+slug);
    if (!raw) { pg.innerHTML='<div style="padding:100px 18px;text-align:center;color:#fca5a5;">❌ Scheda non trovata ('+escapeHtml(slug)+')</div>'; return; }
    var r = JSON.parse(raw);
    var sess = window.swGetProducerSession ? window.swGetProducerSession() : null;
    var role = (sess && sess.role) ? sess.role : 'owner';
    var isViewer = role === 'viewer';
    var isOwner = role === 'owner';
    var dis = isViewer;
    var planLabel = r.plan==='elite'?'👑 ELITE':((r.plan==='pro'||r.plan==='premium')?'⭐ PREMIUM':'🍷 START');
    var statusLabel = r.status==='approved'?'<span style="color:#86efac;">✅ APPROVATA</span>':(r.status==='pending'?'<span style="color:#fbbf24;">⏳ PENDING</span>':'<span style="color:#fca5a5;">❌ RIFIUTATA</span>');
    var roleLabel = isOwner?'<span style="color:#D4AF37;">👑 OWNER</span>':(role==='editor'?'<span style="color:#93c5fd;">✏️ EDITOR</span>':'<span style="color:#fbbf24;">👁 VIEWER</span>');
    var vd = Array.isArray(r.vini_desc) ? r.vini_desc : [];
    var vitStr = Array.isArray(r.vitigni) ? r.vitigni.join(', ') : String(r.vitigni||'');
    var certStr = Array.isArray(r.certificazioni) ? r.certificazioni.join(', ') : String(r.certificazioni||'');
    var vdText = vd.length ? vd.map(function(v){ return JSON.stringify(v, null, 2); }).join('\n\n---\n\n') : '';
    var disAttr = dis?'disabled':'';
    var disStyle = dis?'opacity:.6;cursor:not-allowed;':'';
    pg.innerHTML = '<div style="padding-top:40px;max-width:900px;margin:0 auto;padding-bottom:100px;">'
      +'<div style="padding:16px 20px;background:linear-gradient(135deg,#1a0e00,#241400);border-bottom:1px solid rgba(212,175,55,.3);display:flex;align-items:center;gap:16px;justify-content:space-between;flex-wrap:wrap;">'
      +'<div><div style="font-family:Cinzel;font-size:.5rem;letter-spacing:3px;color:#D4AF37;margin-bottom:4px;">✦ AREA CANTINA ✦</div>'
      +'<div style="font-family:Playfair Display,serif;font-size:1.6rem;color:#fff;">'+escapeHtml(r.name)+'</div>'
      +'<div style="font-family:IM Fell English,serif;font-style:italic;color:rgba(245,239,226,.5);margin-top:4px;">Slug: <code style="background:rgba(212,175,55,.1);padding:2px 8px;border-radius:4px;">'+escapeHtml(r.slug)+'</code> · Piano: <b style="color:#D4AF37;">'+planLabel+'</b> · Stato: '+statusLabel+' · Ruolo: '+roleLabel+'</div></div>'
      +'<div style="display:flex;gap:8px;">'+(isViewer?'':'<button onclick="window.swSaveProducerEdit(\''+r.slug.replace(/'/g,"\\'")+'\')" style="padding:10px 18px;background:linear-gradient(135deg,#D4AF37,#b8941f);border:none;border-radius:6px;color:#0A0A0A;font-family:Cinzel;font-size:.56rem;letter-spacing:2px;cursor:pointer;font-weight:700;">💾 SALVA</button>')
      +'<button onclick="window.swLogoutProducer()" style="padding:10px 16px;border:1px solid rgba(255,107,107,.35);background:transparent;border-radius:6px;color:#fca5a5;font-family:Cinzel;font-size:.52rem;letter-spacing:2px;cursor:pointer;">🚪 ESCI</button></div></div>'
      +'<div style="padding:24px 18px;">'
      +(isViewer?'<div style="margin-bottom:20px;padding:12px 16px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.25);border-radius:8px;color:#fbbf24;font-family:IM Fell English,serif;font-style:italic;">👁 Modalità sola lettura (Viewer). Non puoi modificare i dati.</div>':'')
      +'<div style="font-family:Cinzel;font-size:.5rem;letter-spacing:3px;color:rgba(212,175,55,.55);margin-bottom:14px;">◆ DATI BASE</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">'
      +swField2('Nome Cantina *', 'pdc_name', r.name||'', dis)
      +swField2('Tipologia', 'pdc_tip', r.tipology||'cantina', true)
      +swField2('Paese *', 'pdc_country', r.country||'', dis)
      +swField2('Regione / Area', 'pdc_region', r.region||'', dis)
      +swField2('Città / Località', 'pdc_city', r.city||'', dis)
      +swField2('Anno Fondazione', 'pdc_founded', r.founded_year||'', dis)
      +swField2('Altitudine', 'pdc_alt', r.altitudine||'', dis)
      +swField2('Suolo / Terreno', 'pdc_suolo', r.suolo||'', dis)
      +swField2('N° Etichette', 'pdc_nr', r.etichette_nr||0, dis)
      +swField2('Email Contatto', 'pdc_email', r.email||'', dis)
      +swField2('Sito Web', 'pdc_www', r.website||r.sito_web||'', dis)
      +swField2('Instagram', 'pdc_ig', r.instagram||'', dis)
      +'</div>'
      +'<div style="margin-top:20px;font-family:Cinzel;font-size:.5rem;letter-spacing:3px;color:rgba(212,175,55,.55);margin-bottom:14px;">◆ VITIGNI & CERTIFICAZIONI (virgola)</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">'
      +swField2('Vitigni (es: Nebbiolo, Barbera)', 'pdc_vit', vitStr, dis)
      +swField2('Certificazioni (es: BIO, DOCG)', 'pdc_cert', certStr, dis)
      +'</div>'
      +'<div style="margin-top:20px;font-family:Cinzel;font-size:.5rem;letter-spacing:3px;color:rgba(212,175,55,.55);margin-bottom:14px;">◆ IMMAGINI (URL)</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">'
      +swField2('Foto Profilo Cantina', 'pdc_img1', r.img_profile_url||'', dis)
      +swField2('Foto Vigneto', 'pdc_img2', r.img_vineyard_url||r.img_cantina2_url||'', dis)
      +'</div>'
      +'<div style="margin-top:20px;font-family:Cinzel;font-size:.5rem;letter-spacing:3px;color:rgba(212,175,55,.55);margin-bottom:14px;">◆ STORIA (max 2000)</div>'
      +'<textarea id="pdc_storia" rows="9" '+(dis?'readonly':'')+' style="width:100%;box-sizing:border-box;padding:14px;line-height:1.7;background:rgba(0,0,0,.35);border:1px solid rgba(212,175,55,.22);border-radius:6px;color:#fff;font-family:Cormorant Garamond,serif;font-size:1rem;'+disStyle+'">'+escapeHtml(r.storia||'')+'</textarea>'
      +'<div id="pdc_storia_cnt" style="text-align:right;font-family:IM Fell English,serif;font-size:.72rem;color:rgba(212,175,55,.45);margin-top:2px;">'+String(r.storia||'').length+'/2000</div>'
      +'<div style="margin-top:20px;font-family:Cinzel;font-size:.5rem;letter-spacing:3px;color:rgba(212,175,55,.55);margin-bottom:10px;">◆ 🍾 ETICHETTE (separati da ---)</div>'
      +'<div style="font-family:IM Fell English,serif;font-style:italic;color:rgba(245,239,226,.38);margin-bottom:12px;font-size:.82rem;line-height:1.7;">Formato: <code>Nome, Annata, Vitigni, Descrizione</code> oppure JSON <code>{ name, vintage, grapes, description }</code></div>'
      +'<textarea id="pdc_vd" rows="16" '+(dis?'readonly':'')+' style="width:100%;box-sizing:border-box;padding:14px;line-height:1.6;background:rgba(0,0,0,.35);border:1px solid rgba(212,175,55,.22);border-radius:6px;color:#e8d89b;font-family:monospace;font-size:.78rem;white-space:pre;'+disStyle+'">'+escapeHtml(vdText)+'</textarea>'
      +'<div id="pdc_save_status" style="margin-top:20px;text-align:center;font-family:IM Fell English,serif;font-style:italic;min-height:24px;"></div>'
      +(isOwner? swRenderUsersSection(slug, r) : '')
      +'</div></div>';
    try {
      var stEl = document.getElementById('pdc_storia');
      if (stEl) stEl.addEventListener('input', function(){
        try {
          var n = String(this.value||'').length;
          var cnt = document.getElementById('pdc_storia_cnt'); if (cnt) cnt.textContent = n+'/2000';
          if (n>2000) this.value = this.value.substring(0,2000);
        } catch(_){}
      });
    } catch(_){}
  } catch(e) { try { console.log('swRenderProducerDashboard err',e); } catch(_){} }
};
function swField2(label, id, val, disabled) {
  return '<div><label style="display:block;font-family:Cinzel;font-size:.46rem;letter-spacing:2px;color:rgba(212,175,55,.5);margin-bottom:5px;">'+label+'</label>'
    +'<input id="'+id+'" type="text" value="'+escapeHtml(String(val||''))+'" '+(disabled?'disabled':'')+' style="padding:10px 12px;background:rgba(0,0,0,.35);border:1px solid rgba(212,175,55,.22);border-radius:6px;color:#fff;width:100%;box-sizing:border-box;font-size:.92rem;"></div>';
}
window.swSaveProducerEdit = function(slug) {
  try {
    var ls = swLS(); if (!ls) return;
    var raw = ls.getItem('swl_restaurant_'+slug); if (!raw) return;
    var r = JSON.parse(raw);
    var readV = function(id){ return (document.getElementById(id)||{}).value||''; };
    r.name = readV('pdc_name') || r.name;
    r.tipology = readV('pdc_tip') || r.tipology;
    r.country = readV('pdc_country');
    r.region = readV('pdc_region');
    r.city = readV('pdc_city');
    r.founded_year = parseInt(readV('pdc_founded')) || null;
    r.altitudine = readV('pdc_alt');
    r.suolo = readV('pdc_suolo');
    r.etichette_nr = parseInt(readV('pdc_nr')) || 0;
    r.email = readV('pdc_email') || r.email;
    r.website = readV('pdc_www');
    r.sito_web = readV('pdc_www');
    r.instagram = readV('pdc_ig');
    r.vitigni = readV('pdc_vit').split(/[,;·]/).map(function(s){return s.trim();}).filter(Boolean);
    r.certificazioni = readV('pdc_cert').split(/[,;·]/).map(function(s){return s.trim();}).filter(Boolean);
    r.img_profile_url = readV('pdc_img1');
    r.img_vineyard_url = readV('pdc_img2');
    r.storia = String(readV('pdc_storia')||'').substring(0,2000);
    try {
      var rawVd = String(readV('pdc_vd')||'').trim();
      var blocks = rawVd.split(/(?:^|\n)\s*---+\s*(?:\n|$)/).map(function(b){return b.trim();}).filter(Boolean);
      if (blocks.length === 0 && rawVd) blocks = [rawVd];
      var vdArr = [];
      for (var b=0; b<blocks.length; b++) {
        var blk = blocks[b];
        try { var obj = JSON.parse(blk); if (obj && obj.name) { vdArr.push(obj); continue; } } catch(_){}
        var parts = blk.split(/[,;·]/).map(function(s){return s.trim();}).filter(Boolean);
        if (parts.length) {
          vdArr.push({ name: parts[0], vintage: parts[1]||'', grapes: parts[2]||'', description: parts.slice(3).join(', ')||'' });
        }
      }
      r.vini_desc = vdArr;
    } catch(_){ r.vini_desc = []; }
    r.last_edit_ts = Date.now();
    ls.setItem('swl_restaurant_'+slug, JSON.stringify(r));
    swUploadAsync('restaurant_'+slug, r);
    var master = window.swGetMasterState();
    for (var i=0; i<master.restaurants.length; i++) {
      if (master.restaurants[i].slug===slug) {
        master.restaurants[i].name = r.name;
        master.restaurants[i].city = r.city;
        master.restaurants[i].region = r.region;
        master.restaurants[i].country = r.country;
        master.restaurants[i].plan = r.plan || master.restaurants[i].plan;
        master.restaurants[i].vitigni = (r.vitigni||[]).slice(0,6);
        master.restaurants[i].etichette_nr = r.etichette_nr || 0;
        break;
      }
    }
    window.swSetMasterState(master);
    swUploadAsync('master_state', master);
    try {
      var st = document.getElementById('pdc_save_status');
      if (st) st.innerHTML='<span style="color:#86efac;">✅ Salvato alle '+new Date().toLocaleTimeString()+' · '+r.vini_desc.length+' etichette</span>';
      window.renderProducerPage && window.renderProducerPage();
    } catch(_){}
  } catch(e) { try { console.log('swSaveProducerEdit err',e); } catch(_){} }
};
window.swRenderAdminPendingList = function(containerId) {
  try {
    var box = document.getElementById(containerId); if (!box) return;
    var ls = swLS(); if (!ls) return;
    var pending = [], approved = [], rejected = [];
    for (var k in ls) {
      if (k && k.indexOf('swl_restaurant_')===0) {
        try {
          var raw = ls.getItem(k); if (!raw) continue;
          var rec = JSON.parse(raw);
          if (!rec || rec.tipology!=='cantina') continue;
          if (rec.status==='pending') pending.push(rec);
          else if (rec.status==='approved') approved.push(rec);
          else if (rec.status==='rejected') rejected.push(rec);
        } catch(_){}
      }
    }
    var html = '';
    html += '<div style="margin-bottom:22px;">'
      +'<div style="font-family:Cinzel;font-size:.58rem;letter-spacing:2px;color:#fbbf24;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(251,191,36,.2);">⏳ IN ATTESA ('+pending.length+')</div>';
    if (!pending.length) html += '<div style="padding:14px;text-align:center;font-family:IM Fell English,serif;font-style:italic;color:rgba(245,239,226,.35);">Nessuna richiesta in attesa.</div>';
    for (var p=0; p<pending.length; p++) html += swAdminCard(pending[p], true);
    html += '</div>';
    html += '<div style="margin-bottom:22px;">'
      +'<div style="font-family:Cinzel;font-size:.58rem;letter-spacing:2px;color:#86efac;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(134,239,172,.2);">✅ APPROVATE ('+approved.length+')</div>';
    if (!approved.length) html += '<div style="padding:14px;text-align:center;font-family:IM Fell English,serif;font-style:italic;color:rgba(245,239,226,.35);">Nessuna cantina approvata.</div>';
    for (var a=0; a<approved.length; a++) html += swAdminCard(approved[a], false);
    html += '</div>';
    if (rejected.length) {
      html += '<div>'
        +'<div style="font-family:Cinzel;font-size:.58rem;letter-spacing:2px;color:#fca5a5;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(252,165,165,.2);">❌ RIFIUTATE ('+rejected.length+')</div>';
      for (var rj=0; rj<rejected.length; rj++) html += swAdminCard(rejected[rj], false);
      html += '</div>';
    }
    box.innerHTML = html;
  } catch(e) { try { console.log('swRenderAdminPendingList err',e); } catch(_){} }
};
function swAdminCard(r, isPending) {
  var planLbl = r.plan==='elite'?'👑 ELITE':((r.plan==='pro'||r.plan==='premium')?'⭐ PREMIUM':'🍷 START');
  var emailHref = r.email ? ' (<a href="mailto:'+escapeHtml(r.email)+'" style="color:#60a5fa;">✉️ scrivi</a>)' : '';
  return '<div style="background:rgba(0,0,0,.3);border:1px solid rgba(212,175,55,.15);border-radius:8px;padding:14px 16px;margin-bottom:10px;">'
    +'<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;">'
    +'<div style="flex:1;min-width:220px;">'
      +'<div style="font-family:Playfair Display,serif;font-size:1.15rem;color:#fff;">'+escapeHtml(r.name)+' <span style="font-size:.7rem;opacity:.6;">'+planLbl+'</span></div>'
      +'<div style="font-family:IM Fell English,serif;font-style:italic;color:rgba(245,239,226,.45);margin-top:2px;font-size:.88rem;">📍 '+(r.city?escapeHtml(r.city)+' · ':'')+escapeHtml(r.region||r.country||'N/D')+' · Slug: <code style="opacity:.7;">'+escapeHtml(r.slug)+'</code>'+emailHref+'</div>'
      +'<div style="margin-top:6px;color:rgba(245,239,226,.55);font-family:Cormorant Garamond,serif;font-size:.95rem;line-height:1.5;max-height:66px;overflow:hidden;">'+escapeHtml(String(r.storia||'(nessuna storia)').substring(0,220))+(String(r.storia||'').length>220?'…':'')+'</div>'
      +'<div style="margin-top:4px;color:#D4AF37;font-family:Cinzel;font-size:.52rem;letter-spacing:1px;">🍾 Etichette: '+(Array.isArray(r.vini_desc)?r.vini_desc.length:0)+' · '+ (r.submitted_at?new Date(r.submitted_at).toLocaleDateString():'N/D')+'</div>'
    +'</div>'
    +'<div style="display:flex;gap:6px;flex-wrap:nowrap;">'
      +(isPending?'<button onclick="window.swAdminApproveProducer(\''+r.slug.replace(/'/g,"\\'")+'\')" style="padding:8px 12px;background:rgba(134,239,172,.15);border:1px solid rgba(134,239,172,.5);border-radius:5px;color:#86efac;font-family:Cinzel;font-size:.5rem;letter-spacing:1px;cursor:pointer;white-space:nowrap;">✅ Approva</button>'
        +'<button onclick="window.swAdminRejectProducer(\''+r.slug.replace(/'/g,"\\'")+'\')" style="padding:8px 12px;background:rgba(252,165,165,.12);border:1px solid rgba(252,165,165,.4);border-radius:5px;color:#fca5a5;font-family:Cinzel;font-size:.5rem;letter-spacing:1px;cursor:pointer;white-space:nowrap;">❌ Rifiuta</button>':'')
      +'<button onclick="window.swOpenProducerPublic && window.swOpenProducerPublic(\''+r.slug.replace(/'/g,"\\'")+'\')" style="padding:8px 12px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.35);border-radius:5px;color:#D4AF37;font-family:Cinzel;font-size:.5rem;letter-spacing:1px;cursor:pointer;white-space:nowrap;">👁️ Anteprima</button>'
    +'</div></div></div>';
}
window.swAdminApproveProducer = function(slug) {
  try {
    var ls = swLS(); if (!ls) return;
    var raw = ls.getItem('swl_restaurant_'+slug); if (!raw) return;
    var r = JSON.parse(raw);
    r.status = 'approved';
    r.approved_at = Date.now();
    r.plan = r.plan || 'start';
    ls.setItem('swl_restaurant_'+slug, JSON.stringify(r));
    swUploadAsync('restaurant_'+slug, r);
    var master = window.swGetMasterState();
    var exists = false;
    for (var i=0; i<master.restaurants.length; i++) if (master.restaurants[i].slug===slug) { exists=true; break; }
    if (!exists) {
      master.restaurants.push({
        slug: r.slug, name: r.name, plan: r.plan, tipology: r.tipology,
        city: r.city, region: r.region, country: r.country,
        public_card: true, is_restaurant: true, wines: 0,
        vitigni: (r.vitigni||[]).slice(0,6), etichette_nr: r.etichette_nr || (Array.isArray(r.vini_desc)?r.vini_desc.length:0)
      });
      window.swSetMasterState(master);
      swUploadAsync('master_state', master);
    }
    try { ls.setItem('swl_wines_'+slug, JSON.stringify([])); } catch(_){}
    try { alert('✅ "'+r.name+'" APPROVATA! Ora visibile in 🏆 PRODUTTORI.'); } catch(_){}
    window.swRenderAdminPendingList && window.swRenderAdminPendingList('swAdminCantineBox');
    window.renderProducerPage && window.renderProducerPage();
  } catch(e) { try { console.log('swAdminApproveProducer err',e); } catch(_){} }
};
window.swAdminRejectProducer = function(slug) {
  try {
    if (!confirm('Confermi RIFIUTO? La cantina non sarà più visibile.')) return;
    var ls = swLS(); if (!ls) return;
    var raw = ls.getItem('swl_restaurant_'+slug); if (!raw) return;
    var r = JSON.parse(raw);
    r.status = 'rejected';
    r.rejected_at = Date.now();
    ls.setItem('swl_restaurant_'+slug, JSON.stringify(r));
    swUploadAsync('restaurant_'+slug, r);
    var master = window.swGetMasterState();
    master.restaurants = (master.restaurants||[]).filter(function(x){ return x.slug!==slug; });
    window.swSetMasterState(master);
    swUploadAsync('master_state', master);
    try { alert('❌ "'+r.name+'" rifiutata.'); } catch(_){}
    window.swRenderAdminPendingList && window.swRenderAdminPendingList('swAdminCantineBox');
    window.renderProducerPage && window.renderProducerPage();
  } catch(e) { try { console.log('swAdminRejectProducer err',e); } catch(_){} }
};
var _origRenderProducerPage = window.renderProducerPage;
window.renderProducerPage = function() {
  try {
    if (!_origRenderProducerPage) return;
    var ls = swLS();
    var ms = window.swGetMasterState();
    var filtered = [];
    for (var i=0; i<(ms.restaurants||[]).length; i++) {
      var rr = ms.restaurants[i];
      if (!rr || !rr.slug) continue;
      try {
        var raw = ls.getItem('swl_restaurant_'+rr.slug);
        if (!raw) { filtered.push(rr); continue; }
        var full = JSON.parse(raw);
        if (full && full.status && full.status!=='approved' && full.tipology==='cantina') continue;
        filtered.push(rr);
      } catch(_){ filtered.push(rr); }
    }
    var bak = (typeof state!=='undefined' && state && state.restaurants) ? state.restaurants.slice() : null;
    try {
      if (typeof state!=='undefined' && state) state.restaurants = filtered;
      _origRenderProducerPage();
      if (bak && typeof state!=='undefined') state.restaurants = bak;
    } catch(_){ if (bak && typeof state!=='undefined') state.restaurants = bak; }
  } catch(e) { try { _origRenderProducerPage && _origRenderProducerPage(); } catch(_){} }
};
try {
  var _origShowPage = window.showPage;
  window.showPage = function(page) {
    try { _origShowPage && _origShowPage(page); } catch(_){}
    if (page==='admin') setTimeout(function(){ window.swRenderAdminPendingList && window.swRenderAdminPendingList('swAdminCantineBox'); }, 300);
    var sess = window.swGetProducerSession();
    if (page==='producer-dashboard' && sess) setTimeout(function(){ window.swRenderProducerDashboard && window.swRenderProducerDashboard(sess.slug); }, 250);
  };
} catch(_){}

  } catch(e){ try { console && console.log && console.log('[homev2-cantine-error', e); } catch(_){} }
})();
