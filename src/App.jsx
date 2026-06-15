import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════
   ТЁМНАЯ ТЕМА — «Ночное чтение»
   ═══════════════════════════════════════════ */
const C = {
  bg:            "#0d0f14",
  bgGrad:        "radial-gradient(ellipse 80% 60% at 50% -10%, #1a1035 0%, #0d0f14 60%)",
  card:          "rgba(255,255,255,0.045)",
  cardBorder:    "rgba(255,255,255,0.08)",
  espresso:      "#e8e0f5",
  mocha:         "#b8acd4",
  latte:         "#7c6f9a",
  caramel:       "#a78bfa",
  caramelSoft:   "rgba(167,139,250,0.12)",
  caramelBorder: "rgba(167,139,250,0.35)",
  cream:         "rgba(255,255,255,0.04)",
  correct:       "#86efac",
  correctBg:     "rgba(134,239,172,0.10)",
  wrong:         "#fca5a5",
  wrongBg:       "rgba(252,165,165,0.10)",
  accent2:       "#f0abfc",
  faint:         "#3d3554",
  accentGlow:    "rgba(167,139,250,0.25)",
};

const fontDisplay = "'Inter', system-ui, sans-serif";
const fontBody    = "'Inter', system-ui, sans-serif";

/* ═══════════════════════════════════════════
   ДАННЫЕ: ЗАДАНИЕ 4 — Орфоэпический словник
   stressed = номер ударной гласной
   ═══════════════════════════════════════════ */
const ACCENT_WORDS = [
  // Существительные
  { word: "аэропорты", stressed: 4, hint: "им. п. мн. ч.", cat: "Существительные" },
  { word: "банты", stressed: 1, hint: "им. п. мн. ч.", cat: "Существительные" },
  { word: "бороду", stressed: 1, hint: "вин. п. ед. ч.", cat: "Существительные" },
  { word: "бухгалтеров", stressed: 2, hint: "род. п. мн. ч.", cat: "Существительные" },
  { word: "вероисповедание", stressed: 5, hint: "", cat: "Существительные" },
  { word: "водопровод", stressed: 4, hint: "", cat: "Существительные" },
  { word: "газопровод", stressed: 4, hint: "", cat: "Существительные" },
  { word: "гражданство", stressed: 2, hint: "", cat: "Существительные" },
  { word: "дефис", stressed: 2, hint: "", cat: "Существительные" },
  { word: "дешевизна", stressed: 3, hint: "", cat: "Существительные" },
  { word: "диспансер", stressed: 3, hint: "", cat: "Существительные" },
  { word: "договорённость", stressed: 4, hint: "", cat: "Существительные" },
  { word: "документ", stressed: 3, hint: "", cat: "Существительные" },
  { word: "досуг", stressed: 2, hint: "", cat: "Существительные" },
  { word: "еретик", stressed: 3, hint: "", cat: "Существительные" },
  { word: "жалюзи", stressed: 3, hint: "", cat: "Существительные" },
  { word: "значимость", stressed: 1, hint: "", cat: "Существительные" },
  { word: "иксы", stressed: 1, hint: "им. п. мн. ч.", cat: "Существительные" },
  { word: "каталог", stressed: 3, hint: "", cat: "Существительные" },
  { word: "квартал", stressed: 2, hint: "во всех значениях", cat: "Существительные" },
  { word: "километр", stressed: 3, hint: "", cat: "Существительные" },
  { word: "конусов", stressed: 1, hint: "род. п. мн. ч.", cat: "Существительные" },
  { word: "корысть", stressed: 2, hint: "", cat: "Существительные" },
  { word: "краны", stressed: 1, hint: "им. п. мн. ч.", cat: "Существительные" },
  { word: "кремень", stressed: 2, hint: "", cat: "Существительные" },
  { word: "лекторов", stressed: 1, hint: "род. п. мн. ч.", cat: "Существительные" },
  { word: "лыжня", stressed: 2, hint: "", cat: "Существительные" },
  { word: "местностей", stressed: 1, hint: "род. п. мн. ч.", cat: "Существительные" },
  { word: "намерение", stressed: 2, hint: "", cat: "Существительные" },
  { word: "нарост", stressed: 2, hint: "", cat: "Существительные" },
  { word: "недруг", stressed: 1, hint: "", cat: "Существительные" },
  { word: "недуг", stressed: 2, hint: "", cat: "Существительные" },
  { word: "некролог", stressed: 3, hint: "", cat: "Существительные" },
  { word: "ненависть", stressed: 1, hint: "", cat: "Существительные" },
  { word: "нефтепровод", stressed: 4, hint: "", cat: "Существительные" },
  { word: "новостей", stressed: 3, hint: "род. п. мн. ч.", cat: "Существительные" },
  { word: "отрочество", stressed: 1, hint: "", cat: "Существительные" },
  { word: "партер", stressed: 2, hint: "", cat: "Существительные" },
  { word: "портфель", stressed: 2, hint: "", cat: "Существительные" },
  { word: "поручни", stressed: 1, hint: "", cat: "Существительные" },
  { word: "приданое", stressed: 2, hint: "", cat: "Существительные" },
  { word: "призыв", stressed: 2, hint: "", cat: "Существительные" },
  { word: "свёкла", stressed: 1, hint: "", cat: "Существительные" },
  { word: "сироты", stressed: 2, hint: "им. п. мн. ч.", cat: "Существительные" },
  { word: "созыв", stressed: 2, hint: "", cat: "Существительные" },
  { word: "сосредоточение", stressed: 4, hint: "", cat: "Существительные" },
  { word: "средства", stressed: 1, hint: "им. п. мн. ч.", cat: "Существительные" },
  { word: "статуя", stressed: 1, hint: "", cat: "Существительные" },
  { word: "столяр", stressed: 2, hint: "", cat: "Существительные" },
  { word: "таможня", stressed: 2, hint: "", cat: "Существительные" },
  { word: "торты", stressed: 1, hint: "им. п. мн. ч.", cat: "Существительные" },
  { word: "туфля", stressed: 1, hint: "", cat: "Существительные" },
  { word: "цемент", stressed: 2, hint: "", cat: "Существительные" },
  { word: "центнер", stressed: 1, hint: "", cat: "Существительные" },
  { word: "цепочка", stressed: 2, hint: "", cat: "Существительные" },
  { word: "шарфы", stressed: 1, hint: "им. п. мн. ч.", cat: "Существительные" },
  { word: "шофёр", stressed: 2, hint: "", cat: "Существительные" },
  { word: "эксперт", stressed: 2, hint: "", cat: "Существительные" },
  // Прилагательные
  { word: "значимый", stressed: 1, hint: "прил.", cat: "Прилагательные" },
  { word: "красивее", stressed: 2, hint: "сравн. ст.", cat: "Прилагательные" },
  { word: "кухонный", stressed: 1, hint: "прил.", cat: "Прилагательные" },
  { word: "мозаичный", stressed: 3, hint: "прил.", cat: "Прилагательные" },
  { word: "оптовый", stressed: 2, hint: "прил.", cat: "Прилагательные" },
  { word: "прозорливый", stressed: 3, hint: "прил.", cat: "Прилагательные" },
  { word: "сливовый", stressed: 1, hint: "прил.", cat: "Прилагательные" },
  // Глаголы
  { word: "брала", stressed: 2, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "взяла", stressed: 2, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "гнала", stressed: 2, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "ждала", stressed: 2, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "звала", stressed: 2, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "лгала", stressed: 2, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "лила", stressed: 2, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "сняла", stressed: 2, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "создала", stressed: 3, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "отдала", stressed: 3, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "убрала", stressed: 3, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "рвала", stressed: 2, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "начала", stressed: 3, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "поняла", stressed: 3, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "приняла", stressed: 3, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "звонит", stressed: 2, hint: "3-е л. ед. ч.", cat: "Глаголы" },
  { word: "включит", stressed: 2, hint: "3-е л. ед. ч.", cat: "Глаголы" },
  { word: "вручит", stressed: 2, hint: "3-е л. ед. ч.", cat: "Глаголы" },
  { word: "закупорить", stressed: 2, hint: "", cat: "Глаголы" },
  { word: "клала", stressed: 1, hint: "прош. вр. ж. р.", cat: "Глаголы" },
  { word: "клеить", stressed: 1, hint: "", cat: "Глаголы" },
  { word: "кровоточить", stressed: 4, hint: "", cat: "Глаголы" },
  { word: "облегчить", stressed: 3, hint: "", cat: "Глаголы" },
  { word: "ободрить", stressed: 3, hint: "", cat: "Глаголы" },
  { word: "одолжить", stressed: 3, hint: "", cat: "Глаголы" },
  { word: "озлобить", stressed: 2, hint: "", cat: "Глаголы" },
  { word: "оклеить", stressed: 2, hint: "", cat: "Глаголы" },
  { word: "опошлить", stressed: 2, hint: "", cat: "Глаголы" },
  { word: "откупорить", stressed: 2, hint: "", cat: "Глаголы" },
  { word: "плодоносить", stressed: 4, hint: "", cat: "Глаголы" },
  { word: "пломбировать", stressed: 4, hint: "", cat: "Глаголы" },
  { word: "положить", stressed: 3, hint: "", cat: "Глаголы" },
  { word: "принять", stressed: 2, hint: "", cat: "Глаголы" },
  { word: "сверлить", stressed: 2, hint: "", cat: "Глаголы" },
  { word: "черпать", stressed: 1, hint: "", cat: "Глаголы" },
  { word: "щемить", stressed: 2, hint: "", cat: "Глаголы" },
  { word: "щёлкать", stressed: 1, hint: "", cat: "Глаголы" },
  { word: "дозвониться", stressed: 3, hint: "", cat: "Глаголы" },
  { word: "дозировать", stressed: 2, hint: "", cat: "Глаголы" },
  // Наречия
  { word: "вовремя", stressed: 1, hint: "нар.", cat: "Наречия" },
  { word: "доверху", stressed: 1, hint: "нар.", cat: "Наречия" },
  { word: "донизу", stressed: 1, hint: "нар.", cat: "Наречия" },
  { word: "досуха", stressed: 1, hint: "нар.", cat: "Наречия" },
  { word: "засветло", stressed: 1, hint: "нар.", cat: "Наречия" },
  { word: "затемно", stressed: 1, hint: "нар.", cat: "Наречия" },
  { word: "надолго", stressed: 2, hint: "нар.", cat: "Наречия" },
  { word: "ненадолго", stressed: 3, hint: "нар.", cat: "Наречия" },
  // Деепричастия
  { word: "закупорив", stressed: 2, hint: "дееприч.", cat: "Деепричастия" },
  { word: "начав", stressed: 2, hint: "дееприч.", cat: "Деепричастия" },
  { word: "прибыв", stressed: 2, hint: "дееприч.", cat: "Деепричастия" },
  { word: "создав", stressed: 2, hint: "дееприч.", cat: "Деепричастия" },
  { word: "подняв", stressed: 2, hint: "дееприч.", cat: "Деепричастия" },
  { word: "поняв", stressed: 2, hint: "дееприч.", cat: "Деепричастия" },
  { word: "отдав", stressed: 2, hint: "дееприч.", cat: "Деепричастия" },
  // Причастия
  { word: "довезённый", stressed: 3, hint: "прич.", cat: "Причастия" },
  { word: "занятый", stressed: 1, hint: "прич.", cat: "Причастия" },
  { word: "запертый", stressed: 1, hint: "прич.", cat: "Причастия" },
  { word: "загнутый", stressed: 1, hint: "прич.", cat: "Причастия" },
  { word: "кормящий", stressed: 2, hint: "прич.", cat: "Причастия" },
  { word: "кровоточащий", stressed: 4, hint: "прич.", cat: "Причастия" },
  { word: "наживший", stressed: 2, hint: "прич.", cat: "Причастия" },
  { word: "наливший", stressed: 2, hint: "прич.", cat: "Причастия" },
  { word: "начавший", stressed: 2, hint: "прич.", cat: "Причастия" },
  { word: "начатый", stressed: 1, hint: "прич.", cat: "Причастия" },
  { word: "понявший", stressed: 2, hint: "прич.", cat: "Причастия" },
  { word: "принятый", stressed: 1, hint: "прич.", cat: "Причастия" },
  { word: "согнутый", stressed: 1, hint: "прич.", cat: "Причастия" },
];

