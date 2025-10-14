import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { CanvasObject } from "../lib/types";

const CANVAS_ID = "main"; // Single canvas for MVP
const objectsCollection = collection(db, "canvases", CANVAS_ID, "objects");

export const createObject = async (
  objectData: Omit<CanvasObject, "id" | "createdAt" | "lastModified">,
  userId: string
) => {
  const docRef = await addDoc(objectsCollection, {
    ...objectData,
    createdBy: userId,
    createdAt: serverTimestamp(),
    lastModifiedBy: userId,
    lastModified: serverTimestamp(),
  });
  return docRef.id;
};

export const updateObject = async (
  objectId: string,
  updates: Partial<CanvasObject>,
  userId: string
) => {
  const objectRef = doc(objectsCollection, objectId);
  await updateDoc(objectRef, {
    ...updates,
    lastModifiedBy: userId,
    lastModified: serverTimestamp(),
  });
};

export const deleteObject = async (objectId: string) => {
  const objectRef = doc(objectsCollection, objectId);
  await deleteDoc(objectRef);
};

export const subscribeToObjects = (
  callback: (objects: CanvasObject[]) => void
) => {
  const q = query(objectsCollection);

  return onSnapshot(q, (snapshot) => {
    const objects: CanvasObject[] = [];
    snapshot.forEach((doc) => {
      objects.push({ id: doc.id, ...doc.data() } as CanvasObject);
    });
    callback(objects);
  });
};
