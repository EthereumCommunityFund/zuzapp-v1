import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/buttons/Button";
import { useState } from "react";
import { BiLeftArrow } from "react-icons/bi";

export default function EventViewTracksPage() {
	const [currentPage, setCurrentPage] = useState(1);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};
	return (
		<>
			<div className="flex flex-col w-[1000px]">
				<div className="px-2.5 py-2.5 rounded-full gap-[10px]">
					<img src="" alt="event" />
					<div className="flex flex-col">
						<h2 className="font-bold">ZuConnect</h2>
						<span className="font-semibold">A Popup Village of Innovation in the Heart of Istanbul</span>
					</div>
					<Button>Apply to Event</Button>
				</div>
				<div className="p-5">
					<div className="flex flex-col p-2.5 gap-[10px] overflow-hidden">
						{
							<TrackItemCard trackTitle={""} />
						}
					</div>
					<div>
						<Pagination totalPages={10} currentPage={1} onPageChange={handlePageChange} />
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-5 px-5 py-2.5">
				<h2 className="p-3.5 gap-[10px] font-bold border">Tracks: Sort & Filter</h2>
				<div className="p-2.5 gap-5 ">
					<MyDropdown placeholder={""} options={[]} className={"rounded-full text-opacity-70 bg-componentPrimary"} />
					<MyDropdown placeholder={""} options={[]} className={"rounded-full text-opacity-70 bg-componentPrimary"} />
					<MyDropdown placeholder={""} options={[]} className={"rounded-full text-opacity-70 bg-componentPrimary	"} />
				</div>
			</div>
		</>
	)
}