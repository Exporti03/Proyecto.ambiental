// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// 🧩 Middlewares
app.use(cors());
app.use(express.json());

// Ignorar favicon
app.use((req, res, next) => {
  if (req.url.includes('favicon.ico')) return res.status(204).end();
  next();
});

// 📁 Archivos estáticos
const staticFrontend = path.join(__dirname, '../frontend');
const staticPortafolio = path.join(__dirname, '../portafolioweb');

app.use(express.static(staticFrontend));
app.use('/portafolioweb', express.static(staticPortafolio));

// 🏠 Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(staticFrontend, 'index.html'));
});

// 📦 Rutas API (Controladores)
const registroRouter = require('./routes/registrocontroller');
const loginRouter = require('./routes/logincontroller');
const clientesRouter = require('./routes/clientescontroller');
const empresaRouter = require('./routes/empresa.controller');
const clienteRouter = require('./routes/cliente.controller');
const asociacionesRouter = require('./routes/asociaciones.controller'); // 🆕

app.use('/api', registroRouter);
app.use('/api', loginRouter);
app.use('/api', clientesRouter);
app.use('/api', empresaRouter);
app.use('/api', clienteRouter);
app.use('/api', asociacionesRouter); // 🆕 Rutas de conexión entre usuarios y empresas

// ❌ Página no encontrada
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📁 Frontend servido desde: ${staticFrontend}`);
  console.log(`📁 Portafolio desde: ${staticPortafolio}`);
});
