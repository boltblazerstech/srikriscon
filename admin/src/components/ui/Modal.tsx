"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  hideClose?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  hideClose = false,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-full bg-surface rounded-2xl border border-border shadow-xl focus:outline-none animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[calc(100dvh-2rem)] md:max-h-[calc(100vh-4rem)]",
            sizeClasses[size]
          )}
        >
          {(title || !hideClose) && (
            <div className="flex items-start justify-between p-5 border-b border-border flex-shrink-0">
              <div>
                {title && (
                  <Dialog.Title className="text-base font-semibold text-foreground">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-sm text-muted-foreground mt-0.5">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {!hideClose && (
                <button
                  onClick={onClose}
                  className="ml-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          <div className="p-5 overflow-y-auto flex-1">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
