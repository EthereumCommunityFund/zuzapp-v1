import * as Switch from '@radix-ui/react-switch';

interface IProps {
  value?: boolean,
  onClick?: () => void
}

export default function SwitchButton(props: IProps) {
  const { value, onClick } = props;
  return (
    <div className="flex items-center">
      <Switch.Root
        className="w-[44px] h-[27px] bg-bgPrimary rounded-full relative data-[state=checked]:bg-primary outline-none cursor-default duration-300"
        id="airplane-mode"
        onClick={onClick}
      >
        <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
    </div>
  )
}