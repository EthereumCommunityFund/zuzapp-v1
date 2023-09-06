import { IconType } from "react-icons";

interface ITabButton {
  name: string,
  ButtonIcon: IconType,
  // onClick: () => void,
}

export default function TabButton(props: ITabButton) {
  const { name, ButtonIcon } = props;
  return (
    <div className="border-b flex p-3.5 gap-2.5 font-semibold text-base leading-5 align-middle">
      <ButtonIcon className=""/>
      {name}
    </div>
  );
}