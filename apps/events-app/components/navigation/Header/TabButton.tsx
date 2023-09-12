import { MouseEventHandler, useState } from "react";
import { IconType } from "react-icons";

interface ITabButton {
  name: string,
  ButtonIcon: IconType,
  onClick: MouseEventHandler<HTMLButtonElement> | undefined,
  isActive: boolean
}

export default function TabButton(props: ITabButton) {
  const { name, ButtonIcon, onClick, isActive } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
  }

  return (
    <button className={`flex p-3.5 gap-2.5 font-semibold text-base leading-5 align-middle hover:cursor-pointer ${isActive ? 'underline' : ''}`} onClick={handleClick}>
      <ButtonIcon className={`${isActive ? 'underline' : ''}`} />
      {name}
    </button>
  );
}
