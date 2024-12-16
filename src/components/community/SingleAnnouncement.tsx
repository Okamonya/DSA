import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/features/store";
import { Announcement } from "../../redux/features/announcement/announceTypes";
import { fetchAnnouncementById } from "../../redux/features/announcement/announceActions";

const SingleAnnouncementScreen: React.FC = () => {
    const route = useRoute<RouteProp<{ params: { id: string } }, "params">>();
    const { id } = route.params;
    const dispatch = useDispatch<AppDispatch>();

    const { announcement, loading, error } = useSelector((state: RootState) => state.announcements);

    useEffect(() => {
        dispatch(fetchAnnouncementById({ id }));
    }, [id, dispatch]);

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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{announcement?.title}</Text>
            <Text style={styles.date}>Published on: {new Date(announcement?.date || "").toDateString()}</Text>
            <Text style={styles.content}>{announcement?.content}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 16, backgroundColor: "#f5f6fa" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    date: { fontSize: 14, color: "#888", marginBottom: 16 },
    content: { fontSize: 16, lineHeight: 24, color: "#333" },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    error: { fontSize: 16, color: "red" },
});

export default SingleAnnouncementScreen;
