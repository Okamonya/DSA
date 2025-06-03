import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { fetchResources } from "../../redux/features/resources/resourceActions";
import { selectResources } from "../../redux/features/resources/resourceSelectors";

type Resource = {
  id: string;
  title: string;
  category: string;
  description: string;
};

const ResourcesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const resources = useSelector(selectResources);

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchResources())
    }, [dispatch])
  )

  const renderResource = ({ item }: { item: Resource }) => (
    <TouchableOpacity
      style={styles.resourceCard}
      onPress={() =>
        navigation.navigate(
          item.category === "Templates"
            ? "MonthlyTemplates"
            : "GuidelinesScreen",
          {
            category: item.category,
          } // Pass the category to the respective screen
        )
      }
    >
      <View>
        <Text style={styles.resourceTitle}>{item.title}</Text>
        <Text style={styles.resourceCategory}>{item.category}</Text>
        <Text style={styles.resourceDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <Ionicons name="arrow-forward" size={20} color="#1E90FF" />
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources</Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={28} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#777" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for resources..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Content */}
      <ScrollView>
        {filteredResources.length > 0 ? (
          <FlatList
            data={filteredResources}
            keyExtractor={(item) => item.id}
            renderItem={renderResource}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.noResults}>
            <Ionicons name="alert-circle-outline" size={50} color="#aaa" />
            <Text style={styles.noResultsText}>No resources found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 12,
    paddingTop: 20,
    marginTop: 20
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#333",
  },
  listContainer: {
    padding: 6,
  },
  resourceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  resourceCategory: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#1E90FF",
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: "#555",
  },
  noResults: {
    alignItems: "center",
    marginTop: 40,
  },
  noResultsText: {
    marginTop: 8,
    fontSize: 16,
    color: "#aaa",
  },
});

export default ResourcesScreen;
