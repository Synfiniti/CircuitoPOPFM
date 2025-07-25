import React, { useState, useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import * as SplashScreenExpo from "expo-splash-screen";
import SplashScreen from "./splash";

// Mantén el splash screen nativo visible hasta que lo ocultemos explícitamente desde splash.jsx.
SplashScreenExpo.preventAutoHideAsync();

export default function Layout() {
  const [splashComponentFinished, setSplashComponentFinished] = useState(false);

  // No necesitamos un useEffect para `hideAsync` aquí,
  // ya que `splash.jsx` lo llamará directamente.

  const handleSplashAnimationFinished = useCallback(() => {
    setSplashComponentFinished(true);
  }, []);

  // Si la animación de tu SplashScreen.jsx no ha terminado, muéstralo.
  if (!splashComponentFinished) {
    return <SplashScreen onFinishLoading={handleSplashAnimationFinished} />;
  }

  // Una vez que tu SplashScreen.jsx ha terminado, renderiza la pila principal.
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="radio" options={{ headerShown: false }} />
      <Stack.Screen name="tv" options={{ headerShown: false }} />
      {/* Si tienes otras rutas, agrégalas aquí */}
    </Stack>
  );
}