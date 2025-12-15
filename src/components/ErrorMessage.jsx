import React from "react";

function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      padding: "20px",
      margin: "20px",
      backgroundColor: "#fee",
      border: "1px solid #fcc",
      borderRadius: "8px",
      textAlign: "center"
    }}>
      <h3 style={{ color: "#c00", marginBottom: "10px" }}>
        ⚠️ Ops! Qualcosa è andato storto
      </h3>
      <p style={{ color: "#666", marginBottom: "15px" }}>
        {message || "Errore nel caricamento dei cocktail"}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Riprova
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;