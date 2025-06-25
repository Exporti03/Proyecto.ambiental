const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 👉 Importar tu ruta
const registroRoute = require('./routes/registroRoutes'); // o './registroController' según el nombre
app.use('/api', registroRoute);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});