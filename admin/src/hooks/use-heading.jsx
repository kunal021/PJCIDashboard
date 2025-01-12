import HeadingContext from "@/context/HeadingProvider";
import { useContext } from "react";

export const useHeading = () => {
  const context = useContext(HeadingContext);
  if (context === undefined) {
    throw new Error("useHeading must be used within a HeadingProvider");
  }
  return context;
};
