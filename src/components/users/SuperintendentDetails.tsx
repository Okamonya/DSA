import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {
  Appbar,
  Text,
  Title,
  Subheading,
  Avatar,
  Card,
  Button,
  Divider,
  useTheme,
  Chip,
  ProgressBar,
  List,
  FAB,
  Menu,
  IconButton,
  Surface,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/features/store';
import { User } from '../../redux/features/auth/authTypes';

const { width } = Dimensions.get('window');

interface SuperintendentDetailsScreenProps {
  route: { params: { userId: string } };
  navigation: any;
}

const SuperintendentDetailsScreen: React.FC<SuperintendentDetailsScreenProps> = ({ route, navigation }) => {
  const { userId } = route.params;
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [superintendent, setSuperintendent] = useState<User | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const performanceMetrics = {
    districtGrowth: 12.5,
    meetingsAttended: 24,
    projectsCompleted: 8,
    upcomingEvents: 3,
  };

  const recentActivities = [
    { id: '1', title: 'District Annual Meeting', date: '2023-05-15', type: 'meeting' },
    { id: '2', title: 'Leadership Training Workshop', date: '2023-04-28', type: 'training' },
    { id: '3', title: 'Community Outreach Program', date: '2023-04-10', type: 'event' },
    { id: '4', title: 'Budget Review Session', date: '2023-03-22', type: 'meeting' },
  ];

  const appointmentHistory = [
    { position: 'District Superintendent', district: 'North Region', startYear: 2020, endYear: 'Present' },
    { position: 'Assistant Superintendent', district: 'East Region', startYear: 2017, endYear: 2020 },
    { position: 'Regional Coordinator', district: 'Central District', startYear: 2014, endYear: 2017 },
  ];

  useEffect(() => {
    const loadSuperintendentData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch the user by ID
        // const response = await dispatch(fetchUserById(userId));
        // setSuperintendent(response.payload);
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          setSuperintendent({
            id: userId,
            username: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@district.org',
            phoneNumber: '+1 (555) 123-4567',
            role: 'district_superintendent',
            currentAppointedYear: 2020,
            district: {
              id: 'district-123',
              name: 'North Region District',
            },
            bio: 'Dr. Sarah Johnson has over 15 years of experience in educational leadership and administration. She holds a Ph.D. in Educational Leadership from Stanford University and has implemented several innovative programs that have significantly improved student outcomes in her district.',
            profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading superintendent data:', error);
        setIsLoading(false);
      }
    };

    loadSuperintendentData();
  }, [dispatch, userId]);

  const getAvatarColor = (name: string) => {
    const colors = [
      '#4CAF50', '#2196F3', '#9C27B0', '#F44336',
      '#FF9800', '#009688', '#673AB7', '#3F51B5'
    ];
    const charCode = name?.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.bioCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Biography</Title>
          <Text style={styles.bioText}>{superintendent?.bio}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.metricsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Performance Metrics</Title>
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Icon name="trending-up" size={24} color={theme.colors.primary} />
              <Text style={styles.metricValue}>{performanceMetrics.districtGrowth}%</Text>
              <Text style={styles.metricLabel}>District Growth</Text>
            </View>
            <View style={styles.metricItem}>
              <Icon name="calendar-check" size={24} color={theme.colors.primary} />
              <Text style={styles.metricValue}>{performanceMetrics.meetingsAttended}</Text>
              <Text style={styles.metricLabel}>Meetings</Text>
            </View>
            <View style={styles.metricItem}>
              <Icon name="check-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.metricValue}>{performanceMetrics.projectsCompleted}</Text>
              <Text style={styles.metricLabel}>Projects</Text>
            </View>
            <View style={styles.metricItem}>
              <Icon name="calendar-clock" size={24} color={theme.colors.primary} />
              <Text style={styles.metricValue}>{performanceMetrics.upcomingEvents}</Text>
              <Text style={styles.metricLabel}>Upcoming</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.activitiesCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.sectionTitle}>Recent Activities</Title>
            <Button
              mode="text"
              onPress={() => console.log('View all activities')}
              labelStyle={{ color: theme.colors.primary }}
            >
              View All
            </Button>
          </View>
          
          {recentActivities.map((activity) => (
            <List.Item
              key={activity.id}
              title={activity.title}
              description={new Date(activity.date).toLocaleDateString()}
              left={props => (
                <List.Icon
                  {...props}
                  icon={
                    activity.type === 'meeting' ? 'account-group' :
                    activity.type === 'training' ? 'school' : 'calendar-star'
                  }
                  color={
                    activity.type === 'meeting' ? '#2196F3' :
                    activity.type === 'training' ? '#4CAF50' : '#FF9800'
                  }
                />
              )}
              right={props => (
                <IconButton
                  {...props}
                  icon="chevron-right"
                  onPress={() => console.log(`View activity ${activity.id}`)}
                />
              )}
              style={styles.activityItem}
            />
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.historyCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Appointment History</Title>
          
          <View style={styles.timeline}>
            {appointmentHistory.map((appointment, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                {index < appointmentHistory.length - 1 && <View style={styles.timelineLine} />}
                
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTitle}>{appointment.position}</Text>
                    <Chip style={styles.timelineChip}>
                      {appointment.startYear} - {appointment.endYear}
                    </Chip>
                  </View>
                  <Text style={styles.timelineSubtitle}>{appointment.district}</Text>
                  <Text style={styles.timelineDescription}>
                    {appointment.position === 'District Superintendent' 
                      ? 'Led district operations and implemented strategic initiatives to improve educational outcomes.'
                      : appointment.position === 'Assistant Superintendent'
                      ? 'Assisted in district management and coordinated with school principals to ensure policy compliance.'
                      : 'Managed regional programs and served as liaison between schools and district office.'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.educationCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Education & Certifications</Title>
          
          <List.Item
            title="Ph.D. in Educational Leadership"
            description="Stanford University, 2010"
            left={props => <List.Icon {...props} icon="school" color={theme.colors.primary} />}
          />
          <Divider style={styles.listDivider} />
          
          <List.Item
            title="Master's in Education Administration"
            description="University of California, 2005"
            left={props => <List.Icon {...props} icon="school" color={theme.colors.primary} />}
          />
          <Divider style={styles.listDivider} />
          
          <List.Item
            title="Bachelor's in Education"
            description="University of Washington, 2002"
            left={props => <List.Icon {...props} icon="school" color={theme.colors.primary} />}
          />
          <Divider style={styles.listDivider} />
          
          <List.Item
            title="Educational Leadership Certification"
            description="National Board of Educational Leadership, 2012"
            left={props => <List.Icon {...props} icon="certificate" color="#FF9800" />}
          />
        </Card.Content>
      </Card>
    </View>
  );

  const renderDistrictTab = () => (
    <View style={styles.tabContent}>
      <Card style={styles.districtCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>District Information</Title>
          
          <View style={styles.districtInfo}>
            <View style={styles.districtHeader}>
              <Avatar.Icon size={60} icon="office-building" style={styles.districtIcon} />
              <View>
                <Title style={styles.districtName}>{superintendent?.district.name}</Title>
                <Chip style={styles.regionChip}>North Region</Chip>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Schools</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>486</Text>
                <Text style={styles.statLabel}>Staff</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12,450</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="District Office"
              description="1234 Education Ave, North City, State 98765"
              left={props => <List.Icon {...props} icon="map-marker" color={theme.colors.primary} />}
            />
            
            <List.Item
              title="Contact Number"
              description="(555) 987-6543"
              left={props => <List.Icon {...props} icon="phone" color={theme.colors.primary} />}
            />
            
            <List.Item
              title="Email"
              description="info@northregiondistrict.org"
              left={props => <List.Icon {...props} icon="email" color={theme.colors.primary} />}
            />
            
            <List.Item
              title="Website"
              description="www.northregiondistrict.org"
              left={props => <List.Icon {...props} icon="web" color={theme.colors.primary} />}
            />
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.goalsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>District Goals Progress</Title>
          
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Increase Graduation Rate</Text>
              <Text style={styles.goalPercentage}>78%</Text>
            </View>
            <ProgressBar progress={0.78} color={theme.colors.primary} style={styles.goalProgress} />
          </View>
          
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Implement New Curriculum</Text>
              <Text style={styles.goalPercentage}>65%</Text>
            </View>
            <ProgressBar progress={0.65} color={theme.colors.primary} style={styles.goalProgress} />
          </View>
          
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Staff Professional Development</Text>
              <Text style={styles.goalPercentage}>92%</Text>
            </View>
            <ProgressBar progress={0.92} color={theme.colors.primary} style={styles.goalProgress} />
          </View>
          
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Technology Integration</Text>
              <Text style={styles.goalPercentage}>45%</Text>
            </View>
            <ProgressBar progress={0.45} color={theme.colors.primary} style={styles.goalProgress} />
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
        <Avatar.Icon size={80} icon="account" style={{ backgroundColor: theme.colors.primary, opacity: 0.7 }} />
        <Title style={styles.loadingText}>Loading profile...</Title>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />
      
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Superintendent Profile" />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />
          }
        >
          <Menu.Item onPress={() => {
            setMenuVisible(false);
            navigation.navigate('EditSuperintendent', { userId });
          }} title="Edit Profile" />
          <Menu.Item onPress={() => {
            setMenuVisible(false);
            console.log('Send message');
          }} title="Send Message" />
          <Menu.Item onPress={() => {
            setMenuVisible(false);
            console.log('Print profile');
          }} title="Print Profile" />
        </Menu>
      </Appbar.Header>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <Surface style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {superintendent?.profileImage ? (
              <Avatar.Image 
                size={100} 
                source={{ uri: superintendent.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <Avatar.Text 
                size={100} 
                label={superintendent?.username.substring(0, 2).toUpperCase() || 'SJ'} 
                style={[styles.profileImage, { backgroundColor: getAvatarColor(superintendent?.username || '') }]} 
              />
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Title style={styles.profileName}>{superintendent?.username}</Title>
            <Chip 
              icon="account-tie" 
              style={styles.roleChip}
            >
              District Superintendent
            </Chip>
            
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Icon name="email-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.contactText}>{superintendent?.email}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Icon name="phone-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.contactText}>{superintendent?.phoneNumber}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Icon name="map-marker-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.contactText}>{superintendent?.district.name}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Icon name="calendar-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.contactText}>
                  Appointed: {superintendent?.currentAppointedYear}
                </Text>
              </View>
            </View>
          </View>
        </Surface>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Send message')}>
            <Icon name="message-text-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Schedule meeting')}>
            <Icon name="calendar-plus" size={24} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => console.log('View reports')}>
            <Icon name="file-document-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Reports</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]} 
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'history' && styles.activeTab]} 
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'district' && styles.activeTab]} 
            onPress={() => setActiveTab('district')}
          >
            <Text style={[styles.tabText, activeTab === 'district' && styles.activeTabText]}>District</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'district' && renderDistrictTab()}
      </ScrollView>
      
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="pencil"
        onPress={() => navigation.navigate('EditSuperintendent', { userId })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  appbar: {
    elevation: 0,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  profileHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderRadius: 0,
  },
  profileImageContainer: {
    marginRight: 20,
  },
  profileImage: {
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roleChip: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#e8f4fd',
  },
  contactInfo: {
    marginTop: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#333',
  },
  tabContent: {
    padding: 16,
  },
  bioCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  metricsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metricItem: {
    alignItems: 'center',
    width: '22%',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
    color: '#333',
  },
  metricLabel: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  activitiesCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityItem: {
    paddingVertical: 4,
  },
  historyCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4b5574',
    marginTop: 4,
    marginRight: 16,
    zIndex: 2,
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: 20,
    bottom: -20,
    width: 2,
    backgroundColor: '#e0e0e0',
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineChip: {
    height: 24,
    backgroundColor: '#f0f0f0',
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  educationCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  listDivider: {
    marginVertical: 8,
  },
  districtCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  districtInfo: {
    marginTop: 8,
  },
  districtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  districtIcon: {
    marginRight: 16,
    backgroundColor: '#4b5574',
  },
  districtName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  regionChip: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
  },
  goalsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  goalProgress: {
    height: 6,
    borderRadius: 3,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default SuperintendentDetailsScreen;