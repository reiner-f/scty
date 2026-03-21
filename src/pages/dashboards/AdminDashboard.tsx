import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Plus, Users, Building, Briefcase, FileText, 
  Loader2, Key, Eye, Edit2, Trash2, AlertTriangle, X
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { createProvider } from "@/services/providerService";
import { fetchAllMunicipalities, createMunicipality } from "@/services/municipalityService";
import { adminService, AdminUserView } from "@/services/adminService";
import { RequestList } from "@/components/requests/RequestList";
import { Municipality, AppRole, RequestStatus } from "@/types";

type TabType = 'cereri' | 'utilizatori' | 'primarii' | 'furnizori';
type ModalAction = 'detail' | 'edit' | 'delete' | 'password' | null;

export function AdminDashboard() {
  const { filteredRequests, notifySuccess, notifyError, updateRequest, providers } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('cereri');

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [isLoadingExtra, setIsLoadingExtra] = useState(false);

  // Stări pentru Modalele de Utilizator
  const [selectedUser, setSelectedUser] = useState<AdminUserView | null>(null);
  const [userModalType, setUserModalType] = useState<ModalAction>(null);
  const [editUserData, setEditUserData] = useState({ role: 'none', entityId: 'none' });

  // Form states Furnizor & Primărie
  const [newProvName, setNewProvName] = useState("");
  const [newProvCui, setNewProvCui] = useState("");
  const [newProvEmail, setNewProvEmail] = useState("");
  const [newProvPassword, setNewProvPassword] = useState("");
  const [munData, setMunData] = useState({ name: '', cui: '', contact_person: '', email: '', phone: '', locality: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [adminNewPassword, setAdminNewPassword] = useState("");

  const handleAdminChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (adminNewPassword.length < 6) return notifyError("Parola trebuie să aibă minim 6 caractere.");
    
    setIsSubmitting(true);
    try {
      await adminService.changeUserPassword(selectedUser.id, adminNewPassword);
      notifySuccess(`Parola pentru ${selectedUser.email} a fost schimbată cu succes!`);
      setUserModalType(null);
      setAdminNewPassword("");
    } catch (err) {
      notifyError("Eroare la schimbarea parolei.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ACȚIUNI UTILIZATORI (CRUD) ---
  const openEditModal = (u: AdminUserView) => {
    setSelectedUser(u);
    setEditUserData({ role: u.role || 'none', entityId: u.entityId || 'none' });
    setUserModalType('edit');
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const role = editUserData.role === 'none' ? null : (editUserData.role as AppRole);
      const entity = editUserData.entityId === 'none' ? null : editUserData.entityId;
      
      await adminService.updateUserMapping(selectedUser.id, role, entity);
      notifySuccess("Datele utilizatorului au fost actualizate!");
      setUserModalType(null);
      loadAdminData();
    } catch (err) {
      notifyError("Eroare la salvarea modificărilor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await adminService.deleteUser(selectedUser.id);
      notifySuccess("Utilizatorul a fost șters definitiv!");
      setUserModalType(null);
      loadAdminData();
    } catch (err: any) {
      console.error("Eroare ștergere:", err);
      // Acum ne va arăta pe ecran motivul exact pentru care nu se șterge
      notifyError(err.message || "Eroare la ștergerea utilizatorului.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ACȚIUNI ADĂUGARE INSTITUȚII ---
  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProvPassword.length < 6) return notifyError("Parola trebuie să aibă minim 6 caractere.");
    setIsSubmitting(true);
    try {
      const newProv = await createProvider(newProvName, newProvCui, newProvEmail);
      await adminService.createUserAccountAndMap(newProvEmail, newProvPassword, 'furnizor', newProv.id);
      notifySuccess("Furnizorul și contul au fost create!");
      setNewProvName(""); setNewProvCui(""); setNewProvEmail(""); setNewProvPassword("");
      loadAdminData();
    } catch (err: any) { notifyError(err.message || "Eroare adăugare."); } 
    finally { setIsSubmitting(false); }
  };

  const handleAddMunicipality = async (e: React.FormEvent) => {
    e.preventDefault();
    if (munData.password.length < 6) return notifyError("Parola minim 6 caractere.");
    setIsSubmitting(true);
    try {
      const dbPayload = { name: munData.name, cui: munData.cui, contact_person: munData.contact_person, email: munData.email, phone: munData.phone, locality: munData.locality };
      const newMun = await createMunicipality(dbPayload);
      await adminService.createUserAccountAndMap(munData.email, munData.password, 'primarie', newMun.id);
      notifySuccess("Primăria și contul au fost create!");
      setMunData({ name: '', cui: '', contact_person: '', email: '', phone: '', locality: '', password: '' });
      loadAdminData();
    } catch (err: any) { notifyError(err.message || "Eroare adăugare."); } 
    finally { setIsSubmitting(false); }
  };

  const getEntityName = (role: AppRole | null, entityId: string | null) => {
    if (role === 'admin') return "Sistem Centria";
    if (!role || !entityId) return "-";
    if (role === 'primarie') return municipalities.find(m => m.id === entityId)?.name || "Necunoscut";
    if (role === 'furnizor') return providers.find(p => p.id === entityId)?.name || "Necunoscut";
    return "-";
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
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 font-semibold text-slate-600">Email Utilizator</th>
                    <th className="p-4 font-semibold text-slate-600 w-40">Rol Funcțional</th>
                    <th className="p-4 font-semibold text-slate-600">Instituție Asociată</th>
                    <th className="p-4 font-semibold text-slate-600 text-right w-36">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{u.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${
                          u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                          u.role === 'primarie' ? 'bg-sky-50 text-sky-700 border-sky-200' : 
                          u.role === 'furnizor' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {u.role || "Fără Rol"}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-700 truncate max-w-[200px]">
                        {getEntityName(u.role, u.entityId)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setSelectedUser(u); setUserModalType('detail'); }} className="p-2 text-sky-600 hover:bg-sky-100 rounded-lg transition-colors" title="Detalii">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(u)} className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors" title="Editează Rolul">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {/* Butonul de schimbare parolă */}
                          <button onClick={() => { setSelectedUser(u); setUserModalType('password'); }} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors" title="Schimbă Parola">
                            <Key className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setSelectedUser(u); setUserModalType('delete'); }} className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors" title="Șterge">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- FORMULARE ADAUGARE INSTITUTII --- */}
      {activeTab === 'primarii' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2"><Building className="w-5 h-5 text-purple-600"/> Adaugă Primărie</h3>
          </div>
          <form onSubmit={handleAddMunicipality} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
             <div className="space-y-4">
                <Input label="Denumire" value={munData.name} onChange={e => setMunData({...munData, name: e.target.value})} required />
                <Input label="CUI" value={munData.cui} onChange={e => setMunData({...munData, cui: e.target.value})} required />
                <Input label="Localitate" value={munData.locality} onChange={e => setMunData({...munData, locality: e.target.value})} required />
                <Input label="Nume Contact" value={munData.contact_person} onChange={e => setMunData({...munData, contact_person: e.target.value})} required />
                <Input label="Telefon" value={munData.phone} onChange={e => setMunData({...munData, phone: e.target.value})} required />
             </div>
             <div className="space-y-4">
                <Input label="Email Cont" type="email" value={munData.email} onChange={e => setMunData({...munData, email: e.target.value})} required />
                <Input label="Parolă Acces" type="text" value={munData.password} onChange={e => setMunData({...munData, password: e.target.value})} required leftIcon={<Key className="w-4 h-4"/>}/>
             </div>
             <div className="sm:col-span-2 flex justify-end mt-4"><Button type="submit" variant="primary" isLoading={isSubmitting}>Înregistrează</Button></div>
          </form>
        </div>
      )}

      {activeTab === 'furnizori' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-3xl">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-lg flex items-center gap-2"><Briefcase className="w-5 h-5 text-purple-600"/> Adaugă Furnizor</h3>
          </div>
          <form onSubmit={handleAddProvider} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
             <div className="space-y-4">
               <Input label="Nume Companie" value={newProvName} onChange={(e) => setNewProvName(e.target.value)} required />
               <Input label="CUI" value={newProvCui} onChange={(e) => setNewProvCui(e.target.value)} required />
             </div>
             <div className="space-y-4">
               <Input label="Email Cont" type="email" value={newProvEmail} onChange={(e) => setNewProvEmail(e.target.value)} required />
               <Input label="Parolă Acces" type="text" value={newProvPassword} onChange={(e) => setNewProvPassword(e.target.value)} required leftIcon={<Key className="w-4 h-4"/>} />
             </div>
             <div className="sm:col-span-2 flex justify-end mt-4"><Button type="submit" variant="primary" isLoading={isSubmitting}>Adaugă</Button></div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALELE PENTRU ACȚIUNILE DE UTILIZATORI                    */}
      {/* ========================================================= */}

      {/* 1. Modal Detalii */}
      <Modal isOpen={userModalType === 'detail'} onClose={() => setUserModalType(null)} title="Detalii Utilizator" size="sm">
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Email</p>
              <p className="font-semibold text-slate-900">{selectedUser.email}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Rol Curent</p>
              <p className="font-semibold text-slate-900 uppercase">{selectedUser.role || "Fără Rol"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Instituție Asociată</p>
              <p className="font-semibold text-slate-900">{getEntityName(selectedUser.role, selectedUser.entityId)}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* 2. Modal Editare */}
      <Modal isOpen={userModalType === 'edit'} onClose={() => setUserModalType(null)} title="Editează Utilizatorul" size="sm">
        <form onSubmit={handleSaveUserEdit} className="space-y-5">
           <Select
              label="Rol Funcțional"
              value={editUserData.role}
              onChange={(e) => {
                setEditUserData({ role: e.target.value, entityId: 'none' }); 
              }}
              options={[
                 { value: "none", label: "Fără Rol (Revocare Acces)" },
                 { value: "admin", label: "Admin Global" },
                 { value: "primarie", label: "Primărie" },
                 { value: "furnizor", label: "Furnizor" }
              ]}
           />
           {editUserData.role !== 'admin' && editUserData.role !== 'none' && (
             <Select
                label="Asociază o instituție"
                value={editUserData.entityId}
                onChange={(e) => setEditUserData({ ...editUserData, entityId: e.target.value })}
                options={[
                   { value: "none", label: "Selectează instituția..." },
                   ...(editUserData.role === 'primarie' ? municipalities.map(m => ({ value: m.id, label: m.name })) : []),
                   ...(editUserData.role === 'furnizor' ? providers.map(p => ({ value: p.id, label: p.name })) : [])
                ]}
             />
           )}
           <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setUserModalType(null)}>Anulează</Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>Salvează</Button>
           </div>
        </form>
      </Modal>

      {/* 3. Modal Ștergere */}
      <Modal isOpen={userModalType === 'delete'} onClose={() => setUserModalType(null)} size="sm">
        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ștergere Cont</h3>
          <p className="text-slate-500 mb-8">
            Ești sigur că vrei să ștergi utilizatorul <strong className="text-slate-800">{selectedUser?.email}</strong>? Nu va mai avea acces în aplicație.
          </p>
          <div className="flex gap-3 w-full">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setUserModalType(null)}>Anulează</Button>
            <Button type="button" variant="danger" className="flex-1" onClick={handleDeleteUser} isLoading={isSubmitting}>Șterge Definitiv</Button>
          </div>
        </div>
      </Modal>

      {/* 4. Modal Schimbare Parolă (Admin) */}
      <Modal isOpen={userModalType === 'password'} onClose={() => { setUserModalType(null); setAdminNewPassword(""); }} title="Resetează Parola" size="sm">
        <form onSubmit={handleAdminChangePassword} className="space-y-4">
          <p className="text-sm text-slate-600 mb-2">
            Introduceți o nouă parolă pentru utilizatorul <strong className="text-slate-900">{selectedUser?.email}</strong>.
          </p>
          <Input 
            label="Parolă Nouă" 
            type="text" 
            value={adminNewPassword} 
            onChange={(e) => setAdminNewPassword(e.target.value)} 
            placeholder="Minim 6 caractere"
            required 
            leftIcon={<Key className="w-4 h-4"/>} 
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => { setUserModalType(null); setAdminNewPassword(""); }}>Anulează</Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>Schimbă Parola</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}