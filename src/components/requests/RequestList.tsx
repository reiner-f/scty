import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { FileQuestion } from "lucide-react";
import { RequestCard } from "../dashboard/RequestCard";
import { RequestDetailModal } from "./RequestDetailModal";
import { EditRequestModal } from "./EditRequestModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Request, RequestStatus } from "@/types";
import { useApp } from "@/context/AppContext";
import { RequestCardSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";

interface RequestListProps {
  requests: Request[];
  title?: string;
  emptyMessage?: string;
  onUpdateStatus?: (id: string, status: RequestStatus) => void;
}

export function RequestList({ requests, title, emptyMessage, onUpdateStatus }: RequestListProps) {
  const { updateRequest, deleteRequest, isLoadingRequests } = useApp();
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
      {/* Ascundem numărul de cereri cât timp se încarcă */}
      {title && (
        <h2 className="text-xl font-bold text-slate-800">
          {title} {!isLoadingRequests && requests.length > 0 && `(${requests.length})`}
        </h2>
      )}
      
      {isLoadingRequests ? (
        <div className="flex flex-col gap-3">
          {/* 1. Starea de Încărcare (Skeleton Loaders) */}
          <RequestCardSkeleton />
          <RequestCardSkeleton />
          <RequestCardSkeleton />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
          {/* 2. Starea Goală (Empty State Premium) */}
          <EmptyState 
            icon={FileQuestion}
            title="Nicio cerere găsită"
            description={emptyMessage || "Nu există nicio cerere înregistrată care să corespundă criteriilor curente."}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* 3. Starea cu Date (Lista animată) */}
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

      {/* Modale */}
      <RequestDetailModal 
        isOpen={modalState.type === 'detail'} 
        request={selectedRequest} 
        onClose={closeModals}
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