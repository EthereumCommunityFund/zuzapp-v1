interface IProps {
  title: string
}
export default function EditionFormTitle(props: IProps) {
  return (
    <span className="text-[25px] font-normal leading-[1.2]">{props.title}</span>
  )
}