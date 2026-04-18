import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useEffect } from "react";

export function useRealtime(refresh) {
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        client.subscribe("/topic/attendance", () => {
          refresh(); // 🔥 auto refresh UI
        });
      },
    });

    client.activate();

    return () => client.deactivate();
  }, [refresh]);
}