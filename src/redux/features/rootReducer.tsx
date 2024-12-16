import { combineReducers } from "@reduxjs/toolkit";
import tabSlice from "./tab/tabSlice";
import authSlice from "./auth/authSlice";
import announceSlice from "./announcement/announceSlice";
import sessionSlice from "./sessions/sessionSlice";
import trainingSlice from "./course/trainingSlice";
import discussionSlice from "./discussion/discussionSlice";
import resourcesSlice from "./resources/resourcesSlice";


const rootReducer = combineReducers({
    tab: tabSlice,
    auth: authSlice,
    announcements: announceSlice,
    sessions: sessionSlice,
    training: trainingSlice,
    discussions: discussionSlice,
    resources: resourcesSlice
})

export default rootReducer;