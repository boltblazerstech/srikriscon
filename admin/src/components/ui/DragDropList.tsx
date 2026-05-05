"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface DragDropListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  showHandle?: boolean;
}

export default function DragDropList<T>({
  items,
  keyExtractor,
  onReorder,
  renderItem,
  className,
  itemClassName,
  showHandle = true,
}: DragDropListProps<T>) {
  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onReorder(reordered);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="drag-drop-list">
        {(droppableProvided) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className={cn("space-y-2", className)}
          >
            {items.map((item, index) => (
              <Draggable key={keyExtractor(item)} draggableId={keyExtractor(item)} index={index}>
                {(draggableProvided, snapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border border-border bg-surface p-3 transition-shadow",
                      snapshot.isDragging && "shadow-lg ring-2 ring-primary/30",
                      itemClassName
                    )}
                  >
                    {showHandle && (
                      <div
                        {...draggableProvided.dragHandleProps}
                        className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {renderItem(item, index, snapshot.isDragging)}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
