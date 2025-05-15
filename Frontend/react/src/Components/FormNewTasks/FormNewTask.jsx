import React, { useState, useEffect } from "react";
import { createTask, updateTask } from "../../Api/api";

const TasksForm = ({ token, onClose, initialData, categoryId, refreshTasks }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pendiente",
    dateLimit: "",
    categoryId: categoryId,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTaskData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status === "en-progreso" ? "proceso" : initialData.status || "pendiente",
        dateLimit: initialData.dateLimit ? initialData.dateLimit.split('T')[0] : "",
        categoryId: initialData.categoryId || categoryId,
      });
    } else {
      setTaskData({
        title: "",
        description: "",
        status: "pendiente",
        dateLimit: "",
        categoryId: categoryId,
      });
    }
  }, [initialData, categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!taskData.title || !taskData.description || !taskData.dateLimit) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      console.log('token desde TasksForm:', token)
      if (initialData) {
        await updateTask({
          taskId: initialData.id,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status === "proceso" ? "en-progreso" : taskData.status,
          dateLimit: taskData.dateLimit,
          categoryId: taskData.categoryId,
          token: token
        });
    
      } else {
        await createTask({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status === "proceso" ? "en-progreso" : taskData.status,
          dateLimit: taskData.dateLimit,
          categoryId: taskData.categoryId,
          token: token
        });
      }

      if (refreshTasks) refreshTasks();
      onClose();
    } catch (error) {
      setError(error.message || "Error al guardar cambios");
      console.error("Error en TasksForm:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit} className="task-form">
        <h3>{initialData ? "Editar Tarea" : "Nueva Tarea"}</h3>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Título*</label>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción*</label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Estado</label>
          <select
            name="status"
            value={taskData.status}
            onChange={handleChange}
          >
            <option value="pendiente">Pendiente</option>
            <option value="proceso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fecha límite*</label>
          <input
            type="date"
            name="dateLimit"
            value={taskData.dateLimit}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {initialData ? "Actualizar" : "Guardar"}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TasksForm;