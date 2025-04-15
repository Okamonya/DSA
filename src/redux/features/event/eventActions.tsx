import { createAsyncThunk } from "@reduxjs/toolkit";
import { Event } from "./eventTypes";
import { eventAPI } from "./eventAPIs";

export const fetchEvents = createAsyncThunk<Event[], string>(
    "events/fetchAll",
    async (id) => {
        return await eventAPI.fetchAll(id);
    });

export const fetchEventById = createAsyncThunk<Event, number>("events/fetchById", async (id) => {
    return await eventAPI.fetchById(id);
});

export const createEvent = createAsyncThunk<Event, Partial<Event>>("events/create", async (data) => {
    return await eventAPI.create(data);
});

export const updateEvent = createAsyncThunk<Event, { id: number; data: Partial<Event> }>(
    "events/update",
    async ({ id, data }) => {
        return await eventAPI.update(id, data);
    }
);

export const deleteEvent = createAsyncThunk<void, number>("events/delete", async (id) => {
    return await eventAPI.delete(id);
});
