CREATE DATABASE proyectos;

USE proyecto;

create table usuarios (
id int auto_increment primary KEY,
correo varchar(100) NOT NULL UNIQUE,
contraseña varchar(255) not null,
tipo ENUM('personal', 'empresa') NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table datos_personales (
ID INT auto_increment primary key,
usuario_id INT,
nombre varchar(200),
foreign key (usuario_id) references usuarios (id)
);

create table datos_empresas (
id int auto_increment primary key,
usuario_id INT,
nombre_empresa varchar(150),
nit varchar(50),
responsable varchar(100),
telefono varchar(20),
direccion varchar(50)
foreign key (usuario_id) REFERENCES usuarios(id)
);




