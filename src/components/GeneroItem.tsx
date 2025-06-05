import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';
import { Genero } from '../types/genero';

interface GeneroItemProps {
  genero: Genero;
  onPress: () => void;
}

const GeneroItem: React.FC<GeneroItemProps> = ({ genero, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.nombre}>{genero.nombre}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },

  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default GeneroItem;