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

export const truncateString = (string: string, charLength: number, withEllipses: boolean = true): string => {
  const truncated: string = string?.substring(0, charLength);
  const ellipses: string = withEllipses ? '...' : '';
  return `${truncated} ${ellipses}`;
};
// eventspacelocation: [generateRandomLocation(), generateRandomLocation(), generateRandomLocation()]

export function formatDate(dateString: string | number | Date) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
export const slideData = [
  {
    title: 'ZuConnect in Istanbul',
    description:
      'Join us for a two-week popup village where the leading innovators in crypto, AI, governance, decentralized science, and culture unite in the heart of Istanbul to co-work, break downsiloes, and have fun',
    ctas: [
      {
        ctaText: 'Manage your Ticket',
        ctaLink: 'https://app.tripsha.com/trip/64ff3a6eb4b6950008dee4f8/',
        action: 'apply',
        twClassNames: 'bg-[#769270] hover:bg-[#92B68B]',
      },
      {
        ctaText: 'About ZuConnect',
        ctaLink: 'https://wiki.zuzalu.city',
        action: 'about',
        twClassNames: 'bg-white/20 hover:bg-white/30',
      },
    ],
  },
  {
    title: 'The Zuzalu Playbook',
    description:
      'Looking to start your own Zuzalu-style community event? We have developed a comprehensive playbook that compiles our extensive experience and expertise. A guide for any community looking to organize a successful event quickly and efficiently.',
    ctas: [
      {
        ctaText: 'View the Playbook',
        ctaLink: 'https://zuzalu.notion.site/3e893df2a248496bb30720fc1518c3c6?v=b0bc5b586a574272928d9a1fe0ded088',
        action: 'view',
        twClassNames: 'bg-[#769270] hover:bg-[#92B68B]',
      },
    ],
  },
];
