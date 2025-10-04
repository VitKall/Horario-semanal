// --- Variables globales y utilidades de fecha/mes ---
const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Devuelve el mes actual en texto
function getMesActual() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    if (datos.mes) return datos.mes;
    const fecha = new Date();
    return MESES[fecha.getMonth()];
}

// Establece el mes actual en los datos del usuario
function setMesActual(mes) {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    datos.mes = mes;
    datos.fecha_inicio = new Date().toISOString();
    localStorage.setItem('datos_usuario', JSON.stringify(datos));
}

// Muestra el mes actual en el encabezado
function mostrarMesActual() {
    document.getElementById('mes-actual').textContent = getMesActual();
}

// --- Menú hamburguesa y submenús ---
// Abre/cierra el menú de opciones
function toggleMenuOpciones() {
    document.getElementById('menu-opciones').classList.toggle('abierto');
}
// Abre/cierra un submenú específico
function toggleSubmenu(id) {
    document.getElementById(id).classList.toggle('abierto');
    if(id === 'submenu-meta') renderMetaForm();
}
// Cierra el menú de opciones
function cerrarMenuOpciones() {
    document.getElementById('menu-opciones').classList.remove('abierto');
    document.querySelectorAll('.submenu').forEach(sub => sub.classList.remove('abierto'));
}

// --- Modo oscuro/claro ---
// Cambia entre modo oscuro y claro
function toggleModoOscuro() {
    document.body.classList.toggle('modo-claro');
    localStorage.setItem('modo_claro', document.body.classList.contains('modo-claro'));
}

// --- Meta y nombre ---
// Renderiza el formulario de meta y nombre en el menú
function renderMetaForm() {
    const metaDiv = document.getElementById('meta-form');
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    metaDiv.innerHTML = '';
    // Si no hay nombre, muestra formulario para nombre y apellido
    if (!datos.nombre) {
        metaDiv.innerHTML = `
            <input type="text" id="input-nombre" placeholder="Nombre">
            <input type="text" id="input-apellido" placeholder="Apellido (opcional)">
            <button class="btn" onclick="guardarNombreMeta()">Guardar</button>
        `;
    } else {
        // Si hay nombre, muestra datos y opciones para editar
        metaDiv.innerHTML = `
            <div>Usuario: ${datos.nombre}${datos.apellido ? ' ' + datos.apellido : ''}</div>
            <button class="btn" onclick="editarNombreMeta()">Editar nombre</button>
            <div style="margin-top:1rem;">
                <div>Meta mensual: ${datos.meta ? datos.meta + ' horas (' + mostrarTipoMeta(datos.tipo_meta) + ')' : 'No configurada'}</div>
                <button class="btn" onclick="mostrarOpcionesMeta()">Cambiar meta</button>
            </div>
        `;
        // Si está editando meta, muestra opciones
        if (metaDiv.dataset.editMeta === "true") {
            metaDiv.innerHTML += `
                <div style="margin-top:1rem;">
                    <button class="btn" onclick="setMetaTipo('regular')">P. Regular (50h)</button>
                    <button class="btn" onclick="mostrarAuxiliar()">P. Auxiliar</button>
                    <button class="btn" onclick="mostrarPersonal()">Mi meta personal</button>
                    <div id="auxiliar-opciones" style="margin-top:0.5rem;"></div>
                    <div id="personal-opciones" style="margin-top:0.5rem;"></div>
                </div>
            `;
        }
    }
}

// Guarda el nombre y apellido del usuario
function guardarNombreMeta() {
    const nombre = document.getElementById('input-nombre').value.trim();
    const apellido = document.getElementById('input-apellido').value.trim();
    if (!nombre) return alert("Por favor, ingresa tu nombre.");
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    datos.nombre = nombre;
    datos.apellido = apellido;
    localStorage.setItem('datos_usuario', JSON.stringify(datos));
    renderMetaForm();
}

// Permite editar el nombre y apellido
function editarNombreMeta() {
    const metaDiv = document.getElementById('meta-form');
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    metaDiv.innerHTML = `
        <input type="text" id="input-nombre" value="${datos.nombre}" placeholder="Nombre">
        <input type="text" id="input-apellido" value="${datos.apellido || ''}" placeholder="Apellido (opcional)">
        <button class="btn" onclick="guardarNombreMeta()">Guardar</button>
    `;
}

