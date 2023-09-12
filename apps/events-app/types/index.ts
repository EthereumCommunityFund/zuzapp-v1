export type EventSpaceType = {
    name: string;
    event_space_type: 'tracks' | 'schedules';
}


export type Location = {
    id?: string, // Location ID should be included when updating a location but omitted when creating a location
    name: string;
    description: string;
    is_main: boolean;
    address: string;
    capacity: number;
    image_urls?: string[];
}

// export type Location = {
//     address?: string | undefined;
//     capacity?: number | undefined;
//     description?: string | null | undefined;
//     is_main: boolean;
//     id?: string | undefined;
//     image_urls?: string[] | null | undefined;
//     name?: string | undefined;
// }


export type EventSpaceData = {
    id: string;
    name: string;
    event_space_type: "tracks" | "schedules";
    start_date: number;
    end_date: number;
    description: string;
    format: "in-person" | "online" | "hybrid";
    event_type?: string[];
    experience_level?: string[];
    status: "draft" | "published" | "archived";
    eventspacelocation?: Location[];
}


export type QueryWithID = {
    [key: string]: string
}

