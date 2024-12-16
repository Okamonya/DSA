import SecureStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token: string) => {
    await SecureStorage.setItem("authToken", token);
};

export const getToken = async (): Promise<string | null> => {
    return await SecureStorage.getItem("authToken");
};

export const removeToken = async () => {
    await SecureStorage.removeItem("authToken");
};
