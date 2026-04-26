import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Request } from "@/types";

interface DeleteConfirmModalProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
  // It's good practice to ensure onConfirm returns a Promise so the modal can await it
  onConfirm: (id: string) => Promise<void>; 
}

export function DeleteConfirmModal({ request, isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!request) return;
    setIsDeleting(true);
    
    try {
      await onConfirm(request.id);
      // Only close the modal if the deletion was successful
      onClose();
    } catch (error) {
      console.error("Failed to delete request:", error);
      // In a real app, you would ideally trigger a toast notification here
      // e.g., addNotification("Eroare la ștergere", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // We return null early, but keep the Modal structure intact so Framer Motion 
  // (inside the Modal component) can handle the exit animation properly if needed.
  if (!request) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="sm"
      // We explicitly DO NOT pass a `title` prop here so the Modal doesn't render 
      // its default header with the close (X) button. Alert dialogs usually look 
      // better when the focus is entirely on the centered content and action buttons.
    >
      <div className="flex flex-col items-center text-center pt-4">
        
        {/* Warning Icon Container */}
        <div className="w-14 h-14 rounded-full bg-red-100/80 flex items-center justify-center mb-5 ring-4 ring-red-50">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Ștergeți cererea?
        </h3>
        
        {/* Description */}
        <p className="text-sm text-slate-500 mb-8 max-w-[280px]">
          Sunteți sigur că doriți să ștergeți cererea <span className="font-semibold text-slate-700">"{request.title}"</span>? Această acțiune este ireversibilă.
        </p>

        {/* Action Buttons (Using the custom Button component's built-in features) */}
        <div className="flex gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isDeleting}
          >
            Anulează
          </Button>
          
          <Button
            type="button"
            variant="danger"
            className="flex-1"
            onClick={handleDelete}
            // Use the built-in isLoading prop we created earlier!
            isLoading={isDeleting} 
          >
            {isDeleting ? "Se șterge..." : "Șterge"}
          </Button>
        </div>
        
      </div>
    </Modal>
  );
}