import React, { useRef } from "react";

function PrintableLabel() {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .label {
              width: 4in;
              height: 6in;
              border: 2px dashed #000;
              padding: 20px;
              box-sizing: border-box;
            }
            .section {
              margin-bottom: 20px;
            }
            .barcode {
              font-family: 'Libre Barcode 39', monospace;
              font-size: 48px;
              letter-spacing: 2px;
            }
          </style>
          <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet">
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div>
      <h3>Microsoft PDF Printer Demo</h3>
      <button onClick={handlePrint}>Print Label to PDF</button>

      <div style={{ display: "none" }}>
        <div ref={printRef}>
          <div className="label">
            <div className="section">
              <strong>Intershipping, Inc.</strong><br />
              1000 Shipping Lane<br />
              Shelbyville TN 38102<br />
              United States
            </div>

            <div className="section">
              <strong>To:</strong><br />
              John Doe<br />
              100 Main Street<br />
              Springfield TN 39021<br />
              United States
            </div>

            <div className="section">
              <div className="barcode">*12345678*</div>
              <small>Tracking #: 12345678</small>
            </div>

            <div className="section">
              <strong>Ref1:</strong> F00B47<br />
              <strong>Ref2:</strong> BL4H8<br />
              <strong>Center:</strong> X34B-1<br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintableLabel;
