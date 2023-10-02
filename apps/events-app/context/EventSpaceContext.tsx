'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';
import { EventSpaceDetailsType } from '@/types';

interface EventSpaceContextProps {
  eventSpace: EventSpaceDetailsType | null;
  setEventSpace: React.Dispatch<
    React.SetStateAction<EventSpaceDetailsType | null>
  >;
  eventSpaceList: EventSpaceDetailsType[];
  setEventSpaceList: React.Dispatch<React.SetStateAction<EventSpaceDetailsType[]>>;
}

type EvenSpaceProps = {
  children: ReactNode;
};

const EventSpaceContext = createContext<EventSpaceContextProps | undefined>(undefined);

export const EventSpaceProvider = ({ children }: EvenSpaceProps) => {
  const [eventSpace, setEventSpace] = useState<EventSpaceDetailsType | null>(
    null
  );
  const [eventSpaceList, setEventSpaceList] = useState<EventSpaceDetailsType[]>([]);

  return (
    <EventSpaceContext.Provider value={{ eventSpace, setEventSpace, eventSpaceList, setEventSpaceList }}>
      {children}
    </EventSpaceContext.Provider>
  );
};

export const useEventSpace = () => {
  const context = useContext(EventSpaceContext);
  if (context === undefined) {
    throw new Error('useEventSpace must be used within an EventSpaceProvider');
  }
  return context;
};

export const useEventSpaces = () => {
  const context = useContext(EventSpaceContext);
  if (context === undefined) {
    throw new Error(
      'useEventSpaces must be used within an EventSpacesProvider'
    );
  }
  return context;
};
