import React from "react";
import { 
    View, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    ViewStyle 
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from "../../util/colors";

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    onFilterPress?: () => void;
    style?: ViewStyle;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    value,
    onChangeText,
    onFilterPress,
    style
}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChangeText}
                />
                {value.length > 0 && (
                    <TouchableOpacity 
                        style={styles.clearButton}
                        onPress={() => onChangeText("")}
                    >
                        <Ionicons name="close-circle" size={18} color="#999" />
                    </TouchableOpacity>
                )}
            </View>
            
            {onFilterPress && (
                <TouchableOpacity 
                    style={styles.filterButton}
                    onPress={onFilterPress}
                >
                    <Ionicons name="options-outline" size={20} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 46,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#333",
        height: "100%",
    },
    clearButton: {
        padding: 4,
    },
    filterButton: {
        width: 46,
        height: 46,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
});

export default SearchBar;