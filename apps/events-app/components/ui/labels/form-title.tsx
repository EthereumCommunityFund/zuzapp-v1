import Button from "../buttons/Button";

interface IProps {
  name: string
}

export default function FormTitle(props: IProps) {
  const { name } = props;
  return (
    <div className="flex justify-between items-start self-stretch">
      <span className="text-[25px] font-bold leading-[1.2]">{name}</span>
      {/* <Button leftIcon={}></Button> */}
    </div>
  )
}