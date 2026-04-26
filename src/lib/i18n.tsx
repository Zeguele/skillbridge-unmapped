import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type LanguageCode = "en" | "fr" | "ar" | "es" | "pt" | "hi";

export interface LanguageOption {
  code: LanguageCode;
  label: string;        // native name shown in UI
  short: string;        // short code for nav indicator (EN, FR, AR, ES, PT, HI)
  promptName: string;   // name passed to the AI ("English", "Español", ...)
  rtl: boolean;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English",   short: "EN", promptName: "English",   rtl: false },
  { code: "fr", label: "Français",  short: "FR", promptName: "Français",  rtl: false },
  { code: "ar", label: "العربية",    short: "AR", promptName: "العربية",    rtl: true  },
  { code: "es", label: "Español",   short: "ES", promptName: "Español",   rtl: false },
  { code: "pt", label: "Português", short: "PT", promptName: "Português", rtl: false },
  { code: "hi", label: "हिन्दी",       short: "HI", promptName: "हिन्दी",       rtl: false },
];

export const getLanguage = (code: LanguageCode): LanguageOption =>
  LANGUAGES.find(l => l.code === code) ?? LANGUAGES[0];

// ---------------------------------------------------------------------------
// Translation strings
// Keep this list focused on user-visible static UI copy. Dynamic AI output
// arrives in the chosen language already.
// ---------------------------------------------------------------------------

type Dict = Record<string, string>;

const en: Dict = {
  "nav.changeRole": "Change role",
  "nav.hackathon": "World Bank hackathon",

  "landing.who": "Who are you?",
  "landing.subtitle": "Skill Bridge works differently depending on who you are. Pick the option that fits you best.",
  "landing.jobSeeker": "Job Seeker",
  "landing.jobSeekerDesc": "I'm looking for work. Find out what your skills are worth, discover career paths that match your experience, and see real job openings near you.",
  "landing.getStarted": "Get started",
  "landing.policymaker": "Program Officer / Policymaker",
  "landing.policymakerDesc": "Analyze labor market signals, assess skills gaps, evaluate intervention strategies, and explore workforce data across regions to inform policy decisions and program design.",
  "landing.exploreData": "Explore data",
  "landing.notSure": "Not sure? Most people choose Job Seeker.",
  "landing.demo": "Or see a demo — meet Amara",
  "landing.dataSources": "Data sources: ILO ILOSTAT · World Bank WDI / STEP · ESCO · O*NET · Wittgenstein Centre",
  "landing.languageLabel": "Language",
  "landing.languageHint": "The whole experience — including AI-generated text — will be shown in this language.",

  "footer.tagline": "Skill Bridge · designed for low-bandwidth contexts · honest, grounded, plain language",

  "form.step": "Step",
  "form.of": "of",
  "form.back": "Back",
  "form.next": "Next",
  "form.generate": "Generate profile",
  "form.context": "Context",
  "form.education": "Education",
  "form.experience": "Experience",
  "form.skills": "Skills",
  "form.tellUs": "Tell us about you",
  "form.name": "Name (optional)",
  "form.namePlaceholder": "Your first name",
  "form.country": "Country",
};

const fr: Dict = {
  "nav.changeRole": "Changer de rôle",
  "nav.hackathon": "Hackathon Banque mondiale",

  "landing.who": "Qui êtes-vous ?",
  "landing.subtitle": "Skill Bridge fonctionne différemment selon qui vous êtes. Choisissez l'option qui vous correspond le mieux.",
  "landing.jobSeeker": "Chercheur d'emploi",
  "landing.jobSeekerDesc": "Je cherche du travail. Découvrez ce que valent vos compétences, explorez les parcours professionnels qui correspondent à votre expérience et consultez de vraies offres d'emploi près de chez vous.",
  "landing.getStarted": "Commencer",
  "landing.policymaker": "Responsable de programme / Décideur",
  "landing.policymakerDesc": "Analysez les signaux du marché du travail, évaluez les écarts de compétences, examinez les stratégies d'intervention et explorez les données sur la main-d'œuvre pour éclairer les décisions politiques.",
  "landing.exploreData": "Explorer les données",
  "landing.notSure": "Vous hésitez ? La plupart des gens choisissent Chercheur d'emploi.",
  "landing.demo": "Ou voir une démo — rencontrez Amara",
  "landing.dataSources": "Sources : OIT ILOSTAT · Banque mondiale WDI / STEP · ESCO · O*NET · Centre Wittgenstein",
  "landing.languageLabel": "Langue",
  "landing.languageHint": "Toute l'expérience — y compris les textes générés par l'IA — sera affichée dans cette langue.",

  "footer.tagline": "Skill Bridge · conçu pour les contextes à faible bande passante · honnête, ancré, langage simple",

  "form.step": "Étape",
  "form.of": "sur",
  "form.back": "Retour",
  "form.next": "Suivant",
  "form.generate": "Générer le profil",
  "form.context": "Contexte",
  "form.education": "Études",
  "form.experience": "Expérience",
  "form.skills": "Compétences",
  "form.tellUs": "Parlez-nous de vous",
  "form.name": "Nom (facultatif)",
  "form.namePlaceholder": "Votre prénom",
  "form.country": "Pays",
};

