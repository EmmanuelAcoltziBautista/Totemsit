import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function HomeScreen() {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [userInput, setUserInput] = useState('');

  // Generar 16 dígitos aleatorios
  const generateRandom16Digits = () => {
    let digits = '';
    for (let i = 0; i < 16; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    return digits;
  };

  // Generar nuevo código QR
  const generateNewQR = () => {
    const newCode = generateRandom16Digits();
    setQrCodeValue(newCode);
    setUserInput(newCode);
  };

  // Generar QR desde input del usuario
  const generateFromInput = () => {
    if (userInput.length === 16 && /^\d+$/.test(userInput)) {
      setQrCodeValue(userInput);
    } else {
      Alert.alert(
        'Error',
        'Por favor ingresa exactamente 16 dígitos numéricos',
        [{ text: 'OK' }]
      );
    }
  };

  // Mostrar código en alerta
  const showCode = () => {
    Alert.alert('Código de 16 dígitos', qrCodeValue, [
      { text: 'OK' },
      { text: 'Generar nuevo', onPress: generateNewQR },
    ]);
  };

  useEffect(() => {
    generateNewQR();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>✨ Generador QR ✨</Text>
      <Text style={styles.subtitle}>Código de 16 dígitos</Text>

      {/* Mostrar QR Code */}
      <View style={styles.qrContainer}>
        {qrCodeValue ? (
          <QRCode
            value={qrCodeValue}
            size={280}
            color="#000000"
            backgroundColor="#FFFFFF"
            quietZone={10}
          />
        ) : (
          <View style={styles.placeholderQR}>
            <Text>Generando QR...</Text>
          </View>
        )}
      </View>

      {/* Mostrar el código numérico */}
      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>📱 Código de 16 dígitos:</Text>
        <Text style={styles.codeValue}>{qrCodeValue || '--- --- --- ---'}</Text>
      </View>

      {/* Botones principales */}
      <TouchableOpacity style={styles.buttonPrimary} onPress={generateNewQR}>
        <Text style={styles.buttonText}>🔄 Generar Nuevo Código</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={showCode}>
        <Text style={styles.buttonText}>👁️ Ver Código</Text>
      </TouchableOpacity>

      {/* Input personalizado */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          ✏️ O ingresa tus propios 16 dígitos:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: 1234 5678 9012 3456"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={16}
          value={userInput}
          onChangeText={setUserInput}
        />
        <TouchableOpacity style={styles.buttonCustom} onPress={generateFromInput}>
          <Text style={styles.buttonText}>🎨 Generar QR Personalizado</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.info}>
        ℹ️ El código debe contener exactamente 16 dígitos numéricos
      </Text>
      <Text style={styles.info}>
        📲 Escanea el QR con cualquier lector de códigos
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: Platform.OS === 'ios' ? 20 : 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 25,
  },
  placeholderQR: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  codeContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  codeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1,
  },
  buttonPrimary: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSecondary: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonCustom: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlign: 'center',
    letterSpacing: 2,
  },
  info: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});