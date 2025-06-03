import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Dimensions
} from 'react-native';
import {
    Button,
    Modal,
    Portal,
    TextInput,
    Text,
    Card,
    Title,
    useTheme,
    Appbar,
    Avatar,
    Chip,
    Divider,
    ActivityIndicator,
    Searchbar
} from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/features/store';
import { selectAllUsers, selectUser } from '../../redux/features/auth/authSelectors';
import { User } from '../../redux/features/auth/authTypes';
import { fetchUser, updateUser } from '../../redux/features/auth/authActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const UsersListPage = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const allUsers = useSelector(selectAllUsers);
    const [currentPage, setCurrentPage] = useState(0);
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const itemsPerPage = 5;
    const user = useSelector(selectUser);

    // Filter field coordinators
    const filteredUsers = useCallback(() => {
        if (!allUsers) return [];

        let filtered = allUsers.filter(user => user.role === 'district_superintendent');

        // Apply search filter if search query exists
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(user =>
                user.username.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                (user.district?.name && user.district.name.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [allUsers, searchQuery]);

    // Paginated data
    const paginatedData = filteredUsers().slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            const id = user.id;
            dispatch(fetchUser({ id }))
                .finally(() => setIsLoading(false));
        }
    }, [dispatch, user]);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setVisible(true);
    };

    const handleViewDetails = (user: User) => {
        navigation.navigate('SuperintendentDetails', { userId: user.id });
    };


    const handleSave = async () => {
        if (selectedUser) {
            setIsLoading(true);
            await dispatch(updateUser({ user_id: selectedUser?.id, formData: selectedUser }));
            setIsLoading(false);
        }
        setVisible(false);
    };

    const renderUserCard = (user: User) => {
        // Generate a random color for the avatar based on the username
        const getAvatarColor = (name: string) => {
            const colors = [
                '#4CAF50', '#2196F3', '#9C27B0', '#F44336',
                '#FF9800', '#009688', '#673AB7', '#3F51B5'
            ];
            const charCode = name.charCodeAt(0);
            return colors[charCode % colors.length];
        };

        const avatarColor = getAvatarColor(user.username);
        const initials = user.username.substring(0, 2).toUpperCase();

        return (
            <Card key={user.id} style={styles.card} mode="elevated">
                <Card.Content>
                    <View style={styles.cardHeader}>
                        <Avatar.Text
                            size={60}
                            label={initials}
                            style={[styles.avatar, { backgroundColor: avatarColor }]}
                            labelStyle={styles.avatarText}
                        />
                        <View style={styles.headerTextContainer}>
                            <Title style={styles.userName}>{user.username}</Title>
                            <Chip
                                icon="account-tie"
                                style={styles.roleChip}
                                textStyle={styles.roleChipText}
                            >
                                Superintendent
                            </Chip>
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <Icon name="email-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.infoText}>{user.email}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="phone-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.infoText}>{user.phoneNumber || 'No phone number'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="map-marker-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.infoText}>{user.district?.name || 'No district assigned'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="calendar-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.infoText}>
                                Appointed: {user.currentAppointedYear || 'N/A'}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                    <Button
                        mode="contained"
                        onPress={() => handleEdit(user)}
                        style={styles.editButton}
                        icon="pencil-outline"
                    >
                        Edit Profile
                    </Button>
                    {/* Uncomment to add a view details button}
                    {/* <Button
                        mode="outlined"
                        onPress={() => handleViewDetails(user)}
                        style={styles.detailsButton}
                        icon="eye-outline"
                    >
                        View Details
                    </Button> */}
                </Card.Actions>
            </Card>
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />

            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => console.log('Go back')} />
                <Appbar.Content title="District Superintendents" />
                <Appbar.Action icon="plus" onPress={() => console.log('Add new')} />
            </Appbar.Header>

            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Searchbar
                        placeholder="Search superintendents..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchbar}
                        iconColor={theme.colors.primary}
                    />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {paginatedData.length > 0 ? (
                        paginatedData.map(renderUserCard)
                    ) : (
                        <View style={styles.emptyState}>
                            <Icon name="account-group" size={80} color={theme.colors.primary} />
                            <Title style={styles.emptyText}>No Superintendents Found</Title>
                            <Text style={styles.emptySubtext}>
                                {searchQuery
                                    ? "Try adjusting your search criteria"
                                    : "Add new district superintendents to get started"}
                            </Text>
                            <Button
                                mode="contained"
                                icon="plus"
                                style={styles.addButton}
                                onPress={() => console.log('Add new')}
                            >
                                Add Superintendent
                            </Button>
                        </View>
                    )}

                    {filteredUsers().length > itemsPerPage && (
                        <View style={styles.pagination}>
                            <Button
                                mode="outlined"
                                disabled={currentPage === 0}
                                onPress={() => setCurrentPage(currentPage - 1)}
                                style={styles.paginationButton}
                                icon="chevron-left"
                            >
                                Previous
                            </Button>
                            <View style={styles.pageIndicator}>
                                <Text style={styles.pageText}>
                                    Page {currentPage + 1} of {Math.ceil(filteredUsers().length / itemsPerPage)}
                                </Text>
                            </View>
                            <Button
                                mode="contained"
                                disabled={(currentPage + 1) * itemsPerPage >= filteredUsers().length}
                                onPress={() => setCurrentPage(currentPage + 1)}
                                style={styles.paginationButton}
                                contentStyle={styles.nextButtonContent}
                                icon="chevron-right"
                                iconPosition="right"
                            >
                                Next
                            </Button>
                        </View>
                    )}
                </ScrollView>
            </View>

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
                >
                    <View style={styles.modalHeader}>
                        <Title style={styles.modalTitle}>Edit Superintendent</Title>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setVisible(false)}
                        >
                            <Icon name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {selectedUser && (
                        <ScrollView style={styles.modalContent}>
                            <View style={styles.modalUserHeader}>
                                <Avatar.Text
                                    size={60}
                                    label={selectedUser.username.substring(0, 2).toUpperCase()}
                                    style={styles.modalAvatar}
                                />
                                <Text style={styles.modalUserTitle}>
                                    {selectedUser.username}
                                </Text>
                            </View>

                            <Divider style={styles.modalDivider} />

                            <View style={styles.inputContainer}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Username</Text>
                                    <TextInput
                                        value={selectedUser.username}
                                        onChangeText={(text) => setSelectedUser({ ...selectedUser, username: text })}
                                        style={styles.input}
                                        mode="outlined"
                                        left={<TextInput.Icon icon="account" />}
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
                                        left={<TextInput.Icon icon="email" />}
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
                                        left={<TextInput.Icon icon="phone" />}
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
                                        left={<TextInput.Icon icon="calendar" />}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>District</Text>
                                    <TextInput
                                        value={selectedUser.district?.name || ''}
                                        style={styles.input}
                                        mode="outlined"
                                        editable={false}
                                        left={<TextInput.Icon icon="map-marker" />}
                                    />
                                </View>
                            </View>

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
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    Save Changes
                                </Button>
                            </View>
                        </ScrollView>
                    )}
                </Modal>
            </Portal>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    appbar: {
        elevation: 4,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    searchContainer: {
        marginVertical: 16,
    },
    searchbar: {
        elevation: 2,
        borderRadius: 8,
    },
    scrollContainer: {
        paddingBottom: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTextContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    roleChip: {
        alignSelf: 'flex-start',
        height: 28,
        backgroundColor: '#e8f4fd',
    },
    roleChipText: {
        fontSize: 12,
        color: '#0277bd',
    },
    divider: {
        marginVertical: 12,
    },
    infoContainer: {
        marginTop: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    infoText: {
        marginLeft: 12,
        fontSize: 15,
        color: '#444',
    },
    cardActions: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    editButton: {
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
    },
    detailsButton: {
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        paddingHorizontal: 8,
    },
    paginationButton: {
        borderRadius: 8,
        minWidth: 110,
    },
    nextButtonContent: {
        flexDirection: 'row-reverse',
    },
    pageIndicator: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    pageText: {
        fontSize: 14,
        color: '#555',
    },
    modal: {
        borderRadius: 16,
        marginHorizontal: 20,
        paddingBottom: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    modalUserHeader: {
        alignItems: 'center',
        marginVertical: 16,
    },
    modalAvatar: {
        marginBottom: 8,
    },
    modalUserTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#444',
    },
    modalDivider: {
        marginBottom: 20,
    },
    modalContent: {
        paddingHorizontal: 20,
    },
    inputContainer: {
        paddingVertical: 10,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
        fontWeight: '500',
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 8,
        paddingVertical: 6,
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
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#444',
    },
    emptySubtext: {
        marginTop: 8,
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginBottom: 24,
    },
    addButton: {
        borderRadius: 8,
        paddingHorizontal: 16,
    },
});

export default UsersListPage;