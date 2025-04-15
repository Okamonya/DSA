import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { TrainingModule } from "../../redux/features/course/trainingTypes";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../navTypes";

interface TrainingCardProps {
    course: TrainingModule;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ course }) => {
    const navigation = useNavigation<AppNavigationProp>();
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SingleCourse', { id: course.id } as never)}
        >
            <Image
                style={styles.image}
                source={{ uri: course.posterUrl || "https://via.placeholder.com/150" }}
            />
            <View style={styles.details}>
                <Text
                    style={styles.title}
                    numberOfLines={1}
                >{course.title}</Text>
                <Text style={styles.category} numberOfLines={5}>
                    {course.description}
                </Text>
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

export default TrainingCard;
