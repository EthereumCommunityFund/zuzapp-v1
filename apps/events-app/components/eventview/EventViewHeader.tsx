import Image from 'next/image';
import Button from '../ui/buttons/Button';

interface IEventViewHeader {
  imgPath: string;
  name: string;
  tagline: string;
}

export default function EventViewHeader(props: IEventViewHeader) {
  const { imgPath, name, tagline } = props;
  return (
    <div className="lg:sticky lg:block lg:top-[65px] lg:z-50 lg:backdrop-blur-[250px] px-2 py-4 rounded-b-xl sm:hidden sm:bottom-0 sm:w-full sm:left-0 sm:p-0 sm:z-40">
      <div
        className={
          'flex md:px-10 lg:p-10 pb-2 gap-[10px] lg:rounded-full lg:h-[60px] justify-between items-center lg:bg-inherit lg:backdrop-blur-none sm:backdrop-blur-sm lg:relative md:flex-row sm:bottom-0 sm:bg-white/10 sm:flex-col w-full z-10'
        }
      >
        <div className="sm:flex sm:flex-row items-center gap-5 sm:justify-left w-full sm:py-3 sm:px-3 md:px-0">
          <Image src={imgPath} className="rounded-xl" width={90} height={90} alt="event" loading='lazy' />
          <div className="flex flex-col gap-2 w-3/4">
            <h2 className="font-bold text-2xl z-50">{name}</h2>
            <span className="opacity-70 text-[15px] lg:flex sm:hidden">{tagline}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
