import { StyleSheet } from 'react-native';

export const BACKGROUND_COLOR = '#25292e';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center'
  },
  settings: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
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
  error: { color: 'red', marginTop: 20 },
  inputError: {
    borderColor: 'red',
    borderWidth: 1
  },
  datePicker: {
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 4
  }
});

export default styles;
