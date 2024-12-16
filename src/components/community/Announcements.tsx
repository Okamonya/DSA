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

    const handleViewAll = async () => {
        navigation.navigate('AllAnnouncements')
    }

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
                    {item.title.length > 18 ? `${item.title.substring(0, 20)}...` : item.title}
                </Text>
                <Text style={styles.cardDescription}>
                    {item.content.length > 80 ? `${item.content.substring(0, 80)}...` : item.content}
                </Text>
                <Text style={styles.cardDate}>{item.createdAt}</Text>
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
        gap: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        width: 160,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },
    cardDescription: {
        fontSize: 14,
        marginBottom: 8,
        textAlign: "center",
    },
    cardDate: {
        fontSize: 12,
        color: "#888",
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
