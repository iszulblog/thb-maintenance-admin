import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function SubmitReportScreen({ route, navigation }: any) {
  const { taskId } = route.params;
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [document, setDocument] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async (type: 'before' | 'after') => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      if (type === 'before') setBeforeImage(result.assets[0].uri);
      else setAfterImage(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled) {
      setDocument(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!beforeImage || !afterImage) {
      Alert.alert("Perhatian", "Sila ambil kedua-dua gambar Sebelum dan Selepas.");
      return;
    }

    setLoading(true);
    
    // Simulasi Skor AI untuk Demo (85% - 98%)
    const aiScore = (Math.random() * (0.98 - 0.85) + 0.85).toFixed(2);

    const { error } = await supabase.from('reports').insert([{
      task_id: taskId,
      before_img_url: beforeImage,
      after_img_url: afterImage,
      description: description,
      ai_confidence_score: parseFloat(aiScore),
      submitted_at: new Date()
    }]);

    if (!error) {
      await supabase.from('tasks').update({ status: 'completed', progress: 100 }).eq('id', taskId);
      Alert.alert("Berjaya", `Laporan dihantar! Skor AI: ${parseFloat(aiScore) * 100}%`);
      navigation.navigate('TaskList');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerCard}>
        <Text style={styles.projectCode}>PRJ-001</Text>
        <Text style={styles.projectTitle}>Pengurusan Landskap Zone A</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color="#1e3a8a" />
          <Text style={styles.locationText}>Taman Perumahan Indah, Kuantan</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Penerangan Kerja</Text>
        <TextInput 
          style={styles.input}
          placeholder="Tulis ringkasan kerja di sini..."
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Gambar Sebelum & Selepas */}
      <View style={styles.photoSection}>
        <View style={styles.photoBox}>
          <Text style={styles.photoLabel}>Gambar Sebelum</Text>
          <TouchableOpacity style={styles.cameraBtn} onPress={() => pickImage('before')}>
            {beforeImage ? <Image source={{ uri: beforeImage }} style={styles.preview} /> : <Ionicons name="camera" size={30} color="#cbd5e1" />}
          </TouchableOpacity>
        </View>

        <View style={styles.photoBox}>
          <Text style={styles.photoLabel}>Gambar Selepas</Text>
          <TouchableOpacity style={styles.cameraBtn} onPress={() => pickImage('after')}>
            {afterImage ? <Image source={{ uri: afterImage }} style={styles.preview} /> : <Ionicons name="camera" size={30} color="#cbd5e1" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Dokumen Sakungan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dokumen Sakungan (PDF)</Text>
        <TouchableOpacity style={styles.docBtn} onPress={pickDocument}>
          <Ionicons name="document-attach" size={20} color="#1e3a8a" />
          <Text style={styles.docBtnText}>{document ? document.name : "Muat Naik Resit/Dokumen"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitBtnText}>{loading ? "Menghantar..." : "Hantar Laporan"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  headerCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#1e3a8a' },
  projectCode: { fontSize: 12, color: '#64748b', fontWeight: 'bold' },
  projectTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a', marginVertical: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 13, color: '#64748b', marginLeft: 5 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#334155', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, height: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: '#e2e8f0' },
  photoSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  photoBox: { width: '48%' },
  photoLabel: { fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 8, textAlign: 'center' },
  cameraBtn: { height: 120, backgroundColor: '#fff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed' },
  preview: { width: '100%', height: '100%', borderRadius: 11 },
  docBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  docBtnText: { marginLeft: 10, color: '#1e3a8a', fontSize: 14 },
  submitBtn: { backgroundColor: '#1e3a8a', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 50 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});