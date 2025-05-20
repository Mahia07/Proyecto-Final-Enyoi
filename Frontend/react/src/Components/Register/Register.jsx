import { useState } from "react";
import { register } from "../../Api/api.js";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
  });
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((Data) => ({ ...Data, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    navigate('/login')

    try {
      await register(formData);
      setSuccess(true);
    } catch (error) {
      setError("Error al registrar usuario");
    }
  };

  return (
    <>
      <div className="formContainer">
        <form onSubmit={handleSubmit} className="form">
          <h2 className="formTitle">Registro</h2>

          <div className="inputGroup">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputGroup">
            <label>Correo</label>
            <input
              type="email"
              name="email"
              placeholder="Correo Electronico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputGroup">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="message">{error}</p>}
          {success && <p className="message">Usuario registrado con exito!</p>}
          <button type="submit" className="submitButton">
            Registrarse
          </button>

          <p onClick={() => navigate('/login')} className="formText">¿Ya tienes cuenta?</p>

        </form>
      </div>
    </>
  );
};

export default RegisterForm;
