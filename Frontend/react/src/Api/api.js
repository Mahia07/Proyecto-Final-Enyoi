export const register = async ({ name, email, password, photo }) => {
  try {
    const response = await fetch("http://localhost:3000/register", {
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
    console.error("Error en register", error)
    throw error;
  }
};

export const login = async ({email, password}) => {
     try {
        const response = await fetch('http://localhost:3000/login', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({email, password})
        })

        const data = await response.json()

        if (!response.ok) {
            throw Error(data.message || "Error al iniciar sesion")
        }

        console.log("Token recibido:", data.Token)

        return data

     } catch (error) {
        console.error("Error en login", error)
        throw error
     }
}
export const getProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/profile", {
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
  
  export const updateProfile = async ({ id, name, email, password, photo, token }) => {
    try {
      const response = await fetch(`http://localhost:3000/updateProfile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, photo }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar el perfil");
      }
  
      console.log("Perfil actualizado:", data);
      return data;
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      throw error;
    }
  };
  
  export const createTask = async ({ title, description, status, dateLimit, token }) => {
    try {
      const response = await fetch("http://localhost:3000/createTasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 importante para la autenticación
        },
        body: JSON.stringify({ title, description, status, dateLimit }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error al crear la tarea");
      }
  
      console.log("Tarea creada correctamente:", data.task);
      return data;
    } catch (error) {
      console.error("Error en createTask:", error);
      throw error;
    }
  };
  
  export const deleteTask = async (id, token) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
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
      const response = await fetch("http://localhost:3000/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error al enviar el correo");
      }
  
      console.log("Respuesta del servidor:", data.message);
      return data;
    } catch (error) {
      console.error("Error en forgotPassword:", error);
      throw error;
    }
  };
  export const createCategory = async ({ name, description }) => {
    try {
      const response = await fetch("http://localhost:3000/createCategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error al crear la categoría");
      }
  
      console.log("Categoría creada:", data);
      return data;
    } catch (error) {
      console.error("Error en createCategory:", error);
      throw error;
    }
  };
  export const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/getCategories");
  
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
  export const deleteCategory = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/deleteCategories/${id}`, {
        method: "DELETE",
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
  export const updateCategory = async ({ id, name, description }) => {
    try {
      const response = await fetch(`http://localhost:3000/updateCategories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar la categoría");
      }
  
      console.log("Categoría actualizada:", data);
      return data;
    } catch (error) {
      console.error("Error en updateCategory:", error);
      throw error;
    }
  };
  