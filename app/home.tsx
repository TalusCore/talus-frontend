import styles from '@/components/styles';
import { Text, View } from 'react-native';

const Home = (): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the home page</Text>
    </View>
  );
};

export default Home;
