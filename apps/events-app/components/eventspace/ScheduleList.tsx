import { ScheduleUpdateRequestBody, TrackType } from '@/types';

type TrackProp = {
  track: {
    id?: string;
    description: string | null;
    event_space_id: string;
    image: string | null;
    name: string;
    schedules?: ScheduleUpdateRequestBody[];
  };
};
export default function ScheduleList({ track }: TrackProp) {
  console.log(track, 'schedules-list');
  return (
    <div className="flex flex-col">
      <p className="font-bold">{track.name}</p>
      {track.schedules && (
        <ul>
          {track.schedules.length > 0 ? (
            track.schedules?.map((schedule) => {
              return <li className="font-light text-base">{schedule.name}</li>;
            })
          ) : (
            <li className="font-light text-base">No session added yet</li>
          )}
        </ul>
      )}
    </div>
  );
}
