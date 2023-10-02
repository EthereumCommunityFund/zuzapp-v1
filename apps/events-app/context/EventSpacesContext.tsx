import { EventSpaceDetailsType } from '@/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
interface EventSpacesContextProps {
  eventSpaceList: EventSpaceDetailsType[];
  setEventSpaceList: React.Dispatch<React.SetStateAction<EventSpaceDetailsType[]>>;
}

type EventSpacesProviderProps = {
  children: ReactNode;
};

const EventSpacesContext = createContext<EventSpacesContextProps | undefined>(
  undefined
);

export const EventSpacesProvider: React.FC<EventSpacesProviderProps> = ({
  children,
}) => {
  const [eventSpaceList, setEventSpaceList] = useState<EventSpaceDetailsType[]>([]);

  return (
    <EventSpacesContext.Provider value={{ eventSpaceList, setEventSpaceList }}>
      {children}
    </EventSpacesContext.Provider>
  );
};

export const useEventSpaces = () => {
  const context = useContext(EventSpacesContext);
  if (context === undefined) {
    throw new Error(
      'useEventSpaces must be used within an EventSpacesProvider'
    );
  }
  return context;
};
