import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  Pressable, 
  KeyboardAvoidingView,
  Platform,
  View,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import InputField from '../components/input/InputField';

const { width, height } = Dimensions.get('window');


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const bottomSheetAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(bottomSheetAnim, {
        toValue: 0,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("main");
    }, 1500);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>
                Sign in to continue your security journey
              </Text>
            </View>

            {/* Security badges */}
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <View style={styles.badgeIcon} />
                <Text style={styles.badgeText}>Secure</Text>
              </View>
              <View style={styles.badge}>
                <View style={styles.badgeIcon} />
                <Text style={styles.badgeText}>Protected</Text>
              </View>
            </View>
          </Animated.View>

          {/* Bottom Sheet Section */}
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                transform: [{ translateY: bottomSheetAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#0F172A', '#1E293B', '#334155']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientContainer}
            >
              {/* Form Header */}
              <View style={styles.formHeader}>
                <View style={styles.handleBar} />
                <Text style={styles.formTitle}>Sign In</Text>
                <Text style={styles.formSubtitle}>Enter your credentials to continue</Text>
              </View>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.enhancedInputField}>
                    <InputField
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                      placeholderTextColor="#64748B"
                    />
                    <View style={styles.inputIcon} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.enhancedInputField}>
                    <InputField
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      style={styles.input}
                      placeholderTextColor="#64748B"
                    />
                    <View style={styles.inputIcon} />
                  </View>
                </View>

                {/* Forgot Password */}
                <Pressable style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <View style={styles.buttonContainer}>
                <Pressable 
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={['#3B82F6', '#1E40AF', '#1E3A8A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.loginButtonGradient}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <View style={styles.loadingSpinner} />
                        <Text style={styles.loginButtonText}>Signing In...</Text>
                      </View>
                    ) : (
                      <>
                        <Text style={styles.loginButtonText}>Sign In</Text>
                        <Text style={styles.loginButtonArrow}>→</Text>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>

                

                {/* Register Link */}
                <Pressable 
                  style={styles.registerContainer}
                  onPress={() => navigation.navigate('register')}
                >
                  <Text style={styles.registerText}>
                    Don't have an account? <Text style={styles.registerLink}>Create one</Text>
                  </Text>
                </Pressable>
              </View>
            </LinearGradient>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundDecorations: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.06,
  },
  circle1: {
    width: 180,
    height: 180,
    backgroundColor: '#3B82F6',
    top: -40,
    right: -60,
  },
  circle2: {
    width: 120,
    height: 120,
    backgroundColor: '#8B5CF6',
    top: 80,
    left: -40,
  },
  circle3: {
    width: 80,
    height: 80,
    backgroundColor: '#06B6D4',
    top: 160,
    right: 40,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    minHeight: height * 0.4,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  badgeIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  bottomSheet: {
    flex: 1,
    minHeight: height * 0.6,
  },
  gradientContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 32,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
    marginLeft: 4,
  },
  enhancedInputField: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    transform: [{ translateY: -3 }],
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  loginButton: {
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
    letterSpacing: 0.5,
  },
  loginButtonArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '300',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#FFFFFF',
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: '#94A3B8',
    fontSize: 12,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  socialContainer: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  registerText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
  registerLink: {
    color: '#3B82F6',
    fontWeight: '600',
  },
};