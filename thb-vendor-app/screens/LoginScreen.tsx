import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function VendorLogin({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Ralat', error.message);
    } else {
      // TUKAR DI SINI: Navigasi ke 'Home' dan bukannya 'TaskList'
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THB Vendor App</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Vendor"
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log Masuk Vendor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#1e3a8a', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});