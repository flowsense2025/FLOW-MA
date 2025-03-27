import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"; // Import icons
import Feather from '@expo/vector-icons/Feather'; // Import other icon
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                // Styles for the entire tab bar container
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopColor: "transparent", // Removes top border
                    elevation: 0, // Removes shadow on Android
                    shadowOpacity: 0, // Removes shadow on iOS
                    position: "absolute",
                    bottom: 50, // Moves tab bar up from bottom of screen
                    marginHorizontal: 36,

                    //paddingBottom: 0,
                    paddingTop: 0,
                    borderRadius: 50, // Curves the corners of the tab bar
                    width: 315,
                    height: 56,
                    
                },
                // Optionally style the label text
                    tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "bold",
                },
            }}
            >
            <Tabs.Screen 
                name="stats" 
                options={{ 
                    tabBarLabel:"Data" ,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="stats-chart" size={20} color={"orange"} />
                    ),
                }} 
            />
            <Tabs.Screen 
                name="home" 
                options={{ 
                    tabBarLabel:"Home",
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={20} color={"orange"} />
                    ),
                }}
            />
            <Tabs.Screen name="facts" 
                options={{ 
                    tabBarLabel:"Facts", 
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="water-sharp" size={20} color={"orange"} />
                    ),
                }}
            />
        </Tabs>
    )
}