/* ═══ ЗАДАНИЕ 1 — Части речи ═══ */
const POS_ITEMS = [
  { q: "Выбери все ЛИЧНЫЕ местоимения", options: ["я", "себя", "мой", "он", "кто", "они", "этот", "вы"], correct: ["я", "он", "они", "вы"] },
  { q: "Выбери все ПРИТЯЖАТЕЛЬНЫЕ местоимения", options: ["мой", "меня", "наш", "всякий", "свой", "тот", "ваш", "некто"], correct: ["мой", "наш", "свой", "ваш"] },
  { q: "Выбери все УКАЗАТЕЛЬНЫЕ местоимения", options: ["этот", "какой", "тот", "такой", "весь", "столько", "никто", "нечто"], correct: ["этот", "тот", "такой", "столько"] },
  { q: "Выбери все ОПРЕДЕЛИТЕЛЬНЫЕ местоимения", options: ["весь", "всякий", "этот", "каждый", "сам", "некоторый", "любой", "ничей"], correct: ["весь", "всякий", "каждый", "сам", "любой"] },
  { q: "Выбери все ОТРИЦАТЕЛЬНЫЕ местоимения", options: ["никто", "некто", "ничто", "кое-кто", "некого", "какой-нибудь", "ничей", "нечто"], correct: ["никто", "ничто", "некого", "ничей"] },
  { q: "Выбери все НЕОПРЕДЕЛЁННЫЕ местоимения", options: ["некто", "никто", "нечто", "кое-кто", "нечего", "какой-нибудь", "несколько", "который"], correct: ["некто", "нечто", "кое-кто", "какой-нибудь", "несколько"] },
  { q: "Выбери все СОЧИНИТЕЛЬНЫЕ союзы", options: ["и", "что", "но", "чтобы", "зато", "потому что", "однако", "или"], correct: ["и", "но", "зато", "однако", "или"] },
  { q: "Выбери все ПОДЧИНИТЕЛЬНЫЕ союзы", options: ["чтобы", "и", "потому что", "зато", "хотя", "либо", "словно", "если"], correct: ["чтобы", "потому что", "хотя", "словно", "если"] },
  { q: "Выбери все ПРОИЗВОДНЫЕ предлоги", options: ["в течение", "без", "благодаря", "до", "несмотря на", "при", "вокруг", "вследствие"], correct: ["в течение", "благодаря", "несмотря на", "вокруг", "вследствие"] },
  { q: "Выбери все ЧАСТИЦЫ", options: ["даже", "но", "ведь", "под", "лишь", "когда", "неужели", "бы"], correct: ["даже", "ведь", "лишь", "неужели", "бы"] },
];

/* ═══ ЗАДАНИЕ 2 — Лексическое значение (верно/неверно) ═══ */
const LEX_ITEMS = [
  { sentence: "О человеке, личность которого ПРИОБРЕЛА символическое значение, принято говорить, что с ним уходит эпоха.", definition: "ПРИОБРЕСТИ. Получить в обладание. Приобрела новую книгу.", correct: false, explain: "Здесь значение «получить, обрести как свойство», а не «купить, получить в обладание»." },
  { sentence: "Учёный ВЫДВИНУЛ смелую гипотезу о происхождении языка.", definition: "ВЫДВИНУТЬ. Предложить для обсуждения. Выдвинуть идею.", correct: true, explain: "Значение определено верно." },
  { sentence: "Фирма подвела итоги за третий КВАРТАЛ.", definition: "КВАРТАЛ. Часть города, ограниченная пересекающимися улицами.", correct: false, explain: "Здесь КВАРТАЛ — четверть года." },
  { sentence: "Из-под земли бил холодный КЛЮЧ.", definition: "КЛЮЧ. Родник, источник.", correct: true, explain: "Значение определено верно." },
  { sentence: "КЛЮЧ к шифру был утерян навсегда.", definition: "КЛЮЧ. Родник, источник.", correct: false, explain: "Здесь КЛЮЧ — средство для разгадки, понимания чего-либо." },
  { sentence: "Он занял твёрдую ПОЗИЦИЮ в этом споре.", definition: "ПОЗИЦИЯ. Точка зрения, мнение, отношение к чему-либо.", correct: true, explain: "Значение определено верно." },
  { sentence: "КОРЕНЬ слова выделен в упражнении неверно.", definition: "КОРЕНЬ. Подземная часть растения.", correct: false, explain: "Здесь КОРЕНЬ — главная значимая часть слова." },
  { sentence: "Бойцы держали оборону на левом ФЛАНГЕ.", definition: "ФЛАНГ. Правая или левая сторона строя, расположения войск.", correct: true, explain: "Значение определено верно." },
  { sentence: "В романе представлена целая ГАЛЕРЕЯ ярких образов.", definition: "ГАЛЕРЕЯ. Узкое крытое помещение, соединяющее части здания.", correct: false, explain: "Здесь ГАЛЕРЕЯ — длинный ряд, вереница (образов, типов)." },
  { sentence: "СРЕДА обитания этих животных — северная тундра.", definition: "СРЕДА. Третий день недели.", correct: false, explain: "Здесь СРЕДА — окружение, природные условия жизни." },
  { sentence: "Театр — его родная СТИХИЯ.", definition: "СТИХИЯ. Привычная, любимая среда, окружение, дело.", correct: true, explain: "Значение определено верно." },
  { sentence: "Между странами установились ДИПЛОМАТИЧЕСКИЕ отношения.", definition: "ДИПЛОМАТИЧЕСКИЙ. Относящийся к внешним сношениям государств.", correct: true, explain: "Значение определено верно." },
];

