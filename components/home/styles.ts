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

export const fitnessTipStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '90%'
  },
  cardLabel: {
    fontSize: 16,
    color: '#6B7280'
  },
  cardValue: {
    fontSize: 20,
    color: '#111827',
    fontWeight: 'bold',
    marginTop: 4
  }
});
