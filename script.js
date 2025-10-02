// Utilidades de fecha y mes
const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function getMesActual() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    if (datos.mes) return datos.mes;
    const fecha = new Date();
    return MESES[fecha.getMonth()];
}

function setMesActual(mes) {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    datos.mes = mes;
    datos.fecha_inicio = new Date().toISOString();
    localStorage.setItem('datos_usuario', JSON.stringify(datos));
}

function mostrarMesActual() {
    document.getElementById('mes-actual').textContent = getMesActual();
}

// --- Menú hamburguesa y submenús ---
function toggleMenuOpciones() {
    document.getElementById('menu-opciones').classList.toggle('abierto');
}
function toggleSubmenu(id) {
    document.getElementById(id).classList.toggle('abierto');
    if(id === 'submenu-meta') renderMetaForm();
}

// --- Modo oscuro/claro ---
function toggleModoOscuro() {
    document.body.classList.toggle('modo-claro');
    localStorage.setItem('modo_claro', document.body.classList.contains('modo-claro'));
}

// --- Meta y nombre ---
function renderMetaForm() {
    const metaDiv = document.getElementById('meta-form');
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    metaDiv.innerHTML = '';
    if (!datos.nombre) {
        metaDiv.innerHTML = `
            <input type="text" id="input-nombre" placeholder="Introduce tu nombre">
            <button class="btn" onclick="guardarNombreMeta()">Guardar</button>
        `;
    } else if (!datos.tipo_meta) {
        metaDiv.innerHTML = `
            <div>Hola, ${datos.nombre}. Selecciona tu meta:</div>
            <button class="btn" onclick="setMetaTipo('regular')">P. Regular (50h)</button>
            <button class="btn" onclick="mostrarAuxiliar()">P. Auxiliar</button>
            <button class="btn" onclick="mostrarPersonal()">Mi meta personal</button>
            <div id="auxiliar-opciones" style="margin-top:0.5rem;"></div>
            <div id="personal-opciones" style="margin-top:0.5rem;"></div>
        `;
    } else {
        metaDiv.innerHTML = `
            <div>Nombre: ${datos.nombre}</div>
            <div>Meta: ${datos.meta} horas (${mostrarTipoMeta(datos.tipo_meta)})</div>
            <button class="btn" onclick="resetMeta()">Cambiar meta</button>
        `;
    }
}
function guardarNombreMeta() {
    const nombre = document.getElementById('input-nombre').value.trim();
    if (!nombre) return alert("Por favor, ingresa tu nombre.");
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    datos.nombre = nombre;
    localStorage.setItem('datos_usuario', JSON.stringify(datos));
    renderMetaForm();
}
function setMetaTipo(tipo, valor) {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    datos.tipo_meta = tipo;
    if (tipo === 'regular') datos.meta = 50;
    if (tipo === 'auxiliar') datos.meta = valor;
    if (tipo === 'personal') datos.meta = valor;
    datos.mes = getMesActual();
    if (!datos.fecha_inicio) datos.fecha_inicio = new Date().toISOString();
    localStorage.setItem('datos_usuario', JSON.stringify(datos));
    renderMetaForm();
    mostrarResumenMes();
}
function mostrarAuxiliar() {
    document.getElementById('auxiliar-opciones').innerHTML = `
        <button class="btn" onclick="setMetaTipo('auxiliar',30)">30 horas</button>
        <button class="btn" onclick="setMetaTipo('auxiliar',15)">15 horas</button>
    `;
}
function mostrarPersonal() {
    document.getElementById('personal-opciones').innerHTML = `
        <input type="number" id="input-meta-personal" placeholder="Horas">
        <button class="btn" onclick="guardarMetaPersonal()">Guardar</button>
    `;
}
function guardarMetaPersonal() {
    const valor = parseFloat(document.getElementById('input-meta-personal').value);
    if (!valor || valor < 1) return alert("Ingresa una meta válida.");
    setMetaTipo('personal', valor);
}
function resetMeta() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    delete datos.tipo_meta;
    delete datos.meta;
    localStorage.setItem('datos_usuario', JSON.stringify(datos));
    renderMetaForm();
    mostrarResumenMes();
}
function mostrarTipoMeta(tipo) {
    if (tipo === 'regular') return 'P. Regular';
    if (tipo === 'auxiliar') return 'P. Auxiliar';
    if (tipo === 'personal') return 'Personal';
    return '';
}

