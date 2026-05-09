import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function TaskListScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Semua');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (data) setTasks(data);
  };

  const renderTaskCard = ({ item }: any) => {
    // Tentukan warna badge berdasarkan status
    const getStatusStyle = (status: string) => {
      switch (status.toLowerCase()) {
        case 'pending': return { bg: '#FEF3C7', text: '#D97706', label: 'Belum Mula' };
        case 'in-progress': return { bg: '#DBEAFE', text: '#2563EB', label: 'Dalam Proses' };
        case 'completed': return { bg: '#D1FAE5', text: '#059669', label: 'Selesai' };
        default: return { bg: '#F3F4F6', text: '#4B5563', label: status };
      }
    };

    const statusStyle = getStatusStyle(item.status);

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('SubmitReport', { taskId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
          </View>
          <Text style={styles.projectId}>{item.project_id || 'PRJ-000'}</Text>
        </View>

        <Text style={styles.taskTitle}>{item.title}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-sharp" size={14} color="#64748b" />
          <Text style={styles.infoText}>{item.location_name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={14} color="#64748b" />
          <Text style={styles.infoText}>Tarikh Akhir: {item.deadline || 'Tiada Tarikh'}</Text>
        </View>

        {/* Progress Bar Seksi */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarWrapper}>
            <View style={[styles.progressBarFill, { width: `${item.progress || 0}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>{item.progress || 0}%</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Utama */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tugasan Saya</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color="#1e3a8a" />
        </TouchableOpacity>
      </View>

      {/* Tabs Pilihan */}
      <View style={styles.tabContainer}>
        {['Semua', 'Belum Mula', 'Dalam Proses', 'Selesai'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
  filterBtn: { backgroundColor: '#fff', padding: 10, borderRadius: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  tab: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 20 },
  activeTab: { backgroundColor: '#DBEAFE' },
  tabText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
  activeTabText: { color: '#2563EB', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  projectId: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  taskTitle: { fontSize: 17, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#64748b', marginLeft: 8 },
  progressSection: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  progressBarWrapper: { flex: 1, height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden', marginRight: 12 },
  progressBarFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 4 },
  progressPercentage: { fontSize: 13, fontWeight: 'bold', color: '#1e3a8a', width: 35 }
});