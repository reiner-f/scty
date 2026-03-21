import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, Users, Building, Briefcase, FileText, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { useApp } from "@/context/AppContext";
import { createProvider } from "@/services/providerService";
import { fetchAllMunicipalities, createMunicipality } from "@/services/municipalityService";
import { adminService, AdminUserView } from "@/services/adminService";
import { RequestList } from "@/components/requests/RequestList";
import { Municipality, AppRole, RequestStatus } from "@/types";

type TabType = 'cereri' | 'utilizatori' | 'primarii' | 'furnizori';

export function AdminDashboard() {
  const { filteredRequests, notifySuccess, notifyError, updateRequest, providers } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('cereri');

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [isLoadingExtra, setIsLoadingExtra] = useState(false);

  // Form states
  const [newProvName, setNewProvName] = useState("");
  const [newProvCui, setNewProvCui] = useState("");
  const [munData, setMunData] = useState({ name: '', cui: '', contact_person: '', email: '', phone: '', locality: '' });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoadingExtra(true);
    try {
      setMunicipalities(await fetchAllMunicipalities());
      setUsers(await adminService.getAllUsers());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingExtra(false);
    }
  };

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProvider(newProvName, newProvCui, "contact@furnizor.ro");
      notifySuccess("Furnizor adăugat! Te rugăm să reîncarci pagina pentru a-l vedea în dropdown-uri.");
      setNewProvName(""); setNewProvCui("");
    } catch (err) { notifyError("Eroare la adăugare furnizor"); }
  };

  const handleAddMunicipality = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMunicipality(munData);
      notifySuccess("Primărie adăugată cu succes!");
      setMunData({ name: '', cui: '', contact_person: '', email: '', phone: '', locality: '' });
      loadAdminData();
    } catch (err) { notifyError("Eroare la adăugare primărie."); }
  };

  const handleUserChange = (userId: string, field: 'role' | 'entityId', value: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, [field]: value === "none" ? null : value };
        if (field === 'role') updated.entityId = null; // Resetăm entitatea dacă schimbăm rolul
        return updated;
      }
      return u;
    }));
  };

  const saveUserMapping = async (user: AdminUserView) => {
    if (!user.role) return notifyError("Selectează un rol!");
    if (user.role !== 'admin' && !user.entityId) return notifyError("Selectează instituția de care aparține!");
    
    try {
      await adminService.updateUserMapping(user.id, user.role as AppRole, user.entityId);
      notifySuccess(`Utilizatorul ${user.email} a fost actualizat!`);
    } catch (err) { notifyError("Eroare la salvarea utilizatorului."); }
  };

  const tabs = [
    { id: 'cereri', label: 'Monitorizare', icon: FileText },
    { id: 'utilizatori', label: 'Utilizatori', icon: Users },
    { id: 'primarii', label: 'Primării', icon: Building },
    { id: 'furnizori', label: 'Furnizori', icon: Briefcase },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panou Administrator</h1>
          <p className="text-slate-500">Gestiunea sistemului și a utilizatorilor</p>
        </div>
      </div>

      {/* Navigație Tab-uri */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Conținut Tab-uri */}
      {activeTab === 'cereri' && (
        <RequestList 
          requests={filteredRequests} 
          emptyMessage="Nu există nicio cerere în sistem." 
          title="Toate Cererile" 
          onUpdateStatus={(id: string, status: RequestStatus) => updateRequest(id, { status })} 
        />
      )}

      {activeTab === 'utilizatori' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {isLoadingExtra ? (
            <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 font-semibold text-slate-600">Email Utilizator</th>
                    <th className="p-4 font-semibold text-slate-600 w-48">Rol Funcțional</th>
                    <th className="p-4 font-semibold text-slate-600 w-72">Instituție Asociată</th>
                    <th className="p-4 font-semibold text-slate-600 text-right">Acțiune</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{u.email}</td>
                      <td className="p-4">
                        <Select
                          value={u.role || "none"}
                          onChange={(e) => handleUserChange(u.id, 'role', e.target.value)}
                          options={[
                            { value: "none", label: "Fără Rol" },
                            { value: "admin", label: "Admin Global" },
                            { value: "primarie", label: "Primărie" },
                            { value: "furnizor", label: "Furnizor" }
                          ]}
                        />
                      </td>
                      <td className="p-4">
                        <Select
                          value={u.entityId || "none"}
                          onChange={(e) => handleUserChange(u.id, 'entityId', e.target.value)}
                          disabled={!u.role || u.role === 'admin'}
                          options={[
                            { value: "none", label: "Selectează instituția..." },
                            ...(u.role === 'primarie' ? municipalities.map(m => ({ value: m.id, label: m.name })) : []),
                            ...(u.role === 'furnizor' ? providers.map(p => ({ value: p.id, label: p.name })) : [])
                          ]}
                        />
                      </td>
                      <td className="p-4 text-right">
                        <Button size="sm" onClick={() => saveUserMapping(u)} leftIcon={<Save className="w-4 h-4"/>}> Salvează </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'primarii' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Building className="w-5 h-5 text-purple-600"/> Adaugă Primărie Nouă</h3>
          <form onSubmit={handleAddMunicipality} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Denumire Instituție" value={munData.name} onChange={e => setMunData({...munData, name: e.target.value})} required />
            <Input label="Cod Fiscal (CUI)" value={munData.cui} onChange={e => setMunData({...munData, cui: e.target.value})} required />
            <Input label="Localitate / Județ" value={munData.locality} onChange={e => setMunData({...munData, locality: e.target.value})} required />
            <Input label="Nume Contact" value={munData.contact_person} onChange={e => setMunData({...munData, contact_person: e.target.value})} required />
            <Input label="Email Contact" type="email" value={munData.email} onChange={e => setMunData({...munData, email: e.target.value})} required />
            <Input label="Telefon Contact" value={munData.phone} onChange={e => setMunData({...munData, phone: e.target.value})} required />
            <div className="sm:col-span-2 flex justify-end mt-4">
              <Button type="submit" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Înregistrează Primăria</Button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'furnizori' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-xl">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-600"/> Adaugă Furnizor Nou</h3>
          <form onSubmit={handleAddProvider} className="space-y-4">
            <Input label="Nume Companie" value={newProvName} onChange={(e) => setNewProvName(e.target.value)} required />
            <Input label="Cod Fiscal (CUI)" value={newProvCui} onChange={(e) => setNewProvCui(e.target.value)} required />
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Adaugă Furnizor</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}