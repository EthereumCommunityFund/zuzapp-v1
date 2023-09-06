interface IEventDeatilsDescription {
  name: string
}
export default function EventDeatilsDescription(props: IEventDeatilsDescription) {
  return (
    <div className="opacity-70 h-3 font-normal text-[10px] leading-3">{props.name}</div>
  )
}