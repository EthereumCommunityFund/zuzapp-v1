import { useState } from "react";
import { HiSave } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import Button from "./Button";
import BasicPrompt from "../prompts/basicPrompt";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import Link from "next/link";
import { BsMap } from "react-icons/bs";
import { IconType } from "react-icons";
import { useRouter } from "next/router";

interface IEditionButtons {
  type: string;
  leftButtonName: string;
  rightButtonName: string;
  leftButtonIcon: IconType;
  rightButtonIcon: IconType;
  switchDialogue: boolean;
  isLoading: boolean;
}

export default function EditionButtons(props: IEditionButtons) {
  const {
    type,
    leftButtonName,
    rightButtonName,
    leftButtonIcon,
    rightButtonIcon,
    switchDialogue,
    isLoading,
  } = props;
  const router = useRouter();
  const { event_space_id } = router.query;
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-[30px] w-full">
        <Button
          onClick={() => router.back()}
          className="rounded-full w-full lg:w-1/2 flex justify-center"
          variant="quiet"
          size="lg"
          type="button"
          leftIcon={leftButtonIcon}
        >
          <span>{leftButtonName}</span>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              isLoading={isLoading}
              className="rounded-full w-full lg:w-1/2 flex justify-center"
              variant="blue"
              size="lg"
              type="submit"
              leftIcon={rightButtonIcon}
            >
              <span>{rightButtonName}</span>
            </Button>
          </DialogTrigger>
          {switchDialogue && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{props.type} saved</DialogTitle>
                <DialogDescription className="text-sm font-bold">
                  You can edit {props.type} in your Dashboard
                </DialogDescription>
                <DialogFooter className="pt-5 items-center">
                  <span className="text-base font-bold">
                    Now go to Tracks and start building your sessions!
                  </span>
                  <Link
                    className="w-full"
                    href={
                      props.type === "track"
                        ? "/dashboard/events/tracks/schedules"
                        : `/dashboard/events/space/tracks?event_space_id=${event_space_id}`
                    }
                  >
                    <Button
                      className="rounded-xl flex justify-center w-full"
                      leftIcon={BsMap}
                    >
                      {props.type === "track"
                        ? "Go to sessions"
                        : "Go to track"}
                    </Button>
                  </Link>
                </DialogFooter>
              </DialogHeader>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </>
  );
}
