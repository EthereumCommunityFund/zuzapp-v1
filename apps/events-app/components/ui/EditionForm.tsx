import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";
import EditionButtons from "./buttons/EditionButtons";

export default function EditionForm(props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) {
  return (
    <div className="flex flex-col w-[800px] items-center py-5 px-4 gap-8 border border-white border-opacity-10 rounded-2xl bg-[#2E3131]">
      {props.children}
      <EditionButtons type={"track"} />
    </div>
  )
}