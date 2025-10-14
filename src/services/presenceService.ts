import { ref, set, onValue, onDisconnect } from "firebase/database";
import { rtdb } from "../lib/firebase";
import type { Presence } from "../lib/types";

export const setPresence = (
  userId: string,
  userName: string,
  online: boolean
) => {
  const presenceRef = ref(rtdb, `presence/${userId}`);

  set(presenceRef, {
    userId,
    userName,
    online,
    lastSeen: Date.now(),
  });

  if (online) {
    onDisconnect(presenceRef).set({
      userId,
      userName,
      online: false,
      lastSeen: Date.now(),
    });
  }
};

export const subscribeToPresence = (
  callback: (users: Record<string, Presence>) => void
) => {
  const presenceRef = ref(rtdb, "presence");

  onValue(presenceRef, (snapshot) => {
    const users = snapshot.val() || {};
    callback(users);
  });

  return () => {};
};