const ar: Dict = {
  "nav.changeRole": "تغيير الدور",
  "nav.hackathon": "هاكاثون البنك الدولي",

  "landing.who": "من أنت؟",
  "landing.subtitle": "يعمل Skill Bridge بشكل مختلف حسب هويتك. اختر الخيار الذي يناسبك.",
  "landing.jobSeeker": "باحث عن عمل",
  "landing.jobSeekerDesc": "أبحث عن عمل. اكتشف قيمة مهاراتك، واستكشف المسارات المهنية التي تناسب خبرتك، وشاهد فرص عمل حقيقية بالقرب منك.",
  "landing.getStarted": "ابدأ الآن",
  "landing.policymaker": "مسؤول برامج / صانع سياسات",
  "landing.policymakerDesc": "حلّل إشارات سوق العمل، وقيّم الفجوات في المهارات، واستكشف بيانات القوى العاملة لدعم قرارات السياسات وتصميم البرامج.",
  "landing.exploreData": "استكشف البيانات",
  "landing.notSure": "غير متأكد؟ يختار معظم الناس \"باحث عن عمل\".",
  "landing.demo": "أو شاهد عرضًا توضيحيًا — تعرّف على أمارا",
  "landing.dataSources": "مصادر البيانات: ILO ILOSTAT · البنك الدولي WDI / STEP · ESCO · O*NET · مركز Wittgenstein",
  "landing.languageLabel": "اللغة",
  "landing.languageHint": "ستُعرض التجربة بالكامل — بما في ذلك النصوص المُولّدة بالذكاء الاصطناعي — بهذه اللغة.",

  "footer.tagline": "Skill Bridge · مصمم لبيئات الإنترنت المحدود · صادق، واقعي، بلغة بسيطة",

  "form.step": "الخطوة",
  "form.of": "من",
  "form.back": "رجوع",
  "form.next": "التالي",
  "form.generate": "إنشاء الملف الشخصي",
  "form.context": "السياق",
  "form.education": "التعليم",
  "form.experience": "الخبرة",
  "form.skills": "المهارات",
  "form.tellUs": "أخبرنا عن نفسك",
  "form.name": "الاسم (اختياري)",
  "form.namePlaceholder": "اسمك الأول",
  "form.country": "الدولة",
};

const es: Dict = {
  "nav.changeRole": "Cambiar rol",
  "nav.hackathon": "Hackathon del Banco Mundial",

  "landing.who": "¿Quién eres?",
  "landing.subtitle": "Skill Bridge funciona de manera diferente según quién seas. Elige la opción que mejor te describa.",
  "landing.jobSeeker": "Buscador de empleo",
  "landing.jobSeekerDesc": "Estoy buscando trabajo. Descubre cuánto valen tus habilidades, explora trayectorias profesionales que coincidan con tu experiencia y consulta ofertas de empleo reales cerca de ti.",
  "landing.getStarted": "Comenzar",
  "landing.policymaker": "Oficial de programa / Responsable de políticas",
  "landing.policymakerDesc": "Analiza señales del mercado laboral, evalúa brechas de habilidades, valora estrategias de intervención y explora datos sobre la fuerza laboral para informar decisiones de política y diseño de programas.",
  "landing.exploreData": "Explorar datos",
  "landing.notSure": "¿No estás seguro? La mayoría elige Buscador de empleo.",
  "landing.demo": "O mira una demo — conoce a Amara",
  "landing.dataSources": "Fuentes: OIT ILOSTAT · Banco Mundial WDI / STEP · ESCO · O*NET · Centro Wittgenstein",
  "landing.languageLabel": "Idioma",
  "landing.languageHint": "Toda la experiencia — incluido el texto generado por IA — se mostrará en este idioma.",

  "footer.tagline": "Skill Bridge · diseñado para contextos de bajo ancho de banda · honesto, realista, lenguaje claro",

  "form.step": "Paso",
  "form.of": "de",
  "form.back": "Atrás",
  "form.next": "Siguiente",
  "form.generate": "Generar perfil",
  "form.context": "Contexto",
  "form.education": "Educación",
  "form.experience": "Experiencia",
  "form.skills": "Habilidades",
  "form.tellUs": "Cuéntanos sobre ti",
  "form.name": "Nombre (opcional)",
  "form.namePlaceholder": "Tu nombre",
  "form.country": "País",
};

