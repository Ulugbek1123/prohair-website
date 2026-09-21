export interface Speaker {
  id: number;
  name: string;
  role: string;
  image: string;
  label?: string;
  description?: string | null;
  country?: string;
}

export interface SubEvent {
  title: string;
  speaker: string;
}

export interface ScheduleEvent {
  id: number;
  dayId: number;
  time: string;
  title: string;
  speaker?: string;
  subEvents?: SubEvent[];
}

export interface ScheduleDay {
  id: number;
  title: string;
  titleUz: string;
  titleEn: string;
  date: string;
}

export interface PricingPlan {
  id: number;
  category: string;
  title: string;
  priceUsd: number;
  features: string[];
}

export interface Partner {
  id: number;
  name: string;
  image: string;
  type: string;
}

export interface FAQItem {
  id: number;
  questionRu: string;
  questionUz: string;
  questionEn: string;
  answerRu: string;
  answerUz: string;
  answerEn: string;
  videoUrl?: string;
}

// 35+ Haqiqiy Spikerlar (DB dagi barcha spikerlar tartiblangan)
export const speakersData: Speaker[] = [
  {
    id: 46,
    name: "Илхом Рахимов",
    role: "Президент II Международного конгресса PROHAIR 2026",
    image: "/uploads/1787045652871.PNG",
    label: "Президент конгресса",
    description: "Врач-дерматовенеролог, трихолог, к.м.н., специалист по трансплантации волос.\nПрезидент Ассоциации трансплантологов волос и трихологов Узбекистана (O’ZSTTA).\nПрезидент II Международного конгресса «PROHair: Современная диагностика и терапия заболеваний волос». Основатель и директор центра «Natural Hair Clinic»\nЧлен ISHRS, EADV, RHRS. Региональный представитель EEAHRS по трансплантации волос.",
    country: "Узбекистан"
  },
  {
    id: 13,
    name: "Татьяна Силюк",
    role: "Со Президент Международного Конгресса PROHAIR 2026",
    image: "/uploads/1782217878445.png",
    label: "Со Президент",
    description: "ТАТЬЯНА СИЛЮК  (Санкт-Петербург, Россия )\nСо-Президент II Международного Конгресса «PROHair: «Современная диагностика и терапия заболеваний волос»\nЧлен правления и руководитель клинического отдела Русского Общества Исследования волос, президент XI Конгресса РОИВ 2026.",
    country: "Россия"
  },
  {
    id: 37,
    name: "Сабиров Улугбек",
    role: "Вице-Президент II Международного Конгресса PROHAIR 2026",
    image: "/uploads/1785842663418.png",
    label: "Вице-Президент",
    description: "Вице-Президент II Международного Конгресса «PROHair: «Современная диагностика и терапия заболеваний волос». \nДиректор Республиканского центра дерматовенерологии и косметологии Республики Узбекистан\nЧлен EADV, ISD,\nЧлен координационного Совета дерматовенерологов СНГ\nПредседатель Ассоциации дерматовенерологов Узбекистана",
    country: "Узбекистан"
  },
  {
    id: 47,
    name: "Жасур Ризаев",
    role: "Вице -Президент II Международного Конгресса PROHAIR 2026",
    image: "/uploads/1787126239183.PNG",
    label: "Вице -Президент",
    description: "Доктор медицинских наук, профессор.\nРектор Самаркандского государственного медицинского университета.\nВице -Президент II Международного Конгресса «PROHair: «Современная диагностика и терапия заболеваний волос»",
    country: "Узбекистан"
  },
  {
    id: 11,
    name: "Юваль Рамот",
    role: "Доктор медицинских наук, дерматолог",
    image: "/uploads/1781811433796.PNG",
    label: "СПЕЦИАЛЬНЫЙ ГОСТЬ",
    description: "ЮВАЛЬ РАМОТ (Израиль) врач-дерматолог, доктор медицинских наук и магистр в области биохимии в Еврейском университете в Иерусалиме, Израиль.",
    country: "Израиль"
  },
  {
    id: 12,
    name: "Рамон Гримальт",
    role: "Профессор дерматологии, дерматолог-трихолог",
    image: "/uploads/1781811440597.PNG",
    label: "СПЕЦИАЛЬНЫЙ ГОСТЬ",
    description: "РАМОН ГРИМАЛЬТ (Испания) доктор медицины и хирургии, профессор кафедры дерматологии Каталонского международного университета, член правления Европейского общества исследования волос (EHRS).",
    country: "Испания"
  },
  {
    id: 19,
    name: "Адхамжон Воисов",
    role: "Спикер",
    image: "/uploads/1782567455535.png",
    description: "Врач-дерматовенеролог, д.м.н., профессор кафедры кожных и венерических болезней ТМА, руководитель научной лаборатории лазерной и фотодинамической терапии ТМА, председатель Ассоциации врачей частной практики Узбекистана, главный редактор журнала \n«Новости дерматовенерологии и репродуктивного здоровья»",
    country: "Узбекистан"
  },
  {
    id: 14,
    name: "Андрей Дорошкевич",
    role: "Спикер",
    image: "/uploads/1782217905028.png",
    description: "АНДРЕЙ ДОРОШКЕВИЧ (Санкт-Петербург, Россия )\nврач-трихолог, вице-президент Русского Общества Исследования Волос и член правления Русского Общества Пересадки Волос (РООСТВ).",
    country: "Россия"
  },
  {
    id: 15,
    name: "Анна Пирогова",
    role: "Спикер",
    image: "/uploads/1782217920490.jpg",
    description: "АННА ПИРОГОВА (Москва, Россия) врач-дерматовенеролог, трихолог. специалист в области организации здравоохранения в клиниках ГБУЗ МО МОККВД, «Инновационная медицина» Член RHRS/РОИВ, EHSF, EADV, IDS, ITS.",
    country: "Россия"
  },
  {
    id: 16,
    name: "Екатерина Карпушина",
    role: "Спикер",
    image: "/uploads/1782217930340.jpg",
    description: "ЕКАТЕРИНА КАРПУШИНА (Москва, Россия) врач-дерматолог, трихолог, член международных профессиональных сообществ: EADV, AAD, IDS, ESPD и RHRS/РОИВ, вице-президент XI Конгресса РОИВ.",
    country: "Россия"
  },
  {
    id: 17,
    name: "Asmahane Souissi",
    role: "Спикер",
    image: "/uploads/1782567437223.png",
    description: "Врач-дерматолог, трихолог, доцент кафедры дерматологии Тунисского университета. Член правления Тунисского общества дерматологии и венерологии.",
    country: "Тунис"
  },
  {
    id: 20,
    name: "Роксанна Садугифар",
    role: "Спикер",
    image: "/uploads/1782567562547.png",
    description: "д.м.н, Президент Ближневосточного Общества Восстановления Волос (MEHR) Основатель дерматологического центра Бидар",
    country: "Иран"
  },
  {
    id: 21,
    name: "Кибриёхон Мухамадиева",
    role: "Спикер",
    image: "/uploads/1784644505935.png",
    description: "д.м.н.,профессор, заведующий кафедрой дерматовенерологии имени профессора Зоирова П.Т. ТГМУ имени Абу али ибн Сино,",
    country: "Таджикистан"
  },
  {
    id: 23,
    name: "Andreas Finner",
    role: "Спикер",
    image: "/uploads/1784644549322.png",
    description: "Член Международного общества хирургии восстановления волос (ISHRS). Клиника Trichomed — дерматология, трихология и трансплантация волос.",
    country: "Германия"
  },
  {
    id: 24,
    name: "Сергей Якушенко",
    role: "Спикер",
    image: "/uploads/1784644583481.png",
    description: "СЕРГЕЙ ЯКУШЕНКО (Липецк, Россия)\nврач- дерматовенеролог, трихолог, онколог, патоморфолог, косметолог ГУЗ ОКВД г Липецк. Главный врач клиники превентивной дерматоонкологии «Клиники доктора Якушенко» Лауреат премии Золотой дерматоскоп, эксперт Российского общества дерматоскопии и оптической диагностики.",
    country: "Россия"
  },
  {
    id: 25,
    name: "Мохина Максудова",
    role: "Спикер",
    image: "/uploads/1784644612413.PNG",
    description: "МОХИНА МАКСУДОВА (Ташкент, Узбекистан)\nврач-дерматовенеролог, трихолог клиники «Медион», специалист по регенеративной трихологии.",
    country: "Узбекистан"
  },
  {
    id: 45,
    name: "Фаррух  Умаров",
    role: "Спикер",
    image: "/uploads/1787039942028.png",
    description: "",
    country: "Узбекистан"
  },
  {
    id: 26,
    name: "Шорахмат Шарахмедов",
    role: "Спикер",
    image: "/uploads/1784644631844.PNG",
    description: "ШОРАХМАТ ШАРАХМЕДОВ (Ташкент, Узбекистан)\nврач - дерматовенеролог, трихолог-трансплантолог, кмн,\nВедущий специалист по трансплантации волос клиник MEDION и NanoHair. Член AAHRS, ISHRS.",
    country: "Узбекистан"
  },
  {
    id: 44,
    name: "Жамшид Алимжанов",
    role: "Спикер",
    image: "/uploads/1787039908002.PNG",
    description: "",
    country: "Узбекистан"
  },
  {
    id: 27,
    name: "Айжан Мамытбекова",
    role: "Спикер",
    image: "/uploads/1784644651845.PNG",
    description: "АЙЖАН МАМЫТБЕКОВА (Астана, Казакстан)\nОснователь и главный врач клиники Hair line",
    country: "Казахстан"
  },
  {
    id: 28,
    name: "Акжол Балтабев",
    role: "Спикер",
    image: "/uploads/1785138412971.png",
    description: "Врач - хирург, к.м.н., специалист по пересадке волос. Основатель клиники «Айсар»",
    country: "Кыргызстан"
  },
  {
    id: 29,
    name: "Индира Абдувахитова",
    role: "Спикер",
    image: "/uploads/1785138430085.png",
    description: "ИНДИРА АБДУВАХИТОВА   (Ташкент, Узбекистан)\nврач–дерматовенеролог, д.м.н., Заведующая отделением кожных заболеваний Ташкентского регионального филиала РСНПМЦДВиК. Член EADV, IDS.",
    country: "Узбекистан"
  },
  {
    id: 30,
    name: "Наталья Барунова",
    role: "Спикер",
    image: "/uploads/1785138445541.png",
    description: "НАТАЛЬЯ БАРУНОВА (Москва,Россия). \nврач - дерматолог, трихолог. Сооснователь Академии трихологии докторов Ткачева и Баруновой\nСоразработчик брендов профессиональной продукции ECOTRIATRIA и TORMESIS, профессиональной диагностической системы TRIHOPROF MD & ESTET",
    country: "Россия"
  },
  {
    id: 31,
    name: "Фатима Азимова",
    role: "Спикер",
    image: "/uploads/1785138466426.png",
    description: "врач-дерматовенеролог, трихолог, д.м.н. Директор Ассоциации дерматовенерологов Узбекистана, ведущий научный сотрудник РСНПМЦДВиК.\nЭксперт Министерства Здравоохранения РУз по парфюмерно- косметической продукции. Член Правления EHRS.\n",
    country: "Узбекистан"
  },
  {
    id: 32,
    name: "Владислав Петрович",
    role: "Россия",
    image: "/uploads/1785138487127.png",
    description: "врач - эндокринолог, дерматолог – трихолог, к.м.н.\nСооснователь Академии Трихологии докторов Ткачева и Баруновой\nДоцент кафедры биомедицины ИВМ РУДН.\nСоразработчик брендов профессиональной продукции ECOTRIATRIA и TORMESIS, профессиональной диагностической системы TRIHOPROF MD & ESTET\n",
    country: "Россия"
  },
  {
    id: 33,
    name: "Зульфия Джетписбаева",
    role: "Спикер",
    image: "/uploads/1785138503646.png",
    description: "ЗУЛЬФИЯ ДЖЕТПИСБАЕВА  (Астана,  Казакстан)  профессор кафедры дерматовенерологии и дерматокосметологии НАО «МУА», председатель Казахстанского общества трихологов, руководитель учебного курса «Трихология», к.м.н., Член KADD, EADV, ISD, EAEHRS, EHRS",
    country: "Казахстан"
  },
  {
    id: 34,
    name: "Yuliya Valdman",
    role: "Спикер",
    image: "/uploads/1785138516433.png",
    description: "старший консультант по дерматологии и детской дерматологии.\nЗаведующая отделением дерматологии Медицинского центра «Сорока».\n",
    country: "Израиль"
  },
  {
    id: 35,
    name: "Абдурасул Бободжонов",
    role: "Спикер",
    image: "/uploads/1785138528511.png",
    description: "АБДУРАСУЛ БОБОДЖОНОВ (Душанбе, Таджикистан)\nврач-дерматовенеролог, трихолог городская клиническая кожная больница, г. Душанбе, Республика Таджикистан. Член РОИВ, MEHRS",
    country: "Таджикистан"
  },
  {
    id: 36,
    name: "Шахноза Махмудова",
    role: "Спикер",
    image: "/uploads/1785842389033.png",
    description: "врач- дерматовенеролог РСНПМЦДВиК",
    country: "Узбекистан"
  },
  {
    id: 38,
    name: "Джудит Ферре Гирадо",
    role: "Спикер",
    image: "/uploads/1785842689671.png",
    description: "Врач-дерматолог, эксперт в области эстетической медицины и трихологии, магистр (MSc) эстетической медицины и трихологии. Специализируется на современных методах диагностики и лечения заболеваний волос и кожи головы, а также на инновационных подходах в эстетической дерматологии.",
    country: "Испания"
  },
  {
    id: 39,
    name: "Ли Хо Вон",
    role: "Спикер",
    image: "/uploads/1786424162903.jpg",
    description: "Медицинский директор клиники Gangnam The Clinic.\nЭксперт в области эстетической медицины и регенеративной терапии.\nЧлен KSAPS,KAAS, KALDAT, ASLS KOREA\n",
    country: "Южная Корея"
  },
  {
    id: 40,
    name: "Евгений Карасев",
    role: "Спикер",
    image: "/uploads/1786424195318.png",
    description: "Кандидат медицинских наук, доцент, заведующий кафедрой дерматовенерологии МВШ (Институт) РГСУ, г. Москва, РФ",
    country: "Россия"
  },
  {
    id: 41,
    name: "Елена Старикова",
    role: "Спикер",
    image: "/uploads/1786424296828.png",
    description: "Врач дематовенеролог,косметолог, трихолог,врач антивозрастной и превентивной медицины,врач функциональной диагностики,врач хирург,специалист по PDTR диагностики,тренер по полимолочной кислоте JUVELOOK&LENISNA, тренер по контурной пластики Elravia, член Русского общества исследования волос.",
    country: "Россия"
  },
  {
    id: 42,
    name: "Этери Казымова",
    role: "Спикер",
    image: "/uploads/1786424366892.jpg",
    description: "Директор медицинского центра «Inam Clinic», врач-дерматокосметолог, специалист в области эстетической медицины и инъекционной косметологии.",
    country: "Азербайджан"
  },
  {
    id: 43,
    name: "Алена Новожилова",
    role: "Спикер",
    image: "/uploads/1786424377262.jpg",
    description: "Врач-дерматолог, трихолог, косметолог, сертифицированный тренер Revixan, член RHRS",
    country: "Россия"
  }
];

