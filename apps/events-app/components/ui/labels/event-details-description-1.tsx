interface IEventDeatilsDescription1 {
  name: string
}
export default function EventDeatilsDescription1(props: IEventDeatilsDescription1) {
  return (
    <div className="opacity-70 h-[18px] font-normal text-[13px] leading-[18.2px]">{props.name}</div>
  )
}