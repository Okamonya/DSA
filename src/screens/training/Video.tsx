import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface VideoPlayerProps {
  source: string;
  closeVideo: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source, closeVideo }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewind = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if ('positionMillis' in status && 'durationMillis' in status) {
        const newPosition = Math.max(status.positionMillis - 5000, 0);
        await videoRef.current.setPositionAsync(newPosition);
      }
    }
  };

  const handleForward = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if ('positionMillis' in status && 'durationMillis' in status) {
        const newPosition = Math.min(status.positionMillis + 5000, status.durationMillis);
        await videoRef.current.setPositionAsync(newPosition);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={closeVideo} style={styles.closeButton}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
      
      <Video
        ref={videoRef}
        source={{ uri: source }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls={false}
        onPlaybackStatusUpdate={(status) => setIsBuffering(status.isBuffering)}
      />

      {/* {isBuffering && (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      )} */}

      <View style={styles.controls}>
        <TouchableOpacity onPress={handleRewind} style={styles.button}>
          <Ionicons name="play-back" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPause} style={styles.button}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForward} style={styles.button}>
          <Ionicons name="play-forward" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 300,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  button: {
    padding: 10,
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
});

export default VideoPlayer;
