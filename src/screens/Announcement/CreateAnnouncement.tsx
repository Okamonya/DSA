import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, ScrollView, Alert, Text } from "react-native";
import CustomInput from "../../components/input/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { createAnnouncement } from "../../redux/features/announcement/announceActions";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { Picker } from "@react-native-picker/picker";
import { selectField } from "../../redux/features/field/fieldSelctors";
import { fetchFields } from "../../redux/features/field/fielActions";

const CreateAnnouncementsScreen: React.FC = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        fieldId: "",
    });

    const [error, setError] = useState("");

    const fields = useSelector(selectField);

    useEffect(() => {
        dispatch(fetchFields());
    }, [dispatch]);

    const handleChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveAnnouncement = () => {
        const { title, content, fieldId } = formData;
        if (!title || !content || !fieldId) {
            setError("Please fill all required fields.");
            return;
        }

        try {

            if (user)
                dispatch(createAnnouncement({ data: formData, id: user.id })).then((response) => {

                    if (response.payload?.message === "Announcement created successfully")
                        Alert.alert("Success", "Announcement created successfully!");
                    setFormData({
                        title: "",
                        content: "",
                        fieldId: "",
                    });
                    setError("");
                });
        } catch (error) {
            console.error("Error saving announcement:", error);
            Alert.alert("Error", "Failed to save announcement.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CustomInput
                label="Title"
                placeholder="Enter announcement title"
                value={formData.title}
                onChangeText={(value) => handleChange("title", value)}
            />
            <CustomInput
                label="Content"
                placeholder="Enter announcement content"
                value={formData.content}
                onChangeText={(value) => handleChange("content", value)}
            />
            <Text style={styles.label}>Select District</Text>
            <View style={styles.dropDown}>
                <Picker
                    selectedValue={formData.fieldId}
                    onValueChange={(itemValue) => handleChange("fieldId", itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select a district..." value="" />
                    {fields.map((field) => (
                        <Picker.Item key={field.id} label={field.name} value={field.id} />
                    ))}
                </Picker>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Button title="Save Announcement" onPress={handleSaveAnnouncement} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#f9f9f9",
        marginTop: 20
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 16,
    },
    dropDown: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        height: 40,
        justifyContent: "center",
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    picker: {
        color: "#000",
    },
    errorText: {
        color: "red",
        marginBottom: 16,
    },
});

export default CreateAnnouncementsScreen;
