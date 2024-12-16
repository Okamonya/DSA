import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Resource, ResourceState } from "./resourcesTypes";
import {
    fetchResources,
    fetchResourceById,
    createResource,
    updateResource,
    deleteResource,
} from "./resourceActions"

const initialState: ResourceState = {
    resources: [],
    resource: null,
    success: false,
    loading: false,
    error: null,
};

const resourceSlice = createSlice({
    name: "resources",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all resources
            .addCase(fetchResources.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchResources.fulfilled, (state, action: PayloadAction<Resource[]>) => {
                state.loading = false;
                state.resources = action.payload;
            })
            .addCase(fetchResources.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching resources.";
            })

            // Fetch a single resource by ID
            .addCase(fetchResourceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchResourceById.fulfilled, (state, action: PayloadAction<Resource>) => {
                state.loading = false;
                state.resource = action.payload;
            })
            .addCase(fetchResourceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching resource.";
            })

            // Create a new resource
            .addCase(createResource.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createResource.fulfilled, (state, action: PayloadAction<Resource>) => {
                state.loading = false;
                state.resources.push(action.payload);
                state.success = true;
            })
            .addCase(createResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error creating resource.";
            })

            // Update a resource
            .addCase(updateResource.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateResource.fulfilled, (state, action: PayloadAction<Resource>) => {
                state.loading = false;
                const index = state.resources.findIndex((r) => r.id === action.payload.id);
                if (index !== -1) {
                    state.resources[index] = action.payload;
                }
                state.success = true;
            })
            .addCase(updateResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error updating resource.";
            })

            // Delete a resource
            .addCase(deleteResource.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteResource.fulfilled, (state, action) => {
                state.loading = false;
                state.resources = state.resources.filter((r) => r.id !== action.meta.arg);
                state.success = true;
            })
            .addCase(deleteResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error deleting resource.";
            });
    },
});

export default resourceSlice.reducer;
