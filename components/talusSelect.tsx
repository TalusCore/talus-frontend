import { updateTalusOptions } from '@/api/userApi';
import { AuthContext } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import ModalPopUp from './modalPopUp';
import type { Talus } from './types';

const TalusSelect = (): React.JSX.Element => {
  const { talus, user, selectTalus } = useContext(AuthContext);
  const pathname = usePathname();
  const [talusOptions, setTalusOptions] = useState<Talus[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(
    talus?.name ?? 'No Device Paired'
  );

  useEffect(() => {
    if (pathname === '/home') {
      updateTalusOptions(user, setTalusOptions);
    }
  }, [pathname, user]);

  useEffect(() => {
    if (talus?.name !== undefined) {
      setSelectedDevice(talus.name);
    }
  }, [talus]);

  const handleSelect = (device: Talus): void => {
    selectTalus(device);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ marginRight: 10 }}
      >
        <Card style={talusSelectStyles.card}>
          <View style={talusSelectStyles.cardContent}>
            <MaterialCommunityIcons name="cellphone" size={20} color="black" />
            <Text style={talusSelectStyles.cardText}>{selectedDevice}</Text>
          </View>
        </Card>
      </TouchableOpacity>
      <ModalPopUp visible={visible} handleClose={() => setVisible(false)}>
        <View>
          <Text style={talusSelectStyles.modalTitle}>Select Device</Text>
          {talusOptions.map((device, index) => (
            <Button
              key={index}
              onPress={() => handleSelect(device)}
              mode="text"
            >
              <Text style={talusSelectStyles.cardText}>{device.name}</Text>
            </Button>
          ))}
          <Button
            onPress={() => setVisible(false)}
            mode="text"
            style={{ marginTop: 10 }}
          >
            <Text style={talusSelectStyles.cardText}>Cancel</Text>
          </Button>
        </View>
      </ModalPopUp>
    </>
  );
};

const talusSelectStyles = StyleSheet.create({
  card: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center'
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  }
});

export default TalusSelect;
