import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/auth/Login";
import RegisterScreen from "../screens/auth/Register";
import ForgetPasswordScreen from "../screens/auth/ForgetPassword";
import TabsNavigator from "../navigation/TabNavigator";
import AuthGuard from "./AuthGuard";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SingleCourseScreen from "../screens/training/SingleCourseScreen";
import AllCoursesScreen from "../screens/training/AllCoursesScreen";
import UserCoursesScreen from "../screens/training/UserCousersScreen";
import MonthlyReportingTemplatesScreen from "../screens/resources/MonthlyReportingTemplatesScreen";
import SingleAnnouncementScreen from "../components/community/SingleAnnouncement";
import AllAnnouncementsScreen from "../components/community/AllAnnouncements";
import SingleSessionScreen from "../screens/sessions/SingleSession";
import AllSessionsScreen from "../screens/sessions/AllSessions";
import GuidelinesScreen from "../screens/resources/Guidelines";
import CreateAnnouncementsScreen from "../screens/Announcement/CreateAnnouncement";
import CreateSessionsScreen from "../screens/sessions/CreateSession";
import SplashScreenOne from "../components/splashscreen/SplashScreenOne";
import SplashScreenTwo from "../components/splashscreen/SplashScreenTwo";
import TrainingSplashScreen from "../components/splashscreen/TrainingSplashScreen";
import FSOListPage from "../components/users/Users";
import SuperintendentDetailsScreen from "../components/users/SuperintendentDetails";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SplashScreenOne"
                component={SplashScreenOne}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SplashScreenTwo"
                component={SplashScreenTwo}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="TrainingSplash"
                component={TrainingSplashScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ForgetPassword"
                component={ForgetPasswordScreen}
                options={{ headerShown: false }}
            />
            {/* Protected routes */}
            <Stack.Screen
                name="App"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <TabsNavigator />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="Profile"
                options={{ headerShown: true, title: "Profile" }}
                children={() => (
                    <AuthGuard>
                        <ProfileScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="SingleCourse"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <SingleCourseScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="AllCoursesScreen"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <AllCoursesScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="UserCourses"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <UserCoursesScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="Users"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <FSOListPage />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="SuperintendentDetails"
                component={SuperintendentDetailsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MonthlyTemplates"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <MonthlyReportingTemplatesScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="GuidelinesScreen"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <GuidelinesScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="SingleAnnouncement"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <SingleAnnouncementScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="AllAnnouncements"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <AllAnnouncementsScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="CreateAnnouncement"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <CreateAnnouncementsScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="AllSessions"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <AllSessionsScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="CreateSession"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <CreateSessionsScreen />
                    </AuthGuard>
                )}
            />
            <Stack.Screen
                name="SingleSession"
                options={{ headerShown: false }}
                children={() => (
                    <AuthGuard>
                        <SingleSessionScreen />
                    </AuthGuard>
                )}
            />
        </Stack.Navigator>
    </NavigationContainer>
);

export default AppNavigator;
