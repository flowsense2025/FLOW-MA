import { View, Text} from 'react-native'
import { useNavigation } from 'expo-router';
import { useEffect } from 'react'
import React from 'react'
export default function history() {
   const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    return (
        <View>
        <Text>history</Text>
        </View>
    )
}
