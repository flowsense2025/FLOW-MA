import React from "react";
import { View, Text, ImageBackground, StyleSheet, Button } from "react-native";
import { useNavigation, Link, useRouter } from "expo-router";
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function settings() {
    // remove navigation header
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const router = useRouter();

    const handleIconPress = () => {
      console.log("Icon button pressed!");
      router.push('/home');
      // You can navigate somewhere too: navigation.navigate("someScreen")
    };

    return(
        <SafeAreaProvider>

            <ImageBackground 
                source={require("../../assets/images/homeBackground.png")} 
                style={styles.background}>
            </ImageBackground>

            <TouchableOpacity style={styles.backButton} onPress={handleIconPress}>
              <Ionicons name="arrow-back-outline" size={24} color="orange" />
            </TouchableOpacity>


        </SafeAreaProvider>

    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        position: "absolute", 
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
    },
    backButton: {
      position: "absolute",
      top: 60, // Adjust position as needed
      left: 20,
      padding: 10,
      backgroundColor: "transparent",
      borderRadius: 50,
      elevation: 5, // Android shadow
      shadowOpacity: 0,
    },

    
  });

  // In app/home.tsx
export const unstable_settings = {
  // This tells expo-router not to include this screen in the tab bar automatically.
  // (The exact API might change in future versions, so check the docs if it doesn't work as expected.)
  initialRoute: true,
  // You can also try:
  // layout: { tabBar: { visible: false } }
};
