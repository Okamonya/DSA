import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { fetchAnnouncements } from "../../redux/features/announcement/announceActions";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { selectAnnouncementError, selectAnnouncementLoading, selectAnnouncements } from "../../redux/features/announcement/announceSelector";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../navTypes";

const AllAnnouncementsScreen: React.FC = () => {
    const user = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>();
    const announcements = useSelector(selectAnnouncements);
    const loading = useSelector(selectAnnouncementLoading);
    const error  = useSelector(selectAnnouncementError);
    const navigation = useNavigation<AppNavigationProp>();

    useEffect(() => {
        if (user) {
            const id = user.id
            dispatch(fetchAnnouncements({ id }));
        }
    }, [dispatch]);

    const renderItem = ({ item }: { item: { id: string; title: string; createdAt: string } }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("SingleAnnouncement", { id: item.id })}
        >
            <Text style={styles.cardTitle}>
                {item.title.length > 40 ? `${item.title.substring(0, 40)}...` : item.title}
            </Text>
            <Text style={styles.cardDate}>{item.createdAt}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#4b5574" />;
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={announcements}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    list: { paddingVertical: 8, paddingHorizontal: 16, gap: 10, marginTop: 20},
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
    cardDate: { fontSize: 14, color: "#888" },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    error: { fontSize: 16, color: "red" },
});

export default AllAnnouncementsScreen;
