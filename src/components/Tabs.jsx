import React, { useState } from "react";

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();

    // 2. set new Active Tab once child label is clicked
    setActiveTab(newActiveTab);
  };

  return (
    <div className="max-w-md mx-auto md:min-w-full">
      <div className="flex border-b border-gray-300">
        {/* 1. mapping out the names of the labels */}
        {children.map((child) => (
          <button
            key={child.props.label}
            className={`${
              activeTab === child.props.label
                ? "border-b-2 border-orange-400"
                : ""
            } flex-1 font-bold text-sm pt-5 pb-2 text-gray-800`}
            onClick={(e) => handleClick(e, child.props.label)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="py-1 text-sm">
        {children.map((child) => {
          if (child.props.label === activeTab) {
            // 3. Render the children of the active tabs
            return <div key={child.props.label}>{child.props.children}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
};

// Only used as a child within the Tabs component to define the structure and content of the tabs.
const Tab = ({ label, children }) => {
  return (
    <div label={label} className="hidden">
      {children}
    </div>
  );
};
export { Tabs, Tab };
