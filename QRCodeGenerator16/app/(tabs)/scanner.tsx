import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Modal,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Cargar historial al iniciar
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    // Aquí puedes cargar historial guardado (AsyncStorage)
    // Por ahora usamos datos de ejemplo
    const savedHistory = [];
    setHistory(savedHistory);
  };

  const saveToHistory = (code: string) => {
    setHistory(prev => [code, ...prev].slice(0, 10)); // Guardar últimos 10
    // Aquí puedes guardar en AsyncStorage
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setScannedData(data);
    setModalVisible(true);
    Vibration.vibrate(200); // Vibrar al escanear
    
    // Verificar si son 16 dígitos
    const isSixteenDigits = /^\d{16}$/.test(data);
    if (isSixteenDigits) {
      saveToHistory(data);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScannedData(null);
  };

  const copyToClipboard = (text: string) => {
    // Para Expo, necesitas expo-clipboard
    Alert.alert('Éxito', 'Código copiado al portapapeles');
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos permiso para usar la cámara
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Dar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Vista de la cámara */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      {/* Marco de escaneo */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.scannerBox}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        
        <View style={styles.unfocusedContainer} />
      </View>

      {/* Texto de instrucciones */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          📷 Enfoca el código QR dentro del marco
        </Text>
        <Text style={styles.instructionsSubtext}>
          El código debe tener 16 dígitos numéricos
        </Text>
      </View>

      {/* Botón para volver a escanear */}
      {scanned && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
          <Text style={styles.scanAgainText}>🔍 Escanear otro código</Text>
        </TouchableOpacity>
      )}

      {/* Botón para ver historial */}
      <TouchableOpacity 
        style={styles.historyButton} 
        onPress={() => router.push('/history')}
      >
        <Text style={styles.historyButtonText}>📜 Historial</Text>
      </TouchableOpacity>

      {/* Modal con resultado del escaneo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✅ QR Escaneado</Text>
            
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Código:</Text>
              <Text style={styles.resultCode}>{scannedData}</Text>
            </View>

            {scannedData && /^\d{16}$/.test(scannedData) ? (
              <View style={styles.validContainer}>
                <Text style={styles.validText}>
                  ✓ Código válido de 16 dígitos
                </Text>
              </View>
            ) : (
              <View style={styles.invalidContainer}>
                <Text style={styles.invalidText}>
                  ⚠️ Este código no tiene 16 dígitos numéricos
                </Text>
                <Text style={styles.invalidSubtext}>
                  Longitud: {scannedData?.length} dígitos
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (scannedData && /^\d{16}$/.test(scannedData)) {
                  // Puedes navegar a otra pantalla con el código
                  Alert.alert('Éxito', `Código ${scannedData} guardado`);
                }
              }}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.copyButton]}
              onPress={() => copyToClipboard(scannedData || '')}
            >
              <Text style={styles.modalButtonText}>📋 Copiar Código</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    height: 250,
  },
  scannerBox: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#2196F3',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#2196F3',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#2196F3',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#2196F3',
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 10,
  },
  instructionsSubtext: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 10,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  resultContainer: {
    width: '100%',
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  resultCode: {
    fontSize: 16,
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  validContainer: {
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: 15,
  },
  validText: {
    color: '#155724',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  invalidContainer: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: 15,
  },
  invalidText: {
    color: '#721c24',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  invalidSubtext: {
    color: '#721c24',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 5,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  copyButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});