import styles from '@/components/styles';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

const ID_PREFIX = 'talus-code/';

const handleQrCodeScanned = (
  event: { data: string },
  setScannedId: (id: string | null) => void,
  setValidId: (isValid: boolean) => void
): void => {
  const { data } = event;

  if (data.startsWith(ID_PREFIX)) {
    const id = data.split(ID_PREFIX)[1];
    setScannedId(id);
    setValidId(true);
  } else {
    setScannedId(null);
    setValidId(false);
  }
};

const QrCodeScanner = (): React.JSX.Element => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [validId, setValidId] = useState<boolean>(true);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading the camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          We need your permission to show the camera
        </Text>
        <Button
          mode="contained"
          onPress={requestPermission}
          style={{ marginTop: 20 }}
        >
          Grant Permission
        </Button>
      </View>
    );
  }

  if (!validId) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Invalid QR code scanned</Text>
        <Button
          mode="contained"
          icon="camera"
          onPress={() => {
            setValidId(true);
          }}
          style={{ marginTop: 20 }}
        >
          Scan Again
        </Button>
      </View>
    );
  }

  if (scannedId == null) {
    return (
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={event =>
          handleQrCodeScanned(event, setScannedId, setValidId)
        }
        barcodeScannerSettings={{
          barcodeTypes: ['qr']
        }}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Talus paired!</Text>
        <Button
          mode="contained"
          icon="check"
          onPress={() => {
            router.dismissAll();
            router.replace('/');
          }}
          style={{ marginTop: 20 }}
        >
          Return
        </Button>
      </View>
    );
  }
};

export default QrCodeScanner;
