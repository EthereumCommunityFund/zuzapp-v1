'use client';

import { useRef, useState } from 'react';
import SelectImageButton from './buttons/SelectImageButton';
import InputFieldLabel from './labels/inputFieldLabel';
import ImageUploadButtonDescription from './labels/image-upload-button-description';
import Button from './buttons/Button';
import { HiUpload } from 'react-icons/hi';
import { uploadImage } from '@/controllers/image.controller';
import { Label } from './label';

export default function DragAndDrop({ setPayload, payload, title }: any) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);
  const [imageLink, setImageLink] = useState<any>(payload.image_urls);

  const handleChange = async (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files['length']; i++) {
        setFiles((prevState: any) => [...prevState, e.target.files[i]]);
      }
    }
    try {
      const result = await uploadImage(e, 'events');
      setPayload({
        ...payload,
        image_urls: [...imageLink, result],
      });
      setImageLink([...imageLink, result]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files['length']; i++) {
        setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
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
    inputRef.current.value = '';
    inputRef.current.click();
  }

  return (
    <div
      className="w-full bg-inputField"
      onDragEnter={handleDragEnter}
      // onSubmit={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      <input placeholder="fileInput" className="hidden" ref={inputRef} type="file" multiple={true} onChange={handleChange} accept="image/*" />
      <div className="w-full">
        <Button className="flex flex-col rounded-[6px] cursor-pointer p-2 border-dashed text-white border-white border-opacity-10 bg-pagePrimary h-full w-full" onClick={openFileExplorer}>
          <HiUpload />
          {title ? <Label className="text-[13px] text-center opacity-50 font-bold">{title}</Label> : <Label className="text-[13px] text-center opacity-50 font-bold">Select Event Header Image</Label>}
        </Button>
      </div>
    </div>
  );
}
