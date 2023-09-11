interface IProps {
  name: string
}
export default function SectionInputFormDescription(props: IProps) {
  return (
    <div className="opacity-70 h-3 font-normal text-[10px] leading-3">{props.name}</div>
  )
}