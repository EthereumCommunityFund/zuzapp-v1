import { useState, useEffect, useRef } from "react";
import Button from "../ui/buttons/Button";
import { HiUpload } from "react-icons/hi";
import { extractImageMetadata } from "@/controllers/image.controller";

export const EventBanner = ({ banner, setBanner, setBannerMetadata }: any) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);

  const handleChange = async (e: any) => {
    e.preventDefault();
    console.log(e);
    try {
      // const result = await uploadImage(e, 'events');
      const { localImageUrl, file } = extractImageMetadata(e);
      setBanner(localImageUrl);
      setBannerMetadata(file);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
        setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log("Files", files);
  };

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
    <div className="flex flex-col gap-[10px]">
      <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">
        Event Banner
      </h2>
      <div className="flex gap-3 items-end">
        <div
          className="w-[50%] bg-inputField"
          onDragEnter={handleDragEnter}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <input
            placeholder="fileInput"
            className="hidden"
            ref={inputRef}
            type="file"
            onChange={handleChange}
            accept="image/*"
          />
          <div className="w-full h-[204px]">
            <Button
              className="flex flex-col items-center justify-center rounded-[6px] border-dashed text-white border-white border-opacity-10 bg-pagePrimary h-full w-full"
              onClick={openFileExplorer}
            >
              <HiUpload />
              <span className="text-[13px] text-center opacity-50 font-bold leading-[1.2] self-stretch">
                Select Event Header Image
              </span>
              <span className=" text-[10px] tracking-[0.2px] font-normal leading-[1.2] opacity-50">
                DRAG & DROP IMAGE
              </span>
            </Button>
          </div>
        </div>
        <img
          src={banner}
          alt=""
          className="border rounded-lg h-[100px] w-[130px]"
        />
      </div>
    </div>
  );
};
