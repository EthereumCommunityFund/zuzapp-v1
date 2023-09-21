import { useState } from 'react';
import { HiSave } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';

import Button from './Button';
import BasicPrompt from '../prompts/basicPrompt';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../dialog';
import Link from 'next/link';
import { BsMap } from 'react-icons/bs';
import { IconType } from 'react-icons';
import { useRouter } from 'next/router';

interface IEditionButtons {
  type: string;
  leftButtonName: string;
  rightButtonName: string;
  leftButtonIcon: IconType;
  rightButtonIcon: IconType;
}

export default function EditionButtons(props: IEditionButtons) {
  const { type, leftButtonName, rightButtonName, leftButtonIcon, rightButtonIcon } = props;
  const router = useRouter();
  const { eventId } = router.query;
  return (
    <>
      <div className="flex gap-[30px] w-full">
        <Button className="rounded-full w-1/2 flex justify-center" variant="light-dark" size="lg" type="button" leftIcon={leftButtonIcon}>
          <span>{leftButtonName}</span>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full w-1/2 flex justify-center" variant="light-blue" size="lg" type="submit" leftIcon={rightButtonIcon}>
              <span>{rightButtonName}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{props.type} saved</DialogTitle>
              <DialogDescription className="text-sm font-bold">You can edit {props.type} in your Dashboard</DialogDescription>
              <DialogFooter className="pt-5 items-center">
                <span className="text-base font-bold">Now go to Tracks and start building your schedules!</span>
                <Link className="w-full" href={props.type === 'track' ? '/dashboard/events/tracks/schedules' : `/dashboard/events/space/tracks?eventId=${eventId}`}>
                  <Button className="rounded-xl flex justify-center w-full" leftIcon={BsMap}>
                    {props.type === 'track' ? 'Go to schedules' : 'Go to track'}
                  </Button>
                </Link>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
