import styles from '@/components/styles';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

const Settings = (): React.JSX.Element => {
  return (
    <View style={styles.settings}>
      <Button
        mode="contained"
        icon="camera"
        onPress={() => {
          router.push('/qrCodeScanner');
        }}
        style={{ marginBottom: 20 }}
      >
        Pair New Device
      </Button>
    </View>
  );
};

export default Settings;
