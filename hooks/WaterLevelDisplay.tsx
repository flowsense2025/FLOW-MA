import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WaterLevelDisplayProps {
  waterLevel?: number | null;
  isConnected: boolean;
  lastUpdate?: number | null;
}

const WaterLevelDisplay: React.FC<WaterLevelDisplayProps> = ({
  waterLevel,
  isConnected,
  lastUpdate
}) => {
  const getWaterLevelColor = (level: number | null | undefined): string => {
    if (!level && level !== 0) return '#9CA3AF'; // gray-400
    if (level < 20) return '#EF4444'; // red-500
    if (level < 40) return '#F97316'; // orange-500
    if (level < 70) return '#EAB308'; // yellow-500
    return '#22C55E'; // green-500
  };

  const getBackgroundColor = (level: number | null | undefined): string => {
    if (!level && level !== 0) return '#F9FAFB'; // gray-50
    if (level < 20) return '#FEF2F2'; // red-50
    if (level < 40) return '#FFF7ED'; // orange-50
    if (level < 70) return '#FEFCE8'; // yellow-50
    return '#F0FDF4'; // green-50
  };

  const getBorderColor = (level: number | null | undefined): string => {
    if (!level && level !== 0) return '#E5E7EB'; // gray-200
    if (level < 20) return '#FECACA'; // red-200
    if (level < 40) return '#FED7AA'; // orange-200
    if (level < 70) return '#FEF3C7'; // yellow-200
    return '#BBF7D0'; // green-200
  };

  const formatTime = (timestamp: number | null | undefined): string => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  const getLevelStatus = (level: number | null | undefined): string => {
    if (!level && level !== 0) return 'No Data';
    if (level < 20) return 'Low';
    if (level < 40) return 'Medium-Low';
    if (level < 70) return 'Medium';
    return 'High';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Water Level Sensor</Text>
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

      {/* Main Display */}
      <View style={[
        styles.displayContainer,
        {
          backgroundColor: getBackgroundColor(waterLevel),
          borderColor: getBorderColor(waterLevel)
        }
      ]}>
        {/* Water Drop Icon (using text) */}
        <Text style={[
          styles.waterIcon,
          { color: getWaterLevelColor(waterLevel) }
        ]}>
          💧
        </Text>

        {/* Water Level Value */}
        {waterLevel !== null && waterLevel !== undefined ? (
          <>
            <Text style={[
              styles.waterValue,
              { color: getWaterLevelColor(waterLevel) }
            ]}>
              {waterLevel.toFixed(1)}
              <Text style={styles.unit}>L</Text>
            </Text>

            <Text style={[
              styles.levelStatus,
              { color: getWaterLevelColor(waterLevel) }
            ]}>
              {getLevelStatus(waterLevel)}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.noDataValue}>--</Text>
            <Text style={styles.noDataText}>No Data</Text>
          </>
        )}

        {/* Last Update Time */}
        {lastUpdate && (
          <Text style={styles.lastUpdate}>
            Updated: {formatTime(lastUpdate)}
          </Text>
        )}
      </View>

      {/* Status Bar */}
      {waterLevel !== null && waterLevel !== undefined && (
        <View style={styles.statusBar}>
          <View style={styles.statusBarBackground}>
            <View
              style={[
                styles.statusBarFill,
                {
                  width: `${Math.min(waterLevel, 100)}%`,
                  backgroundColor: getWaterLevelColor(waterLevel)
                }
              ]}
            />
          </View>
          <View style={styles.statusLabels}>
            <Text style={styles.statusLabel}>0L</Text>
            <Text style={styles.statusLabel}>100L</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
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
  displayContainer: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  waterIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  waterValue: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  unit: {
    fontSize: 32,
    marginLeft: 8,
  },
  levelStatus: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  noDataValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 18,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBar: {
    marginTop: 8,
  },
  statusBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusBarFill: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  statusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default WaterLevelDisplay;