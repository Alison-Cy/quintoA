import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getPeliculaById, deletePelicula } from '../../api/peliculasApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, RootStackParamList } from '../../utils/constants';
import { Pelicula } from '../../types/pelicula';

type PeliculaDetailRouteProp = RouteProp<RootStackParamList, 'PeliculaDetail'>;
type PeliculaDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PeliculaDetailScreen: React.FC = () => {
  const route = useRoute<PeliculaDetailRouteProp>();
  const navigation = useNavigation<PeliculaDetailNavigationProp>();
  const { peliculaId } = route.params;
  
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPelicula = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getPeliculaById(peliculaId);
      setPelicula(data);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar la información de la película.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPelicula();
  }, [peliculaId]);

  const handleDelete = (): void => {
    Alert.alert(
      'Eliminar Película',
      '¿Estás seguro de que quieres eliminar esta película?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deletePelicula(peliculaId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar la película');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const abrirTrailer = (): void => {
    if (pelicula?.trailer) {
      Linking.openURL(pelicula.trailer).catch(() => {
        Alert.alert('Error', 'No se pudo abrir el enlace del trailer');
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando información..." />;
  }

  if (error || !pelicula) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'No se encontró la película'}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{pelicula.titulo}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {pelicula.rating}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Director:</Text>
        <Text style={styles.infoValue}>{pelicula.director}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Año:</Text>
        <Text style={styles.infoValue}>{pelicula.anio}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Género:</Text>
        <Text style={styles.infoValue}>{pelicula.genero?.nombre || 'Sin género'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Duración:</Text>
        <Text style={styles.infoValue}>{pelicula.duracion} minutos</Text>
      </View>

      <View style={styles.sinopsisContainer}>
        <Text style={styles.sectionTitle}>Sinopsis</Text>
        <Text style={styles.sinopsis}>{pelicula.sinopsis || 'No hay sinopsis disponible'}</Text>
      </View>

      {pelicula.trailer && (
        <TouchableOpacity style={styles.trailerButton} onPress={abrirTrailer}>
          <Text style={styles.trailerButtonText}>Ver Trailer</Text>
        </TouchableOpacity>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={() => navigation.navigate('PeliculaForm', { peliculaId })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rating: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  sinopsisContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  sinopsis: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  trailerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  trailerButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PeliculaDetailScreen;