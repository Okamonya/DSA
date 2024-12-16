import { persistReducer, persistStore } from "redux-persist"
import rootReducer from "./rootReducer"
import { configureStore } from "@reduxjs/toolkit";
import logger from "../middleware/logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { socketMiddleware } from "../middleware/socketMiddleware";


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with middleware and persisted reducer
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist
        }).concat(logger, socketMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store); // Export persistor for the app to rehydrate state

export default store;