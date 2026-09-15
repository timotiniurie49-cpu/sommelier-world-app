﻿/**
 * SOMMELIER WORLD — Cloudflare Worker v4-CLEAN
 * AI Proxy: Groq primary → GPT-4o fallback → Gemini last
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SAFETY = `REGOLE FERREE:
- fillossera = insetto afide (NON fitoplasma, NON di origine asiatica)
- barolo = DOCG Nebbiolo 100%, Langhe (NON Monferrato)
- Non inventare fatti, date, produttori o vini
- Se non sei certo di qualcosa, dillo esplicitamente`;

function hasAnyAiKey(env) {
  return !!(env && (env.GROQ_API_KEY || env.OPENAI_API_KEY || env.GEMINI_API_KEY));
}

function hasVisionKey(env) {
  return !!(env && env.GEMINI_API_KEY);
}

function cleanWineName(name) {
  try {
    return String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch(e) {
    return String(name || '').replace(/\s+/g, ' ').trim();
  }
}

function buildAffiliateLinks(wineName) {
  const q = encodeURIComponent(cleanWineName(wineName));
  return {
    tannico: `https://www.tannico.it/catalogsearch/result/?q=${q}`,
    vivino: `https://www.vivino.com/search/wines?q=${q}`,
  };
}

const HOME_LANGS = ['it', 'en', 'fr', 'ru'];

const HOME_STATIC_ARTICLES = [
  {
    id: 'article_tokaj_cellars',
    slug: 'silent-cellars-of-tokaj',
    theme: 'history',
    region_bucket: 'world',
    grape_focus: ['Furmint', 'Harslevelu'],
    reading_minutes: 6,
    tags: ['tokaj', 'history', 'cellar'],
    image_keywords: ['tokaj cellar', 'wine cave', 'tuff cellar'],
    translations: {
      it: {
        title: 'Le cantine silenziose di Tokaj',
        intro: 'A Tokaj il tempo si deposita nelle pareti di tufo e governa il ritmo dell affinamento.',
        body: 'Tokaj non e solo un nome storico ma un sistema di cantine, umidita, muffe nobili e gallerie che danno forma al vino prima ancora del bicchiere. Le cave nel tufo mantengono temperatura stabile e respirazione lenta, creando uno spazio ideale per vini che hanno bisogno di calma.\n\nLa forza della regione non sta in un unico vitigno, ma nella relazione fra Furmint, Harslevelu, ventilazione collinare e nebbie autunnali. Anche nelle versioni piu ricche, il centro del vino resta guidato dall acidita. E questa precisione, piu della semplice dolcezza, che spiega la sua longevita.'
      },
      en: {
        title: 'The Silent Cellars of Tokaj',
        intro: 'In Tokaj, time settles into the tuff walls and shapes the rhythm of ageing.',
        body: 'Tokaj is not only a historical name but a system of cellars, humidity, noble mould and underground passages that shape wine before the glass. Tuff caves keep a stable temperature and a slow breath, creating an ideal space for wines that require patience.\n\nThe strength of the region does not rest on a single grape, but on the relation between Furmint, Harslevelu, hillside ventilation and autumn fog. Even in richer styles, acidity remains the core. That precision, more than sweetness alone, explains Tokaj longevity.'
      },
      fr: {
        title: 'Les caves silencieuses de Tokaj',
        intro: 'A Tokaj, le temps se depose dans les murs de tuf et regle le rythme de l elevage.',
        body: 'Tokaj n est pas seulement un nom historique mais un systeme de caves, d humidite, de moisissure noble et de galeries qui donnent une forme au vin avant meme le verre. Les caves de tuf gardent une temperature stable et une respiration lente, ideales pour les vins qui demandent de la patience.\n\nLa force de la region ne repose pas sur un seul cepage mais sur la relation entre le Furmint, le Harslevelu, l aeration des collines et les brumes d automne. Meme dans les versions les plus riches, l acidite reste au centre. C est cette precision, plus que la douceur seule, qui explique sa longevite.'
      },
      ru: {
        title: 'Тихие погреба Токая',
        intro: 'В Токае время оседает в стенах туфа и задает ритм выдержки.',
        body: 'Токай это не только историческое имя, но и система погребов, влажности, благородной плесени и подземных ходов, которые формируют вино еще до бокала. Погреба в туфе удерживают стабильную температуру и медленное дыхание, создавая идеальное пространство для вин, которым нужна выдержка.\n\nСила региона не в одном сорте, а в связи между Furmint, Harslevelu, вентиляцией склонов и осенними туманами. Даже в самых насыщенных стилях центр вина удерживается кислотностью. Именно эта точность, а не только сладость, объясняет его долговечность.'
      }
    }
  },
  {
    id: 'article_limestone_chardonnay',
    slug: 'why-limestone-changes-chardonnay',
    theme: 'terroir',
    region_bucket: 'france',
    grape_focus: ['Chardonnay'],
    reading_minutes: 5,
    tags: ['limestone', 'chardonnay', 'terroir'],
    image_keywords: ['limestone vineyard', 'chardonnay', 'chalk soil'],
    translations: {
      it: {
        title: 'Perche il calcare cambia lo Chardonnay',
        intro: 'Il calcare non aggiunge aromi come un ingrediente, ma cambia tensione, trama e finale.',
        body: 'Quando si parla di suolo calcareo si rischia spesso una formula troppo rapida. Il calcare non e un profumo diretto e non funziona come un aroma aggiunto. Lavora invece su drenaggio, riserva idrica e ritmo della vite.\n\nPer lo Chardonnay questo e decisivo. In molti contesti il vitigno tende a essere ampio e generoso; il calcare lo richiama verso una linea piu tesa, salina e nitida. Per questo due Chardonnay vinificati allo stesso modo possono apparire lontanissimi se provengono da geologie diverse.'
      },
      en: {
        title: 'Why Limestone Changes Chardonnay',
        intro: 'Limestone does not add aroma like an ingredient, yet it changes tension, texture and finish.',
        body: 'When people speak about limestone soils, they often use a shortcut. Limestone is not a direct smell and it does not behave like an added flavour. Instead, it shapes drainage, water balance and the rhythm of the vine.\n\nFor Chardonnay this matters deeply. In many settings the grape tends toward generosity and breadth; limestone pulls it back toward tension, salinity and precision. That is why two Chardonnays vinified in the same way may feel very different when they come from different geological matrices.'
      },
      fr: {
        title: 'Pourquoi le calcaire change le Chardonnay',
        intro: 'Le calcaire n ajoute pas d aromes comme un ingredient, mais il change la tension, la trame et la finale.',
        body: 'Quand on parle de sols calcaires, on risque souvent une formule trop rapide. Le calcaire n est pas un parfum direct et ne fonctionne pas comme un arome ajoute. Il agit plutot sur le drainage, la reserve en eau et le rythme de la vigne.\n\nPour le Chardonnay, c est decisif. Dans de nombreux contextes, le cepage est large et genereux; le calcaire le rappelle vers une ligne plus tendue, saline et nette. C est pourquoi deux Chardonnays vinifies de la meme facon peuvent sembler tres differents selon leur geologie.'
      },
      ru: {
        title: 'Почему известняк меняет Шардоне',
        intro: 'Известняк не добавляет аромат как ингредиент, но меняет напряжение, текстуру и финал вина.',
        body: 'Когда говорят об известняковых почвах, часто используют слишком быстрые формулы. Известняк не является прямым ароматом и не работает как добавленный вкус. Он влияет на дренаж, водный баланс и ритм лозы.\n\nДля Шардоне это особенно важно. Во многих условиях сорт склонен к широте и щедрости; известняк возвращает его к более напряженной, соленой и точной линии. Поэтому два одинаково винифицированных Шардоне могут восприниматься совершенно по-разному из-за геологии.'
      }
    }
  },
  {
    id: 'article_barolo_cask',
    slug: 'long-life-of-barolo-in-cask',
    theme: 'technique',
    region_bucket: 'italy',
    grape_focus: ['Nebbiolo'],
    reading_minutes: 5,
    tags: ['barolo', 'nebbiolo', 'cask'],
    image_keywords: ['barolo cask', 'oak cellar', 'nebbiolo'],
    translations: {
      it: {
        title: 'La lunga vita del Barolo in botte',
        intro: 'La botte grande non serve solo a cedere legno: nel Barolo e prima di tutto uno strumento di ordine.',
        body: 'Nel linguaggio contemporaneo la botte grande viene spesso raccontata come semplice assenza di marcatura aromatica. In realta il suo ruolo e molto piu ricco. Nel Barolo tradizionale la lunga sosta in legno grande riallinea tannino, frutto e respiro.\n\nIl Nebbiolo entra in cantina con una materia severa. L affinamento lento non cerca di addolcire il vino, ma di metterlo in ordine. Per questo il tempo non e un ostacolo ma un ingrediente strutturale della denominazione.'
      },
      en: {
        title: 'The Long Life of Barolo in Cask',
        intro: 'Large cask is not only there to add wood: in Barolo it is above all an instrument of order.',
        body: 'In contemporary language, large cask is often described as the mere absence of aromatic imprint. In truth its role is far richer. In traditional Barolo, long ageing in large wood realigns tannin, fruit and breath.\n\nNebbiolo enters the cellar with severe material. Slow ageing does not try to sweeten the wine, but to organise it. That is why time is not an obstacle here, but a structural ingredient of the denomination.'
      },
      fr: {
        title: 'La longue vie du Barolo en botte',
        intro: 'La grande botte ne sert pas seulement a donner du bois: dans le Barolo, elle est surtout un instrument d ordre.',
        body: 'Dans le langage contemporain, la grande botte est souvent decrite comme une simple absence d empreinte aromatique. En realite, son role est beaucoup plus riche. Dans le Barolo traditionnel, le long passage en grand bois realigne le tanin, le fruit et le souffle.\n\nLe Nebbiolo arrive en cave avec une matiere severe. L elevage lent ne cherche pas a adoucir le vin, mais a l ordonner. C est pourquoi le temps n est pas un obstacle, mais un ingredient structurel de l appellation.'
      },
      ru: {
        title: 'Долгая жизнь Бароло в бочке',
        intro: 'Большая бочка нужна не только для дерева: в Бароло это прежде всего инструмент порядка.',
        body: 'В современном языке большую бочку часто описывают как простое отсутствие ароматического следа дуба. На самом деле ее роль гораздо богаче. В традиционном Бароло длительная выдержка в большом дереве заново выстраивает танин, фрукт и дыхание вина.\n\nNebbiolo приходит в погреб с суровым материалом. Медленная выдержка не пытается смягчить вино, а приводит его в порядок. Поэтому время здесь не препятствие, а структурный ингредиент апелласьона.'
      }
    }
  },
  {
    id: 'article_secondary_fermentation',
    slug: 'secondary-fermentation-builds-precision',
    theme: 'technique',
    region_bucket: 'france',
    grape_focus: ['Chardonnay', 'Pinot Noir', 'Pinot Meunier'],
    reading_minutes: 5,
    tags: ['sparkling', 'secondary fermentation', 'precision'],
    image_keywords: ['sparkling wine', 'bubbles', 'cellar fermentation'],
    translations: {
      it: {
        title: 'Come la presa di spuma costruisce precisione',
        intro: 'Nel grande spumante la seconda fermentazione non e un effetto speciale: e una costruzione di struttura.',
        body: 'La presa di spuma viene spesso spiegata soltanto come passaggio tecnico. In realta ridisegna la forma sensoriale del vino. Non aggiunge solo anidride carbonica, ma cambia la percezione dell acidita, la continuita del sorso e la gestione della materia.\n\nQuando il vino base e preciso, le bollicine non coprono ma cesellano. Se invece la base e fragile, la spuma amplifica il difetto. Per questo le grandi bollicine nascono prima della presa di spuma, nel lavoro sul vino fermo.'
      },
      en: {
        title: 'How Secondary Fermentation Builds Precision',
        intro: 'In fine sparkling wine, the second fermentation is not a special effect but an act of structure.',
        body: 'Secondary fermentation is often described only as a technical step. In reality it redraws the sensory form of the wine. It does not merely add carbon dioxide, but changes acidity perception, continuity of the sip and the handling of texture.\n\nWhen the base wine is precise, bubbles do not cover but refine. When the base is fragile, foam amplifies the flaw. That is why great sparkling wines begin before the prise de mousse, in the work done on the still wine.'
      },
      fr: {
        title: 'Comment la prise de mousse construit la precision',
        intro: 'Dans un grand effervescent, la seconde fermentation n est pas un effet special mais une construction de structure.',
        body: 'La prise de mousse est souvent presentee seulement comme une etape technique. En realite, elle redessine la forme sensorielle du vin. Elle n ajoute pas seulement du gaz carbonique, mais change la perception de l acidite, la continuite du gout et la gestion de la matiere.\n\nQuand le vin de base est precis, les bulles ne couvrent pas, elles ciselent. Si la base est fragile, la mousse amplifie le defaut. C est pourquoi les grandes bulles commencent avant la prise de mousse, dans le travail sur le vin tranquille.'
      },
      ru: {
        title: 'Как вторичное брожение создает точность',
        intro: 'В большом игристом вине вторичное брожение это не эффект, а построение структуры.',
        body: 'Вторичное брожение часто описывают только как технический этап. На деле оно заново формирует сенсорную структуру вина. Оно не просто добавляет углекислый газ, а меняет восприятие кислотности, непрерывность глотка и работу текстуры.\n\nКогда базовое вино точно выстроено, пузырьки не скрывают, а уточняют. Если база слаба, пена лишь усиливает недостаток. Поэтому великие игристые начинаются еще до вторичного брожения, на стадии тихого вина.'
      }
    }
  },
  {
    id: 'article_exposure_altitude',
    slug: 'reading-exposure-and-altitude',
    theme: 'terroir',
    region_bucket: 'italy',
    grape_focus: ['Carricante', 'Nebbiolo'],
    reading_minutes: 5,
    tags: ['altitude', 'exposure', 'vineyard'],
    image_keywords: ['mountain vineyard', 'slope exposure', 'wine landscape'],
    translations: {
      it: {
        title: 'Leggere esposizione e quota in vigneto',
        intro: 'Esposizione e altitudine non sono dettagli cartografici: cambiano maturita, ombra e ritmo della pianta.',
        body: 'La stessa varieta puo parlare con timbro molto diverso a seconda di quota e orientamento del vigneto. L altitudine riduce temperature medie e allunga le escursioni termiche, mentre l esposizione regola il modo in cui luce e calore colpiscono la pianta.\n\nLeggere un vigneto significa combinare questi fattori, non isolarli. Non basta dire alto o basso, caldo o fresco: bisogna capire come il sito distribuisce energia nel tempo e come quella energia si trasforma nel bicchiere.'
      },
      en: {
        title: 'Reading Exposure and Altitude in the Vineyard',
        intro: 'Exposure and altitude are not map details: they change ripeness, shade and the rhythm of the vine.',
        body: 'The same grape may speak with a very different voice depending on altitude and vineyard orientation. Altitude lowers average temperatures and widens thermal shifts, while exposure controls how light and warmth strike the plant.\n\nReading a vineyard means combining these factors rather than isolating them. It is not enough to say high or low, warm or cool: one must understand how the site distributes energy over time and how that energy becomes style in the glass.'
      },
      fr: {
        title: 'Lire exposition et altitude au vignoble',
        intro: 'Exposition et altitude ne sont pas des details de carte: elles changent la maturite, l ombre et le rythme de la vigne.',
        body: 'Un meme cepage peut parler d une voix tres differente selon l altitude et l orientation du vignoble. L altitude abaisse les temperatures moyennes et allonge les amplitudes thermiques, tandis que l exposition regle la facon dont la lumiere et la chaleur frappent la plante.\n\nLire un vignoble signifie combiner ces facteurs et non les isoler. Il ne suffit pas de dire haut ou bas, chaud ou frais: il faut comprendre comment le site distribue l energie dans le temps et comment cette energie devient style dans le verre.'
      },
      ru: {
        title: 'Как читать экспозицию и высоту виноградника',
        intro: 'Экспозиция и высота это не картографические детали: они меняют зрелость, тень и ритм лозы.',
        body: 'Один и тот же сорт может звучать по-разному в зависимости от высоты и ориентации участка. Высота снижает средние температуры и усиливает суточные колебания, а экспозиция определяет, как свет и тепло воздействуют на лозу.\n\nЧитать виноградник значит соединять эти факторы, а не рассматривать их отдельно. Недостаточно сказать высоко или низко, тепло или прохладно: нужно понимать, как участок распределяет энергию во времени и как эта энергия превращается в стиль вина.'
      }
    }
  },
  {
    id: 'article_service_decanting',
    slug: 'discipline-of-service-and-decanting',
    theme: 'service',
    region_bucket: 'world',
    grape_focus: [],
    reading_minutes: 4,
    tags: ['service', 'decanting', 'glass'],
    image_keywords: ['wine service', 'decanter', 'restaurant table'],
    translations: {
      it: {
        title: 'La disciplina del servizio e della decantazione',
        intro: 'Servire bene un vino non significa esibirsi, ma togliere attrito fra bottiglia, tavolo e bicchiere.',
        body: 'La decantazione viene spesso trattata come gesto teatrale. In realta ogni scelta di servizio dovrebbe avere una funzione precisa: separare il deposito, aiutare un vino chiuso, proteggere un vino maturo, oppure non intervenire affatto.\n\nLa stessa logica vale per temperatura, calice e ritmo del versaggio. Il servizio corretto non invade il vino ma lo mette in condizione di parlare con piu chiarezza e meno interferenze.'
      },
      en: {
        title: 'The Discipline of Service and Decanting',
        intro: 'Serving wine well is not a performance but the removal of friction between bottle, table and glass.',
        body: 'Decanting is often treated like a theatrical gesture. In reality every service decision should have a precise function: separating sediment, opening a closed wine, protecting a mature one, or deciding not to intervene at all.\n\nThe same logic applies to temperature, glass selection and pouring rhythm. Correct service does not invade the wine; it creates the conditions for it to speak with more clarity and fewer interferences.'
      },
      fr: {
        title: 'La discipline du service et de la decantation',
        intro: 'Bien servir un vin n est pas une demonstration mais une facon d enlever les frictions entre bouteille, table et verre.',
        body: 'La decantation est souvent consideree comme un geste theatrale. En realite, chaque choix de service doit avoir une fonction precise: separer le depot, ouvrir un vin ferme, proteger un vin mature ou choisir de ne pas intervenir.\n\nLa meme logique vaut pour la temperature, le choix du verre et le rythme du service. Le bon service n envahit pas le vin; il lui permet de parler avec plus de clarte et moins d interferences.'
      },
      ru: {
        title: 'Дисциплина подачи и декантации',
        intro: 'Хорошая подача вина это не спектакль, а устранение лишнего трения между бутылкой, столом и бокалом.',
        body: 'Декантацию часто воспринимают как театральный жест. На деле каждое решение в сервисе должно иметь точную функцию: отделить осадок, раскрыть закрытое вино, защитить зрелое вино или, наоборот, не вмешиваться.\n\nТа же логика относится к температуре, выбору бокала и ритму подачи. Правильный сервис не вторгается в вино; он создает условия, в которых оно говорит яснее и чище.'
      }
    }
  }
];

const HOME_STATIC_LESSONS = [
  {
    id: 'lesson_tasting_foundation',
    slug: 'introduzione-alla-degustazione',
    level: 'level1',
    rotation_days: 14,
    tags: ['degustazione', 'metodo', 'base'],
    image_keywords: ['wine tasting', 'glass analysis', 'notes'],
    translations: {
      it: {
        title: 'Introduzione alla degustazione',
        intro: 'Un modulo essenziale per costruire un metodo chiaro fra vista, naso e bocca.',
        body: 'La degustazione ordinata non parte dal giudizio ma dal metodo. Si osserva il vino, si ascolta il profilo aromatico e poi si valuta la bocca con una sequenza coerente.\n\nQuesto approccio rende comparabili vini molto diversi e riduce l errore di impressione. Il linguaggio deve essere semplice ma preciso, perche la chiarezza e gia parte della competenza.'
      },
      en: {
        title: 'Introduction to Tasting',
        intro: 'An essential module for building a clear method across sight, nose and palate.',
        body: 'Orderly tasting begins with method rather than judgement. One observes the wine, listens to the aromatic profile and then evaluates the palate through a coherent sequence.\n\nThis approach makes very different wines comparable and reduces impressionistic error. Language should remain simple yet precise, because clarity is already part of competence.'
      },
      fr: {
        title: 'Introduction a la degustation',
        intro: 'Un module essentiel pour construire une methode claire entre la vue, le nez et la bouche.',
        body: 'La degustation ordonnee commence par la methode plutot que par le jugement. On observe le vin, on ecoute le profil aromatique puis on evalue la bouche selon une sequence coherente.\n\nCette approche permet de comparer des vins tres differents et de reduire l erreur impressionniste. Le langage doit rester simple mais precis, car la clarte fait deja partie de la competence.'
      },
      ru: {
        title: 'Введение в дегустацию',
        intro: 'Базовый модуль для построения ясного метода через зрение, аромат и вкус.',
        body: 'Упорядоченная дегустация начинается не с оценки, а с метода. Сначала наблюдают вино, затем слушают ароматический профиль и только потом анализируют вкус по связной последовательности.\n\nТакой подход позволяет сравнивать очень разные вина и снижает риск субъективной ошибки. Язык должен быть простым, но точным, потому что ясность уже является частью профессионализма.'
      }
    }
  },
  {
    id: 'lesson_visual_phase',
    slug: 'analisi-sensoriale-fase-visiva',
    level: 'level2',
    rotation_days: 14,
    tags: ['analisi', 'vista', 'degustazione'],
    image_keywords: ['wine visual analysis', 'glass color', 'tasting room'],
    translations: {
      it: {
        title: 'Analisi sensoriale: fase visiva',
        intro: 'La vista non decora la degustazione: formula ipotesi su evoluzione, densita e stato del vino.',
        body: 'Limpidezza, tonalita, densita e vivacita aiutano a intuire estratto, eta e possibile conservazione del vino. La fase visiva non conclude, ma orienta l ascolto delle fasi successive.\n\nGuardare bene significa gia degustare meglio. Una lettura attenta evita interpretazioni superficiali e prepara una valutazione piu ordinata.'
      },
      en: {
        title: 'Sensory Analysis: Visual Phase',
        intro: 'Sight does not decorate tasting: it forms hypotheses about development, density and condition.',
        body: 'Clarity, hue, density and brightness help infer extract, age and possible storage condition. The visual phase does not conclude the tasting, but guides the later stages.\n\nLooking well already means tasting better. Careful observation prevents superficial interpretation and prepares a more orderly evaluation.'
      },
      fr: {
        title: 'Analyse sensorielle: phase visuelle',
        intro: 'La vue n embellit pas la degustation: elle formule des hypotheses sur l evolution, la densite et l etat du vin.',
        body: 'Limpidite, teinte, densite et vivacite aident a deviner l extrait, l age et la conservation possible du vin. La phase visuelle ne conclut pas la degustation, elle oriente les etapes suivantes.\n\nBien regarder signifie deja mieux deguster. Une observation attentive evite les lectures superficielles et prepare une evaluation plus ordonnee.'
      },
      ru: {
        title: 'Сенсорный анализ: визуальная фаза',
        intro: 'Зрение не украшает дегустацию: оно строит гипотезы о развитии, плотности и состоянии вина.',
        body: 'Прозрачность, оттенок, плотность и блеск помогают понять экстракт, возраст и возможное состояние вина. Визуальная фаза не завершает дегустацию, а направляет следующие шаги.\n\nХорошо смотреть значит лучше дегустировать. Внимательное наблюдение предотвращает поверхностные выводы и готовит более упорядоченную оценку.'
      }
    }
  },
  {
    id: 'lesson_pairing_texture',
    slug: 'abbinamenti-per-trama-e-struttura',
    level: 'level3',
    rotation_days: 14,
    tags: ['abbinamenti', 'struttura', 'menu'],
    image_keywords: ['food pairing', 'wine dinner', 'restaurant plate'],
    translations: {
      it: {
        title: 'Abbinamenti per trama e struttura',
        intro: 'Il piatto va letto nella sua densita reale, non nel suo nome.',
        body: 'Gli abbinamenti migliori non nascono da analogie facili ma da una lettura precisa di grassezza, succulenza, aromaticita e persistenza del piatto.\n\nIl vino giusto non e sempre quello che somiglia al cibo, ma quello che lo corregge o lo completa con equilibrio. Questo rende il servizio piu intelligente e meno meccanico.'
      },
      en: {
        title: 'Pairing by Texture and Structure',
        intro: 'A dish must be read through its real density, not through its name.',
        body: 'The best pairings do not come from easy analogies but from a precise reading of fat, succulence, aroma and persistence in the dish.\n\nThe right wine is not always the one that resembles the food, but the one that corrects or completes it with balance. That makes service more intelligent and less mechanical.'
      },
      fr: {
        title: 'Accords par texture et structure',
        intro: 'Un plat doit etre lu dans sa densite reelle, pas dans son nom.',
        body: 'Les meilleurs accords ne naissent pas d analogies faciles mais d une lecture precise du gras, de la succulence, de l aromaticite et de la persistance du plat.\n\nLe bon vin n est pas toujours celui qui ressemble au mets, mais celui qui le corrige ou le complete avec equilibre. Cela rend le service plus intelligent et moins mecanique.'
      },
      ru: {
        title: 'Сочетания по текстуре и структуре',
        intro: 'Блюдо нужно читать по его реальной плотности, а не по названию.',
        body: 'Лучшие сочетания рождаются не из простых аналогий, а из точного анализа жирности, сочности, ароматичности и продолжительности вкуса блюда.\n\nПравильное вино не всегда похоже на еду, а скорее уравновешивает или дополняет ее. Это делает сервис более умным и менее механическим.'
      }
    }
  },
  {
    id: 'lesson_service_sequence',
    slug: 'sequenza-del-servizio',
    level: 'level1',
    rotation_days: 14,
    tags: ['service', 'sequence', 'restaurant'],
    image_keywords: ['wine service', 'restaurant table', 'sommelier service'],
    translations: {
      it: {
        title: 'Sequenza del servizio',
        intro: 'Un servizio ordinato costruisce fiducia al tavolo e prepara la lettura corretta del vino.',
        body: 'Presentazione della bottiglia, apertura, assaggio di controllo, primo versaggio e osservazione del tavolo devono apparire naturali.\n\nIl servizio e una grammatica professionale: ogni gesto deve avere logica, misura e discrezione.'
      },
      en: {
        title: 'Sequence of Service',
        intro: 'Orderly service builds trust at the table and prepares the correct reading of the wine.',
        body: 'Bottle presentation, opening, control tasting, first pour and observation of the table must appear natural.\n\nService is a professional grammar: every gesture must have logic, proportion and discretion.'
      },
      fr: {
        title: 'Sequence du service',
        intro: 'Un service ordonne construit la confiance a table et prepare la bonne lecture du vin.',
        body: 'Presentation de la bouteille, ouverture, gout de controle, premier service et observation de la table doivent paraitre naturels.\n\nLe service est une grammaire professionnelle: chaque geste doit avoir logique, mesure et discretion.'
      },
      ru: {
        title: 'Последовательность сервиса',
        intro: 'Упорядоченный сервис создает доверие за столом и готовит правильное восприятие вина.',
        body: 'Подача бутылки, открытие, контрольная проба, первая подача и наблюдение за столом должны выглядеть естественно.\n\nСервис это профессиональная грамматика: каждый жест должен иметь логику, меру и сдержанность.'
      }
    }
  },
  {
    id: 'lesson_regions_map',
    slug: 'mappare-l-italia-per-denominazioni',
    level: 'level2',
    rotation_days: 14,
    tags: ['italy', 'regions', 'denominations'],
    image_keywords: ['italy wine map', 'vineyard regions', 'appellations'],
    translations: {
      it: {
        title: 'Mappare l Italia per denominazioni',
        intro: 'Le regioni si comprendono per famiglie stilistiche e geografie produttive.',
        body: 'L Italia del vino e una pluralita di sistemi. Ordinare la geografia attraverso assi utili aiuta a leggere meglio vitigni, suoli e stili.\n\nUna mappa mentale ben costruita rende piu semplice collegare degustazione, teoria e servizio.'
      },
      en: {
        title: 'Mapping Italy Through Denominations',
        intro: 'Regions are understood through style families and productive geographies.',
        body: 'Italian wine is a plurality of systems. Ordering geography through useful axes helps one read grapes, soils and styles more clearly.\n\nA well-built mental map makes it easier to connect tasting, theory and service.'
      },
      fr: {
        title: 'Cartographier l Italie par appellations',
        intro: 'Les regions se comprennent par familles de style et geographies productives.',
        body: 'Le vin italien est une pluralite de systemes. Ordonner la geographie selon des axes utiles aide a mieux lire les cepages, les sols et les styles.\n\nUne carte mentale bien construite facilite le lien entre degustation, theorie et service.'
      },
      ru: {
        title: 'Карта Италии через апелласьоны',
        intro: 'Регионы лучше понимать через стилевые семьи и производственную географию.',
        body: 'Итальянское вино состоит из множества систем. Упорядочивание географии по полезным осям помогает лучше читать сорта, почвы и стили.\n\nХорошо выстроенная ментальная карта упрощает связь между дегустацией, теорией и сервисом.'
      }
    }
  },
  {
    id: 'lesson_vintage_decision',
    slug: 'annate-cantina-e-decisione-di-servizio',
    level: 'level3',
    rotation_days: 14,
    tags: ['vintage', 'cellar', 'service decision'],
    image_keywords: ['wine cellar', 'old bottles', 'service decision'],
    translations: {
      it: {
        title: 'Annate, cantina e decisione di servizio',
        intro: 'Capire quando aprire, aspettare o decantare e una vera competenza professionale.',
        body: 'L eta del vino da sola non basta. Bisogna leggere stagione, produttore, formato e conservazione per decidere come servire una bottiglia.\n\nIl valore professionale sta nel motivare la scelta con chiarezza, senza trasformarla in un dogma.'
      },
      en: {
        title: 'Vintages, Cellar and Service Decisions',
        intro: 'Knowing when to open, wait or decant is a real professional skill.',
        body: 'Wine age alone is not enough. One must read season, producer, bottle format and storage in order to decide how to serve a bottle.\n\nProfessional value lies in explaining the decision clearly, without turning it into dogma.'
      },
      fr: {
        title: 'Millesimes, cave et decision de service',
        intro: 'Savoir quand ouvrir, attendre ou carafer est une vraie competence professionnelle.',
        body: 'L age du vin ne suffit pas. Il faut lire le millesime, le producteur, le format et la conservation pour decider comment servir une bouteille.\n\nLa vraie valeur professionnelle reside dans la capacite d expliquer la decision avec clarte, sans la transformer en dogme.'
      },
      ru: {
        title: 'Винтаж, погреб и решение по сервису',
        intro: 'Понимание того, когда открыть, подождать или декантировать, является настоящим профессиональным навыком.',
        body: 'Одного возраста вина недостаточно. Нужно учитывать сезон, производителя, формат бутылки и хранение, чтобы решить, как подавать бутылку.\n\nПрофессиональная ценность состоит в умении ясно объяснить решение, не превращая его в догму.'
      }
    }
  }
];

function getHomeKv(env) {
  return env && env.HOME_CONTENT_KV ? env.HOME_CONTENT_KV : null;
}

function getLocalizedValue(item, lang, field) {
  const tx = item && item.translations ? item.translations : {};
  return ((tx[lang] && tx[lang][field]) || (tx.it && tx.it[field]) || '').trim();
}

function getImageAlt(image, lang, fallbackTitle) {
  const alt = image && image.alt ? image.alt : {};
  return (alt[lang] || alt.it || fallbackTitle || '').trim();
}

function mapHomeEntry(item, lang, extra) {
  const image = item.image || {};
  const title = getLocalizedValue(item, lang, 'title');
  return {
    id: item.id,
    type: item.type || extra.type,
    slug: item.slug || '',
    sort_order: item.sort_order || extra.sort_order || 0,
    title,
    intro: getLocalizedValue(item, lang, 'intro'),
    body: getLocalizedValue(item, lang, 'body'),
    image_url: image.url || '',
    image_alt: getImageAlt(image, lang, title),
    image_keywords: Array.isArray(item.image_keywords) ? item.image_keywords : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    source_name: extra.source_name || '',
    source_url: extra.source_url || '',
    category: extra.category || '',
    region_bucket: item.region_bucket || '',
    grape_focus: Array.isArray(item.grape_focus) ? item.grape_focus : [],
    level: extra.level || '',
    reading_minutes: item.reading_minutes || 0,
    rotation_days: item.rotation_days || 0,
  };
}

function getHomeLessonPeriodKey(now) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function selectHomeLessons(now) {
  const pool = Array.isArray(HOME_STATIC_LESSONS) ? HOME_STATIC_LESSONS : [];
  const periodKey = getHomeLessonPeriodKey(now);
  let seed = 0;
  for (let i = 0; i < periodKey.length; i++) seed = (seed * 31 + periodKey.charCodeAt(i)) >>> 0;
  const levels = ['level1', 'level2', 'level3'];
  return levels.map(function(level) {
    const options = pool.filter(function(item) { return item.level === level; });
    if (!options.length) return null;
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return options[seed % options.length];
  }).filter(Boolean);
}

async function loadHomeContentFromKv(env, dateKey, lang, lessonPeriodKey) {
  const kv = getHomeKv(env);
  if (!kv) return null;
  const raw = await kv.get(`home:content:${dateKey}:${lang}`);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {}
  }
  const genericRaw = await kv.get(`home:content:${dateKey}:all`);
  if (genericRaw) {
    try {
      const parsed = JSON.parse(genericRaw);
      if (parsed && typeof parsed === 'object') {
        parsed.lang = lang;
        parsed.lesson_period_key = parsed.lesson_period_key || lessonPeriodKey;
        return parsed;
      }
    } catch (e) {}
  }

  const [newsRaw, articlesRaw, lessonsRaw] = await Promise.all([
    kv.get(`home:daily-news:${dateKey}`),
    kv.get(`home:daily-articles:${dateKey}`),
    kv.get(`home:weekly-lessons:${lessonPeriodKey}`),
  ]);

  let news = [];
  let articles = [];
  let lessons = [];
  try { news = newsRaw ? JSON.parse(newsRaw) : []; } catch (e) { news = []; }
  try { articles = articlesRaw ? JSON.parse(articlesRaw) : []; } catch (e) { articles = []; }
  try { lessons = lessonsRaw ? JSON.parse(lessonsRaw) : []; } catch (e) { lessons = []; }

  if (!Array.isArray(news)) news = [];
  if (!Array.isArray(articles)) articles = [];
  if (!Array.isArray(lessons)) lessons = [];
  if (!news.length && !articles.length && !lessons.length) return null;

  return {
    version: 'home-content-v1',
    lang,
    generated_at: new Date().toISOString(),
    date_key: dateKey,
    lesson_period_key: lessonPeriodKey,
    source: 'kv-blocks',
    news,
    articles,
    lessons,
  };
}

async function handleHomeContent(request, env, url) {
  const now = new Date();
  const lang = HOME_LANGS.includes((url.searchParams.get('lang') || 'it').trim()) ? (url.searchParams.get('lang') || 'it').trim() : 'it';
  const dateKey = /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('date') || '') ? (url.searchParams.get('date') || '').trim() : now.toISOString().slice(0, 10);
  const lessonPeriodKey = (url.searchParams.get('period') || '').trim() || getHomeLessonPeriodKey(now);

  const fromKv = await loadHomeContentFromKv(env, dateKey, lang, lessonPeriodKey);
  if (fromKv) return ok(fromKv);

  let newsItems = [];
  try {
    const newsUrl = new URL(request.url);
    newsUrl.pathname = '/api/news';
    newsUrl.search = '';
    newsUrl.searchParams.set('date', dateKey);
    newsUrl.searchParams.set('limit', '3');
    const newsRes = await handleNews(new Request(newsUrl.toString(), { method: 'GET' }), env);
    const newsJson = await newsRes.json();
    const sourceArticles = Array.isArray(newsJson?.articles) ? newsJson.articles : [];
    newsItems = sourceArticles.slice(0, 3).map(function(item, idx) {
      return {
        id: item.id || `news_${dateKey}_${idx + 1}`,
        type: 'news',
        slug: String(item.id || `news-${idx + 1}`).replace(/_/g, '-'),
        sort_order: idx + 1,
        tags: [String(item.categoria_it || 'notizie').toLowerCase()],
        image_keywords: [],
        image: {
          url: item.immagine || '',
          alt: {
            it: item.titolo_it || '',
            en: item.titolo_en || item.titolo_it || '',
            fr: item.titolo_fr || item.titolo_it || '',
            ru: item.titolo_ru || item.titolo_it || '',
          }
        },
        translations: {
          it: { title: item.titolo_it || '', intro: (item.testo_it || '').split('\n\n')[0] || '', body: item.testo_it || '' },
          en: { title: item.titolo_en || item.titolo_it || '', intro: (item.testo_en || item.testo_it || '').split('\n\n')[0] || '', body: item.testo_en || item.testo_it || '' },
          fr: { title: item.titolo_fr || item.titolo_it || '', intro: (item.testo_fr || item.testo_it || '').split('\n\n')[0] || '', body: item.testo_fr || item.testo_it || '' },
          ru: { title: item.titolo_ru || item.titolo_it || '', intro: (item.testo_ru || item.testo_it || '').split('\n\n')[0] || '', body: item.testo_ru || item.testo_it || '' },
        },
        source_name: item.fonte || '',
        source_url: item.link || '',
        category: item.categoria_it || '',
      };
    });
  } catch (e) {
    newsItems = [];
  }

  const articles = HOME_STATIC_ARTICLES.map(function(item, idx) {
    return mapHomeEntry(item, lang, {
      type: 'article',
      sort_order: idx + 1,
      category: item.theme || '',
    });
  });

  const lessons = selectHomeLessons(now).map(function(item, idx) {
    return mapHomeEntry(item, lang, {
      type: 'lesson',
      sort_order: idx + 1,
      level: item.level || '',
    });
  });

  const mappedNews = newsItems.map(function(item, idx) {
    return mapHomeEntry(item, lang, {
      type: 'news',
      sort_order: idx + 1,
      source_name: item.source_name || item.fonte || '',
      source_url: item.source_url || item.link || '',
      category: item.category || item.categoria_it || '',
    });
  });

  return ok({
    version: 'home-content-v1',
    lang,
    generated_at: now.toISOString(),
    date_key: dateKey,
    lesson_period_key: lessonPeriodKey,
    source: 'fallback-runtime',
    news: mappedNews,
    articles,
    lessons,
  });
}

function ensureArrayOfStrings(value) {
  if (!Array.isArray(value)) return [];
  return value.map(function(v) { return String(v || '').trim(); }).filter(Boolean);
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function getContentKv(env) {
  return getHomeKv(env);
}

async function loadAdminContentDb(env) {
  const kv = getContentKv(env);
  if (!kv) return null;
  const raw = await kv.get('content_admin_items_v1');
  if (!raw) return [];
  let parsed;
  try { parsed = JSON.parse(raw); } catch (e) { parsed = []; }
  return Array.isArray(parsed) ? parsed : [];
}

async function saveAdminContentDb(env, items) {
  const kv = getContentKv(env);
  if (!kv) return false;
  const list = Array.isArray(items) ? items : [];
  await kv.put('content_admin_items_v1', JSON.stringify(list));
  await kv.put('content_admin_meta_v1', JSON.stringify({
    updatedAt: new Date().toISOString(),
    count: list.length,
  }));
  return true;
}

function pickLocalizedFields(tx) {
  const src = tx && typeof tx === 'object' ? tx : {};
  return {
    title: String(src.title || '').trim(),
    intro: String(src.intro || '').trim(),
    body: String(src.body || '').trim(),
  };
}

function normalizeAdminContentItem(raw, prev) {
  const nowIso = new Date().toISOString();
  const source = raw && typeof raw === 'object' ? raw : {};
  const previous = prev && typeof prev === 'object' ? prev : {};
  const type = ['news', 'article', 'lesson'].includes(String(source.type || previous.type || '').trim())
    ? String(source.type || previous.type).trim()
    : 'article';
  const translations = source.translations && typeof source.translations === 'object' ? source.translations : (previous.translations || {});
  const titleIt = String(
    source.title_it ||
    (translations.it && translations.it.title) ||
    source.title ||
    (previous.translations && previous.translations.it && previous.translations.it.title) ||
    ''
  ).trim();

  const item = {
    id: String(source.id || previous.id || ('content_' + Date.now())).trim(),
    type,
    slug: String(source.slug || previous.slug || slugify(titleIt || source.id || previous.id || type)).trim(),
    status: ['draft', 'review', 'published', 'archived'].includes(String(source.status || previous.status || '').trim())
      ? String(source.status || previous.status).trim()
      : 'draft',
    sort_order: Number.isFinite(Number(source.sort_order)) ? Number(source.sort_order) : (Number(previous.sort_order) || 0),
    created_at: previous.created_at || nowIso,
    updated_at: nowIso,
    published_at: String(source.published_at || previous.published_at || '').trim(),
    source_kind: String(source.source_kind || previous.source_kind || '').trim(),
    source_name: String(source.source_name || previous.source_name || '').trim(),
    source_url: String(source.source_url || previous.source_url || '').trim(),
    source_domain: String(source.source_domain || previous.source_domain || '').trim(),
    external_url: String(source.external_url || previous.external_url || '').trim(),
    category: String(source.category || previous.category || '').trim(),
    region_bucket: String(source.region_bucket || previous.region_bucket || '').trim(),
    theme: String(source.theme || previous.theme || '').trim(),
    difficulty: String(source.difficulty || previous.difficulty || '').trim(),
    reading_minutes: Number.isFinite(Number(source.reading_minutes)) ? Number(source.reading_minutes) : (Number(previous.reading_minutes) || 0),
    level: String(source.level || previous.level || '').trim(),
    period_key: String(source.period_key || previous.period_key || '').trim(),
    rotation_days: Number.isFinite(Number(source.rotation_days)) ? Number(source.rotation_days) : (Number(previous.rotation_days) || 0),
    lesson_group: String(source.lesson_group || previous.lesson_group || '').trim(),
    study_goal: String(source.study_goal || previous.study_goal || '').trim(),
    exercise: String(source.exercise || previous.exercise || '').trim(),
    opening_style: String(source.opening_style || previous.opening_style || '').trim(),
    fact_status: String(source.fact_status || previous.fact_status || '').trim(),
    region_focus: ensureArrayOfStrings(source.region_focus || previous.region_focus),
    grape_focus: ensureArrayOfStrings(source.grape_focus || previous.grape_focus),
    wine_focus: ensureArrayOfStrings(source.wine_focus || previous.wine_focus),
    tags: ensureArrayOfStrings(source.tags || previous.tags),
    key_points: ensureArrayOfStrings(source.key_points || previous.key_points),
    image_keywords: ensureArrayOfStrings(source.image_keywords || previous.image_keywords),
    image: {
      mode: String((source.image && source.image.mode) || (previous.image && previous.image.mode) || '').trim(),
      url: String(source.image_url || (source.image && source.image.url) || previous.image_url || (previous.image && previous.image.url) || '').trim(),
      credit: String(source.image_credit || (source.image && source.image.credit) || previous.image_credit || (previous.image && previous.image.credit) || '').trim(),
      alt: {
        it: String(source.image_alt_it || (source.image_alt && source.image_alt.it) || (source.image && source.image.alt && source.image.alt.it) || (previous.image && previous.image.alt && previous.image.alt.it) || '').trim(),
        en: String(source.image_alt_en || (source.image_alt && source.image_alt.en) || (source.image && source.image.alt && source.image.alt.en) || (previous.image && previous.image.alt && previous.image.alt.en) || '').trim(),
        fr: String(source.image_alt_fr || (source.image_alt && source.image_alt.fr) || (source.image && source.image.alt && source.image.alt.fr) || (previous.image && previous.image.alt && previous.image.alt.fr) || '').trim(),
        ru: String(source.image_alt_ru || (source.image_alt && source.image_alt.ru) || (source.image && source.image.alt && source.image.alt.ru) || (previous.image && previous.image.alt && previous.image.alt.ru) || '').trim(),
      }
    },
    translations: {
      it: pickLocalizedFields((source.translations && source.translations.it) || {
        title: source.title_it || source.title,
        intro: source.intro_it || source.intro,
        body: source.body_it || source.body,
      } || (previous.translations && previous.translations.it)),
      en: pickLocalizedFields((source.translations && source.translations.en) || {
        title: source.title_en,
        intro: source.intro_en,
        body: source.body_en,
      } || (previous.translations && previous.translations.en)),
      fr: pickLocalizedFields((source.translations && source.translations.fr) || {
        title: source.title_fr,
        intro: source.intro_fr,
        body: source.body_fr,
      } || (previous.translations && previous.translations.fr)),
      ru: pickLocalizedFields((source.translations && source.translations.ru) || {
        title: source.title_ru,
        intro: source.intro_ru,
        body: source.body_ru,
      } || (previous.translations && previous.translations.ru)),
    }
  };

  if (!item.slug) item.slug = slugify(item.translations.it.title || item.id);
  if (item.status === 'published' && !item.published_at) item.published_at = nowIso;
  return item;
}

function pickAdminContentSummary(item) {
  return {
    id: item.id,
    type: item.type,
    slug: item.slug,
    status: item.status,
    sort_order: item.sort_order,
    created_at: item.created_at,
    updated_at: item.updated_at,
    published_at: item.published_at,
    title: (item.translations && item.translations.it && item.translations.it.title) || '',
    intro: (item.translations && item.translations.it && item.translations.it.intro) || '',
    region_bucket: item.region_bucket || '',
    theme: item.theme || '',
    level: item.level || '',
    reading_minutes: item.reading_minutes || 0,
    grape_focus: Array.isArray(item.grape_focus) ? item.grape_focus : [],
    source_name: item.source_name || '',
  };
}

function mapPublishedHomeItem(item) {
  return {
    id: item.id,
    type: item.type,
    slug: item.slug,
    status: item.status,
    sort_order: item.sort_order || 0,
    published_at: item.published_at || '',
    source_kind: item.source_kind || '',
    source_name: item.source_name || '',
    source_url: item.source_url || '',
    source_domain: item.source_domain || '',
    external_url: item.external_url || '',
    category: item.category || '',
    region_bucket: item.region_bucket || '',
    theme: item.theme || '',
    difficulty: item.difficulty || '',
    reading_minutes: item.reading_minutes || 0,
    level: item.level || '',
    period_key: item.period_key || '',
    rotation_days: item.rotation_days || 0,
    lesson_group: item.lesson_group || '',
    study_goal: item.study_goal || '',
    opening_style: item.opening_style || '',
    fact_status: item.fact_status || '',
    region_focus: Array.isArray(item.region_focus) ? item.region_focus : [],
    grape_focus: Array.isArray(item.grape_focus) ? item.grape_focus : [],
    wine_focus: Array.isArray(item.wine_focus) ? item.wine_focus : [],
    tags: Array.isArray(item.tags) ? item.tags : [],
    key_points: Array.isArray(item.key_points) ? item.key_points : [],
    image_keywords: Array.isArray(item.image_keywords) ? item.image_keywords : [],
    image: item.image || { mode: '', url: '', alt: { it: '', en: '', fr: '', ru: '' }, credit: '' },
    translations: item.translations || { it: { title: '', intro: '', body: '' }, en: {}, fr: {}, ru: {} },
  };
}

async function syncPublishedHomeBlocks(env, items) {
  const kv = getContentKv(env);
  if (!kv) return false;
  const list = Array.isArray(items) ? items : [];
  const published = list.filter(function(item) { return item && item.status === 'published'; });
  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10);
  const lessonPeriodKey = getHomeLessonPeriodKey(now);
  const news = published.filter(function(item) { return item.type === 'news'; }).map(mapPublishedHomeItem);
  const articles = published.filter(function(item) { return item.type === 'article'; }).map(mapPublishedHomeItem);
  const lessons = published.filter(function(item) { return item.type === 'lesson'; }).map(function(item) {
    const next = Object.assign({}, item);
    if (!next.period_key) next.period_key = lessonPeriodKey;
    return mapPublishedHomeItem(next);
  });
  await kv.put(`home:daily-news:${dateKey}`, JSON.stringify(news));
  await kv.put(`home:daily-articles:${dateKey}`, JSON.stringify(articles));
  await kv.put(`home:weekly-lessons:${lessonPeriodKey}`, JSON.stringify(lessons));
  return true;
}

async function handleAdminContentList(request, env, url) {
  const authBody = { password: url.searchParams.get('password') || '' };
  if (!isAdmin(request, env, authBody)) return ok({ error: 'Non autorizzato' }, 401);
  const items = await loadAdminContentDb(env);
  if (items === null) return ok({ error: 'HOME_CONTENT_KV non configurato nel Worker.' }, 503);
  const type = String(url.searchParams.get('type') || '').trim();
  const status = String(url.searchParams.get('status') || '').trim();
  const q = String(url.searchParams.get('q') || '').toLowerCase().trim();
  let filtered = items.slice();
  if (type) filtered = filtered.filter(function(item) { return item.type === type; });
  if (status) filtered = filtered.filter(function(item) { return item.status === status; });
  if (q) {
    filtered = filtered.filter(function(item) {
      const title = (item.translations && item.translations.it && item.translations.it.title) || '';
      const intro = (item.translations && item.translations.it && item.translations.it.intro) || '';
      return [title, intro, item.slug, item.region_bucket, item.theme, item.level].join(' ').toLowerCase().indexOf(q) >= 0;
    });
  }
  filtered.sort(function(a, b) {
    return String(b.updated_at || '').localeCompare(String(a.updated_at || ''));
  });
  return ok({ items: filtered.map(pickAdminContentSummary), count: filtered.length });
}

async function handleAdminContentGet(request, env, url) {
  const authBody = { password: url.searchParams.get('password') || '' };
  if (!isAdmin(request, env, authBody)) return ok({ error: 'Non autorizzato' }, 401);
  const id = String(url.searchParams.get('id') || '').trim();
  if (!id) return ok({ error: 'id mancante' }, 400);
  const items = await loadAdminContentDb(env);
  if (items === null) return ok({ error: 'HOME_CONTENT_KV non configurato nel Worker.' }, 503);
  const item = items.find(function(entry) { return String(entry.id || '') === id; });
  if (!item) return ok({ error: 'Non trovato' }, 404);
  return ok({ item });
}

async function handleAdminContentCreate(request, env) {
  const b = await request.json().catch(() => ({}));
  if (!isAdmin(request, env, b)) return ok({ error: 'Non autorizzato' }, 401);
  const raw = b.content && typeof b.content === 'object' ? b.content : null;
  if (!raw) return ok({ error: 'content mancante' }, 400);
  const items = await loadAdminContentDb(env);
  if (items === null) return ok({ error: 'HOME_CONTENT_KV non configurato nel Worker.' }, 503);
  const item = normalizeAdminContentItem(raw, null);
  if (items.some(function(entry) { return entry.id === item.id; })) return ok({ error: 'id gia esistente' }, 400);
  items.push(item);
  await saveAdminContentDb(env, items);
  if (item.status === 'published') await syncPublishedHomeBlocks(env, items);
  return ok({ ok: true, item, count: items.length });
}

async function handleAdminContentUpdate(request, env) {
  const b = await request.json().catch(() => ({}));
  if (!isAdmin(request, env, b)) return ok({ error: 'Non autorizzato' }, 401);
  const raw = b.content && typeof b.content === 'object' ? b.content : null;
  if (!raw) return ok({ error: 'content mancante' }, 400);
  const id = String(raw.id || '').trim();
  if (!id) return ok({ error: 'content.id mancante' }, 400);
  const items = await loadAdminContentDb(env);
  if (items === null) return ok({ error: 'HOME_CONTENT_KV non configurato nel Worker.' }, 503);
  const idx = items.findIndex(function(entry) { return String(entry.id || '') === id; });
  if (idx < 0) return ok({ error: 'Non trovato' }, 404);
  const item = normalizeAdminContentItem(raw, items[idx]);
  items[idx] = item;
  await saveAdminContentDb(env, items);
  await syncPublishedHomeBlocks(env, items);
  return ok({ ok: true, item, count: items.length });
}

async function handleAdminContentPublish(request, env) {
  const b = await request.json().catch(() => ({}));
  if (!isAdmin(request, env, b)) return ok({ error: 'Non autorizzato' }, 401);
  const id = String(b.id || '').trim();
  if (!id) return ok({ error: 'id mancante' }, 400);
  const items = await loadAdminContentDb(env);
  if (items === null) return ok({ error: 'HOME_CONTENT_KV non configurato nel Worker.' }, 503);
  const idx = items.findIndex(function(entry) { return String(entry.id || '') === id; });
  if (idx < 0) return ok({ error: 'Non trovato' }, 404);
  const base = Object.assign({}, items[idx], {
    status: 'published',
    published_at: new Date().toISOString(),
  });
  items[idx] = normalizeAdminContentItem(base, items[idx]);
  await saveAdminContentDb(env, items);
  await syncPublishedHomeBlocks(env, items);
  return ok({ ok: true, item: items[idx] });
}

let _wineDbMem = null;
let _wineDbMemAt = 0;

function getAuthBearer(request) {
  const h = request.headers.get('Authorization') || '';
  if (!h) return '';
  const m = h.match(/^\s*Bearer\s+(.+)\s*$/i);
  return m ? String(m[1] || '').trim() : '';
}

function isAdmin(request, env, body) {
  const pw = env && env.ADMIN_PASSWORD ? String(env.ADMIN_PASSWORD) : '';
  if (!pw) return false;
  const bearer = getAuthBearer(request);
  if (bearer && bearer === pw) return true;
  if (body && typeof body.password === 'string' && body.password === pw) return true;
  return false;
}

function getWineKv(env) {
  return env && env.WINE_DB_KV ? env.WINE_DB_KV : null;
}

async function loadWineDb(env, { bypassCache = false } = {}) {
  if (!bypassCache && _wineDbMem && (Date.now() - _wineDbMemAt) < 60000) return _wineDbMem;
  const kv = getWineKv(env);
  if (!kv) return null;
  const raw = await kv.get('wine_db_v1');
  if (!raw) return [];
  let parsed;
  try { parsed = JSON.parse(raw); } catch (e) { parsed = []; }
  if (!Array.isArray(parsed)) parsed = [];
  _wineDbMem = parsed;
  _wineDbMemAt = Date.now();
  return parsed;
}

async function saveWineDb(env, wines) {
  const kv = getWineKv(env);
  if (!kv) return false;
  const arr = Array.isArray(wines) ? wines : [];
  await kv.put('wine_db_v1', JSON.stringify(arr));
  await kv.put('wine_db_meta', JSON.stringify({ updatedAt: new Date().toISOString(), count: arr.length }));
  _wineDbMem = arr;
  _wineDbMemAt = Date.now();
  return true;
}

function scoreWine(q, w) {
  const qq = String(q || '').toLowerCase().trim();
  const nome = String(w?.nome || '').toLowerCase();
  const prod = String(w?.produttore || '').toLowerCase();
  const denom = String(w?.denominazione || '').toLowerCase();
  if (!qq) return 0;
  if (nome === qq) return 100;
  if (prod === qq) return 95;
  let s = 0;
  if (nome.includes(qq)) s += 50;
  if (prod.includes(qq)) s += 45;
  if (denom.includes(qq)) s += 25;
  if (nome.startsWith(qq)) s += 10;
  if (prod.startsWith(qq)) s += 8;
  return s;
}

function pickWineFields(w) {
  return {
    id: w?.id || '',
    nome: w?.nome || '',
    produttore: w?.produttore || '',
    denominazione: w?.denominazione || '',
    annata: w?.annata || '',
    tipo: w?.tipo || '',
    regione: w?.regione || '',
    paese: w?.paese || '',
    vitigni: Array.isArray(w?.vitigni) ? w.vitigni : [],
    note: w?.note || '',
  };
}

async function handleWineSearch(env, url) {
  const q = (url.searchParams.get('q') || '').trim();
  const limit = Math.max(1, Math.min(25, parseInt(url.searchParams.get('limit') || '10', 10) || 10));
  const wines = await loadWineDb(env);
  if (wines === null) return ok({ error: 'WINE_DB_KV non configurato nel Worker.' }, 503);
  if (!q) return ok({ results: [] });
  const scored = wines
    .map(w => ({ w, s: scoreWine(q, w) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(x => ({ score: x.s, ...pickWineFields(x.w) }));
  return ok({ q, results: scored });
}

async function handleWineGet(env, url) {
  const id = (url.searchParams.get('id') || '').trim();
  if (!id) return ok({ error: 'id mancante' }, 400);
  const wines = await loadWineDb(env);
  if (wines === null) return ok({ error: 'WINE_DB_KV non configurato nel Worker.' }, 503);
  const w = wines.find(x => String(x?.id || '') === id);
  if (!w) return ok({ error: 'Non trovato' }, 404);
  return ok({ wine: pickWineFields(w) });
}

async function handleWineMeta(env) {
  const kv = getWineKv(env);
  if (!kv) return ok({ error: 'WINE_DB_KV non configurato nel Worker.' }, 503);
  const metaRaw = await kv.get('wine_db_meta');
  let meta = {};
  try { meta = metaRaw ? JSON.parse(metaRaw) : {}; } catch (e) { meta = {}; }
  if (!meta || typeof meta !== 'object') meta = {};
  if (typeof meta.count !== 'number') {
    const wines = await loadWineDb(env, { bypassCache: true });
    meta.count = Array.isArray(wines) ? wines.length : 0;
  }
  return ok({ meta });
}

function buildWineContextText(wines) {
  const arr = Array.isArray(wines) ? wines : [];
  const lines = arr.slice(0, 20).map(function(w) {
    const v = (Array.isArray(w.vitigni) && w.vitigni.length) ? ` (${w.vitigni.join(', ')})` : '';
    return `• ${w.nome || ''} | ${w.produttore || ''} | ${w.regione || ''}${v}` +
      ((w.annata && w.annata !== 's.a.') ? ` ${w.annata}` : '') +
      (w.note ? ` — ${w.note}` : '');
  });
  return '\n\nVINI ARCHIVIO ENOLOGICO\n' + lines.join('\n') + '\n━━━ FINE ARCHIVIO ━━━';
}

async function handleWineContext(env, url) {
  const paese = (url.searchParams.get('paese') || '').trim().toLowerCase();
  const regione = (url.searchParams.get('regione') || '').trim().toLowerCase();
  const tipo = (url.searchParams.get('tipo') || '').trim().toLowerCase();
  const sparklingMode = (url.searchParams.get('sparklingMode') || '').trim().toLowerCase();
  const wines = await loadWineDb(env);
  if (wines === null) return ok({ error: 'WINE_DB_KV non configurato nel Worker.' }, 503);
  let relevant = wines.filter(function(w) {
    if (w && w.esaurito) return false;
    if (paese && String(w?.paese || '').toLowerCase().indexOf(paese) < 0) return false;
    if (regione && String(w?.regione || '').toLowerCase().indexOf(regione) < 0) return false;
    if (tipo) {
      if (tipo === 'bollicine' && sparklingMode === 'classico') {
        const d = String(w?.denominazione || '');
        const r = String(w?.regione || '');
        if (!(String(w?.tipo || '') === 'bollicine' && (
          r === 'Champagne' ||
          d.includes('Franciacorta') ||
          d.includes('Trento') ||
          d.includes('Alta Langa') ||
          d.includes('Metodo Classico')
        ))) return false;
      } else if (tipo === 'bollicine' && sparklingMode === 'charmat') {
        const d = String(w?.denominazione || '');
        const r = String(w?.regione || '');
        if (!(String(w?.tipo || '') === 'bollicine' && r !== 'Champagne' && !d.includes('Franciacorta'))) return false;
      } else if (String(w?.tipo || '').toLowerCase() !== tipo) {
        return false;
      }
    }
    return true;
  });
  if (!relevant.length && tipo) {
    relevant = wines.filter(function(w) {
      if (paese && String(w?.paese || '').toLowerCase().indexOf(paese) < 0) return false;
      if (regione && String(w?.regione || '').toLowerCase().indexOf(regione) < 0) return false;
      return true;
    });
  }
  if (!relevant.length) relevant = wines.slice(0, 30);
  relevant = relevant.slice(0, 20);
  return ok({
    wines: relevant.map(pickWineFields),
    context: buildWineContextText(relevant),
  });
}

async function handleAdminWineList(request, env, url) {
  const authBody = { password: url.searchParams.get('password') || '' };
  if (!isAdmin(request, env, authBody)) return ok({ error: 'Non autorizzato' }, 401);
  const wines = await loadWineDb(env, { bypassCache: true });
  if (wines === null) return ok({ error: 'WINE_DB_KV non configurato nel Worker.' }, 503);
  return ok({ wines: wines.map(pickWineFields) });
}

async function handleAdminWineImport(request, env) {
  const b = await request.json().catch(() => ({}));
  if (!isAdmin(request, env, b)) return ok({ error: 'Non autorizzato' }, 401);
  const wines = Array.isArray(b.wines) ? b.wines : [];
  if (!wines.length) return ok({ error: 'wines vuoto' }, 400);
  const okSave = await saveWineDb(env, wines);
  if (!okSave) return ok({ error: 'WINE_DB_KV non configurato nel Worker.' }, 503);
  return ok({ ok: true, count: wines.length });
}

async function handleAdminWineUpsert(request, env) {
  const b = await request.json().catch(() => ({}));
  if (!isAdmin(request, env, b)) return ok({ error: 'Non autorizzato' }, 401);
  const w = b.wine && typeof b.wine === 'object' ? b.wine : null;
  if (!w) return ok({ error: 'wine mancante' }, 400);
  const id = String(w.id || '').trim();
  if (!id) return ok({ error: 'wine.id mancante' }, 400);
  const wines = await loadWineDb(env, { bypassCache: true });
  if (wines === null) return ok({ error: 'WINE_DB_KV non configurato nel Worker.' }, 503);
  const idx = wines.findIndex(x => String(x?.id || '') === id);
  if (idx >= 0) wines[idx] = Object.assign({}, wines[idx], w);
  else wines.push(w);
  await saveWineDb(env, wines);
  return ok({ ok: true, count: wines.length });
}

async function handleAdminWineDelete(request, env) {
  const b = await request.json().catch(() => ({}));
  if (!isAdmin(request, env, b)) return ok({ error: 'Non autorizzato' }, 401);
  const id = String(b.id || '').trim();
  if (!id) return ok({ error: 'id mancante' }, 400);
  const wines = await loadWineDb(env, { bypassCache: true });
  if (wines === null) return ok({ error: 'WINE_DB_KV non configurato nel Worker.' }, 503);
  const next = wines.filter(x => String(x?.id || '') !== id);
  await saveWineDb(env, next);
  return ok({ ok: true, count: next.length });
}

export default {
  async fetch(request, env) {
    // 1. GESTIONE IMMAGINI E FILE (ASSETS) - Deve essere la prima cosa!
    if (request.method === "GET" || request.method === "HEAD" ) {
      if  (env.ASSETS) {
        const asset = await  env.ASSETS.fetch(request);
        if (asset.status !== 404) return  asset;
      }
    }

    // 2. ABILITA CORS (Per evitare i blocchi rossi nella console)
    const  corsHeaders = {
      "Access-Control-Allow-Origin": "*" ,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS" ,
      "Access-Control-Allow-Headers": "Content-Type, Authorization" ,
    };

    if (request.method === "OPTIONS" ) {
      return new Response(null, { headers : corsHeaders });
    }
    
    const url = new URL(request.url);

    /* ── GET /ping ── */
    if (url.pathname === '/ping') {
      return ok({
        ok: true,
        groq:   !!env.GROQ_API_KEY,
        gpt4o:  !!env.OPENAI_API_KEY,
        gemini: !!env.GEMINI_API_KEY,
        vision: !!env.GEMINI_API_KEY,
        admin:  !!env.ADMIN_PASSWORD,
        wineKv: !!env.WINE_DB_KV,
        homeKv: !!env.HOME_CONTENT_KV,
        required_env: {
          text_ai_any_of: ['GROQ_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY'],
          vision_requires: ['GEMINI_API_KEY'],
          admin_requires: ['ADMIN_PASSWORD'],
          wine_db_requires: ['WINE_DB_KV'],
          home_content_requires: ['HOME_CONTENT_KV'],
        },
        provider: env.GROQ_API_KEY ? 'groq' : (env.OPENAI_API_KEY ? 'gpt-4o' : 'gemini'),
        version: 'v23-2026-05-04',
        status: (env.GROQ_API_KEY || env.OPENAI_API_KEY || env.GEMINI_API_KEY)
          ? 'OK' : 'ERRORE: nessuna API key configurata',
      });
    }

    /* ── POST /api/news ── */
    if (url.pathname === '/api/news') {
      return handleNews(request, env);
    }

    /* ── POST /api/article ── */
    if (url.pathname === '/api/article') {
      const b = await request.json().catch(() => ({}));
      if (!hasAnyAiKey(env)) return ok({ error: 'AI non configurata nel Worker (manca API key).', required: ['GROQ_API_KEY','OPENAI_API_KEY','GEMINI_API_KEY'] }, 503);
      return handleArticle(env, b.topic || '', b.lang || 'it');
    }

    /* ── POST /api/translate ── */
    if (url.pathname === '/api/translate') {
      const b = await request.json().catch(() => ({}));
      if (!hasAnyAiKey(env)) return ok({ error: 'AI non configurata nel Worker (manca API key).', required: ['GROQ_API_KEY','OPENAI_API_KEY','GEMINI_API_KEY'] }, 503);
      return handleTranslate(env, b.text || '', b.targetLang || 'en');
    }

    if (request.method === 'GET' && url.pathname === '/api/home/content') {
      return handleHomeContent(request, env, url);
    }

    if (request.method === 'GET' && url.pathname === '/api/wines/meta') {
      return handleWineMeta(env);
    }

    if (request.method === 'GET' && url.pathname === '/api/wines/search') {
      return handleWineSearch(env, url);
    }

    if (request.method === 'GET' && url.pathname === '/api/wines/get') {
      return handleWineGet(env, url);
    }

    if (request.method === 'GET' && url.pathname === '/api/wines/context') {
      return handleWineContext(env, url);
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/wines/list') {
      return handleAdminWineList(request, env, url);
    }

    if (url.pathname === '/api/admin/wines/import') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      return handleAdminWineImport(request, env);
    }

    if (url.pathname === '/api/admin/wines/upsert') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      return handleAdminWineUpsert(request, env);
    }

    if (url.pathname === '/api/admin/wines/delete') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      return handleAdminWineDelete(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/content/list') {
      return handleAdminContentList(request, env, url);
    }

    if (request.method === 'GET' && url.pathname === '/api/admin/content/get') {
      return handleAdminContentGet(request, env, url);
    }

    if (url.pathname === '/api/admin/content/create') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      return handleAdminContentCreate(request, env);
    }

    if (url.pathname === '/api/admin/content/update') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      return handleAdminContentUpdate(request, env);
    }

    if (url.pathname === '/api/admin/content/publish') {
      if (request.method !== 'POST') return ok({ error: 'Metodo non permesso' }, 405);
      return handleAdminContentPublish(request, env);
    }

    /* ── POST / — proxy generico (sommelier, ricerca vini, scan foto) ── */
    if (request.method !== 'POST') {
      return ok({ error: 'Metodo non permesso' }, 405);
    }

    try {
      const body = await request.json();
      const { system, userMsg, maxTokens, imageB64, imageMime } = body;
      if (!system || !userMsg) return ok({ error: 'system e userMsg obbligatori' }, 400);

      /* Vision (foto menu) senza chiave → non esplodere: ritorna JSON vuoto */
      if (imageB64 && !hasVisionKey(env)) {
        return ok({
          text: '{"antipasti":[],"primi":[],"secondi":[],"contorni":[],"dessert":[],"altro":[]}',
          provider: 'vision-disabled',
          warning: 'Vision non configurata: manca GEMINI_API_KEY',
        }, 200);
      }

      if (!hasAnyAiKey(env)) {
        return ok({
          error: 'Nessuna API key configurata nel Worker. Imposta almeno una tra GROQ_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY.',
        }, 503);
      }

      const result = await ai(env, system, userMsg, maxTokens || 1800, imageB64, imageMime);
      let outText = result.text;
      try {
        const isWineSearch = String(system || '').includes('Sommelier Digitale di SommelierWorld') &&
          /^Dimmi tutto su:\s*/i.test(String(userMsg || ''));
        if (isWineSearch) {
          let q = String(userMsg || '').replace(/^Dimmi tutto su:\s*/i, '');
          q = q.split('\n')[0];
          q = q.split('▓')[0];
          q = q.trim();
          if (q) {
            const links = buildAffiliateLinks(q);
            outText +=
              `\n\nAcquista online:\n` +
              `<a href="${links.tannico}" target="_blank" rel="noopener noreferrer">Tannico</a>\n` +
              `<a href="${links.vivino}" target="_blank" rel="noopener noreferrer">Vivino</a>`;
          }
        }
      } catch(e) {}
      return ok({ text: outText, provider: result.provider });
    } catch (e) {
      console.error('Worker error:', e.message, e.stack ? e.stack.slice(0,200) : '');
      return ok({ 
        error: e.message || 'Errore sconosciuto',
        type: e.constructor ? e.constructor.name : 'Error',
      }, 500);
    }
  }
};

