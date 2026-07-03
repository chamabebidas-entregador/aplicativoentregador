import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>APP OK</Text>
      <Text style={styles.text}>Abriu sem cair</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ffcc00',
    fontSize: 32,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginTop: 10,
  },
});
