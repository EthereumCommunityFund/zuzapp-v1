interface IProps {
  name: string
}

export default function EventSpaceLabel1(props: IProps){
  return (
    <div className="text-base font-semibold leading-[19.2px] h-[19px] text-white">{props.name}</div>
  )
}