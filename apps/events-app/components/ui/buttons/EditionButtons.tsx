import { HiSave } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import Button from "./Button";

interface IEditionButtons {
  type: string
}

export default function EditionButtons(props: IEditionButtons) {
  const leftButton = props.type === "Event-Space-Details" ? "Discard" : "Discard Track";
  const rightButton = props.type === "Event-Space-Details" ? "Save Edit" : "Add Track";
  return (
    <div className="flex gap-[30px] w-full">
      <Button className="rounded-full w-1/2 flex justify-center" variant="light-dark" size="lg" type="button" leftIcon={AiOutlineClose}>
        <span>{leftButton}</span>
      </Button>
      <Button className="rounded-full w-1/2 flex justify-center" variant="light-blue" size="lg" type="submit" leftIcon={HiSave}>
        <span>{rightButton}</span>
      </Button>
    </div>

  )
}