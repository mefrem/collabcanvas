import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { CursorPosition, Presence } from "../lib/types";
import { subscribeToCursors, removeCursor } from "../services/cursorService";
import { subscribeToPresence, setPresence } from "../services/presenceService";
import { useAuth } from "./AuthContext";

interface CollaborationContextType {
  cursors: Record<string, CursorPosition>;
  onlineUsers: Record<string, Presence>;
}

const CollaborationContext = createContext<
  CollaborationContextType | undefined
>(undefined);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context)
    throw new Error(
      "useCollaboration must be used within CollaborationProvider"
    );
  return context;
};

export const CollaborationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { currentUser } = useAuth();
  const [cursors, setCursors] = useState<Record<string, CursorPosition>>({});
  const [onlineUsers, setOnlineUsers] = useState<Record<string, Presence>>({});

  useEffect(() => {
    if (!currentUser) return;

    // Set user as online
    setPresence(currentUser.uid, currentUser.displayName || "Anonymous", true);

    // Subscribe to all cursors
    const unsubscribeCursors = subscribeToCursors(setCursors);

    // Subscribe to presence
    const unsubscribePresence = subscribeToPresence(setOnlineUsers);

    // Cleanup on unmount
    return () => {
      removeCursor(currentUser.uid);
      setPresence(
        currentUser.uid,
        currentUser.displayName || "Anonymous",
        false
      );
      unsubscribeCursors();
    };
  }, [currentUser]);

  return (
    <CollaborationContext.Provider value={{ cursors, onlineUsers }}>
      {children}
    </CollaborationContext.Provider>
  );
};
