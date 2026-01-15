// components/PropertiesPanel.tsx

import { Layers, Move, Copy, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorElement } from "@/types/stickerEditor.types";

interface PropertiesPanelProps {
  selectedElement: EditorElement | undefined;
  elements: EditorElement[];
  selectedId: string | null;
  onSelectElement: (id: string) => void;
  onUpdateElement: (id: string, updates: Partial<EditorElement>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down") => void;
}

export const PropertiesPanel = ({
  selectedElement,
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onMoveLayer,
}: PropertiesPanelProps) => {
  return (
    <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4 max-h-[80vh] overflow-y-auto'>
      <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
        <Layers size={20} className='text-cyan-400' />
        Properties
      </h3>

      {selectedElement ? (
        <div className='space-y-4'>
          {/* Element Type */}
          <div className='p-3 bg-white/5 rounded-xl'>
            <p className='text-sm text-white/70'>
              Type:{" "}
              <span className='text-white capitalize'>
                {selectedElement.type}
              </span>
            </p>
          </div>

          {/* Position */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/70'>
              Position
            </label>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <span className='text-xs text-white/50'>X</span>
                <input
                  type='number'
                  value={Math.round(selectedElement.x)}
                  onChange={(e) =>
                    onUpdateElement(selectedId!, { x: Number(e.target.value) })
                  }
                  className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm'
                />
              </div>
              <div>
                <span className='text-xs text-white/50'>Y</span>
                <input
                  type='number'
                  value={Math.round(selectedElement.y)}
                  onChange={(e) =>
                    onUpdateElement(selectedId!, { y: Number(e.target.value) })
                  }
                  className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm'
                />
              </div>
            </div>
          </div>

          {/* Rotation */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/70'>
              Rotation: {Math.round(selectedElement.rotation)}°
            </label>
            <input
              type='range'
              min='0'
              max='360'
              value={selectedElement.rotation}
              onChange={(e) =>
                onUpdateElement(selectedId!, {
                  rotation: Number(e.target.value),
                })
              }
              className='w-full'
            />
          </div>

          {/* Scale */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/70'>Scale</label>
            <div className='flex items-center gap-2'>
              <button
                onClick={() =>
                  onUpdateElement(selectedId!, {
                    scaleX: selectedElement.scaleX * 0.9,
                    scaleY: selectedElement.scaleY * 0.9,
                  })
                }
                className='p-2 bg-white/5 hover:bg-white/10 rounded-lg'
              >
                <Minus size={16} className='text-white' />
              </button>
              <span className='flex-1 text-center text-sm text-white'>
                {Math.round(selectedElement.scaleX * 100)}%
              </span>
              <button
                onClick={() =>
                  onUpdateElement(selectedId!, {
                    scaleX: selectedElement.scaleX * 1.1,
                    scaleY: selectedElement.scaleY * 1.1,
                  })
                }
                className='p-2 bg-white/5 hover:bg-white/10 rounded-lg'
              >
                <Plus size={16} className='text-white' />
              </button>
            </div>
          </div>

          {/* Text Properties */}
          {selectedElement.type === "text" && (
            <div className='space-y-2'>
              <label className='text-sm font-medium text-white/70'>Text</label>
              <input
                type='text'
                value={selectedElement.text || ""}
                onChange={(e) =>
                  onUpdateElement(selectedId!, { text: e.target.value })
                }
                className='w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white'
              />
              <div className='flex items-center gap-2'>
                <span className='text-xs text-white/50'>Size:</span>
                <input
                  type='number'
                  value={selectedElement.fontSize || 24}
                  onChange={(e) =>
                    onUpdateElement(selectedId!, {
                      fontSize: Number(e.target.value),
                    })
                  }
                  className='w-20 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm'
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className='flex gap-2 pt-4 border-t border-white/10'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onDuplicateElement(selectedId!)}
              className='flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent'
            >
              <Copy size={14} className='mr-1' />
              Copy
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onDeleteElement(selectedId!)}
              className='flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent'
            >
              <Trash2 size={14} className='mr-1' />
              Delete
            </Button>
          </div>

          {/* Layer Controls */}
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onMoveLayer(selectedId!, "down")}
              className='flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent'
            >
              ↓ Back
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onMoveLayer(selectedId!, "up")}
              className='flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent'
            >
              ↑ Front
            </Button>
          </div>
        </div>
      ) : (
        <div className='text-center py-8'>
          <Move size={48} className='mx-auto text-white/20 mb-4' />
          <p className='text-white/50 text-sm'>Select an element to edit</p>
        </div>
      )}

      {/* Layers List */}
      <div className='pt-4 border-t border-white/10'>
        <h4 className='text-sm font-medium text-white/70 mb-2'>
          Layers ({elements.length})
        </h4>
        <div className='space-y-1 max-h-40 overflow-y-auto'>
          {[...elements].reverse().map((el) => (
            <button
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                selectedId === el.id
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              <div
                className='w-4 h-4 rounded'
                style={{
                  backgroundColor:
                    "fill" in el && el.fill
                      ? el.fill === "transparent"
                        ? "#666"
                        : el.fill
                      : "#666",
                }}
              />
              <span className='truncate'>
                {el.type}
                {"text" in el && el.text ? `: ${el.text.slice(0, 8)}` : ""}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
