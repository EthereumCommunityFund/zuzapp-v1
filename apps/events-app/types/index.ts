export type EventSpaceCreateData = {
    name: string;
    event_space_type: 'tracks' | 'schedules';
}


export type Location = {
    id?: string, // Location ID should be included when updating but omitted when creating
    name: string;
    description: string;
    is_main: boolean;
    address: string;
    capacity: number;
    image_urls?: string[];
}

export type EventSpaceUpdateData = {
    name: string;
    event_space_type: "tracks" | "schedules";
    start_date: number;
    end_date: number;
    description: string;
    format: "in-person" | "online" | "hybrid";
    event_type: string[];
    experience_level: string[];
    status: "draft" | "published" | "archived";
    locations?: Location[];   // Locations array should contain at least one item
}

export type QueryWithID = {
    [key: string]: string
}

