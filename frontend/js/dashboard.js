document.addEventListener('DOMContentLoaded', function () {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const userButton = document.getElementById('user-button');

  function capitalizeName(name) {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (usuario && usuario.nombre) {
    userButton.textContent = `👤 ${capitalizeName(usuario.nombre)}`;
  } else {
    userButton.textContent = '👤 Usuario Invitado';
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('usuario');
      window.location.href = '../index.html';
    });
  } else {
    console.warn('No se encontró el botón de cerrar sesión (logoutBtn)');
  }

  // 🔽 Aquí llamamos la función para mostrar empresas
  cargarEmpresas();
});

async function cargarEmpresas() {
  try {
    const res = await fetch('/api/empresas');
    const empresas = await res.json();

    console.log("🧾 Empresas recibidas del backend:", empresas);

    const tbody = document.getElementById('tablaEmpresas');
    tbody.innerHTML = '';

    empresas.forEach(emp => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${emp.nombre}</td>
        <td>${emp.nit}</td>
        <td>${emp.direccion}</td>
        <td>${emp.telefono}</td>
        <td>${emp.email}</td>
        <td>${emp.sector || 'No definido'}</td>
        <td><button onclick="asociarEmpresa(${emp.id})">➕ Asociar</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('❌ Error al cargar empresas:', error);
  }
}