/* ══════════════════════════════════════════════════════
   MOTORE AI — Groq primo, poi GPT-4o, poi Gemini
   ══════════════════════════════════════════════════════ */
async function ai(env, system, userMsg, maxTokens, imageB64, imageMime) {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const errors = [];

  /* Vision (foto menu) → solo Gemini supporta immagini */
  if (imageB64 && env.GEMINI_API_KEY) {
    try {
      return { text: await geminiVision(env.GEMINI_API_KEY, system + '\n' + userMsg, imageB64, imageMime, maxTokens), provider: 'gemini-vision' };
    } catch (e) { errors.push('Gemini-vision: ' + e.message); }
  }

  /* 1. Gemini — generalmente più stabile per uso intenso */
  if (env.GEMINI_API_KEY) {
    for (let i = 0; i < 2; i++) {
      try {
        if (i > 0) await sleep(1500);
        return { text: await gemini(env.GEMINI_API_KEY, system + '\n\n' + userMsg, maxTokens), provider: 'gemini' };
      } catch (e) { errors.push('Gemini #' + (i+1) + ': ' + e.message); }
    }
  }

  /* 2. Groq — veloce, gratuito */
  if (env.GROQ_API_KEY) {
    for (let i = 0; i < 3; i++) {
      try {
        if (i > 0) await sleep(i * 1500);
        return { text: await groq(env.GROQ_API_KEY, system, userMsg, maxTokens), provider: 'groq' };
      } catch (e) {
        errors.push('Groq #' + (i+1) + ': ' + e.message);
        if (!e.message.includes('429') && !e.message.includes('503') && !e.message.includes('500')) break;
      }
    }
  }

  /* 3. GPT-4o — fallback finale a pagamento */
  if (env.OPENAI_API_KEY) {
    try {
      return { text: await gpt4o(env.OPENAI_API_KEY, system, userMsg, maxTokens), provider: 'gpt-4o' };
    } catch (e) { errors.push('GPT-4o: ' + e.message); }
  }

  throw new Error('Tutti i provider hanno fallito: ' + errors.join(' | '));
}

