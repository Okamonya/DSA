import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    Button,
    Image,
    ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import DiscussionDetails from "./DiscussionDetatils";
import Announcements from "../../components/community/Announcements";
import { useDispatch, useSelector } from "react-redux";
import { selectAnnouncements } from "../../redux/features/announcement/announceSelector";
import socket from "../../util/socket";
import { api } from "../../redux/api";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { AppDispatch } from "../../redux/features/store";
import { createDiscussion, fetchDiscussions } from "../../redux/features/discussion/discussionActions";
import { selectDiscussions } from "../../redux/features/discussion/discussionSelectors";
import { addDiscussion, addReply } from "../../redux/features/discussion/discussionSlice";
import { Discussion } from "../../redux/features/discussion/discussionTypes";


const CommunityScreen: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDiscussionVisible, setIsDiscussionVisible] = useState(false);
    const [newDiscussion, setNewDiscussion] = useState("");
    const [replyInput, setReplyInput] = useState("");
    const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const announcements = useSelector(selectAnnouncements);
    const discussions = useSelector(selectDiscussions);
    const user = useSelector(selectUser);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchDiscussions());
        setupSocketListeners();
    }, [dispatch, addReply, user, newDiscussion]);

    const setupSocketListeners = () => {
        socket.on("newDiscussion", (discussion: Discussion) => {
            dispatch(addDiscussion(discussion));
        });

        socket.on("newReply", ({ discussionId, reply }) => {
            dispatch(addReply({ discussionId, reply }));
        });
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleCreateDiscussion = async () => {
        if (!newDiscussion.trim()) {
            alert("Discussion topic cannot be empty.");
            return;
        }

        setLoading(true);

        try {
            const response = await dispatch(
                createDiscussion({
                    topic: newDiscussion,
                    image: selectedImage || undefined,
                    userId: user?.id,
                })
            );

            const createdDiscussion = response.payload;

            // Emit new discussion to Socket.IO for real-time updates
            socket.emit("newDiscussion", createdDiscussion);


            dispatch(fetchDiscussions());
            // Reset modal state 
            setNewDiscussion("");
            setSelectedImage(null);
            setIsModalVisible(false);
        } catch (error) {
            console.error("Failed to create discussion:", error);
            alert("Failed to create discussion. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleDiscussionSelect = (discussion: Discussion) => {
        setSelectedDiscussion(discussion);
        setIsDiscussionVisible(true);
    };

    const sortedDiscussions = [...discussions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const renderDiscussion = ({ item }: { item: Discussion }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleDiscussionSelect(item)}
        >
            <Text style={styles.cardTitle}>{item.user?.username}</Text>
            <Text style={styles.cardDescription}>{item.topic}</Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
            <View style={styles.discussionMeta}>
                <Text style={styles.metaText}>{item.replies?.length} Replies</Text>
                <Text style={styles.metaText}>Last Updated: {item.lastUpdated}</Text>
            </View>
        </TouchableOpacity>
    );


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Community</Text>

            {/* Announcements Section */}
            <Text style={styles.sectionHeader}>Announcements</Text>
            <Announcements data={announcements} onViewAll={() => console.log("View All Announcements")} />

            {/* Discussions Section */}
            <Text style={styles.sectionHeader}>Discussions</Text>
            <TouchableOpacity
                style={styles.addDiscussionButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.addDiscussionText}>Start a Discussion</Text>
            </TouchableOpacity>

            {loading ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text style={{ color: "red" }}>{error}</Text>
            ) : (
                <FlatList
                    data={[...discussions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
                    keyExtractor={(item) => item.id}
                    renderItem={renderDiscussion}
                />
            )}

            {/* Add Discussion Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>New Discussion</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your discussion topic..."
                            value={newDiscussion}
                            onChangeText={setNewDiscussion}
                        />
                        {selectedImage && (
                            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                        )}
                        <Button title="Add Image" onPress={pickImage} />
                        <View style={styles.modalActions}>
                            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
                            <Button title="Post" onPress={handleCreateDiscussion} />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Discussion Details */}
            {selectedDiscussion && (
                <Modal visible={isDiscussionVisible} animationType="slide">
                    <DiscussionDetails
                        discussion={selectedDiscussion}
                        onClose={() => setIsDiscussionVisible(false)}
                    />
                </Modal>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#f5f6fa", marginTop: 20,
        paddingTop: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#4b5574",
        paddingHorizontal: 12,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 1,
        color: "#4b5574",
        textAlign: "center",
        paddingHorizontal: 12,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
    cardDescription: { fontSize: 14, marginBottom: 8 },
    cardDate: {
        fontSize: 12,
        color: "#888",
    },
    horizontalList: {
        padding: 6,
        paddingHorizontal: 16,
    },
    cardImage: { width: "100%", height: 150, borderRadius: 8, marginBottom: 8 },
    discussionMeta: { flexDirection: "row", justifyContent: "space-between" },
    metaText: { fontSize: 12, color: "#888" },
    addDiscussionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4b5574",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        marginHorizontal: 12,
        paddingHorizontal: 12,
    },
    addDiscussionText: { color: "#fff", marginLeft: 8, fontSize: 16, fontWeight: "bold" },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
    modalContent: { backgroundColor: "#fff", borderRadius: 8, padding: 16, width: "90%" },
    modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
    textInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 16 },
    selectedImage: { width: "100%", height: 150, borderRadius: 8, marginVertical: 16 },
    modalActions: { flexDirection: "row", justifyContent: "space-between" },
});

export default CommunityScreen;
