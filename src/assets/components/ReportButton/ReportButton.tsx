import React, { useState } from "react";

const ReportButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px",
        backgroundColor: "#ffffff", // Blue color
        color: "#212121", // White color
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Reportar Incidente
    </button>
  );
};

export default ReportButton;