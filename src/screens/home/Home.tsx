import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Animated,
    Dimensions,
    SafeAreaView,
    Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Announcements from '../../components/community/Announcements';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/auth/authSelectors';
import { AppDispatch } from '../../redux/features/store';
import { fetchAnnouncements } from '../../redux/features/announcement/announceActions';
import { selectAnnouncements } from '../../redux/features/announcement/announceSelector';
import { fetchAllSessions, fetchAllSessionsById } from '../../redux/features/sessions/sessionActions';
import { selectSessionLoading, selectSessionsById } from '../../redux/features/sessions/sessionSelectors';
import { fetchTrainingModules, getCurrentTrainingForUser } from '../../redux/features/course/trainingActions';
import { selectCurrentTraining, selectTrainingLoading, selectTrainingModules } from '../../redux/features/course/trainingSelectors';
import { AppNavigationProp } from '../../components/navTypes';
import { Session } from '../../redux/features/sessions/sessionTypes';
import { formatDate } from '../../util/dateTimeFormat';
import AddButton from '../../components/addButton/AddButton';
import { fetchEvents } from '../../redux/features/event/eventActions';
import { selectEventLoading, selectEvents } from '../../redux/features/event/eventSelector';
import LoadingOverlay from '../../components/loader/LoaderOverlay';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../util/colors';
import { fetchUser } from '../../redux/features/auth/authActions';
import { LinearGradient } from 'expo-linear-gradient';
import EventCalendar from '../../components/event/CalenderOfEvents';

type UserRole = "admin" | "district_superintendent" | "field_strategy_coordinator";

