import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center'
  },
  settings: {
    flex: 1,
    backgroundColor: '#25292e',
    padding: 20
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center'
  },
  textInput: {
    width: '80%',
    marginTop: 20
  },
  error: { color: 'red', marginTop: 20 }
});

export default styles;
