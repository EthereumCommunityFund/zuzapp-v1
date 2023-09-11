import { HiSave } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import Button from "../ui/buttons/Button";

export default function EventEditionButtons() {
  return (
    <div className="flex gap-[30px]">
      <Button className="rounded-full w-1/2 flex justify-center" variant="light-dark" size="lg" type="button" leftIcon={AiOutlineClose}>
        <span>Discard</span>
      </Button>
      <Button className="rounded-full w-1/2 flex justify-center" variant="light-blue" size="lg" type="submit" leftIcon={HiSave}>
        <span>Save Edit</span>
      </Button>
    </div>

  )
}