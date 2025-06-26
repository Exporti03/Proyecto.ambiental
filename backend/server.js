const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ignorar favicon
app.use((req, res, next) => {
  if (req.url.includes('favicon.ico')) return res.status(204).end();
  next();
});

// Archivos estáticos
const staticPath = path.join(__dirname, '../frontend');
app.use(express.static(staticPath));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Rutas de la API
const registroRouter = require('./routes/registrocontroller');
const loginRouter = require('./routes/logincontroller');
app.use('/api', registroRouter);
app.use('/api', loginRouter);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Archivos estáticos desde: ${staticPath}`);
});
