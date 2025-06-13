import React from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useBLE } from "../../hooks/useBLE";

export default function home() {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    const router = useRouter();

    // BLE functionality with error handling
    const {
        startScan,
        connectToDevice,
        disconnect,
        devices,
        connectedDevice,
        isScanning,
        bluetoothState,
    } = useBLE();

    const handleSettingsPress = () => {
        console.log("Settings button pressed!");
        router.push('/settings');
    };

    const handleExportPress = () => {
        console.log("Export button pressed!");
        Alert.alert("Export", "Export functionality coming soon!");
    };

    const handleBTPress = async () => {
        console.log("BT button pressed!");

        if (connectedDevice) {
            // Disconnect if already connected
            try {
                await disconnect();
            } catch (error) {
                Alert.alert("Disconnect Error", "Failed to disconnect");
            }
        } else {
            // Start scanning
            if (bluetoothState !== 'PoweredOn') {
                Alert.alert(
                    "Bluetooth Required",
                    "Please turn on Bluetooth and enable Location Services to scan for devices.",
                    [
                        { text: "OK" }
                    ]
                );
                return;
            }

            try {
                await startScan();
            } catch (error) {
                Alert.alert("Scan Error", "Failed to start scanning for devices");
            }
        }
    };

    const handleDeviceSelect = async (device: any) => {
        try {
            await connectToDevice(device);
        } catch (error) {
            Alert.alert("Connection Error", `Failed to connect to ${device.name}`);
        }
    };

    const getBTIconColor = () => {
        if (connectedDevice) return "#4CAF50"; // Green when connected
        if (isScanning) return "#FF9800"; // Orange when scanning
        if (bluetoothState === 'PoweredOn') return "#2196F3"; // Blue when ready
        return "#757575"; // Gray when off
    };

    const getBTIconName = () => {
        if (connectedDevice) return "bluetooth";
        if (isScanning) return "bluetooth-outline";
        return "bluetooth-outline";
    };

    return(
        <SafeAreaProvider>
            <ImageBackground
                source={require("../../assets/images/homeBackground.png")}
                style={styles.background}>
            </ImageBackground>

            {/* Top Buttons */}
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
                <Ionicons name="settings-outline" size={24} color="orange" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.exportButton} onPress={handleExportPress}>
                <Ionicons name="cloud-upload-outline" size={24} color="orange" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.btButton} onPress={handleBTPress}>
                <Ionicons
                    name={getBTIconName()}
                    size={24}
                    color={getBTIconColor()}
                />
            </TouchableOpacity>

            {/* Bluetooth Status */}
            <View style={styles.statusContainer}>
                {bluetoothState !== 'PoweredOn' && (
                    <View style={styles.bluetoothOffStatus}>
                        <Text style={styles.statusText}>
                            Bluetooth: {bluetoothState}
                        </Text>
                        <Text style={styles.statusSubText}>
                            Turn on Bluetooth to scan for devices
                        </Text>
                    </View>
                )}

                {connectedDevice && (
                    <View style={styles.connectedStatus}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>
                            Connected: {connectedDevice.name || 'Unknown Device'}
                        </Text>
                    </View>
                )}

                {isScanning && (
                    <View style={styles.scanningStatus}>
                        <Text style={styles.statusText}>
                            🔍 Scanning for BLE devices...
                        </Text>
                        <Text style={styles.statusSubText}>
                            Found {devices.length} device{devices.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                )}
            </View>

            {/* Device List */}
            {devices.length > 0 && (
                <View style={styles.deviceList}>
                    <Text style={styles.deviceListTitle}>
                        Available Devices ({devices.length}):
                    </Text>
                    {devices.slice(0, 5).map((device, index) => (
                        <TouchableOpacity
                            key={device.id}
                            style={styles.deviceItem}
                            onPress={() => handleDeviceSelect(device)}
                        >
                            <View style={styles.deviceInfo}>
                                <Text style={styles.deviceName}>
                                    {device.name || 'Unknown Device'}
                                </Text>
                                <Text style={styles.deviceDetails}>
                                    RSSI: {device.rssi} dBm
                                </Text>
                            </View>
                            <View style={styles.connectButton}>
                                <Text style={styles.connectButtonText}>Connect</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Instructions */}
            {!isScanning && !connectedDevice && devices.length === 0 && bluetoothState === 'PoweredOn' && (
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsTitle}>Ready to Scan!</Text>
                    <Text style={styles.instructionsText}>
                        Tap the Bluetooth button to scan for nearby devices
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
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    exportButton: {
        position: "absolute",
        top: 60,
        right: 70,
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    btButton: {
        position: "absolute",
        top: 60,
        right: 120,
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    statusContainer: {
        position: "absolute",
        top: 120,
        left: 20,
        right: 20,
    },
    bluetoothOffStatus: {
        backgroundColor: "rgba(244, 67, 54, 0.9)",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 8,
    },
    connectedStatus: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(76, 175, 80, 0.9)",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
    },
    scanningStatus: {
        backgroundColor: "rgba(255, 152, 0, 0.9)",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "white",
        marginRight: 8,
    },
    statusText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
    },
    statusSubText: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 12,
        marginTop: 4,
    },
    deviceList: {
        position: "absolute",
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        padding: 16,
        borderRadius: 12,
        maxHeight: 300,
    },
    deviceListTitle: {
        color: "#4CAF50",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 12,
    },
    deviceItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
    deviceDetails: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 12,
        marginTop: 2,
    },
    connectButton: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    connectButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    instructionsContainer: {
        position: "absolute",
        bottom: 150,
        left: 20,
        right: 20,
        backgroundColor: "rgba(33, 150, 243, 0.9)",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    instructionsTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    instructionsText: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 14,
        textAlign: "center",
    },
});

export const unstable_settings = {
    initialRoute: true,
};