import Avvvatars from 'avvvatars-react';
import { HiOutlineBan } from 'react-icons/hi';

interface IProps {
  title: string;
}
export default function Speaker(props: IProps) {
  const { title } = props;
  return (
    <div className="flex gap-2.5 py-1 px-2 rounded-[28px] bg-itemBgPrimary items-center w-fit">
      <Avvvatars value={title} style="shape" size={20} />
      <p>{title}</p>
    </div>
  );
}
