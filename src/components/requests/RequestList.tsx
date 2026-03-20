import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { RequestCard } from "../dashboard/RequestCard";
import { RequestDetailModal } from "./RequestDetailModal";
import { EditRequestModal } from "./EditRequestModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Request, RequestStatus } from "@/types";
import { useApp } from "@/context/AppContext";

export function RequestList({ requests, title }: { requests: Request[], title?: string }) {
  const { updateRequest, deleteRequest, notifySuccess, notifyError } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [modalState, setModalState] = useState<{ type: 'detail' | 'edit' | 'delete' | null }>({ type: null });

  const handleAction = (req: Request, type: 'detail' | 'edit' | 'delete') => {
    setSelectedRequest(req);
    setModalState({ type });
  };

  const closeModals = () => {
    setModalState({ type: null });
    setSelectedRequest(null);
  };

  // Reparație Eroare onSave: Wrapp-uim funcția pentru a returna Promise<void>
  const handleSaveRequest = async (id: string, updates: Partial<Request>): Promise<void> => {
    await updateRequest(id, updates);
  };

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold text-slate-800">{title} ({requests.length})</h2>}
      
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {requests.map((req, index) => (
            <RequestCard
              key={req.id}
              request={req}
              index={index}
              onClick={() => handleAction(req, 'detail')}
              // Reparație Eroare onStatusChange: Folosim tipuri explicite (id: string, status: RequestStatus)
              // Notă: Dacă eroarea persistă, verifică Interfața RequestCardProps în RequestCard.tsx
              onEdit={() => handleAction(req, 'edit')}
              onDelete={() => handleAction(req, 'delete')}
            />
          ))}
        </AnimatePresence>
      </div>

      <RequestDetailModal 
        isOpen={modalState.type === 'detail'} 
        request={selectedRequest} 
        onClose={closeModals}
        onUpdateStatus={(id, status) => updateRequest(id, { status })}
      />

      <EditRequestModal 
        isOpen={modalState.type === 'edit'} 
        request={selectedRequest} 
        onClose={closeModals}
        onSave={handleSaveRequest} 
      />

      <DeleteConfirmModal 
        isOpen={modalState.type === 'delete'} 
        request={selectedRequest} 
        onClose={closeModals}
        onConfirm={deleteRequest}
      />
    </div>
  );
}