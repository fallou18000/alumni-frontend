import { useState } from "react";
import Conversation from "./Conversation";
import Chat from "./Chat";

export default function AppLayout() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  // 🔥 NOUVEAU → permet de refresh Conversation
  const [refreshFlag, setRefreshFlag] = useState(0);

  const handleMessageSent = () => {
    setRefreshFlag((prev) => prev + 1); // trigger reload
  };

  return (
    <div style={styles.wrapper}>

      {/* LEFT = CONVERSATIONS */}
      <div style={styles.left}>
        <Conversation
          onSelectUser={setSelectedUserId}
          refreshFlag={refreshFlag} // 👈 important
        />
      </div>

      {/* RIGHT = CHAT */}
      <div style={styles.right}>
        {selectedUserId ? (
          <Chat
            userId={selectedUserId}
            onMessageSent={handleMessageSent} // 👈 important
          />
        ) : (
          <div style={styles.empty}>
            Sélectionne une conversation
          </div>
        )}
      </div>

    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
  },

  left: {
    width: 350,
    borderRight: "1px solid #ddd",
    background: "#f5f6f8",
  },

  right: {
    flex: 1,
    background: "#fff",
  },

  empty: {
    padding: 20,
    opacity: 0.5,
  },
};