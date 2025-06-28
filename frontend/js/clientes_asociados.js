document.addEventListener('DOMContentLoaded', () => {
  // Datos fijos para demo visual
  const clientes = [
    { id: 1, nombre: 'Juan Pérez', correo: 'juan@example.com' },
    { id: 2, nombre: 'Ana Gómez', correo: 'ana@example.com' },
    { id: 3, nombre: 'Luis Martínez', correo: 'luis@example.com' }
  ];

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
        <button onclick="aceptarSolicitud(${cliente.id})" class="btn-aceptar">Aceptar</button>
        <button onclick="rechazarSolicitud(${cliente.id})" class="btn-rechazar">Rechazar</button>
      </div>
    `;

    container.appendChild(card);
  });
});

function aceptarSolicitud(id) {
  alert(`Solicitud aceptada para cliente con ID: ${id}`);
}

function rechazarSolicitud(id) {
  alert(`Solicitud rechazada para cliente con ID: ${id}`);
}

