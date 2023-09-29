import Button from "../ui/buttons/Button";

interface IEventViewHeader {
  imgPath: string;
  name: string;
  tagline: string;
}

export default function EventViewHeader(props: IEventViewHeader) {
  const { imgPath, name, tagline } = props;
  return (
    <div className="flex px-2.5 rounded-full gap-[10px] h-[60px] justify-between items-center">
      <img src={imgPath} width={100} alt="event" />
      <div className="flex flex-col gap-2 w-3/4">
        <h2 className="font-bold text-3xl">{name}</h2>
        <span className="font-semibold opacity-70">{tagline}</span>
      </div>
      <Button variant="primaryGreen" className="rounded-[20px] text-base w-[150px] h-10 items-center">
        <span className="mx-auto" >Apply to Event</span>
      </Button>
    </div>
  );
}