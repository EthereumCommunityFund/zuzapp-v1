import { useState } from 'react';
import Container from '../ui/Container';
import EventBasics from './EventBasics';
import EventCategoriesLabs from './EventCategoriesLabs';
import { EventSpaceDetailsType } from '@/types';
import EventFormat from './EventFormat';
import EventLinks from './EventLinks';
import EditionButtons from '@/components/ui/buttons/EditionButtons';
import { CgClose } from 'react-icons/cg';
import { FaCircleArrowDown } from 'react-icons/fa6';

interface EventSpaceDetailsProps {
  eventSpace: EventSpaceDetailsType;
}

const EventSpaceDetails: React.FC<EventSpaceDetailsProps> = ({ eventSpace }) => {
  const { id, name, event_space_type, status, start_date, end_date, description, format, event_type, experience_level, eventspacelocation } = eventSpace;

  return (
    <Container>
      <div className="flex flex-col gap-[34px]">
        <span className="text-[25px] font-normal leading-[1.2]">Event Space Details</span>
        <EventBasics name={name} startDate={start_date} endDate={end_date} />
        <EventFormat
          setEventCreated={function (eventCreated: boolean): void {
            throw new Error('Function not implemented.');
          }}
        />
        <EventLinks />
        <EventCategoriesLabs />
        <EditionButtons type={'eventspace'} leftButtonName={'Discard'} rightButtonName={'Save Edit'} leftButtonIcon={CgClose} rightButtonIcon={FaCircleArrowDown} />
      </div>
    </Container>
  );
};

export default EventSpaceDetails;
