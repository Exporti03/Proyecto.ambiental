// 📁 public/js/clientes_asociados.js

document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || usuario.tipo !== 'empresa') {
    alert('Debes iniciar sesión como empresa.');
    window.location.href = '../index.html';
    return;
  }

  const userButton = document.getElementById('user-button');
  if (usuario && usuario.nombre) {
    userButton.textContent = `👤 ${capitalize(usuario.nombre)}`;
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
  });

  await cargarSolicitudesPendientes(usuario.id);
  await cargarClientesAceptados(usuario.id);
});

function capitalize(str) {
  return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// 🔽 Solicitudes pendientes de clientes
async function cargarSolicitudesPendientes(empresaId) {
  try {
    const res = await fetch(`/api/empresa/${empresaId}/solicitudes`);
    const solicitudes = await res.json();

    const contenedor = document.getElementById('clientes-container');
    contenedor.innerHTML = '';

    if (solicitudes.length === 0) {
      contenedor.innerHTML = '<p>No hay solicitudes pendientes.</p>';
      return;
    }

    solicitudes.forEach(cliente => {
      const tarjeta = document.createElement('div');
      tarjeta.classList.add('tarjeta-cliente');

      tarjeta.innerHTML = `
        <h3>${capitalize(cliente.nombre)}</h3>
        <p>${cliente.correo}</p>
        <div class="acciones">
          <button onclick="aceptarSolicitud(${empresaId}, ${cliente.id})">Aceptar</button>
          <button onclick="rechazarSolicitud(${empresaId}, ${cliente.id})">Rechazar</button>
        </div>
      `;

      contenedor.appendChild(tarjeta);
    });
  } catch (error) {
    console.error('❌ Error al cargar solicitudes:', error);
  }
}

// 🔽 Clientes ya asociados (aceptados)
async function cargarClientesAceptados(empresaId) {
  try {
    const res = await fetch(`/api/empresa/${empresaId}/clientes`);
    const clientes = await res.json();

    const tbody = document.getElementById('clientesAsociados');
    tbody.innerHTML = '';

    clientes.forEach(cliente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${capitalize(cliente.nombre)}</td>
        <td>${cliente.correo}</td>
        <td>Aceptado</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('❌ Error al cargar clientes asociados:', error);
  }
}

// 🔘 Aceptar solicitud
async function aceptarSolicitud(empresaId, clienteId) {
  try {
    const res = await fetch(`/api/empresa/${empresaId}/solicitud/${clienteId}/aceptar`, {
      method: 'POST'
    });

    if (res.ok) {
      alert('✅ Cliente aceptado');
      await cargarSolicitudesPendientes(empresaId);
      await cargarClientesAceptados(empresaId);
    } else {
      const error = await res.json();
      alert('❌ ' + error.error);
    }
  } catch (error) {
    console.error('❌ Error al aceptar solicitud:', error);
  }
}

// ⛔ Rechazar solicitud
async function rechazarSolicitud(empresaId, clienteId) {
  try {
    const res = await fetch(`/api/empresa/${empresaId}/solicitud/${clienteId}/rechazar`, {
      method: 'POST'
    });

    if (res.ok) {
      alert('⛔ Solicitud rechazada');
      await cargarSolicitudesPendientes(empresaId);
    } else {
      const error = await res.json();
      alert('❌ ' + error.error);
    }
  } catch (error) {
    console.error('❌ Error al rechazar solicitud:', error);
  }
}

window.aceptarSolicitud = aceptarSolicitud;
window.rechazarSolicitud = rechazarSolicitud;


