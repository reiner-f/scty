import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Users, Building, Briefcase, FileText, 
  Loader2, Key, Eye, Trash2, AlertTriangle, Pencil, Plus, Ban, CheckCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { createProvider, fetchProviders } from "@/services/providerService";
import { fetchAllMunicipalities, createMunicipality } from "@/services/municipalityService";
import { adminService, AdminUserView } from "@/services/adminService";
import { RequestList } from "@/components/requests/RequestList";
import { Municipality, Provider, AppRole, RequestStatus } from "@/types";

type TabType = 'cereri' | 'utilizatori' | 'primarii' | 'furnizori';
type ModalAction = 'detail' | 'editUser' | 'deleteUser' | 'password' | 'addMun' | 'editMun' | 'addProv' | 'editProv' | 'deleteEntity' | 'blockMun' | 'viewRequests' | null;

export function AdminDashboard() {
  const { filteredRequests, requests, updateRequest, notifyError, notifySuccess } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('cereri');

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [adminProviders, setAdminProviders] = useState<Provider[]>([]);
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [isLoadingExtra, setIsLoadingExtra] = useState(false);

  // Stări pentru Modale
  const [modalType, setModalType] = useState<ModalAction>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserView | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Municipality | Provider | null>(null);

  useEffect(() => { loadAdminData(); }, []);

  const loadAdminData = async () => {
    setIsLoadingExtra(true);
    try {
      const [muns, usrs, provs] = await Promise.all([ fetchAllMunicipalities(), adminService.getAllUsers(), fetchProviders() ]);
      setMunicipalities(muns); setUsers(usrs); setAdminProviders(provs);
    } catch (err) { notifyError("Eroare la încărcarea datelor administrative."); } 
    finally { setIsLoadingExtra(false); }
  };

  const getEntityName = (role: AppRole | null, entityId: string | null) => {
    if (role === 'admin') return "Sistem Centria";
    if (role === 'primarie') return municipalities.find(m => m.id === entityId)?.name || "-";
    if (role === 'furnizor') return adminProviders.find(p => p.id === entityId)?.name || "-";
    return "-";
  };

  const tabs = [
    { id: 'cereri', label: 'Monitorizare', icon: FileText },
    { id: 'utilizatori', label: 'Utilizatori', icon: Users },
    { id: 'primarii', label: 'Primării', icon: Building },
    { id: 'furnizori', label: 'Furnizori', icon: Briefcase },
  ];

  return (
    <div className="space-y-6 p-1 md:p-3">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center shadow-lg border-4 border-white">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panou Administrator</h1>
          <p className="text-slate-500 font-medium">Gestiunea centralizată a sistemului și moderație</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 mb-6 bg-white p-2 rounded-xl shadow-inner overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-purple-50'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CERERI */}
      {activeTab === 'cereri' && (
        <RequestList requests={filteredRequests} emptyMessage="Nu există nicio cerere în sistem." title="Toate Cererile din Platformă" onUpdateStatus={(id, status) => updateRequest(id, { status })} />
      )}

      {/* TAB UTILIZATORI */}
      {activeTab === 'utilizatori' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
          {isLoadingExtra ? <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div> : (
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr><th className="p-5 text-sm text-slate-600 uppercase">Email Utilizator</th><th className="p-5 text-sm text-slate-600 uppercase">Rol Functional</th><th className="p-5 text-sm text-slate-600 uppercase">Instituție Asociată</th><th className="p-5 text-right uppercase text-slate-600">Acțiuni Profil</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-purple-50/30">
                    <td className="p-5 font-semibold text-slate-950">{u.email}</td>
                    <td className="p-5"><span className="inline-flex px-3 py-1 rounded-full text-xs font-bold border bg-slate-100 uppercase">{u.role || "Fără Rol"}</span></td>
                    <td className="p-5 font-medium text-slate-800">{getEntityName(u.role, u.entityId)}</td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => { setSelectedUser(u); setModalType('editUser'); }} className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => { setSelectedUser(u); setModalType('password'); }} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg"><Key className="w-4 h-4" /></button>
                        <button onClick={() => { setSelectedUser(u); setModalType('deleteUser'); }} className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB PRIMĂRII */}
      {activeTab === 'primarii' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr,2fr] gap-6 items-start">
          <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm sticky top-6">
            <h3 className="font-bold text-xl flex items-center gap-3 border-b pb-4 mb-4"><Building className="w-6 h-6 text-purple-600"/> Adaugă Primărie</h3>
            <button onClick={() => setModalType('addMun')} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 flex items-center justify-center gap-2 shadow-md"><Plus /> Deschide Formularul</button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr><th className="p-5 text-xs text-slate-500 uppercase">Instituție</th><th className="p-5 text-xs text-slate-500 uppercase">Contact</th><th className="p-5 text-xs text-slate-500 uppercase text-center">Status Cont</th><th className="p-5 text-right text-xs text-slate-500 uppercase">Acțiuni Moderație</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {municipalities.map(m => (
                  <tr key={m.id} className={m.isBlocked ? "bg-rose-50/50" : "hover:bg-slate-50"}>
                    <td className="p-5"><div className="font-bold text-slate-900 text-lg">{m.name}</div><div className="text-xs font-mono mt-1 text-slate-500">CUI: {m.cui}</div></td>
                    <td className="p-5"><div className="text-sm font-semibold">{m.contactPerson.name}</div><div className="text-xs text-slate-500">{m.contactPerson.phone}</div></td>
                    <td className="p-5 text-center">
                      {m.isBlocked ? <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold"><Ban className="w-3 h-3"/> Suspendat</span> : <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold"><CheckCircle className="w-3 h-3"/> Activ</span>}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => { setSelectedEntity(m); setModalType('viewRequests'); }} className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg text-xs font-bold flex items-center gap-1" title="Vezi & Gestionează Cereri"><Eye className="w-4 h-4"/> Cereri</button>
                        <button onClick={() => { setSelectedEntity(m); setModalType('editMun'); }} className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg" title="Editează Date"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => { setSelectedEntity(m); setModalType('blockMun'); }} className={`p-2 rounded-lg ${m.isBlocked ? "text-emerald-600 hover:bg-emerald-100" : "text-rose-600 hover:bg-rose-100"}`} title={m.isBlocked ? "Deblochează" : "Blochează Acces"}>{m.isBlocked ? <CheckCircle className="w-4 h-4"/> : <Ban className="w-4 h-4" />}</button>
                        <button onClick={() => { setSelectedEntity(m); setModalType('deleteEntity'); }} className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg" title="Șterge Entitate"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB FURNIZORI */}
      {activeTab === 'furnizori' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr,2fr] gap-6 items-start">
          <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm sticky top-6">
            <h3 className="font-bold text-xl flex items-center gap-3 border-b pb-4 mb-4"><Briefcase className="w-6 h-6 text-emerald-600"/> Adaugă Furnizor</h3>
            <button onClick={() => setModalType('addProv')} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-md"><Plus /> Deschide Formularul</button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr><th className="p-5 text-xs text-slate-500 uppercase">Companie</th><th className="p-5 text-xs text-slate-500 uppercase">CUI</th><th className="p-5 text-right text-xs text-slate-500 uppercase">Acțiuni</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminProviders.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-5 font-bold text-slate-900">{p.name}</td>
                    <td className="p-5 font-mono text-sm text-slate-500">{p.cui}</td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => { setSelectedEntity(p); setModalType('editProv'); }} className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => { setSelectedEntity(p); setModalType('deleteEntity'); }} className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODALE ================= */}
      
      {/* Vizualizare Cereri Specifice pentru Primărie */}
      <Modal isOpen={modalType === 'viewRequests'} onClose={() => setModalType(null)} title={`Cereri: ${selectedEntity?.name}`} size="xl">
         <div className="bg-slate-50 p-4 -mx-6 -my-2 min-h-[500px]">
           {selectedEntity && (
             <RequestList 
                requests={requests.filter(r => r.municipalityId === selectedEntity.id)} 
                emptyMessage="Această primărie nu are cereri înregistrate." 
                onUpdateStatus={(id, status) => updateRequest(id, { status })} 
             />
           )}
         </div>
      </Modal>

      {/* Blocare Primărie */}
      <Modal isOpen={modalType === 'blockMun'} onClose={() => setModalType(null)} size="sm">
         {selectedEntity && 'locality' in selectedEntity && (
           <FormBlockMunicipality entity={selectedEntity as Municipality} onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />
         )}
      </Modal>

      {/* Ștergere Entitate (Primărie/Furnizor) */}
      <Modal isOpen={modalType === 'deleteEntity'} onClose={() => setModalType(null)} size="sm">
         <FormDeleteEntity entity={selectedEntity} onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />
      </Modal>

      {/* Restul modalelor clasice */}
      <Modal isOpen={modalType === 'addMun'} onClose={() => setModalType(null)} title="Înregistrare Primărie" size="md">
        <FormAddMunicipality onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />
      </Modal>
      <Modal isOpen={modalType === 'addProv'} onClose={() => setModalType(null)} title="Înregistrare Furnizor" size="md">
        <FormAddProvider onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />
      </Modal>
      <Modal isOpen={modalType === 'editMun'} onClose={() => setModalType(null)} title="Editează Primărie" size="md">
        {selectedEntity && 'locality' in selectedEntity && <FormEditMunicipality entity={selectedEntity as Municipality} onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />}
      </Modal>
      <Modal isOpen={modalType === 'editProv'} onClose={() => setModalType(null)} title="Editează Furnizor" size="md">
        {selectedEntity && 'services' in selectedEntity && <FormEditProvider entity={selectedEntity as Provider} onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />}
      </Modal>
      <Modal isOpen={modalType === 'deleteUser'} onClose={() => setModalType(null)} size="sm">
        <FormDeleteUser user={selectedUser} onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />
      </Modal>
      <Modal isOpen={modalType === 'password'} onClose={() => setModalType(null)} title="Resetare Parolă Utilizator" size="sm">
        {selectedUser && <FormChangePassword user={selectedUser} onComplete={() => setModalType(null)} onCancel={() => setModalType(null)} />}
      </Modal>
      <Modal isOpen={modalType === 'editUser'} onClose={() => setModalType(null)} title="Editează Rol" size="sm">
        {selectedUser && <FormEditUser user={selectedUser} muns={municipalities} provs={adminProviders} onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />}
      </Modal>

    </div>
  );
}

