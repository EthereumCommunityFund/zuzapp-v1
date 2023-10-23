import Location from "../ui/Location";
import IconButton from "../ui/buttons/IconButton";
import { RxPlus } from "react-icons/rx";
import EventLocationForm from "./EventLocationForm";
import { useState } from "react";
import Container from "../ui/Container";
import Button from "../ui/buttons/Button";
import { CgClose } from "react-icons/cg";
import { HiPencilAlt } from "react-icons/hi";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  deleteEventSpaceLocation,
  fetchLocationsByEventSpace,
} from "@/controllers";
import { LocationType, LocationUpdateRequestBody } from "@/types";
import EventLocationEdit from "./EventLocationEdit";
import { useQuery, useQueryClient } from "react-query";
import fetchLocationsByEventSpaceId from "@/services/fetchLocationsByEventSpace";

export default function EventLocation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { event_space_id } = router.query;

  const { data, isLoading, isError } = useQuery<
    LocationUpdateRequestBody[],
    Error
  >(
    ["locationDetails", event_space_id], // Query key
    () => fetchLocationsByEventSpaceId(event_space_id as string), // Query function
    {
      enabled: !!event_space_id,
      refetchOnWindowFocus: false, // Only execute the query if event_space_id is available
    }
  );

  const [isLocationForm, setIsLocationForm] = useState<boolean>(false);
  const [savedLocations, setSavedLocations] = useState<
    LocationUpdateRequestBody[]
  >(data as LocationUpdateRequestBody[]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [mainLocation, setMainLocation] = useState(null);

  const handleLocationClick = (id: string) => {
    setSelectedLocation(id);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      const mainLocationData = data.find(savedLocation => savedLocation.is_main_location);
      setMainLocation(mainLocationData);
    }
  }, [data]);

  const handleDeleteLocation = async (id: string, index: number) => {
    try {
      const result = await deleteEventSpaceLocation(
        id,
        event_space_id as string
      );
      console.log(result);
      const updatedItems = [
        ...savedLocations.slice(0, index),
        ...savedLocations.slice(index + 1),
      ];
      setSavedLocations(updatedItems);
      queryClient.invalidateQueries({ queryKey: ["locationDetails"] });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error loading space details</p>;
  }


  console.log(data, "data for saved locations");
  return (
    <div className="flex py-10 px-4 flex-col items-center gap-8 rounded-2xl border border-white border-opacity-10 bg-componentPrimary w-full">
      <div className="w-full flex justify-between">
        <div className="text-[25px] font-normal leading-7.5">Locations</div>
        <div className="text-xl text-right font-bold opacity-70"></div>
      </div>
      {data && data.length > 0 && (
        <div className="flex flex-col gap-5">
          {data?.map((savedLocation, index) => (
            <>
              <div
                key={savedLocation.id}
                className="flex flex-col md:flex-row rounded-[10px] border border-opacity-10 border-white p-3.5 gap-[30px] bg-[#2B2E2E] bg-opacity-10 w-full"
              >
                <div className="flex gap-7">
                <img
                  src={(savedLocation.image_urls as unknown as string)[0]}
                  alt="Avatar"
                  width={42}
                  height={42}
                  className="rounded-[6px]"
                />
                <div className="opacity-50 gap-5 flex items-center w-1/2">
                  <span className="font-semibold text-lg leading-[21.6px] text-white">
                    {savedLocation.name}
                  </span>
                </div>
                </div>

                <div className="flex gap-[10px]">
                  <Button
                    className="rounded-full flex justify-center h-10 "
                    variant="red"
                    size="lg"
                    type="button"
                    leftIcon={CgClose}
                    onClick={() =>
                      handleDeleteLocation(savedLocation.id as string, index)
                    }
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() =>
                      handleLocationClick(savedLocation.id as string)
                    }
                    className="rounded-full flex justify-center h-10 whitespace-nowrap border-none"
                    variant="light"
                    size="lg"
                    type="button"
                    leftIcon={HiPencilAlt}
                  >
                    Edit Location
                  </Button>
                </div>
              </div>
              {selectedLocation === savedLocation.id && (
                <EventLocationEdit
                  setSelectedLocation={setSelectedLocation}
                  savedLocation={savedLocation}
                  mainLocationData={mainLocation}
                />
              )}
            </>
          ))}
        </div>
      )}

      <div className="flex gap-5 w-full">
        <div className="font-semibold text-base leading-[19.px] flex items-center">
          Add a Location
        </div>
        <IconButton
          className="rounded-[40px] py-2.5 px-3.5 bg-[#F1F1F1] bg-opacity-20 border-none"
          icon={RxPlus}
          onClick={() => setIsLocationForm(!isLocationForm)}
        ></IconButton>
      </div>
      {isLocationForm && (
        <EventLocationForm setIsLocationForm={setIsLocationForm} />
      )}
    </div>
  );
}
