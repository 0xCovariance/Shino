import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-300 ${className}`}
      {...props}
    />
  );
}
