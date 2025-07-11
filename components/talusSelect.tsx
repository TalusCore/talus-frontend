import { getTalusList } from '@/api/userApi';
import { AuthContext } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Modal, Portal } from 'react-native-paper';

type Talus = {
  talusId: string;
  name: string;
};

const TalusSelect = (): React.JSX.Element => {
  const { talus, user, selectTalus } = useContext(AuthContext);
  const [talusOptions, setTalusOptions] = useState<Talus[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(
    talus?.name ?? 'No Device Paired'
  );

  useEffect(() => {
    getTalusList(user!.email)
      .then(response => {
        if (response.success) {
          if (response.taluses && response.taluses.length > 0) {
            setTalusOptions(response.taluses);
          }
        } else {
          console.error(response.error);
        }
      })
      .catch(error => {
        console.error('Error fetching talus list:', error);
      });
  }, [user]);

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
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={talusSelectStyles.modalContainer}
        >
          <Text style={talusSelectStyles.modalTitle}>Select Device</Text>
          {talusOptions.map((device, index) => (
            <Button key={index} onPress={() => handleSelect(device)}>
              <Text style={talusSelectStyles.cardText}>{device.name}</Text>
            </Button>
          ))}
          <Button onPress={() => setVisible(false)} style={{ marginTop: 10 }}>
            <Text style={talusSelectStyles.cardText}>Cancel</Text>
          </Button>
        </Modal>
      </Portal>
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
