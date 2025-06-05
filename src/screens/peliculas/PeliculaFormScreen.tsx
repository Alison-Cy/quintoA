import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getPeliculaById, createPelicula, updatePelicula } from '../../api/peliculasApi';
import { getGeneros } from '../../api/generosApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, RootStackParamList } from '../../utils/constants';
import { PeliculaFormData } from '../../types/pelicula';
import { Genero } from '../../types/genero';

type PeliculaFormRouteProp = RouteProp<RootStackParamList, 'PeliculaForm'>;
type PeliculaFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const initialFormState: PeliculaFormData = {
  titulo: '',
  director: '',
  anio: new Date().getFullYear(),
  rating: 5.0,
  sinopsis: '',
  duracion: 90,
  trailer: '',
  generoId: 0,
};

const PeliculaFormScreen: React.FC = () => {
  const route = useRoute<PeliculaFormRouteProp>();
  const navigation = useNavigation<PeliculaFormNavigationProp>();
  const { peliculaId } = route.params || {};
  
  const [formData, setFormData] = useState<PeliculaFormData>(initialFormState);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generoModalVisible, setGeneroModalVisible] = useState<boolean>(false);

  const isEditMode = Boolean(peliculaId);
  const formTitle = isEditMode ? 'Editar Película' : 'Añadir Película';

  const cargarDatos = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Cargar géneros
      const generosData = await getGeneros();
      setGeneros(generosData);
      
      // Si estamos en modo edición, cargar datos de la película
      if (isEditMode && peliculaId) {
        console.log(`Cargando película con ID ${peliculaId} para editar`);
        const peliculaData = await getPeliculaById(peliculaId);
        console.log('Datos recibidos para editar:', peliculaData);
        
        // Ya no es necesario hacer mapeo aquí porque getPeliculaById ya lo hace
        // en peliculasApi.ts (ahora devuelve sinopsis, trailer y generoId)
        setFormData({
          titulo: peliculaData?.titulo ?? '',
          director: peliculaData?.director ?? '',
          anio: peliculaData?.anio ?? new Date().getFullYear(),
          rating: peliculaData?.rating ?? 5.0,
          sinopsis: peliculaData?.sinopsis ?? '', // Ya viene mapeado desde la API
          duracion: peliculaData?.duracion ?? 90,
          trailer: peliculaData?.trailer ?? '',   // Ya viene mapeado desde la API
          generoId: peliculaData?.generoId ?? 0   // Ya viene mapeado desde la API
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos para el formulario:', err);
      setError('No se pudieron cargar los datos necesarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [isEditMode, peliculaId]);

  const handleChange = (name: keyof PeliculaFormData, value: string | number): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return false;
    }
    if (!formData.director.trim()) {
      Alert.alert('Error', 'El director es obligatorio');
      return false;
    }
    if (formData.generoId === 0 && generos.length > 0) {
      Alert.alert('Error', 'Debes seleccionar un género');
      return false;
    }
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      console.log('Datos del formulario a enviar:', formData);
      
      if (isEditMode && peliculaId) {
        // No necesitamos hacer mapeo aquí, ya lo hace updatePelicula
        const peliculaActualizada = await updatePelicula(peliculaId, formData);
        console.log('Película actualizada:', peliculaActualizada);
        Alert.alert('Éxito', 'Película actualizada correctamente');
      } else {
        // No necesitamos hacer mapeo aquí, ya lo hace createPelicula
        const nuevaPelicula = await createPelicula(formData);
        console.log('Nueva película creada:', nuevaPelicula);
        Alert.alert('Éxito', 'Película creada correctamente');
      }
      
      navigation.goBack();
    } catch (err) {
      console.error('Error al guardar película:', err);
      Alert.alert(
        'Error', 
        isEditMode 
          ? 'No se pudo actualizar la película' 
          : 'No se pudo crear la película'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectGenero = (generoId: number): void => {
    handleChange('generoId', generoId);
    setGeneroModalVisible(false);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos..." />;
  }

  const selectedGenero = generos.find(g => g.id === formData.generoId);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{formTitle}</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={formData.titulo}
            onChangeText={(value) => handleChange('titulo', value)}
            placeholder="Título de la película"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Director</Text>
          <TextInput
            style={styles.input}
            value={formData.director}
            onChangeText={(value) => handleChange('director', value)}
            placeholder="Nombre del director"
          />
        </View>
        
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Año</Text>
            <TextInput
              style={styles.input}
              value={formData.anio !== undefined ? formData.anio.toString() : ''}
              onChangeText={(value) => handleChange('anio', parseInt(value) || 0)}
              keyboardType="numeric"
              placeholder="Año"
            />
          </View>
          
          <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Duración (min)</Text>
            <TextInput
              style={styles.input}
              value={formData.duracion !== undefined ? formData.duracion.toString() : ''}
              onChangeText={(value) => handleChange('duracion', parseInt(value) || 0)}
              keyboardType="numeric"
              placeholder="Duración en minutos"
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Rating (0-10)</Text>
          <TextInput
            style={styles.input}
            value={formData.rating !== undefined ? formData.rating.toString() : ''}
            onChangeText={(value) => {
              const rating = parseFloat(value) || 0;
              handleChange('rating', Math.min(10, Math.max(0, rating)));
            }}
            keyboardType="numeric"
            placeholder="Calificación (0-10)"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Género</Text>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => setGeneroModalVisible(true)}
          >
            <Text style={styles.selectButtonText}>
              {selectedGenero ? selectedGenero.nombre : 'Seleccionar género'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Sinopsis</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.sinopsis}
            onChangeText={(value) => handleChange('sinopsis', value)}
            placeholder="Escribe la sinopsis de la película"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>URL del Trailer</Text>
          <TextInput
            style={styles.input}
            value={formData.trailer}
            onChangeText={(value) => handleChange('trailer', value)}
            placeholder="https://www.youtube.com/watch?v=..."
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={() => navigation.goBack()}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton, submitting && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Modal simple para selección de género */}
      {generoModalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Género</Text>
            
            <ScrollView style={styles.generosList}>
              {generos.length === 0 ? (
                <Text style={styles.noGenerosText}>
                  No hay géneros disponibles. Añade uno primero.
                </Text>
              ) : (
                generos.map(genero => (
                  <TouchableOpacity
                    key={genero.id}
                    style={[
                      styles.generoItem,
                      formData.generoId === genero.id && styles.selectedGeneroItem
                    ]}
                    onPress={() => handleSelectGenero(genero.id)}
                  >
                    <Text 
                      style={[
                        styles.generoItemText,
                        formData.generoId === genero.id && styles.selectedGeneroItemText
                      ]}
                    >
                      {genero.nombre}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setGeneroModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.shadow,
  },
  textArea: {
    minHeight: 100,
  },
  selectButton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.shadow,
  },
  selectButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.lightText,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Estilos del modal
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  generosList: {
    maxHeight: 300,
  },
  generoItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.shadow,
  },
  selectedGeneroItem: {
    backgroundColor: COLORS.primary + '20', // Color primario con transparencia
  },
  generoItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedGeneroItemText: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  noGenerosText: {
    textAlign: 'center',
    padding: 20,
    color: COLORS.lightText,
  },
  closeModalButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PeliculaFormScreen;