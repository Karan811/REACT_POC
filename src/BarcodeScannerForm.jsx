import React, { useState, useRef } from "react";

export default function BarcodeScannerForm() {
  const [barcode, setBarcode] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setBarcode(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Scanned Barcode:", barcode);
      // Do something with barcode, like submit to backend
      alert(`Scanned package id: ${barcode}`);
      setBarcode(""); // Clear after scan
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Scan a Barcode</h2>
      <input
        type="text"
        ref={inputRef}
        value={barcode}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoFocus
        placeholder="Scan barcode here"
        style={{
          padding: "10px",
          fontSize: "1.2rem",
          width: "300px",
        }}
      />
    </div>
  );
}
