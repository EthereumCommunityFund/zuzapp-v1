import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";

export default function Container(props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) {
  return (
<<<<<<< HEAD
    <div className="flex py-5 px-4 flex-col items-center gap-8 self-stretch rounded-2xl border border-white border-opacity-10 bg-[#2E3131]">{props.children}</div>
=======
    <div className="flex p-10 flex-col flex-1 flex-shrink-0 flex-grow-0 items-center gap-[10px] self-stretch">{props.children}</div>
>>>>>>> df0c4f1 (feat: add tracks page)
  )
}