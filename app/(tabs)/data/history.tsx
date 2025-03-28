import { View, Text, ImageBackground, StyleSheet} from 'react-native'
import { useNavigation } from 'expo-router';
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react'
export default function history() {
   const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    return (
        <SafeAreaProvider>
        
            <ImageBackground 
                source={require("../../../assets/images/homeBackground.png")} 
                style={styles.background}>
            </ImageBackground>

        </SafeAreaProvider>
    )
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
