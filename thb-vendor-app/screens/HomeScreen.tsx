import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HomeScreen({ navigation }: any) {
  
  // State untuk menyimpan arahan terkini
  const [announcement, setAnnouncement] = useState({ 
    title: 'Memuatkan...', 
    description: 'Sila tunggu sebentar.' 
  });

  // Fungsi untuk menarik data arahan daripada Supabase
  const fetchLatestAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('title, description')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setAnnouncement({ title: data.title, description: data.description });
      } else {
        setAnnouncement({ title: 'Tiada Arahan', description: 'Semua operasi berjalan lancar.' });
      }
    } catch (err) {
      console.log("Ralat polling:", err);
    }
  };

  useEffect(() => {
    // 1. Ambil data segera apabila skrin dibuka
    fetchLatestAnnouncement();

    // 2. Setkan Polling: Semak data baru setiap 30 saat (30000ms)
    const interval = setInterval(() => {
      fetchLatestAnnouncement();
      console.log("Polling: Menyemak arahan baharu daripada Admin...");
    }, 30000);

    // 3. Bersihkan pemasa apabila komponen ditutup untuk jimat bateri
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 1, label: 'Pemeriksaan', icon: 'search-circle-outline' },
    { id: 2, label: 'JKR', icon: 'business-outline' },
    { id: 3, label: 'Bulanan', icon: 'calendar-number-outline' },
    { id: 4, label: 'Statistik', icon: 'stats-chart-outline' },
    { id: 5, label: 'Toolbox', icon: 'briefcase-outline' },
    { id: 6, label: 'Bencana', icon: 'thunderstorm-outline' },
    { id: 7, label: 'Lain-lain', icon: 'grid-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* ROW 1: Logo & Carian */}
        <View style={styles.row1}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>THB</Text>
          </View>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput 
              placeholder="Carian laporan..." 
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* ROW 2: Pemberitahuan Arahan (POLLING AKTIF) */}
        <View style={styles.row2}>
          <View style={styles.announcementCard}>
            <Ionicons name="megaphone" size={24} color="#1e3a8a" />
            <View style={styles.announcementTextWrapper}>
              <Text style={styles.announcementTitle}>{announcement.title}</Text>
              <Text style={styles.announcementDesc}>{announcement.description}</Text>
            </View>
          </View>
        </View>

        {/* ROW 3: Menu 3x3 */}
        <View style={styles.row3}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.menuItem}>
                <View style={styles.iconBox}>
                  <Ionicons name={item.icon as any} size={28} color="#1e3a8a" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ROW 4: Senarai Laporan Harian */}
        <View style={styles.row4}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Laporan Harian</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TaskList')}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reportCard}>
              <Image 
                source={{ uri: 'https://via.placeholder.com/400x150' }} 
                style={styles.reportImage} 
              />
              <View style={styles.reportOverlay}>
                <View style={styles.badgeGE}><Text style={styles.badgeText}>GE</Text></View>
                <View style={styles.badgeDate}><Text style={styles.badgeText}>10 Mei</Text></View>
              </View>
              <View style={styles.reportDetails}>
                <Text style={styles.reportTitle}>Penyelenggaraan Jalan Persekutuan</Text>
                <Text style={styles.reportSub}>Vendor: Syazis Enterprise</Text>
              </View>
          </View>
        </View>
      </ScrollView>

      {/* ROW 5: Bottom Navigation Bar Widget */}
      <View style={styles.row5}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#e11d48" />
          <Text style={[styles.navText, { color: '#e11d48' }]}>Utama</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TaskList')}>
          <Ionicons name="time-outline" size={24} color="#64748b" />
          <Text style={styles.navText}>Program</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigation.navigate('SubmitReport', { taskId: 'new' })}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="alert-circle-outline" size={24} color="#64748b" />
          <Text style={styles.navText}>Amaran</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#64748b" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  row1: { flexDirection: 'row', padding: 20, alignItems: 'center', marginTop: 10 },
  logoPlaceholder: { width: 45, height: 45, backgroundColor: '#fff', borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1 },
  logoText: { color: '#1e3a8a', fontWeight: 'bold', fontSize: 12 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', marginLeft: 15, borderRadius: 25, paddingHorizontal: 15, height: 45, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  row2: { paddingHorizontal: 20, marginBottom: 20 },
  announcementCard: { flexDirection: 'row', backgroundColor: '#dbeafe', padding: 15, borderRadius: 15, alignItems: 'center' },
  announcementTextWrapper: { marginLeft: 15, flex: 1 },
  announcementTitle: { fontWeight: 'bold', color: '#1e3a8a', fontSize: 14 },
  announcementDesc: { color: '#1e3a8a', fontSize: 12, marginTop: 2 },
  row3: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 15 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuItem: { width: '30%', alignItems: 'center', marginBottom: 20 },
  iconBox: { width: 60, height: 60, backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
  menuLabel: { marginTop: 8, fontSize: 12, color: '#475569', textAlign: 'center' },
  row4: { paddingHorizontal: 20, marginBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAll: { color: '#2563EB', fontSize: 12, fontWeight: 'bold' },
  reportCard: { backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1 },
  reportImage: { width: '100%', height: 160 },
  reportOverlay: { position: 'absolute', top: 10, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between' },
  badgeGE: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeDate: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: { fontWeight: 'bold', fontSize: 12, color: '#1e3a8a' },
  reportDetails: { padding: 15 },
  reportTitle: { fontWeight: 'bold', fontSize: 15, color: '#1e3a8a' },
  reportSub: { fontSize: 12, color: '#64748b', marginTop: 4 },
  row5: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 75, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingBottom: 15 },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 11, marginTop: 4, color: '#64748b' },
  fab: { width: 60, height: 60, backgroundColor: '#22c55e', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: -40, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2 }
});