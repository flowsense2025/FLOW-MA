import { Text, View, ImageBackground, StyleSheet, Button } from "react-native";
import { useNavigation } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
    const navigation = useNavigation();
    navigation.setOptions({ headerShown: false });
  return (
    <SafeAreaProvider>
        <ImageBackground 
            source={require("../assets/images/V2.png")} 
            style={{flex:1}}></ImageBackground>

        <Button 
            title="Login">
        </Button>
        <Button
            title="Sign Up">
        </Button>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    loginButton: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
        height: 85,
    }
});