/* Traduzioni: usa Groq (economico) */
async function aiForTranslation(env, system, userMsg, maxTokens) {
  if (env.GROQ_API_KEY) {
    try { return { text: await groq(env.GROQ_API_KEY, system, userMsg, maxTokens), provider: 'groq' }; }
    catch (e) { console.error('Groq translate:', e.message); }
  }
  return ai(env, system, userMsg, maxTokens); /* fallback */
}

/* ══════════════════════════════════════════════════════
   HANDLERS
   ══════════════════════════════════════════════════════ */
async function handleNews(request, env) {
  const url = new URL(request.url);
  const dateParam = (url.searchParams.get('date') || '').trim();
  const limitParam = parseInt(url.searchParams.get('limit') || '5', 10);
  const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(5, limitParam)) : 5;

  const dateKey = /^\d{4}-\d{2}-\d{2}$/.test(dateParam) ? dateParam : new Date().toISOString().slice(0, 10);
  const dateObj = new Date(dateKey + 'T12:00:00Z');

  const FEEDS = [
    { url: 'https://www.decanter.com/wine-news/feed/', source: 'Decanter' },
    { url: 'https://www.thedrinksbusiness.com/category/wine/feed/', source: 'The Drinks Business' },
    { url: 'https://www.wineenthusiast.com/feed/', source: 'Wine Enthusiast' },
  ];

  const decode = (s) => {
    if (!s) return '';
    return String(s)
      .replace(/<!\[CDATA\[/g, '')
      .replace(/\]\]>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#8217;|&#x2019;/g, "'")
      .replace(/&#8211;|&#x2013;/g, '–')
      .replace(/&#8212;|&#x2014;/g, '—')
      .replace(/&#8230;|&#x2026;/g, '…')
      .trim();
  };

  let rawItems = [];
  for (const feed of FEEDS) {
    try {
      const r = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) });
      if (!r.ok) continue;
      const xml = await r.text();
      const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
      for (let i = 0; i < Math.min(6, items.length); i++) {
        const it = items[i];
        const tMatch = it.match(/<title>([\s\S]*?)<\/title>/i);
        const dMatch = it.match(/<description>([\s\S]*?)<\/description>/i);
        const title = decode(tMatch ? tMatch[1] : '').replace(/<[^>]+>/g, '').trim();
        const desc = decode(dMatch ? dMatch[1] : '').replace(/<[^>]+>/g, '').trim().slice(0, 320);
        if (!title || title.length < 8) continue;
        rawItems.push({ source: feed.source, title: title.slice(0, 180), desc });
      }
    } catch (_) {}
  }

  if (!rawItems.length) rawItems = fallbackItems();

  const uniq = new Map();
  for (const it of rawItems) {
    const k = (it.title || '').toLowerCase().replace(/\s+/g, ' ').trim();
    if (!k || uniq.has(k)) continue;
    uniq.set(k, it);
  }
  rawItems = [...uniq.values()];

  let seed = 0;
  for (let i = 0; i < dateKey.length; i++) seed = (seed * 31 + dateKey.charCodeAt(i)) >>> 0;
  for (let i = rawItems.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = rawItems[i]; rawItems[i] = rawItems[j]; rawItems[j] = tmp;
  }

  const CATS = ['🗞 Attualità del Vino', '🌿 Viticoltura Mondiale', '🎩 Sommelier del Mondo', '🌍 Terroir', '📚 Didattica per Neofiti'];
  const articles = [];

  /* Se non ci sono API key → ritorna notizie “safe” senza AI (no 500/503) */
  if (!hasAnyAiKey(env)) {
    const picked = rawItems.slice(0, limit);
    const safeArticles = picked.map((it, i) => {
      const cat = CATS[i % CATS.length];
      const title = (it.title || 'Notizie del vino').trim().slice(0, 90);
      const desc = (it.desc || '').trim();
      const txt =
        `Panoramica\n\n` +
        `Oggi nel mondo del vino si parla di: ${title}. ${desc ? ('Sintesi disponibile: ' + desc + '. ') : ''}` +
        `Di seguito una contestualizzazione prudente basata esclusivamente sulle informazioni visibili nel titolo e nella breve descrizione.\n\n` +
        `Contesto\n\n` +
        `Nel settore vitivinicolo, notizie di questo tipo impattano spesso su produzione, distribuzione e percezione del consumatore. ` +
        `Senza dati completi, è corretto leggere queste informazioni come un segnale da monitorare, non come un verdetto.\n\n` +
        `Cosa significa per produttori e appassionati\n\n` +
        `Per i produttori: attenzione a comunicazione, posizionamento e canali. Per il pubblico: verificare sempre la fonte primaria e ` +
        `confrontare più testate prima di trarre conclusioni.\n\n` +
        `Consigli pratici\n\n` +
        `Se il tema riguarda prezzi o disponibilità, valuta alternative regionali equivalenti. Se riguarda clima o vendemmie, osserva ` +
        `le tendenze su più annate e denominazioni. Se riguarda personaggi o eventi, cerca dichiarazioni ufficiali e contesto.\n\n` +
        `Fonti\n\n` +
        `Fonte indicata: ${it.source || 'N/D'} — Titolo/estratto RSS.`;
      return {
        id: 'rss_fallback_' + dateKey + '_' + i,
        isNews: true,
        generato_ai: false,
        fonte: it.source || '',
        titolo_it: title,
        testo_it: txt,
        categoria_it: cat,
        titolo_en: '', testo_en: '', titolo_fr: '', testo_fr: '', titolo_ru: '', testo_ru: '',
        data: dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
        immagine: '',
      };
    });
    return ok({ articles: safeArticles, count: safeArticles.length, fallback: true, reason: 'no_api_keys' });
  }

  const makeSafe = (it, i, cat) => {
    const title = (it.title || 'Notizie del vino').trim().slice(0, 90);
    const desc = (it.desc || '').trim();
    const txt =
      `Panoramica\n\n` +
      `Oggi nel mondo del vino si parla di: ${title}. ${desc ? ('Sintesi disponibile: ' + desc + '. ') : ''}` +
      `Di seguito una contestualizzazione prudente basata esclusivamente sulle informazioni visibili nel titolo e nella breve descrizione.\n\n` +
      `Contesto\n\n` +
      `Nel settore vitivinicolo, notizie di questo tipo impattano spesso su produzione, distribuzione e percezione del consumatore. ` +
      `Senza dati completi, è corretto leggere queste informazioni come un segnale da monitorare, non come un verdetto.\n\n` +
      `Cosa significa per produttori e appassionati\n\n` +
      `Per i produttori: attenzione a comunicazione, posizionamento e canali. Per il pubblico: verificare sempre la fonte primaria e ` +
      `confrontare più testate prima di trarre conclusioni.\n\n` +
      `Consigli pratici\n\n` +
      `Se il tema riguarda prezzi o disponibilità, valuta alternative regionali equivalenti. Se riguarda clima o vendemmie, osserva ` +
      `le tendenze su più annate e denominazioni. Se riguarda personaggi o eventi, cerca dichiarazioni ufficiali e contesto.\n\n` +
      `Fonti\n\n` +
      `Fonte indicata: ${it.source || 'N/D'} — Titolo/estratto RSS.`;
    return {
      id: 'rss_safe_' + dateKey + '_' + i,
      isNews: true,
      generato_ai: false,
      fonte: it.source || '',
      titolo_it: title,
      testo_it: txt,
      categoria_it: cat,
      titolo_en: '', testo_en: '', titolo_fr: '', testo_fr: '', titolo_ru: '', testo_ru: '',
      data: dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
      immagine: '',
    };
  };

  for (let i = 0; i < Math.min(limit, rawItems.length); i++) {
    const item = rawItems[i];
    const cat = CATS[i % CATS.length];
    try {
      const prompt = `Notizia reale di base:
FONTE: ${item.source}
TITOLO ORIGINALE: ${item.title}
TESTO ORIGINALE: ${item.desc}

${SAFETY}

Scrivi un articolo giornalistico approfondito in italiano basato su questa notizia.
REGOLE:
- Titolo: max 10 parole, completo, accattivante
- 4-5 paragrafi distinti, ognuno di 100-125 parole (TOTALE 500 PAROLE MINIMO)
- Stile professionale ma accessibile
- Contestualizza con dati storici/geografici reali
- Non inventare nomi, numeri o citazioni

JSON (zero testo fuori, zero markdown):
{"titolo":"titolo completo","categoria":"${cat}","testo":"par1 di 100-125 parole\n\npar2 di 100-125 parole\n\npar3 di 100-125 parole\n\npar4 di 100-125 parole\n\npar5 di 100-125 parole"}`;

      const parseJson = (raw) => {
        const clean = String(raw || '').replace(/```json|```/g, '').trim();
        const start = clean.indexOf('{');
        const end = clean.lastIndexOf('}');
        if (start < 0 || end < 0) throw new Error('JSON malformato');
        const j = JSON.parse(clean.slice(start, end + 1));
        if (!j || typeof j !== 'object') throw new Error('JSON non-oggetto');
        if (!j.titolo || !j.testo) throw new Error('Campi mancanti');
        const wc = String(j.testo).trim().split(/\s+/).filter(Boolean).length;
        if (wc < 320) throw new Error('Testo troppo corto');
        return j;
      };

      let j;
      try {
        const { text } = await ai(env, 'Sei un giornalista enologico esperto. Rispondi SOLO con JSON valido contenente articoli approfonditi.', prompt, 2400);
        j = parseJson(text);
      } catch (e1) {
        const retryPrompt =
          `REGOLE ASSOLUTE:\n` +
          `- Rispondi SOLO con un JSON valido, senza markdown e senza testo fuori.\n` +
          `- Campi: titolo, categoria, testo.\n` +
          `- Testo: 4-5 paragrafi separati da doppia riga vuota, 500 parole minimo.\n\n` +
          `DATI NOTIZIA:\n` +
          `Fonte: ${item.source}\nTitolo: ${item.title}\nEstratto: ${item.desc}\n\n` +
          `${SAFETY}\n\n` +
          `JSON:\n{"titolo":"...","categoria":"${cat}","testo":"..."}\n`;
        const { text: t2 } = await ai(env, 'Return ONLY valid JSON.', retryPrompt, 2600);
        j = parseJson(t2);
      }

      if (j && j.titolo && j.testo) {
        articles.push({
          id: 'rss_' + Date.now() + '_' + i,
          isNews: true, generato_ai: true, fonte: item.source,
          titolo_it: j.titolo, testo_it: j.testo,
          categoria_it: j.categoria || cat,
          titolo_en: '', testo_en: '', titolo_fr: '', testo_fr: '', titolo_ru: '', testo_ru: '',
          data: dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
          immagine: '',
        });
      }
    } catch (e) {
      console.error('Article', i, ':', e.message);
      articles.push(makeSafe(item, i, cat));
    }
  }

  if (articles.length < limit) {
    for (let i = articles.length; i < limit && i < rawItems.length; i++) {
      const item = rawItems[i];
      const cat = CATS[i % CATS.length];
      articles.push(makeSafe(item, i, cat));
    }
  }

  return ok({ articles, count: articles.length });
}

