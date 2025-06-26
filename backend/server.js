const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// Ignorar favicon
app.use((req, res, next) => {
  if (req.url.includes('favicon.ico')) return res.status(204).end();
  next();
});

app.use(cors());
app.use(express.json());

// Archivos estáticos
const staticPath = path.join(__dirname, '../frontend');
app.use(express.static(staticPath));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Ruta API
const registroRouter = require('./routes/registrocontroller');
app.use('/api', registroRouter);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Archivos estáticos en: ${staticPath}`);
});
