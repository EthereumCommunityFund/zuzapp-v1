import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react";

export default function Container(props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) {
  return (
    <div className="flex py-10 px-4 flex-col items-center gap-8 self-stretch rounded-2xl border border-white border-opacity-10 bg-componentPrimary max-w-[800px] mx-auto">{props.children}</div>
  )
}