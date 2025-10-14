import { useCollaboration } from "../../contexts/CollaborationContext";
import { getUserColor } from "../../utils/canvasUtils";

export const OnlineUsersList = () => {
  const { onlineUsers } = useCollaboration();

  const activeUsers = Object.values(onlineUsers).filter((user) => user.online);

  return (
    <div className="fixed top-16 right-4 bg-white shadow-lg rounded-lg p-4 z-10 min-w-[200px]">
      <h3 className="font-semibold mb-2 text-sm">
        Online Users ({activeUsers.length})
      </h3>
      <ul className="space-y-2">
        {activeUsers.map((user) => {
          const userColor = getUserColor(user.userId);

          return (
            <li key={user.userId} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: userColor }}
              ></div>
              <span className="text-sm">{user.userName}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
