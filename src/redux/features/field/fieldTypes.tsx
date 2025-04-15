export interface District {
    id: number;
    name: string;
    regionId: number; // Assuming a district belongs to a region
}

export interface DistrictState {
    districts: District[];
    district: District | null;
    fields: Field[];
    loading: boolean;
    error: string | null;
}

export interface Field {
    id: number;
    name: string;
}
