import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getGeneros } from '../../api/generosApi';
import GeneroItem from '../../components/GeneroItem';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, RootStackParamList } from '../../utils/constants';
import { Genero } from '../../types/genero';

type GenerosNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GenerosListScreen: React.FC = () => {
  const navigation = useNavigation<GenerosNavigationProp>();
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarGeneros = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getGeneros();
      setGeneros(data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los géneros. Intenta de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGeneros();

    // Configura un listener para recargar al volver a esta pantalla
    const unsubscribe = navigation.addListener('focus', () => {
      cargarGeneros();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <LoadingSpinner message="Cargando géneros..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Géneros</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('GeneroForm')}
        >
          <Text style={styles.addButtonText}>+ Añadir</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={cargarGeneros}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : generos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay géneros disponibles</Text>
          <TouchableOpacity 
            style={styles.addEmptyButton}
            onPress={() => navigation.navigate('GeneroForm')}
          >
            <Text style={styles.addEmptyButtonText}>Añadir primer género</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={generos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <GeneroItem
              genero={item}
              onPress={() => navigation.navigate('GeneroForm', { generoId: item.id })}
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

export default GenerosListScreen;