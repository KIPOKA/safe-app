
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../auth/Login';
import GetStarted from '../screens/getstarted/GetSarted';
import Register from '../auth/Register';

const Stack = createNativeStackNavigator();

export default function NavigationController() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="GetStarted"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
