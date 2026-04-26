import React, { useState, useEffect, useMemo } from "react";
import { 
  ShieldCheck, Users, Building, Briefcase, FileText, 
  Key, Eye, Trash2, AlertTriangle, Pencil, Plus, Ban, CheckCircle,
  TrendingUp, Clock, CheckSquare, XSquare
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Modal } from "@/components/common/Modal";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useApp } from "@/context/AppContext";
import { createProvider, fetchProviders } from "@/services/providerService";
import { fetchAllMunicipalities, createMunicipality } from "@/services/municipalityService";
import { adminService, AdminUserView } from "@/services/adminService";
import { RequestList } from "@/components/requests/RequestList";
import { Municipality, Provider, AppRole, RequestStatus } from "@/types";
import { TableSkeleton } from "@/components/common/Skeleton";
import { subDays, isSameDay } from "date-fns";

type TabType = 'cereri' | 'utilizatori' | 'primarii' | 'furnizori';
type ModalAction = 'detail' | 'editUser' | 'deleteUser' | 'password' | 'addMun' | 'editMun' | 'addProv' | 'editProv' | 'deleteEntity' | 'blockMun' | 'viewRequests' | null;

export function AdminDashboard() {
  const { filteredRequests, requests, stats, updateRequest, notifyError, notifySuccess } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('cereri');

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [adminProviders, setAdminProviders] = useState<Provider[]>([]);
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [isLoadingExtra, setIsLoadingExtra] = useState(false);

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

  const getTrendData = useMemo(() => (statusFilter?: RequestStatus) => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const count = requests.filter(r => {
        const matchesDate = isSameDay(new Date(r.createdAt), date);
        const matchesStatus = statusFilter ? r.status === statusFilter : true;
        return matchesDate && matchesStatus;
      }).length;
      return { val: count };
    });
  }, [requests]);

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
    <div className="space-y-6">
      
      {/* HEADER: Omogenizat cu restul aplicației */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panou Administrator</h1>
            <p className="text-slate-500 dark:text-slate-400">Control total asupra ecosistemului Centria</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total Cereri" value={stats.total} icon={TrendingUp} color="blue" chartData={getTrendData()} delay={0.1} />
        <StatsCard title="În Așteptare" value={stats.pending} icon={Clock} color="yellow" chartData={getTrendData('pending')} delay={0.2} />
        <StatsCard title="Acceptate" value={stats.accepted} icon={CheckSquare} color="green" chartData={getTrendData('accepted')} delay={0.3} />
        <StatsCard title="Respinse" value={stats.rejected} icon={XSquare} color="red" chartData={getTrendData('rejected')} delay={0.4} />
      </div>

      {/* TABS CONTAINER: Design curat și omogenizat */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as TabType)} 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id 
                ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'cereri' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RequestList 
              requests={filteredRequests} 
              emptyMessage="Sistemul nu a procesat încă nicio cerere." 
              onUpdateStatus={(id, status) => updateRequest(id, { status })} 
            />
          </div>
        )}

        {activeTab === 'utilizatori' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
            {isLoadingExtra ? (
              <TableSkeleton columns={4} rows={8} />
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Utilizator</th>
                    <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rol</th>
                    <th className="p-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Entitate</th>
                    <th className="p-5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map(u => (
                    <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-5">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{u.email}</span>
                      </td>
                      <td className="p-5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {u.role || "Niciunul"}
                        </span>
                      </td>
                      <td className="p-5 text-slate-700 dark:text-slate-400 font-medium">{getEntityName(u.role, u.entityId)}</td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setSelectedUser(u); setModalType('editUser'); }} className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => { setSelectedUser(u); setModalType('password'); }} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"><Key className="w-4 h-4" /></button>
                          <button onClick={() => { setSelectedUser(u); setModalType('deleteUser'); }} className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {(activeTab === 'primarii' || activeTab === 'furnizori') && (
          <div className="grid grid-cols-1 xl:grid-cols-[350px,1fr] gap-8 items-start animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl sticky top-24">
              <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center shadow-lg ${activeTab === 'primarii' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                {activeTab === 'primarii' ? <Building className="w-8 h-8" /> : <Briefcase className="w-8 h-8" />}
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Înregistrare</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Adaugă o nouă instituție parteneră în sistem.</p>
              <Button 
                onClick={() => setModalType(activeTab === 'primarii' ? 'addMun' : 'addProv')} 
                className="w-full py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
                variant={activeTab === 'primarii' ? 'primary' : 'success'}
              >
                <Plus className="w-5 h-5 mr-2" /> Completează Formular
              </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              {isLoadingExtra ? (
                <TableSkeleton columns={4} rows={6} />
              ) : ( activeTab === 'primarii' ? (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Primărie</th>
                      <th className="p-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Contact</th>
                      <th className="p-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-center">Status</th>
                      <th className="p-6 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {municipalities.map(m => (
                      <tr key={m.id} className={`${m.isBlocked ? 'bg-rose-50/30 dark:bg-rose-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}>
                        <td className="p-6">
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-lg">{m.name}</div>
                          {/* Am eliminat ID-ul din interfață */}
                          <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">CUI: {m.cui}</div>
                        </td>
                        <td className="p-6">
                          <div className="text-sm font-bold dark:text-slate-300">{m.contactPerson.name}</div>
                          <div className="text-xs text-slate-500">{m.contactPerson.phone}</div>
                        </td>
                        <td className="p-6 text-center">
                          {m.isBlocked 
                            ? <span className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter italic">Suspendat</span> 
                            : <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Activ</span>
                          }
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => { setSelectedEntity(m); setModalType('viewRequests'); }} className="p-2.5 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 hover:bg-sky-100 rounded-xl" title="Vezi cereri"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => { setSelectedEntity(m); setModalType('editMun'); }} className="p-2.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => { setSelectedEntity(m); setModalType('blockMun'); }} className={`p-2.5 rounded-xl ${m.isBlocked ? 'text-emerald-600 hover:bg-emerald-50' : 'text-rose-600 hover:bg-rose-50'}`}>{m.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}</button>
                            <button onClick={() => { setSelectedEntity(m); setModalType('deleteEntity'); }} className="p-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Companie Furnizoare</th>
                      <th className="p-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Cod Identificare</th>
                      <th className="p-6 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {adminProviders.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-6 font-bold text-slate-900 dark:text-slate-100 text-lg">{p.name}</td>
                        <td className="p-6 font-mono text-sm text-slate-400 dark:text-slate-500">CUI: {p.cui}</td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setSelectedEntity(p); setModalType('editProv'); }} className="p-2.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => { setSelectedEntity(p); setModalType('deleteEntity'); }} className="p-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODALE (Fundalul din spatele lor e deja tratat de componenta Modal) ================= */}
      
      <Modal isOpen={modalType === 'viewRequests'} onClose={() => setModalType(null)} title={`Arhivă Cereri: ${selectedEntity?.name}`} size="xl">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 -mx-6 -my-2 min-h-[600px] rounded-b-xl transition-colors duration-300">
            {selectedEntity && (
              <RequestList 
                requests={requests.filter(r => r.municipalityId === selectedEntity.id)} 
                onUpdateStatus={(id, status) => updateRequest(id, { status })} 
              />
            )}
          </div>
      </Modal>

      <Modal isOpen={modalType === 'blockMun'} onClose={() => setModalType(null)} size="sm">
         {selectedEntity && 'locality' in selectedEntity && (
           <FormBlockMunicipality entity={selectedEntity as Municipality} onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />
         )}
      </Modal>
      <Modal isOpen={modalType === 'deleteEntity'} onClose={() => setModalType(null)} size="sm">
         <FormDeleteEntity entity={selectedEntity} onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />
      </Modal>
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
      <Modal isOpen={modalType === 'password'} onClose={() => setModalType(null)} title="Resetare Parolă" size="sm">
        {selectedUser && <FormChangePassword user={selectedUser} onComplete={() => setModalType(null)} onCancel={() => setModalType(null)} />}
      </Modal>
      <Modal isOpen={modalType === 'editUser'} onClose={() => setModalType(null)} title="Editare Rol Utilizator" size="sm">
        {selectedUser && <FormEditUser user={selectedUser} muns={municipalities} provs={adminProviders} onComplete={() => { setModalType(null); loadAdminData(); }} onCancel={() => setModalType(null)} />}
      </Modal>
    </div>
  );
}

// ============================================================================
// COMPONENTE FORMULARE IZOLATE
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
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isBlocking ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
        {isBlocking ? <Ban className="w-8 h-8 text-rose-600 dark:text-rose-400" /> : <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
      </div>
      <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">{isBlocking ? "Suspendare Acces" : "Deblocare Acces"}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 px-4">
        {isBlocking ? `Primăria ${entity.name} nu va mai putea crea cereri noi.` : `Primăria ${entity.name} va avea din nou acces complet la platformă.`}
      </p>

      {isBlocking && (
        <div className="w-full text-left mb-6 space-y-3">
          <Select label="Motivul Suspendării" value={reason} onChange={e => setReason(e.target.value)} options={[
            { value: "", label: "Selectează un motiv..." },
            { value: "Activitate suspectă / Spam", label: "Activitate suspectă / Spam" },
            { value: "Informații incomplete", label: "Informații incomplete" },
            { value: "Neplata facturilor", label: "Neplata facturilor" },
            { value: "Încălcarea T&C", label: "Încălcarea T&C" },
            { value: "La cerere", label: "La cerere" }
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
      await supabase.from('user_profiles').update({ entity_id: null }).eq('entity_id', entity.id);
      const table = 'locality' in entity ? 'municipalities' : 'providers';
      const { error } = await supabase.from(table).delete().eq('id', entity.id);
      if (error) throw error;
      notifySuccess("Entitatea a fost ștearsă definitiv!");
      onComplete();
    } catch (err: any) { 
      notifyError(err.message || "Eroare la ștergere."); 
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center text-center pt-2">
      <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-5">
        <Trash2 className="w-8 h-8 text-rose-600 dark:text-rose-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">Ștergere Definitivă</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm px-2">
        Sigur vrei să ștergi <strong>{entity?.name}</strong>? Conturile utilizatorilor vor fi detașate, iar cererile vor fi eliminate!
      </p>
      <div className="flex gap-3 w-full">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Anulează</Button>
        <Button type="button" variant="danger" className="flex-1" onClick={submit} isLoading={loading}>Confirmă Ștergerea</Button>
      </div>
    </div>
  );
}

function FormChangePassword({ user, onComplete, onCancel }: { user: AdminUserView, onComplete: () => void, onCancel: () => void }) {
  const [pass, setPass] = useState("");
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      await adminService.changeUserPassword(user.id, pass); 
      notifySuccess("Parolă resetată cu succes!"); 
      onComplete(); 
    } catch { notifyError("Eroare la resetare."); } 
  };
  return (
    <form onSubmit={submit} className="space-y-4 pt-2">
      <Input label="Parolă nouă" type="password" value={pass} onChange={e=>setPass(e.target.value)} required />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Anulează</Button>
        <Button type="submit" variant="primary">Salvează</Button>
      </div>
    </form>
  );
}

function FormDeleteUser({ user, onComplete, onCancel }: { user: AdminUserView | null, onComplete: () => void, onCancel: () => void }) {
  const { notifySuccess, notifyError } = useApp();
  const submit = async () => { 
    if(!user) return; 
    try { 
      await adminService.deleteUser(user.id); 
      notifySuccess("Utilizator eliminat."); 
      onComplete(); 
    } catch { notifyError("Eroare la ștergere."); } 
  };
  return (
    <div className="text-center pt-2">
      <p className="mb-6 dark:text-slate-300">Sigur dorești să elimini complet accesul pentru <b>{user?.email}</b>?</p>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Anulează</Button>
        <Button variant="danger" className="flex-1" onClick={submit}>Șterge Cont</Button>
      </div>
    </div>
  );
}

function FormEditUser({ user, muns, provs, onComplete, onCancel }: { user: AdminUserView, muns: Municipality[], provs: Provider[], onComplete: () => void, onCancel: () => void }) {
  const [data, setData] = useState({ role: user.role || 'none', entityId: user.entityId || 'none' });
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      await adminService.updateUserMapping(user.id, data.role as AppRole | null, data.entityId); 
      notifySuccess("Rol actualizat!"); 
      onComplete(); 
    } catch { notifyError("Eroare la salvare."); } 
  };
  return (
    <form onSubmit={submit} className="space-y-4 pt-2">
      <Select label="Rol" value={data.role} onChange={e=>setData({role:e.target.value, entityId:'none'})} options={[{value:'none',label:'Fără Role'},{value:'admin',label:'Administrator'},{value:'primarie',label:'Primărie'},{value:'furnizor',label:'Furnizor'}]} />
      {data.role!=='admin'&&data.role!=='none'&&(
        <Select label="Instituție Asociată" value={data.entityId} onChange={e=>setData({...data,entityId:e.target.value})} options={[{value:'none',label:'Alege...'},...(data.role==='primarie'?muns:provs).map(x=>({value:x.id,label:x.name}))]} />
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Anulează</Button>
        <Button type="submit" variant="primary">Salvează</Button>
      </div>
    </form>
  );
}

function FormAddMunicipality({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const [d, setD] = useState({ name: '', cui: '', contact_person: '', email: '', phone: '', locality: '', password: '' });
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const { password, ...dbPayload } = d; 
    const newMun = await createMunicipality(dbPayload); 
    await adminService.createUserAccountAndMap(d.email, d.password, 'primarie', newMun.id);
    notifySuccess("Creat");
    onComplete();
  } catch (err) { 
    notifyError("Eroare la creare. Verificați dacă datele sunt corecte."); 
  }
};
  return (
    <form onSubmit={submit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <Input label="Nume Primărie" value={d.name} onChange={e=>setD({...d,name:e.target.value})} required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="CUI" value={d.cui} onChange={e=>setD({...d,cui:e.target.value})} required />
        <Input label="Localitate" value={d.locality} onChange={e=>setD({...d,locality:e.target.value})} required />
      </div>
      <Input label="Persoană Contact" value={d.contact_person} onChange={e=>setD({...d,contact_person:e.target.value})} required />
      <Input label="Telefon" value={d.phone} onChange={e=>setD({...d,phone:e.target.value})} required />
      <hr className="dark:border-slate-800" />
      <Input label="Email Login" type="email" value={d.email} onChange={e=>setD({...d,email:e.target.value})} required />
      <Input label="Parolă Cont" type="password" value={d.password} onChange={e=>setD({...d,password:e.target.value})} required />
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={onCancel}>Anulează</Button>
        <Button type="submit" variant="primary">Crează Entitate</Button>
      </div>
    </form>
  );
}

function FormEditMunicipality({ entity, onComplete, onCancel }: { entity: Municipality, onComplete: () => void, onCancel: () => void }) {
  const [d, setD] = useState({ name: entity.name, cui: entity.cui, locality: entity.locality, person: entity.contactPerson.name, phone: entity.contactPerson.phone });
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      await supabase.from('municipalities').update({ name: d.name, cui: d.cui, locality: d.locality, contact_person: d.person, phone: d.phone }).eq('id', entity.id); 
      notifySuccess("Modificări salvate!"); 
      onComplete(); 
    } catch { notifyError("Eroare la actualizare."); } 
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Nume" value={d.name} onChange={e=>setD({...d,name:e.target.value})} required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="CUI" value={d.cui} onChange={e=>setD({...d,cui:e.target.value})} required />
        <Input label="Localitate" value={d.locality} onChange={e=>setD({...d,locality:e.target.value})} required />
      </div>
      <Input label="Contact" value={d.person} onChange={e=>setD({...d,person:e.target.value})} required />
      <Input label="Telefon" value={d.phone} onChange={e=>setD({...d,phone:e.target.value})} required />
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={onCancel}>Anulează</Button>
        <Button type="submit" variant="primary">Salvează</Button>
      </div>
    </form>
  );
}

function FormAddProvider({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const [d, setD] = useState({ name: '', cui: '', email: '', password: '' });
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      const p = await createProvider(d.name, d.cui, d.email); 
      await adminService.createUserAccountAndMap(d.email, d.password, 'furnizor', p.id); 
      notifySuccess("Furnizor creat cu succes!"); 
      onComplete(); 
    } catch { notifyError("Eroare la creare."); } 
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Nume Companie" value={d.name} onChange={e=>setD({...d,name:e.target.value})} required />
      <Input label="CUI" value={d.cui} onChange={e=>setD({...d,cui:e.target.value})} required />
      <hr className="dark:border-slate-800" />
      <Input label="Email Login" type="email" value={d.email} onChange={e=>setD({...d,email:e.target.value})} required />
      <Input label="Parolă Cont" type="password" value={d.password} onChange={e=>setD({...d,password:e.target.value})} required />
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={onCancel}>Anulează</Button>
        <Button type="submit" variant="primary">Crează Furnizor</Button>
      </div>
    </form>
  );
}

function FormEditProvider({ entity, onComplete, onCancel }: { entity: Provider, onComplete: () => void, onCancel: () => void }) {
  const [d, setD] = useState({ name: entity.name, cui: entity.cui });
  const { notifySuccess, notifyError } = useApp();
  const submit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      await supabase.from('providers').update({ name: d.name, cui: d.cui }).eq('id', entity.id); 
      notifySuccess("Salvat!"); 
      onComplete(); 
    } catch { notifyError("Eroare."); } 
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Nume Companie" value={d.name} onChange={e=>setD({...d,name:e.target.value})} required />
      <Input label="CUI" value={d.cui} onChange={e=>setD({...d,cui:e.target.value})} required />
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={onCancel}>Anulează</Button>
        <Button type="submit" variant="primary">Salvează</Button>
      </div>
    </form>
  );
}