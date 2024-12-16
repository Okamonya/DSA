export interface Resource {
    category: string;
    id: number;
    title: string;
    description: string;
    type: string;
    url: string;
}

export interface ResourceState {
    resources: Resource[];
    resource: Resource | null;
    success: boolean;
    loading: boolean;
    error: string | null;
}


export interface CapturedMessages {
    status_code: number;
    message: string;
}

