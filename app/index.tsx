import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Button } from "react-native";
import { useNavigation, Link } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { router } from 'expo-router'
import app from '../firebaseConfigex'
import { getAuth, signOut } from 'firebase/auth'; // Add these imports

const auth = getAuth(app);

export default function Index() {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const signIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password)
            if (user) router.replace('/(tabs)/home');
        } catch (error: any) {
            console.log(error)
            alert('Sign in failed: ' + error.message);
        }
    }

    const signUp = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password)
            if (user) router.replace('/(tabs)/home');
        } catch (error: any) {
            console.log(error)
            alert('Sign in failed: ' + error.message);
        }
    }
    return (
        // display login buttons
        <SafeAreaProvider style={{ flex: 1 }}>
            <ImageBackground
                source={require("../assets/images/LandingPage.png")}
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={signIn}>
                        <Text style={styles.text}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signUpButton} onPress={signUp}>
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
        marginBottom: 15, // Adds spacing between buttons
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
        color: '#FFFFFF', // Maintained white for clear visibility
        fontSize: 17, // Slightly larger for emphasis
    },
    textInput: {
        height: 50,
        width: 180,
        backgroundColor: '#FFFFFF',
        borderColor: '#E8EAF6',
        borderWidth: 2,
        borderRadius: 15,
        marginVertical: 10,
        paddingHorizontal: 25,
        fontSize: 16,
        color: '#3C4858',
        bottom: -470,
        left: 110
    },
});