import { Text, View, ImageBackground } from "react-native";
import { useNavigation } from "expo-router";

export default function Index() {
    const navigation = useNavigation();
    navigation.setOptions({ headerShown: false });
  return (
    <ImageBackground 
        source={require("../assets/images/loginBackground.png")} 
        style={{flex:1}}></ImageBackground>
    
  );
}
