import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Vibration,
} from 'react-native';
import { AlertCircle, MessageSquare, Send, Shield, MapPin, Phone, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from '../../../tw';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatBotVisible, setChatBotVisible] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I\'m your safety assistant. How can I help you today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Initial entrance animations
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
    ]).start();

    // Continuous pulse animation
    const pulse = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]).start(() => pulse());
    };

    // Ripple effect animation
    const ripple = () => {
      Animated.sequence([
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => ripple());
    };

    pulse();
    ripple();
  }, []);

  const handleAlertPress = () => {
    Vibration.vibrate([0, 100, 50, 100]);
    
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setModalVisible(true);
  };

  const handleSelectEmergency = (type) => {
    setSelectedEmergency(type);
    setModalVisible(false);
    setChatVisible(true);
    
    // Enhanced alert with vibration
    Vibration.vibrate([0, 200, 100, 200]);
    
    setTimeout(() => {
      alert(`🚨 Emergency Alert Sent: ${type}!\n\nHelp is on the way. Stay calm and follow safety protocols.`);
    }, 500);
  };

  const handleChatPress = () => {
    setChatBotVisible(true);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = generateBotReply(inputText);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '_bot', text: botReply, sender: 'bot' },
      ]);
    }, 1500);

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 150);
  };

  const generateBotReply = (userMsg) => {
    const lower = userMsg.toLowerCase();
    if (lower.includes('help') || lower.includes('emergency')) 
      return 'I\'m here to help! You can tap the emergency button or tell me what specific assistance you need.';
    if (lower.includes('ambulance') || lower.includes('medical')) 
      return '🚑 Medical emergency detected. I\'m contacting emergency services immediately. Stay calm and describe your situation.';
    if (lower.includes('police') || lower.includes('crime')) 
      return '🚔 Contacting police services now. Are you in immediate danger? Please share your location if safe to do so.';
    if (lower.includes('fire')) 
      return '🚒 Fire emergency reported. Firefighters are being dispatched. Please evacuate to a safe location immediately.';
    if (lower.includes('location') || lower.includes('where')) 
      return '📍 I can help you share your location with emergency services. Would you like me to do that?';
    if (lower.includes('safe') || lower.includes('security')) 
      return '🛡️ Your safety is my priority. I\'m monitoring your situation and ready to assist with any security concerns.';
    return "I understand you need assistance. Can you tell me more about your situation so I can provide the best help possible?";
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <Animated.View
        style={[
          {
            maxWidth: '85%',
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            marginVertical: 4,
            marginHorizontal: 16,
          }
        ]}
      >
        <View
          style={[
            {
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 20,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 3,
            },
            isUser ? {
              backgroundColor: '#3B82F6',
              borderBottomRightRadius: 4,
            } : {
              backgroundColor: '#F8FAFC',
              borderBottomLeftRadius: 4,
              borderWidth: 1,
              borderColor: '#E2E8F0',
            }
          ]}
        >
          <Text style={[
            { fontSize: 16, lineHeight: 22 },
            isUser ? { color: '#FFFFFF' } : { color: '#1E293B' }
          ]}>
            {item.text}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      <View style={{
        backgroundColor: '#F1F5F9',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        maxWidth: '60%',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E2E8F0',
      }}>
        <Text style={{ color: '#64748B', fontSize: 14, fontStyle: 'italic' }}>
          Assistant is typing...
        </Text>
      </View>
    </View>
  );

  const emergencyTypes = [
    { type: 'Medical Emergency', icon: '🚑', color: '#EF4444', description: 'Ambulance & Medical Care' },
    { type: 'Police Assistance', icon: '🚔', color: '#3B82F6', description: 'Law Enforcement Help' },
    { type: 'Fire Emergency', icon: '🚒', color: '#F59E0B', description: 'Fire Department Response' },
    { type: 'General Emergency', icon: '⚠️', color: '#8B5CF6', description: 'Other Emergency Services' },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Effects */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
          {/* Animated ripples */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: height * 0.35,
                left: width * 0.1,
                width: width * 0.8,
                height: width * 0.8,
                borderRadius: width * 0.4,
                borderWidth: 1,
                borderColor: 'rgba(59, 130, 246, 0.2)',
              },
              {
                transform: [
                  {
                    scale: rippleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.5],
                    }),
                  },
                ],
                opacity: rippleAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.1, 0],
                }),
              },
            ]}
          />
        </View>

        <Animated.ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header Section */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Shield size={32} color="#3B82F6" style={{ marginRight: 12 }} />
              <Text style={{
                fontSize: 28,
                fontWeight: '900',
                color: '#FFFFFF',
                letterSpacing: -0.5,
              }}>
                Ubuntu Safety
              </Text>
            </View>
            
            <Text style={{
              fontSize: 18,
              color: '#CBD5E1',
              textAlign: 'center',
              lineHeight: 26,
              fontWeight: '500',
            }}>
              Emergency assistance at your fingertips
            </Text>

            {/* Status indicators */}
            <View style={{
              flexDirection: 'row',
              marginTop: 20,
              gap: 16,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(34, 197, 94, 0.3)',
              }}>
                <View style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#22C55E',
                  borderRadius: 4,
                  marginRight: 6,
                }} />
                <Text style={{ color: '#22C55E', fontSize: 12, fontWeight: '600' }}>
                  Online
                </Text>
              </View>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(59, 130, 246, 0.3)',
              }}>
                <MapPin size={12} color="#3B82F6" style={{ marginRight: 4 }} />
                <Text style={{ color: '#3B82F6', fontSize: 12, fontWeight: '600' }}>
                  Located
                </Text>
              </View>
            </View>
          </View>

          {/* Emergency Button */}
          <Animated.View style={{
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
            marginBottom: 40,
          }}>
            <TouchableOpacity
              onPress={handleAlertPress}
              activeOpacity={0.8}
              style={{
                width: 240,
                height: 240,
                borderRadius: 120,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#EF4444',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.4,
                shadowRadius: 24,
                elevation: 15,
              }}
            >
              <LinearGradient
                colors={['#FEE2E2', '#FCA5A5', '#EF4444', '#DC2626']}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 120,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 6,
                  borderColor: '#FEE2E2',
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <AlertCircle size={72} color="#FFFFFF" />
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 24,
                  fontWeight: '900',
                  marginTop: 8,
                  letterSpacing: 1,
                  textShadowColor: 'rgba(0,0,0,0.3)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}>
                  EMERGENCY
                </Text>
                <Text style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 4,
                }}>
                  Tap for Help
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Instructions */}
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 20,
            padding: 20,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}>
            <Text style={{
              color: '#E2E8F0',
              fontSize: 16,
              textAlign: 'center',
              lineHeight: 24,
              fontWeight: '500',
            }}>
              Press the emergency button to instantly connect with local emergency services. 
              Your location will be shared automatically.
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            gap: 12,
          }}>
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(59, 130, 246, 0.3)',
            }}>
              <Phone size={24} color="#3B82F6" />
              <Text style={{ color: '#3B82F6', fontSize: 12, fontWeight: '600', marginTop: 4 }}>
                Call 911
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(139, 92, 246, 0.3)',
            }}>
              <MapPin size={24} color="#8B5CF6" />
              <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: '600', marginTop: 4 }}>
                Share Location
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{
              flex: 1,
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(34, 197, 94, 0.3)',
            }}>
              <Clock size={24} color="#22C55E" />
              <Text style={{ color: '#22C55E', fontSize: 12, fontWeight: '600', marginTop: 4 }}>
                History
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>

        {/* Enhanced Emergency Type Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              width: '100%',
              maxWidth: 380,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.3,
              shadowRadius: 30,
              elevation: 20,
            }}>
              <Text style={{
                fontSize: 24,
                fontWeight: '800',
                marginBottom: 8,
                textAlign: 'center',
                color: '#1E293B',
              }}>
                Emergency Type
              </Text>
              <Text style={{
                fontSize: 16,
                color: '#64748B',
                textAlign: 'center',
                marginBottom: 24,
                lineHeight: 22,
              }}>
                Select the type of emergency assistance you need
              </Text>

              {emergencyTypes.map((emergency) => (
                <Pressable
                  key={emergency.type}
                  onPress={() => handleSelectEmergency(emergency.type)}
                  style={({ pressed }) => [
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      borderRadius: 16,
                      marginBottom: 12,
                      borderWidth: 2,
                      borderColor: emergency.color + '30',
                      backgroundColor: pressed ? emergency.color + '20' : emergency.color + '10',
                    }
                  ]}
                >
                  <Text style={{ fontSize: 28, marginRight: 16 }}>
                    {emergency.icon}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#1E293B',
                      marginBottom: 2,
                    }}>
                      {emergency.type}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#64748B',
                    }}>
                      {emergency.description}
                    </Text>
                  </View>
                </Pressable>
              ))}

              <Pressable
                onPress={() => setModalVisible(false)}
                style={({ pressed }) => [
                  {
                    marginTop: 16,
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: pressed ? '#F1F5F9' : '#F8FAFC',
                    borderWidth: 2,
                    borderColor: '#E2E8F0',
                  }
                ]}
              >
                <Text style={{
                  textAlign: 'center',
                  color: '#64748B',
                  fontWeight: '600',
                  fontSize: 16,
                }}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Enhanced Floating Chat Button */}
        {chatVisible && (
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 30,
              right: 30,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <TouchableOpacity
              onPress={handleChatPress}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <LinearGradient
                colors={['#60A5FA', '#3B82F6', '#2563EB']}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MessageSquare size={28} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Enhanced Chatbot Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={chatBotVisible}
          onRequestClose={() => setChatBotVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{
                flex: 1,
                marginTop: 60,
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
                elevation: 20,
              }}
            >
              {/* Enhanced Header */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#E2E8F0',
                backgroundColor: '#F8FAFC',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#3B82F6',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}>
                    <MessageSquare size={20} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: '#1E293B',
                    }}>
                      Safety Assistant
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#64748B',
                    }}>
                      Always here to help
                    </Text>
                  </View>
                </View>
                
                <Pressable
                  onPress={() => setChatBotVisible(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#F1F5F9',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#64748B', fontSize: 18, fontWeight: '600' }}>✕</Text>
                </Pressable>
              </View>

              {/* Messages */}
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                inverted
                contentContainerStyle={{ paddingVertical: 16 }}
                style={{ flex: 1, backgroundColor: '#FFFFFF' }}
                keyboardDismissMode="on-drag"
                ListHeaderComponent={isTyping ? renderTypingIndicator : null}
              />

              {/* Enhanced Input */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                padding: 16,
                borderTopWidth: 1,
                borderTopColor: '#E2E8F0',
                backgroundColor: '#F8FAFC',
              }}>
                <View style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginRight: 12,
                  maxHeight: 120,
                }}>
                  <TextInput
                    style={{
                      fontSize: 16,
                      color: '#1E293B',
                      maxHeight: 100,
                    }}
                    placeholder="Type your message..."
                    placeholderTextColor="#94A3B8"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                    blurOnSubmit={false}
                  />
                </View>
                
                <TouchableOpacity
                  onPress={sendMessage}
                  disabled={!inputText.trim()}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: inputText.trim() ? '#3B82F6' : '#CBD5E1',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: inputText.trim() ? '#3B82F6' : 'transparent',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Send size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </LinearGradient>
    </>
  );
}