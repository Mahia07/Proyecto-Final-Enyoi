import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../Api/api.js";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    navigate("/Home");

    try {
      const result = await login(formData);
      localStorage.setItem("token", result.token);
      console.log("Respuesta del servidor:", result);
      setSuccess(true);
    } catch (error) {
      console.error("Error capturado en el catch:", error);
      setError("Error al iniciar sesión");
    }
  };
  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="formTitle">Iniciar Sesión</h2>
        <div className="inputGroup">
          <label>Correo electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputGroup">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <p
            className="formText"
            onClick={() => navigate("/ForgotPassword")}
            
          >
            ¿Olvidaste tu contraseña?
          </p>
        </div>

        <button type="submit" className="submitButton">
          Entrar
        </button>
        <p onClick={() => navigate("/register")} className="formText">
          No estas Registrado?
        </p>
      </form>
    </div>
  );
};
export default LoginForm;
