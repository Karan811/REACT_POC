import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

export default function PrinterStatus() {
  const [status, setStatus] = useState("Checking...");
  const [name, setName] = useState("");
  let stompClient = null;

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/printer-status", (message) => {
         setStatus(message.body);
        setName(message.name);
      });
    });

    return () => {
      if (stompClient) stompClient.disconnect();
    };
  }, []);

  const handlePrint = async () => {
    const response = await fetch("http://localhost:8080/api/v1/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify("ababababababsqwkdjwlfkajflakfjaflkwejf") // Example ZPL
    });

    const result = await response.text();
    alert(result);
  };

  return (
    <div>
      <h3>Printer Status: {status}</h3>
    
        <button onClick={handlePrint}>Print Test Label</button>
      
    </div>
  );
}
