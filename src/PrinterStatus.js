import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import "./PrinterStatus.css";

export default function PrinterStatus() {
  const [status, setStatus] = useState("Checking...");
  const [printers, setPrinters] = useState([]);
  const stompClientRef = useRef(null);
  const [zplTemplate, setZplTemplate] = useState(null);
const [loadingZpl, setLoadingZpl] = useState(false);
const [previewing, setPreviewing] = useState(false);
  const printRef = useRef();
  const cpcl = `! 0 200 200 210 1
  LINE 20 20 180 20 2
  TEXT 4 0 30 40 Hello
  FORM
  PRINT`;
    const zpl = `^XA
  ^FO50,50^A0N,40,40^FDTest Label^FS
  ^XZ`;
  
  useEffect(() => {
    const socket = new SockJS("http://localhost:8089/ws");
    const client = over(socket);
  
    client.connect({}, () => {
      client.subscribe("/topic/printer-status", (message) => {
        try {
          const data = JSON.parse(message.body);
          if (Array.isArray(data)) {
            console.log(data);
            setPrinters(data); // Set list of printers
            console.log(data);
            setStatus("Success");
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

 

  
  const handlePrint = async () => {
    setLoadingZpl(true);
    try {
      const response = await fetch("http://localhost:8089/api/v1/print", {
        method: "GET",
        // GET usually shouldn't include Content-Type; backend should return text/plain
      });
  
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch ZPL: ${response.status} ${errText}`);
      }
  
      const zpl = await response.text();
      setZplTemplate(zpl);
      alert("ZPL fetched from backend and saved for preview.");
      // console.log("ZPL:", zpl);
    } catch (err) {
      console.error("handlePrint error:", err);
      alert("Error fetching ZPL: " + err.message);
    } finally {
      setLoadingZpl(false);
    }
  };
  
  // Use stored ZPL to call Labelary and open preview (PNG)
  const handleZplPreview = async () => {
    if (!zplTemplate) {
      alert("No ZPL available. Click 'Fetch ZPL' first.");
      return;
    }
  
    setPreviewing(true);
    try {
      const response = await fetch("https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Labelary accepts raw ZPL; many clients use this
          Accept: "image/png"
        },
        body: zplTemplate
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
        const txt = await response.text();
        console.error("Labelary error:", response.status, txt);
        alert("Failed to render label preview: " + response.status);
      }
    } catch (err) {
      console.error("ZPL preview failed:", err);
      alert("ZPL preview failed: " + err.message + ". If you see CORS errors, proxy via backend.");
    } finally {
      setPreviewing(false);
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
              <button onClick={handlePrint} disabled={loadingZpl}>
               {loadingZpl ? "Fetching ZPL..." : "Fetch ZPL (from backend)"}
              </button>

              <button onClick={handleZplPreview} disabled={!zplTemplate || previewing}>
                {previewing ? "Previewing..." : "Preview ZPL"}
              </button>
        {/* handlePrint handleZplPreview*/}
      </div>

    
     
    </div>
  );
}
