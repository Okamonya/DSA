import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    Animated,
    Dimensions,
    StatusBar,
    SafeAreaView,
    Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/features/store";
import { updateUser } from "../../redux/features/auth/authActions";
import { selectUser } from "../../redux/features/auth/authSelectors";
import {
    selectTrainingLoading,
    selectUserTrainings,
} from "../../redux/features/course/trainingSelectors";
import { fetchUserTrainings } from "../../redux/features/course/trainingActions";
import TrainingCard from "../cards/TrainingCard";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

// Onboarding slides data
const ONBOARDING_SLIDES = [
    {
        id: '1',
        title: 'Welcome to Your Training',
        description: 'Get ready to enhance your skills and knowledge with our comprehensive training modules.',
        icon: 'school',
        color: '#4CAF50',
    },
    {
        id: '2',
        title: 'Track Your Progress',
        description: 'Monitor your learning journey with our intuitive progress tracking system.',
        icon: 'chart-line',
        color: '#2196F3',
    },
    {
        id: '3',
        title: 'Learn Anywhere',
        description: 'Access your training modules anytime, anywhere, on any device.',
        icon: 'devices',
        color: '#9C27B0',
    },
    {
        id: '4',
        title: 'Get Certified',
        description: 'Complete all modules to earn your certification and advance your career.',
        icon: 'certificate',
        color: '#FF9800',
    },
];

