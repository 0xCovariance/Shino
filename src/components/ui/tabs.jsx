import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext();

export function Tabs({ defaultValue, children, className = "" }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className = "" }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active === value
          ? "bg-purple-500 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${className}`}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = "" }) {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div className={className}>{children}</div>;
}
