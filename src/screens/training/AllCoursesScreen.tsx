import React, { useEffect, useState, useMemo } from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { selectTrainingModules } from "../../redux/features/course/trainingSelectors";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { fetchTrainingModules } from "../../redux/features/course/trainingActions";
import TrainingCard from "../../components/cards/TrainingCard";
import SearchBar from "../../components/search/SearchBar";

const AllCoursesScreen: React.FC = () => {
    const allCourses = useSelector(selectTrainingModules) || []; // Ensure default empty array
    const user = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();

    // State for search query
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch courses when the component mounts or when the user changes
    useEffect(() => {
        if (user) {
            dispatch(fetchTrainingModules({ userId: user.id }));
        }
    }, [dispatch, user]);

    // Filter courses based on the search query
    const filteredCourses = useMemo(() => {
        if (!searchQuery.trim()) {
            return allCourses; // If search is empty, return all courses
        }
        return allCourses.filter((course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allCourses]);

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Search for courses..."
                onChangeText={setSearchQuery} // Update search query directly
                value={searchQuery} // Controlled input
            />
            <FlatList
                data={filteredCourses} // Use filtered courses
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TrainingCard course={item} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No courses found</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f6fa",
        paddingHorizontal: 12,
        marginTop: 20,
    },
    list: {
        paddingHorizontal: 0,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
    },
});

export default AllCoursesScreen;
