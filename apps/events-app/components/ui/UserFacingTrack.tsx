import { TbTicket } from 'react-icons/tb';
import Speaker from './Speaker';
import EventDataDate from './labels/event-data-date';
import { ScheduleDetailstype } from '@/types';
import { useEffect, useState } from 'react';
import EventDataTime from './labels/event-data-time';
import { ref } from 'joi';
import React from 'react';
import useTrackDetails from '@/hooks/useTrackDetails';
import { Loader } from './Loader';
import useTrack from '@/hooks/useTrack';

interface IUserFacingTrack {
  scheduleId?: string;
  scheduleData: ScheduleDetailstype;
  onClick: () => void;
}

const UserFacingTrack: React.ForwardRefRenderFunction<HTMLDivElement, IUserFacingTrack> = (props, ref) => {
  const { scheduleData, onClick } = props;
  const { trackDetails, isLoading } = useTrack(scheduleData.track_id as string);
  const date = new Date(scheduleData.date);
  const enddate = new Date(scheduleData.end_date);
  const startDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  const endDate = new Date(enddate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  const startTime = new Date(scheduleData.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(scheduleData.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  console.log(scheduleData, 'schedule data');

  return scheduleData && scheduleData.repeating ? (
    <div ref={ref} onClick={onClick} className="flex flex-col gap-3">
      <div className="flex flex-col rounded-2xl">
        <div className="flex gap-1 justify-between border-2 border-[#444646] md:p-2 sm:p-2 rounded-2xl bg-userFacingItem hover:bg-[#434646] duration-200">
          <div className="flex flex-col gap-2.5 w-3/4 ml-2">
            <div className="flex gap-2.5 text-sm font-inter font-bold">
              {scheduleData && (scheduleData.schedule_frequency === 'everyday' || scheduleData.schedule_frequency === 'weekly') && <span className="text-[#b29457]">RECURRING</span>}
              <span>{isLoading ? <Loader /> : trackDetails?.name || 'TRACK'}</span>
            </div>
            <span className="font-bold md:text-xl">{scheduleData.name}</span>
            <div className="flex gap-2.5 md:flex-row sm:flex-col w-fit">
              <EventDataTime startTime={startTime} endTime={endTime} />
            </div>
            <div className="flex gap-[3px] flex-wrap">{scheduleData.organizers?.map((organizer) => <Speaker title={organizer.name} />)}</div>
          </div>
          <div>
            <div className="bg-trackDateColor p-1 md:rounded-xl sm:rounded-sm">
              <TbTicket className="md:text-[40px] sm:text-[25px] opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div ref={ref} onClick={onClick} className="flex flex-col gap-3">
      <div className="flex flex-col rounded-2xl">
        <div className="flex gap-1 justify-between border-2 border-[#444646] md:p-5 sm:p-3 rounded-2xl bg-userFacingItem hover:bg-[#434646] duration-200">
          <div>
            <div className="md:rounded-[10px] sm:rounded-lg md:p-2.5 text-center border-2 bg-trackDateColor border-[#5F6262] md:text-xl sm:text-sm p-2 ">
              <h2 className="font-bold">{date.getDate()}</h2>
              <b className="font-bold">{date.toLocaleDateString('en-US', { month: 'short' })}</b>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 w-3/4 ml-2">
            <div className="flex gap-2.5 text-sm font-inter font-bold">
              {scheduleData && (scheduleData.schedule_frequency === 'everyday' || scheduleData.schedule_frequency === 'weekly') && <span className="text-[#b29457]">RECURRING</span>}
              <span>{isLoading ? <Loader /> : trackDetails?.name || 'TRACK'}</span>
            </div>

            <span className="font-bold md:text-xl">{scheduleData.name}</span>
            <div className="flex gap-2.5 md:flex-row sm:flex-col w-fit">
              {scheduleData.schedule_frequency !== 'once' && <EventDataDate startDate={startDate} endDate={endDate} />}
              <EventDataTime startTime={startTime} endTime={endTime} />
            </div>
            <div className="flex gap-[3px] flex-wrap">{scheduleData.organizers?.map((organizer) => <Speaker title={organizer.name} />)}</div>
          </div>
          <div>
            <div className="bg-trackDateColor p-1 md:rounded-xl sm:rounded-sm">
              <TbTicket className="md:text-[40px] sm:text-[25px] opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.forwardRef(UserFacingTrack);
