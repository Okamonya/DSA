import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Button,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import CustomInput from "../../components/input/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/features/store";
import { register } from "../../redux/features/auth/authActions";
import { Picker } from "@react-native-picker/picker";
import { selectDistricts } from "../../redux/features/field/fieldSelctors";
import { fetchDistricts } from "../../redux/features/field/fielActions";

const RegisterScreen: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [districtId, setDistrictId] = useState<string>("");
    const [errors, setErrors] = useState<ErrorType>({});

    const dispatch = useDispatch<AppDispatch>();
    const districts = useSelector(selectDistricts);

    useEffect(() => {
        dispatch(fetchDistricts());
    }, [dispatch]);

    // Define Error Type
    type ErrorType = {
        username?: string;
        email?: string;
        phoneNumber?: string;
        password?: string;
        confirmPassword?: string;
        districtId?: string;
    };

    const validateForm = (): ErrorType => {
        const validationErrors: ErrorType = {};
        if (!username) validationErrors.username = "full name is required";
        if (!email) validationErrors.email = "Email is required";
        if (!phoneNumber) validationErrors.phoneNumber = "Phone number is required";
        if (!password) validationErrors.password = "Password is required";
        if (password !== confirmPassword)
            validationErrors.confirmPassword = "Passwords do not match";
        if (!districtId) validationErrors.districtId = "District is required";
        return validationErrors;
    };

    const handleRegister = async () => {
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const resultAction = await dispatch(
                    register({ username, email, password, districtId, phoneNumber })
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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Register</Text>
                    <CustomInput
                        label="Full name"
                        placeholder="Enter your full name"
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
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        error={errors.phoneNumber}
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
                    <Text style={styles.label}>Select District</Text>
                    <View style={styles.dropDown}>
                        <Picker
                            selectedValue={districtId}
                            onValueChange={(itemValue) => setDistrictId(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a district..." value="" />
                            {districts.map((district) => (
                                <Picker.Item key={district.id} label={district.name} value={district.id} />
                            ))}
                        </Picker>
                    </View>
                    {errors.districtId && <Text style={styles.errorText}>{errors.districtId}</Text>}
                    <View style={styles.buttonContainer}>
                        <Button title="Register" onPress={handleRegister} />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f6fa" },
    scrollContainer: { flexGrow: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
    label: { fontSize: 16, fontWeight: "bold", marginTop: 16 },
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
    errorText: { color: "red", fontSize: 12 },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
});

export default RegisterScreen;
