import React, { useState, useEffect } from "react";
import {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getTasksByCategory,
  createTask,
  updateTask,
  deleteTask
} from "../../Api/api.js";

const Category = () => {
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [tasksByCategory, setTasksByCategory] = useState({});
  const [showTaskForm, setShowTaskForm] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loading, setLoading] = useState({
    categories: false,
    tasks: false,
    actions: false
  });

  // Obtener categorías al cargar el componente
  useEffect(() => {
    if (token) {
      fetchCategories();
    } else {
      setMessage({ text: "No se encontró token de autenticación", type: "error" });
    }
  }, [token]);

  
  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach(category => {
        fetchTasksForCategory(category.id);
      });
    }
  }, [categories]);

  const fetchCategories = async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    try {
      const data = await getCategories(token);
      setCategories(data);
      setMessage({ text: "", type: "" });
    } catch (error) {
      setMessage({ 
        text: error.message || "Error al obtener categorías", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const fetchTasksForCategory = async (categoryId) => {
    setLoading(prev => ({ ...prev, tasks: true }));
    try {
      const tasks = await getTasksByCategory(categoryId, token);
      
      const formattedTasks = tasks.map(task => ({
        ...task,
        dateLimit: task.dateLimit ? new Date(task.dateLimit).toLocaleDateString() : "Sin fecha"
      }));

      setTasksByCategory(prev => ({
        ...prev,
        [categoryId]: formattedTasks
      }));
    } catch (error) {
      setMessage({ 
        text: error.message || "Error al obtener tareas", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, tasks: false }));
    }
  };

  const handleCreateTask = async (taskData) => {
    setLoading(prev => ({ ...prev, actions: true }));
    try {
      await createTask({ ...taskData, token });
      setMessage({ 
        text: "Tarea creada correctamente", 
        type: "success" 
      });
      await fetchTasksForCategory(taskData.categoryId);
      setShowTaskForm(null);
    } catch (error) {
      setMessage({ 
        text: error.message || "Error al crear la tarea", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleUpdateTask = async (taskData) => {
    setLoading(prev => ({ ...prev, actions: true }));
    try {
      await updateTask({ ...taskData, token });
      setMessage({ 
        text: "Tarea actualizada correctamente", 
        type: "success" 
      });
      await fetchTasksForCategory(taskData.categoryId);
      setEditingTaskId(null);
    } catch (error) {
      setMessage({ 
        text: error.message || "Error al actualizar la tarea", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleDeleteTask = async (taskId, categoryId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      return;
    }
    
    setLoading(prev => ({ ...prev, actions: true }));
    try {
      await deleteTask(taskId, token);
      setMessage({ 
        text: "Tarea eliminada correctamente", 
        type: "success" 
      });
      await fetchTasksForCategory(categoryId);
    } catch (error) {
      setMessage({ 
        text: error.message || "Error al eliminar la tarea", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleCreateCategory = async () => {
    if (!name.trim()) {
      setMessage({ text: "El nombre es obligatorio", type: "error" });
      return;
    }
    
    setLoading(prev => ({ ...prev, actions: true }));
    try {
      const newCategory = await createCategory({ name, description }, token);
      setMessage({ 
        text: `Categoría creada: ${newCategory.name}`, 
        type: "success" 
      });
      setName("");
      setDescription("");
      setShowForm(false);
      await fetchCategories();
    } catch (error) {
      setMessage({ 
        text: error.message || "Error al crear categoría", 
        type: "error" 
      });
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };
const handleDeleteCategory = async (id) => {
  const token = localStorage.getItem("token"); 
  if (!token) {
    setMessage({ text: "No hay token de autenticación", type: "error" });
    return;
  }

  const categoryName = categories.find(c => c.id === id)?.name || "Categoría";
  
  setLoading(prev => ({ ...prev, actions: true }));
  
  try {
    
    await deleteCategory({ id, token });
    
    setMessage({ 
      text: `"${categoryName}" eliminada correctamente`, 
      type: "success" 
    });
    
    
    setCategories(prev => prev.filter(category => category.id !== id));
    
  } catch (error) {
    let errorMessage = "Error al eliminar categoría";
    
    if (error.message.includes("401")) {
      errorMessage = "Token inválido o expirado";
    } else if (error.message.includes("404")) {
      errorMessage = "La categoría ya no existe";
    }
    
    setMessage({ text: errorMessage, type: "error" });
  } finally {
    setLoading(prev => ({ ...prev, actions: false }));
  }
};
  const handleEditCategory = async (id, updatedName, updatedDescription) => {
  const token = localStorage.getItem("token"); 
  if (!token) {
    setMessage({ text: "No hay token de autenticación", type: "error" });
    return;
  }

  setLoading(prev => ({ ...prev, actions: true }));
  
  try {
  
    await updateCategory({ 
      id, 
      name: updatedName, 
      description: updatedDescription,
      token 
    });
    
    setMessage({ 
      text: "Categoría actualizada correctamente", 
      type: "success" 
    });
    
    setEditingCategoryId(null);
    
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, name: updatedName, description: updatedDescription } : cat
    ));
    
  } catch (error) {
    let errorMessage = "Error al actualizar categoría";
    
    if (error.message.includes("401")) {
      errorMessage = "Token inválido o expirado";
    } else if (error.message.includes("404")) {
      errorMessage = "La categoría no existe";
    }
    
    setMessage({ text: errorMessage, type: "error" });
  } finally {
    setLoading(prev => ({ ...prev, actions: false }));
  }
};

  const TaskForm = ({ categoryId, onSave, onCancel, initialData }) => {
    const [taskData, setTaskData] = useState({
      title: "",
      description: "",
      status: "pendiente",
      dateLimit: "",
      categoryId: categoryId
    });
  
    const [error, setError] = useState("");
  
    useEffect(() => {
      if (initialData) {
        setTaskData({
          title: initialData.title || "",
          description: initialData.description || "",
          status: initialData.status || "pendiente",
          dateLimit: initialData.dateLimit ? initialData.dateLimit.split('T')[0] : "",
          categoryId: initialData.categoryId || categoryId
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
        const dataToSend = {
          ...taskData,
          dateLimit: new Date(taskData.dateLimit).toISOString(),
          categoryId: categoryId
        };
        
        if (initialData) {
          dataToSend.taskId = initialData.id;
        }
        
        await onSave(dataToSend);
      } catch (error) {
        setError(error.message || "Hubo un error al guardar la tarea.");
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTaskData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    return (
      <div className="task-form-container">
        <form onSubmit={handleSubmit} className="task-form">
          <h3 className="form-title">{initialData ? "Editar Tarea" : "Crear Nueva Tarea"}</h3>
  
          {error && <div className="form-error">{error}</div>}
  
          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="form-group">
            <label>Fecha límite:</label>
            <input
              type="date"
              name="dateLimit"
              value={taskData.dateLimit}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {initialData ? "Actualizar" : "Guardar"}
            </button>
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderTasks = (tasks, categoryId) => {
    if (!tasks || tasks.length === 0) {
      return (
        <div className="empty-state">
          <p>No hay tareas en esta categoría</p>
          <button 
            onClick={() => setShowTaskForm(categoryId)}
            className="add-task-btn"
          >
            +
          </button>
        </div>
      );
    }

    return (
      <>
        {tasks.map(task => (
          <div key={task.id} className={` ${task.status}`}>
            {editingTaskId === task.id ? (
              <TaskForm
                categoryId={categoryId}
                initialData={task}
                onSave={handleUpdateTask}
                onCancel={() => setEditingTaskId(null)}
              />
            ) : (
              <>
              <div>
                <div className="task-content">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="task-date"> {task.dateLimit}</div>
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => setEditingTaskId(task.id)}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(task.id, categoryId)}
                    className="delete-btn"
                  >
                    Eliminar
                  </button>
                  {task.status !== "completada" && (
                    <button 
                      onClick={() => handleUpdateTask({
                        ...task,
                        status: "completada",
                        categoryId
                      })}
                      className="complete-btn"
                    >
                      Completar
                    </button>
                  )}
                </div>
                </div>
              </>
            )}
          </div>
        ))}
        <button 
          onClick={() => setShowTaskForm(categoryId)}
          className="add-task-btn"
        >
          +
        </button>
      </>
    );
  };

  return (
    <div className="tasksContainer">
      {loading.categories && <div className="loading-overlay">Cargando categorías...</div>}

      {!showForm ? (
        <button
          className="add-category-btn"
          onClick={() => setShowForm(true)}
          disabled={loading.categories}
        >
          + Añadir nueva categoría
        </button>
      ) : (
        <div className="task-form-container">
          <form className="task-form" onSubmit={(e) => { e.preventDefault(); handleCreateCategory(); }}>
            <h3 className="form-title">Nueva Categoría</h3>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="kanban-input"
              />
            </div>
            <div className="form-group">
              <label>Descripción (opcional)</label>
              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="kanban-input"
              />
            </div>
            <div className="form-actions">
              <button 
                type="submit"
                disabled={loading.actions}
                className="btn-primary save-btn"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setName("");
                  setDescription("");
                }}
                disabled={loading.actions}
                className="btn-secondary cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div className="taskContainer">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="kanbanColumn">
              {editingCategoryId === category.id ? (
                <div className="task-form-container">
                  <form className="task-form" onSubmit={(e) => {
                    e.preventDefault();
                    handleEditCategory(category.id, category.name, category.description);
                  }}>
                    <h3 className="form-title">Editar Categoría</h3>
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => {
                          const updatedCategories = categories.map((cat) =>
                            cat.id === category.id ? { ...cat, name: e.target.value } : cat
                          );
                          setCategories(updatedCategories);
                        }}
                        className="kanban-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Descripción</label>
                      <input
                        type="text"
                        value={category.description}
                        onChange={(e) => {
                          const updatedCategories = categories.map((cat) =>
                            cat.id === category.id ? { ...cat, description: e.target.value } : cat
                          );
                          setCategories(updatedCategories);
                        }}
                        className="kanban-input"
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        type="submit"
                        disabled={loading.actions}
                        className="btn-primary save-btn"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategoryId(null)}
                        disabled={loading.actions}
                        className="btn-secondary cancel-btn"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="column-header">
                    <h2 className="column-title">{category.name}</h2>
                    <div className="column-actions">
                      <button
                        onClick={() => setEditingCategoryId(category.id)}
                        className="edit-btn"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="delete-btn"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  
                    {showTaskForm === category.id && (
                      <TaskForm
                        categoryId={category.id}
                        onSave={handleCreateTask}
                        onCancel={() => setShowTaskForm(null)}
                      />
                    )}
                    {renderTasks(tasksByCategory[category.id], category.id)}
                
                </>
              )}
            </div>
          ))
        ) : (
          !loading.categories && <p className="empty-state">No hay categorías creadas</p>
        )}
      </div>
    </div>
  );
};

export default Category;