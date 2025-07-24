import { updateTalusOptions } from '@/api/userApi';
import { AuthContext } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type LayoutChangeEvent
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import ModalPopUp from './modalPopUp';
import type { Talus } from './types';
import { truncate } from './utils';

const TalusSelect = (): React.JSX.Element => {
  const { talus, user, selectTalus } = useContext(AuthContext);
  const pathname = usePathname();
  const [talusOptions, setTalusOptions] = useState<Talus[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(
    talus?.name ?? 'No Device Paired'
  );
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const isScrollable = contentHeight > containerHeight;

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
            <Text style={talusSelectStyles.cardText}>
              {truncate(selectedDevice, 16)}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
      <ModalPopUp visible={visible} handleClose={() => setVisible(false)}>
        <Text style={talusSelectStyles.modalTitle}>Select Device</Text>
        <View
          style={{ position: 'relative', maxHeight: '80%' }}
          onLayout={(e: LayoutChangeEvent) =>
            setContainerHeight(e.nativeEvent.layout.height)
          }
        >
          {isScrollable ? (
            <>
              <ScrollView
                onContentSizeChange={(_: number, height: number) =>
                  setContentHeight(height)
                }
              >
                {talusOptions.map((device, index) => (
                  <Button
                    key={index}
                    onPress={() => handleSelect(device)}
                    mode="text"
                  >
                    <Text style={talusSelectStyles.cardText}>
                      {device.name}
                    </Text>
                  </Button>
                ))}
              </ScrollView>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.2)']}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 20,
                  pointerEvents: 'none'
                }}
              />
            </>
          ) : (
            <View
              onLayout={(e: LayoutChangeEvent) =>
                setContentHeight(e.nativeEvent.layout.height)
              }
            >
              {talusOptions.map((device, index) => (
                <Button
                  key={index}
                  onPress={() => handleSelect(device)}
                  mode="text"
                >
                  <Text style={talusSelectStyles.cardText}>{device.name}</Text>
                </Button>
              ))}
            </View>
          )}
        </View>
        <Button
          onPress={() => setVisible(false)}
          mode="text"
          style={{ marginTop: 10 }}
        >
          <Text style={talusSelectStyles.cardText}>Cancel</Text>
        </Button>
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
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  }
});

export default TalusSelect;
