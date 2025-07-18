import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import SplashScreen from './src/screens/splash/Splash';
import NavigationController from './src/navigation/NavigationController';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
 
  const handleSplashComplete = () => {
    setIsLoading(false);
  };

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  // Show main app content after splash
  return (
    <>
      <NavigationController/>
    </>
  );
}