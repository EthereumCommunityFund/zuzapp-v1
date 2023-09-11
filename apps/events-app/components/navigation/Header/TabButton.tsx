import { MouseEventHandler } from "react";
import { IconType } from "react-icons";

interface ITabButton {
  name: string,
  ButtonIcon: IconType,
  onClick: MouseEventHandler<HTMLButtonElement> | undefined,
}

export default function TabButton(props: ITabButton) {
  const { name, ButtonIcon, onClick } = props;
  return (
    <button className="flex p-3.5 gap-2.5 font-semibold text-base leading-5 align-middle hover:cursor-pointer hover:font-bold" onClick={onClick}>
      <ButtonIcon />
      {name}
    </button>
  );
}