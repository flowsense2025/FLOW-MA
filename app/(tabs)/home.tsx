import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function home() {
    // remove navigation header
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    return(
        <SafeAreaProvider>

            <ImageBackground 
                source={require("../../assets/images/homeBackground.png")} 
                style={styles.background}>
            </ImageBackground>

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
  });

  // In app/home.tsx
export const unstable_settings = {
  // This tells expo-router not to include this screen in the tab bar automatically.
  // (The exact API might change in future versions, so check the docs if it doesn't work as expected.)
  initialRoute: true,
  // You can also try:
  // layout: { tabBar: { visible: false } }
};