/* ═══ ЗАДАНИЕ 3 — Анализ текста ═══ */
const TEXT_ITEMS = [
  {
    text: "(1) Чтение художественной литературы развивает воображение: когда мы читаем, мозг сам достраивает образы героев и мест. (2) Учёные отмечают, что регулярное чтение расширяет словарный запас и развивает эмпатию — способность понимать чувства других людей. (3) Именно поэтому книга остаётся незаменимым инструментом воспитания, хотя на смену ей всё чаще приходят экраны.",
    statements: [
      { text: "По мнению учёных, чтение влияет на словарный запас.", correct: true },
      { text: "В тексте утверждается, что чтение портит зрение.", correct: false },
      { text: "Чтение развивает способность сопереживать другим.", correct: true },
      { text: "Текст посвящён истории книгопечатания.", correct: false },
      { text: "Автор считает книгу незаменимым инструментом воспитания.", correct: true },
    ],
  },
  {
    text: "(1) Байкал — самое глубокое озеро планеты: его глубина достигает 1642 метров. (2) В нём содержится около 20 % мировых запасов пресной воды. (3) Уникальность Байкала и в его обитателях: примерно две трети видов растений и животных озера не встречаются больше нигде в мире. (4) Именно поэтому учёные называют Байкал природной лабораторией эволюции.",
    statements: [
      { text: "Байкал — самое глубокое озеро в мире.", correct: true },
      { text: "В Байкале содержится около половины мировых запасов пресной воды.", correct: false },
      { text: "Большинство видов обитателей Байкала — эндемики.", correct: true },
      { text: "В тексте говорится о загрязнении Байкала.", correct: false },
    ],
  },
  {
    text: "(1) Волонтёрство в России становится всё более популярным: миллионы людей ежегодно участвуют в добровольческих проектах. (2) Добровольцы помогают в больницах, ищут пропавших людей, заботятся о природе. (3) Психологи утверждают, что помощь другим повышает и собственное ощущение осмысленности жизни. (4) Таким образом, волонтёрство полезно не только обществу, но и самому добровольцу.",
    statements: [
      { text: "Волонтёрское движение в России растёт.", correct: true },
      { text: "Добровольцы получают высокую зарплату.", correct: false },
      { text: "По мнению психологов, помощь другим полезна самому помогающему.", correct: true },
      { text: "В тексте перечислены направления работы волонтёров.", correct: true },
      { text: "Автор призывает запретить волонтёрство.", correct: false },
    ],
  },
];

/* ═══ ЗАДАНИЕ 5 — Паронимы ═══ */
const PARONYM_ITEMS = [
  { phrase: "НАДЕТЬ очки", correct: true, fix: "" },
  { phrase: "ОДЕТЬ очки", correct: false, fix: "НАДЕТЬ очки" },
  { phrase: "ОДЕТЬ ребёнка", correct: true, fix: "" },
  { phrase: "НАДЕТЬ ребёнка", correct: false, fix: "ОДЕТЬ ребёнка" },
  { phrase: "ГАРАНТИЙНЫЙ талон", correct: true, fix: "" },
  { phrase: "ГАРАНТИРОВАННЫЙ талон", correct: false, fix: "ГАРАНТИЙНЫЙ талон" },
  { phrase: "ЭФФЕКТНАЯ внешность", correct: true, fix: "" },
  { phrase: "ЭФФЕКТИВНАЯ внешность", correct: false, fix: "ЭФФЕКТНАЯ внешность" },
  { phrase: "СЫТНЫЙ обед", correct: true, fix: "" },
  { phrase: "СЫТЫЙ обед", correct: false, fix: "СЫТНЫЙ обед" },
  { phrase: "ПАМЯТНЫЕ монеты", correct: true, fix: "" },
  { phrase: "ПАМЯТЛИВЫЕ монеты", correct: false, fix: "ПАМЯТНЫЕ монеты" },
  { phrase: "ЗРИТЕЛЬНАЯ память", correct: true, fix: "" },
  { phrase: "ЗРИТЕЛЬСКАЯ память", correct: false, fix: "ЗРИТЕЛЬНАЯ память" },
  { phrase: "ДОЖДЛИВАЯ погода", correct: true, fix: "" },
  { phrase: "ДОЖДЕВАЯ погода", correct: false, fix: "ДОЖДЛИВАЯ погода" },
  { phrase: "АБОНЕМЕНТ в музей", correct: true, fix: "" },
  { phrase: "АБОНЕНТ в музей", correct: false, fix: "АБОНЕМЕНТ в музей" },
  { phrase: "ДИПЛОМАНТ конкурса", correct: true, fix: "" },
  { phrase: "ДИПЛОМАТ конкурса", correct: false, fix: "ДИПЛОМАНТ конкурса" },
  { phrase: "КАМЕННЫЙ дом", correct: true, fix: "" },
  { phrase: "КАМЕНИСТЫЙ дом", correct: false, fix: "КАМЕННЫЙ дом" },
  { phrase: "ДОВЕРИТЕЛЬНЫЕ отношения", correct: true, fix: "" },
  { phrase: "ДОВЕРЧИВЫЕ отношения", correct: false, fix: "ДОВЕРИТЕЛЬНЫЕ отношения" },
  { phrase: "ЛЕДЯНОЕ высокомерие", correct: true, fix: "" },
  { phrase: "ЛЕДОВОЕ высокомерие", correct: false, fix: "ЛЕДЯНОЕ высокомерие" },
  { phrase: "ИСКУСНЫЙ стрелок", correct: true, fix: "" },
  { phrase: "ИСКУССТВЕННЫЙ стрелок", correct: false, fix: "ИСКУСНЫЙ стрелок" },
];

/* ═══ ЗАДАНИЕ 6 — Плеоназмы (найди лишнее слово) ═══ */
const PLEONASM_ITEMS = [
  { words: ["биография", "жизни"], remove: 1 },
  { words: ["ведущий", "лидер"], remove: 0 },
  { words: ["взаимный", "диалог"], remove: 0 },
  { words: ["главная", "суть"], remove: 0 },
  { words: ["жестикулировать", "руками"], remove: 1 },
  { words: ["коренной", "абориген"], remove: 0 },
  { words: ["ладони", "рук"], remove: 1 },
  { words: ["мемориальный", "памятник"], remove: 0 },
  { words: ["народный", "фольклор"], remove: 0 },
  { words: ["неожиданный", "сюрприз"], remove: 0 },
  { words: ["памятный", "сувенир"], remove: 0 },
  { words: ["первая", "премьера"], remove: 0 },
  { words: ["прейскурант", "цен"], remove: 1 },
  { words: ["отступать", "назад"], remove: 1 },
  { words: ["подниматься", "вверх"], remove: 1 },
  { words: ["свободная", "вакансия"], remove: 0 },
  { words: ["сентябрь", "месяц"], remove: 1 },
  { words: ["короткий", "миг"], remove: 0 },
  { words: ["холодный", "лёд"], remove: 0 },
  { words: ["проливной", "ливень"], remove: 0 },
];

/* ═══ ЗАДАНИЕ 7 — Морфологические нормы ═══ */
const MORPH_ITEMS = [
  { phrase: ["любимые", "профессоры"], wrong: 1, answer: "профессора" },
  { phrase: ["пара", "туфлей"], wrong: 1, answer: "туфель" },
  { phrase: ["опытные", "шофера"], wrong: 1, answer: "шофёры" },
  { phrase: ["вкусные", "торта"], wrong: 1, answer: "торты" },
  { phrase: ["новые", "договора"], wrong: 1, answer: "договоры" },
  { phrase: ["килограмм", "помидор"], wrong: 1, answer: "помидоров" },
  { phrase: ["пара", "носок"], wrong: 1, answer: "носков" },
  { phrase: ["пара", "чулков"], wrong: 1, answer: "чулок" },
  { phrase: ["много", "яблоков"], wrong: 1, answer: "яблок" },
  { phrase: ["пять", "блюдцев"], wrong: 1, answer: "блюдец" },
  { phrase: ["несколько", "полотенцев"], wrong: 1, answer: "полотенец" },
  { phrase: ["в", "двухста", "метрах"], wrong: 1, answer: "двухстах" },
  { phrase: ["ляжьте", "на", "пол"], wrong: 0, answer: "лягте" },
  { phrase: ["ехайте", "быстрее"], wrong: 0, answer: "поезжайте" },
  { phrase: ["ихние", "книги"], wrong: 0, answer: "их" },
  { phrase: ["у", "обоих", "сестёр"], wrong: 1, answer: "обеих" },
  { phrase: ["с", "пятидесятью", "рублями"], wrong: 1, answer: "пятьюдесятью" },
  { phrase: ["более", "красивейший", "вид"], wrong: 1, answer: "красивый" },
];

