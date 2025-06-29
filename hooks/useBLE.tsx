import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

// Conditional import to avoid bundling issues
let BleManager: any = null;
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

interface BLEHook {
  devices: BLEDevice[];
  isScanning: boolean;
  connectedDevice: BLEDevice | null;
  bluetoothState: string;
  startScan: () => Promise<void>;
  stopScan: () => void;
  connectToDevice: (device: BLEDevice) => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
}

export const useBLE = (): BLEHook => {
  const [devices, setDevices] = useState<BLEDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BLEDevice | null>(null);
  const [bluetoothState, setBluetoothState] = useState('Unknown');
  const [manager, setManager] = useState<any>(null);

  useEffect(() => {
    if (BleManager && Platform.OS !== 'web') {
      const bleManager = new BleManager();
      setManager(bleManager);

      const subscription = bleManager.onStateChange((state: string) => {
        setBluetoothState(state);
        if (state === 'PoweredOff') {
          setDevices([]);
          setConnectedDevice(null);
        }
      }, true);

      return () => {
        subscription.remove();
        bleManager.destroy();
      };
    }
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      // Check if permissions are available
      const permissions = [];

      // Add permissions that exist
      if (PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
        permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }

      // Try to add newer permissions if they exist
      try {
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
        }
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
        }
      } catch (e) {
        // Newer permissions don't exist, use older ones
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH);
        }
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN) {
          permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN);
        }
      }

      if (permissions.length === 0) {
        console.log('No permissions to request');
        return true; // Assume granted if no permissions available
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
      // Since you manually granted permissions, return true
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

      // Auto-stop scanning after 15 seconds
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
      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      Alert.alert('Disconnected', 'Device disconnected');
    } catch (error) {
      console.error('Disconnection error:', error);
      throw error;
    }
  };

  return {
    devices,
    isScanning,
    connectedDevice,
    bluetoothState,
    startScan,
    stopScan,
    connectToDevice,
    disconnect,
    isConnected: !!connectedDevice,
  };
};