import { AiOutlineClose } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";
import Button from "../ui/buttons/Button";

export default function EventLocationEditionButtons() {
  return (
    <div className="flex gap-[10px]">
      <Button className="rounded-full flex justify-center" variant="red" size="lg" type="button" leftIcon={AiOutlineClose}>
        <span>Delete</span>
      </Button>
      <Button className="rounded-full flex justify-center border-none" variant="light" size="lg" type="button" leftIcon={HiPencilAlt}>
        <span>Edit Location</span>
      </Button>
    </div>
  )
}