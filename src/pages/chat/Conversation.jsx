import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Conversation({ onSelectUser = () => {} }) {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

 const getPreview = (msg) => {
  if (!msg) return "Aucun message";

  const content = msg.content || "";

  // AUDIO
  if (
    msg.type === "audio" ||
    content.includes(".webm") ||
    content.includes("audios")
  ) {
    return "🎤 Audio";
  }

  // IMAGE
  if (
    msg.type === "image" ||
    content.match(/\.(jpg|jpeg|png|gif|webp)$/)
  ) {
    return "📷 Image";
  }

  // VIDEO
  if (
    msg.type === "video" ||
    content.match(/\.(mp4|webm|ogg)$/)
  ) {
    return "🎥 Vidéo";
  }

  return content || "Message";
};

  // ================= LOAD =================
  const load = async () => {
    //console.log("📥 LOAD CONVERSATIONS");

    try {
      const res = await api.get("/conversations");

      console.log("📦 DATA:", res.data);

      setConversations(res.data);

      // 🔥 IMPORTANT : DELIVERED depuis la liste
      res.data.forEach(async (conv) => {
        if (conv.unread > 0) {
          console.log("📦 SEND DELIVERED:", conv.id);

          try {
            await api.post(`/messages/delivered/${conv.id}`);
            console.log("✔ delivered OK:", conv.id);
          } catch (err) {
            console.log("❌ delivered error:", conv.id);
          }
        }
      });

    } catch (err) {
      console.error("❌ LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 🔥 AUTO REFRESH (comme WhatsApp)
  useEffect(() => {
    const interval = setInterval(() => {
      load();
      //console.log("🔄 REFRESH CONVERSATIONS");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ================= OPEN CHAT =================
  const openChat = (conv, other) => {
    console.log("💬 OPEN CHAT:", conv.id);

    onSelectUser(other.id);

    // reset unread UI
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id ? { ...c, unread: 0 } : c
      )
    );
  };

  // ================= FILTER =================
  const filtered = conversations.filter((c) => {
    const other = c.user1_id === user.id ? c.user2 : c.user1;

    return `${other.first_name} ${other.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  // ================= TICK =================
  const getTick = (msg) => {
    if (!msg) {
    //  console.log("⚠️ NO MESSAGE");
      return null;
    }

    // console.log("📌 TICK CHECK:", {
    //   id: msg.id,
    //   delivered: msg.delivered_at,
    //   read: msg.read_at,
    // });

    if (msg.read_at) {
      return { icon: "✔✔", color: "#00f5ff" }; // bleu
    }

    if (msg.delivered_at) {
      return { icon: "✔✔", color: "#9ca3af" }; // gris
    }

    return { icon: "✔", color: "#d1d5db" }; // envoyé
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* SEARCH */}
      <input
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 10,
          margin: 10,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      />

      {/* LIST */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.map((conv) => {
          const other =
            conv.user1_id === user.id ? conv.user2 : conv.user1;

          // 🔥 fallback sécurisé
          const msg =
            conv.last_message ||
            conv.messages?.at(-1) ||
            null;

          const tick = getTick(msg);

          //console.log("🔁 RENDER:", conv.id);

          return (
            <div
              key={conv.id}
              onClick={() => openChat(conv, other)}
              style={{
                display: "flex",
                padding: 12,
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                alignItems: "center",
              }}
            >
              {/* AVATAR */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#2563eb",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {other.first_name?.[0]}
              </div>

              {/* CONTENT */}
              <div style={{ flex: 1, marginLeft: 10 }}>

                {/* NAME + TIME */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <b>{other.first_name}</b>

                  <small>
                    {msg?.created_at &&
                      new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </small>
                </div>

                {/* MESSAGE + STATUS */}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#555" }}>
                    {getPreview(msg)}
                  </span>

                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>

                    {/* TICK */}
                    {tick && (
                      <span style={{ color: tick.color, fontSize: 12 }}>
                        {tick.icon}
                      </span>
                    )}

                    {/* UNREAD */}
                    {conv.unread > 0 && (
                      <span
                        style={{
                          background: "#22c55e",
                          color: "#fff",
                          borderRadius: 20,
                          padding: "2px 8px",
                          fontSize: 12,
                        }}
                      >
                        {conv.unread}
                      </span>
                    )}

                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ================= STYLE =================
const styles = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#f5f6f8",
  },
  search: {
    padding: 10,
    margin: 10,
    border: "1px solid #ddd",
    borderRadius: 8,
  },
  list: {
    flex: 1,
    overflowY: "auto",
  },
  card: {
    display: "flex",
    padding: 12,
    margin: "8px 10px",
    background: "#fff",
    borderRadius: 10,
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  msg: {
    fontSize: 13,
    color: "#555",
  },
  badge: {
    background: "#22c55e",
    color: "#fff",
    borderRadius: 20,
    padding: "2px 8px",
    fontSize: 12,
  },
};