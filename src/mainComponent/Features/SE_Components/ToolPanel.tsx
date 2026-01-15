// components/ToolPanel.tsx

import { useRef } from "react";
import {
  Type,
  Square,
  Circle as CircleIcon,
  Star as StarIcon,
  Triangle,
  ArrowRight,
  Car,
  Bike,
  Phone,
  Shield,
  Heart,
  AlertTriangle,
  Plus,
  Upload,
  Frame,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  COLORS,
  DEFAULT_TEMPLATES,
  FONT_FAMILIES,
} from "../StickerEditor.contants";
import { LanguageOption } from "@/types/stickerEditor.types";

type TabType = "templates" | "shapes" | "icons" | "text" | "borders" | "images";

interface ToolPanelProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedLanguage: LanguageOption;
  setSelectedLanguage: (lang: LanguageOption) => void;
  languages: LanguageOption[];
  showLanguageMenu: boolean;
  setShowLanguageMenu: (show: boolean) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  currentStroke: string;
  setCurrentStroke: (color: string) => void;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  onAddShape: (type: "rect" | "circle" | "star" | "triangle" | "arrow") => void;
  onAddText: (text: string) => void;
  onAddIcon: (iconType: string) => void;
  onAddBorder: (style: "solid" | "dashed" | "rounded" | "double") => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadTemplate: (templateId: string) => void;
  onUpdateSelectedColor: (fill: string) => void;
  onUpdateSelectedStroke: (stroke: string) => void;
}

const SHAPE_ITEMS = [
  {
    type: "rect" as const,
    icon: Square,
    label: "Rectangle",
    color: "text-cyan-400",
  },
  {
    type: "circle" as const,
    icon: CircleIcon,
    label: "Circle",
    color: "text-purple-400",
  },
  {
    type: "star" as const,
    icon: StarIcon,
    label: "Star",
    color: "text-yellow-400",
  },
  {
    type: "triangle" as const,
    icon: Triangle,
    label: "Triangle",
    color: "text-green-400",
  },
  {
    type: "arrow" as const,
    icon: ArrowRight,
    label: "Arrow",
    color: "text-blue-400",
  },
];

const ICON_ITEMS = [
  { id: "car", icon: Car, label: "Car", color: "text-blue-400" },
  { id: "bike", icon: Bike, label: "Bike", color: "text-purple-400" },
  { id: "phone", icon: Phone, label: "Phone", color: "text-green-400" },
  { id: "sos", icon: AlertTriangle, label: "SOS", color: "text-red-400" },
  { id: "medical", icon: Plus, label: "Medical", color: "text-red-400" },
  { id: "shield", icon: Shield, label: "Shield", color: "text-cyan-400" },
  { id: "heart", icon: Heart, label: "Heart", color: "text-pink-400" },
  {
    id: "warning",
    icon: AlertTriangle,
    label: "Warning",
    color: "text-yellow-400",
  },
];

const BORDER_ITEMS = [
  { id: "solid" as const, label: "Solid" },
  { id: "dashed" as const, label: "Dashed" },
  { id: "rounded" as const, label: "Rounded" },
  { id: "double" as const, label: "Double" },
];

const TABS: TabType[] = [
  "templates",
  "shapes",
  "icons",
  "text",
  "borders",
  "images",
];

