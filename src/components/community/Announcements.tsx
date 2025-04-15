import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Announcement } from "../../redux/features/announcement/announceTypes";
import { AppNavigationProp } from "../navTypes";

type AnnouncementsProps = {
    data: Announcement[];
    onViewAll: () => void;
};

const Announcements: React.FC<AnnouncementsProps> = ({ data, onViewAll }) => {
    const navigation = useNavigation<AppNavigationProp>();

    // Slice the first 4 items and add a "View All" placeholder
    const slicedData = data.slice(0, 4).concat({
        id: "view_all",
        title: "View All",
        description: "",
        content: "",
        date: new Date(), // Provide a valid Date object
        createdAt: "",
        updatedAt: "",
    });

    const handleViewAll = () => {
        navigation.navigate("AllAnnouncements");
    };

    const renderAnnouncement = ({ item }: { item: Announcement }) => {
        if (item.id === "view_all") {
            return (
                <TouchableOpacity onPress={handleViewAll} style={[styles.card, styles.viewAllCard]}>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate("SingleAnnouncement", { id: item.id })}
                style={styles.card}
            >
                <Text style={styles.cardTitle}>
                    {item.title.length > 18 ? `${item.title.substring(0, 18)}...` : item.title}
                </Text>
                <Text style={styles.cardDescription}>
                    {item.content.length > 60 ? `${item.content.substring(0, 60)}...` : item.content}
                </Text>
                {/* <Text style={styles.cardDate}>
                    {new Date(item.date || "").toLocaleDateString()}
                </Text> */}
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={slicedData}
            keyExtractor={(item) => item.id}
            renderItem={renderAnnouncement}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
        />
    );
};

const styles = StyleSheet.create({
    horizontalList: {
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        width: 150,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
        color: "#333",
    },
    cardDescription: {
        fontSize: 14,
        marginBottom: 8,
        textAlign: "center",
        color: "#666",
    },
    cardDate: {
        fontSize: 12,
        color: "#999",
        textAlign: "center",
    },
    viewAllCard: {
        backgroundColor: "#e8eaf6",
    },
    viewAllText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4b5574",
        textAlign: "center",
    },
});

export default Announcements;
