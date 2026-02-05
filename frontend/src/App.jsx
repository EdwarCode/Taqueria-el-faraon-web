import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const App = () => {
  return (
    <div>
      <header className="container header">
        <span className="badge">Taquería El Faraón</span>
        <h1>Pedidos en línea rápidos y calientes</h1>
        <p>
          Haz tu pedido en minutos o ingresa al panel de administración para
          gestionarlo en tiempo real.
        </p>
        <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link className="button" to="/">
            Pedir ahora
          </Link>
          <Link className="button button-outline" to="/admin">
            Administración
          </Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </div>
  );
};

export default App;