// Muestra las opciones para cambiar la meta
function mostrarOpcionesMeta() {
    const metaDiv = document.getElementById('meta-form');
    metaDiv.dataset.editMeta = "true";
    renderMetaForm();
}

// Establece el tipo de meta y valor
function setMetaTipo(tipo, valor) {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    datos.tipo_meta = tipo;
    if (tipo === 'regular') datos.meta = 50;
    if (tipo === 'auxiliar') datos.meta = valor;
    if (tipo === 'personal') datos.meta = valor;
    datos.mes = getMesActual();
    if (!datos.fecha_inicio) datos.fecha_inicio = new Date().toISOString();
    localStorage.setItem('datos_usuario', JSON.stringify(datos));
    document.getElementById('meta-form').dataset.editMeta = "false";
    renderMetaForm();
    mostrarResumenMes();
}

// Muestra las opciones de meta auxiliar
function mostrarAuxiliar() {
    document.getElementById('auxiliar-opciones').innerHTML = `
        <button class="btn" onclick="setMetaTipo('auxiliar',30)">30 horas</button>
        <button class="btn" onclick="setMetaTipo('auxiliar',15)">15 horas</button>
    `;
}

// Muestra el campo para meta personal
function mostrarPersonal() {
    document.getElementById('personal-opciones').innerHTML = `
        <input type="number" id="input-meta-personal" placeholder="Horas (máx 99)" min="1" max="99">
        <button class="btn" onclick="guardarMetaPersonal()">Guardar</button>
    `;
}

// Guarda la meta personal ingresada
function guardarMetaPersonal() {
    const valor = parseFloat(document.getElementById('input-meta-personal').value);
    if (!valor || valor < 1 || valor > 99) return alert("Ingresa una meta válida (1-99).");
    setMetaTipo('personal', valor);
}

// Devuelve el texto del tipo de meta
function mostrarTipoMeta(tipo) {
    if (tipo === 'regular') return 'P. Regular';
    if (tipo === 'auxiliar') return 'P. Auxiliar';
    if (tipo === 'personal') return 'Personal';
    return '';
}

// --- Resumen de meta y progreso ---
// Muestra el resumen alineado a la izquierda
function mostrarResumenMes() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    const meta = datos.meta || 0;
    const nombre = datos.nombre || '';
    const apellido = datos.apellido || '';
    // Suma de horas de actividades de servicio (meta semanal)
    let totalServicioHoras = 0;
    document.querySelectorAll('ul').forEach(ul => {
        ul.querySelectorAll('li.servicio').forEach(li => {
            const horas = parseFloat(li.getAttribute('data-horas') || '0');
            totalServicioHoras += horas;
        });
    });
    // Suma de horas ingresadas en "Actualizar hrs"
    let totalActualizadoHoras = parseFloat(localStorage.getItem('actualizar_hrs') || '0');
    // Mensaje según progreso
    let faltan = meta - totalActualizadoHoras;
    let progreso = '';
    if (meta > 0) {
        if (totalActualizadoHoras <= 0) {
            progreso = `Empecemos: 0h`;
        } else if (faltan > 0) {
            progreso = `¡Vamos! Solo faltan: ${faltan}h`;
        } else if (faltan === 0) {
            progreso = `¡Lo hiciste!`;
        } else {
            progreso = `¡Superaste tu meta por ${Math.abs(faltan)}h!`;
        }
    }
    // Renderiza el resumen alineado a la izquierda
    document.getElementById('resumen-mes').innerHTML = `
        ${nombre}${apellido ? ' ' + apellido : ''}, así vas:<br>
        Meta mensual: ${meta > 0 ? meta + 'h' : 'Establece tu meta'}<br>
        Meta semanal: ${totalServicioHoras}h<br>
        ${progreso}
    `;
    // Actualiza el total semanal a la derecha
    // document.getElementById('total-semanal').textContent = totalServicioHoras > 0 ? `Total semanal: ${totalServicioHoras}h` : '';
}

