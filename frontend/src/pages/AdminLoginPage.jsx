import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setError('Credenciales inválidas.');
      return;
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    navigate('/admin/dashboard');
  };

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: '480px', margin: '0 auto' }}>
        <h2>Acceso administrador</h2>
        <p>Inicia sesión para gestionar pedidos en tiempo real.</p>
        <form className="grid" onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>
          <div>
            <label>Contraseña</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
            />
          </div>
          <button className="button" type="submit">
            Ingresar
          </button>
          {error && <p style={{ color: '#b23a2b' }}>{error}</p>}
        </form>
      </div>
    </main>
  );
};

export default AdminLoginPage;
