import { BsMapFill } from "react-icons/bs";
import Button from "../buttons/Button";
import { Link } from "lucide-react";

interface IProps {
  title: string,
  description: string,
  buttonName: string,
  link?: string,
}

export default function BasicPrompt(props: IProps) {
  const { title, description, buttonName, link } = props;

  return (
    <div className="flex py-5 px-4 flex-col items-center gap-6 rounded-2xl border border-white border-opacity-10 bg-[#383B3BB3]">
      <div className="flex items-start self-stretch">
        <span className="text-xl font-bold leading-[1.2]">{title}</span>
      </div>
      <span className="text-base font-normal leading-[1.2] opacity-70">{description}</span>
      <Link href={link}>
        <Button variant="quiet" leftIcon={BsMapFill}>{buttonName}</Button>
      </Link>
    </div>
  )
}