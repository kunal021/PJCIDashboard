/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

const HeadingContext = createContext();

export const HeadingProvider = ({ children }) => {
  const [heading, setHeading] = useState("Dashboard");

  return (
    <HeadingContext.Provider value={{ heading, setHeading }}>
      {children}
    </HeadingContext.Provider>
  );
};

export default HeadingContext;