const GRAMMAR_SETS = [
  {
    errors: [
      {letter:"А", text:"нарушение связи между подлежащим и сказуемым"},
      {letter:"Б", text:"неправильное построение предложения с причастным оборотом"},
      {letter:"В", text:"неправильное построение предложения с деепричастным оборотом"},
      {letter:"Г", text:"нарушение в построении предложения с однородными членами"},
      {letter:"Д", text:"неправильное построение предложения с косвенной речью"},
    ],
    sentences: [
      {num:1, text:"Открыв окно, в комнату ворвался свежий ветер."},
      {num:2, text:"Те, кто опаздывает на занятия, рискует получить выговор."},
      {num:3, text:"Студенты гордятся своим университетом и интересуются научными конференциями."},
      {num:4, text:"Прочитанная книга мной за лето произвела сильное впечатление."},
      {num:5, text:"Друзья посоветовали мне посетить выставку и что обязательно стоит сходить в музей."},
      {num:6, text:"Преподаватель сказал, что я проверю работы к понедельнику."},
      {num:7, text:"Вечером мы гуляли по парку, наслаждаясь свежим воздухом."},
    ],
    answer: {"А":2,"Б":4,"В":1,"Г":5,"Д":6},
  },
  {
    errors: [
      {letter:"А", text:"неправильное построение предложения с несогласованным приложением"},
      {letter:"Б", text:"нарушение видовременной соотнесённости глагольных форм"},
      {letter:"В", text:"неправильный выбор падежной формы существительного с предлогом"},
      {letter:"Г", text:"нарушение связи между подлежащим и сказуемым"},
      {letter:"Д", text:"неправильное построение предложения с причастным оборотом"},
    ],
    sentences: [
      {num:1, text:"В повести «Капитанской дочке» Пушкин описывает события Пугачёвского восстания."},
      {num:2, text:"Когда герой принимает трудное решение, он простился с прошлой жизнью навсегда."},
      {num:3, text:"Согласно расписания, занятия начинаются в девять утра."},
      {num:4, text:"Большинство выпускников успешно сдали итоговые экзамены и поступили в вузы."},
      {num:5, text:"Картина, висевшая на стене кабинета директора школы, привлекала внимание всех посетителей."},
      {num:6, text:"Никто из присутствующих не высказали своего мнения по этому вопросу."},
      {num:7, text:"Изученная тема на уроке учениками вызвала у них множество вопросов."},
    ],
    answer: {"А":1,"Б":2,"В":3,"Г":6,"Д":7},
  },
  {
    errors: [
      {letter:"А", text:"неправильное построение предложения с деепричастным оборотом"},
      {letter:"Б", text:"нарушение в построении предложения с однородными членами"},
      {letter:"В", text:"неправильное построение предложения с косвенной речью"},
      {letter:"Г", text:"неправильное построение предложения с несогласованным приложением"},
      {letter:"Д", text:"нарушение в построении сложного предложения"},
    ],
    sentences: [
      {num:1, text:"Закончив выступление, зрители долго не отпускали артиста со сцены."},
      {num:2, text:"В сочинении он размышляет о дружбе и зачем она нужна человеку."},
      {num:3, text:"Друг признался, что я готов помочь в любой ситуации."},
      {num:4, text:"В журнале «Вокруг света» опубликована статья об экспедиции."},
      {num:5, text:"О повести «Шинели» до сих пор спорят литературоведы."},
      {num:6, text:"Книга, которую я прочитал летом и которая произвела на меня сильное впечатление, рассказывает о войне."},
      {num:7, text:"Автор пишет о том, что природа прекрасна и которую нужно беречь."},
    ],
    answer: {"А":1,"Б":2,"В":3,"Г":5,"Д":7},
  },
  {
    errors: [
      {letter:"А", text:"нарушение связи между подлежащим и сказуемым"},
      {letter:"Б", text:"неправильное построение предложения с причастным оборотом"},
      {letter:"В", text:"неправильный выбор падежной формы существительного с предлогом"},
      {letter:"Г", text:"нарушение видовременной соотнесённости глагольных форм"},
      {letter:"Д", text:"нарушение в построении предложения с однородными членами"},
    ],
    sentences: [
      {num:1, text:"Заведующий кафедрой выступил с докладом о результатах исследования."},
      {num:2, text:"Прибывшая делегация на переговоры была встречена представителями министерства."},
      {num:3, text:"Ряд сотрудников отдела высказали своё недовольство новым графиком."},
      {num:4, text:"Вопреки прогноза синоптиков, погода в выходные оказалась солнечной."},
      {num:5, text:"Когда учёные публикуют результаты исследования, они получили широкий отклик в научном сообществе."},
      {num:6, text:"Друзья обсуждали фильм и почему он получил столько наград."},
      {num:7, text:"Согласно договору между сторонами все обязательства должны быть исполнены в срок."},
    ],
    answer: {"А":3,"Б":2,"В":4,"Г":5,"Д":6},
  },
  {
    errors: [
      {letter:"А", text:"неправильное построение предложения с деепричастным оборотом"},
      {letter:"Б", text:"неправильное построение предложения с косвенной речью"},
      {letter:"В", text:"неправильное построение предложения с несогласованным приложением"},
      {letter:"Г", text:"нарушение в построении сложного предложения"},
      {letter:"Д", text:"неправильное построение предложения с причастным оборотом"},
    ],
    sentences: [
      {num:1, text:"Возвращаясь домой поздно вечером, на улице зажглись фонари."},
      {num:2, text:"Журналист спросил, что когда выйдет следующий номер газеты."},
      {num:3, text:"В рассказе «Хамелеоне» Чехов высмеивает приспособленчество."},
      {num:4, text:"Эта история научила героя тому, что нужно быть смелым, и которая запомнилась ему навсегда."},
      {num:5, text:"Выставленные картины в галерее художника привлекли множество посетителей."},
      {num:6, text:"Слушая лекцию, студенты делали пометки в тетрадях."},
      {num:7, text:"О повести «Капитанская дочка» написано множество критических статей."},
    ],
    answer: {"А":1,"Б":2,"В":3,"Г":4,"Д":5},
  },
  {
    errors: [
      {letter:"А", text:"неправильное построение предложения с деепричастным оборотом"},
      {letter:"Б", text:"нарушение связи между подлежащим и сказуемым"},
      {letter:"В", text:"нарушение в построении предложения с однородными членами"},
      {letter:"Г", text:"нарушение видовременной соотнесённости глагольных форм"},
      {letter:"Д", text:"неправильный выбор падежной формы существительного с предлогом"},
    ],
    sentences: [
      {num:1, text:"Подойдя к зеркалу, на меня смотрело незнакомое лицо."},
      {num:2, text:"Никто из учеников класса не выполнили домашнее задание полностью."},
      {num:3, text:"Преподаватель рассказывал о теории относительности и как она изменила физику."},
      {num:4, text:"Вернувшись с каникул, ученики делились впечатлениями о поездках."},
      {num:5, text:"Когда автор пишет повесть, он закончил её всего за месяц."},
      {num:6, text:"Благодаря внимания учителя, ученик быстро разобрался в теме."},
      {num:7, text:"Зрители, посмотревшие премьеру фильма, обсуждали сюжет в социальных сетях."},
    ],
    answer: {"А":1,"Б":2,"В":3,"Г":5,"Д":6},
  },
];

