import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppNavigationProp } from '../../components/navTypes';
import { selectSessions, selectSessionsById } from '../../redux/features/sessions/sessionSelectors';
import { formatDate, formatTimeRange } from '../../util/dateTimeFormat';
import { selectUser } from '../../redux/features/auth/authSelectors';
import { AppDispatch } from '../../redux/features/store';
import { fetchAllSessions, fetchAllSessionsById } from '../../redux/features/sessions/sessionActions';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../util/colors';

const AllSessionsScreen: React.FC = () => {
    const navigation = useNavigation<AppNavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    // Fetch sessions from the Redux store
    const allSessions = useSelector(selectSessions);
    const assignedSessions = useSelector(selectSessionsById);
    const user = useSelector(selectUser);

    // State to manage active tab
    const [activeTab, setActiveTab] = useState<'AllSessions' | 'AssignedSessions'>('AllSessions');


    useFocusEffect(
        useCallback(() => {
            if (user) {
                const id = user.id
                dispatch(fetchAllSessionsById({ id }))
                dispatch(fetchAllSessions({ id }))
            }
        }, [])
    )

    const handleSessionPress = (session: any) => {
        navigation.navigate('SingleSession', { session });
    };

    const renderSessionList = (sessions: any[]) => (
        <ScrollView>
            {sessions.length > 0 ? (
                sessions.map((session) => (
                    <TouchableOpacity
                        key={session.id}
                        style={styles.sessionCard}
                        onPress={() => handleSessionPress(session)}
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
                <Text style={styles.noSessions}>No sessions available at the moment.</Text>
            )}
        </ScrollView>
    );

    return (
        <View style={styles.container}>

            <StatusBar style="light" backgroundColor={COLORS.primary} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Sessions</Text>
            </View>

            {/* Tab Selector */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'AllSessions' ? styles.activeTab : {},
                    ]}
                    onPress={() => setActiveTab('AllSessions')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'AllSessions' ? styles.activeTabText : {},
                        ]}
                    >
                        All Sessions
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'AssignedSessions' ? styles.activeTab : {},
                    ]}
                    onPress={() => setActiveTab('AssignedSessions')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'AssignedSessions' ? styles.activeTabText : {},
                        ]}
                    >
                        Assigned Sessions
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Session List */}
            <View style={styles.sessionList}>
                {activeTab === 'AllSessions'
                    ? renderSessionList(allSessions)
                    : renderSessionList(assignedSessions)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', marginTop: 10 },
    header: { padding: 16, backgroundColor: '#4B5574' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 8,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: { borderBottomColor: '#4B5574' },
    tabText: { fontSize: 16, color: '#555' },
    activeTabText: { color: '#4B5574', fontWeight: 'bold' },
    sessionList: { flex: 1, padding: 16 },
    sessionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    sessionContent: { flex: 1 },
    sessionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 4 },
    sessionDescription: { fontSize: 14, color: '#555', marginBottom: 4 },
    sessionDateTime: { fontSize: 12, color: '#777' },
    noSessions: { fontSize: 14, color: '#777', textAlign: 'center', marginTop: 20 },
});

export default AllSessionsScreen;
