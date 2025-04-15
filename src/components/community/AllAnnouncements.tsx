import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { fetchAnnouncements } from "../../redux/features/announcement/announceActions";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { selectAnnouncementError, selectAnnouncementLoading, selectAnnouncements } from "../../redux/features/announcement/announceSelector";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../navTypes";
import LoadingOverlay from "../loader/LoaderOverlay";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../util/colors";

const AllAnnouncementsScreen: React.FC = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const announcements = useSelector(selectAnnouncements);
    const loading = useSelector(selectAnnouncementLoading);
    const error = useSelector(selectAnnouncementError);
    const navigation = useNavigation<AppNavigationProp>();

    useEffect(() => {
        if (user) {
            const id = user.id;
            dispatch(fetchAnnouncements({ id }));
        }
    }, [dispatch, user]);

    const retryFetch = () => {
        if (user) {
            const id = user.id;
            dispatch(fetchAnnouncements({ id }));
        }
    };

    const renderItem = ({ item }: { item: { id: string; title: string; createdAt: string } }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("SingleAnnouncement", { id: item.id })}
        >
            <Text style={styles.cardTitle}>
                {item.title.length > 40 ? `${item.title.substring(0, 40)}...` : item.title}
            </Text>
            <Text style={styles.cardDate}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
                <Button title="Retry" onPress={retryFetch} color="#4b5574" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            <StatusBar style="light" backgroundColor={COLORS.primary} />

            <View style={styles.header}>
                <Text style={styles.headerText}>Announcements</Text>
            </View>
            {/* <LoadingOverlay visible={loading} /> */}
            <FlatList
                data={announcements}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No announcements available.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        marginTop: 24
    },
    header: {
        backgroundColor: "#4b5574",
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    list: {
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    cardDate: {
        fontSize: 14,
        color: "#777",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        fontSize: 16,
        color: "red",
        marginBottom: 16,
        textAlign: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
});

export default AllAnnouncementsScreen;
