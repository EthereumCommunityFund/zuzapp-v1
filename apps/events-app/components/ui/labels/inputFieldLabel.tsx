interface IProps {
  name: string
}

export default function InputFieldLabel(props: IProps) {
  return (
    <div className="text-lg font-semibold leading-[1.2] text-white self-stretch">{props.name}</div>
  )
}