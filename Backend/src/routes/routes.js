import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { Users } from "../models/users.js";
import { Tasks } from "../models/tasks.js";
import { Category } from "../models/category.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import colors from "colors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import sequelize from "../config/config.js";

dotenv.config({ path: "../../.env" });
const router = express.Router();
router.use(express.json());

router.get("/users", async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log("Error al traer usuarios".magenta, error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password, photo } = req.body;
  console.log("Datos recibidos".green, req.body);

  try {
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      console.log("El usuario ya existe".red);
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      photo,
    });

    console.log("Usuario creado con exito".green);
    res.status(201).json({ message: "usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Resultado de la comparacion", validPassword);

    if (!validPassword) {
      console.log("Contraseña incorrecta".red);
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET,
      { expiresIn: "12h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { id: req.user.id },
      attributes: ["id", "name", "email", "photo"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.put("/updateProfile/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, photo } = req.body;

  try {
    const user = await Users.findByPk(id);

    if (!user) {
      console.log("no se encontro usuario".red);
      return res.status(404).send("No se encontro usuario");
    }

    await user.update({
      name,
      email,
      password,
      photo,
    });

    console.log("Perfil Actualizado", user);
    res.json({ message: "Perfil actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error interno al actualizar el perfil" });
  }
});

router.get("/tasks", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Tasks.findAll({
      where: { userId },
      order: [
        [sequelize.literal("dateLimit IS NULL"), "ASC"],
        ["dateLimit", "ASC"],
      ],
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error al obtener las tareas del usuario", error);
    res
      .status(500)
      .json({ message: "Error al obtener las tareas del usuario" });
  }
});

router.post("/createTasks", verifyToken, async (req, res) => {
  const { title, description, status, dateLimit, categoryId } = req.body;
  console.log("Datos recibidos en el backend:", req.body); 
  try {
    if (!title) {
      return res.status(400).json({ message: "El título es obligatorio" });
    }

    const newTask = await Tasks.create({
      title,
      description,
      status,
      dateLimit,
      categoryId,
      userId: req.user.id
    });

    res.status(201).json({
      message: "Tarea creada correctamente",
      task: newTask,
    });
  } catch (error) {
    console.error("Error al crear la tarea", error);
    res.status(500).json({ message: "Error al crear la tarea" });
  }
});

router.put("/tasks/:taskId", verifyToken, async (req, res) => {
  const { taskId } = req.params;
  let { title, description, status, dateLimit, categoryId } = req.body;

  if (!title || !description || !status || !dateLimit) {
    return res.status(400).json({ 
      message: "Todos los campos son requeridos",
      required: ["title", "description", "status", "dateLimit"]
    });
  }

  try {
    let formattedDateLimit;
    try {
      formattedDateLimit = dateLimit.includes('T') 
        ? new Date(dateLimit).toISOString()
        : new Date(dateLimit + 'T00:00:00').toISOString();
    } catch (error) {
      return res.status(400).json({ 
        message: "Formato de fecha inválido",
        expectedFormat: "YYYY-MM-DD o ISO String"
      });
    }

    const userId = req.user.id;
    
    const task = await Tasks.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      return res.status(404).json({ 
        message: "Tarea no encontrada o no pertenece al usuario",
        taskId,
        userId
      });
    }

  
    task.title = title;
    task.description = description;
    task.status = status;
    task.dateLimit = formattedDateLimit;
    
    if (categoryId) {
      task.categoryId = categoryId;
    }

  
    const updatedTask = await task.save();

    
    res.status(200).json({
      success: true,
      message: "Tarea actualizada correctamente",
      task: updatedTask
    });

  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    res.status(500).json({ 
      success: false,
      message: "Error interno al actualizar la tarea",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
router.delete("/tasks/:taskId", verifyToken, async (req, res) => {
  const { taskId } = req.params;

  try {
    const userId = req.user.id;
    const task = await Tasks.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    await task.destroy();

    res.status(200).json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la tarea", error);
    res.status(500).json({ message: "Error al eliminar la tarea" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mahia07112006@gmail.com",
    pass: "xbnh qlhn yhgr lfqd",
  },
});

router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const newToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET,
      { expiresIn: "15m" }
    );

  
    const link = `http://localhost:5173/reset-password/${newToken}`;

    await transporter.sendMail({
      from: '"Soporte App" <mahia07112006@gmail.com>',
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Hola ${user.email},</h2>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${link}">${link}</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
    });

    res.json({ message: "Se envió enlace de recuperación al correo" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ message: "Error al enviar correo de recuperación" });
  }
});


router.post("/resetPassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await Users.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    res.status(400).json({ message: "Token inválido o expirado" });
  }
});

router.post("/CreateCategory", verifyToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "El nombre es requerido" });
    }

    const existingCategory = await Category.findOne({
      where: { name, userId },
    });

    if (existingCategory) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }

    const newCategory = await Category.create({
      name,
      description,
      userId
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get("/getCategories", verifyToken, async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id }, 
    });

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return res
      .status(500)
      .json({ message: "Hubo un error al obtener las categorías" });
  }
});


router.delete("/deleteCategory/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOne({
      where: { id, userId: req.user.id }, 
    });

    if (!category) {
      console.log("Categoría no encontrada");
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await category.destroy();

    console.log(`Categoría eliminada: ${id}`);
    return res
      .status(200)
      .json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar categoría", error);
    return res
      .status(500)
      .json({ message: "Hubo un error al eliminar la categoría" });
  }
});
router.put("/categories/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    res.status(500).json({ message: "Error al actualizar la categoría" });
  }
});
router.get("/tasksByCategory/:categoryId", verifyToken, async (req, res) => {
  const { categoryId } = req.params;
  const userId = req.user.id;

  try {
    const tasks = await Tasks.findAll({
      where: { userId, categoryId },
      order: [
        [sequelize.literal("dateLimit IS NULL"), "ASC"],
        ["dateLimit", "ASC"],
      ],
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error al obtener las tareas por categoría", error);
    res
      .status(500)
      .json({ message: "Error al obtener las tareas por categoría" });
  }
});

export default router;
