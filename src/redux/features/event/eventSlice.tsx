// slices/eventSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventState, Event } from "./eventTypes";
import { fetchEvents, fetchEventById, createEvent, updateEvent, deleteEvent } from "./eventActions";

const initialState: EventState = {
    events: [],
    event: null,
    loading: false,
    error: null,
};

const eventSlice = createSlice({
    name: "events",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to fetch events.";
            })
            .addCase(fetchEventById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEventById.fulfilled, (state, action: PayloadAction<Event>) => {
                state.loading = false;
                state.event = action.payload;
            })
            .addCase(fetchEventById.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to fetch event.";
            });
    },
});

export default eventSlice.reducer;
