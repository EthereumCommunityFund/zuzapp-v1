import { NextApiResponse } from 'next';
import { EventSpaceUpdateRequestBody, LocationType, ScheduleDetailstype } from '@/types';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// date function
export const formatTimestamp = (date: Date) => {
  return new Date(date).toISOString() as string;
};

export const convertDateToString = (date: Date) => {
  if (!date) {
    return new Date();
  }
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript month starts from 0
  const year = date.getFullYear();

  const dateString: string = `${year}-${month}-${day}`; // e.g., "2023-11-01"
  return dateString;
};

dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);

export const fromTurkeyToUTC = (date: any): any => {
  return dayjs(date).tz('Europe/Istanbul').utc();
};

export const toTurkeyTime = (date: any): any => {
  return dayjs(date).tz('Europe/Istanbul');
};

export const convertToTurkeyTimeAsDate = (utcTimestamp: any) => {
  const turkeyTime = dayjs(utcTimestamp).tz('Europe/Istanbul');
  return new Date(turkeyTime.year(), turkeyTime.month(), turkeyTime.date());
};

export const getMonthFromDate = (date: any) => {
  return dayjs(date).format('MMM');
};

export const getDayFromDate = (date: any) => {
  return dayjs(date).format('D');
};

export const stringToDateFormated = (string: any): string => {
  return dayjs(string).format('MMMM-YYYY-DD');
};

export const stringToDateObject = (string: string) => {
  return dayjs(string).toDate();
};

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const toTurkeyTimestampWithDefaultTime = (date: any): any => {
  return dayjs(date).tz('Europe/Istanbul').startOf('day').toDate();
};

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// date functions

export const sortGroupedSchedulesByStartTime = (groupedSchedules: Record<string, ScheduleDetailstype[]>): Record<string, ScheduleDetailstype[]> => {
  Object.keys(groupedSchedules).forEach((formattedDate: string) => {
    groupedSchedules[formattedDate].sort((a: any, b: any) => {
      const timeA = timeToMinutes(a.start_time);
      const timeB = timeToMinutes(b.start_time);
      return timeA - timeB;
    });
  });

  return groupedSchedules;
};

export const sortSchedulesByStartTime = (schedules: ScheduleDetailstype[] | undefined) => {
  if (!schedules) {
    return [];
  }

  schedules.sort((a: any, b: any) => {
    const dateA = parseDateString(a.start_date);
    const dateB = parseDateString(b.start_date);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    const timeA = timeToMinutes(a.start_time);
    const timeB = timeToMinutes(b.start_time);
    return timeA - timeB;
  });

  console.log(schedules, 'sorted schedules');
  return schedules;
};

const parseDateString = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map((num) => parseInt(num, 10));
  const date = new Date(2000, 0, 1);
  date.setFullYear(2000 + year, month - 1, day);
  return date;
};

export const sortByUpcoming = (schedules: ScheduleDetailstype[] | undefined, isUpcoming: boolean): ScheduleDetailstype[] => {
  if (!schedules) return [];
  const isUpcomingEvent = (schedule: ScheduleDetailstype) => {
    // console.log(schedule, 'isUpcoming');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = stringToDateObject(schedule.start_date);
    const endDate = stringToDateObject(schedule.real_end_date);

    // For non-recurring events:
    if (!schedule.schedule_frequency || schedule.schedule_frequency === 'once') {
      const [hours, minutes] = schedule.start_time.split(':').map(Number);
      startDate.setHours(hours, minutes, 0, 0);

      return isUpcoming ? startDate >= today : startDate < today;
    }

    if (schedule.schedule_frequency === 'everyday' || schedule.schedule_frequency === 'weekly') {
      if (isUpcoming) {
        return endDate >= today; // It's upcoming if the end date is today or in the future.
      } else {
        return startDate < today;
      }
    }
  };
  const filter: ScheduleDetailstype[] = schedules.filter(isUpcomingEvent);
  return filter;
};

export const filterByTrack = (schedules: ScheduleDetailstype[], selectedTracks: any[]) => {
  const selectedTrackIds = selectedTracks.map((item) => item.id);
  return selectedTrackIds.length > 0 ? schedules.filter((schedule) => schedule.track_id && selectedTrackIds.includes(schedule.track_id)) : schedules;
};
export const filterBySpace = (schedules: ScheduleDetailstype[], selectedSpaces: any[]) => {
  const selectedSpaceIds = selectedSpaces.map((item) => item.id);
  return selectedSpaceIds.length > 0 ? schedules.filter((schedule) => selectedSpaceIds.includes(schedule.location_id)) : schedules;
};
export const filterBySpeaker = (schedules: ScheduleDetailstype[], selectedSpeakers: any[]) => {
  return selectedSpeakers.length > 0
    ? schedules.filter((schedule) => selectedSpeakers.every((speakerName) => schedule.organizers?.some((organizer) => organizer.name.trim() === speakerName)))
    : schedules;
};
export const groupingSchedules = (allSchedules: ScheduleDetailstype[], groupedSchedules: Record<string, ScheduleDetailstype[]>) => {
  allSchedules.forEach((schedule) => {
    let isFirstEvent = true;
    let date = stringToDateObject(schedule.start_date as string);
    const end_date = stringToDateObject(schedule.real_end_date as string);
    const frequency = schedule.schedule_frequency;

    do {
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const newSchedule = {
        ...schedule,
        repeating: !isFirstEvent && (frequency === 'everyday' || frequency === 'weekly'),
      } as ScheduleDetailstype & { repeating: boolean };

      if (!groupedSchedules[formattedDate]) {
        groupedSchedules[formattedDate] = [];
      }

      groupedSchedules[formattedDate].push(newSchedule);

      if (frequency === 'everyday') {
        date.setDate(date.getDate() + 1);
      } else if (frequency === 'weekly') {
        date.setDate(date.getDate() + 7);
      } else {
        break;
      }

      isFirstEvent = false;
    } while (date <= end_date);
  });
};
function getRandomElement<T>(array: T[]): T {
  const randomIndex = getRandomInt(0, array.length - 1);
  return array[randomIndex];
}

// export const generateRandomEventSpaceUpdateData = (id: string, event_space_type: 'tracks' | 'schedules'): EventSpaceUpdateRequestBody => {
//   const formats = ['in-person', 'online'];
//   const statuses = ['draft', 'published', 'archived'];
//   const eventTypes = ['General', 'Special', 'Workshop', 'Seminar'];
//   const experienceLevels = ['beginner', 'intermediate', 'advanced'];

//   return {
//     id,
//     name: `Sample Event ${getRandomInt(1, 100)}`,
//     event_space_type: event_space_type,
//     start_date: (Date.now() - getRandomInt(1, 5) * 24 * 60 * 60 * 1000) as unknown as Date, // Random date within the last 5 days
//     end_date: (Date.now() + getRandomInt(1, 5) * 24 * 60 * 60 * 1000) as unknown as Date, // Random date within the next 5 days
//     description: `Random event description ${getRandomInt(1, 1000)}`,
//     // @ts-ignore
//     format: 'in-person',
//     event_type: [getRandomElement(eventTypes)],
//     experience_level: [getRandomElement(experienceLevels)],
//     status: 'draft',
//     image_url: 'http:imag',
//   };
// };

export const truncateString = (string: string, charLength: number, withEllipses: boolean = true): string => {
  const truncated: string = string?.substring(0, charLength);
  const ellipses: string = withEllipses ? '...' : '';
  return `${truncated} ${ellipses}`;
};
// eventspacelocation: [generateRandomLocation(), generateRandomLocation(), generateRandomLocation()]
