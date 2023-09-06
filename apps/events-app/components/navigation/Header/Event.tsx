interface IEvent {
  name: string
}
export default function Event(props: IEvent) {
  const { name } = props;
  return (
    <div className="leading-none py-1.5	px-3.5 align-middle flex border rounded-lg bg-background gap-1 font-semibold border-[#DFDFDF] border-opacity-10">
      <div className="text-opacity-70 text-white">Event: </div>
      <div className="text-white">{name}</div>
    </div>
  );
}