interface User {
    username: string;
    role: UserRole;
}

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<AppNavigationProp>();
    const user = useSelector(selectUser);
    const announcements = useSelector(selectAnnouncements);
    const assignedSessions = useSelector(selectSessionsById).slice(0, 2);
    const trainings = useSelector(selectTrainingModules).slice(0, 6);
    const currentTraining = useSelector(selectCurrentTraining);
    const events = useSelector(selectEvents);
    const eventLoading = useSelector(selectEventLoading);
    const trainingLoading = useSelector(selectTrainingLoading);
    const sessionLoading = useSelector(selectSessionLoading);
    
    const dispatch = useDispatch<AppDispatch>();

    const [searchQuery, setSearchQuery] = useState("");
    const [isAddButtonOpen, setIsAddButtonOpen] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    // Fix the infinite loop issue by using useRef
    const scrollY = useRef(new Animated.Value(0)).current;

    // Determine if the user is allowed to see the Add button
    const canViewAddButton = user?.role === 'admin' || user?.role === 'field_strategy_coordinator';

    const getGreetingMessage = useCallback((user: User): string => {
        if (!user || !user.role) {
            return "Welcome, User";
        }

        const roleGreetings: Record<UserRole, string> = {
            admin: "Welcome, Admin",
            district_superintendent: "Welcome, Superintendent",
            field_strategy_coordinator: "Welcome, Field Coordinator",
        };

        return roleGreetings[user.role] || "Welcome, User";
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsButtonVisible(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    // Fix: Memoize the handleScroll function properly
    const handleScroll = useMemo(
        () => Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
                listener: (event: any) => {
                    const currentOffset = event.nativeEvent.contentOffset.y;
                    setIsButtonVisible(currentOffset <= 0);
                },
                useNativeDriver: false,
            }
        ),
        [scrollY]
    );

    // Fix: Memoize user ID to prevent unnecessary re-fetches
    const userId = useMemo(() => user?.id, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            if (userId) {
                dispatch(fetchAnnouncements({ id: userId }));
                dispatch(fetchAllSessionsById({ id: userId }));
                dispatch(fetchAllSessions({ id: userId }));
                dispatch(fetchTrainingModules({ userId }));
                dispatch(fetchEvents(userId));
                dispatch(getCurrentTrainingForUser({ userId }));
                dispatch(fetchUser({ id: userId }));
            }
        }, [dispatch, userId])
    );

    // Fix: Properly memoize the grouped trainings calculation
    const groupedTrainings = useMemo(() => {
        const result = [];
        for (let i = 0; i < trainings.length; i += 2) {
            result.push(trainings.slice(i, i + 2));
        }
        return result;
    }, [trainings]);

    const toggleAddButton = useCallback(() => {
        setIsAddButtonOpen((prev) => !prev);
    }, []);

    const handleFilterPress = useCallback((filter: string) => {
        setActiveFilter(filter);
        // Add filter logic here
    }, []);

    const handleViewAll = useCallback(() => {
        console.log("View All", "Navigate to the full announcements list.");
    }, []);

    const handleViewSessionDetails = useCallback((session: Session) => {
        navigation.navigate('SingleSession', { session });
    }, [navigation]);

    const renderSectionHeader = useCallback((title: string, onPress: () => void, buttonText: string = "VIEW ALL") => (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
                <View style={styles.titleAccent} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <TouchableOpacity
                style={styles.viewAllButton}
                onPress={onPress}
            >
                <Text style={styles.viewAllText}>{buttonText}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    ), []);

    // Memoize filters array to prevent recreation
    const filters = useMemo(() => ["All", "Policy Updates", "Leadership", "Community Building"], []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="dark" backgroundColor="#FFFFFF" />

            {/* Animated Add Button */}
            {canViewAddButton && isButtonVisible && (
                <AddButton opened={isAddButtonOpen} toggleOpened={toggleAddButton} />
            )}

            {/* Header with gradient */}
            <View style={styles.headerContainer}>
                <LinearGradient
                    colors={['#f0f8ff', '#ffffff']}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greeting}>
                                {getGreetingMessage(user)}
                            </Text>
                            <Text style={styles.username}>{user?.username}</Text>
                        </View>
                        <TouchableOpacity style={styles.profileButton}>
                            <Ionicons name="person-circle-outline" size={40} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>

            {/* Scrollable Content */}
            <Animated.ScrollView
                style={styles.container}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Announcements Section */}
                {renderSectionHeader("Announcements", handleViewAll)}
                <Announcements data={announcements} onViewAll={handleViewAll} />

                {/* Assigned Sessions Section */}
                {renderSectionHeader("Sessions", () => navigation.navigate('AllSessions' as never))}
                {assignedSessions.length > 0 ? (
                    <View style={styles.sessionsContainer}>
                        {assignedSessions.map((session) => (
                            <TouchableOpacity
                                key={session.id}
                                style={styles.sessionCard}
                                onPress={() => handleViewSessionDetails(session)}
                            >
                                <View style={styles.sessionIconContainer}>
                                    <Ionicons name="calendar" size={24} color={COLORS.primary} />
                                </View>
                                <View style={styles.sessionContent}>
                                    <Text style={styles.sessionTitle} numberOfLines={1}>{session.title}</Text>
                                    <Text style={styles.sessionDescription} numberOfLines={2}>{session.description}</Text>
                                    <View style={styles.sessionTimeContainer}>
                                        <Ionicons name="time-outline" size={14} color="#777" />
                                        <Text style={styles.sessionDateTime}>
                                            {formatDate(session.date)} | {session.startTime}
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#ccc" />
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Ionicons name="calendar-outline" size={40} color="#ccc" />
                        <Text style={styles.noSessions}>No assigned sessions available</Text>
                    </View>
                )}

                {/* Current Course Progress */}
                {renderSectionHeader("Your Current Training", () => navigation.navigate('UserCourses' as never))}
                {currentTraining ? (
                    <View style={styles.courseProgressContainer}>
                        <View style={styles.courseInfo}>
                            <View style={styles.bookIcon}>
                                <Ionicons name="book-outline" size={32} color={COLORS.primary} />
                            </View>
                            <View style={styles.courseDetails}>
                                <Text style={styles.courseName}>{currentTraining.title}</Text>
                                <Text style={styles.courseIntro} numberOfLines={2}>
                                    {currentTraining.description}
                                </Text>
                                <TouchableOpacity
                                    style={styles.continueButton}
                                    onPress={() => navigation.navigate('SingleCourse', { id: currentTraining.id } as never)}
                                >
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Ionicons name="book-outline" size={40} color="#ccc" />
                        <Text style={styles.noSessions}>No current training available</Text>
                    </View>
                )}

                {/* Popular Courses */}
                {renderSectionHeader("Recommended Trainings", () => navigation.navigate('AllCoursesScreen' as never))}

                {/* Course Filters */}
                <View style={styles.courseFilterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {filters.map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.filterButton,
                                    activeFilter === filter && styles.activeFilter
                                ]}
                                onPress={() => handleFilterPress(filter)}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        activeFilter === filter && styles.filterTextActive
                                    ]}
                                >
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Course Cards */}
                <View style={styles.coursesGrid}>
                    {groupedTrainings.map((row, rowIndex) => (
                        <View style={styles.row} key={`row-${rowIndex}`}>
                            {row.map((training) => (
                                <TouchableOpacity
                                    key={training.id}
                                    style={styles.courseCard}
                                    onPress={() => navigation.navigate('SingleCourse', { id: training.id } as never)}
                                >
                                    <Image
                                        source={{ uri: training.posterUrl }}
                                        style={styles.courseImage}
                                        resizeMode="cover"
                                    />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                                        style={styles.courseImageOverlay}
                                    />
                                    <View style={styles.courseContent}>
                                        <Text style={styles.courseTitle} numberOfLines={2}>
                                            {training.title}
                                        </Text>
                                        <View style={styles.courseMetaContainer}>
                                            <View style={styles.courseTypeBadge}>
                                                <Text style={styles.courseTypeText}>Training</Text>
                                            </View>
                                            <View style={styles.courseLessonCount}>
                                                <Ionicons name="document-text-outline" size={12} color="#fff" />
                                                <Text style={styles.courseLessonText}>5 lessons</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>

                <EventCalendar events={events} />

                {/* Spacer at the bottom for better scrolling */}
                <View style={styles.bottomSpacer} />
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

// ... rest of your styles remain the same
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    headerContainer: {
        width: '100%',
        overflow: 'hidden',
    },
    headerGradient: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
        paddingBottom: 15,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 4,
    },
    username: {
        fontSize: 16,
        color: '#555',
        fontWeight: '500',
    },
    profileButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 15,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleAccent: {
        width: 4,
        height: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    viewAllSessionsText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    sessionsContainer: {
        paddingHorizontal: 20,
    },
    sessionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sessionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sessionContent: {
        flex: 1,
        marginRight: 8,
    },
    sessionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    sessionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    sessionTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sessionDateTime: {
        fontSize: 12,
        color: '#777',
        marginLeft: 4,
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        marginHorizontal: 20,
    },
    noSessions: {
        fontSize: 14,
        color: '#777',
        marginTop: 10,
    },
    courseProgressContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    courseInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bookIcon: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    courseDetails: {
        flex: 1,
    },
    courseName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
    },
    courseIntro: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    continueButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginRight: 6,
    },
    courseFilterContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeFilter: {
        backgroundColor: '#e6f2ff',
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    filterTextActive: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    coursesGrid: {
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    courseCard: {
        width: (width - 50) / 2,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
        height: 180,
    },
    courseImage: {
        height: 180,
        width: '100%',
    },
    courseImageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    courseContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
    },
    courseTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    courseMetaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    courseTypeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    courseTypeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    courseLessonCount: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    courseLessonText: {
        color: '#fff',
        fontSize: 10,
        marginLeft: 4,
    },
    bottomSpacer: {
        height: 50,
    },
});

export default HomeScreen;