import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { classNames } from "@/utils/helpers";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "red" | "yellow";
  delay?: number;
  chartData?: { val: number }[]; // Datele pentru sparkline
}

const colorStyles = {
  blue: {
    bg: "bg-gradient-to-br from-sky-50 to-blue-50",
    icon: "bg-gradient-to-br from-baby-blue to-baby-dark text-white shadow-blue-200",
    value: "text-baby-dark",
    border: "border-sky-100",
  },
  green: {
    bg: "bg-gradient-to-br from-emerald-50 to-green-50",
    icon: "bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-emerald-200",
    value: "text-emerald-700",
    border: "border-emerald-100",
  },
  red: {
    bg: "bg-gradient-to-br from-rose-50 to-red-50",
    icon: "bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-rose-200",
    value: "text-rose-700",
    border: "border-rose-100",
  },
  yellow: {
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
    icon: "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-amber-200",
    value: "text-amber-700",
    border: "border-amber-100",
  },
};

export function StatsCard({ title, value, icon: Icon, color, delay = 0, chartData }: StatsCardProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={classNames(
        "relative p-6 rounded-2xl border shadow-sm transition-all duration-300 cursor-default overflow-hidden",
        "hover:shadow-md hover:-translate-y-1",
        "dark:bg-slate-900 dark:border-slate-800", // Suport Dark Mode
        styles.bg,
        styles.border
      )}
    >
      <div className="relative z-10 flex items-center justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">
            {title}
          </p>
          <p className={classNames("text-3xl font-bold truncate", styles.value)}>
            {value}
          </p>
        </div>
        
        <div
          className={classNames(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0",
            styles.icon
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Sparkline Chart - Apare doar dacă există date */}
      {chartData && (
        <div className="h-12 w-full mt-2 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
              <Line 
                type="monotone" 
                dataKey="val" 
                stroke="currentColor" 
                strokeWidth={2} 
                dot={false} 
                className={styles.value} // Aplică culoarea din setul de stiluri
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bonus Vizual: Glow/Flare pentru efect 3D (vizibil mai ales în Light Mode) */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white opacity-40 dark:opacity-10 rounded-full blur-2xl pointer-events-none" />
    </motion.div>
  );
}