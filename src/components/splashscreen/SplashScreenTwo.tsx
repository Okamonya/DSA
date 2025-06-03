import React, { useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Animated, 
  Dimensions, 
  ImageBackground,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { AppNavigationProp } from "../navTypes";
import { selectUser } from "../../redux/features/auth/authSelectors";
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const SplashScreenTwo: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const user = useSelector(selectUser);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const flipAnims = [
    useRef(new Animated.Value(0)).current, 
    useRef(new Animated.Value(0)).current, 
    useRef(new Animated.Value(0)).current
  ];
  const verseOpacity = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    // Fade in the background
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Scale up the container
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate the icon
    Animated.sequence([
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(iconAnim, {
        toValue: 0.9,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate each word flipping independently
    flipAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: 600 + index * 300, // Staggered delay for each word
        useNativeDriver: true,
      }).start();
    });

    // Fade in the verse
    Animated.timing(verseOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 1800,
      useNativeDriver: true,
    }).start();

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
    }, 3500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigation, user, fadeAnim, scaleAnim, verseOpacity, iconAnim]);

  // Function to create flipping animation style
  const getFlipStyle = (animValue: Animated.Value) => ({
    opacity: animValue,
    transform: [
      {
        rotateX: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["90deg", "0deg"], // Flip from 90deg to 0deg
        }),
      },
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0], // Slight upward movement
        }),
      },
    ],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#3a539b" translucent />
      
      <ImageBackground 
        source={{ uri: 'https://i.imgur.com/8FzLRu9.png' }} // Subtle light pattern background
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.1 }}
      >
        <Animated.View style={[styles.contentContainer, { transform: [{ scale: scaleAnim }] }]}>
          {/* Cross Icon */}
          <Animated.View style={[styles.iconContainer, { 
            transform: [
              { scale: iconAnim },
              { rotate: iconAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-10deg', '0deg']
                })
              }
            ] 
          }]}>
            <Ionicons name="book" size={60} color="#fff" />
          </Animated.View>
          
          {/* Main Text */}
          <View style={styles.textContainer}>
            <Animated.Text style={[styles.text, getFlipStyle(flipAnims[0])]}>Let's</Animated.Text>
            <Animated.Text style={[styles.text, getFlipStyle(flipAnims[1])]}>Get</Animated.Text>
            <Animated.Text style={[styles.text, getFlipStyle(flipAnims[2])]}>Started!</Animated.Text>
          </View>
          
          {/* Bible Verse */}
          <Animated.Text style={[styles.verse, { opacity: verseOpacity }]}>
            "For I know the plans I have for you..." {'\n'}Jeremiah 29:11
          </Animated.Text>
          
          {/* Custom Loader */}
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        </Animated.View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3a539b", // Rich blue color
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  text: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginHorizontal: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  verse: {
    color: "#fff",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    opacity: 0.9,
  },
  loaderContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

export default SplashScreenTwo;