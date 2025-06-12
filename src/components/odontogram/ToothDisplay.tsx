"use client";

import type { Tooth as ToothType, ToothCondition } from '@/types/patient';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SmilePlus, Frown, X, CheckCircle2, Crown as CrownIcon, Anchor, Settings2, VenetianMask, Axe, Link2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToothProps {
  tooth: ToothType;
  onClick: (toothId: number) => void;
  size?: 'sm' | 'md' | 'lg';
  isSelected?: boolean;
}

const conditionStyles: Record<ToothCondition, { icon: React.ElementType, colorClasses: string, label: string }> = {
  Healthy: { icon: SmilePlus, colorClasses: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200', label: 'Healthy' },
  Caries: { icon: Frown, colorClasses: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200', label: 'Caries' },
  Missing: { icon: X, colorClasses: 'bg-gray-200 text-gray-600 border-gray-400 hover:bg-gray-300', label: 'Missing' },
  Restored: { icon: CheckCircle2, colorClasses: 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200', label: 'Restored' },
  Crown: { icon: CrownIcon, colorClasses: 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200', label: 'Crown' },
  Implant: { icon: Anchor, colorClasses: 'bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-200', label: 'Implant' },
  RootCanalTreated: { icon: Settings2, colorClasses: 'bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200', label: 'Root Canal Treated' },
  ToExtract: { icon: Axe, colorClasses: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200', label: 'To Extract' },
  Veneer: { icon: VenetianMask, colorClasses: 'bg-teal-100 text-teal-700 border-teal-300 hover:bg-teal-200', label: 'Veneer' },
  BridgePontic: { icon: Link2, colorClasses: 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200', label: 'Bridge Pontic' },
  BridgeAbutment: { icon: Link2, colorClasses: 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200', label: 'Bridge Abutment' },
};

export function ToothDisplay({ tooth, onClick, size = 'md', isSelected = false }: ToothProps) {
  const style = conditionStyles[tooth.condition] || conditionStyles.Healthy;
  const Icon = style.icon;

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs p-1',
    md: 'w-12 h-12 text-sm p-1.5',
    lg: 'w-16 h-16 text-base p-2',
  };
  
  const tooltipContent = `${style.label}${tooth.notes ? ` - ${tooth.notes}` : ''}`;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex flex-col items-center justify-center rounded-md border transition-all duration-150 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-primary focus:ring-offset-2",
              sizeClasses[size],
              style.colorClasses,
              isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-lg scale-105' : 'shadow-sm'
            )}
            onClick={() => onClick(tooth.id)}
            aria-label={`Tooth ${tooth.id}, Condition: ${style.label}`}
          >
            <Icon className="h-1/2 w-1/2 mb-0.5" strokeWidth={1.5} />
            <span className="font-mono font-semibold leading-none">{tooth.id}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-card text-card-foreground border-border shadow-lg rounded-md p-2">
          <p className="text-sm font-medium">Tooth {tooth.id}</p>
          <p className="text-xs">{tooltipContent}</p>
          {tooth.treatments && tooth.treatments.length > 0 && (
            <div className="mt-1 pt-1 border-t border-border/50">
              <p className="text-xs font-semibold">Treatments:</p>
              {tooth.treatments.slice(0,2).map((tx, idx) => (
                <p key={idx} className="text-xs text-muted-foreground"> - {tx.description} ({tx.date})</p>
              ))}
              {tooth.treatments.length > 2 && <p className="text-xs text-muted-foreground">...and more</p>}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
