// src/navigation/TabsNavigator.tsx
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../util/colors";
import HomeScreen from "../screens/home/Home";
import AllCoursesScreen from "../screens/training/AllCoursesScreen";
import ResourcesScreen from "../screens/resources/ResourcesScreen";
import CommunityScreen from "../screens/community/CommunityScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const getIconColor = (focused: boolean) => ({
    backgroundColor: focused ? COLORS.primaryLighter : COLORS.transparent,
});

const TabsNavigator = () => {
    const dispatch = useDispatch();
    const opened = useSelector((state: { tab: { opened: boolean } }) => state.tab.opened);
    
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                sceneStyle:{backgroundColor: 'transparent'},
                headerShown: false,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <Ionicons
                                name="home"
                                size={24}
                                color={focused ? COLORS.primary : COLORS.primaryLight}
                            />
                        </View>
                    ),
                }}
                listeners={{
                    tabPress: e => opened && e.preventDefault(),
                }}
            />
            <Tab.Screen
                name="training"
                component={AllCoursesScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <Ionicons
                                name="school-outline"
                                size={24}
                                color={focused ? COLORS.primary : COLORS.primaryLight}
                            />
                        </View>
                    ),
                }}
                listeners={{
                    tabPress: e => opened && e.preventDefault(),
                }}
            />
            <Tab.Screen
                name="Resources"
                component={ResourcesScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <Ionicons
                                name="library"
                                size={24}
                                color={focused ? COLORS.primary : COLORS.primaryLight}
                            />
                        </View>
                    ),
                }}
                listeners={{
                    tabPress: e => opened && e.preventDefault(),
                }}
            />
            <Tab.Screen
                name="CommunityScreen"
                component={CommunityScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <Ionicons
                                name="chatbubble-ellipses-outline"
                                size={24}
                                color={focused ? COLORS.primary : COLORS.primaryLight}
                            />
                        </View>
                    ),
                }}
                listeners={{
                    tabPress: e => opened && e.preventDefault(),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIconContainer}>
                            <Ionicons
                                name="person-circle-outline"
                                size={24}
                                color={focused ? COLORS.primary : COLORS.primaryLight}
                            />
                        </View>
                    ),
                }}
                listeners={{
                    tabPress: e => opened && e.preventDefault(),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: 60,
        backgroundColor: COLORS.white,
        borderTopWidth: 0,
        elevation: 10,
    },
    tabIconContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
});

export default TabsNavigator;
