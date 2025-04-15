import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { AppNavigationProp } from "../navTypes";
import { selectUser } from "../../redux/features/auth/authSelectors";

const SplashScreenTwo: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const user = useSelector(selectUser);

  // Animations for each word
  const flipAnims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    let isMounted = true;

    // Animate each word flipping independently
    flipAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: index * 400, // Staggered delay for each word
        useNativeDriver: true,
      }).start();
    });

    // Navigation logic after animation
    const timer = setTimeout(() => {
      if (isMounted) {
        try {
          if (user?.role === "district_superintendent" && !user?.hasSeenTraining) {
            navigation.replace("TrainingSplash");
          } else {
            navigation.replace("App");
          }
        } catch (error) {
          console.error("Error during navigation:", error);
          navigation.replace("App");
        }
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigation, user]);

  // Function to create flipping animation style
  const getFlipStyle = (animValue: Animated.Value) => ({
    transform: [
      {
        rotateX: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["90deg", "0deg"], // Flip from 90deg to 0deg
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.text, getFlipStyle(flipAnims[0])]}>Let’s</Animated.Text>
        <Animated.Text style={[styles.text, getFlipStyle(flipAnims[1])]}>Get</Animated.Text>
        <Animated.Text style={[styles.text, getFlipStyle(flipAnims[2])]}>Started!</Animated.Text>
      </View>
      <ActivityIndicator size="large" color="#fff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5a623",
  },
  textContainer: {
    flexDirection: "row",
    gap: 8,
  },
  text: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  loader: {
    marginTop: 16,
  },
});

export default SplashScreenTwo;