// Ilmiy dastur kunlari
export const scheduleDaysData: ScheduleDay[] = [
  {
    id: 1,
    title: "ПОНЕДЕЛЬНИК, 4 сентября",
    titleUz: "DUSHANBA, 4-sentabr",
    titleEn: "MONDAY, September 4",
    date: "04.09.2026"
  },
  {
    id: 2,
    title: "ВТОРНИК, 5 сентября",
    titleUz: "SESHANBA, 5-sentabr",
    titleEn: "TUESDAY, September 5",
    date: "05.09.2026"
  }
];

// To'liq 2 kunlik ilmiy dastur hodisalari
export const scheduleEventsData: ScheduleEvent[] = [
  // 1-KUN
  {
    id: 517,
    dayId: 1,
    time: "08:45 – 09:15",
    title: "ПРИВЕТСТВЕННОЕ СЛОВО ОРГАНИЗАТОРОВ",
    speaker: "Оргкомитет PROHAIR 2026",
    subEvents: []
  },
  {
    id: 518,
    dayId: 1,
    time: "09:15 – 11:00",
    title: "СЕССИЯ: АУТОИММУННЫЕ И ГЕНЕТИЧЕСКИЕ ПОРАЖЕНИЯ ВОЛОСЯНЫХ ФОЛЛИКУЛОВ",
    speaker: "Модераторы: Илхом Рахимов, Жасур Ризаев, Андрей Дорошкевич, Рамон Гримальт",
    subEvents: [
      { title: "09:15–09:30: Что лежит в основе гнездной и рубцовых алопеций?", speaker: "Илхом Рахимов (Ташкент, Узбекистан)" },
      { title: "09:30–09:50: JAK-ингибиторы – фундаментальные основы", speaker: "Татьяна Силюк (Санкт-Петербург, Россия)" },
      { title: "09:50–10:05: Как выбрать JAK-ингибитор при гнездной алопеции и переход с препарата на препарат", speaker: "Андрей Дорошкевич (Санкт-Петербург, Россия)" },
      { title: "10:05–10:35: Дисплазии волос в клинической практике", speaker: "Рамон Гримальт (Мадрид, Испания)" },
      { title: "10:35–11:00: Прения. Дискуссия и ответы на вопросы", speaker: "Все участники сессии" }
    ]
  },
  {
    id: 519,
    dayId: 1,
    time: "11:00 – 11:30",
    title: "КОФЕ-БРЕЙК И НЕТВОРКИНГ",
    speaker: "",
    subEvents: []
  },
  {
    id: 520,
    dayId: 1,
    time: "11:30 – 14:15",
    title: "СЕССИЯ: МЕТОДЫ ДИАГНОСТИКИ И ЛЕЧЕНИЯ БОЛЕЗНЕЙ ВОЛОС",
    speaker: "Модераторы: Адхамжон Ваисов, Ли Хон Вон, Азиз Кубаев",
    subEvents: [
      { title: "11:30–11:45: Выпадение волос: алгоритмы диагностики и современные методы терапии", speaker: "Адхамжон Ваисов (Ташкент, Узбекистан)" },
      { title: "11:45–12:00: Андрогенетическая алопеция: клиническая и трихоскопическая диагностика", speaker: "Илхом Рахимов (Ташкент, Узбекистан)" },
      { title: "12:00–12:15: Искусство точной диагностики и клеточного восстановления", speaker: "Этери Казымова (Баку, Азербайджан)" },
      { title: "12:15–12:30: TRIHOPROF-диагностика: автоматический диагноз и анизотрихоз", speaker: "Владислав Ткачев (Москва, Россия)" },
      { title: "12:30–12:40: Терапевтический потенциал света в трихологии", speaker: "Юлия Жерлицына (Москва, Россия)" },
      { title: "12:40–12:50: Выбор длины волны лазера как ключевой фактор терапии", speaker: "Алена Новожилова (Москва, Россия)" },
      { title: "12:50–13:05: Клинические возможности фотодинамической терапии", speaker: "Алена Новожилова (Москва, Россия)" },
      { title: "13:05–13:20: Тулиевый лазер Ultra LaseMD в комплексной терапии АГА", speaker: "Елена Старикова (Москва, Россия)" },
      { title: "13:20–13:45: Экзосомы для волос: научные данные и клинический протокол", speaker: "Ли Хо Вон (Сеул, Южная Корея)" }
    ]
  },
  {
    id: 521,
    dayId: 1,
    time: "14:15 – 15:15",
    title: "ОБЕД ДЛЯ ДЕЛЕГАТОВ (Ресторан «Чаткал»)",
    speaker: "",
    subEvents: []
  },
  {
    id: 522,
    dayId: 1,
    time: "15:15 – 16:30",
    title: "СЕССИЯ: АНДРОГЕНЕТИЧЕСКАЯ АЛОПЕЦИЯ У МУЖЧИН И ЖЕНЩИН",
    speaker: "Модераторы: Фатима Азимова, Акбар Утаев, Фаррух Умуров",
    subEvents: [
      { title: "15:15–15:30: Регенеративная и антиандрогенная терапия андрогенной алопеции", speaker: "Фатима Азимова (Ташкент, Узбекистан)" },
      { title: "15:30–15:45: Современные инновации в профилактике и лечении АГА", speaker: "Евгений Карасев (Москва, Россия)" },
      { title: "15:45–16:00: Антиандрогенная терапия у мужчин: финастерид, дутастерид", speaker: "Андрей Дорошкевич (Санкт-Петербург, Россия)" },
      { title: "16:00–16:10: Молекулярно-генетические предикторы тяжёлого течения АГА", speaker: "Фаррух Умуров (Ташкент, Узбекистан)" },
      { title: "16:10–16:30: Прения и ответы на вопросы", speaker: "" }
    ]
  },
  {
    id: 523,
    dayId: 1,
    time: "16:30 – 17:00",
    title: "КОФЕ-БРЕЙК",
    speaker: "",
    subEvents: []
  },
  {
    id: 524,
    dayId: 1,
    time: "17:00 – 18:00",
    title: "СЕССИЯ: ГНЕЗДНАЯ АЛОПЕЦИЯ У ДЕТЕЙ И ВЗРОСЛЫХ",
    speaker: "Модераторы: Зульфия Джетписбаева, Гузаль Клеблеева, Жамшид Алимжанов",
    subEvents: [
      { title: "17:00–17:15: Гнездная алопеция: от точной диагностики к персонализированной терапии", speaker: "Зульфия Джетписбаева (Астана, Казахстан)" },
      { title: "17:15–17:25: Клинические и биохимические индикаторы гнездной алопеции у детей", speaker: "Жамшид Алимжанов (Ташкент, Узбекистан)" },
      { title: "17:25–17:35: Клинико-патогенетический подход к терапии гнездной алопеции у детей", speaker: "Кибриехон Мухамадиева (Душанбе, Таджикистан)" },
      { title: "17:35–17:45: Тофацитиниб и пульс-терапия дексаметазоном: серия клинических случаев", speaker: "Абдурасул Бободжонов (Душанбе, Таджикистан)" },
      { title: "17:45–18:00: Прения и подведение итогов 1-го дня", speaker: "" }
    ]
  },
  {
    id: 525,
    dayId: 1,
    time: "19:30",
    title: "ТОРЖЕСТВЕННЫЙ ГАЛА-УЖИН (Ресторан «Oasis Garden»)",
    speaker: "Для зарегистрированных участников Конгресса",
    subEvents: []
  },

  // 2-KUN
  {
    id: 526,
    dayId: 2,
    time: "09:00 – 10:45",
    title: "СЕССИЯ: РУБЦОВАЯ АЛОПЕЦИЯ И СЛОЖНЫЕ СЛУЧАИ",
    speaker: "Модераторы: Асмахен Сусси, Роксанна Садоугифар, Татьяна Силюк",
    subEvents: [
      { title: "09:00–09:15: Дискоидная красная волчанка: от трихоскопии к лечению", speaker: "Асмахен Сусси (Тунис, Тунис)" },
      { title: "09:15–09:30: Фронтальная фиброзная алопеция – международные обновления", speaker: "Роксанна Садоугифар (Тегеран, Иран)" },
      { title: "09:30–09:45: Декальвирующий фолликулит: современные протоколы", speaker: "Екатерина Карпушина (Москва, Россия)" },
      { title: "09:45–10:00: Рассекающий целлюлит: от трихоскопии к комбинированной терапии", speaker: "Анна Пирогова (Москва, Россия)" },
      { title: "10:00–10:15: Патоморфологические аспекты диагностики рубцовых алопеций", speaker: "Сергей Якушенко (Липецк, Россия)" },
      { title: "10:15–10:45: Прения и открытая дискуссия", speaker: "" }
    ]
  },
  {
    id: 527,
    dayId: 2,
    time: "10:45 – 11:15",
    title: "КОФЕ-БРЕЙК",
    speaker: "",
    subEvents: []
  },
  {
    id: 528,
    dayId: 2,
    time: "11:15 – 13:00",
    title: "СЕССИЯ: ПЕРСПЕКТИВНЫЕ ПОДХОДЫ В ЛЕЧЕНИИ АГА",
    speaker: "Модераторы: Зура Абидова, Этери Казымова, Махина Максудова",
    subEvents: [
      { title: "11:15–11:30: Female pattern hair loss – новая эра понимания", speaker: "Роксанна Садоугифар (Тегеран, Иран)" },
      { title: "11:30–11:45: Истончение волос в андрогензависимой зоне – всегда ли это АГА?", speaker: "Анна Пирогова (Москва, Россия)" },
      { title: "11:45–12:00: Комбинация дутастерида и растительных экзосом mesoestetic", speaker: "Джудит Ферре Гирадо (Мадрид, Испания)" },
      { title: "12:00–12:15: Наружные комбинации в лечении андрогенетической алопеции", speaker: "Махина Максудова (Ташкент, Узбекистан)" },
      { title: "12:15–12:30: Экзосомы в трихологии: доказательная база", speaker: "Джудит Ферре Гирадо (Мадрид, Испания)" },
      { title: "12:30–13:00: Прения и вопросы из зала", speaker: "" }
    ]
  },
  {
    id: 529,
    dayId: 2,
    time: "13:00 – 14:40",
    title: "СЕССИЯ: ЛЕЧЕНИЕ И УХОД ЗА КОЖЕЙ ГОЛОВЫ",
    speaker: "Модераторы: Гули Исмаилова, Юлия Вальдман, Индира Абдувахитова",
    subEvents: [
      { title: "13:00–13:15: Псориаз скальпа у детей и подростков", speaker: "Юлия Вальдман (Иерусалим, Израиль)" },
      { title: "13:15–13:30: Протоколы фармакотерапии и лечебной косметики в трихологии", speaker: "Наталия Барунова (Москва, Россия)" },
      { title: "13:30–13:45: Скорая помощь при себорейном дерматите и остром зуде", speaker: "Индира Абдувахитова (Ташкент, Узбекистан)" },
      { title: "13:45–14:00: Уход за кожей головы после трансплантации волос", speaker: "Екатерина Карпушина (Москва, Россия)" },
      { title: "14:00–14:20: Асбестовидный лихен: обзор и авторские подходы", speaker: "Юваль Рамот (Иерусалим, Израиль)" },
      { title: "14:20–14:40: Прения", speaker: "" }
    ]
  },
  {
    id: 530,
    dayId: 2,
    time: "14:40 – 15:40",
    title: "ОБЕД (Ресторан «Чаткал»)",
    speaker: "",
    subEvents: []
  },
  {
    id: 531,
    dayId: 2,
    time: "15:40 – 17:40",
    title: "СЕССИЯ: ПЕДИАТРИЧЕСКАЯ ТРИХОЛОГИЯ И СЛОЖНЫЕ АЛОПЕЦИИ",
    speaker: "Модераторы: Андрей Дорошкевич, Юваль Рамот, Шахноза Махмудова",
    subEvents: [
      { title: "15:40–15:55: Гнездная алопеция: трихоскопическая верификация", speaker: "Татьяна Силюк (Санкт-Петербург, Россия)" },
      { title: "15:55–16:15: Маленькие пациенты, большие вызовы. Алопеция в педиатрии", speaker: "Юлия Вальдман (Иерусалим, Израиль)" },
      { title: "16:15–16:45: Как я лечу гнездную алопецию у детей", speaker: "Рамон Гримальт (Мадрид, Испания)" },
      { title: "16:45–16:55: Ингибиторы Янус-киназ в детской практике", speaker: "Шахноза Махмудова (Ташкент, Узбекистан)" },
      { title: "16:55–17:05: Гнездная алопеция – разбор сложных случаев", speaker: "Асмахен Сусси (Тунис, Тунис)" },
      { title: "17:05–17:25: Рубцовые алопеции у детей", speaker: "Юваль Рамот (Иерусалим, Израиль)" },
      { title: "17:25–17:40: Прения", speaker: "" }
    ]
  },
  {
    id: 532,
    dayId: 2,
    time: "17:40 – 18:50",
    title: "СЕССИЯ: СОВРЕМЕННАЯ ТРАНСПЛАНТАЦИЯ ВОЛОС",
    speaker: "Модераторы: Илхом Рахимов, Айжан Мамытбекова",
    subEvents: [
      { title: "17:40–17:55: Кандидат на трансплантацию: кого оперировать, а кому отказать?", speaker: "Илхом Рахимов (Ташкент, Узбекистан)" },
      { title: "17:55–18:10: От планирования до естественного роста волос", speaker: "Акжол Балтабаев (Бишкек, Кыргызстан)" },
      { title: "18:10–18:25: Персонализированный подход в трансплантации волос", speaker: "Шорахмат Шарахмедов (Ташкент, Узбекистан)" },
      { title: "18:25–18:40: Реабилитация и уход после пересадки волос", speaker: "Айжан Мамытбекова (Астана, Казахстан)" },
      { title: "18:40–18:50: Прения и подведение итогов", speaker: "" }
    ]
  },
  {
    id: 533,
    dayId: 2,
    time: "18:50 – 19:00",
    title: "ТОРЖЕСТВЕННОЕ ЗАКРЫТИЕ КОНГРЕССА И ВРУЧЕНИЕ СЕРТИФИКАТОВ",
    speaker: "Оргкомитет PROHAIR 2026",
    subEvents: []
  }
];

