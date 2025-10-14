import React from "react";
import type { ToolType } from "../../lib/types";
import { useCanvas } from "../../contexts/CanvasContext";

export const CanvasToolbar = () => {
  const { currentTool, setCurrentTool } = useCanvas();

  const tools: { type: ToolType; label: string; icon: string }[] = [
    { type: "select", label: "Select", icon: "↖" },
    { type: "rectangle", label: "Rectangle", icon: "□" },
    { type: "circle", label: "Circle", icon: "○" },
    { type: "text", label: "Text", icon: "T" },
    { type: "pan", label: "Pan", icon: "✋" },
  ];

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex gap-2 z-10">
      {tools.map((tool) => (
        <button
          key={tool.type}
          onClick={() => setCurrentTool(tool.type)}
          className={`px-4 py-2 rounded transition-colors ${
            currentTool === tool.type
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          title={tool.label}
        >
          <span className="text-xl">{tool.icon}</span>
        </button>
      ))}
    </div>
  );
};
