import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Agenda } from "react-native-calendars";

interface Event {
  description: string;
  id: string;
  title: string;
  location: string;
  date: string;
}

interface EventCalendarProps {
  events: Event[];
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
  const items: Record<string, Event[]> = events.reduce((acc, event) => {
    const date = event.date.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const handleLinkPress = (link: string) => {
    Linking.openURL(link).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const renderDescription = (description: string | undefined) => {
    if (!description || typeof description !== "string") {
      return null;
    }

    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const parts = description.split(linkRegex);

    return parts.map((part, index) => {
      if (linkRegex.test(part)) {
        return (
          <Text
            key={index}
            style={styles.linkText}
            onPress={() => handleLinkPress(part)}
          >
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Event Calendar</Text>
      <Agenda
        items={items}
        renderItem={(item: Event) => (
          <TouchableOpacity style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventLocation}>{item.location}</Text>
            <Text style={styles.eventLocation}>{renderDescription(item.description)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", marginBottom: 20,
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  eventItem: {
    backgroundColor: "#EDE7F6",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4b0082",
  },
  eventLocation: {
    fontSize: 14,
    color: "#6A5ACD",
  },
  linkText: {
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
});

export default EventCalendar;
