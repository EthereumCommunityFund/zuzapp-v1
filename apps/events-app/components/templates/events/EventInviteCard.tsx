import Button from "@/components/ui/buttons/Button";
import { HiArrowRight, HiFire } from "react-icons/hi";

type Props = {
    spacename: string;
    info: string;
    buttonTitle: string;
    onButtonClick?: () => void;
    buttonVariant: "primary" | "outline" | "ghost" | "light" | "dark" | "blue" | "quiet" | "red" | "primaryGreen" | "strongerGreen" | "yellow" | "quiet-SM" | undefined;
}

export const EventInviteCard = ({ spacename, info, buttonTitle, buttonVariant, onButtonClick }: Props) => {
  return (
    <div className=" rounded-2xl border bg-[#2E3131] py-5 px-4 flex flex-col gap-8">
      <h2 className=" text-xl font-bold opacity-70">
        You have been invited to edit a space
      </h2>
      <h3 className="text-lg font-semibold">{spacename}</h3>
      <div className="flex flex-col gap-5 self-stretch">
        <p className="text-xs text-center font-bold opacity-70">
          {info}
        </p>
        <div className="w-full">
          <Button
            variant={buttonVariant}
            className="w-full flex justify-center font-bold rounded-3xl text-xl leading-[1.2] duration-300"
            leftIcon={HiFire}
            onClick={onButtonClick}
            //   onClick={(e) => {
            //     handleButtonClick(SpaceDashboardCardType.EditDetails);
            //   }}
          >
            {buttonTitle}
          </Button>
        </div>
      </div>
    </div>
  );
};
