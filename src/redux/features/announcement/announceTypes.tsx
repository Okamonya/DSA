export interface Announcement {
    link: string;
    id: string;
    title: string;
    content: string;
    date?: Date;
    createdAt: string;
    updatedAt: string;
}


export interface AnnouncementState {
    announcements: Announcement[];
    announcement: Announcement | null;
    loading: boolean;
    error: string | null;
}

export interface CapturedMessages {
    status_code: number;
    message: string;
}
