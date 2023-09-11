interface IProps {
  name: string
}

export default function EventSpaceLabel(props: IProps){
  return (
    <div className="h-6 opacity-70 font-bold text-xl leading-6">{props.name}</div>
  )
}