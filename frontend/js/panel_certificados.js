document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || !usuario.id) {
    console.error('Usuario no encontrado en localStorage');
    return;
  }
  const empresaId = usuario.id;

  const tbody = document.querySelector('#certificados-table tbody');
  const inputBuscar = document.getElementById('buscarCertificado');
  const selectFiltro = document.getElementById('filtroEstado');
  const btnNuevo = document.getElementById('btn-nuevo-certificado');

  let certificados = [];

  async function cargarCertificados() {
    try {
      const res = await fetch(`/api/empresa/certificados/${empresaId}`);
      if (!res.ok) throw new Error('Error en la respuesta del servidor');
      certificados = await res.json();
      mostrarCertificados(certificados);
    } catch (error) {
      console.error('Error cargando certificados:', error);
    }
  }

  function mostrarCertificados(lista) {
    tbody.innerHTML = '';
    if (lista.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No se encontraron certificados</td></tr>`;
      return;
    }
    lista.forEach(cert => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cert.nombre}</td>
        <td><span class="estado ${cert.estado.replace('_', '-')}">${cert.estado.replace('_', ' ')}</span></td>
        <td>${cert.fecha_emision ? new Date(cert.fecha_emision).toLocaleDateString() : '-'}</td>
        <td>${cert.fecha_expiracion ? new Date(cert.fecha_expiracion).toLocaleDateString() : '-'}</td>
        <td>
          <button class="btn-ver" onclick="verCertificado(${cert.id})" title="Ver certificado">👁️</button>
          <button class="btn-eliminar" onclick="eliminarCertificado(${cert.id})" title="Eliminar">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  inputBuscar.addEventListener('input', filtrarYMostrar);
  selectFiltro.addEventListener('change', filtrarYMostrar);

  function filtrarYMostrar() {
    const textoBusqueda = inputBuscar.value.toLowerCase();
    const filtroEstado = selectFiltro.value;

    const filtrados = certificados.filter(cert => {
      const matchesTexto = cert.nombre.toLowerCase().includes(textoBusqueda);
      const matchesEstado = filtroEstado ? cert.estado === filtroEstado : true;
      return matchesTexto && matchesEstado;
    });

    mostrarCertificados(filtrados);
  }

  btnNuevo.addEventListener('click', () => {
    alert('Funcionalidad para agregar nuevo certificado no implementada.');
  });

  window.verCertificado = function(id) {
    window.open(`/empresa/certificado_detalle.html?id=${id}`, '_blank');
  };

  window.eliminarCertificado = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar este certificado?')) return;

    try {
      const res = await fetch(`/api/certificados/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        alert('Certificado eliminado.');
        await cargarCertificados();
      } else {
        alert('Error al eliminar certificado.');
      }
    } catch (error) {
      alert('Error de red al eliminar certificado.');
    }
  };

  // Carga inicial
  cargarCertificados();
});
