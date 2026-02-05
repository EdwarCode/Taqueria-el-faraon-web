import React, { useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CustomerPage = () => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    paymentMethod: 'Efectivo al recoger'
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const loadMenu = async () => {
      const response = await fetch(`${API_URL}/api/menu`);
      const data = await response.json();
      setMenu(data);
    };
    loadMenu();
  }, []);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = cart.reduce((sum, item) => {
      if (item.type === 'anafre') {
        return sum + item.price * item.quantity * 0.1;
      }
      return sum;
    }, 0);
    const total = subtotal - discount;
    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    };
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: Number(quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    const payload = {
      customerName: form.customerName,
      phone: form.phone,
      items: cart.map(({ name, price, type, quantity }) => ({
        name,
        price,
        type,
        quantity
      }))
    };

    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setStatus('¡Pedido enviado! Te avisaremos cuando esté listo.');
      setCart([]);
      setForm((prev) => ({ ...prev, customerName: '', phone: '' }));
    } else {
      setStatus('No se pudo enviar tu pedido. Intenta nuevamente.');
    }
  };

  return (
    <main className="container grid grid-2">
      <section className="card">
        <h2>Menú</h2>
        <p>Selecciona tus tacos o el anafre familiar.</p>
        <div className="grid">
          {menu.map((item) => (
            <div className="card" key={item._id} style={{ padding: '16px' }}>
              <h3>{item.name}</h3>
              <p>${item.price} MXN</p>
              {item.type === 'anafre' && (
                <span className="badge">10% descuento</span>
              )}
              <button className="button" onClick={() => addToCart(item)}>
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Tu pedido</h2>
        <div className="grid">
          {cart.length === 0 ? (
            <p>Agrega productos para comenzar.</p>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="card" style={{ padding: '12px' }}>
                <h4>{item.name}</h4>
                <p>${item.price} MXN</p>
                <label>
                  Cantidad
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item._id, event.target.value)}
                  />
                </label>
              </div>
            ))
          )}
        </div>

        <div className="card" style={{ marginTop: '16px' }}>
          <p>Subtotal: ${totals.subtotal} MXN</p>
          <p>Descuento: ${totals.discount} MXN</p>
          <h3>Total: ${totals.total} MXN</h3>
        </div>

        <form className="grid" onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              required
              value={form.customerName}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, customerName: event.target.value }))
              }
            />
          </div>
          <div>
            <label>Teléfono</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, phone: event.target.value }))
              }
            />
          </div>
          <div>
            <label>Método de pago</label>
            <select value={form.paymentMethod} disabled>
              <option>Efectivo al recoger</option>
            </select>
          </div>
          <button className="button" type="submit" disabled={cart.length === 0}>
            Enviar pedido
          </button>
          {status && <p>{status}</p>}
        </form>
      </section>
    </main>
  );
};

export default CustomerPage;
