import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const StatCard = ({
  label,
  value
}: {
  label: string;
  value: number;
}): React.JSX.Element => (
  <View style={statCardStyles.card}>
    <Text style={statCardStyles.cardLabel}>{label}</Text>
    <Text style={statCardStyles.cardValue}>{Number(value).toFixed(2)}</Text>
  </View>
);

export const statCardStyles = StyleSheet.create({
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

export default StatCard;
