import { TbTicket } from 'react-icons/tb';
import Speaker from './Speaker';
import EventDataDate from './labels/event-data-date';
import { ScheduleUpdateRequestBody } from '@/types';
import { useEffect, useState } from 'react';
import EventDataTime from './labels/event-data-time';

interface IUserFacingTrack {
  scheduleData: ScheduleUpdateRequestBody;
  onClick: () => void;
}

export default function UserFacingTrack(props: IUserFacingTrack) {
  const { scheduleData, onClick } = props;
  const date = new Date(scheduleData.date);
  const startDate = new Date(scheduleData.start_time).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  const endDate = new Date(scheduleData.end_time).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  const startTime = new Date(scheduleData.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(scheduleData.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    console.log('Date', date);
  });

  return (
    <div onClick={onClick} className="flex flex-col gap-3">
      <div className="text-center border-b-2 p-3 border-borderPrimary">
        <span className="text-lg font-bold w-full">{new Date(scheduleData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div className="flex flex-col rounded-2xl">
        <div className="flex justify-between border-2 border-[#444646] p-5 rounded-2xl bg-userFacingItem hover:bg-[#434646] duration-200">
          <div>
            <div className="rounded-[10px] p-2.5 text-center border-2 bg-trackDateColor border-[#5F6262]">
              <h2 className="font-bold text-xl">{date.getDate()}</h2>
              <b className="font-bold text-xl">{date.toLocaleDateString('en-US', { month: 'short' })}</b>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 w-3/4">
            {/* <div className="flex gap-2.5">
            <span>RECURRING</span>
            <span>TRACK/THEME</span>
          </div> */}
            <span className="font-bold text-xl">{scheduleData.name}</span>
            <div className="flex gap-2.5">
              {scheduleData.schedule_frequency !== 'once' && <EventDataDate startDate={startDate} endDate={endDate} />}
              <EventDataTime startTime={startTime} endTime={endTime} />
            </div>
            <div className="flex gap-[3px]">
              <Speaker title="Janine Leger" />
              <Speaker title="QJ" />
            </div>
          </div>
          <div>
            <div className="bg-trackDateColor p-1 rounded-xl">
              <TbTicket className="text-[40px] opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
