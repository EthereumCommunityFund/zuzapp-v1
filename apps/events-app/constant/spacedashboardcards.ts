import { IconType } from 'react-icons';
import { SpaceDashboardCardType } from '../types';
import { HiCalendar } from 'react-icons/hi';
import { HiMiniArrowUpCircle } from 'react-icons/hi2';
import { RiSettings5Fill } from 'react-icons/ri';

interface SpaceDashboardCard {
  name: string;
  description: string;
  buttonName: string;
  cardType: SpaceDashboardCardType;
  icon?: IconType;
  buttonIcon?: IconType;
}

export const spaceDashboardCards: SpaceDashboardCard[] = [
  {
    name: 'Event Visibility',
    description: 'Your Event Is Not Published. Only visible to you and editors of this event space.',
    buttonName: 'Publish Event',
    cardType: SpaceDashboardCardType.PublishEvent,
    buttonIcon: HiMiniArrowUpCircle,
  },
  {
    name: 'Event Space Details',
    description: 'Enter Event Space Details.',
    buttonName: 'Edit Details',
    cardType: SpaceDashboardCardType.EditDetails,
    icon: HiCalendar,
  },
  {
    name: 'Settings',
    description: 'Open Settings',
    buttonName: 'Open Settings',
    cardType: SpaceDashboardCardType.OpenSettings,
    buttonIcon: RiSettings5Fill,
  },
];

export const getSpaceDashboardCards = (eventStatus: string): SpaceDashboardCard[] => {
  return [
    {
      name: 'Event Visibility',
      description: eventStatus === 'published' ? 'Your Event is Published. Now visible to everyone.' : 'Your Event Is Not Published. Only visible to you and editors of this event space.',
      buttonName: eventStatus === 'published' ? 'Archive Event' : 'Publish Event',
      cardType: eventStatus === 'published' ? SpaceDashboardCardType.ArchiveEvent : SpaceDashboardCardType.PublishEvent,
      buttonIcon: HiMiniArrowUpCircle,
    },
    // ...other cards remain the same
    {
      name: 'Event Space Details',
      description: 'Enter Event Space Details.',
      buttonName: 'Edit Details',
      cardType: SpaceDashboardCardType.EditDetails,
      icon: HiCalendar,
    },
    {
      name: 'Settings',
      description: 'Open Settings',
      buttonName: 'Open Settings',
      cardType: SpaceDashboardCardType.OpenSettings,
      buttonIcon: RiSettings5Fill,
    },
  ];
};
