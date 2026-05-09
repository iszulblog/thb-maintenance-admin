import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import skrin-skrin aplikasi
import HomeScreen from './screens/HomeScreen'; // Skrin utama 5-row baru
import LoginScreen from './screens/LoginScreen';
import SubmitReportScreen from './screens/SubmitReportScreen'; // Skrin "Hantar Laporan"
import TaskListScreen from './screens/TaskListScreen'; // Skrin "Tugasan Saya"

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Skrin pertama yang akan dilihat oleh pengguna */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="TaskList" 
          component={TaskListScreen} 
          options={{ title: 'Tugasan Saya' }} 
        />

        <Stack.Screen 
          name="SubmitReport" 
          component={SubmitReportScreen} 
          options={{ title: 'Hantar Laporan' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}