// ============================================================================
// COMPONENTE FORMULARE IZOLATE TIPPED (TypeScript Fixat)
// ============================================================================

function FormBlockMunicipality({ entity, onComplete, onCancel }: { entity: Municipality, onComplete: () => void, onCancel: () => void }) {
  const [reason, setReason] = useState(entity.blockReason || "");
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useApp();
  const isBlocking = !entity.isBlocked; 

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocking && !reason) return notifyError("Trebuie să selectezi un motiv pentru blocare.");
    setLoading(true);
    try {
      const { error } = await supabase.from('municipalities').update({ 
        is_blocked: isBlocking, 
        block_reason: isBlocking ? reason : null 
      }).eq('id', entity.id);
      if (error) throw error;
      notifySuccess(isBlocking ? "Primăria a fost suspendată." : "Primăria a fost deblocată.");
      onComplete();
    } catch (err) { notifyError("Eroare la actualizarea statusului."); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="flex flex-col items-center text-center pt-2">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isBlocking ? 'bg-rose-100' : 'bg-emerald-100'}`}>
        {isBlocking ? <Ban className="w-8 h-8 text-rose-600" /> : <CheckCircle className="w-8 h-8 text-emerald-600" />}
      </div>
      <h3 className="text-2xl font-bold text-slate-950 mb-2">{isBlocking ? "Suspendare Acces" : "Deblocare Acces"}</h3>
      <p className="text-slate-600 mb-6 px-4">
        {isBlocking ? `Primăria ${entity.name} nu va mai putea crea cereri noi.` : `Primăria ${entity.name} va avea din nou acces complet la platformă.`}
      </p>

      {isBlocking && (
        <div className="w-full text-left mb-6 space-y-3">
          <Select label="Motivul Suspendării (Vizibil pentru primărie)" value={reason} onChange={e => setReason(e.target.value)} options={[
            { value: "", label: "Selectează un motiv..." },
            { value: "Activitate suspectă / Spam", label: "Activitate suspectă / Spam" },
            { value: "Informații de profil incomplete sau false", label: "Informații incomplete" },
            { value: "Neplata facturilor către platformă", label: "Neplata facturilor" },
            { value: "Încălcarea Termenilor și Condițiilor", label: "Încălcarea T&C" },
            { value: "Cerere de suspendare la cerere", label: "La cerere" }
          ]} />
        </div>
      )}

      <div className="flex gap-3 w-full">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Anulează</Button>
        <Button type="submit" variant={isBlocking ? "danger" : "primary"} className="flex-1" isLoading={loading}>{isBlocking ? "Confirmă Blocarea" : "Deblochează"}</Button>
      </div>
    </form>
  );
}

function FormDeleteEntity({ entity, onComplete, onCancel }: { entity: Municipality | Provider | null, onComplete: () => void, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useApp();

  const submit = async () => {
    if (!entity) return;
    setLoading(true);
    try {
      const table = 'locality' in entity ? 'municipalities' : 'providers';
      const { error } = await supabase.from(table).delete().eq('id', entity.id);
      if (error) throw error;
      notifySuccess("Entitatea a fost ștearsă definitiv!");
      onComplete();
    } catch (err: any) { notifyError("Eroare la ștergere. Asigurați-vă că nu există utilizatori blocați pe această entitate."); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center text-center pt-2">
      <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-5"><Trash2 className="w-8 h-8 text-rose-600" /></div>
      <h3 className="text-2xl font-bold text-slate-950 mb-2">Ștergere Instituție</h3>
      <p className="text-slate-600 mb-8 text-sm">Sigur vrei să ștergi <strong>{entity?.name}</strong>? Toate cererile asociate vor fi șterse automat!</p>
      <div className="flex gap-3 w-full"><Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Anulează</Button><Button type="button" variant="danger" className="flex-1" onClick={submit} isLoading={loading}>Șterge</Button></div>
    </div>
  );
}

function FormChangePassword({ user, onComplete, onCancel }: { user: AdminUserView, onComplete: () => void, onCancel: () => void }) {
  const [pass, setPass] = useState("");
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { e.preventDefault(); try { await adminService.changeUserPassword(user.id, pass); notifySuccess("Succes!"); onComplete(); } catch { notifyError("Eroare"); } };
  return <form onSubmit={submit} className="space-y-4 pt-2"><Input label="Parolă nouă" value={pass} onChange={e=>setPass(e.target.value)} required /><div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={onCancel}>Anulează</Button><Button type="submit" variant="primary">Salvează</Button></div></form>;
}

function FormDeleteUser({ user, onComplete, onCancel }: { user: AdminUserView | null, onComplete: () => void, onCancel: () => void }) {
  const { notifySuccess, notifyError } = useApp();
  const submit = async () => { if(!user) return; try { await adminService.deleteUser(user.id); notifySuccess("Șters"); onComplete(); } catch { notifyError("Eroare"); } };
  return <div className="text-center pt-2"><p className="mb-6">Ștergi utilizatorul <b>{user?.email}</b>?</p><div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={onCancel}>Anulează</Button><Button variant="danger" className="flex-1" onClick={submit}>Șterge</Button></div></div>;
}

function FormEditUser({ user, muns, provs, onComplete, onCancel }: { user: AdminUserView, muns: Municipality[], provs: Provider[], onComplete: () => void, onCancel: () => void }) {
  const [data, setData] = useState({ role: user.role || 'none', entityId: user.entityId || 'none' });
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { e.preventDefault(); try { await adminService.updateUserMapping(user.id, data.role as AppRole | null, data.entityId); notifySuccess("Salvat"); onComplete(); } catch { notifyError("Eroare"); } };
  return <form onSubmit={submit} className="space-y-4 pt-2"><Select label="Rol" value={data.role} onChange={e=>setData({role:e.target.value, entityId:'none'})} options={[{value:'none',label:'Fără'},{value:'admin',label:'Admin'},{value:'primarie',label:'Primărie'},{value:'furnizor',label:'Furnizor'}]} />{data.role!=='admin'&&data.role!=='none'&&<Select label="Instituție" value={data.entityId} onChange={e=>setData({...data,entityId:e.target.value})} options={[{value:'none',label:'Alege...'},...(data.role==='primarie'?muns:provs).map(x=>({value:x.id,label:x.name}))]} />}<div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={onCancel}>Anulează</Button><Button type="submit" variant="primary">Salvează</Button></div></form>;
}

function FormAddMunicipality({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const [d, setD] = useState({ name: '', cui: '', contact_person: '', email: '', phone: '', locality: '', password: '' });
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { e.preventDefault(); try { const newMun = await createMunicipality(d); await adminService.createUserAccountAndMap(d.email, d.password, 'primarie', newMun.id); notifySuccess("Creat"); onComplete(); } catch { notifyError("Eroare"); } };
  return <form onSubmit={submit} className="space-y-4"><Input label="Nume" value={d.name} onChange={e=>setD({...d,name:e.target.value})} required /><Input label="CUI" value={d.cui} onChange={e=>setD({...d,cui:e.target.value})} required /><Input label="Localitate" value={d.locality} onChange={e=>setD({...d,locality:e.target.value})} required /><Input label="Contact" value={d.contact_person} onChange={e=>setD({...d,contact_person:e.target.value})} required /><Input label="Telefon" value={d.phone} onChange={e=>setD({...d,phone:e.target.value})} required /><Input label="Email Cont" value={d.email} onChange={e=>setD({...d,email:e.target.value})} required /><Input label="Parolă" value={d.password} onChange={e=>setD({...d,password:e.target.value})} required /><div className="flex justify-end gap-2"><Button variant="ghost" onClick={onCancel}>Anulează</Button><Button type="submit" variant="primary">Crează</Button></div></form>;
}

function FormEditMunicipality({ entity, onComplete, onCancel }: { entity: Municipality, onComplete: () => void, onCancel: () => void }) {
  const [d, setD] = useState({ name: entity.name, cui: entity.cui, locality: entity.locality, person: entity.contactPerson.name, phone: entity.contactPerson.phone });
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { e.preventDefault(); try { await supabase.from('municipalities').update({ name: d.name, cui: d.cui, locality: d.locality, contact_person: d.person, phone: d.phone }).eq('id', entity.id); notifySuccess("Salvat"); onComplete(); } catch { notifyError("Eroare"); } };
  return <form onSubmit={submit} className="space-y-4"><Input label="Nume" value={d.name} onChange={e=>setD({...d,name:e.target.value})} required /><Input label="CUI" value={d.cui} onChange={e=>setD({...d,cui:e.target.value})} required /><Input label="Localitate" value={d.locality} onChange={e=>setD({...d,locality:e.target.value})} required /><Input label="Contact" value={d.person} onChange={e=>setD({...d,person:e.target.value})} required /><Input label="Telefon" value={d.phone} onChange={e=>setD({...d,phone:e.target.value})} required /><div className="flex justify-end gap-2"><Button variant="ghost" onClick={onCancel}>Anulează</Button><Button type="submit" variant="primary">Salvează</Button></div></form>;
}

function FormAddProvider({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const [d, setD] = useState({ name: '', cui: '', email: '', password: '' });
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { e.preventDefault(); try { const p = await createProvider(d.name, d.cui, d.email); await adminService.createUserAccountAndMap(d.email, d.password, 'furnizor', p.id); notifySuccess("Creat"); onComplete(); } catch { notifyError("Eroare"); } };
  return <form onSubmit={submit} className="space-y-4"><Input label="Nume" value={d.name} onChange={e=>setD({...d,name:e.target.value})} required /><Input label="CUI" value={d.cui} onChange={e=>setD({...d,cui:e.target.value})} required /><Input label="Email Cont" value={d.email} onChange={e=>setD({...d,email:e.target.value})} required /><Input label="Parolă" value={d.password} onChange={e=>setD({...d,password:e.target.value})} required /><div className="flex justify-end gap-2"><Button variant="ghost" onClick={onCancel}>Anulează</Button><Button type="submit" variant="primary">Crează</Button></div></form>;
}

function FormEditProvider({ entity, onComplete, onCancel }: { entity: Provider, onComplete: () => void, onCancel: () => void }) {
  const [d, setD] = useState({ name: entity.name, cui: entity.cui });
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { e.preventDefault(); try { await supabase.from('providers').update({ name: d.name, cui: d.cui }).eq('id', entity.id); notifySuccess("Salvat"); onComplete(); } catch { notifyError("Eroare"); } };
  return <form onSubmit={submit} className="space-y-4"><Input label="Nume" value={d.name} onChange={e=>setD({...d,name:e.target.value})} required /><Input label="CUI" value={d.cui} onChange={e=>setD({...d,cui:e.target.value})} required /><div className="flex justify-end gap-2"><Button variant="ghost" onClick={onCancel}>Anulează</Button><Button type="submit" variant="primary">Salvează</Button></div></form>;
}