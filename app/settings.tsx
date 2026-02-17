import styles from '@/components/styles';
import { AuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useContext } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

const Settings = (): React.JSX.Element => {
  const { signOut } = useContext(AuthContext);

  const handleSignOut = (): void => {
    signOut();
    router.dismissAll();
    router.replace('/');
  };

  return (
    <View style={styles.settings}>
      <Button
        mode="contained"
        icon="account-cog"
        onPress={() => {
          router.push('/editProfile');
        }}
        style={{ marginBottom: 20 }}
      >
        Edit Profile
      </Button>
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
      <Button
        mode="contained"
        icon="cog"
        onPress={() => {
          router.push('/manageDevices');
        }}
        style={{ marginBottom: 20 }}
      >
        Manage Paired Devices
      </Button>
      <Button
        mode="contained"
        icon="chart-line"
        onPress={() => {
          router.push('/activityHistory');
        }}
        style={{ marginBottom: 20 }}
      >
        View Activity History
      </Button>
      <Button
        mode="contained"
        icon="logout"
        onPress={handleSignOut}
        style={{ marginBottom: 20 }}
      >
        Sign Out
      </Button>
    </View>
  );
};

export default Settings;
