import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getPeliculas } from '../../api/peliculasApi';
import PeliculaItem from '../../components/PeliculaItem';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, RootStackParamList } from '../../utils/constants';
import { Pelicula } from '../../types/pelicula';

type PeliculasNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PeliculasListScreen: React.FC = () => {
  const navigation = useNavigation<PeliculasNavigationProp>();
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPeliculas = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getPeliculas();
      setPeliculas(data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar las películas. Intenta de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPeliculas();

    // Configura un listener para recargar al volver a esta pantalla
    const unsubscribe = navigation.addListener('focus', () => {
      cargarPeliculas();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <LoadingSpinner message="Cargando películas..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo de Películas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('PeliculaForm')}
        >
          <Text style={styles.addButtonText}>+ Añadir</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={cargarPeliculas}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : peliculas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay películas en el catálogo</Text>
          <TouchableOpacity 
            style={styles.addEmptyButton}
            onPress={() => navigation.navigate('PeliculaForm')}
          >
            <Text style={styles.addEmptyButtonText}>Añadir primera película</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={peliculas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PeliculaItem
              pelicula={item}
              onPress={() => navigation.navigate('PeliculaDetail', { peliculaId: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
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
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.lightText,
    marginBottom: 20,
  },
  addEmptyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addEmptyButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PeliculasListScreen;