// Tariflar (Pricing)
export const pricingPlansData: PricingPlan[] = [
  {
    id: 1,
    category: "Congress Pass",
    title: "Члены UzSTTA 2026",
    priceUsd: 150,
    features: [
      "Доступ на 2 дня Конгресса UzSTTA",
      "Полный пакет раздаточных материалов",
      "Кофе-брейки и обеды (шведский стол)",
      "Сертификат международного образца",
      "Доступ к выставке брендов и аппаратов"
    ]
  },
  {
    id: 2,
    category: "Congress Pass",
    title: "Не члены UzSTTA 2026",
    priceUsd: 200,
    features: [
      "Доступ на 2 дня Конгресса UzSTTA",
      "Полный пакет раздаточных материалов",
      "Кофе-брейки и обеды (шведский стол)",
      "Сертификат международного образца",
      "Доступ к выставке брендов и аппаратов"
    ]
  },
  {
    id: 3,
    category: "One-Day Pass",
    title: "Билет на один день",
    priceUsd: 150,
    features: [
      "Доступ на 1 выбранный день Конгресса",
      "Раздаточные материалы дня",
      "Кофе-брейки и обед",
      "Сертификат участника дня"
    ]
  },
  {
    id: 4,
    category: "Academic",
    title: "Студент / Ординатор",
    priceUsd: 100,
    features: [
      "Доступ на 2 дня Конгресса UzSTTA",
      "Раздаточные материалы",
      "Кофе-брейки и обеды",
      "Сертификат участника"
    ]
  },
  {
    id: 9,
    category: "Special",
    title: "Тариф РОИВ (Члены ассоциации)",
    priceUsd: 300,
    features: [
      "2 дня Конгресса UzSTTA",
      "Участие во всех закрытых секциях",
      "Раздаточные материалы и памятные подарки",
      "Кофе-брейки, обеды и нетворкинг"
    ]
  },
  {
    id: 11,
    category: "Membership",
    title: "Членский взнос UzSTTA (Резидент)",
    priceUsd: 40,
    features: [
      "Сниженная стоимость регистрационного взноса на мероприятия UzSTTA",
      "Льготный доступ к закрытым обучающим видеоматериалам",
      "Возможность получения грантов на образовательные мероприятия",
      "Членство в закрытом сообществе врачей-трихологов Узбекистана"
    ]
  }
];

