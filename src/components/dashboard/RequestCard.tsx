import React from "react";
import { motion } from "motion/react";
import { 
  Calendar, 
  Building, 
  Briefcase, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Edit2, 
  Trash2 
} from "lucide-react";
import { Request, RequestStatus } from "@/types";
import { Badge } from "../common/Badge";
import { formatDate, classNames } from "@/utils/helpers";

interface RequestCardProps {
  request: Request;
  index?: number;
  onClick?: () => void;
  onStatusChange?: (id: string, status: RequestStatus) => void;
  // Am adăugat noile props pentru Editare și Ștergere directă
  onEdit?: (request: Request) => void;
  onDelete?: (request: Request) => void;
}

export function RequestCard({ 
  request, 
  index = 0, 
  onClick, 
  onStatusChange,
  onEdit,
  onDelete
}: RequestCardProps) {
  
  const statusBorderColors: Record<RequestStatus, string> = {
    accepted: "border-l-emerald-400",
    rejected: "border-l-rose-400",
    pending: "border-l-amber-400",
  };

  const handleStatusClick = (e: React.MouseEvent, status: RequestStatus) => {
    e.stopPropagation();
    if (onStatusChange) onStatusChange(request.id, status);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(request);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(request);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onClick}
      className={classNames(
        "group relative bg-white hover:bg-slate-50 border-l-4 rounded-r-lg border-y border-r border-slate-200 shadow-sm hover:shadow transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        statusBorderColors[request.status]
      )}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
        
        {/* Secțiunea de Titlu & Descriere */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary-700 transition-colors truncate">
            {request.title}
          </h3>
          <p className="text-sm text-slate-500 truncate mt-0.5">
            {request.description}
          </p>
        </div>

        {/* Secțiunea de Metadate */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 text-sm text-slate-600 sm:w-auto">
          <div className="flex items-center gap-1.5 w-full sm:w-[140px] lg:w-[160px]">
            <Building className="w-4 h-4 flex-shrink-0 text-slate-400" />
            <span className="truncate">{request.providerName}</span>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-[140px] lg:w-[160px]">
            <Briefcase className="w-4 h-4 flex-shrink-0 text-slate-400" />
            <span className="truncate">{request.serviceName}</span>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-[120px] lg:w-[140px] text-slate-500">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(request.createdAt)}</span>
          </div>
        </div>

        {/* Secțiunea de Status & Acțiuni Rapide */}
        <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 sm:min-w-[220px] shrink-0">
          <Badge status={request.status} size="sm" />

          <div className="flex items-center gap-1">
            
            {/* Butoane pentru Status */}
            {onStatusChange && (
              <div className="flex sm:hidden group-hover:flex items-center gap-1">
                {request.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleStatusClick(e, "accepted")}
                      className="p-1.5 rounded-md text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                      title="Acceptă cererea"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleStatusClick(e, "rejected")}
                      className="p-1.5 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                      title="Respinge cererea"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleStatusClick(e, "pending")}
                    className="p-1.5 rounded-md text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                    title="Resetează la pending"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Divizor vizual între status și acțiunile CRUD (dacă ambele există) */}
            {(onStatusChange && (onEdit || onDelete)) && (
              <div className="hidden sm:block group-hover:block w-px h-4 bg-slate-200 mx-1" />
            )}

            {/* Butoane pentru Modificare & Ștergere (Quick Actions) */}
            {(onEdit || onDelete) && (
              <div className="flex sm:hidden group-hover:flex items-center gap-1 mr-1">
                {onEdit && (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="p-1.5 rounded-md text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                    title="Editează cererea"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="p-1.5 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                    title="Șterge cererea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-transform ml-1" />
          </div>
        </div>

      </div>
    </motion.div>
  );
}