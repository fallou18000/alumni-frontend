import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";


export default function Chat({ userId: propUserId }) {
  const params = useParams();
  const userId = propUserId || params.userId;

  const user = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [content, setContent] = useState("");

  const bottomRef = useRef(null);
  const isInChatRef = useRef(false);
  const [file, setFile] = useState(null);
const [recording, setRecording] = useState(false);
const mediaRecorderRef = useRef(null);
const chunksRef = useRef([]);
const [menuId, setMenuId] = useState(null);
const [audioPreview, setAudioPreview] = useState(null);
const [zoomImg, setZoomImg] = useState(null);
const [previewMsg, setPreviewMsg] = useState(null);

const getImageUrl = (msg) => {
  if (!msg) return "";

  const path = msg.file_path || msg.content;

  if (!path) return "";

  // déjà URL complète
  if (path.startsWith("http")) return path;

  // Laravel storage fix
  return `http://127.0.0.1:8000/storage/${path}`;
};


const getMediaUrl = (msg) => {
  if (!msg) return "";

  const raw = msg.file_path || msg.content;

  if (!raw) return "";

  if (raw.startsWith("http")) return raw;

  return `http://127.0.0.1:8000/storage/${raw}`;
};

  // ================= LOAD =================
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      console.log("📥 LOAD CHAT START");

      const res = await api.get(`/conversation/${userId}`);

      setConversation(res.data.conversation);
      setMessages(res.data.messages);
      setChatUser(res.data.user);

      console.log("📦 conversation:", res.data.conversation.id);
      console.log("📦 messages:", res.data.messages.length);
    };

    load();
  }, [userId]);

  // ================= ENTER / LEAVE =================
  useEffect(() => {
    if (!conversation) return;

    const enter = async () => {
      isInChatRef.current = true;

      console.log("🔥 ENTER CHAT =", conversation.id);

      await api.post(`/chat/enter/${conversation.id}`);
      console.log("📡 enterChat sent");
    };

    const leave = async () => {
      isInChatRef.current = false;

      console.log("❌ LEAVE CHAT =", conversation.id);

      await api.post(`/chat/leave/${conversation.id}`);
      console.log("📡 leaveChat sent");
    };

    enter();

    return () => {
      leave();
    };
  }, [conversation]);

  // ================= REALTIME =================
  useEffect(() => {
    if (!conversation || !window.Echo) return;

    console.log("🔌 Echo join:", conversation.id);

    const channel = window.Echo.private(`conversation.${conversation.id}`);

    const handler = (e) => {
      console.log("📩 NEW MESSAGE:", e.message);

      setMessages((prev) => [...prev, e.message]);

      // 🔥 delivered uniquement en realtime
      api.post("/messages/delivered-single", {
        message_id: e.message.id,
      }).then(() => {
        console.log("✔ delivered single:", e.message.id);
      });
    };

    channel.listen(".message.sent", handler);

    return () => {
      console.log("🔌 leave Echo:", conversation.id);
      window.Echo.leave(`conversation.${conversation.id}`);
    };
  }, [conversation]);

  // ================= READ =================
  useEffect(() => {
    if (!conversation) return;

    const markRead = async () => {
      if (document.visibilityState !== "visible") {
        console.log("👁 hidden → skip read");
        return;
      }

      console.log("👁 READ:", conversation.id);

      await api.post(`/messages/read/${conversation.id}`);

      console.log("✔ read updated");
    };

    markRead();
  }, [conversation, messages]);

  // ================= SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
  const handleClick = () => {
    setMenuId(null);
  };

  window.addEventListener("click", handleClick);

  return () => window.removeEventListener("click", handleClick);
}, []);

  // ================= SEND =================

  const sendMedia = async () => {
  if (!file || !conversation) return;

  const formData = new FormData();
  formData.append("conversation_id", conversation.id);
  formData.append("file", file);

  const res = await api.post("/messages/media", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  setMessages((prev) => [...prev, res.data]);
  setFile(null);
   setPreviewMsg(null);
};

  const sendMessage = async () => {
    if (!content.trim() || !conversation) return;

    console.log("📤 SENDING:", content);

    const res = await api.post("/messages/send", {
      conversation_id: conversation.id,
      content,
    });

    setMessages((prev) => [...prev, res.data]);
    setContent("");

    console.log("✔ sent:", res.data.id);
  };

const cancelRecording = () => {
  cancelRef.current = true; // si tu veux sécurité

  mediaRecorderRef.current?.stop();
  chunksRef.current = [];

  setRecording(false);
};
  
const toggleRecording = async () => {
  if (!conversation) return;

  const convId = conversation.id; // ✅ FIX IMPORTANT

  if (!recording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      if (!chunksRef.current.length) return;

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("conversation_id", convId);
      formData.append("audio", blob, "voice.webm"); // ⚠️ important backend

      const res = await api.post("/messages/audio", formData);

      setMessages((prev) => [...prev, res.data]);
    };

    mediaRecorderRef.current.start();
    setRecording(true);

  } else {
    mediaRecorderRef.current.stop();
    setRecording(false);
  }
};