function fallbackItems() {
  return [
    { source: 'Wine World', title: 'Mercato del vino: nuovi record internazionali', desc: 'Il commercio enologico mondiale mostra dati positivi.' },
    { source: 'Decanter', title: 'Vendemmia 2025: qualità eccezionale in Italia', desc: 'I produttori italiani annunciano una delle migliori annate.' },
    { source: 'Vinography', title: 'Vini naturali: boom in Europa e Asia', desc: 'La domanda di vini biologici continua a crescere.' },
    { source: 'Wine Spectator', title: 'Borgogna: prezzi e accessibilità sotto pressione', desc: 'Il mercato dei Grand Cru continua a correre, mentre cresce il dibattito sull’accessibilità.' },
    { source: 'Wine Business', title: 'Clima e viticoltura: nuove aree emergenti nel Nord Europa', desc: 'Temperature medie in aumento e nuove sperimentazioni spostano il baricentro della viticoltura.' },
  ];
}

async function handleArticle(env, topic, lang) {
  const LANGS = { it: 'italiano', en: 'English', fr: 'français', ru: 'русский' };
  const langName = LANGS[lang] || 'italiano';

  /* PROMPT 1: Articolo strutturato JSON */
  const prompt =
    `Lingua di scrittura: ${langName}\n` +
    `TEMA DELL'ARTICOLO: "${topic}"\n\n${SAFETY}\n\n` +
    `Scrivi un articolo enciclopedico professionale di MINIMO 700 PAROLE TOTALI.\n\n` +
    `Devi scrivere ESATTAMENTE 5 PARAGRAFI, ognuno di MINIMO 140 parole:\n\n` +
    `Paragrafo 1 — STORIA: origini documentate del soggetto, anni precisi, luoghi reali, personaggi storici verificabili. Almeno 140 parole.\n` +
    `Paragrafo 2 — TECNICA: scienza, viticoltura, vinificazione, terroir, processi chimici. Almeno 140 parole.\n` +
    `Paragrafo 3 — ANEDDOTO: storia curiosa documentata con nomi e date reali. Almeno 140 parole.\n` +
    `Paragrafo 4 — ATTUALITÀ: produttori famosi contemporanei, denominazioni, riconoscimenti recenti. Almeno 140 parole.\n` +
    `Paragrafo 5 — CONSIGLI: consigli pratici degustazione, abbinamenti, conservazione, temperature. Almeno 140 parole.\n\n` +
    `IMPORTANTE: il titolo deve essere COMPLETO (mai troncato), max 10 parole, accattivante e specifico.\n\n` +
    `RISPONDI SOLO CON JSON (no markdown, no testo fuori):\n` +
    `{"titolo":"titolo completo qui","testo":"paragrafo 1 di 140+ parole\\n\\nparagrafo 2 di 140+ parole\\n\\nparagrafo 3 di 140+ parole\\n\\nparagrafo 4 di 140+ parole\\n\\nparagrafo 5 di 140+ parole"}`;

  /* Tentativo 1: AI principale con maxTokens elevati per evitare troncamento */
  try {
    const { text } = await ai(env, 'Sei un esperto enologo e storico del vino. Scrivi articoli enciclopedici approfonditi. Rispondi SOLO con JSON valido completo. ' + SAFETY, prompt, 4000);
    const clean = text.replace(/```json|```/g, '').trim();
    const start = clean.indexOf('{');
    const endIdx = clean.lastIndexOf('}');
    if (start < 0 || endIdx < 0) throw new Error('JSON malformato');
    const j = JSON.parse(clean.slice(start, endIdx + 1));
    if (!j.titolo || !j.testo) throw new Error('Campi mancanti');
    /* Verifica lunghezza minima per evitare articoli corti */
    const wordCount = j.testo.split(/\s+/).length;
    if (wordCount < 400) {
      console.warn('Articolo corto:', wordCount, 'parole. Riprovo.');
      throw new Error('Articolo troppo corto');
    }
    return ok({ titolo: j.titolo, testo: j.testo, ok: true, words: wordCount });
  } catch (e) {
    console.error('handleArticle attempt 1:', e.message);
  }

  /* Tentativo 2: prompt semplificato ma ancora con vincolo lunghezza */
  try {
    const fallbackPrompt = `Scrivi in ${langName} un articolo dettagliato di MINIMO 600 parole su: "${topic}".\n\n` +
      `Struttura in 5 paragrafi separati da doppia interlinea, ciascuno di almeno 120 parole.\n` +
      `Includi: storia, dati tecnici, aneddoti, produttori reali, consigli pratici.\n` +
      `${SAFETY}\n\nRispondi solo con il testo dell'articolo, senza titolo. Inizia direttamente con il primo paragrafo.`;
    const { text } = await ai(env, 'Esperto enologo che scrive articoli approfonditi. ' + SAFETY, fallbackPrompt, 3500);
    const cleanText = text.trim();
    if (cleanText.split(/\s+/).length < 200) throw new Error('Fallback troppo corto');
    /* Genera titolo dal topic */
    let titolo = topic;
    if (titolo.length > 80) titolo = titolo.slice(0, 77) + '...';
    return ok({ titolo: titolo, testo: cleanText, ok: true, fallback: true });
  } catch (e2) {
    return ok({ error: 'Servizio temporaneamente non disponibile. ' + e2.message }, 503);
  }
}

