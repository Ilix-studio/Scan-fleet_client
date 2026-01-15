// StickerEditor.tsx

import { useState, useRef, useCallback } from "react";
import Konva from "konva";
import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  CANVAS_SIZE,
  DEFAULT_TEMPLATES,
  FONT_FAMILIES,
  LANGUAGES,
} from "./StickerEditor.contants";
import { EditorCanvas, EditorCanvasHandle } from "./SE_Components/EditorCanvas";
import { useEditorHistory } from "@/hooks/useEditorHistory";
import {
  createBorderElement,
  createIconElement,
  createImageElement,
  createShapeElement,
  createTextElement,
  generateId,
  serializeElements,
} from "./StickerEditor.utils";
// This is the key change - import the mutation hook instead of a function
import { useSaveStickerMutation } from "@/redux-store/services/stickerApi";
import { ToolPanel } from "./SE_Components/ToolPanel";
import { ReferenceCodePanel } from "./SE_Components/ReferenceCodePanel";
import { PropertiesPanel } from "./SE_Components/PropertiesPanel";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import {
  EditorElement,
  LanguageOption,
  ShapeElement,
  TextElement,
} from "@/types/stickerEditor.types";

type TabType = "templates" | "shapes" | "icons" | "text" | "borders" | "images";

const StickerEditor = () => {
  // Element state
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Tool state
  const [activeTab, setActiveTab] = useState<TabType>("templates");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(
    LANGUAGES[0]
  );
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [currentColor, setCurrentColor] = useState("#3b82f6");
  const [currentStroke, setCurrentStroke] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0].value);

  // Save state - we can now remove isSaving since RTK Query manages this
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  // RTK Query mutation hook - this replaces the direct saveSticker function call
  // The hook returns an array: [trigger function, result object with status]
  const [saveSticker, { isLoading: isSaving, isError }] =
    useSaveStickerMutation();

  // Refs
  const canvasRef = useRef<EditorCanvasHandle>(null);

  // History hook
  const { canUndo, canRedo, pushHistory, undo, redo } = useEditorHistory();

  const selectedElement = elements.find((el) => el.id === selectedId);

  // History handlers
  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) {
      setElements(state.elements);
      setSelectedId(state.selectedId);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) {
      setElements(state.elements);
      setSelectedId(state.selectedId);
    }
  }, [redo]);

  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    const newElements = elements.filter((el) => el.id !== selectedId);
    setElements(newElements);
    setSelectedId(null);
    pushHistory(newElements, null);
  }, [selectedId, elements, pushHistory]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onDelete: handleDelete,
    selectedId,
  });

  // Element operations
  const addElement = useCallback(
    (newElement: EditorElement) => {
      const newElements = [...elements, newElement];
      setElements(newElements);
      setSelectedId(newElement.id);
      pushHistory(newElements, newElement.id);
    },
    [elements, pushHistory]
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<EditorElement>) => {
      const newElements = elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      );
      setElements(newElements as EditorElement[]);
      pushHistory(newElements as EditorElement[], selectedId);
    },
    [elements, pushHistory, selectedId]
  );

  const duplicateElement = useCallback(
    (id: string) => {
      const element = elements.find((el) => el.id === id);
      if (!element) return;
      addElement({
        ...element,
        id: generateId(),
        x: element.x + 20,
        y: element.y + 20,
      });
    },
    [elements, addElement]
  );

  const moveLayer = useCallback(
    (id: string, direction: "up" | "down") => {
      const index = elements.findIndex((el) => el.id === id);
      if (index === -1) return;
      const newIndex = direction === "up" ? index + 1 : index - 1;
      if (newIndex < 0 || newIndex >= elements.length) return;
      const newElements = [...elements];
      [newElements[index], newElements[newIndex]] = [
        newElements[newIndex],
        newElements[index],
      ];
      setElements(newElements);
      pushHistory(newElements, selectedId);
    },
    [elements, pushHistory, selectedId]
  );

  // Tool handlers
  const handleAddShape = useCallback(
    (type: "rect" | "circle" | "star" | "triangle" | "arrow") => {
      addElement(createShapeElement(type, currentColor, currentStroke));
    },
    [addElement, currentColor, currentStroke]
  );

  const handleAddText = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      addElement(createTextElement(text, currentColor, fontSize, fontFamily));
      setTextInput("");
    },
    [addElement, currentColor, fontSize, fontFamily]
  );

  const handleAddIcon = useCallback(
    (iconType: string) => {
      addElement(createIconElement(iconType, currentColor));
    },
    [addElement, currentColor]
  );

  const handleAddBorder = useCallback(
    (style: "solid" | "dashed" | "rounded" | "double") => {
      const newElement = createBorderElement(style, currentStroke);
      const newElements = [newElement, ...elements];
      setElements(newElements);
      setSelectedId(newElement.id);
      pushHistory(newElements, newElement.id);
    },
    [currentStroke, elements, pushHistory]
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        img.onload = () => {
          addElement(createImageElement(img, reader.result as string));
        };
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [addElement]
  );

  // src/mainComponent/Features/StickerEditor.tsx

  const handleLoadTemplate = useCallback(
    (templateId: string) => {
      const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
      if (!template) return;

      const newElements: EditorElement[] = template.elements.map((el: any) => {
        const base = {
          id: generateId(),
          x: el.x || CANVAS_SIZE / 2,
          y: el.y || CANVAS_SIZE / 2,
          width: el.width || 80,
          height: el.height || 60,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          zIndex: 0,
        };

        // Type-safe element creation
        if (el.text !== undefined) {
          return {
            ...base,
            type: "text" as const,
            text: el.text,
            fontSize: el.fontSize || 24,
            fontFamily: el.fontFamily || "Arial, sans-serif",
            fontStyle: el.fontStyle,
            fill: el.fill || "#000000",
          } as TextElement;
        }

        return {
          ...base,
          type: el.type || "rect",
          fill: el.fill || "#ffffff",
          stroke: el.stroke,
          strokeWidth: el.strokeWidth || 2,
          radius: el.radius,
        } as ShapeElement;
      });

      setElements(newElements);
      setSelectedId(null);
      pushHistory(newElements, null);
    },
    [pushHistory]
  );

  // Canvas handlers
  const handleClear = useCallback(() => {
    setElements([]);
    setSelectedId(null);
    pushHistory([], null);
  }, [pushHistory]);

  const handleDownload = useCallback(() => {
    setSelectedId(null);
    setTimeout(() => {
      const dataUrl = canvasRef.current?.getDataUrl();
      if (!dataUrl) return;

      const link = document.createElement("a");
      link.download = `scanfleet-sticker-${referenceCode || Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }, 100);
  }, [referenceCode]);

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
      updateElement(id, { x: e.target.x(), y: e.target.y() });
    },
    [updateElement]
  );

  const handleTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>, id: string) => {
      const node = e.target;
      updateElement(id, {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      });
    },
    [updateElement]
  );

  // Save handler - this is where the major changes are
  const handleSave = useCallback(async () => {
    if (!canvasRef.current) return;

    // Deselect any selected element so it doesn't show the transformer in the export
    setSelectedId(null);

    try {
      // Wait a brief moment for the UI to update and remove selection visuals
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Get the canvas as a data URL (base64 PNG)
      const dataUrl = canvasRef.current.getDataUrl();
      if (!dataUrl) throw new Error("Failed to get canvas data");

      // Call the RTK Query mutation with unwrap() to get the raw response
      // unwrap() converts the mutation promise to throw on error, making it work with try-catch
      const result = await saveSticker({
        elements,
        imageData: dataUrl,
        language: selectedLanguage.code,
        template: undefined,
      }).unwrap();

      // The mutation succeeded, store the reference code
      setReferenceCode(result.referenceCode);

      // You could also show a success notification here
      console.log("Sticker saved successfully:", result.referenceCode);
      console.log("Expires at:", result.expiresAt);
    } catch (error) {
      console.error("Save error:", error);
    }
  }, [elements, saveSticker, selectedLanguage]);

  // Purchase handler
  const handlePurchase = useCallback(async () => {
    if (!canvasRef.current) return;

    setSelectedId(null);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const data = {
      imageData: canvasRef.current.getDataUrl(),
      referenceCode,
      elements: serializeElements(elements),
    };

    console.log("Sticker data for purchase:", data);
    // Navigate to purchase flow with data
    // You could use react-router here to navigate to the purchase page
    // and pass the reference code as a URL parameter or state
  }, [elements, referenceCode]);

  return (
    <div className='min-h-screen bg-black relative'>
      {/* Background */}
      <div
        className='absolute inset-0 z-0'
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 20, 147, 0.15), transparent 50%),
            radial-gradient(ellipse 160% 130% at 10% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
            radial-gradient(ellipse 160% 130% at 90% 90%, rgba(138, 43, 226, 0.18), transparent 65%),
            #000000
          `,
        }}
      />

      <div className='relative z-10 max-w-7xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-white'>
              Smart Sticker Editor
            </h1>
            <p className='text-white/60'>
              Design your custom emergency sticker (8cm × 8cm)
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleUndo}
              disabled={!canUndo}
              className='border-white/20 text-white hover:bg-white/10 bg-transparent disabled:opacity-30'
            >
              <Undo2 size={18} />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleRedo}
              disabled={!canRedo}
              className='border-white/20 text-white hover:bg-white/10 bg-transparent disabled:opacity-30'
            >
              <Redo2 size={18} />
            </Button>
            <span className='text-xs text-white/40 ml-2'>Ctrl+Z / Ctrl+Y</span>
          </div>
        </div>

        {/* Main Layout */}
        <div className='grid lg:grid-cols-[1fr_420px_280px] gap-6'>
          {/* Left - Tools */}
          <ToolPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languages={LANGUAGES}
            showLanguageMenu={showLanguageMenu}
            setShowLanguageMenu={setShowLanguageMenu}
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
            currentStroke={currentStroke}
            setCurrentStroke={setCurrentStroke}
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
            textInput={textInput}
            setTextInput={setTextInput}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            onAddShape={handleAddShape}
            onAddText={handleAddText}
            onAddIcon={handleAddIcon}
            onAddBorder={handleAddBorder}
            onImageUpload={handleImageUpload}
            onLoadTemplate={handleLoadTemplate}
            onUpdateSelectedColor={(fill) =>
              selectedId && updateElement(selectedId, { fill })
            }
            onUpdateSelectedStroke={(stroke) =>
              selectedId && updateElement(selectedId, { stroke })
            }
          />

          {/* Center - Canvas */}
          <div className='flex flex-col items-center'>
            <EditorCanvas
              ref={canvasRef}
              elements={elements}
              selectedId={selectedId}
              onSelectElement={setSelectedId}
              onDragEnd={handleDragEnd}
              onTransformEnd={handleTransformEnd}
              onClear={handleClear}
              onDownload={handleDownload}
            />

            {/* Reference Code Panel - now shows error state if save failed */}
            <div className='mt-4 w-full max-w-md'>
              <ReferenceCodePanel
                referenceCode={referenceCode}
                isSaving={isSaving}
                canSave={elements.length > 0}
                onSave={handleSave}
              />

              {/* Show error message if save failed */}
              {isError && (
                <div className='mt-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm'>
                  Failed to save sticker. Please try again.
                </div>
              )}
            </div>
          </div>

          {/* Right - Properties */}
          <PropertiesPanel
            selectedElement={selectedElement}
            elements={elements}
            selectedId={selectedId}
            onSelectElement={setSelectedId}
            onUpdateElement={updateElement}
            onDuplicateElement={duplicateElement}
            onDeleteElement={handleDelete}
            onMoveLayer={moveLayer}
          />
        </div>

        {/* Purchase CTA */}
        <div className='mt-8 text-center'>
          <Button
            onClick={handlePurchase}
            disabled={elements.length === 0}
            className='bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-8 py-4 text-lg font-semibold rounded-xl disabled:opacity-50'
          >
            Continue to Purchase →
          </Button>
          <p className='mt-2 text-white/50 text-sm'>
            {referenceCode
              ? `Reference: ${referenceCode}`
              : "Design will be attached to your Smart QR Sticker"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StickerEditor;
