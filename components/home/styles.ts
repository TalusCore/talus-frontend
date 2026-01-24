import { StyleSheet } from 'react-native';
import { BACKGROUND_COLOR } from '../styles';

export const homeStyles = StyleSheet.create({
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#ffffff'
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: 32,
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
});

export const scrollViewStyles = StyleSheet.create({
  container: {
    width: '100%'
  },
  containerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
