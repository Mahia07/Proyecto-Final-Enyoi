import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../Api/api.js';

const Profile = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del usuario
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Debes iniciar sesión');
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getProfile(token);
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      await updateProfile({
        id: user.id,
        name: formData.name,
        email: formData.email,
        token
      });
      
      setUser(prev => ({ ...prev, ...formData }));
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="profile-container">Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mi Perfil</h1>

      {error && (
        <div className="alert alert-error">
         
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          {success}
        </div>
      )}

      {!isEditing ? (
        <div className="profile-view">
          <div className="profile-field">
            <label>Nombre:</label>
            <p className="profile-value">{user.name}</p>
          </div>
          
          <div className="profile-field">
            <label>Email:</label>
            <p className="profile-value">{user.email}</p>
          </div>
          
          <button
            type="button"
            className="btn btn-edit"
            onClick={() => setIsEditing(true)}
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-edit"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user.name,
                  email: user.email
                });
                setError('');
              }}
              disabled={isLoading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="btn-edit"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;