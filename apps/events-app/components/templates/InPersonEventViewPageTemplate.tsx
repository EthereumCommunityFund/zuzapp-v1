import { BsArrowRightCircleFill } from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import Button from "../ui/buttons/Button";
import { HiCalendar } from "react-icons/hi";
import { GoLocation } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi";
import { Label } from "../ui/label";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

import Carousel from "../ui/Carousel";
import ResponsiveCarousel from "../ui/Carousel";
import { LockClosed, LocationMarker, UserGroup } from "../ui/icons";
import { EventSpaceDetailsType, EventSpaceUpdateRequestBody } from "@/types";
import { useEventSpace, useEventSpaces } from "@/context/EventSpaceContext";
import { useEffect, useState } from "react";
import RenderHTMLString from "../ui/RenderHTMLString";
import { useQuery } from "react-query";
import { fetchUserEventSpaces } from "@/services/eventSpaceService";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";



interface IInPersonEventViewPageTemplateProps {
	eventSpace: EventSpaceDetailsType;
}



interface IEventLink {
	name: string;
	link: string;
}

export default function InPersonEventViewPageTemplate({ eventSpace }: IInPersonEventViewPageTemplateProps) {
	const {
		// id,
		name,
		event_space_type,
		status,
		start_date,
		end_date,
		description,
		format,
		event_type,
		experience_level,
		eventspacelocation,
		tagline,
		social_links,
		extra_links,
	} = eventSpace;
	const startDate = new Date(start_date);
	const endDate = new Date(end_date);
	const formattedStartDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	const formattedEndDate = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	const [socialLinks, setSocialLinks] = useState<IEventLink[] | undefined>();
	const [extraLinks, setExtraLinks] = useState<IEventLink[] | undefined>();
	const { setEventSpace } = useEventSpace();


	useEffect(() => {
		console.log("InPersonEventSpace", eventSpace);
		setEventSpace(eventSpace);
		if (social_links)
			setSocialLinks(JSON.parse(social_links));
		if (extra_links)
			setExtraLinks(JSON.parse(extra_links));
	}, [social_links, extra_links, eventSpace])



	return (
		<>
			<div className="flex gap-10">
				<div className="w-2/3 flex flex-col rounded-2xl bg-componentPrimary min-w-[600px]"> {/* Information */}
					<div className="rounded-xl p-5">
						<img src={eventSpace.image_url} className="w-full pb-5 rounded-2xl" alt="" height={600} />
					</div>
					<div className="flex flex-col gap-2.5 pb-5 border-b-2 border-white/10 w-full p-5">
						<div className="flex items-center justify-between w-full pb-5">
							<div className="flex flex-col gap-3">
								<div className="flex items-center gap-3 text-[#D7FFC4]/80">
									<LockClosed />
									<span className="font-bold">Zuzalu Residents & Invited Guests</span>
								</div>
								<h2 className="font-semibold text-[30px]">{name}</h2>
								<span className="text-white/80 font-bold">{tagline}</span>
							</div>
							<Button variant="primaryGreen" size="lg" className="rounded-full" leftIcon={BsArrowRightCircleFill}>Apply to Event</Button>
						</div>
						<div className="flex gap-3 text-lg">
							<span className="rounded-full flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold">
								<HiCalendar /> {formattedStartDate} - {formattedEndDate}
							</span>
							<span className="rounded-2xl flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold">
								<LocationMarker /> {eventspacelocation && eventspacelocation[0].address}
							</span>
						</div>
					</div>
					<div className="flex flex-col gap-4 p-5 border-b-2 border-white/10"> {/* About */}
						<h3 className='text-lg font-bold text-white/70'>ABOUT THIS EVENT</h3>
						<h2 className='text-3xl font-bold text-white/80'>What is ZuConnect?</h2>

						<Dialog>
							<DialogTrigger asChild>
								<Button variant="quiet" size="lg" className="rounded-2xl inline-block text-white/70 font-bold hover:text-white">Read Description</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle >About This Event</DialogTitle>
									<DialogDescription className="text-white">
										<RenderHTMLString height="500" htmlString={description} />
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
								<Button variant="quiet" size="lg" className="rounded-2xl inline-block text-white/70 font-bold hover:text-white">View Location</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>About This Event</DialogTitle>
									<Carousel />
								</DialogHeader>
							</DialogContent>
						</Dialog>
					</div>
				</div>
				<div className="w-1/4 flex flex-col px-10 py-5 gap-5 fixed right-0">
					<h2 className="border-b pb-3 text-2xl font-bold border-white/10">Details</h2>
					<div className="flex gap-4 items-center text-lg font-bold">
						<UserGroup />
						<span>14 applied</span>
					</div>
					<div className="flex flex-col gap-2 font-semibold text-sm">
						<div className="flex gap-2 items-center">
							<Label className="opacity-70">Format: </Label>
							<Label className="opacity-100 font-bold text-base">{eventSpace.format.charAt(0).toUpperCase() + eventSpace.format.slice(1)}</Label>
						</div>
						<div className="flex gap-2 items-center">
							<Label className="opacity-70">Type: </Label>
							<Label className="opacity-100 font-bold text-base">{event_type?.join(', ')}</Label>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Label className="opacity-70">Links </Label>
						{extraLinks && extraLinks.map((value: IEventLink, idx: number) => (
							<div className="flex gap-2" key={idx}>
								<Label className="opacity-100 font-bold text-base">{value.name}:</Label>
								<Label className="opacity-100 font-bold text-base">{value.link}</Label>
							</div>
						))}
					</div>
					<div className="flex flex-col gap-2">
						<Label className="opacity-70">Socials </Label>
						{socialLinks && socialLinks.map((value: IEventLink, idx: number) => (

							<div className="flex gap-2" key={idx}>
								<Label className="opacity-100 font-bold text-base">{value.name}:</Label>
								<Label className="opacity-100 font-bold text-base">{value.link}</Label>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export const getServerSideProps = async (ctx: any) => {
	const supabase = createPagesServerClient(ctx);
	let {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session)
		return {
			props: {
				initialSession: null,
				user: null,
			},
		};

	// get profile from session
	const { data: profile, error } = await supabase.from('profile').select('*').eq('uuid', session.user.id);

	return {
		props: {
			initialSession: session,
			user: session?.user,
			profile: profile,
		},
	};
};