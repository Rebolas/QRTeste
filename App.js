import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [qrCodeData, setQrCodeData] = useState(null);

  // Pede permissão à câmara ao iniciar
  useEffect(() => {
    async function checkPermission() {
      if (!hasPermission) {
        await requestPermission();
      }
    }
    checkPermission();
  }, [hasPermission, requestPermission]);

  // Configura o scanner de QR codes
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && codes[0].value) {
        setQrCodeData(codes[0].value); // Guarda o valor do QR code
      }
    },
  });

  // Função para limpar os dados
  const clearData = () => setQrCodeData(null);

  // Verifica se há permissão e dispositivo
  if (!hasPermission) return <Text>Sem permissão para usar a câmara</Text>;
  if (!device) return <Text>Dispositivo de câmara não encontrado</Text>;

  return (
    <View style={styles.container}>
      {!qrCodeData ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>QR Code: {qrCodeData}</Text>
          <Button title="Ler Novo QR Code" onPress={clearData} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 20,
  },
});