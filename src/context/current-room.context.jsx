import React from "react";
import { createContext, useContextSelector } from "use-context-selector";

const CurrentRoomContext = createContext(); //creating context using createContext

// creating context provider that will be called by useCurrentRoom
export const CurrentRoomRovider = ({ children, data }) => {
  return (
    <CurrentRoomContext.Provider value={data}>
      {children}
    </CurrentRoomContext.Provider>
  );
};

// this will be called which will use CurrentRoomContext taking the help of selector
export const useCurrentRoom = (selector) =>
  useContextSelector(CurrentRoomContext, selector);
