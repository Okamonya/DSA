import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectResources } from "../../redux/features/resources/resourceSelectors";
import { Resource } from "../../redux/features/resources/resourcesTypes";

type Template = {
    id: string;
    title: string;
    description: string;
    downloadUrl: string;
    category: string;
};

const MonthlyReportingTemplatesScreen: React.FC = () => {
    const route = useRoute<RouteProp<{ params: { category: string } }, 'params'>>();
    const { category } = route.params;
    const resources = useSelector(selectResources);
    // Sample Data
    // const templates: Template[] = [
    //     {
    //         id: "1",
    //         title: "January Report Template",
    //         description: "Standard template for preparing January's monthly report.",
    //         downloadUrl: "https://example.com/january-report-template.pdf",
    //     },
    //     {
    //         id: "2",
    //         title: "February Report Template",
    //         description: "Standard template for preparing February's monthly report.",
    //         downloadUrl: "https://example.com/february-report-template.pdf",
    //     },
    //     {
    //         id: "3",
    //         title: "March Report Template",
    //         description: "Standard template for preparing March's monthly report.",
    //         downloadUrl: "https://example.com/march-report-template.pdf",
    //     },
    // ];

    // Filter resources to include only templates
    const templates: Resource[] = resources.filter(
        (resource) => resource.category === category
    );

    // Render each template item
    const renderTemplate = ({ item }: { item: Resource }) => (
        <View style={styles.templateCard}>
            <View
                style={{
                    width: "50%"
                }}>
                <Text style={styles.templateTitle}>{item.title}</Text>
                <Text style={styles.templateDescription}>{item.description}</Text>
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
            <Text style={styles.header}>Monthly Reporting Templates</Text>

            {/* List of Templates */}
            <FlatList
                data={templates}
                keyExtractor={(item) => item.id}
                renderItem={renderTemplate}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f6fa",
        paddingHorizontal: 12,
        paddingTop: 20,
        marginTop: 20
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
    templateCard: {
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
    templateTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 4,
    },
    templateDescription: {
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
});

export default MonthlyReportingTemplatesScreen;
