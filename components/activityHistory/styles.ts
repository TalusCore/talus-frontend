import { StyleSheet } from 'react-native';
import { BACKGROUND_COLOR } from '../styles';

export const activityHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR
  },
  dropdown: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20
  },
  dateTimePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center'
  },
  errorMessageText: { textAlign: 'center', color: 'white', fontSize: 20 }
});

export const chartStyles = StyleSheet.create({
  lineChart: {
    backgroundColor: 'white',
    paddingTop: 12,
    paddingRight: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  tooltipText: { color: '#fff', fontSize: 12 }
});

export const dropdownStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16
  },
  dropdown: {
    height: 50,
    width: '90%',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8
  },
  fontStyle: {
    fontSize: 16
  }
});
