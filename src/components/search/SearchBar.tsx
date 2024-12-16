// src/components/SearchBar.tsx
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface SearchBarProps extends TextInputProps {
    placeholder?: string; // Custom placeholder for the search bar
    onFilterPress?: () => void; // Optional callback for filter button press
    filterIconColor?: string; // Custom color for the filter icon
    filterIconSize?: number; // Custom size for the filter icon
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search...",
    onFilterPress,
    filterIconColor = "black",
    filterIconSize = 24,
    ...textInputProps
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#aaa"
                {...textInputProps} // Pass other TextInput props like `onChangeText`, `value`
            />
            {onFilterPress && (
                <TouchableOpacity style={styles.filterIcon} onPress={onFilterPress}>
                    <Ionicons name="filter-sharp" size={filterIconSize} color={filterIconColor} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({ 
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    input: { flex: 1, color: '#333' },
    filterIcon: { marginLeft: 8 },
});

export default SearchBar;
