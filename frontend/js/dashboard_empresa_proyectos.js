document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#proyectos-table tbody');
  const buscarInput = document.getElementById('buscarProyecto');
  const filtroEstado = document.getElementById('filtroEstado');
  const btnNuevoProyecto = document.getElementById('btnNuevoProyecto');

  let proyectos = [];

  // Cargar proyectos desde la API
  async function cargarProyectos() {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const empresaId = usuario?.id;

      if (!empresaId) throw new Error('No se encontró ID de empresa');

      const res = await fetch(`/api/empresa/proyectos/${empresaId}`);
      proyectos = await res.json();
      mostrarProyectos(proyectos);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
      tbody.innerHTML = `<tr><td colspan="6">No se pudieron cargar los proyectos.</td></tr>`;
    }
  }

  // Mostrar proyectos en la tabla
  function mostrarProyectos(lista) {
    tbody.innerHTML = '';

    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">No hay proyectos que mostrar.</td></tr>`;
      return;
    }

    lista.forEach(proyecto => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${proyecto.titulo}</td>
        <td>${proyecto.descripcion?.length > 50 ? proyecto.descripcion.substring(0, 50) + '...' : proyecto.descripcion || '-'}</td>
        <td><span class="estado ${proyecto.estado.replace('_', '-')}">${proyecto.estado.replace('_', ' ')}</span></td>
        <td>${proyecto.fecha_inicio || '-'}</td>
        <td>${proyecto.fecha_entrega || '-'}</td>
        <td>
          <button class="btn-ver" title="Ver detalles" onclick="verDetalles(${proyecto.id})">👁️</button>
          <button class="btn-editar" title="Editar" onclick="editarProyecto(${proyecto.id})">✏️</button>
          <button class="btn-eliminar" title="Eliminar" onclick="eliminarProyecto(${proyecto.id})">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Funciones para botones
  window.verDetalles = (id) => {
    window.location.href = `detalle_proyecto.html?id=${id}`;
  };

  window.editarProyecto = (id) => {
    window.location.href = `editar_proyecto.html?id=${id}`;
  };

  window.eliminarProyecto = async (id) => {
    if (confirm('¿Estás seguro que deseas eliminar este proyecto?')) {
      try {
        const res = await fetch(`/api/proyectos/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          alert('Proyecto eliminado');
          cargarProyectos();
        } else {
          alert('Error al eliminar el proyecto');
        }
      } catch (err) {
        alert('Error de red o servidor');
      }
    }
  };

  // Filtrar y buscar
  function aplicarFiltros() {
    const textoBusqueda = buscarInput.value.toLowerCase();
    const estadoFiltro = filtroEstado.value;

    const filtrados = proyectos.filter(proyecto => {
      const matchesBusqueda = proyecto.titulo.toLowerCase().includes(textoBusqueda);
      const matchesEstado = estadoFiltro ? proyecto.estado === estadoFiltro : true;
      return matchesBusqueda && matchesEstado;
    });

    mostrarProyectos(filtrados);
  }

  buscarInput.addEventListener('input', aplicarFiltros);
  filtroEstado.addEventListener('change', aplicarFiltros);

  btnNuevoProyecto.addEventListener('click', () => {
    window.location.href = 'nuevo_proyecto.html';
  });

  cargarProyectos();
});
