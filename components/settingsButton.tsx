import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';

const SettingsButton = (): React.JSX.Element => (
  <TouchableOpacity onPress={() => router.push('/settings')}>
    <IconButton
      icon="cog"
      size={24}
      iconColor="#ffffff"
      accessibilityLabel="Settings"
    />
  </TouchableOpacity>
);

export default SettingsButton;