/* ═══ УТИЛИТЫ ═══ */
const VOWELS = "аеёиоуыэюя";
function getVowelIndices(word) {
  const idx = [];
  for (let i = 0; i < word.length; i++) if (VOWELS.includes(word[i].toLowerCase())) idx.push(i);
  return idx;
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function normalize(s) {
  return s.trim().toLowerCase().replace(/ё/g, "е");
}
function accentedWord(entry) {
  const vi = getVowelIndices(entry.word);
  const target = vi[entry.stressed - 1];
  return entry.word.split("").map((ch, i) => (i === target ? ch.toUpperCase() : ch)).join("");
}

const CORRECT_REACTIONS = ["Отлично! 🌸", "Верно! ✨", "Молодец! 🌟", "Так держать! 💫", "Точно! ☕", "Супер! 🌷", "Умничка! 💐", "Класс! 🦋", "Правильно! 🍀", "Браво! 🌙"];
const WRONG_REACTIONS = ["Почти! Запомни правильный вариант 💛", "Ничего, в следующий раз! 🤍", "Бывает! Главное — запомнить 🌿", "Не страшно, учимся! 🍃", "Ошибки — часть пути 🌊", "Запоминай и двигайся дальше 🕊️"];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ═══ ХРАНИЛИЩЕ ОШИБОК (задание 4) ═══ */
async function loadAccentScores() {
  try {
    const r = await window.storage.get("rusnekus-accent-scores");
    return r ? JSON.parse(r.value) : {};
  } catch {
    return {};
  }
}
async function saveAccentScores(scores) {
  try {
    await window.storage.set("rusnekus-accent-scores", JSON.stringify(scores));
  } catch (e) { /* офлайн-режим — не страшно */ }
}

/* ═══════════════════════════════════════════
   ОБЩИЕ КОМПОНЕНТЫ
   ═══════════════════════════════════════════ */
function AnimatedBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const blobs = Array.from({ length: 6 }, (_, i) => ({
      x: window.innerWidth * (0.1 + 0.15 * i),
      y: window.innerHeight * (0.2 + 0.1 * i),
      r: 280 + i * 40,
      vx: (i % 2 === 0 ? 1 : -1) * (0.3 + i * 0.08),
      vy: (i % 3 === 0 ? 1 : -1) * (0.2 + i * 0.06),
      hue: [260, 280, 300, 320, 240, 200][i],
    }));

    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.01 + 0.005,
    }));

    let frame = 0;
    let raf;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // шары
      blobs.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `hsla(${b.hue},85%,70%,0.22)`);
        g.addColorStop(0.5, `hsla(${b.hue},75%,60%,0.08)`);
        g.addColorStop(1, `hsla(${b.hue},70%,60%,0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // звёзды
      stars.forEach(s => {
        const op = 0.35 + 0.5 * Math.sin(frame * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,190,255,${op})`;
        ctx.fill();
      });

      // сетка
      ctx.strokeStyle = "rgba(167,139,250,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      frame++;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function Shell({ children }) {
  const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; }
    body { background: #0d0f14; }
    button, input { font-family: 'Inter', system-ui, sans-serif; }
    @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pop     { 0%{transform:scale(0.88)} 60%{transform:scale(1.07)} 100%{transform:scale(1)} }
    @keyframes shake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 50%{transform:translateX(5px)} 80%{transform:translateX(-3px)} }
    @keyframes slide   { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.55} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 18px rgba(167,139,250,0.15)} 50%{box-shadow:0 0 32px rgba(167,139,250,0.45)} }
    .rnk-task-btn { transition: all 0.18s cubic-bezier(.4,0,.2,1); }
    .rnk-task-btn:hover { background: rgba(167,139,250,0.09) !important; border-color: rgba(167,139,250,0.38) !important; transform: translateY(-1px); }
    .rnk-task-btn:active { transform: scale(0.97); }
    .rnk-choice:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-2px); }
    .rnk-choice:active:not(:disabled) { transform: scale(0.95); }
    .rnk-vowel:hover { transform: translateY(-3px) scale(1.1); box-shadow: 0 6px 20px rgba(167,139,250,0.4) !important; }
    .rnk-vowel:active { transform: scale(0.93); }
    .rnk-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.08); }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.22); border-radius: 3px; }
  `;
  return (
    <div style={{ minHeight: "100vh", background: C.bgGrad, fontFamily: fontBody, color: C.espresso, position: "relative" }}>
      <style>{globalCSS}</style>
      <AnimatedBg />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
function TopBar({ onBack, label, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.latte, fontSize: 14, cursor: "pointer", padding: "4px 0" }}>
        ← Назад
      </button>
      <span style={{ fontSize: 13, color: C.mocha, fontWeight: 600, letterSpacing: "0.3px" }}>{label}</span>
      <span style={{ fontSize: 13, color: C.latte, minWidth: 50, textAlign: "right" }}>{right || ""}</span>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div style={{ height: 4, background: "rgba(160,112,79,0.12)", margin: "0 20px", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: `linear-gradient(90deg, ${C.caramel}, ${C.accent2})`, borderRadius: 3, transition: "width 0.5s ease", boxShadow: `0 0 10px ${C.accentGlow}` }} />
    </div>
  );
}

function StatsRow({ correct, wrong }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: "14px 20px 0" }}>
      <span style={{ fontSize: 13, color: C.correct, fontWeight: 600 }}>✓ {correct}</span>
      <span style={{ fontSize: 13, color: C.wrong, fontWeight: 600 }}>✗ {wrong}</span>
    </div>
  );
}

function Reaction({ show, isCorrect, text }) {
  return (
    <div style={{ minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center", padding: "4px 16px", textAlign: "center" }}>
      {show && (
        <div style={{ fontSize: 15, fontWeight: 500, color: isCorrect ? C.correct : C.accent2, animation: "fadeIn 0.3s ease" }}>
          {text}
        </div>
      )}
    </div>
  );
}

function ResultScreen({ correct, wrong, hasRetry, onRetry, onRestart, onBack }) {
  const total = correct + wrong;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  return (
    <div style={{ minHeight: "100vh", background: C.bgGrad, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: fontBody }}>
      <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: `1px solid ${C.cardBorder}`, borderRadius: 24, padding: "44px 36px", maxWidth: 360, width: "100%", textAlign: "center", boxShadow: "0 30px 80px rgba(0,0,0,0.5)", animation: "pop 0.45s cubic-bezier(.4,0,.2,1)" }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>{pct >= 80 ? "🌟" : pct >= 50 ? "☕" : "📚"}</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", background: `linear-gradient(135deg,${C.caramel},${C.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Раунд завершён!</h2>
        <p style={{ color: C.latte, fontSize: 14, margin: "0 0 24px" }}>
          {pct >= 80 ? "Отличный результат!" : pct >= 50 ? "Хорошее начало, продолжай!" : "Практика — ключ к успеху!"}
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 26 }}>
          <div style={{ background: C.correctBg, border: `1px solid ${C.correct}40`, borderRadius: 12, padding: "12px 22px" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.correct }}>{correct}</div>
            <div style={{ fontSize: 12, color: C.latte }}>верно</div>
          </div>
          <div style={{ background: C.wrongBg, border: `1px solid ${C.wrong}40`, borderRadius: 12, padding: "12px 22px" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.wrong }}>{wrong}</div>
            <div style={{ fontSize: 12, color: C.latte }}>ошибок</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {hasRetry && (
            <button onClick={onRetry} style={{ padding: "13px 20px", background: `linear-gradient(135deg, ${C.caramel}, ${C.accent2})`, border: "none", borderRadius: 12, color: "#0d0f14", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 20px ${C.accentGlow}` }}>
              Повторить ошибки
            </button>
          )}
          <button onClick={onRestart} style={{ padding: "13px 20px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.cardBorder}`, borderRadius: 12, color: C.espresso, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
            Новый раунд
          </button>
          <button onClick={onBack} style={{ padding: "10px 20px", background: "none", border: "none", color: C.latte, fontSize: 13, cursor: "pointer" }}>
            ← На главную
          </button>
        </div>
      </div>
    </div>
  );
}

/* Хук «двигатель раунда» — общая логика для всех заданий */
function useRound(allItems, batchSize) {
  const [items, setItems] = useState(() => shuffle(allItems).slice(0, batchSize));
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [wrongItems, setWrongItems] = useState([]);
  const [finished, setFinished] = useState(false);

  const record = (isCorrect, item) => {
    setStats((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), wrong: s.wrong + (isCorrect ? 0 : 1) }));
    if (!isCorrect) setWrongItems((w) => [...w, item]);
  };
  const next = () => {
    if (index + 1 < items.length) setIndex((i) => i + 1);
    else setFinished(true);
  };
  const restart = () => {
    setItems(shuffle(allItems).slice(0, batchSize));
    setIndex(0); setStats({ correct: 0, wrong: 0 }); setWrongItems([]); setFinished(false);
  };
  const retryWrong = () => {
    setItems(shuffle(wrongItems));
    setIndex(0); setStats({ correct: 0, wrong: 0 }); setWrongItems([]); setFinished(false);
  };
  return { items, index, stats, wrongItems, finished, record, next, restart, retryWrong };
}

