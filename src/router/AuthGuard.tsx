import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { View, ActivityIndicator, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../redux/features/store";

const AuthGuard: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation();

    useEffect(() => {
        if (!token || !isAuthenticated) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" as never }],
            });
        }
    }, [token, isAuthenticated, navigation]);

    if (!isAuthenticated && !token) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
                <Text>Authenticating...</Text>
            </View>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
