import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../utils/constants';
import { Pelicula } from '../types/pelicula';

interface PeliculaItemProps {
  pelicula: Pelicula;
  onPress: () => void;
}

const PeliculaItem: React.FC<PeliculaItemProps> = ({ pelicula, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{pelicula.titulo}</Text>
        <Text style={styles.subtitle}>{pelicula.director} • {pelicula.anio}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.genero}>{pelicula.genero?.nombre || 'Sin género'}</Text>
          <Text style={styles.duracion}>{pelicula.duracion} min</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {pelicula.rating}</Text>
          </View>
        </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  genero: {
    fontSize: 14,
    color: COLORS.primary,
    flex: 1,
  },
  duracion: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  ratingContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  rating: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default PeliculaItem;