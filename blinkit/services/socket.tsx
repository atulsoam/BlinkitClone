// services/socket.ts

import io, { Socket } from "socket.io-client";
import { SOCKETURL } from "@/services/config";

let socketInstance: Socket | null = null;

export const getSocketInstance = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKETURL, {
      transports: ["websocket"],
      withCredentials: false,
    });
  }
  return socketInstance;
};
