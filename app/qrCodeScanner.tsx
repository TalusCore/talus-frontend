import { pairTalus } from '@/api/talusApi';
import styles from '@/components/styles';
import { capitalizeFirstLetter } from '@/components/utils';
import { AuthContext } from '@/contexts/AuthContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

const ID_PREFIX = 'talus-code/';
let isFirstScan = true;

const handleQrCodeScanned = (
  event: { data: string },
  setScannedId: (id: string | null) => void,
  setValidId: (isValid: boolean) => void
): void => {
  const { data } = event;

  if (data.startsWith(ID_PREFIX)) {
    const id = data.split(ID_PREFIX)[1];

    if (isFirstScan) {
      isFirstScan = false;
      setScannedId(id);
      setValidId(true);
    }
  } else {
    setScannedId(null);
    setValidId(false);
  }
};

const handleTalusPairing = async (
  talusName: string,
  email: string,
  id: string,
  setTalusNameError: (error: boolean) => void,
  setErrorMessage: (message: string) => void
): Promise<void> => {
  if (talusName.trim() === '') {
    setTalusNameError(true);
  } else {
    setTalusNameError(false);
    const talusInfo = await pairTalus({
      email: email,
      talusId: id,
      name: talusName
    });

    if (talusInfo.success) {
      router.dismissAll();
      router.replace('/home');
    } else {
      const errorMsg = capitalizeFirstLetter(
        talusInfo.error,
        'Invalid Device Name.'
      );
      setErrorMessage(errorMsg);
    }
  }
};

const QrCodeScanner = (): React.JSX.Element => {
  const { user } = useContext(AuthContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [validId, setValidId] = useState<boolean>(true);
  const [talusName, setTalusName] = useState<string>('');
  const [talusNameError, setTalusNameError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
        <Text style={styles.text}>Talus scanned!</Text>
        <TextInput
          label="Talus name"
          mode="flat"
          style={styles.textInput}
          value={talusName}
          onChangeText={setTalusName}
          autoCapitalize="words"
          placeholder="Enter a name for your Talus"
          autoComplete="name"
          error={talusNameError}
        />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <Button
          mode="contained"
          icon="check"
          onPress={() =>
            handleTalusPairing(
              talusName,
              user?.email ?? '',
              scannedId,
              setTalusNameError,
              setErrorMessage
            )
          }
          style={{ marginTop: 20 }}
        >
          Pair
        </Button>
      </View>
    );
  }
};

export default QrCodeScanner;
