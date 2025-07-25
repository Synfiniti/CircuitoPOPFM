import React, { useState, useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import * as SplashScreenExpo from "expo-splash-screen";
import SplashScreen from "./splash";


SplashScreenExpo.preventAutoHideAsync();

export default function Layout() {
  const [splashComponentFinished, setSplashComponentFinished] = useState(false);

  .

  const handleSplashAnimationFinished = useCallback(() => {
    setSplashComponentFinished(true);
  }, []);

  
  if (!splashComponentFinished) {
    return <SplashScreen onFinishLoading={handleSplashAnimationFinished} />;
  }

  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="radio" options={{ headerShown: false }} />
      <Stack.Screen name="tv" options={{ headerShown: false }} />
      {/* Si tienes otras rutas, agrégalas aquí */}
    </Stack>
  );
}
