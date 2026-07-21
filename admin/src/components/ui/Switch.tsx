"use client";

import * as RadixSwitch from "@radix-ui/react-switch";
import { cn } from "@/src/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

export default function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
  id,
}: SwitchProps) {
  const switchId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-center justify-between gap-4 min-w-0">
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={switchId}
              className="text-sm font-medium text-foreground cursor-pointer block truncate"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 break-words">{description}</p>
          )}
        </div>
      )}
      <RadixSwitch.Root
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary" : "bg-gray-200"
        )}
      >
        <RadixSwitch.Thumb
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </RadixSwitch.Root>
    </div>
  );
}
