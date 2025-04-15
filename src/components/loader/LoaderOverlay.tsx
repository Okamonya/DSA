import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { selectTrainingLoading } from "../../redux/features/course/trainingSelectors";
import { useSelector } from "react-redux";
import { selectAnnouncementLoading } from "../../redux/features/announcement/announceSelector";
import { selectSessionLoading } from "../../redux/features/sessions/sessionSelectors";
import { selectLoading } from "../../redux/features/resources/resourceSelectors";
import { selectAuthLoading } from "../../redux/features/auth/authSelectors";
import { selectEventLoading } from "../../redux/features/event/eventSelector";
import { selectDistrictsLoading } from "../../redux/features/field/fieldSelctors";

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  const loadingTrainings = useSelector(selectTrainingLoading);
  const loadingAnnouncements = useSelector(selectAnnouncementLoading);
  const loadingSessions = useSelector(selectSessionLoading);
  const loadingRedources = useSelector(selectLoading);
  const loadingAuth = useSelector(selectAuthLoading);
  const loadingEvent = useSelector(selectEventLoading);
  const loadingDistrict = useSelector(selectDistrictsLoading); 

  const loading = loadingTrainings || loadingAnnouncements || loadingSessions || loadingRedources || loadingAuth || loadingEvent || loadingDistrict;

  if (!loading) {
    return null; // Don't render anything if not loading
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#ffffff" />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // Ensures it's above other UI
  },
  content: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default LoadingOverlay;