import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"; // Import icons
import Feather from '@expo/vector-icons/Feather'; // Import other icon

export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen 
                name="stats" 
                options={{ 
                    tabBarLabel:"Stats" ,
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