// --- Copia de seguridad ---
// Exporta los datos del usuario y actividades
function exportarDatos() {
    const datos = {};
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('actividades_') || key === 'datos_usuario' || key === 'actualizar_hrs') {
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

// Importa los datos desde un archivo
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
// Muestra u oculta la lista de actividades de un día
function mostrarOcultar(id) {
    const elemento = document.getElementById(id);
    if (elemento.style.display === "none") {
        elemento.style.display = "block";
    } else {
        elemento.style.display = "none";
    }
}

// // --- Guardar y cargar actividades ---
// // Guarda todas las actividades en localStorage
// function guardarActividades() {
//     document.querySelectorAll('ul').forEach(ul => {
//         const id = ul.id;
//         const actividades = [];
//         ul.querySelectorAll('li').forEach(li => {
//             actividades.push(li.outerHTML);
//         });
//         localStorage.setItem('actividades_' + id, JSON.stringify(actividades));
//     });
//     mostrarResumenMes();
// }

// // Carga todas las actividades desde localStorage
// function cargarActividades() {
//     document.querySelectorAll('ul').forEach(ul => {
//         const id = ul.id;
//         const guardadas = localStorage.getItem('actividades_' + id);
//         if (guardadas) {
//             ul.innerHTML = '';
//             JSON.parse(guardadas).forEach(html => {
//                 ul.insertAdjacentHTML('beforeend', html);
//             });
//         }
//     });
//     actualizarBotonesEliminar();
// }

// Carga todas las actividades desde localStorage
function cargarActividades() {
    document.querySelectorAll('ul').forEach(ul => {
        const id = ul.id;
        const guardadas = localStorage.getItem('actividades_' + id);
        if (guardadas) {
            ul.innerHTML = '';
            JSON.parse(guardadas).forEach(html => {
                // Insertar el li sin botones
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const li = tempDiv.firstElementChild;
                // Eliminar cualquier botón guardado accidentalmente
                Array.from(li.querySelectorAll('button')).forEach(btn => btn.remove());
                // Agregar botones funcionales
                li.appendChild(crearBotonEditar(li));
                li.appendChild(crearBotonEliminar(li));
                ul.appendChild(li);
            });
        }
    });
}

// Guarda todas las actividades en localStorage (sin botones)
function guardarActividades() {
    document.querySelectorAll('ul').forEach(ul => {
        const id = ul.id;
        const actividades = [];
        ul.querySelectorAll('li').forEach(li => {
            // Clonar el li y quitar los botones antes de guardar
            const clone = li.cloneNode(true);
            Array.from(clone.querySelectorAll('button')).forEach(btn => btn.remove());
            actividades.push(clone.outerHTML);
        });
        localStorage.setItem('actividades_' + id, JSON.stringify(actividades));
    });
    mostrarResumenMes();
}

// --- Menú para agregar actividades ---
// Abre el menú para agregar una actividad
function abrirMenuAgregar(ulId) {
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>¿Esta será una actividad Fija o Temporal?</h3>
            <button class="btn" onclick="seleccionarTipoActividad('${ulId}','fija')">Fija</button>
            <button class="btn" onclick="seleccionarTipoActividad('${ulId}','temporal')">Temporal</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
        </div>
    `;
    modal.classList.add('abierto');
}

// Selecciona el tipo de actividad y muestra opciones
function seleccionarTipoActividad(ulId, tipoActividad) {
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Selecciona el tipo de actividad</h3>
            <button class="btn" onclick="abrirFormularioActividad('${ulId}','${tipoActividad}','servicio')">Servicio</button>
            <button class="btn" onclick="abrirFormularioActividad('${ulId}','${tipoActividad}','personal')">Personal</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
        </div>
    `;
}

// Abre el formulario para agregar actividad según tipo y categoría
function abrirFormularioActividad(ulId, tipoActividad, categoria) {
    let opciones = '';
    if (categoria === 'servicio') {
        opciones = `
            <option value="">Selecciona...</option>
            <option value="Casa en casa">Casa en casa</option>
            <option value="Pública">Pública</option>
            <option value="Revisita">Revisita</option>
            <option value="C. Bíblico">C. Bíblico</option>
        `;
    } else {
        opciones = `
            <option value="">Selecciona...</option>
            <option value="Académico">Académico</option>
            <option value="Espiritual">Espiritual</option>
            <option value="Familiar">Familiar</option>
            <option value="Laboral">Laboral</option>
            <option value="Médica">Médica</option>
            <option value="Recreativa">Recreativa</option>
            <option value="Social">Social</option>
        `;
    }
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Agregar actividad ${categoria === 'servicio' ? 'de Servicio' : 'Personal'}</h3>
            <label>Hora (12h): <input type="time" id="hora-actividad"></label><br>
            <label>Actividad:
                <select id="tipo-actividad">
                    ${opciones}
                </select>
            </label><br>
            <textarea id="breve-texto" placeholder="Descripción breve"></textarea><br>
            <label>¿Cuántas horas planea dedicar a esta actividad? <input type="number" id="horas-dedicadas" min="-99" max="99" step="0.1"></label><br>
            <button class="btn" onclick="guardarActividad('${ulId}','${tipoActividad}','${categoria}')">Guardar</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
        </div>
    `;
}

// Guarda la actividad en la lista correspondiente
function guardarActividad(ulId, tipoActividad, categoria) {
    const hora = document.getElementById('hora-actividad').value;
    const tipo = document.getElementById('tipo-actividad').value;
    const texto = document.getElementById('breve-texto').value.trim();
    const horas = parseFloat(document.getElementById('horas-dedicadas').value) || '';
    // Formato: "HORA | Actividad > Breve texto | Horas a dedicar"
    let contenido = '';
    if (hora) contenido += `<span>${hora}</span> | `;
    if (tipo) contenido += `${tipo}`;
    if (texto) contenido += ` > ${texto}`;
    if (horas !== '') contenido += ` | ${horas}h`;
    // Si no hay nada, no guardar
    if (!contenido) return;
    const ul = document.getElementById(ulId);
    const li = document.createElement('li');
    li.innerHTML = contenido;
    li.classList.add(categoria);
    li.setAttribute('data-tipo-actividad', tipoActividad);
    if (horas !== '') li.setAttribute('data-horas', horas);
    // Marca si es fija o temporal
    li.setAttribute('data-fija', tipoActividad === 'fija' ? 'true' : 'false');
    // Botón editar y eliminar
    li.appendChild(crearBotonEditar(li));
    li.appendChild(crearBotonEliminar(li));
    ul.appendChild(li);
    guardarActividades();
    cerrarModal();
    actualizarBotonesEliminar();
    ordenarActividadesPorHora(ulId);
}

// Ordena las actividades por hora
function ordenarActividadesPorHora(ulId) {
    const ul = document.getElementById(ulId);
    const lis = Array.from(ul.querySelectorAll('li'));
    lis.sort((a, b) => {
        const horaA = (a.innerHTML.match(/<span>(.*?)<\/span>/) || [])[1] || '';
        const horaB = (b.innerHTML.match(/<span>(.*?)<\/span>/) || [])[1] || '';
        return horaA.localeCompare(horaB);
    });
    ul.innerHTML = '';
    lis.forEach(li => ul.appendChild(li));
}

// Cierra el modal
function cerrarModal() {
    document.getElementById('modal-agregar').classList.remove('abierto');
}

// --- Botón editar y eliminar ---
// Crea el botón de editar para una actividad
function crearBotonEditar(li) {
    const btn = document.createElement('button');
    btn.textContent = 'Editar';
    btn.className = 'btn-edit';
    btn.onclick = function(e) {
        e.stopPropagation();
        editarActividad(li);
    };
    return btn;
}

// Crea el botón de eliminar para una actividad
function crearBotonEliminar(li) {
    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.className = 'btn-del';
    btn.title = 'Eliminar';
    btn.onclick = function(e) {
        e.stopPropagation();
        if (confirm("¿Seguro que quieres eliminar esta actividad?")) {
            li.remove();
            guardarActividades();
            actualizarBotonesEliminar();
        }
    };
    return btn;
}

// Actualiza los botones de editar y eliminar en todas las actividades
function actualizarBotonesEliminar() {
    document.querySelectorAll('ul').forEach(ul => {
        ul.querySelectorAll('li').forEach(li => {
            if (!li.querySelector('.btn-del')) {
                li.appendChild(crearBotonEliminar(li));
            }
            if (!li.querySelector('.btn-edit')) {
                li.appendChild(crearBotonEditar(li));
            }
        });
    });
}

// Permite editar una actividad
function editarActividad(li) {
    li.classList.add('editando');
    // Extrae los datos actuales
    const contenido = li.innerHTML;
    const horaMatch = contenido.match(/<span>(.*?)<\/span>/);
    const hora = horaMatch ? horaMatch[1] : '';
    const tipoMatch = contenido.match(/\| ([^>]+)(?: >| \|)/);
    const tipo = tipoMatch ? tipoMatch[1].trim() : '';
    const textoMatch = contenido.match(/> ([^|]+)(?: \|)?/);
    const texto = textoMatch ? textoMatch[1].trim() : '';
    const horasMatch = contenido.match(/\| ([\d\.\-]+)h/);
    const horas = horasMatch ? horasMatch[1] : '';
    // Formulario de edición
    li.innerHTML = `
        <div class="edit-controls">
            <input type="time" class="edit-hora" value="${hora}" style="width:4.5rem;">
            <input type="text" class="edit-tipo" value="${tipo}" placeholder="Actividad">
            <input type="text" class="edit-texto" value="${texto}" placeholder="Descripción breve">
            <input type="number" class="edit-horas" value="${horas}" min="-99" max="99" step="0.1" placeholder="Horas">
            <button class="btn" onclick="guardarEdicion(this)">Guardar</button>
            <button class="btn" onclick="cancelarEdicion(this)">Cancelar</button>
        </div>
    `;
}

// Guarda la edición de la actividad
function guardarEdicion(btn) {
    const li = btn.closest('li');
    const controls = li.querySelector('.edit-controls');
    const hora = controls.querySelector('.edit-hora').value;
    const tipo = controls.querySelector('.edit-tipo').value;
    const texto = controls.querySelector('.edit-texto').value;
    const horas = controls.querySelector('.edit-horas').value;
    let contenido = '';
    if (hora) contenido += `<span>${hora}</span> | `;
    if (tipo) contenido += `${tipo}`;
    if (texto) contenido += ` > ${texto}`;
    if (horas !== '') contenido += ` | ${horas}h`;
    li.innerHTML = contenido;
    if (li.classList.contains('servicio')) li.setAttribute('data-horas', horas);
    li.classList.remove('editando');
    li.appendChild(crearBotonEditar(li));
    li.appendChild(crearBotonEliminar(li));
    guardarActividades();
    actualizarBotonesEliminar();
    ordenarActividadesPorHora(li.parentElement.id);
}

// Cancela la edición y restaura la actividad
function cancelarEdicion(btn) {
    const li = btn.closest('li');
    li.classList.remove('editando');
    cargarActividades();
    actualizarBotonesEliminar();
}

// --- Actualizar horas (botón a la derecha) ---
// Abre el formulario para actualizar horas
function abrirFormularioActualizarHrs() {
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Actualizar hrs</h3>
            <input type="number" id="input-actualizar-hrs" placeholder="Horas (+/-)" min="-99" max="99" step="0.1">
            <button class="btn" onclick="guardarActualizarHrs()">Guardar</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
        </div>
    `;
    modal.classList.add('abierto');
}

// Guarda las horas actualizadas en localStorage
function guardarActualizarHrs() {
    const valor = parseFloat(document.getElementById('input-actualizar-hrs').value) || 0;
    let actual = parseFloat(localStorage.getItem('actualizar_hrs') || '0');
    actual += valor;
    localStorage.setItem('actualizar_hrs', actual);
    mostrarResumenMes();
    cerrarModal();
}

// --- Informe mensual ---
// Abre el modal para generar el informe
function abrirInforme() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    if (!datos.nombre) return alert("Primero configura tu nombre y meta en 'Mi meta del mes'.");
    // Pregunta si desea informar C. Bíblicos
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <div>¿Deseas informar C. Bíblicos?</div>
            <input type="number" id="input-cb" min="0" max="99" value="0">
            <button class="btn" onclick="generarInforme()">Continuar</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
        </div>
    `;
    modal.classList.add('abierto');
}

// Genera el informe y muestra opciones
function generarInforme() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    const cb = parseInt(document.getElementById('input-cb').value, 10) || 0;
    const nombre = datos.nombre || '';
    const apellido = datos.apellido || '';
    const mes = getMesActual();
    const año = new Date().getFullYear();
    const tipoMeta = datos.tipo_meta;
    const meta = datos.meta || 0;
    const totalActualizadoHoras = parseFloat(localStorage.getItem('actualizar_hrs') || '0');
    let texto = '';
    // Si es P. Regular o Auxiliar
    if (tipoMeta === 'regular' || tipoMeta === 'auxiliar') {
        texto = `${nombre}${apellido ? ' ' + apellido : ''} | ${mes} ${año} | ${mostrarTipoMeta(tipoMeta)}\nHoras: ${totalActualizadoHoras}\nC.B.: ${cb}`;
    } else {
        texto = `${nombre}${apellido ? ' ' + apellido : ''} | ${mes} ${año}\nParticipe en una o varias facetas del servicio este mes\nC.B.: ${cb}`;
    }
    // Modal con opciones
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Informe generado</h3>
            <textarea id="informe-txt" readonly style="width:95%;height:6em;">${texto}</textarea>
            <button class="btn" onclick="copiarInforme()">Copiar</button>
            <button class="btn" onclick="descargarInformeTxt()">Generar .txt</button>
            <button class="btn" onclick="confirmarInforme()">Confirmar</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
            <div id="copiado-msg" class="copiado-msg"></div>
        </div>
    `;
}

