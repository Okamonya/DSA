import { combineReducers } from "@reduxjs/toolkit";
import tabSlice from "./tab/tabSlice";
import authSlice from "./auth/authSlice";
import announceSlice from "./announcement/announceSlice";
import sessionSlice from "./sessions/sessionSlice";
import trainingSlice from "./course/trainingSlice";
import discussionSlice from "./discussion/discussionSlice";
import resourcesSlice from "./resources/resourcesSlice";
import districtsSlice from "./field/fieldSlice"
import eventSlice from "./event/eventSlice";


const rootReducer = combineReducers({
    tab: tabSlice,
    auth: authSlice,
    announcements: announceSlice,
    sessions: sessionSlice,
    training: trainingSlice,
    discussions: discussionSlice,
    resources: resourcesSlice,
    districts: districtsSlice,
    events: eventSlice
})

export default rootReducer;