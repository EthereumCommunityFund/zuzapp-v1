interface IEvent {
  name: string
}
export default function Event(props: IEvent) {
  const { name } = props;
  return (
    <div className="leading-none py-2	px-4 align-middle flex border rounded-[10px] bg-background gap-1 border-[#DFDFDF] border-opacity-10">
      <div className="text-white font-bold">{name}</div>
    </div>
  );
}
