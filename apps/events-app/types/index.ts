export type EventSpaceCreateData = {
    name: string;
    event_space_type: 'tracks' | 'schedules';
}

export type EventSpaceUpdateData = {
    name: string;
    event_space_type: "tracks" | "schedules",
    start_date: number;
    end_date: number;
    description: string;
    format: "in-person" | "online" | "hybrid";
    event_type: string[];
    experience_level: string[];
    status: "draft" | "published" | "archived"
}

