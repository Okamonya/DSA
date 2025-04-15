import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TrainingModule, UserTraining } from "../../redux/features/course/trainingTypes";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../navTypes";

interface CourseCardProps {
    course: UserTraining;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const navigation = useNavigation<AppNavigationProp>();
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SingleCourse', { id: course.trainingModule?.id } as never)}
        >
            <Image
                style={styles.image}
                source={{ uri: course.trainingModule?.posterUrl || "https://via.placeholder.com/150" }}
            />
            <View style={styles.details}>
                <Text
                    style={styles.title}
                    numberOfLines={1}
                >{course.trainingModule?.title}</Text>
                <Text style={styles.category} numberOfLines={5}>
                    {course.trainingModule?.description}
                </Text>
                <Text style={styles.students}>{course.studentsEnrolled} Students</Text>

                {/* Show progress for ongoing courses */}
                {course.status === "ongoing" && course.progress !== undefined && (
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>Progress: {course.progress}%</Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progress,
                                    { width: `${course.progress}%` }, // Dynamically set the width based on progress
                                ]}
                            />
                        </View>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        margin: 6,
        borderRadius: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginRight: 10,
    },
    details: {
        flex: 1,
        justifyContent: "space-between",
        padding: 10,
    },
    title: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 4,
        color: "#333",
    },
    category: {
        color: "#888",
        fontSize: 12,
        lineHeight: 16,
    },
    students: {
        color: "#555",
        fontSize: 12,
        marginTop: 8,
    },
    progressContainer: {
        marginTop: 10,
    },
    progressText: {
        fontSize: 12,
        color: "#444",
        marginBottom: 4,
    },
    progressBar: {
        height: 6,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        overflow: "hidden",
    },
    progress: {
        height: "100%",
        backgroundColor: "#1E90FF",
        borderRadius: 5,
    },
});

export default CourseCard;
