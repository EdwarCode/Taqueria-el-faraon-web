import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const statusLabels = {
  pendiente: 'Pendiente',
  preparando: 'Preparando',
  listo: 'Listo'
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    const fetchOrders = async () => {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    };

    fetchOrders();

    const socket = io(API_URL, { transports: ['websocket'] });
    socket.on('order:new', (order) => {
      setOrders((prev) => [order, ...prev]);
    });
    socket.on('order:update', (updated) => {
      setOrders((prev) =>
        prev.map((order) => (order._id === updated._id ? updated : order))
      );
    });

    return () => socket.disconnect();
  }, [navigate, token]);

  const totalSales = useMemo(() => {
    const today = new Date().toDateString();
    return orders
      .filter((order) => new Date(order.createdAt).toDateString() === today)
      .reduce((sum, order) => sum + order.total, 0)
      .toFixed(2);
  }, [orders]);

  const updateStatus = async (orderId, status) => {
    await fetch(`${API_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
  };

  return (
    <main className="container">
      <div className="card" style={{ marginBottom: '16px' }}>
        <h2>Panel de pedidos</h2>
        <p>Ventas del día: ${totalSales} MXN</p>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Pedido</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <strong>{order.customerName}</strong>
                  <div>{order.phone}</div>
                </td>
                <td>
                  {order.items.map((item) => (
                    <div key={`${order._id}-${item.name}`}>
                      {item.quantity} x {item.name}
                    </div>
                  ))}
                </td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span className={`status-pill status-${order.status}`}>
                      {statusLabels[order.status]}
                    </span>
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order._id, event.target.value)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="preparando">Preparando</option>
                      <option value="listo">Listo</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
