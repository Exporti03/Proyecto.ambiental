document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || usuario.tipo !== 'empresa') {
    console.warn('⚠️ Usuario no válido o no es empresa.');
    return;
  }

  await cargarSolicitudesPendientes(usuario.id);
  await cargarClientesAceptados(usuario.id);
});

// 🔽 Solicitudes pendientes de asociación
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
      tarjeta.className = 'tarjeta-cliente';
      tarjeta.innerHTML = `
        <p><strong>Nombre:</strong> ${cliente.nombre}</p>
        <p><strong>Correo:</strong> ${cliente.correo}</p>
        <div class="acciones">
          <button onclick="aceptarSolicitud(${empresaId}, ${cliente.id})">✅ Aceptar</button>
          <button onclick="rechazarSolicitud(${empresaId}, ${cliente.id})">❌ Rechazar</button>
        </div>
      `;
      contenedor.appendChild(tarjeta);
    });
  } catch (error) {
    console.error('❌ Error al cargar solicitudes pendientes:', error);
  }
}

// 🔽 Clientes ya aceptados
async function cargarClientesAceptados(empresaId) {
  try {
    const res = await fetch(`/api/empresa/${empresaId}/clientes`);
    const clientes = await res.json();

    const tbody = document.getElementById('clientesAsociados');
    tbody.innerHTML = '';

    if (clientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">No hay clientes asociados.</td></tr>';
      return;
    }

    clientes.forEach(cliente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cliente.nombre}</td>
        <td>${cliente.correo}</td>
        <td>Aceptado</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('❌ Error al cargar clientes aceptados:', error);
  }
}

// 🔽 Aceptar solicitud
async function aceptarSolicitud(empresaId, clienteId) {
  try {
    const res = await fetch(`/api/empresa/${empresaId}/solicitud/${clienteId}/aceptar`, {
      method: 'POST'
    });

    if (res.ok) {
      alert('✅ Solicitud aceptada.');
      await cargarSolicitudesPendientes(empresaId);
      await cargarClientesAceptados(empresaId);
    } else {
      const err = await res.json();
      alert('❌ ' + (err.error || 'Error al aceptar.'));
    }
  } catch (error) {
    console.error('❌ Error al aceptar solicitud:', error);
  }
}

// 🔽 Rechazar solicitud
async function rechazarSolicitud(empresaId, clienteId) {
  try {
    const res = await fetch(`/api/empresa/${empresaId}/solicitud/${clienteId}/rechazar`, {
      method: 'POST'
    });

    if (res.ok) {
      alert('🗑️ Solicitud rechazada.');
      await cargarSolicitudesPendientes(empresaId);
    } else {
      const err = await res.json();
      alert('❌ ' + (err.error || 'Error al rechazar.'));
    }
  } catch (error) {
    console.error('❌ Error al rechazar solicitud:', error);
  }
}

// Hacer públicas para el HTML
window.aceptarSolicitud = aceptarSolicitud;
window.rechazarSolicitud = rechazarSolicitud;
