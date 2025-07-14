import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import "./PrinterStatus.css";

export default function PrinterStatus() {
  const [status, setStatus] = useState("Checking...");
  const [printers, setPrinters] = useState([]);
  const stompClientRef = useRef(null);
  const printRef = useRef();

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = over(socket);
  
    client.connect({}, () => {
      client.subscribe("/topic/printer-status", (message) => {
        try {
          const data = JSON.parse(message.body);
          if (Array.isArray(data)) {
            setPrinters(data); // Set list of printers
            console.log(data);
          } else {
            // fallback if single printer info sent
            setPrinters([{ name: data.name || message.body }]);
          }
        } catch (e) {
          console.error("Failed to parse printer status:", e);
        }
      });
    });
  
    stompClientRef.current = client;
  
    return () => {
      if (stompClientRef.current) stompClientRef.current.disconnect();
    };
  }, []);

  const cpcl = `! 0 200 200 400 1\r
  TEXT 4 0 30 20 VIMENPAQ\r
  LINE 30 40 250 40 2\r
  TEXT 2 0 30 55 SHIPPING LABEL\r
  TEXT 1 0 30 80 Santo Domingo, DR\r
  TEXT 1 0 30 100 Package ID: VMQ123456789DR\r
  BARCODE 128 1 1 50 30 130 VMQ123456789DR\r
  TEXT 0 0 30 190 Track: www.vimenpaq.com\r
  PRINT\r
  `;

  const zpl = `^XA
^CI28

^FX === Header Section ===
^CF0,60
^FO150,30^FB600,1,0,C^FDVimenpaq^FS

^CF0,30
^FO100,100^FB600,1,0,C^FDAv. Winston Churchill #95^FS
^FO100,140^FB600,1,0,C^FDSanto Domingo, Distrito Nacional^FS
^FO100,180^FB600,1,0,C^FDDominican Republic^FS

^FO50,220^GB700,3,3^FS

^FX === Recipient Section ===
^CFA,30
^FO50,250^FDJohn Doe^FS
^FO50,290^FD123 Calle Central^FS
^FO50,330^FDSantiago, RD 51000^FS
^FO50,370^FDDominican Republic^FS

^FO50,410^GB700,3,3^FS

^FX === Barcode Section ===
^BY3,2,100
^FO100,440^BCN,100,Y,N,N
^FDVMQ123456789DR^FS
^FO100,560^FDTracking #: VMQ123456789DR^FS

^FO50,600^GB700,3,3^FS

^FX === Reference and Center Info ===
^CF0,30
^FO50,630^FDRef1: INV-87456^FS
^FO50,670^FDRef2: BOX-45A^FS
^FO50,710^FDCenter: SDQ-WH1^FS

^XZ`;

  
  const handlePrint = async () => {
    const response = await fetch("http://localhost:8080/api/v1/print", {
      method: "POST",
      headers: { "Content-Type": "text/plain"},
      body: cpcl
    });

    const result = await response.text();
    alert(result);
  };

  const handleZplPreview = async () => {
      
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
     
    </div>

    {/* Printer List Panel */}
    <div className="printers-list">
      <h3>🧾 Available Printers</h3>
      {printers.length === 0 ? (
        <p className="no-printers">No printers found.</p>
      ) : (
        <ul className="printer-list">
          {printers.map((printer, index) => (
            <li key={index} className="printer-item">
              <strong>{printer.name}</strong>
              <span className="zpl-support">
                {printer.supportsZPL === "true" ? " ZPL Supported" : " ZPL Unsupported"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>


      <div className="print-panel">
        <h3>🧾 Label Preview</h3>
        <button onClick={handlePrint}>Print Test Label</button>
        {/* handlePrint handleZplPreview*/}
      </div>

    
     
    </div>
  );
}
