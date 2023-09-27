import { BsArrowRightCircleFill } from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import Button from "../ui/buttons/Button";
import { HiCalendar } from "react-icons/hi";
import { GoLocation } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi";
import { Label } from "../ui/label";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Image from "next/image";
import { DialogOverlay } from "@radix-ui/react-dialog";
import Carousel from "../ui/Carousel";
import ResponsiveCarousel from "../ui/Carousel";

export default function InPersonEventViewPageTemplate() {

	return (
		<>
			<div className="flex gap-10">
				<div className="w-2/3 flex flex-col rounded-2xl bg-componentPrimary min-w-[600px]"> {/* Information */}
					<div className="rounded-xl p-5">
						<img src="/images/1.png" className="w-full pb-5" alt="" height={600} />
					</div>
					<div className="flex flex-col gap-2.5 pb-5 border-b-2 border-white/10 w-full p-5">
						<div className="flex items-center justify-between w-full pb-5">
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-3 text-[#D7FFC4]/80">
									<FiLock />
									<span className="font-bold">Zuzalu Residents & Invited Guests</span>
								</div>
								<h2 className="font-semibold text-[30px]">ZuConnect</h2>
								<span className="text-white/80 font-bold">A Popup Village of Innovation in the Heart of Istanbul</span>
							</div>
							<Button variant="primaryGreen" size="lg" className="rounded-full" leftIcon={BsArrowRightCircleFill}>Apply to Event</Button>
						</div>
						<div className="flex gap-3 text-lg">
							<span className="rounded-full flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold">
								<HiCalendar /> October 8 - October 23
							</span>
							<span className="rounded-2xl flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold">
								<GoLocation /> Beyoglu, Istanbul, Turkey
							</span>
						</div>
					</div>
					<div className="flex flex-col gap-4 p-5 border-b-2 border-white/10"> {/* About */}
						<h3 className='text-lg font-bold text-white/70'>ABOUT THIS EVENT</h3>
						<h2 className='text-3xl font-bold text-white/80'>What is ZuConnect?</h2>
						<p className="text-white/70 font-bold">Embark on a transformative journey at ZuConnect— a two-week popup village in Istanbul where the luminaries of crypto, AI, governance, decentralized science, and culture coalesce. Here, the brightest minds convene to co-work, foster collaborations, and have a joyous time.</p>
						<Dialog>
							<DialogTrigger asChild>
								<Button size="lg" className="rounded-2xl inline-block text-white/70 font-bold">Read Description</Button>
							</DialogTrigger>
							<DialogContent className="w-[700px]">
								<DialogHeader>
									<DialogTitle>About This Event</DialogTitle>
									<DialogDescription className="opacity-80">
										<h2 className="text-2xl font-bold">What is ZuConnect?</h2>
									</DialogDescription>
								</DialogHeader>

							</DialogContent>
						</Dialog>
					</div>
					<div className="flex flex-col gap-3 p-5"> {/*Location */}
						<h2 className="text-xl text-white/70 font-bold">LOCATION</h2>
						<img src="/images/2.png" alt="" className="w-full" width={600} height={600} />
						<h2 className="font-extrabold text-lg">Soho House Istanbul</h2>
						<h3 className="font-bold text-white/70">Beyoğlu, Istanbul, Turkey</h3>
						<Dialog>
							<DialogTrigger asChild>
								<Button className="quiet text-lg rounded-full inline-block text-white/70 font-bold">View Location</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>About This Event</DialogTitle>
									<ResponsiveCarousel />
								</DialogHeader>
							</DialogContent>
						</Dialog>
					</div>
				</div>
				<div className="w-1/4 flex flex-col px-10 py-5 gap-5 fixed right-0">
					<h2 className="border-b pb-3 text-2xl font-bold border-white/10">Details</h2>
					<div className="flex gap-4 items-center text-lg font-bold">
						<HiUserGroup className="opacity-80" />
						<span>14 applied</span>
					</div>
					<div className="flex flex-col gap-2 font-semibold text-sm">
						<div className="flex gap-2 items-center">
							<Label className="opacity-70">Format: </Label>
							<Label className="opacity-100 font-bold text-base">In-Person</Label>
						</div>
						<div className="flex gap-2 items-center">
							<Label className="opacity-70">Type: </Label>
							<Label className="opacity-100 font-bold text-base">Meetup</Label>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label className="opacity-70">Links </Label>
						<Label className="opacity-100 font-bold text-base">Notion</Label>
						<Label className="opacity-100 font-bold text-base">Notion</Label>
					</div>
					<div className="flex flex-col gap-2">
						<Label className="opacity-70">Socials </Label>
						<Label className="opacity-100 font-bold text-base">Youtube</Label>
						<Label className="opacity-100 font-bold text-base">Twitter</Label>
					</div>
				</div>
			</div>
		</>
	)
}