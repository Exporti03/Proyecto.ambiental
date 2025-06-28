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
  sector VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE proyectos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado ENUM('pendiente', 'en_proceso', 'finalizado') DEFAULT 'pendiente',
  fecha_inicio DATE,
  fecha_entrega DATE,
  FOREIGN KEY (empresa_id) REFERENCES usuarios(id)
);

CREATE TABLE empresa_clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  cliente_id INT,
  FOREIGN KEY (empresa_id) REFERENCES usuarios(id),
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
);

CREATE TABLE documentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  proyecto_id INT,
  cliente_id INT,
  nombre_archivo VARCHAR(255),
  url_archivo TEXT,
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id),
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
);


