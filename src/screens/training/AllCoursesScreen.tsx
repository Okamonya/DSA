import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    FlatList,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
    ScrollView
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { selectTrainingModules, selectTrainingLoading } from "../../redux/features/course/trainingSelectors";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { fetchTrainingModules } from "../../redux/features/course/trainingActions";
import TrainingCard from "../../components/cards/TrainingCard";
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from "../../util/colors";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "./SearchBar";

// Define course categories for filtering
const CATEGORIES = [
    "All",
    "Leadership",
    "Policy",
    "Community",
    "Development"
];

const AllCoursesScreen: React.FC = () => {
    const allCourses = useSelector(selectTrainingModules) || [];
    const isLoading = useSelector(selectTrainingLoading);
    const user = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();

    // State for search and filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Fetch courses when the component mounts or when the user changes
    useEffect(() => {
        if (user) {
            dispatch(fetchTrainingModules({ userId: user.id }));
        }
    }, [dispatch, user]);

    // Filter courses based on the search query and selected category
    const filteredCourses = useMemo(() => {
        let filtered = allCourses;

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter((course) =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter (if not "All")
        if (selectedCategory !== "All") {
            // This is a placeholder - you would need to add category field to your courses
            // or implement your own filtering logic based on your data structure
            filtered = filtered.filter((course) =>
                course.category === selectedCategory ||
                course.title.includes(selectedCategory)
            );
        }

        return filtered;
    }, [searchQuery, selectedCategory, allCourses]);

    const handleCategoryPress = useCallback((category: string) => {
        setSelectedCategory(category);
    }, []);

    const renderCategoryButton = useCallback(({ item }: { item: string }) => (
        <TouchableOpacity
            style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategoryButton
            ]}
            onPress={() => handleCategoryPress(item)}
        >
            <Text
                style={[
                    styles.categoryButtonText,
                    selectedCategory === item && styles.selectedCategoryText
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    ), [selectedCategory, handleCategoryPress]);

    const renderHeader = useCallback(() => (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Courses</Text>
                <View style={styles.headerRight} />
            </View>

            <SearchBar
                placeholder="Search for courses..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >
                {CATEGORIES.map((category) => renderCategoryButton({ item: category }))}
            </ScrollView>
        </View>
    ), [searchQuery, navigation, renderCategoryButton, selectedCategory]);

    const renderEmptyComponent = useCallback(() => (
        <View style={styles.emptyContainer}>
            {isLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <>
                    <Ionicons name="school-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyTitle}>No courses found</Text>
                    <Text style={styles.emptyText}>
                        {searchQuery
                            ? "Try adjusting your search or filters"
                            : "Check back later for new courses"}
                    </Text>
                </>
            )}
        </View>
    ), [isLoading, searchQuery]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.container}>
                {renderHeader()}

                <FlatList
                    data={filteredCourses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TrainingCard course={item} />}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={true}
                    ListEmptyComponent={renderEmptyComponent}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews={true}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    headerContainer: {
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
    },
    headerRight: {
        width: 40,
    },
    searchBar: {
        marginHorizontal: 16,
        marginBottom: 15,
    },
    categoriesContainer: {
        paddingHorizontal: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "transparent",
    },
    selectedCategoryButton: {
        backgroundColor: COLORS.primary + "15", // 15% opacity
        borderColor: COLORS.primary,
    },
    categoryButtonText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    selectedCategoryText: {
        color: COLORS.primary,
        fontWeight: "600",
    },
    list: {
        padding: 16,
        paddingTop: 8,
        paddingBottom: 100, // Add extra padding at the bottom
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        marginTop: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#555",
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        lineHeight: 20,
    },
});

export default AllCoursesScreen;