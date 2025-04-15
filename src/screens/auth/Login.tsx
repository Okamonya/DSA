import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import CustomInput from "../../components/input/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/features/store";
import { loginUser } from "../../redux/features/auth/authActions";
import { useNavigation } from "@react-navigation/native";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const handleLogin = async () => {
    const validationErrors: { email?: string; password?: string } = {};
    if (!email) validationErrors.email = "Email is required";
    if (!password) validationErrors.password = "Password is required";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(response)) {
          navigation.reset({
            index: 0,
            routes: [{ name: "SplashScreenOne" as never }],
          });
        } else {
          Alert.alert(
            "Login Failed",
            response.payload?.message || "Invalid credentials."
          );
        }
      } catch (err) {
        console.error("Login Error:", err);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <Text
        style={styles.link}
        onPress={() => navigation.navigate("ForgetPassword" as never)}
      >
        Forgot Password?
      </Text>
      <Text
        style={styles.link}
      >
        Don't have an account? Contact Admin.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f6fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  link: { marginTop: 16, color: "#3498db", textAlign: "center" },
});

export default LoginScreen;
