import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

// Conditional import to avoid bundling issues
let BleManager = null;
if (Platform.OS !== 'web') {
  try {
    const BLE = require('react-native-ble-plx');
    BleManager = BLE.BleManager;
  } catch (error) {
    console.log('BLE not available:', error);
  }
}

interface BLEDevice {
  id: string;
  name: string | null;
  rssi: number;
}

interface SensorData {
  waterLevel: number;
  timestamp: number;
}

interface BLEHook {
  devices: BLEDevice[];
  isScanning: boolean;
  connectedDevice: BLEDevice | null;
  bluetoothState: string;
  sensorData: SensorData | null;
  startScan: () => Promise<void>;
  stopScan: () => void;
  connectToDevice: (device: BLEDevice) => Promise<void>;
  disconnect: () => Promise<void>;
  startSensorReading: () => Promise<void>;
  stopSensorReading: () => void;
  isConnected: boolean;
  isReadingSensor: boolean;
}

export const useBLE = (): BLEHook => {
  const [devices, setDevices] = useState<BLEDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BLEDevice | null>(null);
  const [bluetoothState, setBluetoothState] = useState('Unknown');
  const [manager, setManager] = useState<any>(null);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isReadingSensor, setIsReadingSensor] = useState(false);
  const [sensorSubscription, setSensorSubscription] = useState<any>(null);

  // TODO: Replace these with your actual UUIDs from your microcontroller
  const SERVICE_UUID = "your-service-uuid-here";
  const WATER_LEVEL_CHARACTERISTIC_UUID = "your-characteristic-uuid-here";

  useEffect(() => {
    if (BleManager && Platform.OS !== 'web') {
      const bleManager = new BleManager();
      setManager(bleManager);

      const subscription = bleManager.onStateChange((state: string) => {
        setBluetoothState(state);
        if (state === 'PoweredOff') {
          setDevices([]);
          setConnectedDevice(null);
          setSensorData(null);
          setIsReadingSensor(false);
        }
      }, true);

      return () => {
        subscription.remove();
        if (sensorSubscription) {
          sensorSubscription.remove();
        }
        bleManager.destroy();
      };
    }
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      const permissions = [];

      if (PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
        permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }

      try {
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
        }
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
        }
      } catch (e) {
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH);
        }
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN);
        }
      }

      if (permissions.length === 0) {
        console.log('No permissions to request');
        return true;
      }

      console.log('Requesting permissions:', permissions);
      const granted = await PermissionsAndroid.requestMultiple(permissions);

      const allGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );

      console.log('Permission results:', granted);
      return allGranted;
    } catch (error) {
      console.error('Permission request error:', error);
      return true;
    }
  };

  const startScan = async (): Promise<void> => {
    if (!manager) {
      Alert.alert('BLE Not Available', 'Bluetooth Low Energy is not available');
      return;
    }

    if (bluetoothState !== 'PoweredOn') {
      Alert.alert('Bluetooth Off', 'Please turn on Bluetooth to scan for devices');
      return;
    }

    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      Alert.alert('Permissions Required', 'Bluetooth permissions are needed');
      return;
    }

    setIsScanning(true);
    setDevices([]);

    try {
      manager.startDeviceScan(null, null, (error: any, device: any) => {
        if (error) {
          console.error('Scan error:', error);
          setIsScanning(false);
          Alert.alert('Scan Error', error.message);
          return;
        }

        if (device && (device.name || device.localName)) {
          setDevices(prevDevices => {
            const exists = prevDevices.find(d => d.id === device.id);
            if (!exists) {
              return [...prevDevices, {
                id: device.id,
                name: device.name || device.localName,
                rssi: device.rssi
              }];
            }
            return prevDevices;
          });
        }
      });

      setTimeout(() => {
        if (isScanning) {
          stopScan();
        }
      }, 15000);
    } catch (error) {
      console.error('Start scan error:', error);
      setIsScanning(false);
      Alert.alert('Scan Error', 'Failed to start scanning');
    }
  };

  const stopScan = (): void => {
    if (manager) {
      manager.stopDeviceScan();
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: BLEDevice): Promise<void> => {
    if (!manager) {
      throw new Error('BLE Manager not available');
    }

    try {
      stopScan();

      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();

      setConnectedDevice(device);
      Alert.alert('Connected', `Connected to ${device.name}`);

    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Connection Failed', `Failed to connect: ${error.message}`);
      throw error;
    }
  };

  const disconnect = async (): Promise<void> => {
    if (!manager || !connectedDevice) return;

    try {
      // Stop sensor reading first
      stopSensorReading();

      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setSensorData(null);
      Alert.alert('Disconnected', 'Device disconnected');
    } catch (error) {
      console.error('Disconnection error:', error);
      throw error;
    }
  };

  // NEW: Start reading sensor data
  const startSensorReading = async (): Promise<void> => {
    if (!manager || !connectedDevice) {
      Alert.alert('Error', 'No device connected');
      return;
    }

    try {
      console.log('Starting sensor reading...');

      // Subscribe to water level characteristic
      const subscription = manager.monitorCharacteristicForDevice(
        connectedDevice.id,
        SERVICE_UUID,
        WATER_LEVEL_CHARACTERISTIC_UUID,
        (error: any, characteristic: any) => {
          if (error) {
            console.error('Sensor reading error:', error);
            Alert.alert('Sensor Error', error.message);
            setIsReadingSensor(false);
            return;
          }

          if (characteristic?.value) {
            try {
              // TODO: Adjust this parsing based on your sensor's data format
              // Common formats:
              // 1. Plain text: "45.2" -> parseFloat(base64decode(value))
              // 2. JSON: {"water": 45.2} -> JSON.parse(base64decode(value))
              // 3. Binary data -> custom parsing

              // For now, assuming plain text format:
              const base64Data = characteristic.value;
              const textData = atob(base64Data); // Base64 decode
              const waterLevel = parseFloat(textData);

              if (!isNaN(waterLevel)) {
                setSensorData({
                  waterLevel: waterLevel,
                  timestamp: Date.now()
                });
                console.log('Water level received:', waterLevel);
              }
            } catch (parseError) {
              console.error('Data parsing error:', parseError);
            }
          }
        }
      );

      setSensorSubscription(subscription);
      setIsReadingSensor(true);
      console.log('Sensor reading started successfully');

    } catch (error) {
      console.error('Failed to start sensor reading:', error);
      Alert.alert('Sensor Error', 'Failed to start reading sensor data');
    }
  };

  // NEW: Stop reading sensor data
  const stopSensorReading = (): void => {
    if (sensorSubscription) {
      sensorSubscription.remove();
      setSensorSubscription(null);
    }
    setIsReadingSensor(false);
    console.log('Sensor reading stopped');
  };

  return {
    devices,
    isScanning,
    connectedDevice,
    bluetoothState,
    sensorData,
    startScan,
    stopScan,
    connectToDevice,
    disconnect,
    startSensorReading,
    stopSensorReading,
    isConnected: !!connectedDevice,
    isReadingSensor,
  };
};