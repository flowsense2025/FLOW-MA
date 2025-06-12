import React from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useBLE } from "../../hooks/useBLE";

export default function home() {
    // Remove navigation header
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const router = useRouter();

    // Add BLE functionality
    const {
        scanForPeripherals,
        connectToDevice,
        disconnectFromDevice,
        allDevices,
        connectedDevice,
        receivedData,
        isScanning,
    } = useBLE();

    const handleSettingsPress = () => {
        console.log("Settings button pressed!");
        router.push('/settings');
    };

    const handleExportPress = () => {
        console.log("Export button pressed!");
        // Add your export logic here
    };

    const handleDevicePress = () => {
        if (connectedDevice) {
            disconnectFromDevice();
        } else {
            scanForPeripherals();
        }
    };

    const handleDeviceSelect = (device: any) => {
        connectToDevice(device);
    };

    return(
        <SafeAreaProvider>
            <ImageBackground
                source={require("../../assets/images/homeBackground.png")}
                style={styles.background}>
            </ImageBackground>

            {/* Existing buttons */}
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
                <Ionicons name="settings-outline" size={24} color="orange" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.exportButton} onPress={handleExportPress}>
                <Ionicons name="cloud-upload-outline" size={24} color="orange" />
            </TouchableOpacity>

            {/* New BLE Device Button */}
            <TouchableOpacity style={styles.deviceButton} onPress={handleDevicePress}>
                <Ionicons
                    name={connectedDevice ? "bluetooth" : "bluetooth-outline"}
                    size={24}
                    color={connectedDevice ? "#4CAF50" : "orange"}
                />
            </TouchableOpacity>

            {/* Device Status Overlay */}
            <View style={styles.statusContainer}>
                {connectedDevice ? (
                    <View style={styles.connectedStatus}>
                        <View style={styles.statusIndicator} />
                        <Text style={styles.statusText}>
                            {connectedDevice.name || 'Device Connected'}
                        </Text>
                    </View>
                ) : isScanning ? (
                    <View style={styles.scanningStatus}>
                        <Text style={styles.statusText}>Scanning...</Text>
                    </View>
                ) : null}
            </View>

            {/* Live Data Display */}
            {receivedData && (
                <View style={styles.dataContainer}>
                    <Text style={styles.dataLabel}>Live Data</Text>
                    <Text style={styles.dataValue}>{receivedData}</Text>
                </View>
            )}

            {/* Device List (when scanning) */}
            {isScanning && allDevices.length > 0 && (
                <View style={styles.deviceList}>
                    <Text style={styles.deviceListTitle}>Available Devices:</Text>
                    {allDevices.slice(0, 3).map((device) => (
                        <TouchableOpacity
                            key={device.id}
                            style={styles.deviceItem}
                            onPress={() => handleDeviceSelect(device)}
                        >
                            <Text style={styles.deviceName}>
                                {device.name || device.localName || 'Unknown Device'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
    },
    settingsButton: {
        position: "absolute",
        top: 60,
        right: 20,
        padding: 10,
        backgroundColor: "transparent",
        borderRadius: 50,
        elevation: 5,
        shadowOpacity: 0,
    },
    exportButton: {
        position: "absolute",
        top: 60,
        right: 60,
        padding: 10,
        backgroundColor: "transparent",
        borderRadius: 50,
        elevation: 5,
        shadowOpacity: 0,
    },
    // New BLE-related styles
    deviceButton: {
        position: "absolute",
        top: 60,
        right: 100, // Position it next to your other buttons
        padding: 10,
        backgroundColor: "transparent",
        borderRadius: 50,
        elevation: 5,
        shadowOpacity: 0,
    },
    statusContainer: {
        position: "absolute",
        top: 120,
        left: 20,
        right: 20,
    },
    connectedStatus: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(76, 175, 80, 0.9)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: "flex-start",
    },
    scanningStatus: {
        backgroundColor: "rgba(255, 152, 0, 0.9)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: "flex-start",
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "white",
        marginRight: 8,
    },
    statusText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
    dataContainer: {
        position: "absolute",
        bottom: 120,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 16,
        borderRadius: 12,
    },
    dataLabel: {
        color: "orange",
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
    },
    dataValue: {
        color: "white",
        fontSize: 18,
        fontFamily: "monospace",
    },
    deviceList: {
        position: "absolute",
        bottom: 200,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: 16,
        borderRadius: 12,
        maxHeight: 200,
    },
    deviceListTitle: {
        color: "orange",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
    },
    deviceItem: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: 12,
        borderRadius: 8,
        marginBottom: 4,
    },
    deviceName: {
        color: "white",
        fontSize: 14,
    },
});

// In app/home.tsx
export const unstable_settings = {
    initialRoute: true,
};