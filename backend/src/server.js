require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const app = require('./app');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

const PORT = process.env.PORT || 4000;

const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'Tacos al pastor', price: 22, type: 'taco' },
      { name: 'Bistec', price: 25, type: 'taco' },
      { name: 'Chuleta', price: 26, type: 'taco' },
      { name: 'Anafre para 5 personas', price: 320, type: 'anafre' }
    ]);
  }
};

const ensureAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('Admin credentials not set in env.');
    return;
  }

  const existing = await Admin.findOne({ email: ADMIN_EMAIL });
  if (!existing) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({ email: ADMIN_EMAIL, passwordHash });
  }
};

const startServer = async () => {
  await connectDB(process.env.MONGO_URI);
  await seedProducts();
  await ensureAdmin();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
