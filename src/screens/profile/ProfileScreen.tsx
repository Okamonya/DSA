import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    FlatList,
    Button,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { selectAuthLoading, selectUser } from "../../redux/features/auth/authSelectors";
import { logout } from "../../redux/features/auth/authSlice";
import LoadingOverlay from "../../components/loader/LoaderOverlay";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../util/colors";
import { logoutUser } from "../../redux/features/auth/authActions";

type SettingOption = {
    id: string;
    title: string;
    icon: string;
    onPress: () => void;
};

const ProfileScreen: React.FC = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("John Doe");
    const [email, setEmail] = useState("johndoe@example.com");
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUser);
    const loading = useSelector(selectAuthLoading);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleLogout = async () => {
        // Add your logout logic here
        await dispatch(logoutUser())
    };

    const settingsOptions: SettingOption[] = [
        { id: "1", title: "Account Settings", icon: "person", onPress: () => alert("Account Settings Pressed") },
        { id: "2", title: "Privacy Policy", icon: "lock-closed", onPress: () => alert("Privacy Policy Pressed") },
        { id: "3", title: "Notifications", icon: "notifications", onPress: () => alert("Notifications Pressed") },
        { id: "4", title: "Help & Support", icon: "help-circle", onPress: () => alert("Help & Support Pressed") },
    ];

    const renderSettingOption = ({ item }: { item: SettingOption }) => (
        <TouchableOpacity style={styles.settingOption} onPress={item.onPress}>
            <Ionicons name={item.icon} size={20} color="#4b5574" />
            <Text style={styles.settingText}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={COLORS.primary} />
            {/* Header Section */}
            {/* <LoadingOverlay visible={loading} /> */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={{ uri: profileImage ? profileImage : "https://via.placeholder.com/150" }}
                        style={styles.profileImage}
                    />
                    <Ionicons name="camera" size={20} color="#fff" style={styles.editIcon} />
                </TouchableOpacity>
                <Text style={styles.profileName}>{user?.username}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                {/* <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <Ionicons name="pencil" size={16} color="#fff" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity> */}
            </View>

            {/* Settings Section */}
            <Text style={styles.sectionHeader}>Settings</Text>
            <FlatList
                data={settingsOptions}
                keyExtractor={(item) => item.id}
                renderItem={renderSettingOption}
                contentContainerStyle={styles.settingsList}
            />

            {/* Edit Profile Modal */}
            <Modal visible={isEditing} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter email"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <View style={styles.modalActions}>
                            <Button title="Cancel" onPress={() => setIsEditing(false)} />
                            <Button title="Save" onPress={() => setIsEditing(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f6fa", padding: 16, marginTop: 10 },
    header: {
        position: 'absolute',
        top: 26,
        right: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        zIndex: 10
    },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "#4b5574" },
    logoutButton: {
        backgroundColor: "#4b5574",
        padding: 8,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    profileHeader: { alignItems: "center", marginBottom: 20 },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    editIcon: { position: "absolute", bottom: 10, right: 10, backgroundColor: "#4b5574", padding: 4, borderRadius: 50 },
    profileName: { fontSize: 20, fontWeight: "bold", color: "#4b5574" },
    profileEmail: { fontSize: 14, color: "#6b7280", marginBottom: 10 },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4b5574",
        padding: 10,
        borderRadius: 8,
    },
    editButtonText: { marginLeft: 5, color: "#fff", fontSize: 14 },
    sectionHeader: { fontSize: 16, fontWeight: "bold", color: "#4b5574", marginBottom: 10 },
    settingsList: { paddingHorizontal: 4 },
    settingOption: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    settingText: { marginLeft: 10, fontSize: 14, color: "#4b5574" },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
    modalContent: { backgroundColor: "#fff", borderRadius: 8, padding: 16, width: "90%" },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 16 },
    modalActions: { flexDirection: "row", justifyContent: "space-between" },
});

export default ProfileScreen;
