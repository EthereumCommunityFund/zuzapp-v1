import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';
import { useRouter } from 'next/router';
import Button from '@/components/ui/buttons/Button';
import { fetchEventSpace } from '@/controllers/eventspace.controller';

interface IProps {
  eventTitle: string;
  eventId: string;
  index: number;
}

export default function EventSpaceCard(props: IProps) {
  const router = useRouter();
  const { eventTitle, eventId, index } = props;

  const handleEnterSpace = async () => {
    try {
      // Fetch the details for the selected space
      const spaceDetails = await fetchEventSpace(eventId);

      // Redirect to a new page with the fetched details
      router.push({
        pathname: '/dashboard/events/spacedetails', // Update with your actual route
        query: { eventId: eventId }, // Pass space ID as a query parameter
      });
    } catch (error) {
      console.error('Error fetching space details', error);
    }
  };

  return (
    <div key={index} className="flex flex-row justify-between md:items-center border border-white/10 bg-[#2F3232E5] rounded-lg px-3 md:px-5 py-5 mt-5">
      <div>
        <span className="bg-[#67DBFF]/20 text-[#67DBFF] rounded-full text-xs py-1 px-2 block w-fit">Draft</span>
        <h4 className="text-xl md:text-2xl font-bold mt-3">{eventTitle}</h4>
      </div>
      <div>
        <div className="w-full">
          <Button variant="dark" className="bg-white/20 text-white/70 rounded-full" leftIcon={HiArrowRight} onClick={handleEnterSpace}>
            Enter Space
          </Button>
        </div>
      </div>
    </div>
  );
}
