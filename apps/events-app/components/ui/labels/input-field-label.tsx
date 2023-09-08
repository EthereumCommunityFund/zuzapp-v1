interface IProps {
  name: string
}

export default function InputFieldLabel(props: IProps){
  return (
    <div className="text-base font-semibold leading-[19.2px] text-white self-stretch">{props.name}</div>
  )
}