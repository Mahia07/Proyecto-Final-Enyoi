import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../Api/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña");
    }
  };

  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="formTitle">Nueva contraseña</h2>

        <div className="inputGroup">
          <label>Nueva contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submitButton">
          Cambiar contraseña
        </button>

        {message && <p className="successMessage">{message}</p>}
        {error && <p className="errorMessage">{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
