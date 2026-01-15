// constants/stickerEditor.ts

import { DefaultTemplate, LanguageOption } from "@/types/stickerEditor.types";

export const CANVAS_SIZE = 400;
export const EXPORT_SIZE = 800;
export const MAX_HISTORY = 50;

export const LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    sampleTexts: [
      "SCAN FOR HELP",
      "EMERGENCY",
      "OWNER INFO",
      "CONTACT",
      "CALL NOW",
    ],
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    sampleTexts: [
      "स्कैन करें",
      "आपातकालीन",
      "मालिक जानकारी",
      "संपर्क करें",
      "मदद",
    ],
  },
  {
    code: "as",
    name: "Assamese",
    nativeName: "অসমীয়া",
    sampleTexts: ["স্কেন কৰক", "জৰুৰীকালীন", "মালিকৰ তথ্য", "যোগাযোগ", "সহায়"],
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    sampleTexts: [
      "স্ক্যান করুন",
      "জরুরি",
      "মালিকের তথ্য",
      "যোগাযোগ",
      "সাহায্য",
    ],
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    sampleTexts: ["ஸ்கேன் செய்", "அவசரம்", "உரிமையாளர்", "தொடர்பு", "உதவி"],
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    sampleTexts: [
      "స్కాన్ చేయండి",
      "అత్యవసరం",
      "యజమాని",
      "సంప్రదించండి",
      "సహాయం",
    ],
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    sampleTexts: ["ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", "ತುರ್ತು", "ಮಾಲೀಕರು", "ಸಂಪರ್ಕಿಸಿ", "ಸಹಾಯ"],
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    sampleTexts: ["സ്കാൻ ചെയ്യുക", "അടിയന്തിരം", "ഉടമ", "ബന്ധപ്പെടുക", "സഹായം"],
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    sampleTexts: ["स्कॅन करा", "आपत्कालीन", "मालक माहिती", "संपर्क", "मदत"],
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    sampleTexts: ["સ્કેન કરો", "કટોકટી", "માલિક માહિતી", "સંપર્ક", "મદદ"],
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    sampleTexts: ["ਸਕੈਨ ਕਰੋ", "ਐਮਰਜੈਂਸੀ", "ਮਾਲਕ ਜਾਣਕਾਰੀ", "ਸੰਪਰਕ", "ਮਦਦ"],
  },
  {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    sampleTexts: ["ସ୍କାନ କରନ୍ତୁ", "ଜରୁରୀ", "ମାଲିକ", "ଯୋଗାଯୋଗ", "ସାହାଯ୍ୟ"],
  },
];

export const COLORS = [
  "#ffffff",
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
  "#1e293b",
  "#0f172a",
  "#fbbf24",
  "#10b981",
];

export const FONT_FAMILIES = [
  { name: "Raleway", value: "Raleway, sans-serif" },
  {
    name: "Noto Sans",
    value: "'Noto Sans Devanagari', 'Noto Sans Bengali', sans-serif",
  },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Impact", value: "Impact, sans-serif" },
];

export const ICON_MAP: Record<string, string> = {
  car: "🚗",
  bike: "🏍️",
  phone: "📞",
  sos: "🆘",
  medical: "⚕️",
  helmet: "⛑️",
  heart: "❤️",
  warning: "⚠️",
  shield: "🛡️",
};

export const DEFAULT_TEMPLATES: DefaultTemplate[] = [
  {
    id: "emergency-basic",
    name: "Emergency Basic",
    emoji: "🆘",
    elements: [
      {
        type: "rect",
        x: 200,
        y: 200,
        width: 360,
        height: 360,
        fill: "#ffffff",
        stroke: "#ef4444",
        strokeWidth: 8,
      },
      {
        type: "text",
        x: 200,
        y: 80,
        text: "🆘 EMERGENCY",
        fontSize: 32,
        fill: "#ef4444",
        fontStyle: "bold",
      },
      {
        type: "text",
        x: 200,
        y: 320,
        text: "SCAN FOR HELP",
        fontSize: 24,
        fill: "#000000",
      },
    ],
  },
  {
    id: "vehicle-info",
    name: "Vehicle Info",
    emoji: "🚗",
    elements: [
      {
        type: "rect",
        x: 200,
        y: 200,
        width: 360,
        height: 360,
        fill: "#1e293b",
        stroke: "#06b6d4",
        strokeWidth: 4,
      },
      {
        type: "text",
        x: 200,
        y: 60,
        text: "🚗",
        fontSize: 48,
        fill: "#ffffff",
      },
      {
        type: "text",
        x: 200,
        y: 120,
        text: "VEHICLE INFO",
        fontSize: 28,
        fill: "#06b6d4",
        fontStyle: "bold",
      },
      {
        type: "text",
        x: 200,
        y: 320,
        text: "Scan QR Code",
        fontSize: 20,
        fill: "#ffffff",
      },
    ],
  },
  {
    id: "bike-safety",
    name: "Bike Safety",
    emoji: "🏍️",
    elements: [
      {
        type: "circle",
        x: 200,
        y: 200,
        radius: 180,
        fill: "#000000",
        stroke: "#22c55e",
        strokeWidth: 6,
      },
      {
        type: "text",
        x: 200,
        y: 80,
        text: "🏍️",
        fontSize: 56,
        fill: "#ffffff",
      },
      {
        type: "text",
        x: 200,
        y: 160,
        text: "RIDER SAFETY",
        fontSize: 24,
        fill: "#22c55e",
        fontStyle: "bold",
      },
      {
        type: "text",
        x: 200,
        y: 300,
        text: "স্কেন কৰক",
        fontSize: 22,
        fill: "#ffffff",
      },
    ],
  },
  {
    id: "family-contact",
    name: "Family Contact",
    emoji: "👨‍👩‍👧",
    elements: [
      {
        type: "rect",
        x: 200,
        y: 200,
        width: 360,
        height: 360,
        fill: "#fef3c7",
        stroke: "#f59e0b",
        strokeWidth: 4,
      },
      {
        type: "text",
        x: 200,
        y: 70,
        text: "👨‍👩‍👧‍👦",
        fontSize: 48,
        fill: "#000000",
      },
      {
        type: "text",
        x: 200,
        y: 130,
        text: "FAMILY CONTACT",
        fontSize: 24,
        fill: "#92400e",
        fontStyle: "bold",
      },
      {
        type: "text",
        x: 200,
        y: 320,
        text: "জৰুৰীকালীন যোগাযোগ",
        fontSize: 18,
        fill: "#78350f",
      },
    ],
  },
];
