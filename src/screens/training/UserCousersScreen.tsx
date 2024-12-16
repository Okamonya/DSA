import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { Course } from "../../redux/features/sessions/sessionTypes";
import CourseCard from "../../components/cards/CourseCard";
import SearchBar from "../../components/search/SearchBar";

const myCourses: Course[] = [
    { id: "1", title: "Leadership Development Essentials", category: "Leadership Training", price: 120, discountPrice: 100, rating: 4.8, studentsEnrolled: 523, status: "ongoing", progress: 65 },
    { id: "2", title: "Church Administration Mastery", category: "Church Management", price: 150, discountPrice: 125, rating: 4.7, studentsEnrolled: 318, status: "completed" },
    { id: "3", title: "Effective Preaching Techniques", category: "Homiletics", price: 200, discountPrice: 180, rating: 4.9, studentsEnrolled: 442, status: "ongoing", progress: 85 },
    { id: "4", title: "Conflict Resolution in Ministry", category: "Interpersonal Skills", price: 100, discountPrice: 85, rating: 4.6, studentsEnrolled: 276, status: "enrolled" },
    { id: "5", title: "Strategic Vision Casting", category: "Leadership Training", price: 130, discountPrice: 110, rating: 4.5, studentsEnrolled: 190, status: "completed" },
    { id: "6", title: "Building Strong Ministry Teams", category: "Team Development", price: 120, discountPrice: 100, rating: 4.7, studentsEnrolled: 360, status: "ongoing", progress: 40 },
];


const UserCoursesScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"ongoing" | "completed" | "enrolled">("ongoing");

    const filteredCourses = myCourses.filter((course) => course.status === activeTab);

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Search in my courses..."
                onFilterPress={() => console.log("Filter my courses")}
            />
            <View style={styles.tabContainer}>
                {["ongoing", "completed", "enrolled"].map((tab) => (
                    <Pressable
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab as "ongoing" | "completed" | "enrolled")}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </Pressable>
                ))}
            </View>
            <FlatList
                data={filteredCourses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CourseCard course={item} />}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', paddingHorizontal: 12, marginTop: 20 },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
    },
    tab: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: "#f0f0f0",
    },
    activeTab: {
        backgroundColor: "#1E90FF",
    },
    tabText: {
        color: "#888",
    },
    activeTabText: {
        color: "#fff",
    },
    list: {
    },
});

export default UserCoursesScreen;
