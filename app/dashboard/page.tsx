'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  IoMegaphoneOutline, IoSend, IoStatsChart, IoList, 
  IoImage, IoPeopleOutline, IoPersonAddOutline, IoBusinessOutline,
  IoCalendarOutline, IoLocationOutline
} from 'react-icons/io5';

// --- INTERFACES ---
interface Task {
  id: string;
  title: string;
  status: string;
  progress: number;
  location_name: string;
  deadline?: string;
  vendor_id?: string;
}

interface Report {
  id: string;
  before_img_url: string;
  after_img_url: string;
  description: string;
  ai_confidence_score: number;
  submitted_at: string;
  tasks?: { title: string };
}

interface Vendor {
  id: string;
  name: string;
  email: string;
  company_name: string;
}

export default function AdminDashboard() {
  // State Navigasi Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors'>('overview');

  // State Data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  
  // State Form
  const [newInstruction, setNewInstruction] = useState({ title: '', desc: '' });
  const [newVendor, setNewVendor] = useState({ name: '', email: '', company: '' });
  const [newTask, setNewTask] = useState({ 
    title: '', 
    project_id: '', 
    location_name: '', 
    deadline: '', 
    vendor_id: '' 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: tData } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    const { data: rData } = await supabase.from('reports').select('*, tasks(title)').limit(5).order('submitted_at', { ascending: false });
    const { data: vData } = await supabase.from('vendors').select('*').order('name');
    
    if (tData) setTasks(tData);
    if (rData) setRecentReports(rData as any);
    if (vData) setVendors(vData);
  };

  const sendInstruction = async () => {
    if (!newInstruction.title || !newInstruction.desc) return alert("Sila isi semua ruangan arahan!");
    setIsLoading(true);
    const { error } = await supabase.from('announcements').insert([newInstruction]);
    if (!error) {
      alert("Arahan berjaya disiarkan!");
      setNewInstruction({ title: '', desc: '' });
    }
    setIsLoading(false);
  };

  const registerVendor = async () => {
    if (!newVendor.name || !newVendor.email) return alert("Sila isi nama dan e-mel vendor!");
    setIsLoading(true);
    const { error } = await supabase.from('vendors').insert([{ 
      name: newVendor.name, 
      email: newVendor.email, 
      company_name: newVendor.company 
    }]);
    if (!error) {
      alert("Vendor berjaya didaftarkan!");
      setNewVendor({ name: '', email: '', company: '' });
      fetchData();
    }
    setIsLoading(false);
  };

  const createTask = async () => {
    if (!newTask.title || !newTask.vendor_id) return alert("Sila isi tajuk tugasan dan pilih vendor!");
    setIsLoading(true);
    const { error } = await supabase.from('tasks').insert([{ 
      title: newTask.title,
      project_id: newTask.project_id,
      location_name: newTask.location_name,
      deadline: newTask.deadline,
      vendor_id: newTask.vendor_id,
      status: 'pending',
      progress: 0
    }]);
    if (!error) {
      alert("Tugasan baru telah dicipta!");
      setNewTask({ title: '', project_id: '', location_name: '', deadline: '', vendor_id: '' });
      fetchData();
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & TABS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1e3a8a]">THB Control Center</h1>
            <p className="text-gray-500 text-sm">Sistem Pemantauan Operasi & Pengurusan Vendor</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-400'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('vendors')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'vendors' ? 'bg-[#1e3a8a] text-white shadow-md' : 'text-gray-400'}`}
            >
              Vendor Management
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              
              {/* BORANG ARAHAN */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <IoMegaphoneOutline className="text-[#1e3a8a] text-xl" />
                  <h3 className="text-lg font-bold text-gray-800">Siarkan Arahan</h3>
                </div>
                <div className="space-y-4">
                  <input className="w-full border border-gray-100 bg-gray-50 p-3.5 rounded-xl text-sm outline-none" placeholder="Tajuk Arahan" value={newInstruction.title} onChange={e => setNewInstruction({...newInstruction, title: e.target.value})} />
                  <textarea className="w-full border border-gray-100 bg-gray-50 p-3.5 rounded-xl text-sm h-24 outline-none" placeholder="Butiran..." value={newInstruction.desc} onChange={e => setNewInstruction({...newInstruction, desc: e.target.value})} />
                  <button onClick={sendInstruction} disabled={isLoading} className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 transition-all">
                    <IoSend /> {isLoading ? "Menghantar..." : "Siarkan Sekarang"}
                  </button>
                </div>
              </div>

              {/* BORANG CIPTA TUGASAN */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <IoList className="text-[#1e3a8a] text-xl" />
                  <h3 className="text-lg font-bold text-gray-800">Cipta Tugasan</h3>
                </div>
                <div className="space-y-3">
                  <input className="w-full border border-gray-100 bg-gray-50 p-3 rounded-xl text-sm outline-none" placeholder="Tajuk Tugasan" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                  <div className="grid grid-cols-2 gap-2">
                    <input className="border border-gray-100 bg-gray-50 p-3 rounded-xl text-sm outline-none" placeholder="Project ID" value={newTask.project_id} onChange={e => setNewTask({...newTask, project_id: e.target.value})} />
                    <input type="date" className="border border-gray-100 bg-gray-50 p-3 rounded-xl text-sm outline-none" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
                  </div>
                  <input className="w-full border border-gray-100 bg-gray-50 p-3 rounded-xl text-sm outline-none" placeholder="Lokasi Tapak" value={newTask.location_name} onChange={e => setNewTask({...newTask, location_name: e.target.value})} />
                  <select className="w-full border border-gray-100 bg-gray-50 p-3 rounded-xl text-sm outline-none" value={newTask.vendor_id} onChange={e => setNewTask({...newTask, vendor_id: e.target.value})}>
                    <option value="">Pilih Vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                  <button onClick={createTask} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl mt-2 hover:bg-blue-700 transition-all">
                    {isLoading ? "Menghantar..." : "Sahkan & Hantar"}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              {/* MONITOR AKTIVITI */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6"><IoStatsChart className="text-[#1e3a8a]" /> <h3 className="text-lg font-bold text-gray-800">Status Tugasan Semasa</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.slice(0, 4).map(task => (
                    <div key={task.id} className="p-4 border rounded-xl bg-gray-50/50">
                      <div className="flex justify-between mb-2"><span className="text-sm font-bold text-blue-900 truncate w-32">{task.title}</span><span className="text-[10px] font-bold text-blue-600 uppercase">{task.status}</span></div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full"><div className="bg-blue-600 h-full rounded-full" style={{ width: `${task.progress}%` }}></div></div>
                      <div className="flex justify-between mt-2"><span className="text-[10px] text-gray-400">{task.location_name}</span><span className="text-[10px] text-gray-400">{task.deadline}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LAPORAN BERGAMBAR */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6"><IoImage className="text-[#1e3a8a]" /> <h3 className="text-lg font-bold text-gray-800">Laporan Bergambar Terakhir</h3></div>
                <div className="space-y-4">
                  {recentReports.map(report => (
                    <div key={report.id} className="flex gap-4 p-4 border-b last:border-0 hover:bg-gray-50 transition-all rounded-xl">
                      <div className="flex gap-1">
                        <img src={report.before_img_url} className="w-16 h-16 object-cover rounded-lg border" alt="Before" />
                        <img src={report.after_img_url} className="w-16 h-16 object-cover rounded-lg border" alt="After" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900">{report.tasks?.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{report.description}</p>
                        <div className="mt-2"><span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">AI Match: {Math.round(report.ai_confidence_score * 100)}%</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= VENDOR MANAGEMENT ================= */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6"><IoPersonAddOutline className="text-green-600" /> <h3 className="text-lg font-bold text-gray-800">Daftar Vendor</h3></div>
                <div className="space-y-4">
                  <input className="w-full border border-gray-100 bg-gray-50 p-3.5 rounded-xl text-sm outline-none" placeholder="Nama Penuh" value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} />
                  <input className="w-full border border-gray-100 bg-gray-50 p-3.5 rounded-xl text-sm outline-none" placeholder="E-mel Rasmi" value={newVendor.email} onChange={e => setNewVendor({...newVendor, email: e.target.value})} />
                  <input className="w-full border border-gray-100 bg-gray-50 p-3.5 rounded-xl text-sm outline-none" placeholder="Nama Syarikat" value={newVendor.company} onChange={e => setNewVendor({...newVendor, company: e.target.value})} />
                  <button onClick={registerVendor} disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl mt-4 hover:bg-green-700 transition-all">Sahkan Pendaftaran</button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6"><IoPeopleOutline className="text-[#1e3a8a]" /> <h3 className="text-lg font-bold text-gray-800">Senarai Vendor Berdaftar</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="text-xs font-bold text-gray-400 uppercase border-b"><th className="pb-3 px-2">Nama</th><th className="pb-3 px-2">Syarikat</th><th className="pb-3 px-2">E-mel</th></tr></thead>
                    <tbody className="divide-y">
                      {vendors.map(v => (
                        <tr key={v.id} className="text-sm hover:bg-gray-50 transition-colors"><td className="py-4 px-2 font-semibold text-gray-700">{v.name}</td><td className="py-4 px-2 text-gray-500">{v.company_name || '-'}</td><td className="py-4 px-2 text-gray-500">{v.email}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}