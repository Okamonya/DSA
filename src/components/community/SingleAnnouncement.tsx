import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Linking } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/features/store";
import { fetchAnnouncementById } from "../../redux/features/announcement/announceActions";
import Ionicons from "@expo/vector-icons/Ionicons";
import LoadingOverlay from "../loader/LoaderOverlay";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../util/colors";

const SingleAnnouncementScreen: React.FC = () => {
    const route = useRoute<RouteProp<{ params: { id: string } }, "params">>();
    const { id } = route.params;
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();

    const { announcement, loading, error } = useSelector((state: RootState) => state.announcements);

    useEffect(() => {
        dispatch(fetchAnnouncementById({ id }));
    }, [id, dispatch]);

    const handleLinkPress = (link: string) => {
        Linking.openURL(link).catch(() =>
            Alert.alert("Error", "Unable to open the link. Please ensure the URL is valid.")
        );
    };

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            
            <StatusBar style="light" backgroundColor={COLORS.primary} />

            {/* <LoadingOverlay visible={loading} /> */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Announcement</Text>
            </View>

            {/* Poster Section */}
            <Image
                source={{ uri: announcement?.image || "https://via.placeholder.com/400x200" }}
                style={styles.poster}
                resizeMode="cover"
            />

            {/* Announcement Details */}
            <View style={styles.announcementDetails}>
                <Text style={styles.announcementTitle}>{announcement?.title}</Text>
                <Text style={styles.announcementDate}>
                    Published on: {new Date(announcement?.date || "").toDateString()}
                </Text>
                <Text style={styles.announcementContent}>{announcement?.content}</Text>
            </View>

            {/* Additional Info */}
            {announcement?.link && (
                <View style={styles.additionalInfo}>
                    <Text style={styles.sectionTitle}>Additional Information</Text>
                    <TouchableOpacity onPress={() => handleLinkPress(announcement.link)}>
                        <Text style={styles.linkText}>View More: {announcement.link}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f6fa", padding: 12 , marginTop: 24},
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    backButton: {
        // marginTop: 10,
        padding: 8,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    headerTitle: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 16,
        color: "#333",
    },
    poster: {
        width: "100%",
        height: 200,
        borderRadius: 20,
        marginBottom: 20,
    },
    announcementDetails: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    announcementTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
    announcementDate: { fontSize: 14, color: "#555", marginBottom: 8 },
    announcementContent: { fontSize: 16, lineHeight: 24, color: "#333" },
    additionalInfo: { marginTop: 16 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
    linkText: {
        fontSize: 14,
        color: "#007aff",
        textDecorationLine: "underline",
        marginTop: 8,
    },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    error: { fontSize: 16, color: "red" },
});

export default SingleAnnouncementScreen;
