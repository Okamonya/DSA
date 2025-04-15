import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
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
import CalendarOfEvents from '../../components/event/CalenderOfEvents';
import { fetchEvents } from '../../redux/features/event/eventActions';
import { selectEventLoading, selectEvents } from '../../redux/features/event/eventSelector';
import LoadingOverlay from '../../components/loader/LoaderOverlay';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../util/colors';
import { fetchUser } from '../../redux/features/auth/authActions';

type UserRole = "admin" | "district_superintendent" | "field_strategy_coordinator";

interface User {
    username: string;
    role: UserRole; // Role is required
}

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<AppNavigationProp>();
    const user = useSelector(selectUser);
    const announcements = useSelector(selectAnnouncements);
    const assignedSessions = useSelector(selectSessionsById).slice(0, 2);
    const trainings = useSelector(selectTrainingModules).slice(0, 6);
    const currentTraining = useSelector(selectCurrentTraining);
    const events = useSelector(selectEvents);
    console.log('events', events)
    const eventLoading = useSelector(selectEventLoading);
    const trainingLoading = useSelector(selectTrainingLoading);
    const sessionLoading = useSelector(selectSessionLoading);
    const loading = eventLoading || trainingLoading || sessionLoading;

    const dispatch = useDispatch<AppDispatch>();

    const [searchQuery, setSearchQuery] = useState("");

    const [isAddButtonOpen, setIsAddButtonOpen] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const scrollY = new Animated.Value(0);

    // Determine if the user is allowed to see the Add button
    const canViewAddButton = user?.role === 'admin' || user?.role === 'field_strategy_coordinator';

    const getGreetingMessage = (user: User): string => {
        if (!user || !user.role) {
            return "Welcome, User"; // Default message for unknown roles or users
        }

        // Map roles to greetings
        const roleGreetings: Record<UserRole, string> = {
            admin: "Welcome, Admin",
            district_superintendent: "Welcome, Superintendent",
            field_strategy_coordinator: "Welcome, Field Coordinator",
        };

        return roleGreetings[user.role] || "Welcome, User";
    };

    useEffect(() => {
        // Set a timeout to hide the button after 5 seconds
        const timeout = setTimeout(() => {
            setIsButtonVisible(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            listener: (event: any) => {
                const currentOffset = event.nativeEvent.contentOffset.y;
                setIsButtonVisible(currentOffset <= 0); // Show the button at the top
            },
            useNativeDriver: false,
        }
    );

    useFocusEffect(
        useCallback(() => {
            if (user) {
                const id = user.id
                dispatch(fetchAnnouncements({ id }));
                dispatch(fetchAllSessionsById({ id }));
                dispatch(fetchAllSessions({ id }));
                dispatch(fetchTrainingModules({ userId: id }))
                dispatch(fetchEvents(id));
                dispatch(getCurrentTrainingForUser({ userId: id })).then((response) => {
                    console.log(response)
                });
                dispatch(fetchUser({ id }))
            }
        }, [])
    )

    const groupedTrainings = [];
    for (let i = 0; i < trainings.length; i += 2) {
        groupedTrainings.push(trainings.slice(i, i + 2));
    }


    const toggleAddButton = () => {
        setIsAddButtonOpen((prev) => !prev);
    };

    const handleFilterPress = () => {
        console.log("Filter button pressed!");
    };

    const handleViewAll = () => {
        console.log("View All", "Navigate to the full announcements list.");
    };

    const handleViewSessionDetails = (session: Session) => {
        navigation.navigate('SingleSession', { session });
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Animated Add Button */}
            {canViewAddButton && isButtonVisible && (
                <AddButton opened={isAddButtonOpen} toggleOpened={toggleAddButton} />
            )}

            <StatusBar style="light" backgroundColor={COLORS.primary} />

            {/* <LoadingOverlay visible={loading} /> */}
            {/* Scrollable Content */}
            <Animated.ScrollView
                style={styles.container}
                onScroll={handleScroll}
                scrollEventThrottle={16} // Ensures smooth scrolling
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>
                        {getGreetingMessage(user)} {user?.username}
                        {"\n"}{"\n"}
                    </Text>
                </View>

                {/* Search Bar */}
                {/* <SearchBar
                    placeholder="Search for resources, trainings, or policies..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFilterPress={handleFilterPress}
                    filterIconColor="filter-sharp"
                /> */}

                {/* Announcements Section */}
                <Text style={styles.sectionTitle}>Announcements</Text>
                <Announcements data={announcements} onViewAll={handleViewAll} />

                {/* Assigned Sessions Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Sessions</Text>
                    <TouchableOpacity
                        style={styles.viewAllSessionsButton}
                        onPress={() => navigation.navigate('AllSessions' as never)}
                    >
                        <Text style={styles.viewAllSessionsText}>VIEW ALL</Text>
                    </TouchableOpacity>
                </View>
                {assignedSessions.length > 0 ? (
                    assignedSessions.slice(0, 2).map((session) => (
                        <TouchableOpacity
                            key={session.id}
                            style={styles.sessionCard}
                            onPress={() => handleViewSessionDetails(session)}
                        >
                            <View style={styles.sessionContent}>
                                <Text style={styles.sessionTitle}>{session.title}</Text>
                                <Text style={styles.sessionDescription}>{session.description}</Text>
                                <Text style={styles.sessionDateTime}>
                                    {formatDate(session.date)} | {session.startTime}, {session.endTime}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noSessions}>No assigned sessions available.</Text>
                )}


                {/* Current Course Progress */}
                <View style={styles.currentCoursesHeader}>
                    <Text style={styles.sectionTitle}>Your Current Training</Text>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('UserCourses' as never) }}
                    >
                        <Text style={styles.seeAll}>VIEW ALL</Text>
                    </TouchableOpacity>
                </View>
                {currentTraining ? (
                    <View style={styles.courseProgressContainer}>
                        <View style={styles.courseInfo}>
                            <TouchableOpacity style={styles.bookIcon}>
                                <Ionicons name="book-outline" size={44} color="black" />
                            </TouchableOpacity>
                            <View style={styles.courseDetails}>
                                <Text style={styles.courseName}>{currentTraining.title}</Text>
                                <Text style={styles.courseIntro}>{currentTraining.description.length > 60 ? `${currentTraining.description.substring(0, 60)}...` : currentTraining.description}</Text>
                            </View>
                        </View>

                        {/* Progress Bar */}
                        {/* <View style={styles.progressBarBackground}>
                            <View style={[styles.progressBarFill, { width: '50%' }]} />
                        </View>
                        <Text style={styles.progressText}>1/2 modules completed</Text> */}
                    </View>
                ) : (
                    <Text style={styles.noSessions}>No aCurrent training available.</Text>
                )}

                {/* Popular Courses */}
                <View style={styles.popularCoursesHeader}>
                    <Text style={styles.sectionTitle}>Recommended Trainings</Text>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('AllCoursesScreen' as never) }}
                    >
                        <Text style={styles.seeAll}>SEE ALL</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.courseFilterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}
                            onPress={() => { navigation.navigate('AllCoursesScreen' as never) }}
                        >
                            <Text style={styles.filterTextActive}>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterText}>Policy Updates</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterText}>Leadership</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterText}>Community Building</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Course Cards */}
                {groupedTrainings.map((row, rowIndex) => (
                    <View style={styles.row} key={`row-${rowIndex}`}>
                        {row.map((training) => (
                            <TouchableOpacity
                                key={training.id}
                                style={styles.courseCard}
                                onPress={() => navigation.navigate('SingleCourse', { id: training.id } as never)}
                            >
                                <Image source={{ uri: training.posterUrl }} style={styles.courseImage} />
                                <View style={styles.courseContent}>
                                    <Text style={styles.courseTitle}>{training.title.length > 18 ? `${training.title.substring(0, 18)}...` : training.title}</Text>
                                    <Text style={styles.coursePrice}>{training.description.length > 60 ? `${training.description.substring(0, 60)}...` : training.description}</Text>
                                    {/* <Text style={styles.courseRating}>
                                        <Ionicons name="star" size={14} color="gold" />
                                    </Text> */}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                <CalendarOfEvents events={events} />

            </Animated.ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', paddingHorizontal: 12, marginTop: 26 },
    addButton: {
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
    header: { display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
    greeting: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    subGreeting: { fontSize: 14, color: '#555', fontWeight: "normal" },
    notificationIcon: {},
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    searchInput: { flex: 1, color: '#333' },
    filterIcon: { marginLeft: 8 },
    sessionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    }
    , sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
    },
    viewAllSessionsButton: {
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewAllSessionsText: {
        fontSize: 14,
        color: '#1E90FF'
    },
    sessionContent: {
        flex: 1,
    },
    sessionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    sessionDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    sessionDateTime: {
        fontSize: 12,
        color: '#777',
    },
    noSessions: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginVertical: 8,
    },
    currentCoursesHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    courseProgressContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    courseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    bookIcon: {
        backgroundColor: '#e6e6e6',
        borderRadius: 12,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    courseDetails: {
        flex: 1,
    },
    courseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    courseIntro: {
        fontSize: 14,
        color: '#555',
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: '#e6e6e6',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#1E90FF',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#777',
        textAlign: 'right',
    },
    popularCoursesHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    seeAll: { fontSize: 14, color: '#1E90FF' },
    courseFilterContainer: { flexDirection: 'row', marginBottom: 16 },
    filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: '#e6e6e6', marginRight: 8 },
    activeFilter: { backgroundColor: '#1E90FF' },
    filterText: { fontSize: 14, color: '#555' },
    filterTextActive: { fontSize: 14, color: '#fff' },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16, // Space between rows
    },
    courseCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: '48%', // Each card takes up about half the width
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    courseImage: {
        height: 100,
        backgroundColor: '#e6e6e6',
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        marginBottom: 8,
    },
    courseContent: {
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    courseTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    coursePrice: {
        fontSize: 14,
        color: '#1E90FF',
        marginTop: 2,
    },
    courseRating: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
});

export default HomeScreen;
