import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Button,
    ScrollView,
    Alert,
    Platform,
    TextInput,
    Text,
    TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { createSession } from "../../redux/features/sessions/sessionActions";
import { selectSessionLoading } from "../../redux/features/sessions/sessionSelectors";
import LoadingOverlay from "../../components/loader/LoaderOverlay";

const CreateSessionsScreen: React.FC = () => {
    const user = useSelector(selectUser);

    const [formData, setFormData] = useState({
        title: "",
        userId: "",
        description: "",
        sessionType: "",
        location: "",
        facilitator: "",
        link: "",
        date: "",
        startTime: "",
        endTime: "",
    });
    const [error, setError] = useState("");
    const [showPicker, setShowPicker] = useState<{ type: "date" | "time"; field: string } | null>(null);

    const dispatch = useDispatch<AppDispatch>();

    const loading = useSelector(selectSessionLoading)

    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                facilitator: user.username,
                userId: user.id,
            }));
        }
    }, [user]);

    const handleChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleDateChange = (event: any, selectedDate: Date | undefined, field: string) => {
        setShowPicker(null); // Close the picker
        if (selectedDate) {
            const formattedValue =
                field === "date"
                    ? selectedDate.toISOString().split("T")[0] // Format as YYYY-MM-DD
                    : selectedDate.toTimeString().split(" ")[0].slice(0, 5); // Format as HH:MM
            handleChange(field, formattedValue);
        }
    };

    const handleSaveSession = () => {
        const { title, sessionType, location, facilitator, link, date, startTime, endTime } = formData;
        if (!title || !sessionType || !location || !facilitator || !link || !date || !startTime || !endTime) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            dispatch(createSession(formData));
            // setFormData({
            //     title: "",
            //     userId: user?.id || "",
            //     description: "",
            //     sessionType: "",
            //     location: "",
            //     facilitator: user?.username || "",
            //     link: "",
            //     date: "",
            //     startTime: "",
            //     endTime: "",
            // });
            setError("");
        } catch (error) {
            console.error("Error saving session:", error);
            Alert.alert("Error", "Failed to save session.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* <LoadingOverlay visible={loading} /> */}
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter session title"
                value={formData.title}
                onChangeText={(value) => handleChange("title", value)}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter session description"
                value={formData.description}
                onChangeText={(value) => handleChange("description", value)}
            />

            <Text style={styles.label}>Session Type</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. Training, Mentorship"
                value={formData.sessionType}
                onChangeText={(value) => handleChange("sessionType", value)}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter location"
                value={formData.location}
                onChangeText={(value) => handleChange("location", value)}
            />

            <Text style={styles.label}>Facilitator</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter facilitator name"
                value={formData.facilitator}
                onChangeText={(value) => handleChange("facilitator", value)}
            />

            <Text style={styles.label}>Link</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter session link"
                value={formData.link}
                onChangeText={(value) => handleChange("link", value)}
            />

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowPicker({ type: "date", field: "date" })}
            >
                <Text>{formData.date || "Select Date"}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowPicker({ type: "time", field: "startTime" })}
            >
                <Text>{formData.startTime || "Select Start Time"}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowPicker({ type: "time", field: "endTime" })}
            >
                <Text>{formData.endTime || "Select End Time"}</Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={new Date()}
                    mode={showPicker.type}
                    onChange={(event, date) => handleDateChange(event, date, showPicker.field)}
                />
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button title="Save Session" onPress={handleSaveSession} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#f9f9f9",
        marginTop: 20,
        paddingBottom: 30
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    error: {
        color: "#e74c3c",
        fontSize: 14,
        marginBottom: 16,
    },
});

export default CreateSessionsScreen;
