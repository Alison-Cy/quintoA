import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getGeneroById, createGenero, updateGenero, deleteGenero } from '../../api/generosApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS, RootStackParamList } from '../../utils/constants';
import { GeneroFormData } from '../../types/genero';

type GeneroFormRouteProp = RouteProp<RootStackParamList, 'GeneroForm'>;
type GeneroFormNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const initialFormState: GeneroFormData = {
  nombre: '',
};

const GeneroFormScreen: React.FC = () => {
  const route = useRoute<GeneroFormRouteProp>();
  const navigation = useNavigation<GeneroFormNavigationProp>();
  const { generoId } = route.params || {};
  
  const [formData, setFormData] = useState<GeneroFormData>(initialFormState);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(generoId);
  const formTitle = isEditMode ? 'Editar Género' : 'Añadir Género';

  const cargarGenero = async (): Promise<void> => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      if (generoId) {
        const generoData = await getGeneroById(generoId);
        setFormData({
          nombre: generoData.nombre,
        });
      }
      setError(null);
    } catch (err) {
      setError('No se pudo cargar la información del género.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGenero();
  }, [isEditMode, generoId]);

  const handleChange = (value: string): void => {
    setFormData({ nombre: value });
  };

  const validateForm = (): boolean => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre del género es obligatorio');
      return false;
    }
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      if (isEditMode && generoId) {
        await updateGenero(generoId, formData);
        Alert.alert('Éxito', 'Género actualizado correctamente');
      } else {
        await createGenero(formData);
        Alert.alert('Éxito', 'Género creado correctamente');
      }
      
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Error', 
        isEditMode 
          ? 'No se pudo actualizar el género' 
          : 'No se pudo crear el género'
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!isEditMode || !generoId) return;

    Alert.alert(
      'Eliminar Género',
      '¿Estás seguro de que quieres eliminar este género? Esta acción podría afectar a las películas asociadas.',
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
              setSubmitting(true);
              await deleteGenero(generoId);
              Alert.alert('Éxito', 'Género eliminado correctamente');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar el género. Puede que esté siendo utilizado por alguna película.');
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos..." />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{formTitle}</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={handleChange}
            placeholder="Nombre del género"
            autoCapitalize="words"
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
        
        {isEditMode && (
          <TouchableOpacity 
            style={[styles.deleteButton, submitting && styles.disabledButton]} 
            onPress={handleDelete}
            disabled={submitting}
          >
            <Text style={styles.deleteButtonText}>Eliminar Género</Text>
          </TouchableOpacity>
        )}
      </View>
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  deleteButton: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GeneroFormScreen;