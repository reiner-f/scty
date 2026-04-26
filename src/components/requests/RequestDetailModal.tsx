import React from "react";
import {
  Calendar, Building, Briefcase, User, Mail, Phone,
  MapPin, Hash, Clock, Edit, Trash2, CheckCircle,
  XCircle, RotateCcw,
} from "lucide-react";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { Request, RequestStatus } from "@/types";
import { formatDateTime, formatDate } from "@/utils/helpers";

interface RequestDetailModalProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: RequestStatus) => void;
  onEdit?: (request: Request) => void;
  onDelete?: (request: Request) => void;
}

export function RequestDetailModal({
  request,
  isOpen,
  onClose,
  onUpdateStatus,
  onEdit,
  onDelete,
}: RequestDetailModalProps) {
  if (!request) return null;

  // REPARAT: Acum folosim "request.provider?.name" pentru că datele vin din JOIN-ul Supabase
  const detailFields = [
    { icon: Building, label: "Furnizor", value: request.provider?.name || "Necunoscut" },
    { icon: Hash, label: "CUI Furnizor", value: request.provider?.cui || "-" },
    { icon: Briefcase, label: "Serviciu", value: request.service?.name || "Necunoscut" },
    { icon: Calendar, label: "Data Creării", value: formatDateTime(request.createdAt) },
    { icon: Clock, label: "Ultima Actualizare", value: formatDateTime(request.updatedAt) },
    { icon: User, label: "Persoană Contact", value: request.contactPerson.name },
    { icon: Mail, label: "Email Contact", value: request.contactPerson.email },
    { icon: Phone, label: "Telefon Contact", value: request.contactPerson.phone },
    { icon: MapPin, label: "Localitate", value: request.locality },
  ];

  if (request.estimatedStartDate) {
    detailFields.push({
      icon: Calendar,
      label: "Data Estimată Început",
      value: formatDate(request.estimatedStartDate),
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalii Cerere" size="lg">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-primary-900">{request.title}</h3>
            <p className="text-lg text-primary-500 mt-1">{request.description}</p>
          </div>
          <Badge status={request.status} size="lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {detailFields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-md bg-primary-50/70 border border-primary-100/50"
              >
                <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-primary-100/50">
                  <Icon className="w-5 h-5 text-primary-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg text-primary-400">{field.label}</p>
                  <p className="text-lg font-medium text-primary-900 truncate">{field.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {onUpdateStatus && (
          <div className="p-4 rounded-md bg-primary-50/50 border border-primary-100/50">
            <p className="text-lg font-medium text-primary-700 mb-3">Schimbă Status</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  onUpdateStatus(request.id, "accepted");
                  onClose();
                }}
                disabled={request.status === "accepted"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-lg font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Acceptă
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(request.id, "rejected");
                  onClose();
                }}
                disabled={request.status === "rejected"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-lg font-medium bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Respinge
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(request.id, "pending");
                  onClose();
                }}
                disabled={request.status === "pending"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-lg font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Pending
              </button>
            </div>
          </div>
        )}

        {/* ⚠️ REPARAT: Blocăm editarea/ștergerea dacă cererea nu mai este în așteptare */}
        {request.status === "pending" && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-primary-100">
            {onEdit && (
              <Button
                variant="outline"
                leftIcon={<Edit className="w-4 h-4" />}
                onClick={() => {
                  onEdit(request);
                  onClose();
                }}
              >
                Editează
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => {
                  onDelete(request);
                  onClose();
                }}
              >
                Șterge
              </Button>
            )}
          </div>
        )}

      </div>
    </Modal>
  );
}