// Hamkorlar va Homiylar (Eski sayt bazasidan to‘liq 16 ta)
export const partnersData: Partner[] = [
  {
    id: 35,
    name: "Natural Aesthetic",
    image: "/uploads/1786426301457.png",
    type: "general"
  },
  {
    id: 9,
    name: "mesoestetic",
    image: "/uploads/1783393910766.PNG",
    type: "partner"
  },
  {
    id: 10,
    name: "arash Medical",
    image: "/uploads/1783393932418.png",
    type: "partner"
  },
  {
    id: 11,
    name: "MU LIN SEN",
    image: "/uploads/1783393936972.png",
    type: "partner"
  },
  {
    id: 13,
    name: "Bella-Systech Uzbekistan",
    image: "/uploads/1785388947345.png",
    type: "partner"
  },
  {
    id: 14,
    name: "REBEAUTY",
    image: "/uploads/1785388954651.png",
    type: "partner"
  },
  {
    id: 16,
    name: "sebamed",
    image: "/uploads/1785389044213.png",
    type: "partner"
  },
  {
    id: 19,
    name: "UMMED GROUP",
    image: "/uploads/1785389315339.png",
    type: "partner"
  },
  {
    id: 21,
    name: "ZandrA",
    image: "/uploads/1785397430421.png",
    type: "partner"
  },
  {
    id: 28,
    name: "TOMAS BEAUTY",
    image: "/uploads/1785414049865.png",
    type: "partner"
  },
  {
    id: 29,
    name: "Академия Трихологии Ткачева и Баруновой",
    image: "/uploads/1785414053509.png",
    type: "partner"
  },
  {
    id: 30,
    name: "MeZetta",
    image: "/uploads/1785835805552.png",
    type: "partner"
  },
  {
    id: 31,
    name: "РЕВИКСАН",
    image: "/uploads/1785841125220.png",
    type: "partner"
  },
  {
    id: 32,
    name: "t-lab",
    image: "/uploads/1785841129801.png",
    type: "partner"
  },
  {
    id: 36,
    name: "FOLLIMED",
    image: "/uploads/1787039870625.jpg",
    type: "partner"
  },
  {
    id: 37,
    name: "OK DOCTORS PHARMA",
    image: "/uploads/1787384662127.png",
    type: "partner"
  }
];

