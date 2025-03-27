import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function home() {
    // remove navigation header
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    return(
        <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen! TEST</Text>
    </View>
    );
}
const styles = StyleSheet.create({
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
