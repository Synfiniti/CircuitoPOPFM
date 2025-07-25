import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Orientation from "react-native-orientation-locker";
import Icon from "react-native-vector-icons/Ionicons";

// Importa Video condicionalmente. 
let Video;
if (Platform.OS === "android" || Platform.OS === "ios") {
  Video = require("react-native-video").Video;
} else {
  Video = ({
    source,
    style,
    controls,
    resizeMode,
    onFullscreenPlayerWillPresent,
    onFullscreenPlayerWillDismiss,
  }) => (
    <View
      style={[
        style,
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "gray",
        },
      ]}
    >
      <Text style={{ color: "white", fontSize: 16 }}>
        Video no disponible en la web.
      </Text>
    </View>
  );
}

export default function TVScreen() {
  const videoRef = useRef(null);
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const toggleFullscreen = () => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      if (isFullscreen) {
        videoRef.current?.dismissFullscreenPlayer();
        Orientation.lockToPortrait();
        setIsFullscreen(false);
      } else {
        videoRef.current?.presentFullscreenPlayer();
        Orientation.lockToLandscape();
        setIsFullscreen(true);
      }
    } else {
      console.warn(
        "Fullscreen toggle no soportado en la web para este reproductor."
      );
    }
  };

  const handleEnterFullscreen = () => {
    Orientation.lockToLandscape();
    setIsFullscreen(true);
  };

  const handleExitFullscreen = () => {
    Orientation.lockToPortrait();
    setIsFullscreen(false);
  };

  return (
    <View style={styles.container}>
      {/* Botón Volver */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <LinearGradient colors={["#ED00E7", "#630063"]} style={styles.button}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Loader */}
      {loading && !error && (
        <ActivityIndicator size="large" color="#ED00E7" style={styles.loader} />
      )}

      {/* Mensaje de error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Ocurrió un problema con la conexión, intente de nuevo más tarde.
          </Text>
        </View>
      )}

      {/* Reproductor de video */}
      {!error && (
        <Video
          ref={videoRef}
          source={{
            uri: "LINK SOURCE",
          }}
          style={styles.video}
          controls
          resizeMode="contain"
          fullscreen={false}
          onFullscreenPlayerWillPresent={handleEnterFullscreen}
          onFullscreenPlayerWillDismiss={handleExitFullscreen}
          onLoadStart={() => {
            setLoading(true);
            setError(false);
          }}
          onLoad={() => {
            setLoading(false);
            setError(false);
          }}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: 250,
    backgroundColor: "black",
  },
  backButton: {
    position: "absolute",
    top: 80,
    left: 15,
    zIndex: 2,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    borderRadius: 7,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
  },
  loader: {
    position: "absolute",
    zIndex: 3,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    margin: 20,
  },
  errorText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
