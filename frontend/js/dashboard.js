// dashboard.js

document.addEventListener('DOMContentLoaded', function() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const userButton = document.getElementById('user-button');
  
  // Función para capitalizar el nombre
  function capitalizeName(name) {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Mostrar nombre o invitado
  if (usuario && usuario.nombre) {
    userButton.textContent = capitalizeName(usuario.nombre);
  } else {
    userButton.textContent = 'Usuario Invitado';
  }
  
  // Cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html'; // Página login
  });
});