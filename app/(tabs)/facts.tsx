import { View, Text} from 'react-native'
import { useNavigation } from 'expo-router';
import { useEffect } from 'react'
import React from 'react'
const facts = () =>  {
   const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    return (
        <View>
        <Text>facts</Text>
        </View>
    )
}

export default facts