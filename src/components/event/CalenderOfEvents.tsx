"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking, ActivityIndicator } from "react-native"
import { Calendar } from "react-native-calendars"
import { Ionicons } from "@expo/vector-icons"

interface Event {
  description: string
  id: string
  title: string
  location: string
  date: string
}

interface EventCalendarProps {
  events: Event[]
  isLoading?: boolean
}

interface MarkedDates {
  [date: string]: {
    marked: boolean
    dotColor: string
  }
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, isLoading = false }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Process events by date
  const eventsByDate = useMemo(() => {
    const result: Record<string, Event[]> = {}

    events.forEach((event) => {
      const date = event.date.split("T")[0]
      if (!result[date]) {
        result[date] = []
      }
      result[date].push(event)
    })

    return result
  }, [events])

  // Create marked dates for the calendar
  const markedDates = useMemo(() => {
    const result: MarkedDates = {}

    // Mark dates that have events
    Object.keys(eventsByDate).forEach((date) => {
      result[date] = {
        marked: true,
        dotColor: "#4b0082",
      }
    })

    // Mark the selected date with a different style
    if (selectedDate) {
      result[selectedDate] = {
        ...result[selectedDate],
        marked: true,
        dotColor: "#ff4500",
      }
    }

    return result
  }, [eventsByDate, selectedDate])

  // Get events for the selected date
  const selectedDateEvents = useMemo(() => {
    return eventsByDate[selectedDate] || []
  }, [eventsByDate, selectedDate])

  // Handle date selection
  const handleDateSelect = useCallback((day: any) => {
    setSelectedDate(day.dateString)
  }, [])

  // Handle opening links
  const handleLinkPress = useCallback((url: string) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err))
  }, [])

  // Render event description with clickable links
  const renderDescription = useCallback(
    (description: string) => {
      if (!description) return null

      // Find URLs without using regex.test() which has state issues with global flag
      const urlPattern = /(https?:\/\/[^\s]+)/g
      let match
      let lastIndex = 0
      const parts = []
      const tempDescription = description

      while ((match = urlPattern.exec(description)) !== null) {
        const url = match[0]
        const index = match.index

        // Add text before the URL
        if (index > lastIndex) {
          parts.push({
            type: "text",
            content: description.substring(lastIndex, index),
            key: `text-${lastIndex}-${index}`,
          })
        }

        // Add the URL
        parts.push({
          type: "link",
          content: url,
          key: `link-${index}`,
        })

        lastIndex = index + url.length
      }

      // Add remaining text after the last URL
      if (lastIndex < description.length) {
        parts.push({
          type: "text",
          content: description.substring(lastIndex),
          key: `text-${lastIndex}-end`,
        })
      }

      return (
        <Text>
          {parts.map((part) =>
            part.type === "link" ? (
              <Text key={part.key} style={styles.linkText} onPress={() => handleLinkPress(part.content)}>
                {part.content}
              </Text>
            ) : (
              <Text key={part.key}>{part.content}</Text>
            ),
          )}
        </Text>
      )
    },
    [handleLinkPress],
  )

  // Render an individual event item
  const renderEventItem = useCallback(
    ({ item }: { item: Event }) => (
      <TouchableOpacity style={styles.eventItem}>
        <View style={styles.eventHeader}>
          <View style={styles.eventIconContainer}>
            <Ionicons name="calendar" size={20} color="#4b0082" />
          </View>
          <Text style={styles.eventTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>

        {item.location ? (
          <View style={styles.eventDetailRow}>
            <Ionicons name="location-outline" size={16} color="#6A5ACD" style={styles.detailIcon} />
            <Text style={styles.eventLocation}>{item.location}</Text>
          </View>
        ) : null}

        <View style={styles.eventDetailRow}>
          <Ionicons name="time-outline" size={16} color="#6A5ACD" style={styles.detailIcon} />
          <Text style={styles.eventTime}>
            {new Date(item.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>

        {item.description ? (
          <View style={styles.eventDescription}>
            <Ionicons name="information-circle-outline" size={16} color="#6A5ACD" style={styles.detailIcon} />
            <View style={styles.descriptionText}>{renderDescription(item.description)}</View>
          </View>
        ) : null}
      </TouchableOpacity>
    ),
    [renderDescription],
  )

  // Render empty state when no events
  const renderEmptyEvents = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={50} color="#ccc" />
        <Text style={styles.emptyText}>No events for this date</Text>
      </View>
    ),
    [],
  )

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4b0082" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Event Calendar</Text>

      <Calendar
        onDayPress={handleDateSelect}
        markedDates={markedDates}
        theme={{
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#4b0082",
          selectedDayBackgroundColor: "#4b0082",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#ff4500",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          dotColor: "#4b0082",
          selectedDotColor: "#ffffff",
          arrowColor: "#4b0082",
          monthTextColor: "#4b0082",
          indicatorColor: "#4b0082",
          textDayFontWeight: "300",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "500",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
      />

      <View style={styles.eventsHeader}>
        <Text style={styles.eventsHeaderText}>
          Events for{" "}
          {new Date(selectedDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </Text>
        <Text style={styles.eventCount}>
          {selectedDateEvents.length} {selectedDateEvents.length === 1 ? "event" : "events"}
        </Text>
      </View>

      <FlatList
        data={selectedDateEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventsList}
        ListEmptyComponent={renderEmptyEvents}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#4b0082",
  },
  eventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "#f9f9f9",
  },
  eventsHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  eventCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 200,
  },
  eventItem: {
    backgroundColor: "#f8f4ff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#4b0082",
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eventIconContainer: {
    marginRight: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4b0082",
    flex: 1,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 6,
  },
  eventLocation: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
  },
  eventDescription: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "flex-start",
  },
  descriptionText: {
    flex: 1,
    marginLeft: 6,
  },
  linkText: {
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
})

export default EventCalendar
