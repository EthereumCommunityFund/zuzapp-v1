import { IconType } from "react-icons";

interface ITabButton {
  name: string,
  ButtonIcon: IconType,
  // onClick: () => void,
}

export default function TabButton(props: ITabButton) {
  const { name, ButtonIcon } = props;
  return (
    <div className="flex p-3.5 gap-2.5 font-semibold text-base leading-5 align-middle hover:cursor-pointer hover:font-bold">
      <ButtonIcon />
      {name}
    </div>
  );
}