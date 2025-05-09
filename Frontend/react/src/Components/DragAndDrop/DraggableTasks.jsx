import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function DraggableTasks({ task, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
export default DraggableTasks