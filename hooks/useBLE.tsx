import React from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useESP32BLE } from "../../hooks/useESP32BLE"; // Import ESP32 hook

export default function home() {
    // Remove navigation header
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const router = useRouter();

    // ESP32 BLE functionality
    const {
        scanForESP32,
        connectToESP32,
        disconnectFromESP32,
        sendDataToESP32,
        allDevices,
        connectedDevice,
        receivedData,
        isScanning,
        deviceInfo,
    } = useESP32BLE();

    const handleSettingsPress = () => {
        console.log("Settings button pressed!");
        router.push('/settings');
    };

    const handleExportPress = () => {
        console.log("Export button pressed!");
        // Add your export logic here
    };

    const handleESP32Press = () => {
        if (connectedDevice) {
            disconnectFromESP32();
        } else {
            scanForESP32();
        }
    };

    const handleDeviceSelect = (device: any) => {
        connectToESP32(device);
    };

    const sendTestCommand = () => {
        // Send a test command to your ESP32
        sendDataToESP32("LED_ON");
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

            {/* ESP32 Connection Button */}
            <TouchableOpacity style={styles.esp32Button} onPress={handleESP32Press}>
                <Ionicons
                    name={connectedDevice ? "hardware-chip" : "hardware-chip-outline"}
                    size={24}
                    color={connectedDevice ? "#4CAF50" : "orange"}
                />
            </TouchableOpacity>

            {/* ESP32 Status */}
            <View style={styles.statusContainer}>
                {connectedDevice ? (
                    <View style={styles.connectedStatus}>
                        <View style={styles.statusIndicator} />
                        <Text style={styles.statusText}>
                            ESP32 Connected: {deviceInfo?.name || 'Unknown'}
                        </Text>
                    </View>
                ) : isScanning ? (
                    <View style={styles.scanningStatus}>
                        <Text style={styles.statusText}>Scanning for ESP32...</Text>
                    </View>
                ) : null}
            </View>

            {/* ESP32 Data Display */}
            {receivedData && (
                <View style={styles.dataContainer}>
                    <Text style={styles.dataLabel}>ESP32 Data</Text>
                    <Text style={styles.dataValue}>{receivedData}</Text>
                    {connectedDevice && (
                        <TouchableOpacity style={styles.testButton} onPress={sendTestCommand}>
                            <Text style={styles.testButtonText}>Send Test Command</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* ESP32 Device List */}
            {isScanning && allDevices.length > 0 && (
                <View style={styles.deviceList}>
                    <Text style={styles.deviceListTitle}>Found ESP32 Devices:</Text>
                    {allDevices.slice(0, 4).map((device) => (
                        <TouchableOpacity
                            key={device.id}
                            style={styles.deviceItem}
                            onPress={() => handleDeviceSelect(device)}
                        >
                            <Text style={styles.deviceName}>
                                {device.name || device.localName || 'ESP32 Device'}
                            </Text>
                            <Text style={styles.deviceId}>
                                {device.id.substring(0, 8)}...
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Connection Instructions */}
            {!connectedDevice && !isScanning && allDevices.length === 0 && (
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>Connect to ESP32-C3</Text>
                    <Text style={styles.instructionsText}>
                        1. Make sure your ESP32 is running BLE code{'\n'}
                        2. Tap the chip icon to scan{'\n'}
                        3. Select your ESP32 from the list
                    </Text>
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
    esp32Button: {
        position: "absolute",
        top: 60,
        right: 100,
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
        fontSize: 16,
        fontFamily: "monospace",
        marginBottom: 8,
    },
    testButton: {
        backgroundColor: "orange",
        padding: 8,
        borderRadius: 6,
        alignItems: "center",
    },
    testButtonText: {
        color: "black",
        fontSize: 12,
        fontWeight: "bold",
    },
    deviceList: {
        position: "absolute",
        bottom: 200,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: 16,
        borderRadius: 12,
        maxHeight: 250,
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
        fontWeight: "bold",
    },
    deviceId: {
        color: "#ccc",
        fontSize: 12,
    },
    instructionsContainer: {
        position: "absolute",
        bottom: 150,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 20,
        borderRadius: 12,
    },
    instructionsTitle: {
        color: "orange",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    instructionsText: {
        color: "white",
        fontSize: 14,
        lineHeight: 20,
    },
});

export const unstable_settings = {
    initialRoute: true,
};