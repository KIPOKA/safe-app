import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import SplashIcon from "../../../assets/2345470.png"
import { styled } from 'nativewind';
const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onAnimationComplete }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const shieldGlow = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const particleAnimations = useRef([...Array(8)].map(() => ({
    translateY: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    startAnimations();
  }, []);
  const StyledImage = styled(Image);

  const startAnimations = () => {
    // Logo entrance animation
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Shield glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shieldGlow, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(shieldGlow, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Text animation
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 1000,
      useNativeDriver: true,
    }).start();

    // Loading progress animation
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 3000,
      delay: 1500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Ripple animation
    Animated.loop(
      Animated.timing(rippleScale, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    // Particle animations
    particleAnimations.forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.opacity, {
            toValue: 1,
            duration: 1000,
            delay: index * 200,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateY, {
            toValue: -200,
            duration: 4000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Complete animation after 4.5 seconds
    setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 4500);
  };

  const Shield = () => {
    const glowColor = shieldGlow.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(79, 172, 254, 0.3)', 'rgba(79, 172, 254, 0.8)'],
    });

    return (
      <Animated.View
        style={[
          styles.shieldContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        <View style={styles.shield}>
          <LinearGradient
            colors={['#ffffff', '#f0f0f0']}
            style={styles.shieldOuter}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View
              style={[
                styles.shieldInner,
                {
                  shadowColor: glowColor,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 20,
                  shadowOpacity: 1,
                },
              ]}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.shieldGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            <View style={styles.checkmark}>
              <View style={styles.checkmarkLine} />
            </View>
          </LinearGradient>
        </View>

        {/* Ripple Effect */}
        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleScale.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 0],
              }),
            },
          ]}
        />
      </Animated.View>
    );
  };

  const Particles = () => {
    return (
      <View style={styles.particlesContainer}>
        {particleAnimations.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: `${10 + index * 11}%`,
                transform: [{ translateY: particle.translateY }],
                opacity: particle.opacity,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Particles />
      
      <View style={styles.content}>
       <View className="flex-1 justify-center items-center bg-white">
            <StyledImage
                source={SplashIcon}
                style={{ width: 128, height: 128 }}
            />

    </View>
        <Animated.View
          style={[
            styles.textContainer,
            { opacity: textOpacity },
          ]}
        >
          <Text style={styles.appName}>SAFE</Text>
          <Text style={styles.tagline}>Your Security, Our Priority</Text>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.loadingContainer,
            { opacity: textOpacity },
          ]}
        >
          <Text style={styles.loadingText}>Initializing Security Protocols...</Text>
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  width: loadingProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.progressGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
    bottom: height,
  },
  shieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  shield: {
    position: 'relative',
  },
  shieldOuter: {
    width: 120,
    height: 140,
    borderRadius: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  shieldInner: {
    width: 90,
    height: 110,
    borderRadius: 45,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  shieldGradient: {
    width: '100%',
    height: '100%',
  },
  checkmark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -10 }],
  },
  checkmarkLine: {
    width: 20,
    height: 10,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#ffffff',
    transform: [{ rotate: '-45deg' }],
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -40,
    left: -40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
    letterSpacing: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 20,
    letterSpacing: 1,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    borderRadius: 2,
  },
  progressGradient: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;