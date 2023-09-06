interface IProps {
  name: string
}

export default function EventSpaceLabel1(props: IProps){
  return (
    <div className="text-xl font-semibold leading-[19.2px] h-[19px] text-white">{props.name}</div>
  )
}