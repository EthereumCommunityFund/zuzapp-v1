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
    <button className={`flex box-border h-full p-6 gap-3 font-semibold text-lg leading-5 items-center hover:cursor-pointer hover:text-textPrimary ${isActive? 'border-b-[1px] text-textPrimary': 'text-textSecondary'}`} onClick={handleClick}>
      <ButtonIcon className='w-7 h-7' />
      {name}
    </button>
  );
}
