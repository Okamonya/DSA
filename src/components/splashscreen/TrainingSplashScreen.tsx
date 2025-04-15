import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { updateUser } from "../../redux/features/auth/authActions";
import { selectUser } from "../../redux/features/auth/authSelectors";
import {
    selectTrainingLoading,
    selectUserTrainings,
} from "../../redux/features/course/trainingSelectors";
import { fetchUserTrainings } from "../../redux/features/course/trainingActions";
import TrainingCard from "../cards/TrainingCard";

const TrainingSplashScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUser);
    const trainingModules = useSelector(selectUserTrainings);
    const isLoading = useSelector(selectTrainingLoading);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserTrainings({ userId: user.id }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (trainingModules?.length && trainingModules.every(item => item.status === "Completed")) {
            handleTrainingComplete();
        }
    }, [trainingModules]);

    const handleTrainingComplete = async () => {
        const data = { hasSeenTraining: true };
        if (user) {
            await dispatch(updateUser({ user_id: user.id, formData: data }));
            navigation.navigate("App" as never);
        }
    };

    const handleSkipTraining = () => {
        navigation.navigate("App" as never);
    };

    return (
        <ImageBackground
            source={{
                uri: "https://via.placeholder.com/600x800/4b5574/ffffff?text=Training+Splash",
            }}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>Welcome to the Training!</Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                ) : (
                    <FlatList
                        data={trainingModules?.filter(item => item.status !== "Completed") || []}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TrainingCard course={item.trainingModule} />
                        )}
                        ListEmptyComponent={
                            <Text style={styles.emptyMessage}>
                                No training modules assigned yet.
                            </Text>
                        }
                        style={styles.list}
                    />
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkipTraining}
                        disabled={isLoading}
                    >
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.completeButton}
                        onPress={handleTrainingComplete}
                        disabled={isLoading}
                    >
                        <Text style={styles.completeButtonText}>
                            {isLoading ? "Loading..." : "Finish Training"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: "#d3d3d3",
        textAlign: "center",
        marginBottom: 20,
    },
    list: {
        flex: 1,
        marginBottom: 20,
    },
    emptyMessage: {
        fontSize: 16,
        color: "#ffffff",
        textAlign: "center",
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    skipButton: {
        backgroundColor: "#d9534f",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    skipButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
    },
    completeButton: {
        backgroundColor: "#f5a623",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
    },
});

export default TrainingSplashScreen;
