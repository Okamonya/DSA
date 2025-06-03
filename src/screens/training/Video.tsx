"use client"

import type React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
} from "react-native"
import { ResizeMode, Video, type AVPlaybackStatus } from "expo-av"
import { Ionicons } from "@expo/vector-icons"
import * as ScreenOrientation from "expo-screen-orientation"
import { LinearGradient } from "expo-linear-gradient"

interface VideoPlayerProps {
  source: string
  closeVideo: () => void
  title?: string
  autoPlay?: boolean
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source, closeVideo, title = "Video Player", autoPlay = false }) => {
  const videoRef = useRef<Video>(null)
  const controlsOpacity = useRef(new Animated.Value(1)).current
  const hideControlsTimer = useRef<NodeJS.Timeout>()

  // Video state
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay)
  const [isBuffering, setIsBuffering] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(0)
  const [position, setPosition] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1.0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0)

  // UI state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [controlsVisible, setControlsVisible] = useState<boolean>(true)
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false)

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current)
    }

    setControlsVisible(true)
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start()

    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false)
        Animated.timing(controlsOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start()
      }
    }, 3000)
  }, [isPlaying, controlsOpacity])

  // Handle orientation changes
  const toggleFullscreen = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
        StatusBar.setHidden(true)
      }
      setIsFullscreen(!isFullscreen)
    } catch (error) {
      console.error("Error toggling fullscreen:", error)
    }
  }, [isFullscreen])

  // Video controls
  const handlePlayPause = useCallback(async () => {
    if (!videoRef.current) return

    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync()
      } else {
        await videoRef.current.playAsync()
      }
      setIsPlaying(!isPlaying)
      resetControlsTimer()
    } catch (error) {
      console.error("Error toggling play/pause:", error)
    }
  }, [isPlaying, resetControlsTimer])

  const handleSeek = useCallback(
    async (seconds: number) => {
      if (!videoRef.current) return

      try {
        const newPosition = Math.max(0, Math.min(position + seconds * 1000, duration))
        await videoRef.current.setPositionAsync(newPosition)
        resetControlsTimer()
      } catch (error) {
        console.error("Error seeking:", error)
      }
    },
    [position, duration, resetControlsTimer],
  )

  const handleProgressSeek = useCallback(
    async (progress: number) => {
      if (!videoRef.current || !duration) return

      try {
        const newPosition = progress * duration
        await videoRef.current.setPositionAsync(newPosition)
        resetControlsTimer()
      } catch (error) {
        console.error("Error seeking to position:", error)
      }
    },
    [duration, resetControlsTimer],
  )

  const handleVolumeToggle = useCallback(async () => {
    if (!videoRef.current) return

    try {
      const newMutedState = !isMuted
      await videoRef.current.setIsMutedAsync(newMutedState)
      setIsMuted(newMutedState)
      resetControlsTimer()
    } catch (error) {
      console.error("Error toggling mute:", error)
    }
  }, [isMuted, resetControlsTimer])

  const handleSpeedChange = useCallback(
    async (speed: number) => {
      if (!videoRef.current) return

      try {
        await videoRef.current.setRateAsync(speed, true)
        setPlaybackSpeed(speed)
        setShowSpeedMenu(false)
        resetControlsTimer()
      } catch (error) {
        console.error("Error changing playback speed:", error)
      }
    },
    [resetControlsTimer],
  )

  // Handle video status updates
  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        setIsLoading(false)
        setHasError(false)
        setIsBuffering(status.isBuffering || false)
        setPosition(status.positionMillis || 0)
        setDuration(status.durationMillis || 0)

        if (status.didJustFinish) {
          setIsPlaying(false)
          setControlsVisible(true)
          Animated.timing(controlsOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start()
        }
      } else {
        setHasError(true)
        setIsLoading(false)
      }
    },
    [controlsOpacity],
  )

  // Handle screen tap to show/hide controls
  const handleScreenTap = useCallback(() => {
    if (controlsVisible) {
      setControlsVisible(false)
      Animated.timing(controlsOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      resetControlsTimer()
    }
  }, [controlsVisible, controlsOpacity, resetControlsTimer])

  // Format time
  const formatTime = useCallback((milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }, [])

  // Handle component unmount
  const handleClose = useCallback(async () => {
    try {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        StatusBar.setHidden(false)
      }
      closeVideo()
    } catch (error) {
      console.error("Error closing video:", error)
      closeVideo()
    }
  }, [isFullscreen, closeVideo])

  // Initialize controls timer
  useEffect(() => {
    resetControlsTimer()
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current)
      }
    }
  }, [resetControlsTimer])

  // Calculate progress
  const progress = duration > 0 ? position / duration : 0

  const containerStyle = isFullscreen ? [styles.container, styles.fullscreenContainer] : styles.container

  const videoStyle = isFullscreen ? [styles.video, styles.fullscreenVideo] : styles.video

  if (hasError) {
    return (
      <View style={containerStyle}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ff4444" />
          <Text style={styles.errorText}>Failed to load video</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => setHasError(false)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={containerStyle}>
      <TouchableOpacity style={styles.videoContainer} activeOpacity={1} onPress={handleScreenTap}>
        <Video
          ref={videoRef}
          source={{ uri: source }}
          style={[videoStyle, { objectFit: "contain" as any }]}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls={false}
          shouldPlay={isPlaying}
          isLooping={false}
          volume={volume}
          isMuted={isMuted}
          rate={playbackSpeed}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}

        {/* Buffering indicator */}
        {isBuffering && !isLoading && (
          <View style={styles.bufferingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {/* Controls overlay */}
        <Animated.View
          style={[styles.controlsOverlay, { opacity: controlsOpacity }]}
          pointerEvents={controlsVisible ? "auto" : "none"}
        >
          <LinearGradient colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.7)"]} style={styles.gradient}>
            {/* Top controls */}
            <View style={styles.topControls}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.videoTitle} numberOfLines={1}>
                {title}
              </Text>
              <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenButton}>
                <Ionicons name={isFullscreen ? "contract-outline" : "expand-outline"} size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Center controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity onPress={() => handleSeek(-10)} style={styles.seekButton}>
                <Ionicons name="play-back" size={40} color="white" />
                <Text style={styles.seekText}>10</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={50} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleSeek(10)} style={styles.seekButton}>
                <Ionicons name="play-forward" size={40} color="white" />
                <Text style={styles.seekText}>10</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom controls */}
            <View style={styles.bottomControls}>
              {/* Progress bar */}
              <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                  </View>
                  <TouchableOpacity
                    style={[styles.progressThumb, { left: `${progress * 100}%` }]}
                    onPress={() => { }} // Handle thumb drag if needed
                  />
                </View>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>

              {/* Control buttons */}
              <View style={styles.controlButtons}>
                <TouchableOpacity onPress={handleVolumeToggle} style={styles.controlButton}>
                  <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowSpeedMenu(!showSpeedMenu)} style={styles.controlButton}>
                  <Text style={styles.speedText}>{playbackSpeed}x</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Speed menu */}
            {showSpeedMenu && (
              <View style={styles.speedMenu}>
                {speedOptions.map((speed) => (
                  <TouchableOpacity
                    key={speed}
                    onPress={() => handleSpeedChange(speed)}
                    style={[styles.speedOption, playbackSpeed === speed && styles.activeSpeedOption]}
                  >
                    <Text style={[styles.speedOptionText, playbackSpeed === speed && styles.activeSpeedOptionText]}>
                      {speed}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenContainer: {
    width: screenHeight,
    height: screenWidth,
  },
  videoContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
    aspectRatio: 16 / 9,
  },
  fullscreenVideo: {
    width: "100%",
    height: "100%",
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  videoTitle: {
    flex: 1,
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 15,
  },
  fullscreenButton: {
    padding: 8,
  },
  centerControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  seekButton: {
    alignItems: "center",
    marginHorizontal: 30,
  },
  seekText: {
    color: "white",
    fontSize: 12,
    marginTop: -10,
  },
  playButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 40,
    padding: 15,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  timeText: {
    color: "white",
    fontSize: 14,
    minWidth: 45,
    textAlign: "center",
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 15,
    position: "relative",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff4444",
    borderRadius: 2,
  },
  progressThumb: {
    position: "absolute",
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: "#ff4444",
    borderRadius: 8,
    marginLeft: -8,
  },
  controlButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlButton: {
    padding: 8,
  },
  speedText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  speedMenu: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 8,
    padding: 8,
  },
  speedOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  activeSpeedOption: {
    backgroundColor: "#ff4444",
  },
  speedOptionText: {
    color: "white",
    fontSize: 16,
  },
  activeSpeedOptionText: {
    fontWeight: "bold",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  bufferingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "white",
    fontSize: 18,
    marginTop: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default VideoPlayer
