import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { Users } from "../models/users.js";
import { Tasks } from "../models/tasks.js";
import { Category } from "../models/category.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import colors from "colors";
import dotenv from "dotenv";
import nodemailer from 'nodemailer'

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
      return res.status(404).send("No se envontro usuario");
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

router.post("/createTasks", verifyToken, async (req, res) => {
  const { title, description, status, dateLimit } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ message: "El título es obligatorio" });
    }

    const newTask = await Tasks.create({
      title,
      description,
      status,
      dateLimit,
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

router.delete("/tasks/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Tasks.findByPk(id);

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
      console.log("Usuario no encontrado");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    
    const newToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET,
      { expiresIn: "15m" }
    );

  
    const link = `http://localhost:3000/forgotPassword/${newToken}`;
    console.log("Enlace de recuperación generado:", link);

    // 4. Enviar correo
    await transporter.sendMail({
      from: '"Soporte App" <Mahia07112006@gmail.com>',
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <p>Hola ${user.email},</p>
        <p>Haz clic en este enlace para restablecer tu contraseña:</p>
        <a href="${link}">${link}</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
    });

  
    res.json({ message: "Se envió enlace de recuperación al correo" });

  } catch (error) {
    console.log("Error al restablecer contraseña:", error);
    res.status(500).json({ message: "Error del servidor al restablecer contraseña" });
  }
});
router.post("/createCategories", async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCategory = await Category.create({ name, description });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ message: "Error al crear la categoría" });
  }
});
router.get("/getCategories", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías" });
  }
});

router.delete("deleteCategories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await category.destroy();
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    res.status(500).json({ message: "Error al eliminar la categoría" });
  }
});
router.put("/updateCategories/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    category.name = name ?? category.name;
    category.description = description ?? category.description;

    await category.save();

    res.status(200).json({ message: "Categoría actualizada correctamente", category });
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    res.status(500).json({ message: "Error al actualizar la categoría" });
  }
});


export default router;
