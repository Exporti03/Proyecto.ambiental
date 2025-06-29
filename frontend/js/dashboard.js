document.addEventListener('DOMContentLoaded', async () => {
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
    console.warn('⚠️ No se encontró el botón de cerrar sesión (logoutBtn)');
  }

  console.log("✅ dashboard.js cargado correctamente");

  await cargarEmpresas();
  await cargarEmpresasAsociadas(usuario.id);
});

// 🔽 Cargar empresas registradas
async function cargarEmpresas() {
  try {
    const res = await fetch('/api/empresas');
    const empresas = await res.json();

    console.log("🧾 Empresas recibidas:", empresas);

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
        <td><button class="btn-asociar" onclick="asociarEmpresa(${emp.id})">➕ Asociar</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('❌ Error al cargar empresas:', error);
  }
}

// 🔽 Asociar empresa al usuario actual
async function asociarEmpresa(empresaId) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) {
    customAlert('Debes iniciar sesión.', 'error');
    return;
  }

  try {
    const res = await fetch('/api/asociar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario_id: usuario.id,
        empresa_id: empresaId
      })
    });

    if (res.ok) {
      customAlert('✅ Empresa asociada exitosamente.', 'success');
      await cargarEmpresasAsociadas(usuario.id);
    } else {
      const err = await res.json();
      customAlert('❌ Error al asociar: ' + (err.message || 'Error desconocido.'), 'error');
    }
  } catch (error) {
    console.error('❌ Error al asociar empresa:', error);
    customAlert('❌ Error al asociar empresa (red o servidor).', 'error');
  }
}

// 🔽 Cargar empresas asociadas al usuario
async function cargarEmpresasAsociadas(usuarioId) {
  try {
    const res = await fetch(`/api/usuarios/${usuarioId}/empresas`);
    const asociadas = await res.json();

    console.log("📎 Empresas asociadas:", asociadas);

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
  } catch (error) {
    console.error('❌ Error al cargar empresas asociadas:', error);
  }
}

// 🔔 Función para mostrar alertas amigables
function customAlert(message, type = 'info') {
  const colors = {
    success: 'green',
    error: 'red',
    info: 'blue'
  };
  const color = colors[type] || 'gray';

  const alertBox = document.createElement('div');
  alertBox.textContent = message;
  alertBox.style.position = 'fixed';
  alertBox.style.bottom = '20px';
  alertBox.style.right = '20px';
  alertBox.style.backgroundColor = color;
  alertBox.style.color = 'white';
  alertBox.style.padding = '10px 20px';
  alertBox.style.borderRadius = '5px';
  alertBox.style.zIndex = '1000';
  document.body.appendChild(alertBox);

  setTimeout(() => alertBox.remove(), 3000);
}

// ✅ Hacer pública la función para uso desde el HTML
window.asociarEmpresa = asociarEmpresa;
