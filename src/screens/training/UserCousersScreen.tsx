import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import CourseCard from "../../components/cards/CourseCard";
import SearchBar from "../../components/search/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { selectUserTrainings } from "../../redux/features/course/trainingSelectors";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { AppDispatch } from "../../redux/features/store";
import { fetchUserTrainings } from "../../redux/features/course/trainingActions";



const UserCoursesScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"In Progress" | "Completed" | "Enrolled">("Enrolled");
    const myCourses = useSelector(selectUserTrainings);
    const user = useSelector(selectUser);

    const dispatch = useDispatch<AppDispatch>();

    const filteredCourses = myCourses.filter((course) => course.status === activeTab);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserTrainings({ userId: user.id }));
        }
    }, [dispatch, user])
    console.log(filteredCourses)
    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Search in my courses..."
                onFilterPress={() => console.log("Filter my courses")}
            />
            <View style={styles.tabContainer}>
                {["Enrolled", "In Progress", "Completed"].map((tab) => (
                    <Pressable
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab as "Enrolled" | "In Progress" | "Completed")}
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
