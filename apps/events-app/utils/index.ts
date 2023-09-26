import { NextApiResponse } from "next";
import { EventSpaceUpdateRequestBody, LocationType } from "@/types";
export const formatTimestamp = (date: Date) => {
    console.log(date)
    // if (typeof (date) !== "string") return null;
    return new Date(date).toISOString();
}


function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(array: T[]): T {
    const randomIndex = getRandomInt(0, array.length - 1);
    return array[randomIndex];
}

function generateRandomLocation(): LocationType {
    const locationNames = ["Location A", "Location B", "Location C", "Location D"];
    const addresses = ["123 Main St", "456 Side St", "789 Back St", "101 High St"];
    const descriptions = ["Great place!", "Cozy and comfortable", "Spacious and bright", "Central location"];

    return {
        name: getRandomElement(locationNames),
        description: getRandomElement(descriptions),
        is_main_location: Math.random() < 0.5,
        address: getRandomElement(addresses),
        capacity: getRandomInt(50, 200),
        image_urls: [`https://example.com/image${getRandomInt(1, 5)}.jpg`]
    };
}





export const generateRandomEventSpaceUpdateData = (id: string, event_space_type: "tracks" | "schedules"): EventSpaceUpdateRequestBody => {
    const formats = ["in-person", "online", "hybrid"];
    const statuses = ["draft", "published", "archived"];
    const eventTypes = ["General", "Special", "Workshop", "Seminar"];
    const experienceLevels = ["beginner", "intermediate", "advanced"];

    return {
        id,
        name: `Sample Event ${getRandomInt(1, 100)}`,
        event_space_type: event_space_type,
        start_date: Date.now() - getRandomInt(1, 5) * 24 * 60 * 60 * 1000 as unknown as  Date,// Random date within the last 5 days
        end_date: (Date.now() + getRandomInt(1, 5) * 24 * 60 * 60 * 1000) as unknown as  Date,// Random date within the next 5 days
        description: `Random event description ${getRandomInt(1, 1000)}`,
        // @ts-ignore
        format: "in-person",
        event_type: [getRandomElement(eventTypes)],
        experience_level: [getRandomElement(experienceLevels)],
        status: "draft",
    };
}


// eventspacelocation: [generateRandomLocation(), generateRandomLocation(), generateRandomLocation()]
