import { Tabs } from 'expo-router'
export default () => {
    return (
        <Tabs>
            <Tabs.Screen name="Home" />
            <Tabs.Screen name="Stats" />
            <Tabs.Screen name="Facts" />
        </Tabs>
    )
}