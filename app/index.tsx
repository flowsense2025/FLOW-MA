import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { router } from 'expo-router';

export default function Index() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    // Bypass authentication for BLE testing
    const skipToHome = () => {
        router.replace('/(tabs)/home');
    };

    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <ImageBackground
                source={require("../assets/images/LandingPage.png")}
                style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>FLOW-OW</Text>
                    <Text style={styles.subtitle}>BLE Test Mode</Text>

                    <TouchableOpacity style={styles.testButton} onPress={skipToHome}>
                        <Text style={styles.text}>Go to BLE Scanner</Text>
                    </TouchableOpacity>

                    <Text style={styles.note}>
                        (Firebase authentication temporarily disabled for BLE testing)
                    </Text>
                </View>
            </ImageBackground>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    testButton: {
        backgroundColor: "#DE6E56",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        alignItems: "center",
        marginBottom: 20,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '600',
    },
    note: {
        color: '#FFFFFF',
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
});