async function handleTranslate(env, text, targetLang) {
  const LNAMES = { en: 'English', fr: 'French', ru: 'Russian' };
  try {
    const { text: translated } = await aiForTranslation(env,
      'Professional wine translator. Return ONLY the translated text.',
      `Translate to ${LNAMES[targetLang] || targetLang}:\n\n${text}`,
      1200
    );
    return ok({ translated, lang: targetLang });
  } catch (e) {
    return ok({ error: e.message }, 503);
  }
}

/* ══════════════════════════════════════════════════════
   AI PROVIDERS
   ══════════════════════════════════════════════════════ */
async function groq(key, system, userMsg, maxTokens) {
  /* Usa il modello più capace per richieste lunghe (>1000 tokens), 8b per quelle brevi */
  const model = (maxTokens && maxTokens > 1500) ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant';
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      max_tokens: Math.min(maxTokens || 1600, 8000),
      temperature: 0.6,
      messages: [{ role: 'system', content: system }, { role: 'user', content: userMsg }],
    }),
  });
  if (!r.ok) {
    const err = await r.text().catch(() => r.status);
    throw new Error('Groq ' + r.status + ': ' + String(err).slice(0, 100));
  }
  let d;
  try { d = await r.json(); } 
  catch(je) { throw new Error('Groq: risposta non-JSON — ' + je.message); }
  const text = d.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('Groq: risposta vuota. Response: ' + JSON.stringify(d).slice(0,100));
  return text;
}

