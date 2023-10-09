import Button from "../ui/buttons/Button";

interface IEventViewHeader {
  imgPath: string;
  name: string;
  tagline: string;
}

export default function EventViewHeader(props: IEventViewHeader) {
  const { imgPath, name, tagline } = props;
  return (
    <div className={"flex px-10 lg:rounded-full gap-[10px] h-[60px] justify-between items-center lg:bg-inherit sm:backdrop-blur-sm sm:bg-white/10 sm:h-20 lg:relative sm:fixed sm:bottom-0 sm:z-[1000] w-full"}>
      <img src={imgPath} className="rounded-xl" width={90} height={90} alt="event" />
      <div className="flex flex-col gap-2 w-3/4">
        <h2 className="font-bold text-2xl z-50">{name}</h2>
        <span className="opacity-70 text-[15px] lg:flex md:hidden">{tagline}</span>
      </div>
      <Button variant="primaryGreen" className="rounded-full w-[200px] justify-center text-[18px]">Apply to Event</Button>
    </div>
  );
}