import  { useState, useEffect } from "react";
import { getTasks, deleteTask, updateTask, createTask } from "../../Api/api.js";
import TasksForm from "../FormNewTasks/FormNewTask.jsx";
import DraggableTasks from "../DragAndDrop/DraggableTasks";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({ id, children, onAddTaskClick }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="kanbanColumn">
      <div className="columnHeader">
          <h2>{id.charAt(0).toUpperCase() + id.slice(1)}</h2>
        <svg
          onClick={() => onAddTaskClick(id)}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6DA5C0"
          strokeWidth="0.75"
          strokelinejoin="round"
          className="lucide lucide-plus-icon lucide-plus"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </div>
      {children}
    </div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [token] = useState(localStorage.getItem("token"));
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activeColumn, setActiveColumn] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('Token desde Tasks', token);

  useEffect(() => {
    if (token) {
      fetchTasks();
    } else {
      setError("No se encontró token de autenticación");
    }
  }, [token]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks(token);
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener tareas", error);
      setError("Error al cargar las tareas");
    } 
  };

  const handleAddTaskClick = (columnId) => {
    setActiveColumn(columnId);
    setEditingTask(null);
    setIsFormVisible(true);
  };

  const handleEditTaskClick = (task) => {
    setActiveColumn(task.status);
    setEditingTask(task);
    setIsFormVisible(true);
  };
const handleSaveTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      if (editingTask) {
        const updatedTask = {
          taskId: editingTask.id,
          title: taskData.title,
          description: taskData.description,
          dateLimit: taskData.dateLimit,
          status: activeColumn,
          token: token 
        };

        const response = await updateTask(updatedTask);
        setTasks((oldTasks) =>
          oldTasks.map((task) =>
            task.id === editingTask.id ? response.task : task
          )
        );
      } else {
        const newTask = {
          title: taskData.title,
          description: taskData.description,
          status: activeColumn,
          dateLimit: taskData.dateLimit,
          token: token 
        };
        
         createTask(newTask);
        await fetchTasks()
        
      }
      setIsFormVisible(false);
      setEditingTask(null);
    } catch (error) {
      console.error(
        editingTask ? "Error al actualizar la tarea:" : "Error al crear tarea:",
        error
      );
      setError(error.message || "Ocurrió un error al guardar la tarea");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTask(id, token);
      setTasks((oldTasks) => oldTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea", error);
      setError("Error al eliminar la tarea");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const draggedTask = tasks.find((task) => task.id === active.id);
    const statusMap = {
      pendiente: "pendiente",
      proceso: "proceso",
      completada: "completada",
    };

    const newStatus = statusMap[over.id];
    if (!draggedTask || draggedTask.status === newStatus) return;

    setLoading(true);
    setError(null);
    try {
      const updatedTask = {
        taskId: draggedTask.id,
        title: draggedTask.title,
        description: draggedTask.description,
        dateLimit: draggedTask.dateLimit,
        status: newStatus,
        token: token 
      };

      const response = await updateTask(updatedTask);
      setTasks((oldTasks) =>
        oldTasks.map((task) =>
          task.id === draggedTask.id ? response.task : task
        )
      );
    } catch (error) {
      console.error("Error al actualizar status tarea", error);
      setError("Error al mover la tarea");
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks.filter((task) => task.status === "pendiente");
  const inProgressTasks = tasks.filter((task) => task.status === "proceso");
  const completedTasks = tasks.filter((task) => task.status === "completada");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const renderTask = (task) => (
    <DraggableTasks key={task.id} task={task}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="taskDate">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6DA5C0"
          strokeWidth="0.5"
          strokeLinejoin="round"
          className="lucide lucide-calendar-days"
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </svg>
        <p>{task.dateLimit.split("T")[0]}</p>
      </div>
      <div className="taskActions">
        <svg
          onClick={(e) => {
            e.stopPropagation();
            handleEditTaskClick(task);
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6DA5C0"
          strokeWidth="0.75"
          strokeLinejoin="round"
          className="lucide lucide-edit"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        <svg
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(task.id);
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6DA5C0"
          strokeWidth="0.75"
          strokeLinejoin="round"
          className="lucide lucide-trash2-icon lucide-trash-2"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      </div>
    </DraggableTasks>
  );

  return (
    <>
   
      {error && <div className="error-message">{error}</div>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="taskContainer">
          <DroppableColumn id="pendiente" onAddTaskClick={handleAddTaskClick}>
            {pendingTasks.length === 0
              ? <p>No hay tareas pendientes</p>
              : pendingTasks.map(renderTask)}
          </DroppableColumn>
          <DroppableColumn id="proceso" onAddTaskClick={handleAddTaskClick}>
            {inProgressTasks.length === 0
              ? <p>No hay tareas en proceso</p>
              : inProgressTasks.map(renderTask)}
          </DroppableColumn>
          <DroppableColumn id="completada" onAddTaskClick={handleAddTaskClick}>
            {completedTasks.length === 0
              ? <p>No hay tareas completadas</p>
              : completedTasks.map(renderTask)}
          </DroppableColumn>
        </div>
      </DndContext>
      {isFormVisible && (
        <TasksForm
          token={token}
          onSave={handleSaveTask}
          onClose={() => {
            setIsFormVisible(false);
            setEditingTask(null);
          }}
          initialData={editingTask}
        />
      )}
    </>
  );
};

export default Tasks;