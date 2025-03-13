import { Text, View, ImageBackground, StyleSheet, TouchableOpacity, Button  } from "react-native";
import { useNavigation } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
export default function Index() {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
  return (
    <SafeAreaProvider>
        <ImageBackground 
            source={require("../assets/images/loginBackground.png")} 
            style={{flex:1}}></ImageBackground>

        <View style={styles.loginButton}>
            <Button  title="Login" color="white" onPress={() => {}} />
        </View>
        <View style={styles.signUpButton}>
            <Button  title="Sign Up" color="white" onPress={() => {}} />
        </View>
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
     
      loginButton: {
        backgroundColor: "#DE6E56",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        width: 160, 
        alignItems: "center",
        marginBottom: 15, // Adds spacing between buttons
        position: "absolute",
        left: 112,
        bottom: 200,
      },
      signUpButton: {
        left: 112,
        bottom: 130,
        backgroundColor: "#093593",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        width: 160,
        alignItems: "center",
        position: "absolute",
      },
      buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
      },
});