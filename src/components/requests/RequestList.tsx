import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Inbox } from "lucide-react";
import { RequestCard } from "../dashboard/RequestCard";
import { RequestDetailModal } from "./RequestDetailModal";
import { EditRequestModal } from "./EditRequestModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Request, RequestStatus } from "@/types";
import { useApp } from "@/context/AppContext";

interface RequestListProps {
  requests: Request[];
  title?: string;
  emptyMessage?: string;
  onUpdateStatus?: (id: string, status: RequestStatus) => void;
}

export function RequestList({
  requests,
  title,
  emptyMessage = "Nu există cereri",
  onUpdateStatus,
}: RequestListProps) {
  const { updateRequest, deleteRequest, notifySuccess, notifyError } = useApp();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCardClick = (request: Request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  const handleEditClick = (request: Request) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (request: Request) => {
    setSelectedRequest(request);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async (id: string, updates: Partial<Request>) => {
    await updateRequest(id, updates);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteRequest(id);
      notifySuccess("Cererea a fost ștearsă cu succes!");
    } catch {
      notifyError("A apărut o eroare la ștergerea cererii");
      throw new Error("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-semibold text-primary-900">{title}</h2>
          <span className="px-2.5 py-0.5 bg-primary-100 text-primary-600 text-lg font-medium rounded-md">
            {requests.length}
          </span>
        </div>
      )}

      <div className="bg-white rounded-md border border-primary-100 overflow-hidden shadow-sm">
        <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-primary-50/70 border-b border-primary-100 text-lg font-medium text-primary-500">
          <div className="col-span-3">Cerere</div>
          <div className="col-span-2">Furnizor</div>
          <div className="col-span-2">Serviciu</div>
          <div className="col-span-2">Data</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1"></div>
        </div>

        <AnimatePresence>
          {requests.length > 0 ? (
            <div className="divide-y divide-primary-50">
              {requests.map((request, index) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  index={index}
                  onClick={() => handleCardClick(request)}
                  onStatusChange={onUpdateStatus}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-primary-300" />
              </div>
              <p className="text-lg text-primary-400">{emptyMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RequestDetailModal
        request={selectedRequest}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onUpdateStatus={onUpdateStatus}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <EditRequestModal
        request={selectedRequest}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRequest(null);
        }}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmModal
        request={selectedRequest}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
