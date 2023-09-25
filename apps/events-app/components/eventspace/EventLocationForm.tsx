import { useState } from 'react';

import { useRouter } from 'next/router';
import InputWrapper from '../ui/Input-Wrapper';
import TextEditor from '../ui/TextEditor';
import SwitchButton from '../ui/buttons/SwitchButton';
import EventDeatilsDescription1 from '../ui/labels/event-details-description-1';
import InputFieldLabel from '../ui/labels/inputFieldLabel';
import ImageUploadButton from '../ui/buttons/SelectImageButton';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import EditionButtons from '../ui/buttons/EditionButtons';
import { CgClose } from 'react-icons/cg';
import { FaCircleArrowUp } from 'react-icons/fa6';
import DragAndDrop from '../ui/dragDrop';
import IconButton from '../ui/buttons/IconButton';
import { createEventSpaceLocation } from '@/controllers';
import router from 'next/router';
import Image from 'next/image';
import { useQueryClient } from 'react-query';

export default function EventLocationForm({setIsLocationForm}: {setIsLocationForm: React.Dispatch<React.SetStateAction<boolean>>}) {
  const queryClient = useQueryClient()
  const router = useRouter();
  const { eventId } = router.query;
  const [isMainLocation, setIsMainLocation] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const [switchDialogue, setSwitchDialogue] = useState(false)
  const [payload, setPayload] = useState({
    name: '',
    description: '',
    is_main_location: false,
    address: '',
    capacity: 1,
    image_urls: [],
    event_space_id: eventId as string,
  });

  const handleRemoveImage = (index: number) => {
    const updatedItems = [
        ...payload.image_urls.slice(0, index),
        ...payload.image_urls.slice(index + 1),
      ];
      setPayload({...payload, image_urls: updatedItems})
}


  const handleTextEditorChange = (value: string) => {
    setEditorValue(value);
    setPayload({
      ...payload,
      description: value,
    });
  };

  const handleSwitchChange = () => {
    setIsMainLocation((prev) => !prev);
    setPayload({
      ...payload,
      is_main_location: !payload.is_main_location,
    });
  };

  const handleCreateEventLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLocationForm(false)
    console.log(payload);
    try {
      const result = await createEventSpaceLocation(payload);
      queryClient.invalidateQueries({ queryKey: ["locationDetails"] });
      setSwitchDialogue(true)
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleCreateEventLocation} className="flex flex-col p-5 rounded-[10px] border items-start	gap-[30px] self-stretch border-opacity-10 bg-[#2B2E2E]">
      <div className="flex items-center gap-5 opacity-50">
        <span className="font-sans text-base font-semibold leading-[19.2px]">The Dome</span>
      </div>
      <div className="flex flex-col justify-center items-start gap-[10px] self-stretch">
        <div className="flex items-center gap-5 self-stretch">
          <SwitchButton value={isMainLocation} onClick={handleSwitchChange} />
          <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">Main Location</span>
        </div>
        <span className="opacity-70 h-[18px] font-normal text-[13px] leading-[18.2px] tracking-[0.13px] self-stretch">This is the location of the main event</span>
      </div>
      <div className="flex flex-col items-start gap-[14px] self-stretch">
        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Location Name</Label>
        <Input
          className=" bg-inputField"
          placeholder={'Name of this location'}
          onChange={(e) =>
            setPayload({
              ...payload,
              name: e.target.value,
            })
          }
        />
      </div>
      <div className="flex flex-col items-start gap-[14px] self-stretch">
        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Address</Label>
        <Input
          className=" bg-inputField"
          placeholder={'Type the address'}
          onChange={(e) =>
            setPayload({
              ...payload,
              address: e.target.value,
            })
          }
        />
      </div>
      <div className="flex flex-col items-start gap-[14px] self-stretch">
        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Capacity</Label>
        <Input
          className=" bg-inputField"
          placeholder={'Enter a number'}
          type="number"
          min={1}
          onChange={(e) =>
            setPayload({
              ...payload,
              capacity: e.target.value as unknown as number,
            })
          }
        />
      </div>
      <div className="flex flex-col items-start gap-[14px] self-stretch">
        <InputFieldLabel name="Location Description" />
        <TextEditor value={editorValue} onChange={handleTextEditorChange} />
        <EventDeatilsDescription1 name="000 characters left" />
      </div>
      <div className="flex flex-col items-center gap-[10px] self-stretch">
        <InputFieldLabel name="Location Media" />
        <DragAndDrop payload={payload} setPayload={setPayload} />
        <EventDeatilsDescription1 name="We recommend using at least a 2160x1080px" />
      </div>
      {payload.image_urls.length > 0 && (
        <div className="flex gap-5">
          {payload.image_urls.map((source, index) => (
            <div className="w-full" key={index}>
              <div className="rounded-[10px] w-[130px] h-[100px] bg-pagePrimary relative">
                <IconButton variant="dark" className="rounded-full absolute z-10 right-[-5px] top-[-5px]" onClick={() => handleRemoveImage(index)} icon={CgClose} />
                <Image src={source} alt="" fill className="object-contain" />
              </div>
            </div>
          ))}
        </div>
      )}

      <EditionButtons switchDialogue={switchDialogue} type={'location'} leftButtonName={'Discard This Location'} rightButtonName={'Add This Location'} leftButtonIcon={CgClose} rightButtonIcon={FaCircleArrowUp} />
    </form>
  );
}
