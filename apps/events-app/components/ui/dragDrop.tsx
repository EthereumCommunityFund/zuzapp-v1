"use client";

import { useRef, useState } from "react";
import SelectImageButton from "./buttons/SelectImageButton";
import InputFieldLabel from "./labels/inputFieldLabel";
import ImageUploadButtonDescription from "./labels/image-upload-button-description";
import Button from "./buttons/Button";
import { HiUpload } from "react-icons/hi";

export default function DragAndDrop() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);

  const handleChange = (e: any) => {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files["length"]; i++) {
        setFiles((prevState: any) => [...prevState, e.target.files[i]]);
      }
    }
  }

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
        setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  }

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log("Files", files);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    <form
      className="w-full bg-inputField"
      onDragEnter={handleDragEnter}
      onSubmit={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >

      <input
        placeholder="fileInput"
        className="hidden"
        ref={inputRef}
        type="file"
        multiple={true}
        onChange={handleChange}
        accept="image/*"
      />
      <div className="w-full">
        <Button
          className="flex flex-col rounded-[6px] border-dashed text-white border-white border-opacity-10 bg-pagePrimary h-full w-full"
          onClick={openFileExplorer}
        >
          <HiUpload />
          <span className="text-[13px] text-center opacity-50 font-bold leading-[1.2] self-stretch">Select Event Header Image</span>
          <span className=" text-[10px] tracking-[0.2px] font-normal leading-[1.2] opacity-50">DRAG & DROP IMAGE</span>
        </Button>
      </div>
    </form>
  );
}

