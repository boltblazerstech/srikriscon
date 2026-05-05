"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

// Radix forbids value="" on <Select.Item> (it reserves "" for "no selection").
// We transparently remap "" ↔ this sentinel so callers never need to change.
const EMPTY = "__empty__";

function toInternal(v: string | undefined) {
  return v === "" ? EMPTY : v;
}

function toExternal(v: string) {
  return v === EMPTY ? "" : v;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  error,
  disabled,
  className,
}: SelectProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <RadixSelect.Root
        value={toInternal(value)}
        onValueChange={(v) => onChange?.(toExternal(v))}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-lg border bg-white px-3 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
            error ? "border-destructive" : "border-border"
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 overflow-hidden rounded-lg border border-border bg-white shadow-lg min-w-[var(--radix-select-trigger-width)] max-h-72"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={toInternal(opt.value) as string}
                  disabled={opt.disabled}
                  className="relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-3 text-sm text-foreground outline-none data-[highlighted]:bg-muted data-[disabled]:opacity-50"
                >
                  <RadixSelect.ItemIndicator className="absolute left-2 flex items-center">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
