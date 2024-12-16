import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Session } from "../redux/features/sessions/sessionTypes";

// Define the parameter list for the stack
export type AppStackParamList = {
    SingleAnnouncement: { id: string };
    AllAnnouncements: undefined;
    SingleCourse: { id: string }
    SingleSession: { session: Session }
};

// Define a typed navigation prop
export type AppNavigationProp = StackNavigationProp<AppStackParamList>;

// Define a typed route prop for SingleAnnouncement
export type SingleAnnouncementRouteProp = RouteProp<AppStackParamList, "SingleAnnouncement">;
