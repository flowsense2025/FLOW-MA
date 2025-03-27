import { View, Text} from 'react-native'

import { useNavigation } from 'expo-router';
import { useEffect } from 'react'
const stats = () =>  {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);
    return (
        <View>
        <Text>stats</Text>
        </View>
    )
}

export default stats