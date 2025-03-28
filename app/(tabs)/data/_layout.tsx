import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"; // Import icons
import Feather from '@expo/vector-icons/Feather'; // Import other icon
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                tabBarIcon: () => null,

                // Styles for the entire tab bar container
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopColor: "transparent", // Removes top border
                    elevation: 0, // Removes shadow on Android
                    shadowOpacity: 0, // Removes shadow on iOS
                    position: "absolute",
                    top: 131, // Moves tab bar up from bottom of screen
                    marginHorizontal: 36,

                    borderRadius: 10, // Curves the corners of the tab bar
                    width: 315,
                    height: 32,
                    
                },

                // Optionally style the label text
                tabBarLabelStyle: {
                    position: "absolute",
                    paddingTop: 11,
                    fontSize: 10,
                    fontWeight: "bold",
                },
            }}
            >
            <Tabs.Screen 
                name="current" 
                options={{ 
                    tabBarLabel:"CURRENT DATA" ,
                }} 
            />
            <Tabs.Screen 
                name="history" 
                options={{ 
                    tabBarLabel:"HISTORY",
                }}
            />
            <Tabs.Screen 
                name="index" 
                options={{ 
                    href: null, // This hides the 'index' tab for the tab bar
                }}
            />
        </Tabs>
    )
}