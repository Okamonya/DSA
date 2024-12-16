// socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 5000,
});

// Handle connection events
socket.on("connect", () => {
    console.log("Connected to the socket server!");
});

socket.on("disconnect", (reason) => {
    console.log("Disconnected from the socket server:", reason);
});

export default socket;
