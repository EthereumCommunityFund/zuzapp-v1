import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';

import Button from '@/components/ui/buttons/Button';

interface IProps {
  eventTitle: string;
  index: number;
}

export default function EventSpaceCard(props: IProps) {
  const { eventTitle, index } = props;
  return (
    <div key={index} className="flex flex-row justify-between md:items-center border border-white/10 bg-[#2F3232E5] rounded-lg px-3 md:px-5 py-5 mt-5">
      <div>
        <span className="bg-[#67DBFF]/20 text-[#67DBFF] rounded-full text-xs py-1 px-2 block w-fit">Draft</span>
        <h4 className="text-xl md:text-2xl font-bold mt-3">{eventTitle}</h4>
      </div>
      <div>
        <Link href="/dashboard/events/spacedashboard" className="w-full">
          <Button variant="dark" className="bg-white/20 text-white/70 rounded-full" leftIcon={HiArrowRight}>
            Enter Space
          </Button>
        </Link>
      </div>
    </div>
  );
}
