import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { District, DistrictState, Field } from "./fieldTypes";
import { fetchDistrictById, fetchDistricts, fetchFields } from "./fielActions";

const initialState: DistrictState = {
    districts: [],
    district: null,
    fields: [],
    loading: false,
    error: null,
};

const districtsSlice = createSlice({
    name: "districts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all districts
            .addCase(fetchDistricts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDistricts.fulfilled, (state, action: PayloadAction<District[]>) => {
                state.loading = false;
                state.districts = action.payload;
            })
            .addCase(fetchDistricts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching districts.";
            })

            // Fetch a single district by ID
            .addCase(fetchDistrictById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDistrictById.fulfilled, (state, action: PayloadAction<District>) => {
                state.loading = false;
                state.district = action.payload;
            })
            .addCase(fetchDistrictById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching district.";
            });

        builder
            // Fetch all districts
            .addCase(fetchFields.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFields.fulfilled, (state, action: PayloadAction<Field[]>) => {
                state.loading = false;
                state.fields = action.payload;
            })
            .addCase(fetchFields.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching districts.";
            });
    },
});

export default districtsSlice.reducer;
