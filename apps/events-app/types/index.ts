export type EventSpaceType = {
    name: string;
    event_space_type: 'tracks' | 'schedules';
}


export type EventSpaceUpdateRequestBody = {
    id: string;
    name: string;
    event_space_type: "tracks" | "schedules";
    status: "draft" | "published" | "archived";
    start_date: number;
    end_date: number;
    description: string;
    format: "in-person" | "online" | "hybrid";
    event_type?: string[];
    experience_level?: string[];
    eventspacelocation?: LocationType[];
}
export type EventSpaceCreateRequestBody = {
    name: string;
    event_space_type: "tracks" | "schedules";
}

export type LocationType = {
    id?: string,
    name: string;
    description: string;
    is_main: boolean;
    address: string;
    capacity: number;
    image_urls?: string[];
}



export type ScheduleCreateRequestBody = {
    name: string;
    format: 'in-person' | 'online' | 'hybrid';
    description: string;
    date: Date;
    start_time: number;
    end_time: number;
    all_day?: boolean;
    schedule_frequency: 'once' | 'everyday' | 'weekly';
    images?: string[];
    video_call_link?: string;
    live_stream_url?: string;
    location_id: string;
    event_type?: string[];
    experience_level?: string[];
    limit_rsvp?: boolean;
    rsvp_amount?: number;
    event_space_id: string;
    track_id?: string;
}



export type TrackUpdateRequestBody = {
    id?: string;
    description: string | null;
    event_space_id: string;
    image: string | null;
    name: string;
}

export type TrackCreateRequestBody = {
    description: string;
    event_space_id: string;
    image: string | null;
    name: string;
}





export type QueryWithID = {
    [key: string]: string
}

