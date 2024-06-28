/* eslint-disable react/prop-types */
// LayoutAdjuster.js

import { useSelector } from "react-redux";

const LayoutAdjuster = ({ children }) => {
  const sidebarCollapsed = useSelector((state) => state.sidebar.collapsed);

  return (
    <div
      className={`w-[80%] ${
        sidebarCollapsed ? "ml-40" : `ml-[15.5rem]`
      } transition-all px-4 min-h-screen flex justify-center items-center`}
    >
      {children}
    </div>
  );
};

export default LayoutAdjuster;
