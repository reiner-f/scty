import React, { forwardRef } from "react";
import { motion } from "motion/react";
import { Building, Calendar, Edit2, Trash2, ChevronRight } from "lucide-react";
import { Request, RequestStatus } from "@/types";
import { Badge } from "../common/Badge";
import { Checkbox } from "../common/Checkbox"; // NOU: Am importat Checkbox
import { formatDate, classNames } from "@/utils/helpers";

interface RequestCardProps {
  request: Request;
  index?: number;
  onClick?: () => void;
  onEdit?: (request: Request) => void;
  onDelete?: (request: Request) => void;
  onStatusChange?: (id: string, status: RequestStatus) => void;
  // NOU: Props pentru selecție
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
}

export const RequestCard = forwardRef<HTMLDivElement, RequestCardProps>(({ 
  request, 
  index = 0, 
  onClick, 
  onEdit, 
  onDelete,
  onStatusChange,
  isSelected = false,
  onToggleSelection
}, ref) => {
  
  const statusBorder = {
    accepted: "border-l-emerald-400 dark:border-l-emerald-500",
    rejected: "border-l-rose-400 dark:border-l-rose-500",
    pending: "border-l-amber-400 dark:border-l-amber-500",
  }[request.status];

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className={classNames(
        "group bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-y border-r border-slate-200 dark:border-slate-800 rounded-r-xl p-4 flex items-center gap-4 cursor-pointer transition-all border-l-4",
        statusBorder,
        isSelected && "bg-sky-50 dark:bg-sky-900/20 border-r-sky-300 dark:border-r-sky-700" // Highlight vizual dacă e selectat
      )}
    >
      {/* NOU: Zona de Checkbox */}
      {onToggleSelection && (
        <div 
          className="pl-1 pr-2" 
          onClick={(e) => e.stopPropagation()} // CRITIC: Nu deschidem modalul la click pe checkbox
        >
          <Checkbox 
            checked={isSelected}
            onChange={() => onToggleSelection(request.id)}
            size="lg" // Folosim checkbox mare pentru accesibilitate
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">{request.title}</h3>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <span className="flex items-center gap-1">
            <Building className="w-3 h-3" /> {request.provider?.name || "Furnizor Necunoscut"}
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
            onClick={(e) => { e.stopPropagation(); onEdit?.(request); }} 
            className="p-1.5 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-lg transition-colors"
            title="Editează"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(request); }} 
            className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg transition-colors"
            title="Șterge"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 transition-colors" />
      </div>
    </motion.div>
  );
});

RequestCard.displayName = "RequestCard";