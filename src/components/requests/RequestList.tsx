import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { RequestCard } from "../dashboard/RequestCard";
import { RequestDetailModal } from "./RequestDetailModal";
import { EditRequestModal } from "./EditRequestModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Request, RequestStatus } from "@/types";
import { useApp } from "@/context/AppContext";

// 1. Am definit clar ce "Props" poate primi această componentă
interface RequestListProps {
  requests: Request[];
  title?: string;
  emptyMessage?: string;
  onUpdateStatus?: (id: string, status: RequestStatus) => void;
}

export function RequestList({ requests, title, emptyMessage, onUpdateStatus }: RequestListProps) {
  const { updateRequest, deleteRequest } = useApp();
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

  const handleSaveRequest = async (id: string, updates: Partial<Request>): Promise<void> => {
    await updateRequest(id, updates);
  };

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold text-slate-800">{title} ({requests.length})</h2>}
      
      {/* 2. Tratăm cazul în care lista este goală */}
      {requests.length === 0 && emptyMessage ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {requests.map((req, index) => (
              <RequestCard
                key={req.id}
                request={req}
                index={index}
                onClick={() => handleAction(req, 'detail')}
                onEdit={() => handleAction(req, 'edit')}
                onDelete={() => handleAction(req, 'delete')}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <RequestDetailModal 
        isOpen={modalState.type === 'detail'} 
        request={selectedRequest} 
        onClose={closeModals}
        // 3. Pasăm onUpdateStatus mai departe către modal
        onUpdateStatus={onUpdateStatus}
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