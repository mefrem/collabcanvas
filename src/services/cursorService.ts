import { ref, set, onValue, off } from "firebase/database";
import { rtdb } from "../lib/firebase";
import type { CursorPosition } from "../lib/types";

export const updateCursorPosition = (
  userId: string,
  userName: string,
  x: number,
  y: number
) => {
  const cursorRef = ref(rtdb, `cursors/${userId}`);
  set(cursorRef, {
    userId,
    userName,
    x,
    y,
    lastUpdate: Date.now(),
  });
};

export const subscribeToCursors = (
  callback: (cursors: Record<string, CursorPosition>) => void
) => {
  const cursorsRef = ref(rtdb, "cursors");

  onValue(cursorsRef, (snapshot) => {
    const cursors = snapshot.val() || {};
    callback(cursors);
  });

  return () => off(cursorsRef);
};

export const removeCursor = (userId: string) => {
  const cursorRef = ref(rtdb, `cursors/${userId}`);
  set(cursorRef, null);
};
