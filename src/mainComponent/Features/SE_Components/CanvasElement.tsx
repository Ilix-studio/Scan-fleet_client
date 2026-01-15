// components/CanvasElement.tsx

import {
  Rect,
  Circle,
  Star,
  Text,
  Arrow,
  RegularPolygon,
  Image as KonvaImage,
} from "react-konva";
import Konva from "konva";
import { EditorElement } from "@/types/stickerEditor.types";

interface CanvasElementProps {
  element: EditorElement;
  onSelect: (id: string) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>, id: string) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>, id: string) => void;
}

export const CanvasElement = ({
  element,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: CanvasElementProps) => {
  const commonProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    rotation: element.rotation,
    scaleX: element.scaleX,
    scaleY: element.scaleY,
    draggable: true,
    onClick: () => onSelect(element.id),
    onTap: () => onSelect(element.id),
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) =>
      onDragEnd(e, element.id),
    onTransformEnd: (e: Konva.KonvaEventObject<Event>) =>
      onTransformEnd(e, element.id),
  };

  switch (element.type) {
    case "rect":
      return (
        <Rect
          {...commonProps}
          width={element.width}
          height={element.height}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          offsetX={(element.width || 0) / 2}
          offsetY={(element.height || 0) / 2}
          dash={
            element.borderStyle === "dashed"
              ? [10, 5]
              : element.borderStyle === "dotted"
              ? [2, 3]
              : undefined
          }
          cornerRadius={element.borderStyle === "solid" ? 8 : 0}
        />
      );

    case "circle":
      return (
        <Circle
          {...commonProps}
          radius={element.radius}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
        />
      );

    case "star":
      return (
        <Star
          {...commonProps}
          numPoints={element.numPoints || 5}
          innerRadius={element.innerRadius || 20}
          outerRadius={element.outerRadius || 40}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
        />
      );

    case "triangle":
      return (
        <RegularPolygon
          {...commonProps}
          sides={3}
          radius={element.radius || 40}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
        />
      );

    case "arrow":
      return (
        <Arrow
          {...commonProps}
          points={element.points || [0, 0, 60, 0]}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth || 3}
          pointerLength={10}
          pointerWidth={10}
        />
      );

    case "text":
      return (
        <Text
          {...commonProps}
          text={element.text}
          fontSize={element.fontSize}
          fontFamily={element.fontFamily}
          fontStyle={element.fontStyle}
          fill={element.fill}
          align='center'
          verticalAlign='middle'
        />
      );

    case "image":
      if (!element.imageElement) return null;
      return (
        <KonvaImage
          {...commonProps}
          image={element.imageElement}
          width={element.width}
          height={element.height}
          offsetX={(element.width || 0) / 2}
          offsetY={(element.height || 0) / 2}
        />
      );

    default:
      return null;
  }
};
