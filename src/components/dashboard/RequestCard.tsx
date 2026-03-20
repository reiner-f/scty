import React from "react";
import { motion } from "motion/react";
import { Building, Calendar, Edit2, Trash2, ChevronRight } from "lucide-react";
import { Request, RequestStatus } from "@/types";
import { Badge } from "../common/Badge";
import { formatDate, classNames } from "@/utils/helpers";

interface RequestCardProps {
  request: Request;
  index?: number;
  onClick?: () => void;
  onEdit?: (request: Request) => void;
  onDelete?: (request: Request) => void;
  // ADAUGAT: Această linie repară eroarea din RequestList
  onStatusChange?: (id: string, status: RequestStatus) => void;
}

export function RequestCard({ 
  request, 
  index = 0, 
  onClick, 
  onEdit, 
  onDelete,
  onStatusChange // ADAUGAT
}: RequestCardProps) {
  
  const statusBorder = {
    accepted: "border-l-emerald-400",
    rejected: "border-l-rose-400",
    pending: "border-l-amber-400",
  }[request.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className={classNames(
        "group bg-white hover:bg-slate-50 border-l-4 border-y border-r border-slate-200 rounded-r-xl p-4 flex items-center gap-4 cursor-pointer transition-all",
        statusBorder
      )}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 truncate">{request.title}</h3>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Building className="w-3 h-3" /> {request.providerName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formatDate(request.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge status={request.status} size="sm" />
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onEdit?.(request); 
            }} 
            className="p-1.5 hover:bg-sky-100 text-sky-600 rounded-lg"
            title="Editează"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete?.(request); 
            }} 
            className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg"
            title="Șterge"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </div>
    </motion.div>
  );
}