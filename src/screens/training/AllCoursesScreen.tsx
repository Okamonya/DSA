import React from "react";
import { FlatList, View, TextInput, StyleSheet } from "react-native";
import { Course } from "../../redux/features/sessions/sessionTypes";
import CourseCard from "../../components/cards/CourseCard";
import SearchBar from "../../components/search/SearchBar";
import { useSelector } from "react-redux";
import { selectTrainingModules } from "../../redux/features/course/trainingSelectors";



const AllCoursesScreen: React.FC = () => {
    const allCourses =  useSelector(selectTrainingModules)
    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Search for courses..."
                onChangeText={(text) => console.log("Searching for:", text)}
            />
            <FlatList
                data={allCourses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CourseCard course={item} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', paddingHorizontal: 12, marginTop: 20 },
    list: {
        paddingHorizontal: 0,
    },
});

export default AllCoursesScreen;
