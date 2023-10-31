import Button from "../buttons/Button";
import { Label } from "../label";

interface IProps {
  name: string;
}

export default function FormTitle(props: IProps) {
  const { name } = props;
  return (
    <div className="flex justify-between items-start self-stretch">
      <Label className="text-[25px] font-bold">{name}</Label>
      {/* <Button leftIcon={}></Button> */}
    </div>
  );
}