// Copia el informe al portapapeles y muestra mensaje
function copiarInforme() {
    const informe = document.getElementById('informe-txt').value;
    navigator.clipboard.writeText(informe).then(() => {
        document.getElementById('copiado-msg').textContent = "Copiado";
        setTimeout(() => {
            document.getElementById('copiado-msg').textContent = "";
        }, 1500);
    });
}

// Descarga el informe como archivo .txt
function descargarInformeTxt() {
    const informe = document.getElementById('informe-txt').value;
    const blob = new Blob([informe], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "informe.txt";
    a.click();
    URL.revokeObjectURL(url);
}

// Confirma el informe y reinicia los datos según reglas
function confirmarInforme() {
    // Elimina actividades temporales y reinicia actualizar_hrs
    document.querySelectorAll('ul').forEach(ul => {
        ul.querySelectorAll('li').forEach(li => {
            if (li.getAttribute('data-fija') !== 'true') {
                li.remove();
            }
        });
    });
    guardarActividades();
    localStorage.setItem('actualizar_hrs', '0');
    // Mantiene nombre y meta si es P. Regular
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    if (datos.tipo_meta !== 'regular') {
        datos.meta = 0;
        delete datos.tipo_meta;
    }
    datos.mes = MESES[new Date().getMonth()];
    datos.fecha_inicio = new Date().toISOString();
    localStorage.setItem('datos_usuario', JSON.stringify(datos));
    mostrarResumenMes();
    cerrarModal();
    cargarActividades();
}

// --- Inicialización ---
// Inicializa la aplicación al cargar la página
window.onload = function() {
    if (localStorage.getItem('modo_claro') === 'true') {
        document.body.classList.add('modo-claro');
    }
    mostrarMesActual();
    renderMetaForm();
    cargarActividades();
    mostrarResumenMes();
    actualizarBotonesEliminar();

    // Cierra el menú si se toca fuera
    document.addEventListener('mousedown', function(e) {
        const menu = document.getElementById('menu-opciones');
        const hamburguesa = document.querySelector('.menu-hamburguesa');
        if (
            menu.classList.contains('abierto') &&
            !menu.contains(e.target) &&
            !hamburguesa.contains(e.target)
        ) {
            cerrarMenuOpciones();
        }
    });
};