export const ToolPanel = ({
  activeTab,
  setActiveTab,
  selectedLanguage,
  setSelectedLanguage,
  languages,
  showLanguageMenu,
  setShowLanguageMenu,
  currentColor,
  setCurrentColor,
  currentStroke,
  setCurrentStroke,
  showColorPicker,
  setShowColorPicker,
  textInput,
  setTextInput,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  onAddShape,
  onAddText,
  onAddIcon,
  onAddBorder,
  onImageUpload,
  onLoadTemplate,
  onUpdateSelectedColor,
  onUpdateSelectedStroke,
}: ToolPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4 max-h-[80vh] overflow-y-auto'>
      {/* Language Selector */}
      <div className='relative'>
        <label className='block text-sm font-medium text-white/70 mb-2'>
          Language
        </label>
        <button
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className='w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10'
        >
          <span>{selectedLanguage.nativeName}</span>
          <ChevronDown
            size={18}
            className={`transition-transform ${
              showLanguageMenu ? "rotate-180" : ""
            }`}
          />
        </button>

        {showLanguageMenu && (
          <div className='absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden z-20 max-h-60 overflow-y-auto'>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLanguage(lang);
                  setShowLanguageMenu(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-white/10 flex items-center justify-between ${
                  selectedLanguage.code === lang.code
                    ? "bg-white/10 text-cyan-400"
                    : "text-white"
                }`}
              >
                <span>
                  {lang.nativeName}{" "}
                  <span className='text-white/50'>({lang.name})</span>
                </span>
                {selectedLanguage.code === lang.code && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className='flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl'>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium ${
              activeTab === tab
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='space-y-3'>
        {activeTab === "templates" && (
          <div className='grid grid-cols-2 gap-3'>
            {DEFAULT_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => onLoadTemplate(template.id)}
                className='p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left'
              >
                <div className='aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg mb-2 flex items-center justify-center text-2xl'>
                  {template.emoji}
                </div>
                <p className='text-sm text-white font-medium truncate'>
                  {template.name}
                </p>
              </button>
            ))}
          </div>
        )}

        {activeTab === "shapes" && (
          <div className='grid grid-cols-3 gap-2'>
            {SHAPE_ITEMS.map((shape) => (
              <button
                key={shape.type}
                onClick={() => onAddShape(shape.type)}
                className='flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl'
              >
                <shape.icon size={24} className={shape.color} />
                <span className='text-xs text-white/70'>{shape.label}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === "icons" && (
          <div className='grid grid-cols-3 gap-2'>
            {ICON_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onAddIcon(item.id)}
                className='flex flex-col items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl'
              >
                <item.icon size={24} className={item.color} />
                <span className='text-xs text-white/70'>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === "text" && (
          <div className='space-y-3'>
            <input
              type='text'
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder='Enter text...'
              className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400'
            />

            <div className='flex items-center gap-3'>
              <span className='text-sm text-white/70 w-12'>Size:</span>
              <input
                type='range'
                min='12'
                max='72'
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className='flex-1'
              />
              <span className='text-sm text-white w-8'>{fontSize}</span>
            </div>

            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white'
            >
              {FONT_FAMILIES.map((font) => (
                <option
                  key={font.value}
                  value={font.value}
                  className='bg-slate-900'
                >
                  {font.name}
                </option>
              ))}
            </select>

            <Button
              onClick={() => onAddText(textInput)}
              disabled={!textInput.trim()}
              className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 disabled:opacity-50'
            >
              <Type size={18} className='mr-2' />
              Add Text
            </Button>

            <div>
              <label className='block text-sm font-medium text-white/70 mb-2'>
                Quick Add ({selectedLanguage.nativeName})
              </label>
              <div className='grid grid-cols-2 gap-2'>
                {selectedLanguage.sampleTexts.map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAddText(text)}
                    className='px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/80 truncate'
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "borders" && (
          <div className='grid grid-cols-2 gap-2'>
            {BORDER_ITEMS.map((border) => (
              <button
                key={border.id}
                onClick={() => onAddBorder(border.id)}
                className='flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl'
              >
                <Frame size={20} className='text-cyan-400' />
                <span className='text-sm text-white/70'>{border.label}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === "images" && (
          <div className='space-y-3'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={onImageUpload}
              className='hidden'
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className='w-full bg-white/10 hover:bg-white/20 border border-white/20'
            >
              <Upload size={18} className='mr-2' />
              Upload Image
            </Button>
            <p className='text-xs text-white/50 text-center'>
              PNG, JPG, GIF supported
            </p>
          </div>
        )}
      </div>

      {/* Color Picker */}
      <div className='space-y-3 pt-4 border-t border-white/10'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-white/70'>Fill Color</span>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className='w-8 h-8 rounded-lg border-2 border-white/20'
            style={{ backgroundColor: currentColor }}
          />
        </div>

        {showColorPicker && (
          <div className='grid grid-cols-5 gap-2'>
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setCurrentColor(color);
                  onUpdateSelectedColor(color);
                }}
                className={`w-8 h-8 rounded-lg border-2 hover:scale-110 ${
                  currentColor === color ? "border-white" : "border-white/20"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-white/70'>Stroke</span>
          <div className='flex gap-2'>
            {["#000000", "#ffffff", "#ef4444", "#22c55e", "#3b82f6"].map(
              (color) => (
                <button
                  key={color}
                  onClick={() => {
                    setCurrentStroke(color);
                    onUpdateSelectedStroke(color);
                  }}
                  className={`w-6 h-6 rounded border-2 ${
                    currentStroke === color
                      ? "border-cyan-400"
                      : "border-white/20"
                  }`}
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
