// splash.jsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreenExpo from "expo-splash-screen"; 

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SplashScreen({ onFinishLoading }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const exitAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-100)).current;

  
  const [resourcesLoaded, setResourcesLoaded] = React.useState(false);


  useEffect(() => {
    
    SplashScreenExpo.hideAsync();

    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressAnim, {
      toValue: SCREEN_WIDTH * 0.6,
      duration: 4000,
      useNativeDriver: false, 
    }).start();

    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: SCREEN_WIDTH * 0.6 + 50, 
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    shimmerLoop.start();

    
    async function loadAppResources() {
      try {
        await new Promise((r) => setTimeout(r, 3000));
      } catch (e) {
        console.warn("Error cargando recursos en splash:", e);
      } finally {
        setResourcesLoaded(true); // Indica que los recursos del splash o de la app están listos
      }
    }
    loadAppResources();

    return () => shimmerLoop.stop();
  }, []); // Dependencias vacías para que se ejecute una vez al montar


  
  useEffect(() => {
    // Este useEffect se dispara cuando los recursos están listos.
    if (!resourcesLoaded) return;

    console.log("🔔 Recursos cargados — preparando animación de salida...");
    const timeout = setTimeout(() => {
      Animated.timing(exitAnim, {
        toValue: 0,
        duration: 700, 
        useNativeDriver: true,
      }).start(() => {
        console.log("✅ Animación salida de SplashScreen.jsx completada. Notificando a Layout...");
        onFinishLoading(); 
      });
    }, 200); 

    return () => clearTimeout(timeout);
  }, [resourcesLoaded, onFinishLoading, exitAnim]); // Dependencias

  return (
    <Animated.View style={[styles.container, { opacity: exitAnim }]}>
      
      <LinearGradient
        colors={["rgba(169,0,165,1)", "rgba(90,0,92,1)"]}
        style={styles.background}
      />
      <Animated.Image
        source={require("../assets/images/logo.png")}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <View style={styles.progressBarWrapper}>
        <Animated.View style={[styles.progressBar, { width: progressAnim }]}>
          <LinearGradient
            colors={["#ed00e7", "#b300b8", "#630063"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                transform: [{ translateX: shimmerAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shimmer}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100, 
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  progressBarWrapper: {
    width: "60%",
    height: 8,
    backgroundColor: "#ffffff33",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    
    width: '100%', 
  },
  shimmer: {
    width: 80, 
    height: "100%",
  },
});
