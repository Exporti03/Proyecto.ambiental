document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || { id: 1 };
  const empresaId = usuario.id;

  try {
    // Simulación de datos para ejemplo visual:
    const proyectos = [
      {
        id: 1,
        titulo: 'Proyecto Verde',
        descripcion: 'Instalación de paneles solares',
        estado: 'pendiente',
        fechaInicio: '2025-06-01',
        fechaEntrega: '2025-08-30'
      },
      {
        id: 2,
        titulo: 'Mejoras Rurales',
        descripcion: 'Optimización de riego',
        estado: 'en-proceso',
        fechaInicio: '2025-05-01',
        fechaEntrega: '2025-09-15'
      },
      {
        id: 3,
        titulo: 'Educación Ambiental',
        descripcion: 'Capacitación en colegios',
        estado: 'finalizado',
        fechaInicio: '2025-01-10',
        fechaEntrega: '2025-04-10'
      }
    ];

    const tbody = document.querySelector('#proyectos-table tbody');
    tbody.innerHTML = '';

    proyectos.forEach(proyecto => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${proyecto.titulo}</td>
        <td>${proyecto.descripcion}</td>
        <td><span class="estado ${proyecto.estado}">${proyecto.estado.replace('-', ' ')}</span></td>
        <td>${proyecto.fechaInicio}</td>
        <td>${proyecto.fechaEntrega}</td>
        <td>
          <button class="btn-editar" onclick="editarProyecto(${proyecto.id})">✏️</button>
          <button class="btn-eliminar" onclick="eliminarProyecto(${proyecto.id})">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Error al cargar proyectos:', error);
  }
});

function editarProyecto(id) {
  alert(`Editar proyecto con ID: ${id}`);
}

function eliminarProyecto(id) {
  alert(`Eliminar proyecto con ID: ${id}`);
}