// Ko'p beriladigan savollar (FAQ)
export const faqsData: FAQItem[] = [
  {
    id: 1,
    questionRu: "Чему посвящен Конгресс и Выставка PROHAIR?",
    questionUz: "PROHAIR Kongressi va Ko‘rgazmasi nimaga bag‘ishlangan?",
    questionEn: "What is the PROHAIR Congress & Exhibition dedicated to?",
    answerRu: "Конгресс Выставки PROHAIR — это международная платформа встречи и взаимодействия в Узбекистане специально для врачей-трихологов, дерматологов, пластических хирургов, клиник эстетической медицины и поставщиков передовой продукции. Созданы идеальные условия для обмена клиническим опытом, презентации новейших аппаратов и препаратов, а также для всестороннего развития трихологической науки.",
    answerUz: "PROHAIR Kongressi va Ko‘rgazmasi — O‘zbekistonda shifokor-trixologlar, dermatologlar, plastik jarrohlar, estetik tibbiyot klinikalari hamda zamonaviy preparat va apparatlar yetkazib beruvchilari uchun maxsus tashkil etilgan xalqaro ilmiy platformadir. Bu yerda klinik tajriba almashish, yangi texnologiyalar bilan tanishish va sohani rivojlantirish uchun to‘liq imkoniyatlar yaratiladi.",
    answerEn: "The PROHAIR Congress & Exhibition is an international meeting platform in Uzbekistan created for trichologists, dermatologists, plastic surgeons, aesthetic clinics, and industry suppliers. It fosters clinical exchange, presentations of innovative technologies and treatments, and advancement of trichology.",
    videoUrl: ""
  },
  {
    id: 2,
    questionRu: "Кого мы объединяем онлайн и офлайн?",
    questionUz: "Biz onlayn va oflayn formatda kimlarni birlashtiramiz?",
    questionEn: "Who does the congress bring together?",
    answerRu: "Мы объединяем:\n• Врачей-трихологов, дерматовенерологов и косметологов;\n• Пластических хирургов и трансплантологов волос;\n• Руководителей и главных врачей клиник эстетической медицины;\n• Производителей и дистрибьюторов профессиональной трихологической продукции и аппаратов;\n• Исследователей и молодых ученых.",
    answerUz: "Biz quyidagi mutaxassislarni birlashtiramiz:\n• Trixologlar, dermatovenerologlar va kosmetologlar;\n• Plastik jarrohlar va soch transplantologlari;\n• Estetik tibbiyot klinikalari rahbarlari va bosh shifokorlari;\n• Professional trixologik mahsulot va uskunalar ishlab chiqaruvchilari hamda distribyutorlari;\n• Tadqiqotchilar va yosh olimlar.",
    answerEn: "We bring together:\n• Trichologists, dermatologists, and cosmetologists;\n• Plastic surgeons and hair transplant specialists;\n• Clinic directors and aesthetic healthcare leaders;\n• Manufacturers and distributors of clinical trichology equipment and products;\n• Clinical researchers and residents.",
    videoUrl: ""
  },
  {
    id: 3,
    questionRu: "Как зарегистрироваться на мероприятие?",
    questionUz: "Tadbirga qanday qilib ro‘yxatdan o‘tish mumkin?",
    questionEn: "How do I register for the event?",
    answerRu: "Вы можете оформить заявку прямо на сайте, выбрав подходящий тариф в разделе «Тарифы» и заполнив краткую форму. После отправки заявки оргкомитет свяжется с вами для подтверждения участия. Также можно связаться с нами по телефону +998 77 300 30 80 или почте info@prohair.uz.",
    answerUz: "Saytdagi «Tariflar» bo‘limida o‘zingizga ma’qul tarifni tanlab, qisqa anketani to‘ldirishingiz mumkin. Arizangiz qabul qilingach, tashkiliy qo‘mita siz bilan tasdiqlash uchun bog‘lanadi. Shuningdek, +998 77 300 30 80 yoki info@prohair.uz orqali bevosita murojaat qilishingiz mumkin.",
    answerEn: "You can submit an application right on our website by choosing your preferred pass in the pricing section and completing the short form. Our organizing committee will contact you promptly. You can also reach us via phone at +998 77 300 30 80 or email at info@prohair.uz.",
    videoUrl: "https://youtu.be/Ajo-MykxNd0"
  },
  {
    id: 4,
    questionRu: "Будет ли онлайн-трансляция и запись лекций?",
    questionUz: "Onlayn translatsiya va ma’ruzalar yozuvi bo‘ladimi?",
    questionEn: "Will there be a livestream and lecture recordings?",
    answerRu: "Да, для участников, которые не смогут присутствовать очно в Самарканде, предусмотрен специальный онлайн-формат участия с доступом к прямой трансляции ключевых сессий и видеоматериалам конгресса.",
    answerUz: "Ha, Samarqanddagi kongressda shaxsan ishtirok eta olmaydigan mutaxassislar uchun asosiy ilmiy sessiyalar jonli efiriga va video materiallarga ega onlayn ishtirok formati mavjud.",
    answerEn: "Yes, for participants unable to attend in person in Samarkand, an online participation pass provides access to live broadcasts of keynote sessions and digital materials.",
    videoUrl: ""
  },
  {
    id: 5,
    questionRu: "Что входит в стоимость билета участника?",
    questionUz: "Ishtirokchi chiptasi narxiga nimalar kiradi?",
    questionEn: "What is included in the participant ticket?",
    answerRu: "В стоимость полного билета входит: посещение всех научных заседаний и мастер-классов в течение 2 дней, официальный бейдж и пакет материалов делегата, кофе-брейки, обеды в дни конгресса, именной сертификат участника, а также доступ к специализированной выставке брендов.",
    answerUz: "To‘liq chipta narxiga quyidagilar kiradi: 2 kun davomidagi barcha ilmiy sessiyalar va mahorat darslariga kirish, rasmiy beydj va delegat materiallari to‘plami, kofe-breyklar, kongress kunlaridagi tushliklar, ishtirokchining nomli sertifikati hamda ko‘rgazma zonasiga kirish.",
    answerEn: "The full congress ticket includes: admission to all scientific sessions and masterclasses over 2 days, delegate badge and materials package, coffee breaks, lunches on congress days, an official certificate of attendance, and exhibition floor access.",
    videoUrl: ""
  }
];
