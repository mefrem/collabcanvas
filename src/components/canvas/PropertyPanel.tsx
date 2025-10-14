import React from "react";
import { useCanvas } from "../../contexts/CanvasContext";
import { useAuth } from "../../contexts/AuthContext";
import { updateObject, deleteObject } from "../../services/canvasService";

export const PropertyPanel = () => {
  const { objects, selectedIds, setSelectedIds } = useCanvas();
  const { currentUser } = useAuth();

  // Don't show panel if no objects are selected
  if (selectedIds.length === 0) return null;

  const selectedObjects = objects.filter((obj) => selectedIds.includes(obj.id));

  const handleColorChange = (color: string) => {
    if (!currentUser) return;

    selectedIds.forEach((id) => {
      updateObject(id, { fill: color }, currentUser.uid);
    });
  };

  const handleDelete = () => {
    selectedIds.forEach((id) => deleteObject(id));
    setSelectedIds([]);
  };

  // Common color options
  const colors = [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#14b8a6", // Teal
    "#f97316", // Orange
    "#6366f1", // Indigo
    "#84cc16", // Lime
    "#6b7280", // Gray
    "#000000", // Black
  ];

  return (
    <div className="fixed bottom-4 left-4 bg-white shadow-lg rounded-lg p-4 z-10 min-w-[200px]">
      <h3 className="font-semibold mb-3 text-sm">
        Properties ({selectedIds.length} selected)
      </h3>

      <div className="space-y-3">
        {/* Color picker */}
        <div>
          <label className="block text-xs font-medium mb-2 text-gray-700">
            Color
          </label>
          <div className="grid grid-cols-6 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="w-full px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};