// --- Resumen de meta y progreso ---
function mostrarResumenMes() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    const meta = datos.meta || 0;
    const nombre = datos.nombre || '';
    const tipo = datos.tipo_meta || '';
    const total = calcularTotalSemana();
    let faltan = meta * 60 - total;
    let texto = '';
    if (meta > 0) {
        if (faltan > 0) {
            texto = `${nombre}, así vas:<br>Tu meta: ${meta}h<br><span style="font-size:1em;">Faltan: ${formatearTiempo(faltan)}</span>`;
        } else {
            texto = `${nombre}, así vas:<br> meta: ${meta}h<br><span style="font-size:1.1em;">¡Superaste la meta por +${formatearTiempo(-faltan)}!</span>`;
        }
    }
    document.getElementById('resumen-mes').innerHTML = texto;
}

// --- Copia de seguridad ---
function exportarDatos() {
    const datos = {};
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('actividades_') || key === 'datos_usuario') {
            datos[key] = localStorage.getItem(key);
        }
    });
    const blob = new Blob([JSON.stringify(datos)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "horario_backup.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importarDatos(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = function(e) {
        try {
            const datos = JSON.parse(e.target.result);
            Object.keys(datos).forEach(key => {
                localStorage.setItem(key, datos[key]);
            });
            location.reload();
        } catch (err) {
            alert("Archivo no válido");
        }
    };
    lector.readAsText(archivo);
}

// --- Mostrar/Ocultar actividades ---
function mostrarOcultar(id) {
    const elemento = document.getElementById(id);
    if (elemento.style.display === "none") {
        elemento.style.display = "block";
    } else {
        elemento.style.display = "none";
    }
}

// --- Guardar y cargar actividades ---
function guardarActividades() {
    document.querySelectorAll('ul').forEach(ul => {
        const id = ul.id;
        const actividades = [];
        ul.querySelectorAll('li').forEach(li => {
            actividades.push(li.outerHTML);
        });
        localStorage.setItem('actividades_' + id, JSON.stringify(actividades));
    });
    calcularTotales();
    mostrarResumenMes();
}

function cargarActividades() {
    document.querySelectorAll('ul').forEach(ul => {
        const id = ul.id;
        const guardadas = localStorage.getItem('actividades_' + id);
        if (guardadas) {
            ul.querySelectorAll('li').forEach(li => li.remove());
            JSON.parse(guardadas).forEach(html => {
                ul.insertAdjacentHTML('beforeend', html);
            });
        }
    });
}

// --- Menú para agregar actividades ---
function abrirMenuAgregar(ulId) {
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Agregar actividad</h3>
            <button class="btn" onclick="abrirFormularioMinisterio('${ulId}')">Ministerio</button>
            <button class="btn" onclick="abrirFormularioPersonal('${ulId}')">Personal</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
        </div>
    `;
    modal.classList.add('abierto');
}
function cerrarModal() {
    document.getElementById('modal-agregar').classList.remove('abierto');
}

// --- Formularios de actividad ---
function abrirFormularioMinisterio(ulId) {
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Ministerio</h3>
            <label>Tipo:
                <select id="tipo-ministerio">
                    <option value="Casa a casa">Casa a casa</option>
                    <option value="Pública">Pública</option>
                    <option value="Revisita">Revisita</option>
                </select>
            </label><br>
            <input type="time" id="hora-ministerio" required><br>
            <input type="text" id="nombre-lugar" placeholder="Nombre (lugar)" required><br>
            <textarea id="breve-texto" placeholder="Breve texto"></textarea><br>
            <input type="number" id="horas-dedicadas" placeholder="Minutos dedicados" min="1" required><br>
            <button class="btn" onclick="guardarMinisterio('${ulId}')">Guardar</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
        </div>
    `;
}
function guardarMinisterio(ulId) {
    const tipo = document.getElementById('tipo-ministerio').value;
    const hora = document.getElementById('hora-ministerio').value;
    const nombre = document.getElementById('nombre-lugar').value.trim();
    const texto = document.getElementById('breve-texto').value.trim();
    const minutos = parseInt(document.getElementById('horas-dedicadas').value, 10) || 0;
    if (!hora || !nombre || minutos < 1) return alert("Completa todos los campos obligatorios.");
    const ul = document.getElementById(ulId);
    const li = document.createElement('li');
    li.innerHTML = `<span>${hora}</span> | ${nombre} (${tipo}) > ${texto}`;
    li.setAttribute('data-tiempo', minutos);
    ul.appendChild(li);
    guardarActividades();
    cerrarModal();
}

