import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useNavigation } from 'expo-router';

// Import your actual BLE hook from the hooks folder
import { useBLE } from '../../hooks/useBLE';

// Water Level Display Component
const WaterLevelDisplay = ({ waterLevel, isConnected, lastUpdate }) => {
  const getWaterLevelColor = (level) => {
    if (!level && level !== 0) return '#9CA3AF';
    if (level < 20) return '#EF4444';
    if (level < 40) return '#F97316';
    if (level < 70) return '#EAB308';
    return '#22C55E';
  };

  const getBackgroundColor = (level) => {
    if (!level && level !== 0) return '#F9FAFB';
    if (level < 20) return '#FEF2F2';
    if (level < 40) return '#FFF7ED';
    if (level < 70) return '#FEFCE8';
    return '#F0FDF4';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <View style={[
      styles.displayContainer,
      { backgroundColor: getBackgroundColor(waterLevel) }
    ]}>
      {/* Header */}
      <View style={styles.displayHeader}>
        <Text style={styles.displayTitle}>Water Level</Text>
        <View style={styles.connectionStatus}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? '#22C55E' : '#9CA3AF' }
            ]}
          />
          <Text style={[
            styles.statusText,
            { color: isConnected ? '#22C55E' : '#9CA3AF' }
          ]}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>

      {/* Water Level Value */}
      <View style={styles.valueContainer}>
        <Text style={styles.waterIcon}>💧</Text>
        {waterLevel !== null && waterLevel !== undefined ? (
          <>
            <Text style={[
              styles.waterValue,
              { color: getWaterLevelColor(waterLevel) }
            ]}>
              {waterLevel.toFixed(1)}
              <Text style={styles.unit}>L</Text>
            </Text>
            {lastUpdate && (
              <Text style={styles.lastUpdate}>
                Updated: {formatTime(lastUpdate)}
              </Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.noDataValue}>--</Text>
            <Text style={styles.noDataText}>No Data</Text>
          </>
        )}
      </View>

      {/* Progress Bar */}
      {waterLevel !== null && waterLevel !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(waterLevel, 100)}%`,
                  backgroundColor: getWaterLevelColor(waterLevel)
                }
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>0L</Text>
            <Text style={styles.progressLabel}>100L</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Main Sensor Tab Component
export default function SensorTab() {
  const navigation = useNavigation();

  // Using your actual BLE hook
  const {
    devices,
    isScanning,
    connectedDevice,
    sensorData,
    isReadingSensor,
    bluetoothState,
    startScan,
    stopScan,
    connectToDevice,
    disconnect,
    startSensorReading,
    stopSensorReading,
    isConnected
  } = useBLE();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Water Sensor'
    });
  }, [navigation]);

  const renderDevice = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
        <Text style={styles.deviceDetails}>Signal: {item.rssi} dBm</Text>
        <Text style={styles.deviceId}>ID: {item.id.substring(0, 8)}...</Text>
      </View>
      <Text style={styles.connectText}>Tap to Connect</Text>
    </TouchableOpacity>
  );

  // Check if Bluetooth is ready
  const isBluetoothReady = bluetoothState === 'PoweredOn';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Bluetooth Status */}
        {!isBluetoothReady && (
          <View style={styles.bluetoothWarning}>
            <Text style={styles.warningText}>
              📱 Bluetooth Status: {bluetoothState}
            </Text>
            {bluetoothState !== 'PoweredOn' && (
              <Text style={styles.warningSubtext}>
                Please turn on Bluetooth to use the water sensor
              </Text>
            )}
          </View>
        )}

        {/* Water Level Display */}
        <WaterLevelDisplay
          waterLevel={sensorData?.waterLevel}
          isConnected={isConnected}
          lastUpdate={sensorData?.timestamp}
        />

        {/* Connection Controls */}
        <View style={styles.controlsContainer}>
          {!isConnected ? (
            <>
              {/* Scan Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.scanButton,
                  (!isBluetoothReady || isScanning) && styles.buttonDisabled
                ]}
                onPress={isScanning ? stopScan : startScan}
                disabled={!isBluetoothReady}
              >
                <Text style={styles.buttonText}>
                  {isScanning ? 'Stop Scanning' : 'Scan for Devices'}
                </Text>
              </TouchableOpacity>

              {/* Device List */}
              {devices.length > 0 && (
                <View style={styles.deviceListContainer}>
                  <Text style={styles.sectionTitle}>
                    Found {devices.length} device(s):
                  </Text>
                  <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    renderItem={renderDevice}
                    scrollEnabled={false}
                  />
                </View>
              )}

              {isScanning && (
                <View style={styles.scanningContainer}>
                  <Text style={styles.scanningText}>
                    🔍 Scanning for water sensors...
                  </Text>
                  <Text style={styles.scanningSubtext}>
                    Make sure your sensor is powered on and nearby
                  </Text>
                </View>
              )}

              {!isScanning && devices.length === 0 && (
                <Text style={styles.noDevicesText}>
                  No devices found. Try scanning again.
                </Text>
              )}
            </>
          ) : (
            /* Connected Controls */
            <View style={styles.connectedControls}>
              <Text style={styles.connectedText}>
                📱 Connected to: {connectedDevice?.name}
              </Text>

              <TouchableOpacity
                style={[
                  styles.button,
                  isReadingSensor ? styles.stopButton : styles.startButton
                ]}
                onPress={isReadingSensor ? stopSensorReading : startSensorReading}
              >
                <Text style={styles.buttonText}>
                  {isReadingSensor ? '⏹️ Stop Reading' : '▶️ Start Reading'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.disconnectButton]}
                onPress={disconnect}
              >
                <Text style={styles.buttonText}>🔌 Disconnect</Text>
              </TouchableOpacity>

              {isReadingSensor && (
                <View style={styles.readingContainer}>
                  <Text style={styles.readingText}>
                    📡 Receiving live sensor data...
                  </Text>
                  <Text style={styles.readingSubtext}>
                    Water level updates every few seconds
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>💡 How to use:</Text>
          <Text style={styles.instructionText}>
            1. Make sure Bluetooth is enabled on your device{'\n'}
            2. Power on your water sensor and keep it nearby{'\n'}
            3. Tap "Scan for Devices" to find your sensor{'\n'}
            4. Tap on your device name to connect{'\n'}
            5. Press "Start Reading" to monitor water levels{'\n'}
            6. View real-time water level data above
          </Text>
        </View>

        {/* Debug Info (remove in production) */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>🐛 Debug Info:</Text>
            <Text style={styles.debugText}>
              Bluetooth State: {bluetoothState}{'\n'}
              Connected: {isConnected ? 'Yes' : 'No'}{'\n'}
              Reading Sensor: {isReadingSensor ? 'Yes' : 'No'}{'\n'}
              Devices Found: {devices.length}{'\n'}
              Last Data: {sensorData ? JSON.stringify(sensorData) : 'None'}
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
  },

  // Bluetooth Warning Styles
  bluetoothWarning: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  warningSubtext: {
    fontSize: 14,
    color: '#92400E',
    marginTop: 4,
  },

  // Water Display Styles
  displayContainer: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  displayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  displayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  waterIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  waterValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  unit: {
    fontSize: 24,
    marginLeft: 4,
  },
  noDataValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#64748B',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  // Controls Styles
  controlsContainer: {
    marginBottom: 24,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  scanButton: {
    backgroundColor: '#3B82F6',
  },
  startButton: {
    backgroundColor: '#10B981',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  disconnectButton: {
    backgroundColor: '#6B7280',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Scanning Styles
  scanningContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  scanningText: {
    textAlign: 'center',
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
  },
  scanningSubtext: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    marginTop: 4,
  },
  noDevicesText: {
    textAlign: 'center',
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 16,
  },

  // Device List Styles
  deviceListContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  deviceItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  deviceDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  deviceId: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  connectText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },

  // Connected State Styles
  connectedControls: {
    alignItems: 'center',
  },
  connectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 16,
    textAlign: 'center',
  },
  readingContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  readingText: {
    fontSize: 14,
    color: '#10B981',
    textAlign: 'center',
    fontWeight: '500',
  },
  readingSubtext: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },

  // Instructions Styles
  instructionsContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },

  // Debug Styles (development only)
  debugContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
});