const deleteForMe = async (id) => {
  await api.delete(`/messages/${id}?mode=me`);
  setMessages((prev) => prev.filter((m) => m.id !== id));
};

const deleteForAll = async (id) => {
  await api.delete(`/messages/${id}?mode=everyone`);

  setMessages((prev) =>
    prev.map((m) =>
      m.id === id
        ? { ...m, content: "Ce message a été supprimé", deleted: true }
        : m
    )
  );
};

const sendAudio = async () => {
  if (!audioPreview) return;

  const formData = new FormData();
formData.append("conversation_id", conversation.id);
formData.append("audio", blob, "voice.webm");

const res = await api.post("/messages/audio", formData);
  setMessages((prev) => [...prev, res.data]);
  setAudioPreview(null);
};

const cancelAudio = () => {
  setAudioPreview(null);
};

  // ================= STATUS =================
  const getStatus = (msg) => {
    if (msg.sender_id !== user.id) return null;

    if (msg.read_at) return "✔✔ ";   // vu
    if (msg.delivered_at) return "✔✔"; // livré
    return "✔"; // envoyé
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* HEADER */}
      <div style={{ padding: 10, background: "#2563eb", color: "#fff" }}>
        {chatUser?.first_name}
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
        {[...messages, previewMsg].filter(Boolean).map((msg) => {
          console.log(msg);
       const isMe = msg.sender_id === user.id;
const audioSrc = msg.file_path || msg.content;

const isAudio =
  msg.type === "audio" ||
  (audioSrc && audioSrc.includes("/audios/"));
  

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: 8,
              }}
            >
             <div
  style={{
    background: isMe ? "#2563eb" : "#f3f4f6",
    color: isMe ? "#fff" : "#000",
    padding: 10,
    borderRadius: 12,
    maxWidth: "70%",
    position: "relative",
  }}
  onMouseEnter={(e) => {
    const el = e.currentTarget.querySelector(".check");
    if (el) el.style.opacity = 1;
  }}
  onMouseLeave={(e) => {
    const el = e.currentTarget.querySelector(".check");
    if (el) el.style.opacity = 0;
  }}
>


  {msg.deleted && (
  <div style={{ fontStyle: "italic", opacity: 0.6, textAlign: "center" }}>
    Ce message a été supprimé
  </div>
)}

  {/* CONTENT */}
<div
  style={{
    fontStyle: msg.deleted ? "italic" : "normal",
    opacity: msg.deleted ? 0.6 : 1,
    textAlign: msg.deleted ? "center" : "left"
  }}
>
{/* IMAGE */}
{(
  msg.type === "image" ||
  (msg.file_path || msg.content)?.match(/\.(jpg|jpeg|png|gif)$/)
) && !msg.deleted && (
  <img
    src={
      msg.local
        ? URL.createObjectURL(msg.file) // 🔥 preview local
        : getMediaUrl(msg)              // 🔥 image backend
    }
    onClick={() =>
      setZoomImg(
        msg.local
          ? URL.createObjectURL(msg.file)
          : getMediaUrl(msg)
      )
    }
    style={{
      maxWidth: 200,
      borderRadius: 10,
      objectFit: "cover",
      cursor: "pointer",
      opacity: msg.local ? 0.6 : 1
    }}
  />
)}

{/* AUDIO */}
{(msg.type === "audio" || (msg.content || "").includes("audios") || (msg.content || "").includes(".webm")) && !msg.deleted && (
  <audio controls style={{ width: 200 }}>
    <source src={getMediaUrl(msg)} type="audio/webm" />
  </audio>
)}


{/* TEXT */}
{!msg.deleted &&
 msg.type !== "image" &&
 msg.type !== "audio" &&
 !((msg.content || "").includes("http") || msg.file_path) && (
  <span>{msg.content}</span>
)}
</div>

  {/* ✔ BUTTON */}
<span
  className="check"
  style={{
    position: "absolute",
    top: 5,
    right: 6,
    opacity: menuId === msg.id ? 1 : 0,
    transition: "0.2s",
    cursor: "pointer",
    fontSize: 14
  }}
  onClick={(e) => {
    e.stopPropagation();
    setMenuId(msg.id);
  }}
>
  ⋮
</span>

  {/* MENU */}
 {menuId === msg.id && (
  <div
    onClick={(e) => e.stopPropagation()}
    style={{
      position: "absolute",
      top: 25,
      right: 0,
      background: "#fff",
      borderRadius: 10,
      boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
      zIndex: 10
    }}
  >

    {/* 🔥 TOUJOURS DISPONIBLE */}
    <div
      onClick={() => deleteForMe(msg.id)}
      style={{ padding: 10, color: "#ef4444" }}
    >
      Supprimer pour moi
    </div>

    {/* 🔥 SEULEMENT SI C'EST TON MESSAGE */}
    {isMe && (
      <div
        onClick={() => deleteForAll(msg.id)}
        style={{ padding: 10, color: "#ef4444" }}
      >
        Supprimer pour tous
      </div>
    )}

    <div
      onClick={() => setMenuId(null)}
      style={{ padding: 10, color: "#000" }}
    >
      Annuler
    </div>

  </div>
)}

  {/* STATUS */}
  {isMe && (
    <div style={{ fontSize: 10, textAlign: "right" }}>
      
      {getStatus(msg)}
    </div>
  )}
</div>
            </div>
          );
        })}

        <div ref={bottomRef} />
        
        {/* IMAGE ZOOM FULLSCREEN */}
{zoomImg && (
  <div
    onClick={() => setZoomImg(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}
  >
    <img
      src={zoomImg}
      style={{
        maxWidth: "90%",
        maxHeight: "90%",
        borderRadius: 10
      }}
    />
  </div>
)}


      </div>

      {/* INPUT */}
      {file && (
  <div style={{
    padding: 10,
    borderTop: "1px solid #eee",
    background: "#fff"
  }}>
    
    {file.type.startsWith("image/") && (
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        style={{
          width: 420,
          height: 220,
          objectFit: "cover",
          borderRadius: 10
        }}
      />
    )}

    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
      
      <button
        onClick={() => setFile(null)}
        style={{
          background: "#ef4444",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: 6
        }}
      >
        Annuler
      </button>

      <button
        onClick={sendMedia}
        style={{
          background: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: 6
        }}
      >
        Envoyer
      </button>

    </div>
  </div>
)}
   <div style={{ display: "flex", padding: 10, gap: 6, alignItems: "center" }}>
  

  {/* FILE */}
 <label style={styles.blueIcon}>
  📷
 <input
  type="file"
  accept="image/*,video/*"
  onChange={(e) => {
    const selected = e.target.files[0];
    setFile(selected);

    setPreviewMsg({
      id: "preview",
      type: selected.type.startsWith("image") ? "image" : "video",
      local: true,
      file: selected
    });
  }}
  style={{ display: "none" }}
/>
</label>

  {/* TEXT */}
  <input
    value={content}
    onChange={(e) => setContent(e.target.value)}
    style={{ flex: 1, padding: 10, borderRadius: 20 }}
  />

  {/* AUDIO BUTTON BLEU */}
  {/* AUDIO BUTTON */}
{/* BOUTON PRINCIPAL */}
{file ? (
  // 📷 image sélectionnée
  <button onClick={sendMedia} style={styles.blueIcon}>
    ➤
  </button>

) : content ? (
  //  texte écrit
  <button onClick={sendMessage} style={styles.blueIcon}>
    ➤
  </button>

) : (
  // 🎤 micro
  <button
    onClick={toggleRecording}
    style={{
      ...styles.blueIcon,
      background: recording ? "#ef4444" : "#2563eb"
    }}
  >
    {recording ? "⏹️" : "🎤"}
  </button>
)}
</div>
    </div>
  );
}

