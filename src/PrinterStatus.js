import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import "./PrinterStatus.css";

export default function PrinterStatus() {
  const [status, setStatus] = useState("Checking...");
  const [printerName, setPrinterName] = useState("");
  const stompClientRef = useRef(null);
  const printRef = useRef();

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = over(socket);
    client.connect({}, () => {
      client.subscribe("/topic/printer-status", (message) => {
        try {
          const data = JSON.parse(message.body);
          setStatus(data.status || message.body);
          setPrinterName(data.name || "");
        } catch(e) {
          setStatus(message.body);
        }
      });
    });
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) stompClientRef.current.disconnect();
    };
  }, []);

  const handlePrint = async () => {
    const response = await fetch("http://localhost:8080/api/v1/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify("^XA^FO50,50^A0N,40,40^FDHello, ZPL!^FS^XZ") // Example ZPL
    });

    const result = await response.text();
    alert(result);
  };

  const handleZplPreview = async () => {
    const zpl = `^XA
^CI28

^FX === Header Section ===
^CF0,60
^FO50,50^FDVimenpaq^FS
^CF0,30
^FO50,120^FDAv. Winston Churchill #95^FS
^FO50,160^FDSanto Domingo, Distrito Nacional^FS
^FO50,200^FDDominican Republic^FS

^FO40,240^GB700,3,3^FS

^FX === Recipient Section ===
^CFA,30
^FO50,280^FDJohn Doe^FS
^FO50,320^FD123 Calle Central^FS
^FO50,360^FDSantiago, RD 51000^FS
^FO50,400^FDDominican Republic^FS

^FO40,450^GB700,3,3^FS

^FX === Barcode Section ===
^BY3,2,120
^FO50,480^BCN,100,Y,N,N
^FDVMQ123456789DR^FS
^FO50,620^FDTracking #: VMQ123456789DR^FS

^FO40,670^GB700,3,3^FS

^FX === Reference and Center Info ===
^CF0,30
^FO50,700^FDRef1: INV-87456^FS
^FO50,740^FDRef2: BOX-45A^FS
^FO50,780^FDCenter: SDQ-WH1^FS

^CF0,120
^FO500,700^FD🇩🇴^FS

^XZ
`;
  
    const response = await fetch("https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: zpl
    });
  
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank"); // open preview in new tab
    } else {
      alert("Failed to render label preview");
      console.error(await response.text());
    }
  };
  

  const getStatusColor = () => {
    if (status.toLowerCase().includes("online")) return "#38A169"; // green
    if (status.toLowerCase().includes("offline")) return "#E53E3E"; // red
    return "#DD6B20"; // orange/unknown
  };

  return (
    <div className="printer-panel">
      <div className="status-card">
        <h2>🖨️ Printer Status</h2>
        <div className="status-info">
          <span
            className="status-indicator"
            style={{ backgroundColor: getStatusColor() }}
          ></span>
          <span>{status}</span>
        </div>
        {printerName && (
          <p><strong>Printer Name:</strong> {printerName}</p>
        )}
      </div>

      <div className="print-panel">
        <h3>🧾 Label Preview</h3>
        <button onClick={handleZplPreview}>Print Test Label</button>
        {/* handlePrint handleZplPreview*/}
      </div>

    
     
    </div>
  );
}
