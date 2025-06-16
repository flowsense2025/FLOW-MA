import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth'
import { router } from 'expo-router'
import { auth } from '../firebaseConfig'

export default function LoginScreen() {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        
        if (!password || password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful:', userCredential.user.email);
            router.replace('/(tabs)/home');
        } catch (error: any) {
            console.log('Login error:', error.code);
            
            switch (error.code) {
                case 'auth/user-not-found':
                    Alert.alert('Error', 'No account found with this email');
                    break;
                case 'auth/wrong-password':
                    Alert.alert('Error', 'Incorrect password');
                    break;
                case 'auth/invalid-email':
                    Alert.alert('Error', 'Invalid email format');
                    break;
                case 'auth/too-many-requests':
                    Alert.alert('Error', 'Too many failed attempts. Please try again later');
                    break;
                default:
                    Alert.alert('Error', 'Login failed: ' + error.message);
            }
        }
    }

    const goBack = () => {
        router.back();
    }

    const goToSignUp = () => {
        router.push('/signup');
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Welcome Back!</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={goToSignUp} style={styles.linkButton}>
                    <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: '#fff',
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    form: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#DE6E56',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 16,
    },
});