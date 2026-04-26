import React from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "../common/Button";
import { reportService } from "@/services/reportService";
import { Request } from "@/types";

interface ExportButtonsProps {
  data: Request[];
  selectedCount?: number;
}

export function ExportButtons({ data, selectedCount = 0 }: ExportButtonsProps) {
  const hasSelection = selectedCount > 0;
  const excelText = hasSelection ? `Excel (${selectedCount})` : "Excel";
  const pdfText = hasSelection ? `PDF (${selectedCount})` : "PDF";

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Button 
        variant="outline" 
        className="flex-1 sm:flex-none bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 transition-colors"
        onClick={() => reportService.exportToExcel(data)}
        leftIcon={<FileSpreadsheet className="w-4 h-4" />}
        disabled={data.length === 0}
        title={hasSelection ? `Exportă ${selectedCount} elemente selectate în Excel` : "Descarcă tot tabelul în Excel"}
      >
        {excelText}
      </Button>
      
      <Button 
        variant="outline" 
        className="flex-1 sm:flex-none bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400 transition-colors"
        onClick={() => reportService.exportToPDF(data)}
        leftIcon={<FileText className="w-4 h-4" />}
        disabled={data.length === 0}
        title={hasSelection ? `Exportă ${selectedCount} elemente selectate ca PDF` : "Descarcă tot raportul PDF"}
      >
        {pdfText}
      </Button>
    </div>
  );
}