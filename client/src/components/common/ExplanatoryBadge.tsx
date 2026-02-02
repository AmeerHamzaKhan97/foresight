import React from 'react';

interface ExplanatoryBadgeProps {
  label: string;
  type: 'success' | 'warning' | 'info' | 'error' | 'neutral';
  className?: string;
}

const ExplanatoryBadge: React.FC<ExplanatoryBadgeProps> = ({ label, type, className = '' }) => {
  const baseStyles = "px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase";
  
  const typeStyles = {
    success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    info: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    error: "bg-red-500/10 text-red-500 border border-red-500/20",
    neutral: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
  };

  return (
    <span className={`${baseStyles} ${typeStyles[type]} ${className}`}>
      {label}
    </span>
  );
};

export default ExplanatoryBadge;
