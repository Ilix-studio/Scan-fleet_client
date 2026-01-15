// components/EditorCanvas.tsx

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import Konva from "konva";
import { Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

import { CanvasElement } from "./CanvasElement";

import { CANVAS_SIZE, EXPORT_SIZE } from "../StickerEditor.contants";
import { EditorElement } from "@/types/stickerEditor.types";

export interface EditorCanvasHandle {
  getDataUrl: () => string | null;
}

interface EditorCanvasProps {
  elements: EditorElement[];
  selectedId: string | null;
  onSelectElement: (id: string | null) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>, id: string) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>, id: string) => void;
  onClear: () => void;
  onDownload: () => void;
}

export const EditorCanvas = forwardRef<EditorCanvasHandle, EditorCanvasProps>(
  (
    {
      elements,
      selectedId,
      onSelectElement,
      onDragEnd,
      onTransformEnd,
      onClear,
      onDownload,
    },
    ref
  ) => {
    const stageRef = useRef<Konva.Stage>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    // Expose getDataUrl method to parent
    useImperativeHandle(ref, () => ({
      getDataUrl: () => {
        if (!stageRef.current) return null;
        return stageRef.current.toDataURL({
          pixelRatio: EXPORT_SIZE / CANVAS_SIZE,
          mimeType: "image/png",
        });
      },
    }));

    // Update transformer when selection changes
    useEffect(() => {
      if (!transformerRef.current || !layerRef.current) return;

      const transformer = transformerRef.current;
      if (selectedId) {
        const node = layerRef.current.findOne(`#${selectedId}`);
        if (node) {
          transformer.nodes([node]);
          transformer.getLayer()?.batchDraw();
        }
      } else {
        transformer.nodes([]);
        transformer.getLayer()?.batchDraw();
      }
    }, [selectedId, elements]);

    const handleStageClick = (
      e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
    ) => {
      if (e.target === e.target.getStage()) {
        onSelectElement(null);
      }
    };

    const selectedElement = elements.find((el) => el.id === selectedId);

    return (
      <div className='flex flex-col items-center'>
        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4'>
          <div
            className='relative bg-white rounded-xl overflow-hidden'
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
          >
            <Stage
              ref={stageRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onClick={handleStageClick}
              onTap={handleStageClick}
            >
              <Layer ref={layerRef}>
                {/* Background */}
                <Rect
                  x={0}
                  y={0}
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  fill='#ffffff'
                />

                {/* Elements */}
                {elements.map((element) => (
                  <CanvasElement
                    key={element.id}
                    element={element}
                    onSelect={onSelectElement}
                    onDragEnd={onDragEnd}
                    onTransformEnd={onTransformEnd}
                  />
                ))}

                {/* Transformer */}
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) =>
                    newBox.width < 10 || newBox.height < 10 ? oldBox : newBox
                  }
                  rotateEnabled
                  enabledAnchors={[
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                    "middle-left",
                    "middle-right",
                    "top-center",
                    "bottom-center",
                  ]}
                />
              </Layer>
            </Stage>

            {/* Selection indicator */}
            {selectedId && (
              <div className='absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white'>
                {selectedElement?.type}
              </div>
            )}
          </div>

          {/* Canvas Actions */}
          <div className='flex justify-center gap-2 mt-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={onClear}
              className='border-white/20 text-white hover:bg-white/10 bg-transparent'
            >
              <Trash2 size={16} className='mr-1' />
              Clear
            </Button>
            <Button
              size='sm'
              onClick={onDownload}
              className='bg-gradient-to-r from-cyan-500 to-purple-600'
            >
              <Download size={16} className='mr-1' />
              Download
            </Button>
          </div>
        </div>

        <p className='mt-2 text-sm text-white/50'>
          8cm × 8cm • 800×800px export
        </p>
      </div>
    );
  }
);

EditorCanvas.displayName = "EditorCanvas";
