/* eslint-disable react/prop-types */
// LayoutAdjuster.js

import { useSelector } from "react-redux";

const LayoutAdjuster = ({ children }) => {
  const sidebarCollapsed = useSelector((state) => state.sidebar.collapsed);

  return (
    <div
      className={`w-full ${
        sidebarCollapsed ? "ml-20" : `ml-[15.5rem]`
      } transition-all px-4 min-h-screen flex justify-center items-center relative`}
    >
      {children}
    </div>
  );
};

export default LayoutAdjuster;
