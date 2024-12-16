import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import socket from "../../util/socket";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { createReply } from "../../redux/features/discussion/discussionActions";
import { User } from "../../redux/features/auth/authTypes";
import { Reply } from "../../redux/features/discussion/discussionTypes";

type Discussion = {
    id: string;
    user: User;
    topic: string;
    replies: Reply[];
    lastUpdated: string;
    image?: string;
};

const DiscussionDetails: React.FC<{ discussion: Discussion; onClose: () => void }> = ({
    discussion,
    onClose,
}) => {
    const [newReply, setNewReply] = useState<string>("");
    const [replies, setReplies] = useState<Reply[]>(discussion.replies || []);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Listen for new replies in real-time
        socket.on("newReply", (data: { discussionId: string; reply: Reply }) => {
            if (data.discussionId === discussion.id) {
                setReplies((prevReplies) => [...prevReplies, data.reply]);
            }
        });

        // Cleanup the socket listener on component unmount
        return () => {
            socket.off("newReply");
        };
    }, [discussion.id]);

    const handleCreateReply = async () => {
        if (!newReply.trim()) {
            alert("Reply cannot be empty.");
            return;
        }

        try {
            const resultAction = await dispatch(
                createReply({
                    discussionId: discussion.id,
                    content: newReply,
                })
            );

            if (createReply.fulfilled.match(resultAction)) {
                const createdReply = resultAction.payload.reply;

                // Update local state for real-time reflection
                setReplies((prevReplies) => [...prevReplies, createdReply]);

                // Emit reply to Socket.IO for other clients
                socket.emit("newReply", { discussionId: discussion.id, reply: createdReply });

                // Reset input
                setNewReply("");
            } else {
                if (resultAction.payload) {
                    alert(`Failed to create reply: ${resultAction.payload.message}`);
                } else {
                    alert("Failed to create reply. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error creating reply:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={onClose}>
                    <Ionicons name="close" size={24} color="black" />
                </Pressable>
                <Text style={styles.headerTitle}>Comments</Text>
                <View style={{ width: 24 }} /> {/* Spacer for alignment */}
            </View>

            {/* Post Content */}
            <View style={styles.post}>
                <Image
                    source={{ uri: discussion.image || "https://via.placeholder.com/40" }}
                    style={styles.postImage}
                />
                <View style={styles.postDetails}>
                    <Text style={styles.postUser}>{discussion.user?.username}</Text>
                    <Text style={styles.postContent}>{discussion.topic}</Text>
                </View>
            </View>

            {/* Replies List */}
            <FlatList
                data={replies}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.comment}>
                        <Image
                            source={{ uri: "https://via.placeholder.com/40" }}
                            style={styles.commentImage}
                        />
                        <View style={styles.commentDetails}>
                            <Text style={styles.commentUser}>{item.user?.username}</Text>
                            <Text style={styles.commentContent}>{item.content}</Text>
                            <Text style={styles.commentTime}>2h ago</Text>
                        </View>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                style={styles.commentsList}
            />

            {/* Input Box */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Add a comment..."
                    placeholderTextColor="#888"
                    value={newReply}
                    onChangeText={setNewReply}
                />
                <Pressable style={styles.sendButton} onPress={handleCreateReply}>
                    <Ionicons name="send" size={20} color="white" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    post: {
        flexDirection: "row",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    postImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    postDetails: {
        flex: 1,
    },
    postUser: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 4,
    },
    postContent: {
        fontSize: 14,
        color: "#444",
    },
    commentsList: {
        flex: 1,
    },
    comment: {
        flexDirection: "row",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    commentImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    commentDetails: {
        flex: 1,
    },
    commentUser: {
        fontWeight: "bold",
        fontSize: 14,
    },
    commentContent: {
        fontSize: 14,
        color: "#444",
        marginVertical: 4,
    },
    commentTime: {
        fontSize: 12,
        color: "#888",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    textInput: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
        color: "#333",
    },
    sendButton: {
        backgroundColor: "#1E90FF",
        marginLeft: 12,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default DiscussionDetails;
