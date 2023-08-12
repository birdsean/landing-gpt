import { createContext } from "react";

type ScrollContextType = () => void;

export const ScrollContext = createContext<ScrollContextType>(() => {
  console.warn("ScrollContext not implemented");
});
