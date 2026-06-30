import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "http://localhost:8080/ws";

let client = null;
let subscriberCount = 0;

/**
 * One shared STOMP-over-SockJS connection for the whole app. Faculty status
 * and lab status updates are broadcast here the moment an Admin, Faculty
 * member, or Lab Incharge saves a change — no polling needed.
 *
 * Returns an unsubscribe function; call it from a useEffect cleanup.
 */
export function subscribeToTopic(topic, onMessage) {
  if (!client) {
    client = new Client({
      webSocketFactory: () => new SockJS(WS_BASE_URL),
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });
    client.activate();
  }

  subscriberCount += 1;
  let stompSubscription = null;

  const trySubscribe = () => {
    stompSubscription = client.subscribe(topic, (message) => {
      try {
        onMessage(JSON.parse(message.body));
      } catch {
        // Ignore malformed payloads rather than crash the UI.
      }
    });
  };

  if (client.connected) {
    trySubscribe();
  } else {
    client.onConnect = trySubscribe;
  }

  return () => {
    if (stompSubscription) stompSubscription.unsubscribe();
    subscriberCount -= 1;
    if (subscriberCount <= 0 && client) {
      client.deactivate();
      client = null;
    }
  };
}
