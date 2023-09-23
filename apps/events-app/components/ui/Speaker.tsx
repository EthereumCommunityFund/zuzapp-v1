import { HiOutlineBan } from "react-icons/hi";

interface IProps {
  title: string;
}
export default function Speaker(props: IProps) {
  const { title } = props;
  return (
    <div className="flex gap-2.5 py-1 px-2 rounded-[28px] bg-trackItemHover items-center">
      <HiOutlineBan />
      <p>{title}</p>
    </div>
  )
}