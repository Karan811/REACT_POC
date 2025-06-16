import React, { useEffect, useState } from 'react';

function AlertComponents() {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
     try {
    const eventSource = new EventSource("http://localhost:8080/api/v1/subscribe");

    eventSource.addEventListener("alert", (event) => {
      setAlerts(prev => [...prev, event.data]);
    });

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
    };

    return () => {
      eventSource.close();
    };
  } catch (err) {
    console.error("Failed to connect to SSE:", err);
  }
  }, []);

  return (
    <div className="alerts">
        <p>Here are the alerts</p>
      {alerts.map((alert, idx) => (
        <div key={idx} className="alert-box">
          🚨 {alert}
          
        </div>
      ))}
    </div>
  );

}

export default AlertComponents;
