import { RootState } from "../store";

export const selectDistricts = (state: RootState) => state.districts.districts;

export const selectDistrict = (state: RootState) => state.districts.district;

export const selectDistrictsLoading = (state: RootState) => state.districts.loading;

export const selectDistrictsError = (state: RootState) => state.districts.error;

export const selectField = (state: RootState) => state.districts.fields;
