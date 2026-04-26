import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center w-full ${className}`}>
      {/* Container-ul pentru Iconiță (Fundal subtil cu umbră fină) */}
      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-5 shadow-sm">
        <Icon className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
      </div>
      
      {/* Titlu și Descriere */}
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      
      {/* Buton de acțiune opțional (se afișează doar dacă îi dăm text și funcție) */}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" className="shadow-md hover:-translate-y-0.5 transition-transform">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}