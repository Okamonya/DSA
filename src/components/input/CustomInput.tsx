import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

type CustomInputProps = {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    error?: string;
};

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    error,
}) => (
    <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
        />
        {error && <Text style={styles.error}>{error}</Text>}
    </View>
);

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: "600", marginBottom: 4, color: "#333" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    inputError: { borderColor: "#e74c3c" },
    error: { color: "#e74c3c", fontSize: 12, marginTop: 4 },
});

export default CustomInput;
