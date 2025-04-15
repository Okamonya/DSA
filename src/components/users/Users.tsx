import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { DataTable, Button, Modal, Portal, TextInput, Text, Card, Title, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/features/store';
import { selectAllUsers, selectUser } from '../../redux/features/auth/authSelectors';
import { User } from '../../redux/features/auth/authTypes';
import { fetchUser, updateUser } from '../../redux/features/auth/authActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UsersListPage = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const allUsers = useSelector(selectAllUsers);
    const [currentPage, setCurrentPage] = useState(0);
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const itemsPerPage = 5;
    const user = useSelector(selectUser);
    console.log(allUsers)
    // Filter field coordinators
    const fieldCoordinators = allUsers?.filter(
        (user) => user.role === 'district_superintendent'
    );

    // Paginated data
    const paginatedData = fieldCoordinators?.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    useEffect(() => {
        if (user) {
            const id = user.id;
            dispatch(fetchUser({ id }));
        }
    }, [dispatch, user]);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setVisible(true);
    };

    const handleSave = async () => {
        console.log('Saving user:', selectedUser);
        if (selectedUser) {
            await dispatch(updateUser({ user_id: selectedUser?.id, formData: selectedUser }));
        }
        setVisible(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Title style={styles.title}>District Superintendents</Title>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {paginatedData?.map((user) => (
                    <Card key={user.id} style={styles.card}>
                        <Card.Content>
                            <View style={styles.cardHeader}>
                                <Icon name="account-circle" size={32} color={theme.colors.primary} />
                                <Title style={styles.userName}>{user.username}</Title>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="email" size={20} color={theme.colors.accent} />
                                <Text style={styles.infoText}>{user.email}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="map-marker" size={20} color={theme.colors.accent} />
                                <Text style={styles.infoText}>{user.district.name || 'No district assigned'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="calendar" size={20} color={theme.colors.accent} />
                                <Text style={styles.infoText}>
                                    Appointed: {user.currentAppointedYear || 'N/A'}
                                </Text>
                            </View>
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                mode="contained"
                                onPress={() => handleEdit(user)}
                                style={styles.editButton}
                                icon="pencil"
                            >
                                Edit
                            </Button>
                        </Card.Actions>
                    </Card>
                ))}

                {paginatedData?.length === 0 && (
                    <View style={styles.emptyState}>
                        <Icon name="account-group" size={64} color={theme.colors.text} />
                        <Title style={styles.emptyText}>No Superintendents Found</Title>
                        <Text style={styles.emptySubtext}>Add new district superintendents to get started</Text>
                    </View>
                )}

                <View style={styles.pagination}>
                    <Button
                        mode="outlined"
                        disabled={currentPage === 0}
                        onPress={() => setCurrentPage(currentPage - 1)}
                        style={styles.paginationButton}
                    >
                        Previous
                    </Button>
                    <Text style={styles.pageText}>
                        Page {currentPage + 1} of {Math.ceil(fieldCoordinators?.length / itemsPerPage)}
                    </Text>
                    <Button
                        mode="contained"
                        disabled={(currentPage + 1) * itemsPerPage >= fieldCoordinators?.length}
                        onPress={() => setCurrentPage(currentPage + 1)}
                        style={styles.paginationButton}
                    >
                        Next
                    </Button>
                </View>
            </ScrollView>

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 20 }]}
                >
                    <Title style={styles.modalTitle}>Edit Superintendent</Title>
                    {selectedUser && (
                        <ScrollView style={styles.modalContent}>
                            <View style={styles.inputContainer}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Username</Text>
                                    <TextInput
                                        value={selectedUser.username}
                                        onChangeText={(text) => setSelectedUser({ ...selectedUser, username: text })}
                                        style={styles.input}
                                        mode="outlined"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Email Address</Text>
                                    <TextInput
                                        value={selectedUser.email}
                                        onChangeText={(text) => setSelectedUser({ ...selectedUser, email: text })}
                                        style={styles.input}
                                        mode="outlined"
                                        keyboardType="email-address"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Phone Number</Text>
                                    <TextInput
                                        value={selectedUser.phoneNumber || ''}
                                        onChangeText={(text) => setSelectedUser({ ...selectedUser, phoneNumber: text })}
                                        style={styles.input}
                                        mode="outlined"
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Appointed Year</Text>
                                    <TextInput
                                        value={selectedUser.currentAppointedYear?.toString() || ''}
                                        onChangeText={(text) =>
                                            setSelectedUser({ ...selectedUser, currentAppointedYear: parseInt(text) || 0 })
                                        }
                                        style={styles.input}
                                        mode="outlined"
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>District</Text>
                                    <TextInput
                                        value={selectedUser.district.name || ''}
                                        onChangeText={(text) =>
                                            setSelectedUser({ ...selectedUser, district: text })
                                        }
                                        style={styles.input}
                                        mode="outlined"
                                        editable={false}
                                    />
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.buttonRow}>
                                <Button
                                    mode="outlined"
                                    onPress={() => setVisible(false)}
                                    style={[styles.button, styles.cancelButton]}
                                    labelStyle={styles.buttonText}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={handleSave}
                                    style={[styles.button, styles.saveButton]}
                                    labelStyle={styles.buttonText}
                                >
                                    Save Changes
                                </Button>
                            </View>
                        </ScrollView>
                    )}
                </Modal>
            </Portal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    scrollContainer: {
        paddingBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    userName: {
        marginLeft: 12,
        fontSize: 18,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
    },
    editButton: {
        borderRadius: 8,
        marginTop: 12,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 16,
    },
    paginationButton: {
        borderRadius: 8,
    },
    pageText: {
        marginHorizontal: 12,
        fontSize: 14,
    },
    modal: {
        borderRadius: 12,
        padding: 20,
        width: '90%',
        alignSelf: 'center',
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    modalContent: {
        paddingBottom: 20,
    },
    inputContainer: {
        paddingVertical: 10,
    },
    inputGroup: {
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 15,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 8,
    },
    cancelButton: {
        borderColor: '#888',
    },
    saveButton: {
        backgroundColor: '#4b5574',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        marginTop: 40,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        textAlign: 'center',
    },
    emptySubtext: {
        marginTop: 8,
        textAlign: 'center',
        opacity: 0.8,
    },
});

export default UsersListPage;