// ================= STYLE =================
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f3f4f6",
  },

  header: {
    padding: 14,
    background: "linear-gradient(135deg,#1d4ed8,#2563eb)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#fff",
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 15,
  },

  chatBox: {
    flex: 1,
    padding: 12,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  bubble: {
    padding: 10,
    borderRadius: 16,
    maxWidth: "70%",
    position: "relative",
    overflow: "visible",
  },

  author: {
    fontSize: 11,
    opacity: 0.5,
    marginBottom: 3,
  },

  deleted: {
    fontSize: 11,
    color: "#9ca3af",
    fontStyle: "italic",
    opacity: 0.6,
    textAlign: "center",
  },

  deletedWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },

  media: {
    maxWidth: 220,
    borderRadius: 12,
  },

  tick: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.25)",
  },

  // MENU EN BAS
  menu: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: 6,
    minWidth: 200,
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    zIndex: 9999,
  },

  itemRed: {
    padding: 14,
    fontSize: 15,
    color: "#ef4444",
    borderBottom: "1px solid #eee",
  },

  cancel: {
    padding: 14,
    fontSize: 14,
    color: "#6b7280",
  },

  inputBar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 10,
    background: "#fff",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ddd",
  },

  blueIcon: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: 20,
  },

  send: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "none",
    background: "#2563eb",
    color: "#fff",
  },
  footer: {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  marginTop: 5,
  fontSize: 11,
  opacity: 0.7,
},

time: {
  fontSize: 10,
  opacity: 0.6,
},
};