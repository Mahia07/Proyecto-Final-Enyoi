export const register = async ({ name, email, password, photo }) => {
  try {
    const response = await fetch("https://proyecto-final-enyoi.onrender.com/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name, email, password, photo }),
    });

    const responseText = await response.text();
    console.log("Enviando Datos registrados:", {
      name,
      email,
      password,
      photo,
    });

    console.log("Respuesta del servidor:", responseText);

    if (!response.ok) {
      console.log("Error en la respuesta del servidor", responseText);
      throw new Error("Error al registrar el usuario");
    }
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error en register", error);
    throw error;
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await fetch("https://proyecto-final-enyoi.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw Error(data.message || "Error al iniciar sesion");
    }

    console.log("Token recibido:", data.token);
    localStorage.setItem("token", data.token);

    return data;
  } catch (error) {
    console.error("Error en login", error);
    throw error;
  }
};
export const getProfile = async (token) => {
  try {
    const response = await fetch("https://proyecto-final-enyoi.onrender.com/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener el perfil");
    }

    console.log("Perfil recibido:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    throw error;
  }
};
export const updateProfile = async ({ id, name, email, token }) => {
  try {
    const response = await fetch(`https://proyecto-final-enyoi.onrender.com/updateProfile/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, email })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateProfile:', error);
    throw error;
  }
};
export const createTask = async ({ title, description, status, dateLimit, categoryId, token }) => {
  console.log(token, 'DESDE API.JS')
  try {
    console.log('Token en createTask:', token); 
    const response = await fetch(`https://proyecto-final-enyoi.onrender.com/createTasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, status, dateLimit, categoryId }),
    });

    if (response.status === 401) throw new Error("Token inválido o expirado");
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al crear tarea");
    
    return data;
  } catch (error) {
    console.error("Error en createTask:", error);
    throw error;
  }
};
export const updateTask = async ({ taskId, title, description, status, dateLimit, categoryId, token }) => {
  try {
    console.log('Token en updateTask:', token);
    console.log('Datos enviados:', { taskId, title, description, status, dateLimit, categoryId });
    
    const response = await fetch(`https://proyecto-final-enyoi.onrender.com/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        title, 
        description, 
        status: status === "proceso" ? "en-progreso" : status,
        dateLimit,
        categoryId 
      }),
    });

    if (response.status === 404) throw new Error("Tarea no encontrada");
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al actualizar tarea");
    
    return data;
  } catch (error) {
    console.error("Error en updateTask:", error);
    throw error;
  }
};
export const getTasks = async (token) => {
  try {
    const response = await fetch(`https://proyecto-final-enyoi.onrender.com/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Error al obtener las tareas del usuario"
      );
    }

    console.log("Tareas del usuario:", data);
    return data;
  } catch (error) {
    console.error("Error en getTasks:", error);
    throw error;
  }
};

export const deleteTask = async (taskId, token) => {
  try {
    const response = await fetch(`https://proyecto-final-enyoi.onrender.com/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al eliminar la tarea");
    }

    console.log("Tarea eliminada:", data.message);
    return data;
  } catch (error) {
    console.error("Error en deleteTask:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await fetch("https://proyecto-final-enyoi.onrender.com/forgotPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al enviar correo");

    return data;
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await fetch(`https://proyecto-final-enyoi.onrender.com/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const contentType = response.headers.get("Content-Type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text(); 
      throw new Error(`Respuesta no JSON: ${text}`);
    }

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Error al cambiar contraseña");

    return data;
  } catch (error) {
    console.error("Error en resetPassword:", error);
    throw error;
  }
};


export const createCategory = async ({ name, description }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token de autenticación");

    const response = await fetch("https://proyecto-final-enyoi.onrender.com/CreateCategory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, description }),
    });


    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al crear categoría");
    }

    return data;
  } catch (error) {
    console.error("Error en createCategory:", error);
    throw error;
  }
};
export const updateCategory = async ({ id, name, description, token }) => {
  try {
    if (!token) throw new Error("Token no proporcionado");
    
    const response = await fetch(`https://proyecto-final-enyoi.onrender.com/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, description })
    });

    if (response.status === 401) {
      throw new Error("Token inválido o expirado");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar categoría");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateCategory:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("https://proyecto-final-enyoi.onrender.com/getCategories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener las categorías");
    }

    console.log("Categorías obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error en getCategories:", error);
    throw error;
  }
};

export const deleteCategory = async ({ id, token }) => {
  try {
 const response = await fetch(`https://proyecto-final-enyoi.onrender.com/deleteCategory/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al eliminar la categoría");
    }

    console.log("Categoría eliminada:", data.message);
    return data;
  } catch (error) {
    console.error("Error en deleteCategory:", error);
    throw error;
  }
};
export const getTasksByCategory = async (categoryId, token) => {
  try {
      const response = await fetch(`https://proyecto-final-enyoi.onrender.com/tasksByCategory/${categoryId}`, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      
      if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error en la API (${response.status}):`, errorText);
          throw new Error(`Error en la API: ${response.statusText}`);
      }

      
      const textResponse = await response.text();
      console.log("Respuesta del servidor:", textResponse);

    
      const data = JSON.parse(textResponse);
      return data;

  } catch (error) {
      console.error("Error en getTasksByCategory:", error);
      throw error;
  }
};
