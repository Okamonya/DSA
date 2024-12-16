import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/search/SearchBar';
import Announcements from '../../components/community/Announcements';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/auth/authSelectors';
import { AppDispatch } from '../../redux/features/store';
import { fetchAnnouncements } from '../../redux/features/announcement/announceActions';
import { selectAnnouncements } from '../../redux/features/announcement/announceSelector';
import { fetchAllSessions, fetchAllSessionsById } from '../../redux/features/sessions/sessionActions';
import { selectSessionsById } from '../../redux/features/sessions/sessionSelectors';
import { fetchTrainingModules, getCurrentTrainingForUser } from '../../redux/features/course/trainingActions';
import { selectCurrentTraining, selectTrainingModules } from '../../redux/features/course/trainingSelectors';
import { AppNavigationProp } from '../../components/navTypes';
import { Session } from '../../redux/features/sessions/sessionTypes';
import { formatDate, formatTimeRange } from '../../util/dateTimeFormat';
import { current } from '@reduxjs/toolkit';


const HomeScreen: React.FC = () => {
    const navigation = useNavigation<AppNavigationProp>();
    const user = useSelector(selectUser);
    const announcements = useSelector(selectAnnouncements);
    const assignedSessions = useSelector(selectSessionsById);
    const trainings = useSelector(selectTrainingModules);
    const currentTraining = useSelector(selectCurrentTraining);
    const dispatch = useDispatch<AppDispatch>();

    const [searchQuery, setSearchQuery] = useState("");

    useFocusEffect(
        useCallback(() => {
            if (user) {
                const id = user.id
                dispatch(fetchAnnouncements({ id }))
                dispatch(fetchAllSessionsById({ id }))
                dispatch(fetchAllSessions({ id }))
                dispatch(fetchTrainingModules())
                dispatch(getCurrentTrainingForUser({ userId: id })).then((response) => {
                    console.log(response)
                });
            }
        }, [])
    )

    const groupedTrainings = [];
    for (let i = 0; i < trainings.length; i += 2) {
        groupedTrainings.push(trainings.slice(i, i + 2));
    }

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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Welcome, Superintendent {user?.username}{"\n"}{"\n"}
                    <Text style={styles.subGreeting}>What do you want to focus on today?{"\n"}Search below for resources.</Text></Text>
                <TouchableOpacity style={styles.notificationIcon}>
                    <Ionicons name="notifications-outline" size={32} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <SearchBar
                placeholder="Search for resources, trainings, or policies..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFilterPress={handleFilterPress}
                filterIconColor="filter-sharp"
            />

            {/* Announcements Section */}
            <Text style={styles.sectionTitle}>Announcements</Text>
            <Announcements data={announcements} onViewAll={handleViewAll} />

            {/* Assigned Sessions Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Assigned Sessions</Text>
                <TouchableOpacity
                    style={styles.viewAllSessionsButton}
                    onPress={() => navigation.navigate('AllSessions' as never)}
                >
                    <Text style={styles.viewAllSessionsText}>VIEW ALL</Text>
                </TouchableOpacity>
            </View>
            {assignedSessions.length > 0 ? (
                assignedSessions.map((session) => (
                    <TouchableOpacity
                        key={session.id}
                        style={styles.sessionCard}
                        onPress={() => handleViewSessionDetails(session)}
                    >
                        <View style={styles.sessionContent}>
                            <Text style={styles.sessionTitle}>{session.title}</Text>
                            <Text style={styles.sessionDescription}>{session.description}</Text>
                            <Text style={styles.sessionDateTime}>
                                {formatDate(session.date)} | {formatTimeRange(session.startTime, session.endTime)}
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
                            <Text style={styles.courseIntro}>Develop practical leadership skills tailored for superintendents.</Text>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '50%' }]} />
                    </View>
                    <Text style={styles.progressText}>1/2 modules completed</Text>
                </View>
            ) : (
                <Text style={styles.noSessions}>No aCurrent training available.</Text>
            )}

            {/* Popular Courses */}
            <View style={styles.popularCoursesHeader}>
                <Text style={styles.sectionTitle}>Recommended Trainings</Text>
                <TouchableOpacity
                    onPress={() => { navigation.navigate('AllCourses' as never) }}
                >
                    <Text style={styles.seeAll}>SEE ALL</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.courseFilterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}
                        onPress={() => { navigation.navigate('AllCourses' as never) }}
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
                                <Text style={styles.courseTitle}>{training.title}</Text>
                                <Text style={styles.coursePrice}>Free</Text>
                                <Text style={styles.courseRating}>
                                    <Ionicons name="star" size={14} color="gold" /> 4.8 | 120 Participants
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', paddingHorizontal: 12, marginTop: 20, },
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
