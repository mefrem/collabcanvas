import { useCallback, useRef } from "react";
import { updateCursorPosition } from "../services/cursorService";
import { CURSOR_UPDATE_THROTTLE } from "../utils/constants";

export const useCursors = (userId: string, userName: string) => {
  const lastUpdateRef = useRef(0);

  const throttledUpdateCursor = useCallback(
    (x: number, y: number) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < CURSOR_UPDATE_THROTTLE) {
        return;
      }

      lastUpdateRef.current = now;
      updateCursorPosition(userId, userName, x, y);
    },
    [userId, userName]
  );

  return throttledUpdateCursor;
};
