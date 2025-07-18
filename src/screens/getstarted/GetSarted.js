import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import SplashIcon from "../../../assets/2345470.png"

export default function GetStarted({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Section - Blue with an image */}
      <View style={styles.topSection}>
        <Image 
          source={SplashIcon}  
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to SafetyApp</Text>
        <Text style={styles.subtitle}>
          Your security companion for peace of mind. Let’s get started!
        </Text>
      </View>

      {/* Bottom Section - White with shadow and rounded corners */}
      <View style={styles.bottomSection}>
        <Pressable style={styles.button} onPress={() => navigation.replace('login')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E40AF', 
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40, 
  },
  image: {
    width: 80,  
    height: 80,  
    marginBottom: 20, 
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,  
  },
  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 40,  
  },
  button: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',  
    alignItems: 'center',  
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
});
