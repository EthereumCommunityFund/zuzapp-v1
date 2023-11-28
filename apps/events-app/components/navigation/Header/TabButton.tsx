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
    <button className={`flex box-border h-full p-3 lg:p-6 gap-3 font-semibold text-sm lg:text-lg leading-5 items-center hover:cursor-pointer hover:text-textPrimary ${isActive? 'border-b border-white text-textPrimary': 'text-textSecondary'}`} onClick={handleClick}>
      <ButtonIcon className='lg:w-7 w-4 lg:h-7 h-4 hidden sm:flex' />
      {name}
    </button>
  );
}
