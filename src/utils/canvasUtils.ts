// Utility functions for canvas operations and user colors

import type { CanvasObject } from "../lib/types";

export const isPointInRect = (
  px: number,
  py: number,
  rect: CanvasObject
): boolean => {
  return (
    px >= rect.x &&
    px <= rect.x + rect.width &&
    py >= rect.y &&
    py <= rect.y + rect.height
  );
};

export const getObjectsInSelection = (
  objects: CanvasObject[],
  selectionRect: { x: number; y: number; width: number; height: number }
): string[] => {
  return objects
    .filter((obj) => {
      return (
        obj.x >= selectionRect.x &&
        obj.x + obj.width <= selectionRect.x + selectionRect.width &&
        obj.y >= selectionRect.y &&
        obj.y + obj.height <= selectionRect.y + selectionRect.height
      );
    })
    .map((obj) => obj.id);
};

export const generateRandomColor = (): string => {
  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate consistent color for user based on their ID
export const getUserColor = (userId: string): string => {
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
  ];

  // Create a simple hash from userId to consistently get the same color
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return colors[Math.abs(hash) % colors.length];
};
