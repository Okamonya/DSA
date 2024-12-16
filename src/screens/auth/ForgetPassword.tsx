import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import CustomInput from "../../components/input/CustomInput";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { forgotPassword } from "../../redux/features/auth/authActions";
import { clearForgotPasswordState } from "../../redux/features/auth/authSlice";

const ForgetPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | undefined>();
    const dispatch = useDispatch<AppDispatch>();

    const handleResetPassword = async () => {
        try {
            const response = await dispatch(
                forgotPassword({ email })
            ).unwrap(); // Unwrap the response to handle success/error
            if (response?.message) {
                Alert.alert("Success", response.message);
            } else {
                Alert.alert("Error", "An unknown error occurred. Please try again.");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to send reset link. Please try again.");
        }
    };

    const handleClear = () => {
        dispatch(clearForgotPasswordState());
        setEmail("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.description}>
                Enter your email address, and we'll send you a link to reset your password.
            </Text>
            <CustomInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                error={error}
            />
            <Button title="Send Reset Link" onPress={handleResetPassword} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f6fa",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: "#555",
        marginBottom: 24,
    },
});

export default ForgetPasswordScreen;
