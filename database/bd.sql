CREATE DATABASE proyectos;

USE proyectos;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  tipo ENUM('personal', 'empresa') NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE datos_personales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  nombre VARCHAR(200),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE datos_empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  nombre_empresa VARCHAR(150),
  nit VARCHAR(50),
  responsable VARCHAR(100),
  telefono VARCHAR(20),
  direccion VARCHAR(50),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

