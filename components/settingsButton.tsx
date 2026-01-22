import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const SettingsButton = (): React.JSX.Element => (
  <TouchableOpacity
    onPress={() => router.push('/settings')}
    style={{
      paddingRight: 5,
      paddingLeft: 5
    }}
  >
    <MaterialCommunityIcons name="cog" size={30} color="white" />
  </TouchableOpacity>
);

export default SettingsButton;
