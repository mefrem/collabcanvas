import { Group, Circle, Text } from "react-konva";
import { useCollaboration } from "../../contexts/CollaborationContext";
import { useAuth } from "../../contexts/AuthContext";
import { getUserColor } from "../../utils/canvasUtils";

export const MultipleCursors = () => {
  const { cursors } = useCollaboration();
  const { currentUser } = useAuth();

  return (
    <>
      {Object.values(cursors).map((cursor) => {
        // Don't render current user's cursor
        if (cursor.userId === currentUser?.uid) return null;

        const userColor = getUserColor(cursor.userId);

        return (
          <Group key={cursor.userId} x={cursor.x} y={cursor.y}>
            <Circle
              radius={6}
              fill={userColor}
              strokeWidth={2}
              stroke="#ffffff"
            />
            <Text
              text={cursor.userName}
              x={10}
              y={-5}
              fontSize={12}
              fill={userColor}
              padding={4}
            />
          </Group>
        );
      })}
    </>
  );
};
