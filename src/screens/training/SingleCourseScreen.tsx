import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppDispatch } from '../../redux/features/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  enrollInTrainingModule,
  fetchSingleTrainingModule,
  setCurrentTraining,
} from '../../redux/features/course/trainingActions';
import { selectSingleTrainingModule } from '../../redux/features/course/trainingSelectors';
import { EnrollInTrainingModule } from '../../redux/features/course/trainingTypes';
import { selectUser } from '../../redux/features/auth/authSelectors';
import { ResizeMode, Video } from 'expo-av';
import { WebView } from 'react-native-webview';

interface Section {
  id: string;
  title: string;
  duration: string;
}

const SingleCourseScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'curriculum'>('about');
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState<boolean>(false);
  const [contentUri, setContentUri] = useState<string | null>(null);

  const route = useRoute<RouteProp<{ params: { id: string } }, 'params'>>();
  const { id } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const training = useSelector(selectSingleTrainingModule);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(fetchSingleTrainingModule({ id }));
  }, [id, dispatch]);

  const sections: Section[] = [
    {
      id: '1',
      title: 'Understanding Leadership in the Church',
      duration: '20 Mins',
    },
    {
      id: '2',
      title: 'Effective District Administration Practices',
      duration: '25 Mins',
    },
    {
      id: '3',
      title: 'Building Community through Ministry',
      duration: '30 Mins',
    },
    {
      id: '4',
      title: 'Conflict Resolution Strategies',
      duration: '15 Mins',
    },
  ];

  const renderSection: ListRenderItem<Section> = ({ item }) => (
    <View style={styles.sectionItem}>
      <View style={styles.sectionLeft}>
        <Text style={styles.sectionIndex}>{item.id}</Text>
      </View>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <Text style={styles.sectionDuration}>{item.duration}</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="play-circle" size={24} color="#1E90FF" />
      </TouchableOpacity>
    </View>
  );

  const hanldeEnrollInTraining = async (enrollData: EnrollInTrainingModule) => {
    dispatch(enrollInTrainingModule(enrollData)).then((response) => {
      if (enrollInTrainingModule.fulfilled.match(response)) {
        dispatch(fetchSingleTrainingModule({ id }));
      }
    });
  };

  const handleAccessContent = async () => {
    if (!training?.contentUrl) {
      Alert.alert('Access Denied', 'Please enroll in this course to access the content.');
      return;
    }

    if (training.contentUrl.endsWith('.mp4') || training.contentUrl.endsWith('.mkv')) {
      setContentUri(training.contentUrl);
      setShowVideo(true);
      if (user)
      await dispatch(setCurrentTraining({ userId: user?.id, trainingId: training.id }));
    } else if (training.contentUrl.endsWith('.pdf')) {
      setContentUri(training.contentUrl);
      setShowPdf(true);
      if (user)
      await dispatch(setCurrentTraining({ userId: user?.id, trainingId: training.id }));
    } else {
      Alert.alert(
        'Unsupported Content',
        'This content is not a video or PDF. Please check with the course administrator.'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Course Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: training?.posterUrl,
          }}
          style={styles.courseImage}
          resizeMode="cover"
        />
      </View>

      {/* Course Header */}
      <View style={styles.header}>
        <Text style={styles.category}>District Superintendent's Academy</Text>
        <Text style={styles.title}>{training?.title}</Text>
        <View style={styles.stats}>
          <Text style={styles.statsText}>4 Modules</Text>
          <Text style={styles.statsSeparator}>|</Text>
          <Text style={styles.statsText}>90 Minutes</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('about')}>
          <Text
            style={[
              styles.tab,
              activeTab === 'about' && styles.activeTab,
            ]}
          >
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('curriculum')}>
          <Text
            style={[
              styles.tab,
              activeTab === 'curriculum' && styles.activeTab,
            ]}
          >
            Curriculum
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'about' ? (
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutText}>{training?.description}</Text>
          </View>
        ) : (
          <View style={styles.curriculum}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>Module 1 - Foundations of Leadership</Text>
              <Text style={styles.sectionDuration}>90 Mins</Text>
            </View>
            <FlatList
              data={sections}
              renderItem={renderSection}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.sectionList}
            />
          </View>
        )}
      </View>

      {/* Enroll Button */}
      <TouchableOpacity
        style={styles.enrollButton}
        onPress={() =>
          hanldeEnrollInTraining({ userId: user?.id, trainingModuleId: training?.id })
        }
      >
        <Text style={styles.enrollText}>Enroll Course</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAccessContent}>
        <Ionicons
          name="play-circle"
          size={24}
          color={training?.contentUrl ? '#1E90FF' : '#ccc'}
        />
      </TouchableOpacity>

      {/* Video Modal */}
      {showVideo && (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: videoUri! }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            useNativeControls
            style={styles.video}
          />
          <TouchableOpacity
            onPress={() => setShowVideo(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* PDF Viewer */}
      {showPdf && contentUri && (
        <View style={styles.webViewContainer}>
          <WebView
            source={{ uri: `https://docs.google.com/gview?embedded=true&url=${contentUri}` }}
            style={styles.webView}
            javaScriptEnabled
            domStorageEnabled
            onError={() => Alert.alert('Error', 'Failed to load PDF')}
          />
          <TouchableOpacity
            onPress={() => setShowPdf(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SingleCourseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#e6e6e6',
  },
  courseImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: -30,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  category: {
    fontSize: 14,
    color: '#1E90FF',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsText: {
    fontSize: 12,
    color: '#777',
  },
  statsSeparator: {
    marginHorizontal: 8,
    fontSize: 12,
    color: '#777',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  tab: {
    fontSize: 14,
    color: '#777',
  },
  activeTab: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
  aboutContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  aboutText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 20,
  },
  curriculum: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionDuration: {
    fontSize: 12,
    color: '#777',
  },
  sectionList: {
    paddingVertical: 8,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLeft: {
    width: 40,
    height: 40,
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIndex: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  enrollButton: {
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  enrollText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '90%',
    height: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
  webViewContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  webView: {
    flex: 1,
    marginTop: 50,
  },
});