/* Карточка-обёртка для содержимого задания */
function TaskCard({ children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.045)", backdropFilter: "blur(20px)", border: `1px solid ${C.cardBorder}`, borderRadius: 20, padding: "28px 24px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", width: "100%", maxWidth: 500, animation: "fadeUp 0.4s ease" }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ГЛАВНАЯ СТРАНИЦА
   ═══════════════════════════════════════════ */
function HomePage({ onNavigate }) {
  const tasks = [
    { id: 1, page: "task1", title: "Части речи", desc: "Выбери слова нужной части речи" },
    { id: 2, page: "task2", title: "Лексическое значение", desc: "Верна ли характеристика слова?" },
    { id: 3, page: "task3", title: "Анализ текста", desc: "Выбери верные утверждения" },
    { id: 4, page: "task4", title: "Ударения", desc: "Нажми на ударную гласную", theory: true },
    { id: 5, page: "task5", title: "Паронимы", desc: "Правильное ли словосочетание?" },
    { id: 6, page: "task6", title: "Лексические нормы", desc: "Найди лишнее слово" },
    { id: 7, page: "task7", title: "Морфологические нормы", desc: "Найди ошибку и исправь её" },
  ];

  return (
    <Shell>
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)",top:-200,left:"50%",transform:"translateX(-50%)"}}/>
        <div style={{position:"absolute",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(240,171,252,0.05) 0%,transparent 70%)",bottom:80,right:-40}}/>
      </div>
      <div style={{position:"relative",zIndex:1}}>
      <header style={{ padding: "60px 24px 32px", textAlign: "center", animation: "fadeUp 0.6s ease" }}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:50,padding:"6px 18px",marginBottom:20}}>
            <span style={{fontSize:14}}>✦</span>
            <span style={{fontSize:13,color:C.caramel,fontWeight:600,letterSpacing:"0.5px"}}>ЕГЭ · Русский язык · 2027</span>
          </div>
        <h1 style={{ fontSize: 46, fontWeight: 800, margin: 0, letterSpacing: "-1.5px", lineHeight: 1.1, background: `linear-gradient(135deg,#e8d5ff 0%,${C.caramel} 40%,${C.accent2} 70%,#fda4af 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          <span style={{background:"linear-gradient(135deg,#c4b5fd,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Рус</span><span style={{background:"linear-gradient(135deg,#f0abfc,#fda4af)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>НеКусь</span>
        </h1>
        <p style={{ color: C.mocha, fontSize: 15, margin: "10px 0 0" }}>Тренажёр по русскому языку для ЕГЭ</p>
        <p style={{ color: C.latte, fontSize: 13, margin: "6px 0 0" }}>Без паники и осуждения — только практика и поддержка</p>
      </header>

      <div style={{ maxWidth: 460, margin: "0 auto", padding: "10px 20px 60px" }}>
        <p style={{ color: C.latte, fontSize: 12, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600, marginBottom: 14, paddingLeft: 4 }}>
          Задания
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tasks.map((t) => (
            <div key={t.id} style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => onNavigate(t.page)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                  background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16,
                  cursor: "pointer", textAlign: "left", transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
                }}
                className="rnk-task-btn"
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${C.caramel}33, ${C.accent2}55)`, border: `1px solid ${C.caramel}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: C.caramel, flexShrink: 0 }}>
                  {t.id}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.espresso, marginBottom: 2 }}>{t.title}</div>
                  <div style={{ fontSize: 13, color: C.latte }}>{t.desc}</div>
                </div>
                <div style={{ color: C.caramel, fontSize: 18 }}>→</div>
              </button>
              {t.theory && (
                <button
                  onClick={() => onNavigate("theory4")}
                  title="Теория: словник с ударениями"
                  style={{
                    width: 52, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16,
                    cursor: "pointer", fontSize: 20, transition: "all 0.18s",
                  }}
                  className="rnk-task-btn"
                >
                  📖
                </button>
              )}
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", color: C.latte, fontSize: 12, marginTop: 28 }}>
          📖 — теория к заданию · слова с твоими ошибками подсвечиваются
        </p>
      </div>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   ЗАДАНИЕ 4 — Ударения
   ═══════════════════════════════════════════ */
function Task4({ onBack, onTheory }) {
  const round = useRound(ACCENT_WORDS, 15);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [reaction, setReaction] = useState("");
  const scoresRef = useRef({});
  const timerRef = useRef(null);

  useEffect(() => {
    loadAccentScores().then((s) => { scoresRef.current = s; });
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const current = round.items[round.index];
  if (round.finished) {
    return <ResultScreen correct={round.stats.correct} wrong={round.stats.wrong} hasRetry={round.wrongItems.length > 0} onRetry={round.retryWrong} onRestart={round.restart} onBack={onBack} />;
  }
  if (!current) return null;

  const vowelIdx = getVowelIndices(current.word);
  const correctChar = vowelIdx[current.stressed - 1];

  const handleClick = (i) => {
    if (showResult || !vowelIdx.includes(i)) return;
    const num = vowelIdx.indexOf(i) + 1;
    const ok = num === current.stressed;
    setSelected(i);
    setIsCorrect(ok);
    setShowResult(true);
    setReaction(pick(ok ? CORRECT_REACTIONS : WRONG_REACTIONS));
    round.record(ok, current);

    // обновляем счёт ошибок для теории
    const s = scoresRef.current;
    const prev = s[current.word] || 0;
    s[current.word] = ok ? Math.max(0, prev - 1) : prev + 1;
    saveAccentScores(s);

    timerRef.current = setTimeout(() => {
      setSelected(null); setShowResult(false); round.next();
    }, 1500);
  };

  return (
    <Shell>
      <TopBar onBack={onBack} label="Задание 4 · Ударения" right={`${round.index + 1}/${round.items.length}`} />
      <ProgressBar value={(round.index / round.items.length) * 100} />
      <StatsRow correct={round.stats.correct} wrong={round.stats.wrong} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 24px 60px" }}>
        <p style={{ color: C.latte, fontSize: 14, marginBottom: 10 }}>Нажми на ударную гласную</p>
        {current.hint && (
          <p style={{ color: C.mocha, fontSize: 12, marginBottom: 18, background: C.cream, padding: "4px 12px", borderRadius: 6 }}>{current.hint}</p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, marginBottom: 18, userSelect: "none" }}>
          {current.word.split("").map((ch, i) => {
            const isVowel = vowelIdx.includes(i);
            const isSel = selected === i;
            const isRight = showResult && i === correctChar;
            const isWrongSel = showResult && isSel && !isCorrect;
            let bg = "transparent", color = C.espresso, border = "2px solid transparent", scale = 1;
            if (isVowel && !showResult) { border = `2px solid ${C.caramelBorder}`; bg = C.caramelSoft; }
            if (isRight) { bg = C.correctBg; border = `2px solid ${C.correct}`; color = C.correct; scale = 1.12; }
            if (isWrongSel) { bg = C.wrongBg; border = `2px solid ${C.wrong}`; color = C.wrong; }
            return (
              <div key={i} onClick={() => handleClick(i)}
                style={{
                  width: 42, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, fontWeight: 600, fontFamily: fontDisplay, color, background: bg, border, borderRadius: 10,
                  cursor: isVowel && !showResult ? "pointer" : "default",
                  transition: "all 0.2s", transform: `scale(${scale})`,
                  textTransform: isRight ? "uppercase" : "none",
                }}
                onMouseEnter={(e) => { if (isVowel && !showResult) { e.currentTarget.style.background = "rgba(160,112,79,0.18)"; } }}
                onMouseLeave={(e) => { if (isVowel && !showResult) { e.currentTarget.style.background = C.caramelSoft; } }}
              >
                {ch}
              </div>
            );
          })}
        </div>
        <Reaction show={showResult} isCorrect={isCorrect} text={reaction} />
        <button onClick={onTheory} style={{ marginTop: 24, background: "none", border: `1px dashed ${C.caramelBorder}`, color: C.mocha, borderRadius: 10, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
          📖 Открыть теорию (словник)
        </button>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   ТЕОРИЯ к заданию 4 — словник + подсветка ошибок
   ═══════════════════════════════════════════ */
function Theory4({ onBack }) {
  const [scores, setScores] = useState(null);

  useEffect(() => {
    loadAccentScores().then(setScores);
  }, []);

  const cats = ["Существительные", "Прилагательные", "Глаголы", "Наречия", "Деепричастия", "Причастия"];

  const resetScores = async () => {
    await saveAccentScores({});
    setScores({});
  };

  return (
    <Shell>
      <TopBar onBack={onBack} label="Теория · Орфоэпический словник" />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "16px 20px 60px" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: "14px 18px", marginBottom: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, color: C.mocha, lineHeight: 1.5 }}>
            Ударная гласная выделена <b style={{ color: C.caramel }}>ЗАГЛАВНОЙ</b>.{" "}
            <span style={{ background: C.wrongBg, border: `1px solid ${C.wrong}50`, borderRadius: 5, padding: "1px 7px", color: C.wrong, fontWeight: 600 }}>Так</span>{" "}
            подсвечены слова, в которых ты ошибалась 2+ раза. Перестанешь ошибаться — подсветка уйдёт.
          </div>
          <button onClick={resetScores} style={{ fontSize: 12, color: C.latte, background: "none", border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>
            Сбросить отметки
          </button>
        </div>

        {scores === null ? (
          <p style={{ color: C.latte, textAlign: "center" }}>Загружаю твою статистику…</p>
        ) : (
          cats.map((cat) => {
            const words = ACCENT_WORDS.filter((w) => w.cat === cat);
            if (!words.length) return null;
            return (
              <div key={cat} style={{ marginBottom: 26 }}>
                <h3 style={{ fontFamily: fontDisplay, color: C.espresso, fontSize: 18, fontWeight: 700, margin: "0 0 12px", borderBottom: `2px solid ${C.caramelSoft}`, paddingBottom: 6 }}>
                  {cat}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {words.map((w) => {
                    const troubled = (scores[w.word] || 0) >= 2;
                    return (
                      <span key={w.word}
                        title={w.hint || ""}
                        style={{
                          fontSize: 15, padding: "6px 12px", borderRadius: 9,
                          background: troubled ? C.wrongBg : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${troubled ? C.wrong + "60" : C.cardBorder}`,
                          color: troubled ? C.wrong : C.espresso,
                          fontWeight: troubled ? 700 : 500,
                          fontFamily: fontDisplay,
                        }}>
                        {accentedWord(w)}
                        {w.hint ? <span style={{ fontSize: 11, color: troubled ? C.wrong : C.latte, marginLeft: 6, fontFamily: fontBody }}>{w.hint}</span> : null}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   ЗАДАНИЕ 1 — Части речи (мульти-выбор)
   ═══════════════════════════════════════════ */
function Task1({ onBack }) {
  const round = useRound(POS_ITEMS, 8);
  const [picked, setPicked] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [reaction, setReaction] = useState("");
  const timerRef = useRef(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const current = round.items[round.index];
  if (round.finished) return <ResultScreen correct={round.stats.correct} wrong={round.stats.wrong} hasRetry={round.wrongItems.length > 0} onRetry={round.retryWrong} onRestart={round.restart} onBack={onBack} />;
  if (!current) return null;

  const toggle = (w) => {
    if (showResult) return;
    setPicked((p) => (p.includes(w) ? p.filter((x) => x !== w) : [...p, w]));
  };

  const check = () => {
    const ok = picked.length === current.correct.length && picked.every((w) => current.correct.includes(w));
    setIsCorrect(ok);
    setShowResult(true);
    setReaction(pick(ok ? CORRECT_REACTIONS : WRONG_REACTIONS));
    round.record(ok, current);
    timerRef.current = setTimeout(() => {
      setPicked([]); setShowResult(false); round.next();
    }, 2200);
  };

  return (
    <Shell>
      <TopBar onBack={onBack} label="Задание 1 · Части речи" right={`${round.index + 1}/${round.items.length}`} />
      <ProgressBar value={(round.index / round.items.length) * 100} />
      <StatsRow correct={round.stats.correct} wrong={round.stats.wrong} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 60px" }}>
        <TaskCard>
          <p style={{ fontSize: 16, fontWeight: 600, color: C.espresso, margin: "0 0 18px", textAlign: "center" }}>{current.q}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {current.options.map((w) => {
              const sel = picked.includes(w);
              const shouldBe = current.correct.includes(w);
              let bg = sel ? C.caramelSoft : C.card;
              let border = sel ? C.caramel : C.cardBorder;
              let color = C.espresso;
              if (showResult) {
                if (shouldBe) { bg = C.correctBg; border = C.correct; color = C.correct; }
                else if (sel) { bg = C.wrongBg; border = C.wrong; color = C.wrong; }
              }
              return (
                <button key={w} onClick={() => toggle(w)}
                  style={{ padding: "9px 16px", borderRadius: 10, border: `2px solid ${border}`, background: bg, color, fontSize: 15, fontWeight: sel || (showResult && shouldBe) ? 600 : 400, cursor: showResult ? "default" : "pointer", transition: "all 0.15s" }}>
                  {w}
                </button>
              );
            })}
          </div>
          {!showResult && (
            <button onClick={check} disabled={picked.length === 0}
              style={{ marginTop: 20, width: "100%", padding: "13px", borderRadius: 11, border: "none", background: picked.length ? `linear-gradient(135deg, ${C.caramel}, ${C.accent2})` : "rgba(255,255,255,0.04)", color: picked.length ? "#0d0f14" : C.latte, fontSize: 15, fontWeight: 700, cursor: picked.length ? "pointer" : "default", boxShadow: picked.length ? `0 4px 20px ${C.accentGlow}` : "none" }}>
              Проверить
            </button>
          )}
        </TaskCard>
        <Reaction show={showResult} isCorrect={isCorrect} text={reaction} />
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   ЗАДАНИЕ 2 — Лексическое значение (верно/неверно)
   ═══════════════════════════════════════════ */
function Task2({ onBack }) {
  const round = useRound(LEX_ITEMS, 8);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [reaction, setReaction] = useState("");
  const timerRef = useRef(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const current = round.items[round.index];
  if (round.finished) return <ResultScreen correct={round.stats.correct} wrong={round.stats.wrong} hasRetry={round.wrongItems.length > 0} onRetry={round.retryWrong} onRestart={round.restart} onBack={onBack} />;
  if (!current) return null;

  const answer = (val) => {
    if (showResult) return;
    const ok = val === current.correct;
    setIsCorrect(ok);
    setShowResult(true);
    setReaction(ok ? pick(CORRECT_REACTIONS) : current.explain);
    round.record(ok, current);
    timerRef.current = setTimeout(() => { setShowResult(false); round.next(); }, ok ? 1400 : 3200);
  };

  return (
    <Shell>
      <TopBar onBack={onBack} label="Задание 2 · Значение слова" right={`${round.index + 1}/${round.items.length}`} />
      <ProgressBar value={(round.index / round.items.length) * 100} />
      <StatsRow correct={round.stats.correct} wrong={round.stats.wrong} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 60px" }}>
        <TaskCard>
          <p style={{ fontSize: 12, color: C.latte, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Предложение</p>
          <p style={{ fontSize: 15, color: C.espresso, lineHeight: 1.6, margin: "0 0 18px", fontFamily: fontDisplay }}>{current.sentence}</p>
          <p style={{ fontSize: 12, color: C.latte, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Характеристика</p>
          <p style={{ fontSize: 15, color: C.mocha, lineHeight: 1.6, margin: "0 0 22px", background: C.cream, padding: "12px 14px", borderRadius: 10 }}>{current.definition}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => answer(true)} disabled={showResult}
              style={{ flex: 1, padding: "13px", borderRadius: 11, border: `2px solid ${C.correct}`, background: showResult && current.correct ? C.correctBg : C.card, color: C.correct, fontSize: 15, fontWeight: 600, cursor: showResult ? "default" : "pointer" }}>
              Верно
            </button>
            <button onClick={() => answer(false)} disabled={showResult}
              style={{ flex: 1, padding: "13px", borderRadius: 11, border: `2px solid ${C.wrong}`, background: showResult && !current.correct ? C.wrongBg : C.card, color: C.wrong, fontSize: 15, fontWeight: 600, cursor: showResult ? "default" : "pointer" }}>
              Неверно
            </button>
          </div>
        </TaskCard>
        <Reaction show={showResult} isCorrect={isCorrect} text={reaction} />
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   ЗАДАНИЕ 3 — Анализ текста (мульти-выбор утверждений)
   ═══════════════════════════════════════════ */
function Task3({ onBack }) {
  const round = useRound(TEXT_ITEMS, 3);
  const [picked, setPicked] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [reaction, setReaction] = useState("");
  const timerRef = useRef(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const current = round.items[round.index];
  if (round.finished) return <ResultScreen correct={round.stats.correct} wrong={round.stats.wrong} hasRetry={round.wrongItems.length > 0} onRetry={round.retryWrong} onRestart={round.restart} onBack={onBack} />;
  if (!current) return null;

  const toggle = (i) => {
    if (showResult) return;
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  };
  const check = () => {
    const correctIdx = current.statements.map((s, i) => (s.correct ? i : -1)).filter((i) => i >= 0);
    const ok = picked.length === correctIdx.length && picked.every((i) => correctIdx.includes(i));
    setIsCorrect(ok);
    setShowResult(true);
    setReaction(pick(ok ? CORRECT_REACTIONS : WRONG_REACTIONS));
    round.record(ok, current);
    timerRef.current = setTimeout(() => { setPicked([]); setShowResult(false); round.next(); }, 2600);
  };

  return (
    <Shell>
      <TopBar onBack={onBack} label="Задание 3 · Анализ текста" right={`${round.index + 1}/${round.items.length}`} />
      <ProgressBar value={(round.index / round.items.length) * 100} />
      <StatsRow correct={round.stats.correct} wrong={round.stats.wrong} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 60px" }}>
        <TaskCard>
          <p style={{ fontSize: 14.5, color: C.espresso, lineHeight: 1.7, margin: "0 0 20px", fontFamily: fontDisplay, background: C.cream, padding: "14px 16px", borderRadius: 10 }}>
            {current.text}
          </p>
          <p style={{ fontSize: 13, color: C.latte, margin: "0 0 12px" }}>Выбери все верные утверждения:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {current.statements.map((s, i) => {
              const sel = picked.includes(i);
              let bg = sel ? C.caramelSoft : C.card;
              let border = sel ? C.caramel : C.cardBorder;
              let color = C.espresso;
              if (showResult) {
                if (s.correct) { bg = C.correctBg; border = C.correct; }
                else if (sel) { bg = C.wrongBg; border = C.wrong; color = C.wrong; }
              }
              return (
                <button key={i} onClick={() => toggle(i)}
                  style={{ textAlign: "left", padding: "11px 14px", borderRadius: 10, border: `2px solid ${border}`, background: bg, color, fontSize: 14, lineHeight: 1.5, cursor: showResult ? "default" : "pointer", transition: "all 0.15s" }}>
                  {s.text}
                </button>
              );
            })}
          </div>
          {!showResult && (
            <button onClick={check} disabled={picked.length === 0}
              style={{ marginTop: 18, width: "100%", padding: "13px", borderRadius: 11, border: "none", background: picked.length ? `linear-gradient(135deg, ${C.caramel}, ${C.accent2})` : "rgba(255,255,255,0.04)", color: picked.length ? "#0d0f14" : C.latte, fontSize: 15, fontWeight: 700, cursor: picked.length ? "pointer" : "default", boxShadow: picked.length ? `0 4px 20px ${C.accentGlow}` : "none" }}>
              Проверить
            </button>
          )}
        </TaskCard>
        <Reaction show={showResult} isCorrect={isCorrect} text={reaction} />
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   ЗАДАНИЕ 5 — Паронимы (верно/неверно + показ исправления)
   ═══════════════════════════════════════════ */
function Task5({ onBack }) {
  const round = useRound(PARONYM_ITEMS, 12);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const current = round.items[round.index];
  if (round.finished) return <ResultScreen correct={round.stats.correct} wrong={round.stats.wrong} hasRetry={round.wrongItems.length > 0} onRetry={round.retryWrong} onRestart={round.restart} onBack={onBack} />;
  if (!current) return null;

  const answer = (val) => {
    if (showResult) return;
    const ok = val === current.correct;
    setIsCorrect(ok);
    setShowResult(true);
    round.record(ok, current);
    timerRef.current = setTimeout(() => { setShowResult(false); round.next(); }, current.correct ? 1400 : 2400);
  };

  return (
    <Shell>
      <TopBar onBack={onBack} label="Задание 5 · Паронимы" right={`${round.index + 1}/${round.items.length}`} />
      <ProgressBar value={(round.index / round.items.length) * 100} />
      <StatsRow correct={round.stats.correct} wrong={round.stats.wrong} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 60px" }}>
        <TaskCard>
          <p style={{ fontSize: 13, color: C.latte, textAlign: "center", margin: "0 0 14px" }}>Правильно ли употреблён пароним?</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: C.espresso, textAlign: "center", margin: "0 0 28px", letterSpacing: "-0.3px" }}>
            {current.phrase}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => answer(true)} disabled={showResult}
              style={{ flex: 1, padding: "13px", borderRadius: 11, border: `2px solid ${C.correct}`, background: showResult && current.correct ? C.correctBg : C.card, color: C.correct, fontSize: 15, fontWeight: 600, cursor: showResult ? "default" : "pointer" }}>
              Верно
            </button>
            <button onClick={() => answer(false)} disabled={showResult}
              style={{ flex: 1, padding: "13px", borderRadius: 11, border: `2px solid ${C.wrong}`, background: showResult && !current.correct ? C.wrongBg : C.card, color: C.wrong, fontSize: 15, fontWeight: 600, cursor: showResult ? "default" : "pointer" }}>
              Неверно
            </button>
          </div>
          {showResult && (
            <div style={{ marginTop: 18, textAlign: "center", animation: "fadeIn 0.3s ease" }}>
              <span style={{ fontSize: 14, color: isCorrect ? C.correct : C.wrong, fontWeight: 600 }}>
                {isCorrect ? pick(CORRECT_REACTIONS) : pick(WRONG_REACTIONS)}
              </span>
              {!current.correct && (
                <p style={{ fontSize: 14, color: C.mocha, margin: "10px 0 0", background: C.correctBg, padding: "10px 14px", borderRadius: 10 }}>
                  Правильно: <b style={{ color: C.correct }}>{current.fix}</b>
                </p>
              )}
            </div>
          )}
        </TaskCard>
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   ЗАДАНИЕ 6 — Плеоназмы (нажми на лишнее слово)
   ═══════════════════════════════════════════ */
function Task6({ onBack }) {
  const round = useRound(PLEONASM_ITEMS, 12);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [reaction, setReaction] = useState("");
  const timerRef = useRef(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const current = round.items[round.index];
  if (round.finished) return <ResultScreen correct={round.stats.correct} wrong={round.stats.wrong} hasRetry={round.wrongItems.length > 0} onRetry={round.retryWrong} onRestart={round.restart} onBack={onBack} />;
  if (!current) return null;

  const handleClick = (i) => {
    if (showResult) return;
    const ok = i === current.remove;
    setSelected(i);
    setIsCorrect(ok);
    setShowResult(true);
    setReaction(pick(ok ? CORRECT_REACTIONS : WRONG_REACTIONS));
    round.record(ok, current);
    timerRef.current = setTimeout(() => { setSelected(null); setShowResult(false); round.next(); }, 1700);
  };

  return (
    <Shell>
      <TopBar onBack={onBack} label="Задание 6 · Лексические нормы" right={`${round.index + 1}/${round.items.length}`} />
      <ProgressBar value={(round.index / round.items.length) * 100} />
      <StatsRow correct={round.stats.correct} wrong={round.stats.wrong} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 60px" }}>
        <TaskCard>
          <p style={{ fontSize: 13, color: C.latte, textAlign: "center", margin: "0 0 20px" }}>
            В словосочетании есть лишнее слово (плеоназм).<br />Нажми на него, чтобы исключить.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {current.words.map((w, i) => {
              const isSel = selected === i;
              const isRight = showResult && i === current.remove;
              const isWrongSel = showResult && isSel && !isCorrect;
              let bg = C.card, border = C.caramelBorder, color = C.espresso, decoration = "none";
              if (isRight) { bg = C.wrongBg; border = C.wrong; color = C.wrong; decoration = "line-through"; }
              if (isWrongSel) { bg = C.cream; border = C.latte; color = C.latte; }
              if (showResult && !isRight && !isWrongSel) { bg = C.correctBg; border = C.correct; color = C.correct; }
              return (
                <button key={i} onClick={() => handleClick(i)}
                  style={{ padding: "13px 22px", borderRadius: 12, border: `2px solid ${border}`, background: bg, color, fontSize: 20, fontWeight: 600, fontFamily: fontDisplay, cursor: showResult ? "default" : "pointer", transition: "all 0.2s", textDecoration: decoration }}
                  onMouseEnter={(e) => { if (!showResult) e.currentTarget.style.background = C.caramelSoft; }}
                  onMouseLeave={(e) => { if (!showResult) e.currentTarget.style.background = C.card; }}>
                  {w}
                </button>
              );
            })}
          </div>
        </TaskCard>
        <Reaction show={showResult} isCorrect={isCorrect} text={reaction} />
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   ЗАДАНИЕ 7 — Морфологические нормы (нажми + исправь)
   ═══════════════════════════════════════════ */
function Task7({ onBack }) {
  const round = useRound(MORPH_ITEMS, 10);
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState("pick"); // pick → type → result
  const [isCorrect, setIsCorrect] = useState(false);
  const [reaction, setReaction] = useState("");
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const current = round.items[round.index];
  if (round.finished) return <ResultScreen correct={round.stats.correct} wrong={round.stats.wrong} hasRetry={round.wrongItems.length > 0} onRetry={round.retryWrong} onRestart={round.restart} onBack={onBack} />;
  if (!current) return null;

  const handleWordClick = (i) => {
    if (phase !== "pick") return;
    setSelected(i);
    if (i === current.wrong) {
      setPhase("type");
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    } else {
      // не то слово — мягко подсказываем
      setReaction("Ошибка не здесь, посмотри ещё раз 🌿");
      setTimeout(() => { setSelected(null); setReaction(""); }, 1200);
    }
  };

  const checkAnswer = () => {
    const ok = normalize(input) === normalize(current.answer);
    setIsCorrect(ok);
    setPhase("result");
    setReaction(ok ? pick(CORRECT_REACTIONS) : `Правильно: ${current.answer} 💛`);
    round.record(ok, current);
    timerRef.current = setTimeout(() => {
      setSelected(null); setInput(""); setPhase("pick"); setReaction(""); round.next();
    }, ok ? 1500 : 2800);
  };

  return (
    <Shell>
      <TopBar onBack={onBack} label="Задание 7 · Морфологические нормы" right={`${round.index + 1}/${round.items.length}`} />
      <ProgressBar value={(round.index / round.items.length) * 100} />
      <StatsRow correct={round.stats.correct} wrong={round.stats.wrong} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 60px" }}>
        <TaskCard>
          <p style={{ fontSize: 13, color: C.latte, textAlign: "center", margin: "0 0 20px" }}>
            {phase === "pick" ? "Нажми на слово, в котором ошибка" : phase === "type" ? "Напечатай правильную форму" : ""}
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: phase !== "pick" ? 20 : 0 }}>
            {current.phrase.map((w, i) => {
              const isWrongWord = i === current.wrong;
              const isSel = selected === i;
              let bg = C.card, border = C.caramelBorder, color = C.espresso, decoration = "none";
              if (phase === "type" && isSel) { bg = C.caramelSoft; border = C.caramel; color = C.caramel; }
              if (phase === "result" && isWrongWord) { bg = C.wrongBg; border = C.wrong; color = C.wrong; decoration = "line-through"; }
              return (
                <button key={i} onClick={() => handleWordClick(i)}
                  style={{ padding: "11px 18px", borderRadius: 11, border: `2px solid ${border}`, background: bg, color, fontSize: 19, fontWeight: 600, fontFamily: fontDisplay, cursor: phase === "pick" ? "pointer" : "default", transition: "all 0.2s", textDecoration: decoration }}
                  onMouseEnter={(e) => { if (phase === "pick") e.currentTarget.style.background = C.caramelSoft; }}
                  onMouseLeave={(e) => { if (phase === "pick") e.currentTarget.style.background = C.card; }}>
                  {w}
                </button>
              );
            })}
            {phase === "result" && (
              <span style={{ padding: "11px 18px", borderRadius: 11, border: `2px solid ${C.correct}`, background: C.correctBg, color: C.correct, fontSize: 19, fontWeight: 700, fontFamily: fontDisplay, animation: "fadeIn 0.3s ease" }}>
                {current.answer}
              </span>
            )}
          </div>
          {phase === "type" && (
            <div style={{ display: "flex", gap: 8, animation: "fadeIn 0.3s ease" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) checkAnswer(); }}
                placeholder="правильная форма…"
                style={{ flex: 1, padding: "12px 16px", borderRadius: 11, border: `2px solid ${C.caramelBorder}`, background: "rgba(167,139,250,0.06)", fontSize: 16, color: C.espresso, outline: "none", boxShadow: `0 0 20px ${C.accentGlow}` }}
              />
              <button onClick={checkAnswer} disabled={!input.trim()}
                style={{ padding: "12px 22px", borderRadius: 11, border: "none", background: input.trim() ? `linear-gradient(135deg, ${C.caramel}, ${C.accent2})` : C.cream, color: input.trim() ? "#fff" : C.latte, fontSize: 15, fontWeight: 600, cursor: input.trim() ? "pointer" : "default" }}>
                ОК
              </button>
            </div>
          )}
        </TaskCard>
        <Reaction show={!!reaction} isCorrect={isCorrect} text={reaction} />
      </div>
    </Shell>
  );
}

/* ═══════════════════════════════════════════
   КОРНЕВОЙ КОМПОНЕНТ
   ═══════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const goHome = () => setPage("home");

  return (
    <>
      {page === "home" && <HomePage onNavigate={setPage} />}
      {page === "task1" && <Task1 onBack={goHome} />}
      {page === "task2" && <Task2 onBack={goHome} />}
      {page === "task3" && <Task3 onBack={goHome} />}
      {page === "task4" && <Task4 onBack={goHome} onTheory={() => setPage("theory4")} />}
      {page === "theory4" && <Theory4 onBack={() => setPage("task4")} />}
      {page === "task5" && <Task5 onBack={goHome} />}
      {page === "task6" && <Task6 onBack={goHome} />}
      {page === "task7" && <Task7 onBack={goHome} />}
    </>
  );
}
