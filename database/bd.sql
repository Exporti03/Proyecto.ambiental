-- Crear base de datos y seleccionarla
CREATE DATABASE IF NOT EXISTS proyectos;
USE proyectos;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  tipo ENUM('personal', 'empresa') NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos personales (para usuarios tipo 'personal')
CREATE TABLE datos_personales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Datos de empresa (para usuarios tipo 'empresa')
CREATE TABLE datos_empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre_empresa VARCHAR(150) NOT NULL,
  nit VARCHAR(50) NOT NULL,
  responsable VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  sector VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Proyectos formulados por empresas
CREATE TABLE proyectos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado ENUM('pendiente', 'en_proceso', 'finalizado') DEFAULT 'pendiente',
  fecha_inicio DATE,
  fecha_entrega DATE,
  FOREIGN KEY (empresa_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Relación entre empresas y clientes (asociaciones)
CREATE TABLE empresa_clientes (
  empresa_id INT NOT NULL,
  cliente_id INT NOT NULL,
  estado ENUM('Pendiente', 'Aceptado', 'Rechazado') DEFAULT 'Pendiente',
  PRIMARY KEY (empresa_id, cliente_id),
  FOREIGN KEY (empresa_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Documentos subidos por los clientes para proyectos
CREATE TABLE documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proyecto_id INT NOT NULL,
  cliente_id INT NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  url_archivo TEXT NOT NULL,
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

USE proyectos;

CREATE TABLE empresa_clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  cliente_id INT NOT NULL,
  estado ENUM('Pendiente', 'Aceptado') DEFAULT 'Pendiente',
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
