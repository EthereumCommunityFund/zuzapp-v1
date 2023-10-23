import React from 'react';
import Button from "./Button";
import { HiUpload } from "react-icons/hi";

interface IProps {
  title: string
}

export default function SelectImageButton(props: IProps) {
  return (
    <Button className="flex flex-col py-[100px] px-3 gap-[10px] self-stretch rounded-[6px] border-dashed text-white border-white border-opacity-10 bg-pagePrimary h-full">
      <HiUpload />
      <span className="text-[13px] text-center opacity-50 font-bold leading-[1.2] self-stretch">{props.title}</span>
    </Button>
  )
}