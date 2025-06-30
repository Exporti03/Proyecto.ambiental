// logincontroller.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Andres2025#',
  database: 'proyectos'
});

router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena, tipo } = req.body;

    if (!correo || !contrasena || !tipo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    console.log('Intentando login con:', correo, tipo);
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ? AND tipo = ?', [correo, tipo]);
    console.log('Usuario encontrado:', rows);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado o tipo incorrecto' });
    }

    const usuario = rows[0];

    const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    if (tipo === 'personal') {
      const [resPersonal] = await db.query('SELECT nombre FROM datos_personales WHERE usuario_id = ?', [usuario.id]);
      const nombre = resPersonal.length > 0 ? resPersonal[0].nombre : 'No registrado';

      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        usuario: {
          id: usuario.id,
          correo: usuario.correo,
          tipo: usuario.tipo,
          nombre,
          fechaRegistro: usuario.fecha_registro
        }
      });
    }

    if (tipo === 'empresa') {
      const [resEmpresa] = await db.query(
        `SELECT 
          nombre_empresa AS nombre,
          nit,
          direccion,
          telefono,
          responsable AS representante,
          sector
         FROM datos_empresas WHERE usuario_id = ?`,
        [usuario.id]
      );

      if (resEmpresa.length === 0) {
        return res.status(404).json({ error: 'Datos de empresa no encontrados' });
      }

      const empresa = resEmpresa[0];

      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        usuario: {
          id: usuario.id,
          correo: usuario.correo,
          tipo: usuario.tipo,
          nombre: empresa.nombre,
          nit: empresa.nit,
          direccion: empresa.direccion,
          telefono: empresa.telefono,
          representante: empresa.representante,
          sector: empresa.sector || 'No registrado',
          fechaRegistro: usuario.fecha_registro
        }
      });
    }

    return res.status(400).json({ error: 'Tipo de usuario inválido' });

  } catch (error) {
    console.error('Error en /login:', error);
    return res.status(500).json({ error: 'Error en el servidor', detalles: error.message });
  }
});

module.exports = router;
