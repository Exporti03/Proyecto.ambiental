document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const userButton = document.getElementById('user-button');

  if (usuario && usuario.nombre) {
    userButton.textContent = `👤 ${capitalizeName(usuario.nombre)}`;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('usuario');
      window.location.href = '../index.html';
    });
  }

  await cargarEmpresas();
  await cargarEmpresasAsociadas(usuario.id);
});

function capitalizeName(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function cargarEmpresas() {
  const res = await fetch('/api/empresas'); // Ruta de tu backend
  const empresas = await res.json();
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
      <td>${emp.sector}</td>
      <td><button onclick="asociarEmpresa(${emp.id})">➕ Asociar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function cargarEmpresasAsociadas(usuarioId) {
  const res = await fetch(`/api/usuarios/${usuarioId}/empresas`);
  const asociadas = await res.json();
  const tbody = document.getElementById('tablaAsociadas');
  tbody.innerHTML = '';

  asociadas.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${emp.nombre}</td>
      <td>${emp.nit}</td>
      <td>${emp.email}</td>
      <td><span class="estado ${emp.estado.toLowerCase()}">${emp.estado}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

async function asociarEmpresa(empresaId) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const res = await fetch('/api/asociar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario_id: usuario.id, empresa_id: empresaId })
  });

  if (res.ok) {
    alert('Empresa asociada exitosamente.');
    cargarEmpresasAsociadas(usuario.id);
  } else {
    alert('Error al asociar empresa.');
  }
}
