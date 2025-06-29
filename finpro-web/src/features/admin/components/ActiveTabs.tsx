import { extend } from "leaflet";
import * as React from "react";

export interface IActiveTabsProps<T extends Record<string, unknown>> {
  tabHeaders: Array<{ key: string; label: string; icon: React.ReactNode }>;
  defaultTab?: string;
  onTabChange?: (activeTab: string) => void;
}

export default function ActiveTabs<T extends Record<string, unknown>>({
  tabHeaders,
  defaultTab,
  onTabChange,
}: IActiveTabsProps<T>) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabHeaders[0]?.key || "");
  
  const handleTabClick = (key: string) => {
    setActiveTab(key);
    onTabChange?.(key); // Expose internal state via callback
  };
    
  return (
    <div className="border-b border-gray-200">
      <ul className="flex flex-wrap -mb-px  lg:grid lg:grid-cols-2 text-sm font-medium text-center text-red-600">
        {tabHeaders.map((tab, index) => (
          <li
            key={index}
            onClick={() => handleTabClick(tab.key)}
            className={`me-2 gap-3 inline-flex items-center justify-center p-4 rounded-t-lg text-xl group ${
              tab.key === activeTab
                ? "border-red-600 border-b-3"
                : "border-transparent hover:border-b-4 cursor-pointer text-gray-400 hover:border-red-500 hover:text-red-500"
            }`}
          >
            {tab.icon}
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
