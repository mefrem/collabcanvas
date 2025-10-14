import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { CanvasObject, ToolType } from "../lib/types";
import { subscribeToObjects } from "../services/canvasService";
import { useAuth } from "./AuthContext";

interface CanvasContextType {
  objects: CanvasObject[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  currentTool: ToolType;
  setCurrentTool: (tool: ToolType) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) throw new Error("useCanvas must be used within CanvasProvider");
  return context;
};

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentTool, setCurrentTool] = useState<ToolType>("select");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToObjects((newObjects) => {
      setObjects(newObjects);
    });

    return unsubscribe;
  }, [currentUser]);

  return (
    <CanvasContext.Provider
      value={{
        objects,
        selectedIds,
        setSelectedIds,
        currentTool,
        setCurrentTool,
        zoom,
        setZoom,
        pan,
        setPan,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
