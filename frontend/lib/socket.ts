import { io } from "socket.io-client";

const socket = io("https://realtime-feed-app.onrender.com", {
  transports: ["websocket"],
});

export default socket;