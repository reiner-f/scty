import React from "react";
import { Link } from "react-router-dom";
import { Plus, LayoutDashboard, Loader2, AlertOctagon } from "lucide-react";
import { RequestList } from "@/components/requests/RequestList";
import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";

export function PrimarieDashboard() {
  const { filteredRequests, filters, setFilter, isLoadingRequests, municipality } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center shadow-sm">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Panou Primărie</h1>
            <p className="text-slate-500">Gestionează cererile tale către furnizori</p>
          </div>
        </div>
        
        {/* Buton ascuns dacă primăria e blocată */}
        {!municipality.isBlocked && (
          <Link to="/create-request">
            <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>Cerere Nouă</Button>
          </Link>
        )}
      </div>

      {/* BANNER ROȘU PENTRU BLOCARE */}
      {municipality.isBlocked && (
        <div className="bg-rose-50 border-2 border-rose-200 p-6 rounded-2xl flex items-start gap-4">
          <div className="bg-rose-100 p-3 rounded-full shrink-0 mt-1">
            <AlertOctagon className="w-7 h-7 text-rose-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-rose-900 mb-1">Acces Restricționat</h3>
            <p className="text-rose-700 font-medium mb-3">
              Contul acestei instituții a fost suspendat de către un administrator. Puteți vizualiza istoricul, dar nu mai aveți dreptul să plasați cereri noi.
            </p>
            <div className="bg-white/60 px-4 py-2.5 rounded-lg border border-rose-100 text-rose-800 text-sm inline-block">
              <span className="font-bold uppercase tracking-wider text-xs mr-2 text-rose-500">Motivul Suspendării:</span> 
              <span className="font-medium">{municipality.blockReason || "Nespecificat"}</span>
            </div>
            <p className="text-sm text-rose-500 mt-3 font-medium">Pentru contestații, vă rugăm să contactați suportul tehnic Centria.</p>
          </div>
        </div>
      )}

      <SearchBar value={filters.searchQuery || ""} onChange={(v) => setFilter("searchQuery", v)} placeholder="Caută în cererile tale..." />

      {isLoadingRequests ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>
      ) : (
        <RequestList requests={filteredRequests} title="Cererile Mele" />
      )}
    </div>
  );
}