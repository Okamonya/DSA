import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation'; // Import ScreenOrientation

interface PDFViewerProps {
  sourceUrl: string;
  closePdf: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ sourceUrl, closePdf }) => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const CACHE_KEY = `lastViewedPdfPage_${sourceUrl}`;

  // Lock screen orientation to landscape when the component mounts
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };

    lockOrientation();

    // Cleanup: Unlock orientation when the component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    const loadCacheOrSetNewUrl = async () => {
      const savedUrl = await AsyncStorage.getItem(CACHE_KEY);
      const googleViewerUrl = getGoogleViewerUrl(sourceUrl);

      if (savedUrl && savedUrl.includes(encodeURIComponent(sourceUrl))) {
        setCurrentUrl(savedUrl); // Load cached URL if it matches the current sourceUrl
      } else {
        setCurrentUrl(googleViewerUrl); // Set the new URL if it's different
        await AsyncStorage.setItem(CACHE_KEY, googleViewerUrl);
      }
    };

    loadCacheOrSetNewUrl();
  }, [sourceUrl]); // Trigger the effect whenever sourceUrl changes

  const getGoogleViewerUrl = (pdfUrl: string) => {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
  };

  const saveCache = async (url: string) => {
    await AsyncStorage.setItem(CACHE_KEY, url);
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    if (!url.startsWith('https://docs.google.com')) {
      webViewRef.current?.stopLoading(); // Prevent unwanted navigation
    } else {
      saveCache(url); // Save the navigation state URL to cache
    }
  };

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const injectScrollScript = `
    (function() {
      var scrollPosition = localStorage.getItem('scrollPosition_${sourceUrl}');
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
      }
      window.onscroll = function() {
        localStorage.setItem('scrollPosition_${sourceUrl}', window.pageYOffset);
      };
    })();
  `;

  return (
    <View style={styles.container}>
      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1E90FF" />
        </View>
      )}

      {/* WebView for PDF */}
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl || getGoogleViewerUrl(sourceUrl) }}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        cacheEnabled
        javaScriptEnabled
        domStorageEnabled
        style={styles.webview}
        injectedJavaScript={injectScrollScript}
        onMessage={(event) => {
          // Handle any messages from the WebView if needed
        }}
      />

      {/* Custom Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handleRefresh}>
          <Ionicons name="refresh" size={24} color="#fff" />
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.closeButton]}
          onPress={() => {
            closePdf(); // Close the PDF viewer
            ScreenOrientation.unlockAsync(); // Unlock orientation when closing
          }}
        >
          <Ionicons name="close" size={24} color="#fff" />
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  closeButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default PDFViewer;