import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from '../../components/navTypes';
import * as Linking from 'expo-linking';
import { formatDate, formatTimeRange } from '../../util/dateTimeFormat';
import { useDispatch, useSelector } from 'react-redux';
import { assignUserToSession } from '../../redux/features/sessions/sessionActions';
import { AppDispatch } from '../../redux/features/store';
import { selectUser } from '../../redux/features/auth/authSelectors';

const SingleSessionScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation<AppNavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUser);
    const { session } = route.params as { session: any };

    const handleLinkPress = (link: string) => {
        if (link.includes('meet.google.com')) {
            // Open Google Meet
            Linking.openURL(link).catch(() =>
                Alert.alert('Error', 'Unable to open Google Meet. Please ensure the app is installed.')
            );
        } else if (link.includes('zoom.us')) {
            // Open Zoom
            Linking.openURL(link).catch(() =>
                Alert.alert('Error', 'Unable to open Zoom. Please ensure the app is installed.')
            );
        } else {
            Alert.alert('Invalid Link', 'This link is not a Google Meet or Zoom link.');
        }
    };

    const handleSignIn = async () => {
        try {
            if (user) {
                const result = await dispatch(assignUserToSession({ menteeId: user?.id, sessionId: session.id })).unwrap();
            }
            Alert.alert('Success', 'You have successfully signed into the session.');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'An error occurred while signing into the session.');
        }
    };

    return (
        <ScrollView style={styles.container}>

            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{session.title}</Text>
            </View>

            {/* Poster Section */}
            <Image
                source={{ uri: session.poster || 'https://via.placeholder.com/400x200' }}
                style={styles.poster}
                resizeMode="cover"
            />

            <View style={styles.sessionDetails}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionDescription}>{session.description}</Text>
                <Text style={styles.sessionDateTime}>
                    {formatDate(session.date)} | {formatTimeRange(session.startTime, session.endTime)}
                </Text>
            </View>

            <View style={styles.additionalInfo}>
                <Text style={styles.sectionTitle}>Additional Information</Text>
                <Text style={styles.infoText}>Location: {session.location}</Text>
                <Text style={styles.infoText}>Facilitator: {session.facilitator}</Text>
                {session.link && (
                    <TouchableOpacity onPress={() => handleLinkPress(session.link)}>
                        <Text style={styles.linkText}>Join Session: {session.link}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Sign In Button */}
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                <Text style={styles.signInButtonText}>Sign In to Session</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', padding: 12 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    headerTitle: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
        color: '#333',
    },
    poster: {
        width: '100%',
        height: 200,
        borderRadius: 20,
        marginBottom: 20,
    },
    sessionDetails: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    sessionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    sessionDescription: { fontSize: 14, marginBottom: 8, color: '#555' },
    sessionDateTime: { fontSize: 12, color: '#777' },
    additionalInfo: { marginTop: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    infoText: { fontSize: 14, color: '#555', marginBottom: 4 },
    linkText: {
        fontSize: 14,
        color: '#007aff',
        textDecorationLine: 'underline',
        marginTop: 8,
    },
    signInButton: {
        backgroundColor: '#007aff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SingleSessionScreen;
