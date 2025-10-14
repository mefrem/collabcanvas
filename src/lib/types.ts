import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
}

export interface CanvasObject {
  id: string;
  type: "rectangle" | "circle" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  zIndex: number;
  text?: string;
  fontSize?: number;
  createdBy: string;
  createdAt: Timestamp;
  lastModifiedBy: string;
  lastModified: Timestamp;
}

export interface CursorPosition {
  userId: string;
  userName: string;
  x: number;
  y: number;
  lastUpdate: number;
}

export interface Presence {
  userId: string;
  userName: string;
  online: boolean;
  lastSeen: number;
}

export interface Canvas {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Timestamp;
  lastModified: Timestamp;
}

export type ShapeType = "rectangle" | "circle" | "text";
export type ToolType = "select" | "rectangle" | "circle" | "text" | "pan";
