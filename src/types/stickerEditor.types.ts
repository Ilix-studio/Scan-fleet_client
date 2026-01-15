// StickerEditor.types.ts
export interface EditorElement {
  id: string;
  type: "shape" | "text" | "icon" | "image" | "border";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  shapeType?: "rectangle" | "circle" | "star" | "triangle" | "arrow";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderStyle?: "solid" | "dashed" | "rounded" | "double";
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  iconName?: string;
  imageUrl?: string;
  zIndex: number;
  // Additional properties that might be used by the editor
  scaleX?: number;
  scaleY?: number;
  radius?: number;
  points?: number[];
  innerRadius?: number;
  outerRadius?: number;
  numPoints?: number;
}
export interface HistoryState {
  elements: EditorElement[];
  selectedId: string | null;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  sampleTexts: string[];
}

export interface DefaultTemplate {
  id: string;
  name: string;
  emoji: string;
  elements: Partial<EditorElement>[];
}

export interface StickerData {
  imageData: string;
  referenceCode: string | null;
  elements: Omit<EditorElement, "imageElement">[];
}
export interface SaveStickerRequest {
  elements: EditorElement[];
  imageData: string;
  language: string;
  template?: string;
}

export interface SaveStickerResponse {
  referenceCode: string;
  expiresAt: string;
  stickerDesignId: string;
}

export interface RetrieveStickerResponse {
  referenceCode: string;
  elements: EditorElement[];
  imageData: string;
  language: string;
  template?: string;
  status: "active" | "expired" | "used";
  createdAt: string;
  expiresAt: string;
}

export interface UseStickerRequest {
  referenceCode: string;
  tokenId: string;
}

export interface UseStickerResponse {
  success: boolean;
  stickerId: string;
  qrCode: string;
  trackingNumber?: string;
}
