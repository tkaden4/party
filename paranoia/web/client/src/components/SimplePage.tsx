import React from "react";

export default function SimplePage({ children }) {
  return (
    <div
      style={{
        textAlign: "center",
        position: "absolute",
        top: "50%",
        transform: "translate(-50%, -50%)",
        left: "50%",
        fontSize: "18px",
      }}
    >
      {...children}
    </div>
  );
}
