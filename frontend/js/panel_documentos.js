document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.id) {
    console.error('Usuario no encontrado en localStorage');
    return;
  }
  const empresaId = usuario.id;

  const tablaBody = document.querySelector('#documentos-table tbody');
  const buscarInput = document.getElementById('buscarDocumento');
  const filtroSelect = document.getElementById('filtroTipo');
  const btnSubir = document.getElementById('btn-subir-documento');

  let documentos = [];

  async function cargarDocumentos() {
    try {
      const res = await fetch(`/api/empresa/documentos/${empresaId}`);
      if (!res.ok) throw new Error('Error en la respuesta del servidor');
      documentos = await res.json();
      mostrarDocumentos(documentos);
    } catch (error) {
      console.error('Error cargando documentos:', error);
    }
  }

  function mostrarDocumentos(lista) {
    tablaBody.innerHTML = '';
    if (lista.length === 0) {
      tablaBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No se encontraron documentos</td></tr>`;
      return;
    }
    lista.forEach(doc => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${doc.nombre}</td>
        <td>${doc.tipo}</td>
        <td>${new Date(doc.fecha_subida).toLocaleDateString()}</td>
        <td><span class="estado ${doc.estado.replace('_', '-')}">${doc.estado.replace('_', ' ')}</span></td>
        <td>
          <button class="btn-ver" onclick="verDocumento(${doc.id})" title="Ver Documento">👁️</button>
          <button class="btn-eliminar" onclick="eliminarDocumento(${doc.id})" title="Eliminar">🗑️</button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });
  }

  buscarInput.addEventListener('input', () => {
    filtrarYMostrar();
  });

  filtroSelect.addEventListener('change', () => {
    filtrarYMostrar();
  });

  function filtrarYMostrar() {
    const textoBusqueda = buscarInput.value.toLowerCase();
    const tipoFiltro = filtroSelect.value;

    const filtrados = documentos.filter(doc => {
      const matchesTexto = doc.nombre.toLowerCase().includes(textoBusqueda);
      const matchesTipo = tipoFiltro ? doc.tipo === tipoFiltro : true;
      return matchesTexto && matchesTipo;
    });

    mostrarDocumentos(filtrados);
  }

  btnSubir.addEventListener('click', () => {
    // Aquí podrías redirigir a un formulario para subir documentos o abrir un modal
    alert('Funcionalidad para subir documento aún no implementada.');
  });

  window.verDocumento = function(id) {
    // Aquí rediriges a página de detalle o abrir modal
    window.open(`/empresa/documento_detalle.html?id=${id}`, '_blank');
  };

  window.eliminarDocumento = async function(id) {
    if (!confirm('¿Estás seguro de eliminar este documento?')) return;

    try {
      const res = await fetch(`/api/documentos/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        alert('Documento eliminado.');
        await cargarDocumentos();
      } else {
        alert('Error al eliminar documento.');
      }
    } catch (error) {
      alert('Error de red al eliminar documento.');
    }
  };

  // Carga inicial
  cargarDocumentos();
});
