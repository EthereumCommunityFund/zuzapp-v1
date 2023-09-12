import { GrFormClose } from "react-icons/gr";
import { HiPencilAlt } from "react-icons/hi";
import Button from "../ui/buttons/Button";

export default function EventLocationEditionButtons() {
  return (
    <div className="flex gap-[10px]">
      <Button className="rounded-full flex justify-center" variant="red" size="lg" type="button" leftIcon={GrFormClose}>
        <span>Delete</span>
      </Button>
      <Button className="rounded-full flex justify-center" variant="light" size="lg" type="button" leftIcon={HiPencilAlt}>
        <span>Edit Location</span>
      </Button>
    </div>
  )
}