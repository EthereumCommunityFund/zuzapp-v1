import { BsArrowRightCircleFill } from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import Button from "../ui/buttons/Button";
import { HiCalendar } from "react-icons/hi";
import { GoLocation } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi";

type EventPageProps = {
	eventName: string;
}

export default function EventViewPageTemplate(
) {
	return (
		<>
			<div className=" rounded-full px-3 py-3 bg-componentPrimary border-solid"> {/* Information */}
				<img src="" alt="" width={600} height={600} />
				<div className="flex flex-col gap-3 border-solid">
					<div className="flex">
						<div className="flex flex-col gap-2">
							<span><FiLock />Zuzalu Residents & Invited Guests</span>
							<h2 className="font-semibold">ZuConnect</h2>
							<span className="font-semibold opacity-70">ZuConnect</span>
						</div>
						<Button leftIcon={BsArrowRightCircleFill}>Apply to Event</Button>
					</div>
					<div className="flex gap-3">
						<span className="rounded-full flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold">
							<HiCalendar /> October 8 - October 23
						</span>
						<span className="rounded-full flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold">
							<GoLocation /> Beyoglu, Istanbul, Turkey
						</span>
						<span className="rounded-full flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold">
							<FiLock /> Zuzalu Residents Only
						</span>
					</div>
				</div>
				<div className="flex flex-col gap-4"> {/* About */}
					<h3 className='text-base font-semibold'>ABOUT THIS EVENT</h3>
					<h2 className='text-base font-semibold'>What is ZuConnect?</h2>
					<p>Embark on a transformative journey at ZuConnect— a two-week popup village in Istanbul where the luminaries of crypto, AI, governance, decentralized science, and culture coalesce. Here, the brightest minds convene to co-work, foster collaborations, and have a joyous time.</p>
					<Button >Read Description</Button>
				</div>
				<div className="flex flex-col gap-2"> {/*Location */}
					<img src="" alt="" width={600} height={600} />
					<h2>Soho House Istanbul</h2>
					<h3>Beyoğlu, Istanbul, Turkey</h3>
					<Button >View Location</Button>
				</div>
			</div>
			<div>
				<h2 className="border">Details</h2>
				<div className="flex flex-col gap-4">
					<span><HiUserGroup />14 applied</span>
				</div>
				<div>
					<span>Format: InPerson</span>
					<span>Type: Meetup</span>
				</div>
				<div>
					<span>Links</span>
					<span>Notion</span>
				</div>
				<div>
					<span>Format: InPerson</span>
					<span>Type: Meetup</span>
				</div>
				<div>
					<span>Socials</span>
					<span>Youtube</span>
					<span>Twitter</span>
				</div>
			</div>
		</>
	)
}