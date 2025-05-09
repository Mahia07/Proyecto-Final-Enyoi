import React, { useState } from "react";
import { forgotPassword } from "../../Api/api.js";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await forgotPassword(email);
      setMessage(response.message); 
      setEmail("");
    } catch (err) {
      setError(err.message || "Error al enviar el correo");
    }
  };

  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="formTitle">Recuperar contraseña</h2>

        <div className="inputGroup">
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submitButton">
          Enviar enlace
        </button>

        {message && <p className="successMessage">{message}</p>}
        {error && <p className="errorMessage">{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
