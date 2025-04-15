import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, time, location, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.details}>{date} at {time}</Text>
      <Text style={styles.location}>{location}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    color: "#666",
  },
  location: {
    fontSize: 14,
    color: "#4b5574",
  },
});

export default EventCard;
