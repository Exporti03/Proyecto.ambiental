document.addEventListener('DOMContentLoaded', async () => {
  const empresa = JSON.parse(localStorage.getItem('empresa'));
  const userButton = document.getElementById('user-button');
  if (empresa && empresa.nombre_empresa) {
    userButton.textContent = `👤 ${empresa.nombre_empresa}`;
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('empresa');
      window.location.href = '../index.html';
    });
  }

  await cargarSolicitudes(empresa.id);
  await cargarClientesAsociados(empresa.id);
});

async function cargarSolicitudes(empresaId) {
  const res = await fetch(`/api/empresa/${empresaId}/solicitudes`);
  const clientes = await res.json();
  const container = document.getElementById('clientes-container');
  container.innerHTML = '';

  clientes.forEach(cliente => {
    const card = document.createElement('div');
    card.className = 'cliente-card';
    card.innerHTML = `
      <div class="card-header">
        <h3>${cliente.nombre}</h3>
        <span class="estado-pendiente">Pendiente</span>
      </div>
      <p><strong>Correo:</strong> ${cliente.correo}</p>
      <div class="acciones">
        <button onclick="aceptarSolicitud(${empresaId}, ${cliente.id})" class="btn-aceptar">Aceptar</button>
        <button onclick="rechazarSolicitud(${empresaId}, ${cliente.id})" class="btn-rechazar">Rechazar</button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function cargarClientesAsociados(empresaId) {
  const res = await fetch(`/api/empresa/${empresaId}/clientes`);
  const clientes = await res.json();
  const tbody = document.getElementById('clientesAsociados');
  tbody.innerHTML = '';

  clientes.forEach(cliente => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cliente.nombre}</td>
      <td>${cliente.correo}</td>
      <td><span class="estado activo">Aceptado</span></td>
    `;
    tbody.appendChild(tr);
  });
}

async function aceptarSolicitud(empresaId, clienteId) {
  const res = await fetch(`/api/empresa/${empresaId}/solicitud/${clienteId}/aceptar`, {
    method: 'POST'
  });
  if (res.ok) {
    alert('Solicitud aceptada.');
    cargarSolicitudes(empresaId);
    cargarClientesAsociados(empresaId);
  } else {
    alert('Error al aceptar solicitud.');
  }
}

async function rechazarSolicitud(empresaId, clienteId) {
  const res = await fetch(`/api/empresa/${empresaId}/solicitud/${clienteId}/rechazar`, {
    method: 'POST'
  });
  if (res.ok) {
    alert('Solicitud rechazada.');
    cargarSolicitudes(empresaId);
  } else {
    alert('Error al rechazar solicitud.');
  }
}