// Custom Training Card Component to ensure visibility
const CustomTrainingCard = ({ course }) => {
    const navigation = useNavigation();
    
    const handlePress = () => {
        // Navigate to the course details screen
        navigation.navigate('SingleCourse', { id: course.id });
    };
    
    return (
        <TouchableOpacity 
            style={styles.customTrainingCard}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <View style={styles.cardImageContainer}>
                <ImageBackground
                    source={{ uri: course.posterUrl || "https://via.placeholder.com/300x150?text=Training" }}
                    style={styles.cardImage}
                    imageStyle={styles.cardImageStyle}
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.cardImageOverlay}
                    />
                </ImageBackground>
            </View>
            
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {course.title}
                </Text>
                
                <Text style={styles.cardDescription} numberOfLines={3}>
                    {course.description}
                </Text>
                
                <View style={styles.cardFooter}>
                    <View style={styles.cardMetrics}>
                        <Icon name="clock-outline" size={14} color="#888" />
                        <Text style={styles.cardMetricText}>
                            {course.duration || '30 mins'}
                        </Text>
                    </View>
                    
                    <View style={styles.cardMetrics}>
                        <Icon name="book-outline" size={14} color="#888" />
                        <Text style={styles.cardMetricText}>
                            {course.modules || '5'} modules
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const TrainingSplashScreen: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUser);
    const trainingModules = useSelector(selectUserTrainings);
    const isLoading = useSelector(selectTrainingLoading);
    
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    
    // Local state
    const [showCompletionMessage, setShowCompletionMessage] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    
    // Calculate completion percentage
    const completedModules = trainingModules?.filter(item => item.status === "Completed")?.length || 0;
    const totalModules = trainingModules?.length || 0;
    const completionPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
    
    // Debug logging to identify why trainings aren't showing
    useEffect(() => {
        console.log("Training Modules:", trainingModules);
        console.log("Filtered Modules:", trainingModules?.filter(item => item.status !== "Completed"));
    }, [trainingModules]);
    
    // Reset animations when onboarding is closed
    useEffect(() => {
        if (!showOnboarding) {
            // Reset and restart animations
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
            
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(progressAnim, {
                    toValue: completionPercentage / 100,
                    duration: 1000,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [showOnboarding]);
    
    // Initial animations
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);
    
    // Update progress animation when completion percentage changes
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: completionPercentage / 100,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [completionPercentage]);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserTrainings({ userId: user.id }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (trainingModules?.length && trainingModules.every(item => item.status === "Completed")) {
            setShowCompletionMessage(true);
        }
    }, [trainingModules]);

    const handleTrainingComplete = async () => {
        // Show loading state
        const data = { hasSeenTraining: true };
        if (user) {
            await dispatch(updateUser({ user_id: user.id, formData: data }));
            navigation.navigate("App" as never);
        }
    };

    const handleSkipTraining = () => {
        // Add a confirmation dialog here if needed
        navigation.navigate("App" as never);
    };
    
    const handleNextSlide = () => {
        if (currentSlide < ONBOARDING_SLIDES.length - 1) {
            setCurrentSlide(currentSlide + 1);
            flatListRef.current?.scrollToIndex({ index: currentSlide + 1, animated: true });
        } else {
            setShowOnboarding(false);
        }
    };
    
    const handlePrevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
            flatListRef.current?.scrollToIndex({ index: currentSlide - 1, animated: true });
        }
    };
    
    const handleSkipOnboarding = () => {
        setShowOnboarding(false);
    };
    
    const renderOnboardingItem = ({ item, index }) => {
        return (
            <View style={styles.onboardingSlide}>
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                    <Icon name={item.icon} size={60} color="#ffffff" />
                </View>
                <Text style={styles.onboardingTitle}>{item.title}</Text>
                <Text style={styles.onboardingDescription}>{item.description}</Text>
            </View>
        );
    };
    
    const renderOnboardingCarousel = () => {
        return (
            <View style={styles.onboardingContainer}>
                <Animated.FlatList
                    ref={flatListRef}
                    data={ONBOARDING_SLIDES}
                    renderItem={renderOnboardingItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(
                            event.nativeEvent.contentOffset.x / width
                        );
                        setCurrentSlide(newIndex);
                    }}
                    scrollEventThrottle={16}
                    style={styles.carousel}
                />
                
                <View style={styles.paginationContainer}>
                    {ONBOARDING_SLIDES.map((_, index) => {
                        const inputRange = [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                        ];
                        
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 20, 10],
                            extrapolate: 'clamp',
                        });
                        
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });
                        
                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    { width: dotWidth, opacity },
                                    index === currentSlide && styles.paginationDotActive,
                                ]}
                            />
                        );
                    })}
                </View>
                
                <View style={styles.onboardingButtonContainer}>
                    {currentSlide > 0 ? (
                        <TouchableOpacity
                            style={styles.prevButton}
                            onPress={handlePrevSlide}
                        >
                            <Icon name="arrow-left" size={20} color="#ffffff" />
                            <Text style={styles.prevButtonText}>Previous</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={handleSkipOnboarding}
                        >
                            <Text style={styles.skipButtonText}>Skip</Text>
                        </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNextSlide}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentSlide === ONBOARDING_SLIDES.length - 1 ? "Get Started" : "Next"}
                        </Text>
                        <Icon 
                            name={currentSlide === ONBOARDING_SLIDES.length - 1 ? "check" : "arrow-right"} 
                            size={20} 
                            color="#ffffff" 
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    
    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>Welcome,</Text>
                <Text style={styles.nameText}>{user?.username || 'User'}</Text>
            </View>
            
            <Text style={styles.title}>Get Started with Training</Text>
            <Text style={styles.subtitle}>
                Complete these training modules to enhance your skills and knowledge
            </Text>
            
            <View style={styles.progressContainer}>
                {/* <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>Your Progress</Text>
                    <Text style={styles.progressPercentage}>{Math.round(completionPercentage)}%</Text>
                </View> */}
                <View style={styles.progressBarContainer}>
                    <Animated.View 
                        style={[
                            styles.progressBar, 
                            { width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                            })}
                        ]}
                    />
                </View>
            </View>
        </View>
    );
    
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Icon name="book-open-page-variant" size={80} color="#ffffff" />
            <Text style={styles.emptyTitle}>No Training Modules</Text>
            <Text style={styles.emptyMessage}>
                You don't have any training modules assigned yet. Check back later or contact your administrator.
            </Text>
            <TouchableOpacity 
                style={styles.refreshButton}
                onPress={() => user && dispatch(fetchUserTrainings({ userId: user.id }))}
            >
                <Icon name="refresh" size={20} color="#ffffff" style={styles.refreshIcon} />
                <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
        </View>
    );
    
    const renderCompletionMessage = () => (
        <View style={styles.completionContainer}>
            <View style={styles.completionIconContainer}>
                <Icon name="check-circle" size={100} color="#4CAF50" />
            </View>
            <Text style={styles.completionTitle}>All Training Completed!</Text>
            <Text style={styles.completionMessage}>
                Congratulations! You've completed all your assigned training modules. You're now ready to proceed.
            </Text>
        </View>
    );
    
    // Fix for the issue where trainings aren't showing
    const renderTrainingModules = () => {
        // Check if we have any training modules
        if (!trainingModules || trainingModules.length === 0) {
            return renderEmptyState();
        }
        
        // Get incomplete modules
        const incompleteModules = trainingModules.filter(item => item.status !== "Completed");
        
        // If we have modules but none are incomplete, show completion message
        if (incompleteModules.length === 0 && trainingModules.length > 0) {
            return renderCompletionMessage();
        }
        
        // Otherwise, show the list of incomplete modules
        return (
            <FlatList
                data={incompleteModules}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    // Debug the structure of each item
                    console.log(`Rendering item ${item.id}:`, item);
                    
                    // Check if trainingModule exists and has the required properties
                    if (!item.trainingModule) {
                        console.log(`Item ${item.id} has no trainingModule property`);
                        return null;
                    }
                    
                    return (
                        <View style={styles.trainingCardContainer}>
                            {/* Use our custom training card component instead of the imported one */}
                            <CustomTrainingCard course={item.trainingModule} />
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{item.status}</Text>
                            </View>
                        </View>
                    );
                }}
                ListEmptyComponent={renderEmptyState}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <ImageBackground
                source={{
                    uri: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
                }}
                style={styles.background}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
                    style={styles.overlay}
                >
                    {showOnboarding ? (
                        renderOnboardingCarousel()
                    ) : (
                        <View style={styles.mainContentContainer}>
                            {renderHeader()}
                            
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#f5a623" />
                                    <Text style={styles.loadingText}>Loading your training modules...</Text>
                                </View>
                            ) : (
                                <View style={styles.contentContainer}>
                                    <Text style={styles.listTitle}>Your Training Modules</Text>
                                    {renderTrainingModules()}
                                </View>
                            )}

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.skipButton}
                                    onPress={handleSkipTraining}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.skipButtonText}>Skip for Now</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[
                                        styles.completeButton,
                                        showCompletionMessage && styles.continueButton
                                    ]}
                                    onPress={handleTrainingComplete}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color="#ffffff" />
                                    ) : (
                                        <>
                                            <Text style={styles.completeButtonText}>
                                                {showCompletionMessage ? "Continue to App" : "Complete Training"}
                                            </Text>
                                            <Icon 
                                                name={showCompletionMessage ? "arrow-right" : "check"} 
                                                size={20} 
                                                color="#ffffff" 
                                                style={styles.buttonIcon} 
                                            />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </LinearGradient>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    mainContentContainer: {
        flex: 1,
        display: 'flex', // Ensure this is displayed
    },
    // Custom Training Card styles
    customTrainingCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 16,
    },
    cardImageContainer: {
        height: 150,
        width: '100%',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    cardImageStyle: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardImageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardMetrics: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardMetricText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 4,
    },
    // Onboarding styles
    onboardingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carousel: {
        flex: 1,
    },
    onboardingSlide: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    onboardingTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 16,
    },
    onboardingDescription: {
        fontSize: 16,
        color: '#e0e0e0',
        textAlign: 'center',
        lineHeight: 24,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
    },
    paginationDot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#f5a623',
    },
    onboardingButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    prevButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    prevButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginLeft: 8,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5a623',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginRight: 8,
    },
    // Main content styles
    headerContainer: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 10,
    },
    welcomeTextContainer: {
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 16,
        color: '#f5a623',
        fontWeight: '600',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#e0e0e0',
        lineHeight: 22,
        marginBottom: 24,
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    progressPercentage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f5a623',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#f5a623',
        borderRadius: 4,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 20,
    },
    trainingCardContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#f5a623',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#e0e0e0',
        marginTop: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 16,
        color: '#e0e0e0',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    refreshIcon: {
        marginRight: 8,
    },
    refreshText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    completionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    completionIconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 75,
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    completionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 16,
        textAlign: 'center',
    },
    completionMessage: {
        fontSize: 16,
        color: '#e0e0e0',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    skipButton: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        minWidth: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5a623',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 180,
    },
    continueButton: {
        backgroundColor: '#4CAF50',
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    buttonIcon: {
        marginLeft: 8,
    },
});

export default TrainingSplashScreen;