export interface Event {
    id: number;
    title: string;
    description?: string;
    date: string;
    time: string;
    location: string;
    createdAt: string;
    updatedAt: string;
}

export interface EventState {
    events: Event[];
    event: Event | null;
    loading: boolean;
    error: string | null;
}
