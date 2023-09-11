import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";

export default function InputWrapper(props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) {
  return (
    <div className="flex bg-[#242727] py-2.5 px-3 rounded-[6px] border gap-[10px] border-opacity-10 border-white self-stretch h-10">{props.children}</div>
  )
}