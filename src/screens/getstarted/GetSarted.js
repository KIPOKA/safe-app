import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Image, 
  StatusBar, 
  Animated, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SplashIcon from "../../../assets/2345470.png";

const { width, height } = Dimensions.get('window');

export default function GetStarted({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleButtonPressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Background Decorations */}
      <View style={styles.backgroundDecorations}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Top Section */}
      <Animated.View 
        style={[
          styles.topSection,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <View style={styles.imageContainer}>
          <View style={styles.imageGlow} />
          <Image source={SplashIcon} style={styles.image} />
        </View>
        
        <Text style={styles.title}>Welcome to{'\n'}SafetyApp</Text>
        <Text style={styles.subtitle}>
          Your intelligent security companion designed for complete peace of mind. 
          Advanced protection made simple.
        </Text>
        
        {/* Feature highlights */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Real-time monitoring</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>Instant alerts</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureDot} />
            <Text style={styles.featureText}>24/7 protection</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Gradient Section */}
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.bottomSection}
      >
        <View style={styles.bottomContent}>
          <Animated.View
            style={[
              styles.buttonContainer,
              { transform: [{ scale: buttonScaleAnim }] }
            ]}
          >
            <Pressable 
              style={styles.button}
              onPress={() => navigation.replace('login')}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
            >
              <LinearGradient
                colors={['#3B82F6', '#1E40AF', '#1E3A8A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <Text style={styles.buttonSubtext}>→</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
          
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  backgroundDecorations: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.1,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: '#3B82F6',
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: '#8B5CF6',
    top: 100,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: '#06B6D4',
    top: 200,
    right: 50,
  },
  topSection: {
    flex: 1.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  imageGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    backgroundColor: '#3B82F6',
    borderRadius: 70,
    opacity: 0.2,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 17,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 26,
    marginBottom: 32,
    fontWeight: '400',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginBottom: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  featureText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomSection: {
    flex: 0.7,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
  },
  bottomContent: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  button: {
    borderRadius: 20,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    marginRight: 8,
    letterSpacing: 0.5,
  },
  buttonSubtext: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '300',
  },
  termsText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 18,
    fontWeight: '400',
  },
});