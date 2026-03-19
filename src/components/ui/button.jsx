import React from "react";

export function Button({ children, className = "", onClick, ...props }) {
  return (
    <button
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