function abrirFormularioPersonal(ulId) {
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Personal</h3>
            <input type="time" id="hora-personal" required><br>
            <input type="text" id="nombre-lugar-personal" placeholder="Nombre (lugar)" required><br>
            <textarea id="breve-texto-personal" placeholder="Breve texto"></textarea><br>
            <button class="btn" onclick="guardarPersonal('${ulId}')">Guardar</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
        </div>
    `;
}
function guardarPersonal(ulId) {
    const hora = document.getElementById('hora-personal').value;
    const nombre = document.getElementById('nombre-lugar-personal').value.trim();
    const texto = document.getElementById('breve-texto-personal').value.trim();
    if (!hora || !nombre) return alert("Completa todos los campos obligatorios.");
    const ul = document.getElementById(ulId);
    const li = document.createElement('li');
    li.innerHTML = `<span>${hora}</span> | ${nombre} > ${texto}`;
    ul.appendChild(li);
    guardarActividades();
    cerrarModal();
}

// --- Edición y eliminación ---
function activarEdicion() {
    document.querySelectorAll('ul').forEach(ul => {
        let timer = null;
        ul.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'LI' && !e.target.classList.contains('editando')) {
                timer = setTimeout(() => {
                    editarActividad(e.target);
                }, 1000); // 1 segundo
            }
        });
        ul.addEventListener('mouseup', function(e) { clearTimeout(timer); });
        ul.addEventListener('mouseleave', function(e) { clearTimeout(timer); });
        ul.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'LI' && !e.target.classList.contains('editando')) {
                timer = setTimeout(() => {
                    editarActividad(e.target);
                }, 1000);
            }
        });
        ul.addEventListener('touchend', function(e) { clearTimeout(timer); });
        ul.addEventListener('touchmove', function(e) { clearTimeout(timer); });
    });
}

function editarActividad(li) {
    li.classList.add('editando');
    const contenido = li.innerHTML;
    const horaMatch = contenido.match(/<span[^>]*>(.*?)<\/span>/);
    const hora = horaMatch ? horaMatch[1] : '';
    const textoMatch = contenido.split('|');
    let texto = textoMatch[1] ? textoMatch[1].replace(/<.*?>/g, '').trim() : '';
    let tiempo = li.getAttribute('data-tiempo') || '';
    li.innerHTML = `
        <div class="edit-controls">
            <input type="text" class="edit-hora" value="${hora}" style="width:4.5rem;">
            |
            <input type="text" class="edit-actividad" value="${texto}">
            <input type="number" class="edit-tiempo" value="${tiempo}" min="0" placeholder="min">
            <button class="btn" onclick="guardarEdicion(this)">Guardar</button>
            <button class="btn" onclick="cancelarEdicion(this)">Cancelar</button>
        </div>
    `;
}

function guardarEdicion(btn) {
    const li = btn.closest('li');
    const controls = li.querySelector('.edit-controls');
    const hora = controls.querySelector('.edit-hora').value;
    const texto = controls.querySelector('.edit-actividad').value;
    const tiempo = controls.querySelector('.edit-tiempo').value;
    li.innerHTML = `<span>${hora}</span> | ${texto}`;
    if (tiempo) li.setAttribute('data-tiempo', tiempo);
    else li.removeAttribute('data-tiempo');
    li.classList.remove('editando');
    guardarActividades();
}

function cancelarEdicion(btn) {
    const li = btn.closest('li');
    li.classList.remove('editando');
    cargarActividades();
}

document.querySelectorAll('ul').forEach(ul => {
    ul.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-del')) {
            if (confirm("¿Seguro que quieres eliminar esta actividad?")) {
                e.target.closest('li').remove();
                guardarActividades();
            }
        }
    });
});

function actualizarBotonesEliminar() {
    document.querySelectorAll('ul').forEach(ul => {
        ul.querySelectorAll('li:not(.editando)').forEach(li => {
            if (!li.querySelector('.btn-del')) {
                const btn = document.createElement('button');
                btn.textContent = '×';
                btn.className = 'btn-del';
                btn.title = 'Eliminar';
                btn.onclick = function(e) {
                    e.stopPropagation();
                    if (confirm("¿Seguro que quieres eliminar esta actividad?")) {
                        li.remove();
                        guardarActividades();
                    }
                };
                li.appendChild(btn);
            }
        });
    });
}

// --- Calcular totales ---
function calcularTotales() {
    let totalSemana = 0;
    document.querySelectorAll('ul').forEach(ul => {
        let totalDia = 0;
        ul.querySelectorAll('li').forEach(li => {
            const tiempo = parseFloat(li.getAttribute('data-tiempo') || '0');
            totalDia += tiempo;
        });
        const totalDiv = document.getElementById('total-' + ul.id);
        if (totalDiv) {
            totalDiv.textContent = totalDia > 0 ? `Total día: ${formatearTiempo(totalDia)}` : '';
        }
        totalSemana += totalDia;
    });
    const totalSemanal = document.getElementById('total-semanal');
    if (totalSemanal) {
        totalSemanal.textContent = totalSemana > 0 ? `Total semanal: ${formatearTiempo(totalSemana)}` : '';
    }
    mostrarResumenMes();
}

function calcularTotalSemana() {
    let totalSemana = 0;
    document.querySelectorAll('ul').forEach(ul => {
        ul.querySelectorAll('li').forEach(li => {
            const tiempo = parseFloat(li.getAttribute('data-tiempo') || '0');
            totalSemana += tiempo;
        });
    });
    return totalSemana;
}

function formatearTiempo(minutos) {
    const horas = Math.floor(minutos / 60);
    const mins = Math.round(minutos % 60);
    if (horas > 0) {
        return `${horas}h ${mins}min`;
    } else {
        return `${mins}min`;
    }
}

// --- Nuevo mes e informe ---
function nuevoMes() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    if (!datos.nombre) return alert("Primero configura tu nombre y meta en 'Mi meta'.");
    if (!confirm(`Se hará el informe de ${getMesActual()}. ¿Desea informar C.B?`)) {
        exportarInformeCB(0);
        limpiarMes();
        return;
    }
    // Preguntar CB
    pedirCB();
}
function pedirCB() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    const nombre = datos.nombre || '';
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <div>¿Cuántos C.B informa ${nombre}? (0-99)</div>
            <input type="number" id="input-cb" min="0" max="99" value="0">
            <button class="btn" onclick="confirmarCB()">Aceptar</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
        </div>
    `;
    modal.classList.add('abierto');
}
function confirmarCB() {
    const cb = parseInt(document.getElementById('input-cb').value, 10) || 0;
    cerrarModal();
    exportarInformeCB(cb);
    limpiarMes();
}
function exportarInformeCB(cb) {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    const total = calcularTotalSemana();
    const meta = datos.meta || 0;
    const nombre = datos.nombre || '';
    const mes = getMesActual();
    let texto = '';
    if (datos.tipo_meta === 'regular' || datos.tipo_meta === 'auxiliar') {
        texto += `Nombre: ${nombre}\nMes: ${mes}\nHoras: ${Math.round(total/60)}\nC.B: ${cb}`;
    } else {
        texto += `Nombre: ${nombre}\nMes: ${mes}\nC.B: ${cb}`;
    }
    // Descargar como .txt
    const blob = new Blob([texto], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe_${nombre || 'usuario'}_${mes}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    // Compartir por WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    setTimeout(() => {
        if (confirm("¿Deseas compartir el informe por WhatsApp?")) {
            window.open(whatsappUrl, '_blank');
        }
    }, 500);
}
function limpiarMes() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('actividades_')) localStorage.removeItem(key);
    });
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    datos.meta = 0;
    delete datos.tipo_meta;
    datos.mes = MESES[new Date().getMonth()];
    datos.fecha_inicio = new Date().toISOString();
    localStorage.setItem('datos_usuario', JSON.stringify(datos));
    location.reload();
}

// --- Inicialización ---
window.onload = function() {
    if (localStorage.getItem('modo_claro') === 'true') {
        document.body.classList.add('modo-claro');
    }
    mostrarMesActual();
    renderMetaForm();
    cargarActividades();
    activarEdicion();
    actualizarBotonesEliminar();
    calcularTotales();
    document.body.addEventListener('DOMSubtreeModified', actualizarBotonesEliminar);

// Solo cerrar el menú si la opción NO abre un submenú
document.querySelectorAll('.menu-opciones .menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
        // Si la opción tiene un submenú, no cerrar
        const submenu = this.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
            // Solo abrir/cerrar el submenú, no cerrar el menú principal
            return;
        }
        document.getElementById('menu-opciones').classList.remove('abierto');
    });
});

document.addEventListener('click', function(e) {
    const menu = document.getElementById('menu-opciones');
    const hamburguesa = document.querySelector('.menu-hamburguesa');
    if (
        menu.classList.contains('abierto') &&
        !menu.contains(e.target) &&
        !hamburguesa.contains(e.target)
    ) {
        menu.classList.remove('abierto');
    }
});
};
