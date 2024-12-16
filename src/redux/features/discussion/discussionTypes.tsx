import { User } from "../auth/authTypes";

export interface Discussion {
    topic: string;
    id: string;
    user: User;
    content: string;
    lastUpdated: string;
    image?: string;
    replies: Reply[];
}


export interface Reply {
    id: string;
    discussionId: string;
    user: User;
    content: string;
    date: string;
};

export interface CapturedMessages {
    status_code: number;
    message: string;
}

export interface DiscussionState {
    discussions: Discussion[];
    discussion: Discussion | null;
    replies: Reply[];
    loading: boolean;
    error: CapturedMessages | null;
}
