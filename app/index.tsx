import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Button } from "react-native";
import { useNavigation, Link } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { router } from 'expo-router'

export default function Index() {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const handleLogin = () => {
        router.push('/login');
    }

    const handleSignUp = () => {
        router.push('/signup');
    }

    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <ImageBackground
                source={require("../assets/images/LandingPage.png")}
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.text}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                        <Text style={styles.text}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    loginButton: {
        backgroundColor: "#DE6E56",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        width: 160,
        alignItems: "center",
        marginBottom: 15,
        position: "absolute",
        left: 115,
        bottom: 150,
    },
    signUpButton: {
        left: 115,
        bottom: 100,
        backgroundColor: "#093593",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 15,
        width: 160,
        alignItems: "center",
        position: "absolute",
    },
    text: {
        color: '#FFFFFF',
        fontSize: 17,
    },
});