import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";
import EditionButtons from "./buttons/EditionButtons";
import { CgClose } from "react-icons/cg";
import { FaCircleArrowDown } from "react-icons/fa6";
import Container from "./Container";

export default function EditionForm(props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) {
      return (
            <div className="py-20">
                  <Container>
                        {props.children}
                        <EditionButtons type={"track"} leftButtonName={"Discard"} rightButtonName={"Add Track"} leftButtonIcon={CgClose} rightButtonIcon={FaCircleArrowDown} />
                  </Container>
            </div>
      )
}