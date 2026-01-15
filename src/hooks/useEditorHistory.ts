// hooks/useEditorHistory.ts

import { useState, useCallback } from "react";

import { MAX_HISTORY } from "@/mainComponent/Features/StickerEditor.contants";
import { EditorElement } from "@/types/stickerEditor.types";

export const useEditorHistory = () => {
  const [history, setHistory] = useState<
    { elements: EditorElement[]; selectedId: string | null }[]
  >([{ elements: [], selectedId: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushHistory = useCallback(
    (elements: EditorElement[], selectedId: string | null) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push({ elements, selectedId });
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        return newHistory;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
    },
    [historyIndex]
  );

  const undo = useCallback(() => {
    if (!canUndo) return null;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    return history[newIndex];
  }, [canUndo, history, historyIndex]);

  const redo = useCallback(() => {
    if (!canRedo) return null;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    return history[newIndex];
  }, [canRedo, history, historyIndex]);

  return {
    canUndo,
    canRedo,
    pushHistory,
    undo,
    redo,
  };
};
