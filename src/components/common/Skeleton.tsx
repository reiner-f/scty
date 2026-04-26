import React from "react";
import { classNames } from "@/utils/helpers";

interface SkeletonProps {
  className?: string;
}

// 1. Elementul de bază (un bloc gri care pulsează)
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={classNames(
        "animate-pulse bg-slate-200/60 rounded-md",
        className
      )}
    />
  );
}

// 2. Skeleton special pentru Tabele (Admin Dashboard)
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full">
      {/* Header-ul Tabelului (Nu pulsează, dă structură) */}
      <div className="bg-slate-50 border-b border-slate-200 flex items-center px-5 py-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`th-${i}`} className="flex-1">
            <Skeleton className="h-4 w-24 bg-slate-300/50" />
          </div>
        ))}
      </div>

      {/* Rândurile Tabelului (Pulsează) */}
      <div className="divide-y divide-slate-100 bg-white">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`tr-${rowIndex}`} className="flex items-center px-5 py-5">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={`td-${rowIndex}-${colIndex}`} className="flex-1 pr-4">
                {/* Variază lățimea scheletelor pentru a părea date reale (ex: unele scurte, altele lungi) */}
                <Skeleton 
                  className={classNames(
                    "h-4",
                    colIndex === columns - 1 ? "w-8 ml-auto" : // Ultimul element (Acțiuni) e mic și aliniat la dreapta
                    (rowIndex + colIndex) % 2 === 0 ? "w-3/4" : "w-1/2" // Lățimi aleatorii
                  )} 
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Skeleton special pentru Lista de Cereri (Carduri)
export function RequestCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-3 w-2/3">
          <Skeleton className="h-5 w-3/4" /> {/* Titlu */}
          <Skeleton className="h-4 w-1/2" /> {/* Primărie / Furnizor */}
        </div>
        <Skeleton className="h-6 w-24 rounded-full" /> {/* Status Badge */}
      </div>
      <div className="space-y-2 mb-5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
        <Skeleton className="h-4 w-32" /> {/* Dată */}
        <Skeleton className="h-8 w-24 rounded-lg" /> {/* Buton Acțiune */}
      </div>
    </div>
  );
}