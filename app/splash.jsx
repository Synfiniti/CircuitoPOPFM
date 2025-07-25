// splash.jsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreenExpo from "expo-splash-screen"; // Necesitas importarlo aquí para hideAsync

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SplashScreen({ onFinishLoading }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const exitAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-100)).current;

  // No necesitamos dynamicSplashReady para controlar hideAsync
  // Solo lo usaremos para el setTimeout de recursos y la animación de salida.
  const [resourcesLoaded, setResourcesLoaded] = React.useState(false);


  useEffect(() => {
    // === Ocultar splash nativo ANTES de tus animaciones de entrada ===
    // Asegúrate de que esto se llame lo más pronto posible una vez que el JS del splash está cargado.
    SplashScreenExpo.hideAsync();

    // === Animaciones de Entrada ===
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressAnim, {
      toValue: SCREEN_WIDTH * 0.6,
      duration: 4000,
      useNativeDriver: false, // 'useNativeDriver' no es compatible con 'width'
    }).start();

    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: SCREEN_WIDTH * 0.6 + 50, // Ajusta toValue para que el shimmer salga completamente
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    shimmerLoop.start();

    // === Carga de Recursos ===
    async function loadAppResources() {
      try {
        // Tu carga de recursos, aquí se simula con un setTimeout
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


  // === Animación de Salida ===
  useEffect(() => {
    // Este useEffect se dispara cuando los recursos están listos.
    if (!resourcesLoaded) return;

    console.log("🔔 Recursos cargados — preparando animación de salida...");
    // El pequeño setTimeout es para asegurar que la barra de progreso termine
    const timeout = setTimeout(() => {
      Animated.timing(exitAnim, {
        toValue: 0,
        duration: 700, // Duración de la animación de salida del splash JSX
        useNativeDriver: true,
      }).start(() => {
        console.log("✅ Animación salida de SplashScreen.jsx completada. Notificando a Layout...");
        onFinishLoading(); // Notifica a Layout.jsx que el splash JSX ha terminado
      });
    }, 200); // Espera un poco para asegurar que las animaciones de entrada hayan avanzado

    return () => clearTimeout(timeout);
  }, [resourcesLoaded, onFinishLoading, exitAnim]); // Dependencias

  return (
    <Animated.View style={[styles.container, { opacity: exitAnim }]}>
      {/* ... (el resto de tu renderizado, no hay cambios aquí) */}
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
    zIndex: 100, // Es bueno que tenga un zIndex alto para asegurar que se superponga
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
    // Asegúrate de que el shimmer comience fuera del área visible y termine fuera
    width: '100%', // El ancho del shimmer overlay debe ser el mismo que el progressBar
    // backgroundColor: 'red', // Para depuración
  },
  shimmer: {
    width: 80, // Ancho de la "luz" del shimmer
    height: "100%",
  },
});