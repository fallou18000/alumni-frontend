import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const token = localStorage.getItem("token");

console.log("🔑 TOKEN:", token);

const echo = new Echo({
  broadcaster: "pusher",
  key: "df7c4516b27931d71c95",
  cluster: "eu",
  forceTLS: true,

  authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",

  auth: {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    },
  },

  enabledTransports: ["ws", "wss"], // 🔥 important debug
});

export default echo;