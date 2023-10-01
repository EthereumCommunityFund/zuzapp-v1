"use client";

import React, { ReactNode, createContext, useContext, useState } from "react";
import { EventSpaceDetailsType } from "@/types";

interface EventSpaceContextProps {
  eventSpace: EventSpaceDetailsType | null;
  setEventSpace: React.Dispatch<
    React.SetStateAction<EventSpaceDetailsType | null>
  >;
}
type EvenSpaceProps = {
  children: ReactNode;
};

const EventSpaceContext = createContext<EventSpaceContextProps | undefined>(
  undefined
);

export const EventSpaceProvider = ({ children }: EvenSpaceProps) => {
  const [eventSpace, setEventSpace] = useState<EventSpaceDetailsType | null>(
    null
  );

  return (
    <EventSpaceContext.Provider value={{ eventSpace, setEventSpace }}>
      {children}
    </EventSpaceContext.Provider>
  );
};

export const useEventSpace = () => {
  const context = useContext(EventSpaceContext);
  if (context === undefined) {
    ("d");
    throw new Error("useEventSpace must be used within an EventSpaceProvider");
  }
  return context;
};