const pt: Dict = {
  "nav.changeRole": "Alterar função",
  "nav.hackathon": "Hackathon do Banco Mundial",

  "landing.who": "Quem é você?",
  "landing.subtitle": "O Skill Bridge funciona de forma diferente dependendo de quem você é. Escolha a opção que melhor se encaixa.",
  "landing.jobSeeker": "Pessoa em busca de emprego",
  "landing.jobSeekerDesc": "Estou procurando trabalho. Descubra quanto valem suas habilidades, explore caminhos de carreira que combinam com sua experiência e veja vagas reais perto de você.",
  "landing.getStarted": "Começar",
  "landing.policymaker": "Oficial de programa / Formulador de políticas",
  "landing.policymakerDesc": "Analise sinais do mercado de trabalho, avalie lacunas de competências, examine estratégias de intervenção e explore dados sobre a força de trabalho para apoiar decisões de política e desenho de programas.",
  "landing.exploreData": "Explorar dados",
  "landing.notSure": "Não tem certeza? A maioria escolhe Pessoa em busca de emprego.",
  "landing.demo": "Ou veja uma demo — conheça Amara",
  "landing.dataSources": "Fontes: OIT ILOSTAT · Banco Mundial WDI / STEP · ESCO · O*NET · Centro Wittgenstein",
  "landing.languageLabel": "Idioma",
  "landing.languageHint": "Toda a experiência — incluindo o texto gerado por IA — será exibida neste idioma.",

  "footer.tagline": "Skill Bridge · projetado para contextos de baixa largura de banda · honesto, realista, linguagem simples",

  "form.step": "Etapa",
  "form.of": "de",
  "form.back": "Voltar",
  "form.next": "Avançar",
  "form.generate": "Gerar perfil",
  "form.context": "Contexto",
  "form.education": "Educação",
  "form.experience": "Experiência",
  "form.skills": "Habilidades",
  "form.tellUs": "Conte-nos sobre você",
  "form.name": "Nome (opcional)",
  "form.namePlaceholder": "Seu primeiro nome",
  "form.country": "País",
};

const hi: Dict = {
  "nav.changeRole": "भूमिका बदलें",
  "nav.hackathon": "विश्व बैंक हैकाथॉन",

  "landing.who": "आप कौन हैं?",
  "landing.subtitle": "Skill Bridge इस बात पर निर्भर करता है कि आप कौन हैं। वह विकल्प चुनें जो आपके लिए सबसे उपयुक्त हो।",
  "landing.jobSeeker": "नौकरी ढूँढने वाला",
  "landing.jobSeekerDesc": "मैं काम की तलाश में हूँ। जानें कि आपके कौशल का क्या मूल्य है, अपने अनुभव से मेल खाते करियर पथ खोजें, और अपने पास असली नौकरी के अवसर देखें।",
  "landing.getStarted": "शुरू करें",
  "landing.policymaker": "कार्यक्रम अधिकारी / नीति निर्माता",
  "landing.policymakerDesc": "श्रम बाज़ार के संकेतों का विश्लेषण करें, कौशल अंतर का आकलन करें, हस्तक्षेप रणनीतियों का मूल्यांकन करें, और नीति निर्णयों एवं कार्यक्रम डिज़ाइन को सूचित करने के लिए कार्यबल डेटा का अन्वेषण करें।",
  "landing.exploreData": "डेटा देखें",
  "landing.notSure": "तय नहीं? अधिकांश लोग \"नौकरी ढूँढने वाला\" चुनते हैं।",
  "landing.demo": "या डेमो देखें — अमारा से मिलें",
  "landing.dataSources": "डेटा स्रोत: ILO ILOSTAT · विश्व बैंक WDI / STEP · ESCO · O*NET · विट्गेंस्टीन केंद्र",
  "landing.languageLabel": "भाषा",
  "landing.languageHint": "पूरा अनुभव — एआई द्वारा उत्पन्न पाठ सहित — इसी भाषा में दिखाया जाएगा।",

  "footer.tagline": "Skill Bridge · कम बैंडविड्थ संदर्भों के लिए डिज़ाइन किया गया · ईमानदार, यथार्थवादी, सरल भाषा",

  "form.step": "चरण",
  "form.of": "का",
  "form.back": "वापस",
  "form.next": "आगे",
  "form.generate": "प्रोफ़ाइल बनाएँ",
  "form.context": "संदर्भ",
  "form.education": "शिक्षा",
  "form.experience": "अनुभव",
  "form.skills": "कौशल",
  "form.tellUs": "अपने बारे में बताएं",
  "form.name": "नाम (वैकल्पिक)",
  "form.namePlaceholder": "आपका पहला नाम",
  "form.country": "देश",
};

const DICTS: Record<LanguageCode, Dict> = { en, fr, ar, es, pt, hi };

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface LanguageContextValue {
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  t: (key: keyof typeof en) => string;
  option: LanguageOption;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "skillbridge.lang";

function readInitial(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
  if (stored && DICTS[stored]) return stored;
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(readInitial);

  const setLang = (l: LanguageCode) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  };

  useEffect(() => {
    const opt = getLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = opt.rtl ? "rtl" : "ltr";
  }, [lang]);

  const t = (key: keyof typeof en) => DICTS[lang][key] ?? en[key] ?? String(key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, option: getLanguage(lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
