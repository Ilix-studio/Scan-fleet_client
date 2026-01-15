// src/types/stickerEditor.types.ts

export type ShapeType = "rect" | "circle" | "star" | "triangle" | "arrow";
export type ElementType = ShapeType | "text" | "image" | "border";

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  zIndex: number;
}

export interface ShapeElement extends BaseElement {
  type: ShapeType;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  // Star properties
  numPoints?: number;
  innerRadius?: number;
  outerRadius?: number;
  // Arrow properties
  points?: number[];
  // Border style
  borderStyle?: "solid" | "dashed" | "dotted" | "rounded" | "double";
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle?: string;
  fill: string;
}

export interface ImageElement extends BaseElement {
  type: "image";
  imageSrc: string;
  imageElement?: HTMLImageElement;
}

export interface BorderElement extends BaseElement {
  type: "border";
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderStyle: "solid" | "dashed" | "rounded" | "double";
}

export type EditorElement =
  | ShapeElement
  | TextElement
  | ImageElement
  | BorderElement;

export interface EditorState {
  elements: EditorElement[];
  selectedElementId: string | null;
  canvasSize: { width: number; height: number };
  currentTemplate: string | null;
  language: string;
  isDirty: boolean;
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

// API types
export interface SaveStickerRequest {
  elements: EditorElement[];
  imageData: string;
  language: string;
  template?: string;
}

export interface SaveStickerResponse {
  success: boolean;
  referenceCode: string;
  expiresAt: string;
  expiresIn: string;
}

export interface RetrieveStickerResponse {
  success: boolean;
  referenceCode: string;
  imageData: string;
  elements: EditorElement[];
  status: string;
  createdAt: string;
  expiresAt: string;
}

export interface UseStickerRequest {
  referenceCode: string;
  tokenId: string;
}

export interface UseStickerResponse {
  success: boolean;
  referenceCode: string;
  status: string;
  newExpiresAt: string;
}
// src/types/stickerEditor.types.ts

export interface ImageElement extends BaseElement {
  type: "image";
  imageSrc: string; // base64 only - no HTMLImageElement
  fill?: string;
}
