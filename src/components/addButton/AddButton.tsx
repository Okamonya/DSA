import React, { useEffect, useRef } from "react";
import { TouchableWithoutFeedback, View, StyleSheet, Animated, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

interface AddButtonProps {
    opened: boolean;
    toggleOpened: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ opened, toggleOpened }) => {
    const navigation = useNavigation();
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: opened ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [opened]);

    const opacityStyle = {
        opacity: animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1],
        }),
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                {/* First Button (Slides up) */}
                <TouchableWithoutFeedback>
                    <BlurView intensity={50} tint="light" style={styles.itemBlur}>
                        <Animated.View
                            style={[
                                styles.item,
                                opacityStyle,
                                {
                                    transform: [
                                        {
                                            translateY: animation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, -80], // Moves up
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <TouchableOpacity onPress={() => navigation.navigate('CreateAnnouncement' as never)}>

                                <Ionicons name="add" size={30} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.text}>Announcement</Text>
                        </Animated.View>
                    </BlurView>
                </TouchableWithoutFeedback>

                {/* Second Button (Slides up more) */}
                <TouchableWithoutFeedback>
                    <BlurView intensity={50} tint="light" style={styles.itemBlur}>
                        <Animated.View
                            style={[
                                styles.item,
                                opacityStyle,
                                {
                                    transform: [
                                        {
                                            translateY: animation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, -140], // Moves higher up
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <TouchableOpacity onPress={() => navigation.navigate('CreateSession' as never)}>
                                <Ionicons name="add" size={30} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.text}>Session</Text>
                        </Animated.View>
                    </BlurView>
                </TouchableWithoutFeedback>

                {/* Main Add Button */}
                <TouchableWithoutFeedback onPress={toggleOpened}>
                    <Animated.View
                        style={[
                            styles.addButtonInner,
                            {
                                transform: [
                                    {
                                        rotate: animation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ["0deg", "45deg"], // Rotate Add button
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >

                        <Ionicons name="add" size={56} color="#000" />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#1E90FF',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    box: {
        position: "relative",
        width: 68,
        height: 68,
    },
    addButtonInner: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 5,
        left: 5,
    },
    addButtonIcon: {
        width: 56,
        height: 56,
        borderRadius: 50,
    },
    item: {
        position: "absolute",
        top: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingLeft: 8,
        borderRadius: 25,
        flexDirection: 'row-reverse',
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
    },
    itemBlur: {
        position: "absolute",
        top: 30,
        right: 16,
        borderRadius: 25,
    },
    itemIcon: {

        width: 40,
        height: 40,
    },
    text: {
        fontWeight: 'bold',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#000'
    },
});

export default AddButton;
