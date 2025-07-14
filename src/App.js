import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PrinterStatus from './PrinterStatus';
import BarcodeScannerForm from "./BarcodeScannerForm";
import './App.css'; 


function App() {
  return (
  <div>  
    <div className="panel">
    <h2>Printer</h2>
    <PrinterStatus />
  </div>
  
  <div className="panel">
    <h2>Scanner</h2>
    <BarcodeScannerForm />
  </div>
  </div>
     
    
  );
}

export default App;

// class App extends Component {
//   state = {
//   packages: [
//     {
//       id: 101,
//       trackingNumber: 'TRK123456789',
//       sender: 'Amazon Warehouse',
//       recipient: 'Alice Smith',
//       status: 'Delivered',
//       expectedDelivery: '2025-06-15'
//     },
//     {
//       id: 102,
//       trackingNumber: 'TRK987654321',
//       sender: 'Flipkart Hub',
//       recipient: 'Bob Johnson',
//       status: 'In Transit',
//       expectedDelivery: '2025-06-17'
//     },
//     {
//       id: 103,
//       trackingNumber: 'TRK555666777',
//       sender: 'eBay Dispatch',
//       recipient: 'Charlie Rose',
//       status: 'Lost',
//       expectedDelivery: '2025-06-12'
//     }
//   ]
// };

//   render() {
//     return (
//       <Router basename={process.env.PUBLIC_URL}>
//         <div className="App">
//           <header className="App-header">
//             <h1 className="App-title">🚨My Alerts Dashboard</h1>
//           </header>
//           <section className="alerts-section">
//             <printer/>
//           </section>
//           <section className="package-list">
//   <h2>📦 Package List</h2>
//   <div className="package-table">
//     {this.state.packages.map(pkg => (
//       <div className={`package-card ${pkg.status.toLowerCase()}`} key={pkg.id}>
//         <h3>{pkg.trackingNumber}</h3>
//         <p><strong>From:</strong> {pkg.sender}</p>
//         <p><strong>To:</strong> {pkg.recipient}</p>
//         <p><strong>Status:</strong> {pkg.status}</p>
//         <p><strong>ETA:</strong> {pkg.expectedDelivery}</p>
//       </div>
//     ))}
//   </div>
// </section>

//         </div>
//       </Router>
//     );
//   }
// }

//export default App;
