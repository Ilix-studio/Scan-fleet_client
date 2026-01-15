import { EditorElement, ShapeType } from "@/types/stickerEditor.types";
import { CANVAS_SIZE, ICON_MAP } from "./StickerEditor.contants";

export const generateId = (): string =>
  `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const createShapeElement = (
  type: ShapeType,
  fill: string,
  stroke: string,
  zIndex: number = 0
): EditorElement => {
  const base = {
    id: generateId(),
    type,
    x: CANVAS_SIZE / 2,
    y: CANVAS_SIZE / 2,
    fill,
    stroke,
    strokeWidth: 2,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    zIndex,
    width: 80,
    height: 60,
  };

  switch (type) {
    case "rect":
      return { ...base, type: "rect" };
    case "circle":
      return { ...base, type: "circle", radius: 40 };
    case "star":
      return {
        ...base,
        type: "star",
        numPoints: 5,
        innerRadius: 20,
        outerRadius: 40,
      };
    case "triangle":
      return { ...base, type: "triangle", radius: 40 };
    case "arrow":
      return { ...base, type: "arrow", points: [0, 0, 60, 0] };
  }
};

export const createTextElement = (
  text: string,
  fill: string,
  fontSize: number,
  fontFamily: string,
  zIndex: number = 0
): EditorElement => ({
  id: generateId(),
  type: "text",
  x: CANVAS_SIZE / 2,
  y: CANVAS_SIZE / 2,
  width: 100,
  height: fontSize,
  fill,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  zIndex,
  text,
  fontSize,
  fontFamily,
});

export const createIconElement = (
  iconType: string,
  fill: string,
  zIndex: number = 0
): EditorElement => ({
  id: generateId(),
  type: "text",
  x: CANVAS_SIZE / 2,
  y: CANVAS_SIZE / 2,
  width: 48,
  height: 48,
  fill,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  zIndex,
  text: ICON_MAP[iconType] || "●",
  fontSize: 48,
  fontFamily: "Arial",
});

export const createBorderElement = (
  style: "solid" | "dashed" | "rounded" | "double",
  stroke: string,
  zIndex: number = 0
): EditorElement => ({
  id: generateId(),
  type: "border",
  x: CANVAS_SIZE / 2,
  y: CANVAS_SIZE / 2,
  width: CANVAS_SIZE - 40,
  height: CANVAS_SIZE - 40,
  fill: "transparent",
  stroke,
  strokeWidth: style === "double" ? 6 : 3,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  zIndex,
  borderStyle: style,
});

export const createImageElement = (
  img: HTMLImageElement,
  imageSrc: string,
  zIndex: number = 0
): EditorElement => {
  const aspectRatio = img.width / img.height;
  const maxSize = 150;
  const width = aspectRatio > 1 ? maxSize : maxSize * aspectRatio;
  const height = aspectRatio > 1 ? maxSize / aspectRatio : maxSize;

  return {
    id: generateId(),
    type: "image",
    x: CANVAS_SIZE / 2,
    y: CANVAS_SIZE / 2,
    width,
    height,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    zIndex,
    imageSrc,
    imageElement: img,
  };
};

export const serializeElements = (elements: EditorElement[]) =>
  elements.map((el) => {
    if (el.type === "image") {
      const { imageElement, ...rest } = el;
      return rest;
    }
    return el;
  });
