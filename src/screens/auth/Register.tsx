import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import CustomInput from "../../components/input/CustomInput";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { register } from "../../redux/features/auth/authActions";

const RegisterScreen: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [region, setRegion] = useState("");
    const [errors, setErrors] = useState<{
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        role?: string;
        region?: string;
    }>({});
    const dispatch = useDispatch<AppDispatch>();

    const handleRegister = async () => {
        // Validation
        const validationErrors: {
            username?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
            role?: string;
            region?: string;
        } = {};
        if (!username) validationErrors.username = "Username is required";
        if (!email) validationErrors.email = "Email is required";
        if (!password) validationErrors.password = "Password is required";
        if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";
        if (!role) validationErrors.role = "Role is required";
        if (!region) validationErrors.region = "Region is required";

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                // Dispatch the registration action
                const resultAction = await dispatch(
                    register({ username, email, password, role, region })
                );

                if (register.fulfilled.match(resultAction)) {
                    Alert.alert("Success", "User registered successfully");
                } else if (register.rejected.match(resultAction)) {
                    Alert.alert(
                        "Error",
                        resultAction.payload?.message || "Failed to register user"
                    );
                }
            } catch (error) {
                Alert.alert("Error", "An unexpected error occurred");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <CustomInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                error={errors.username}
            />
            <CustomInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
            />
            <CustomInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
            />
            <CustomInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                error={errors.confirmPassword}
            />
            <CustomInput
                label="Role"
                placeholder="Enter your role"
                value={role}
                onChangeText={setRole}
                error={errors.role}
            />
            <CustomInput
                label="Region"
                placeholder="Enter your region"
                value={region}
                onChangeText={setRegion}
                error={errors.region}
            />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#f5f6fa" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
});

export default RegisterScreen;
