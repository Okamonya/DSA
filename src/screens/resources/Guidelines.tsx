import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { selectResources } from "../../redux/features/resources/resourceSelectors";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Resource } from "../../redux/features/resources/resourcesTypes";

type Guideline = {
    id: string;
    title: string;
    description: string;
    downloadUrl?: string;
};

const GuidelinesScreen: React.FC = () => {
    const route = useRoute<RouteProp<{ params: { category: string } }, 'params'>>();
    const { category } = route.params;
    const resources = useSelector(selectResources);

    // Filter resources to include only guidelines
    const guidelines: Resource[] = resources.filter(
        (resource) => resource.category === category
    );

    // Render each guideline item
    const renderGuideline = ({ item }: { item: Resource }) => (
        <View style={styles.guidelineCard}>
            <View style={{ width: "50%" }}>
                <Text style={styles.guidelineTitle}>{item.title}</Text>
                <Text style={styles.guidelineDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => {
                    // Handle download logic
                    console.log(`Downloading: ${item.url}`);
                }}
            >
                <Ionicons name="cloud-download-outline" size={20} color="#fff" />
                <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Guidelines</Text>

            {/* List of Guidelines */}
            {guidelines.length > 0 ? (
                <FlatList
                    data={guidelines}
                    keyExtractor={(item) => item.id}
                    renderItem={renderGuideline}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.noGuidelines}>
                    <Ionicons name="alert-circle-outline" size={50} color="#aaa" />
                    <Text style={styles.noGuidelinesText}>No guidelines available</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f6fa",
        paddingHorizontal: 12,
        paddingTop: 20,
        marginTop: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 16,
    },
    listContainer: {
        padding: 6,
    },
    guidelineCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    guidelineTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 4,
    },
    guidelineDescription: {
        fontSize: 14,
        color: "#555",
    },
    downloadButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E90FF",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    downloadButtonText: {
        fontSize: 14,
        color: "#fff",
        marginLeft: 8,
    },
    noGuidelines: {
        alignItems: "center",
        marginTop: 40,
    },
    noGuidelinesText: {
        marginTop: 8,
        fontSize: 16,
        color: "#aaa",
    },
});

export default GuidelinesScreen;
