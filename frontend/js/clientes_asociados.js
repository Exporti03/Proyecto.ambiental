document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.id) {
    console.error('No se encontró usuario en localStorage');
    return;
  }
  const empresaId = usuario.id;

  try {
    const res = await fetch(`/api/empresa/clientes/${empresaId}`);
    if (!res.ok) throw new Error('Error en la respuesta del servidor');
    const clientes = await res.json();

    const tbody = document.querySelector('#clientes-table tbody');
    tbody.innerHTML = '';

    clientes.forEach(cliente => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cliente.nombre || 'Sin nombre'}</td>
        <td>${cliente.correo}</td>
        <td>
          <button onclick="verProyectos(${cliente.id})">Ver Proyectos</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error cargando clientes:', error);
  }
});

function verProyectos(clienteId) {
  window.location.href = `proyectos_cliente.html?id=${clienteId}`;
}