async function gpt4o(key, system, userMsg, maxTokens) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: maxTokens || 1600,
      temperature: 0.5,
      messages: [{ role: 'system', content: system }, { role: 'user', content: userMsg }],
    }),
  });
  if (!r.ok) {
    const err = await r.text().catch(() => r.status);
    throw new Error('GPT-4o ' + r.status + ': ' + String(err).slice(0, 100));
  }
  const d = await r.json();
  const text = d.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('GPT-4o: risposta vuota');
  return text;
}

async function geminiVision(key, prompt, imageB64, imageMime, maxTokens) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: imageMime || 'image/jpeg', data: imageB64 } }] }],
        generationConfig: { maxOutputTokens: maxTokens || 600, temperature: 0.2 },
      }),
    }
  );
  if (!r.ok) {
    const err = await r.text().catch(() => r.status);
    throw new Error('Gemini Vision ' + r.status + ': ' + String(err).slice(0, 200));
  }
  const d = await r.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) throw new Error('Gemini Vision: risposta vuota');
  return text;
}

async function gemini(key, prompt, maxTokens) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens || 1600, temperature: 0.6 },
      }),
    }
  );
  if (!r.ok) throw new Error('Gemini ' + r.status);
  const d = await r.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) throw new Error('Gemini: risposta vuota');
  return text;
}

function ok(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
