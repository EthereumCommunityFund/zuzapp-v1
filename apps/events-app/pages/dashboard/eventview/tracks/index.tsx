import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import { List } from "@/components/ui/DropDownMenu";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/buttons/Button";
import { DropDownMenuItemType } from "@/types";
import { useRouter } from "next/router";
import { useState } from "react";
import { Option } from "react-dropdown";
import { BiLeftArrow, BiSolidCategory } from "react-icons/bi";

export default function EventViewTracksPage() {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);

	const categoryList: DropDownMenuItemType[] = [
		{
			name: 'Network States',
		},
		{
			name: 'Character Cities',
		},
		{
			name: 'Coordinations',
		},
	]

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleItemClick = () => {
		router.push("/dashboard/eventview/tracks/track");
	}

	return (
		<div className="flex gap-4">
			<div className="flex flex-col w-2/3 pb-10 gap-5">
				<div className="flex px-2.5 rounded-full gap-[10px] h-[60px] justify-between items-center">
					<img src="/images/1.png" className="rounded-lg" width={100} alt="event" />
					<div className="flex flex-col gap-2 w-3/4">
						<h2 className="font-bold text-3xl">ZuConnect</h2>
						<span className="font-semibold opacity-70">A Popup Village of Innovation in the Heart of Istanbul</span>
					</div>
					<Button variant="primaryGreen" className="rounded-[20px] text-base w-[150px] h-10 items-center inline-block">Apply to Event</Button>
				</div>
				<div className="p-5">
					<div className="p-2.5 bg-componentPrimary rounded-2xl">
						<div className="flex flex-col p-2.5 gap-[10px] overflow-hidden">
							{
								<TrackItemCard trackTitle={"Zk Week"} onClick={handleItemClick} />
							}
						</div>
						<div>
							{/* <Pagination totalPages={10} currentPage={1} onPageChange={handlePageChange} /> */}
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-5 px-5 py-2.5 w-1/4 fixed right-0">
				<h2 className="p-3.5 gap-[10px] font-bold">Tracks: Sort & Filter</h2>
				<div className="flex flex-col p-2.5 gap-5 ">
					{/* <MyDropdown placeholder={"Select Categories"} options={[]} className={"rounded-full opacity-70 bg-componentPrimary"} />
					<MyDropdown placeholder={"Select Dates"} options={[]} className={"rounded-full opacity-70 bg-componentPrimary"} />
					<MyDropdown placeholder={"Select Location"} options={[]} className={"rounded-full opacity-70 "} /> */}
					<List data={categoryList} header={"Select Categories"} headerIcon={BiSolidCategory} />
				</div>
			</div>
		</div>
	)
}