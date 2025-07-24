import { updateTalusOptions } from '@/api/userApi';
import ManageDeviceCard from '@/components/manageDevices/manageDeviceCard';
import { BACKGROUND_COLOR } from '@/components/styles';
import type { Talus } from '@/components/types';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const ManageDevices = (): React.JSX.Element => {
  const { user } = useContext(AuthContext);
  const [talusOptions, setTalusOptions] = useState<Talus[]>([]);

  useEffect(() => {
    updateTalusOptions(user, setTalusOptions);
  }, [user]);

  return (
    <View style={manageDevicesStyles.container}>
      {talusOptions.length === 0 ? (
        <View style={manageDevicesStyles.emptyStateContainer}>
          <Text style={manageDevicesStyles.emptyStateText}>
            No devices found
          </Text>
        </View>
      ) : (
        <ScrollView>
          {talusOptions.map(talus => (
            <ManageDeviceCard
              key={talus.talusId}
              name={talus.name}
              talusId={talus.talusId}
              setTalusOptions={setTalusOptions}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const manageDevicesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyStateText: {
    color: '#ffffff'
  }
});

export default ManageDevices;
