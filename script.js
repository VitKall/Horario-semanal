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
// --- Variables globales y utilidades de fecha/mes ---
const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// // --- Getters y setters para valores persistentes ---
// function getHorasA2() {
//     return Math.max(0, parseFloat(localStorage.getItem('horas_a2') || '0'));
// }
// function setHorasA2(valor) {
//     localStorage.setItem('horas_a2', Math.max(0, parseFloat(valor)));
// }
// function getValorAnual() {
//     let val = parseFloat(localStorage.getItem('valorAnual') || '0');
//     if (isNaN(val)) val = 0;
//     if (val < 0) val = 0;
//     if (val > 600) val = 600;
//     return val;
// }
// function setValorAnual(valor) {
//     let val = parseFloat(valor);
//     if (isNaN(val)) val = 0;
//     if (val < 0) val = 0;
//     if (val > 600) val = 600;
//     localStorage.setItem('valorAnual', val);
// }
// function getHorasMesesAnteriores() {
//     return Math.max(0, parseFloat(localStorage.getItem('horasMesesAnteriores') || '0'));
// }
// function setHorasMesesAnteriores(valor) {
//     localStorage.setItem('horasMesesAnteriores', Math.max(0, parseFloat(valor)));
// }

function getHorasA2() {
    const v = parseFloat(localStorage.getItem('horas_a2'));
    return isNaN(v) ? 0 : Math.max(0, v);
}
function setHorasA2(valor) {
    const v = parseFloat(valor);
    const safe = isNaN(v) ? 0 : Math.max(0, v);
    localStorage.setItem('horas_a2', String(safe));
}

function getValorAnual() {
    let val = parseFloat(localStorage.getItem('valorAnual') || '0');
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val > 600) val = 600;
    return val;
}
function setValorAnual(valor) {
    let val = parseFloat(valor);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val > 600) val = 600;
    localStorage.setItem('valorAnual', val);
}

function getHorasMesesAnteriores() {
    const v = parseFloat(localStorage.getItem('horasMesesAnteriores'));
    return isNaN(v) ? 0 : Math.max(0, v);
}
function setHorasMesesAnteriores(valor) {
    const v = parseFloat(valor);
    const safe = isNaN(v) ? 0 : Math.max(0, v);
    localStorage.setItem('horasMesesAnteriores', String(safe));
}


// --- Fecha y mes ---
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
    if (id === 'submenu-meta') renderMetaForm();
}
function cerrarMenuOpciones() {
    document.getElementById('menu-opciones').classList.remove('abierto');
    document.querySelectorAll('.submenu').forEach(sub => sub.classList.remove('abierto'));
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
            <input type="text" id="input-nombre" placeholder="Nombre">
            <input type="text" id="input-apellido" placeholder="Apellido (opcional)">
            <button class="btn" onclick="guardarNombreMeta()">Guardar</button>
        `;
    } else {
        metaDiv.innerHTML = `
            <div>Usuario: ${datos.nombre}${datos.apellido ? ' ' + datos.apellido : ''}</div>
            <button class="btn" onclick="editarNombreMeta()">Editar nombre</button>
            <div style="margin-top:1rem;">
                <div>Meta mensual: ${datos.meta ? datos.meta + ' horas (' + mostrarTipoMeta(datos.tipo_meta) + ')' : 'No configurada'}</div>
                <button class="btn" onclick="mostrarOpcionesMeta()">Cambiar meta</button>
            </div>
        `;
        if (datos.tipo_meta === 'regular') {
            metaDiv.innerHTML += `
                <div style="margin-top:1rem;">
                    <button class="btn" onclick="abrirHorasMesesAnteriores()">Horas meses anteriores</button>
                    <button class="btn" onclick="reiniciarMetaAnual()">Reiniciar meta anual</button>
                </div>
            `;
        }
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
function editarNombreMeta() {
    const metaDiv = document.getElementById('meta-form');
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    metaDiv.innerHTML = `
        <input type="text" id="input-nombre" value="${datos.nombre}" placeholder="Nombre">
        <input type="text" id="input-apellido" value="${datos.apellido || ''}" placeholder="Apellido (opcional)">
        <button class="btn" onclick="guardarNombreMeta()">Guardar</button>
    `;
}
function mostrarOpcionesMeta() {
    const metaDiv = document.getElementById('meta-form');
    metaDiv.dataset.editMeta = "true";
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
    document.getElementById('meta-form').dataset.editMeta = "false";
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
        <input type="number" id="input-meta-personal" placeholder="Horas (máx 99)" min="1" max="99">
        <button class="btn" onclick="guardarMetaPersonal()">Guardar</button>
    `;
}
function guardarMetaPersonal() {
    const valor = parseFloat(document.getElementById('input-meta-personal').value);
    if (!valor || valor < 1 || valor > 99) return alert("Ingresa una meta válida (1-99).");
    setMetaTipo('personal', valor);
}
function mostrarTipoMeta(tipo) {
    if (tipo === 'regular') return 'P. Regular';
    if (tipo === 'auxiliar') return 'P. Auxiliar';
    if (tipo === 'personal') return 'Personal';
    return '';
}

// --- Botón para reiniciar meta anual ---
function reiniciarMetaAnual() {
    if (confirm("¿Seguro que quieres reiniciar la meta anual a 0 horas?")) {
        setValorAnual(0);
        mostrarResumenMes();
        alert("La meta anual se ha reiniciado a 0 horas.");
    }
}

// --- Resumen de meta y progreso ---
function mostrarResumenMes() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    const meta = datos.meta || 0;
    const nombre = datos.nombre || '';
    const apellido = datos.apellido || '';
    let totalServicioHoras = 0;
    document.querySelectorAll('ul').forEach(ul => {
        ul.querySelectorAll('li.servicio').forEach(li => {
            const horas = parseFloat(li.getAttribute('data-horas') || '0');
            totalServicioHoras += horas;
        });
    });
    let totalActualizadoHoras = parseFloat(localStorage.getItem('actualizar_hrs') || '0');
    let totalA2 = getHorasA2();
    let total = totalActualizadoHoras + totalA2;
    let faltan = meta - total;
    let progreso = '';
    if (meta > 0) {
        if (total <= 0) {
            progreso = `Empecemos 😌: 0 hrs`;
        } else if (total < (meta / 2)) {
            progreso = `¡Ya empezamos! 😊: ${total.toFixed(2)} hrs`;
        } else if (total === (meta / 2)) {
            progreso = `Vas a la mitad 🏃 ¡No te rindas!`;
        } else if (total > (meta / 2) && faltan > (meta / 3)) {
            progreso = `A ${total.toFixed(2)} hrs de conquistar la 🏔️🚩`;
        } else if (faltan <= (meta / 3) && faltan > (meta / 8)) {
            progreso = `¡¡Ya casi!! 💪 Solo faltan: ${faltan.toFixed(2)} hrs`;
        } else if (faltan <= (meta / 8) && faltan > 0) {
            progreso = `¡¡Recta final!! 🔥 Meta a: ${faltan.toFixed(2)} hrs`;
        } else if (faltan === 0) {
            progreso = `(: ¡Lo conseguiste! 🎇 :)<br>¿Te gustaría agradecerle a Jehová?`;
        } else if (faltan < 0) {
            progreso = `¡Superaste tu meta por ${Math.abs(faltan).toFixed(2)} hrs! 😊`;
        }

        /* ---------------- Resumen extendido — implementación ---------------- */

        function mesesRestantesHasta(targetIndexInclusive) {
            // targetIndexInclusive: 0=Ene ... 11=Dic
            const hoy = new Date();
            const actual = hoy.getMonth(); // 0..11
            if (actual <= targetIndexInclusive) return targetIndexInclusive - actual + 1;
            // wrap-around
            return (12 - actual) + targetIndexInclusive + 1;
        }

        function enPrimerSemestre(actualIndex) {
            // Primer semestre del "año" definido: Septiembre(8) .. Febrero(1)
            // Devuelve true si actualIndex ∈ {8,9,10,11,0,1}
            return (actualIndex >= 8) || (actualIndex <= 1);
        }

        function calcularNecesidadSemestral() {
            const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
            const metaAnual = (datos.tipo_meta === 'regular') ? 600 : ((datos.meta && !isNaN(parseFloat(datos.meta))) ? Number(datos.meta) * 12 : 600);
            const mitad = metaAnual / 2;

            // total ingresado según tu especificación: atrasadas + actualizadas
            const horasAtrasadas = getHorasMesesAnteriores(); // número >=0
            const horasActualizadas = parseFloat(localStorage.getItem('actualizar_hrs') || '0') || 0;
            const totalIngresado = horasAtrasadas + horasActualizadas;

            // meses restantes hasta Feb (primer semestre) o Agosto (segundo semestre)
            const mesActual = new Date().getMonth(); // 0..11
            let targetMonthIndex, semestreNombre;
            if (enPrimerSemestre(mesActual)) {
                targetMonthIndex = 1; // Febrero
                semestreNombre = 'Primer semestre (Sep-Feb)';
            } else {
                targetMonthIndex = 7; // Agosto
                semestreNombre = 'Segundo semestre (Mar-Ago)';
            }
            const mesesRestantes = mesesRestantesHasta(targetMonthIndex);

            // total faltante para la mitad
            const faltanteSemestre = Math.max(0, mitad - totalIngresado);

            // horas necesarias por mes (float)
            const necesidadPorMes = mesesRestantes > 0 ? (faltanteSemestre / mesesRestantes) : faltanteSemestre;

            // restricciones por mes: máximo práctico por mes = 55
            const maxPorMes = 55;
            const maxPosibleEnPeriodo = maxPorMes * mesesRestantes;
            const puedeAlcanzar = (maxPosibleEnPeriodo >= faltanteSemestre);

            return {
                metaAnual,
                mitad,
                horasAtrasadas,
                horasActualizadas,
                totalIngresado,
                mesActual,
                semestreNombre,
                mesesRestantes,
                faltanteSemestre,
                necesidadPorMes,
                maxPorMes,
                maxPosibleEnPeriodo,
                puedeAlcanzar
            };
        }

        /* Construye y muestra el resumen extendido dentro del contenedor resumen-mes.
           Crea un bloque colapsable con id 'resumen-extendido' y un botón para togglearlo. */
        function mostrarResumenExtendido() {
            // asegurar que el resumen principal existe
            const cont = document.getElementById('resumen-mes');
            if (!cont) return;
            const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');

            // obtenemos info básica ya existente
            // meta semanal: suma de li.servicio data-horas (ya lo calculas en mostrarResumenMes)
            let metaSemanal = 0;
            document.querySelectorAll('ul').forEach(ul => {
                ul.querySelectorAll('li.servicio').forEach(li => {
                    const h = parseFloat(li.getAttribute('data-horas') || '0') || 0;
                    metaSemanal += h;
                });
            });

            // totales relacionados a actualizar_hrs y A2
            const horasAtrasadas = getHorasMesesAnteriores();
            const horasActualizadas = parseFloat(localStorage.getItem('actualizar_hrs') || '0') || 0;
            const horasA2 = getHorasA2();

            // cálculo semestral
            const sem = calcularNecesidadSemestral();

            // build HTML
            let html = `
    <div class="resumen-extendido-header" style="display:flex;justify-content:space-between;align-items:center;">
      <div><strong>Resumen extendido</strong></div>
      <div><button class="btn" id="btn-toggle-resumen-extendido">Cerrar</button></div>
    </div>
    <div class="resumen-extendido-body" id="resumen-extendido-body" style="margin-top:8px;">
      <hr>
      <div> ${sem.semestreNombre}</div>
      <div><strong>Faltan</strong> ${sem.mesesRestantes} meses incluyend este. </div>
      <div><strong>Haz</strong> ${sem.necesidadPorMes.toFixed(2)} hrs/mes ${sem.mesesRestantes > 0 ? 'hasta ' + (enPrimerSemestre(sem.mesActual) ? 'febrero' : 'agosto') : ''}</div>
      <hr>
      <div><strong>Horas anteriores:</strong> ${horasAtrasadas.toFixed(2)} hrs</div>
      <div><strong>Acumulado total:</strong> ${(horasAtrasadas + horasActualizadas).toFixed(2)} hrs</div>
      <hr>
    </div>
  `;

            // replace / open
            let bloqueExistente = document.getElementById('resumen-extendido-container');
            if (!bloqueExistente) {
                const nodo = document.createElement('div');
                nodo.id = 'resumen-extendido-container';
                nodo.className = 'resumen-extendido-container';
                nodo.innerHTML = html;
                cont.appendChild(nodo);
                // bind close
                document.getElementById('btn-toggle-resumen-extendido').onclick = function () {
                    const el = document.getElementById('resumen-extendido-container');
                    if (el) el.remove();
                };
            } else {
                bloqueExistente.innerHTML = html;
                document.getElementById('btn-toggle-resumen-extendido').onclick = function () {
                    const el = document.getElementById('resumen-extendido-container');
                    if (el) el.remove();
                };
            }
        }

        /* Genera el mensaje de progreso usando la lógica que ya tenías (reutiliza la función o la reimplementa aquí).
           Para evitar duplicar lógica, recuperamos la cadena de progreso desde mostrarResumenMes (si tienes función
           separada, úsala). Aquí reimplemento una versión compacta: */
        function generarMensajeProgreso() {
            const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
            const meta = datos.meta || 0;
            let totalServicioHoras = 0;
            document.querySelectorAll('ul').forEach(ul => {
                ul.querySelectorAll('li.servicio').forEach(li => {
                    const horas = parseFloat(li.getAttribute('data-horas') || '0') || 0;
                    totalServicioHoras += horas;
                });
            });
            let totalActualizadoHoras = parseFloat(localStorage.getItem('actualizar_hrs') || '0') || 0;
            let totalA2 = getHorasA2();
            let total = totalActualizadoHoras + totalA2;
            let progreso = '';
            if (meta > 0) {
                if (total <= 0) {
                    progreso = `Empecemos 😌: 0 hrs`;
                } else if (total < (meta / 2)) {
                    progreso = `¡Ya empezamos! 😊: ${total.toFixed(2)} hrs`;
                } else if (total === (meta / 2)) {
                    progreso = `Vas a la mitad ¡No te rindas! 🏃 ${total.toFixed(2)} hrs`;
                } else if (total > (meta / 2) && (meta - total) > (meta / 3)) {
                    progreso = `Estas por conquistar la meta 🏔️🧗🚩 ${total.toFixed(2)} hrs`;
                } else if ((meta - total) <= (meta / 3) && (meta - total) > (meta / 8)) {
                    progreso = `¡¡Ya casi!! 💪 Solo faltan: ${(meta - total).toFixed(2)} hrs`;
                } else if ((meta - total) <= (meta / 8) && (meta - total) > 0) {
                    progreso = `¡¡Recta final!! 🏁🔥🏁 La meta esta a: ${(meta - total).toFixed(2)} hrs`;
                } else if (meta - total === 0) {
                    progreso = `(: ¡Lo conseguiste! 🎇 :)`;
                } else if (meta - total < 0) {
                    progreso = `¡Superaste tu meta por ${Math.abs(meta - total).toFixed(2)} hrs! 😊`;
                }
            }
            return progreso;
        }

        /* Helper: invocar el resumen extendido desde el resumen principal:
           añade un botón "Ver más" en mostrarResumenMes (o al final del bloque resumen-mes)
           para llamar a mostrarResumenExtendido(). */
    function insertarBotonResumenExtendido() {
        // El contenedor donde se inserta el botón
        const resumenDiv = document.getElementById('resumen-mes');
        if (!resumenDiv) return;

        // Elimina cualquier botón anterior para evitar duplicados
        const botonExistente = document.getElementById('btn-ver-mas');
        if (botonExistente) botonExistente.remove();

        // 🔍 Verifica si el tipo de meta actual es 'regular'
        const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
        if (datos.tipo_meta !== 'regular') {
            return; // Si no es P. Regular, no muestra el botón
        }

        // Crea el botón
        const boton = document.createElement('button');
        boton.id = 'btn-ver-mas';
        boton.textContent = 'Ver más';
        boton.className = 'btn-ver-mas';
        boton.onclick = mostrarResumenExtendido;

        // Inserta el botón una línea debajo del resumen
        resumenDiv.insertAdjacentElement('afterend', boton);
    }

    }
    // Informe anual solo para P. Regular
    let resumenAnual = '';
    if (datos.tipo_meta === 'regular') {
        let metaAnual = 600;
        let valorAnual = getValorAnual();
        let horasMesesAnt = getHorasMesesAnteriores();
        let restanteAnual = metaAnual - valorAnual - horasMesesAnt;
        if (restanteAnual < 0) restanteAnual = 0;
        // resumenAnual = `<strong>Meta anual:</strong> 600 hrs<br><strong>Acumulado:</strong> ${valorAnual.toFixed(2)} hrs<br><strong>Faltan:</strong> ${restanteAnual.toFixed(2)} hrs`;
    }
    document.getElementById('resumen-mes').innerHTML = `
        ${nombre}${apellido ? ' ' + apellido : ''}, así vas:<br>
        ${resumenAnual}
        Meta mensual: ${meta > 0 ? meta + ' hrs' : 'Establece tu meta'}<br>
        Meta semanal: ${totalServicioHoras} hrs<br>
        ${progreso}
    `;
    insertarBotonResumenExtendido();
}

// --- Copia de seguridad ---
function exportarDatos() {
    const datos = {};
    Object.keys(localStorage).forEach(key => {
        if (
            key.startsWith('actividades_') ||
            key === 'datos_usuario' ||
            key === 'actualizar_hrs' ||
            key === 'horas_a2' ||
            key === 'valorAnual' ||
            key === 'horasMesesAnteriores'
        ) {
            datos[key] = localStorage.getItem(key);
        }
    });
    const blob = new Blob([JSON.stringify(datos)], { type: "application/json" });
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
    lector.onload = function (e) {
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
function cargarActividades() {
    document.querySelectorAll('ul').forEach(ul => {
        const id = ul.id;
        const guardadas = localStorage.getItem('actividades_' + id);
        if (guardadas) {
            ul.innerHTML = '';
            JSON.parse(guardadas).forEach(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const li = tempDiv.firstElementChild;
                Array.from(li.querySelectorAll('button')).forEach(btn => btn.remove());
                li.appendChild(crearBotonEditar(li));
                li.appendChild(crearBotonEliminar(li));
                ul.appendChild(li);
            });
        }
    });
}
function guardarActividades() {
    document.querySelectorAll('ul').forEach(ul => {
        const id = ul.id;
        const actividades = [];
        ul.querySelectorAll('li').forEach(li => {
            const clone = li.cloneNode(true);
            Array.from(clone.querySelectorAll('button')).forEach(btn => btn.remove());
            actividades.push(clone.outerHTML);
        });
        localStorage.setItem('actividades_' + id, JSON.stringify(actividades));
    });
    mostrarResumenMes();
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

function cerrarModal() {
    const modal = document.getElementById('modal-agregar');
    modal.classList.remove('abierto');
    modal.innerHTML = '';
    mostrarResumenMes();
}

// --- Menú para agregar actividades ---
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
function abrirFormularioActividad(ulId, tipoActividad, categoria) {
    let opciones = '';
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    if (categoria === 'servicio') {
        opciones = `
            <option value="">Selecciona...</option>
            <option value="Casa en casa">Casa en casa</option>
            <option value="Pública">Pública</option>
            <option value="Revisita">Revisita</option>
            <option value="C. Bíblico">C. Bíblico</option>
            ${datos.tipo_meta === 'regular' ? '<option value="A2">A2</option>' : ''}
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
function guardarActividad(ulId, tipoActividad, categoria) {
    const hora = document.getElementById('hora-actividad').value;
    const tipo = document.getElementById('tipo-actividad').value; // p.e. "A2" o "Casa en casa"
    const texto = document.getElementById('breve-texto').value.trim();
    const horas = parseFloat(document.getElementById('horas-dedicadas').value) || '';
    let contenido = '';
    if (hora) contenido += `<span>${hora}</span> | `;
    if (tipo) contenido += `${tipo}`;
    if (texto) contenido += ` > ${texto}`;
    if (horas !== '') contenido += ` | ${horas}h`;
    if (!contenido) return;
    const ul = document.getElementById(ulId);
    const li = document.createElement('li');
    li.innerHTML = contenido;
    li.classList.add(categoria);
    // Guardar tipo explícito para identificar A2 más tarde
    if (tipo) li.setAttribute('data-tipo', tipo);
    li.setAttribute('data-tipo-actividad', tipoActividad);
    if (horas !== '') li.setAttribute('data-horas', horas);
    li.setAttribute('data-fija', tipoActividad === 'fija' ? 'true' : 'false');
    li.appendChild(crearBotonEditar(li));
    li.appendChild(crearBotonEliminar(li));
    ul.appendChild(li);
    guardarActividades();
    cerrarModal();
    actualizarBotonesEliminar();
    ordenarActividadesPorHora(ulId);
}


// --- Actualizar horas (botón a la derecha) ---
function abrirFormularioActualizarHrs() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    const modal = document.getElementById('modal-agregar');
    let preguntaA2 = '';
    if (datos.tipo_meta === 'regular') {
        preguntaA2 = `
            <label>¿Son horas de servicio A2?</label>
            <select id="input-a2">
                <option value="no">No</option>
                <option value="si">Sí</option>
            </select>
        `;
    }
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Actualizar </h3>
            ${preguntaA2}
            <input type="text" id="input-actualizar-hrs" placeholder="Ej: 2.5 o 2:30">
            <button class="btn" id="btn-aceptar-hrs">Aceptar</button>
            <button class="btn" id="btn-cancelar-hrs">Cancelar</button>
        </div>
    `;
    modal.classList.add('abierto');
    document.getElementById('btn-aceptar-hrs').onclick = guardarActualizarHrs;
    document.getElementById('btn-cancelar-hrs').onclick = cerrarModal;
}

// Convierte "2:30" a 2.5 horas, o devuelve el número si es decimal
function convertirHoras(valor) {
    if (valor.includes(':')) {
        const partes = valor.split(':');
        const horas = parseInt(partes[0], 10) || 0;
        const minutos = parseInt(partes[1], 10) || 0;
        return horas + (minutos / 60);
    }
    return parseFloat(valor) || 0;
}

// Guarda las horas actualizadas en localStorage
function guardarActualizarHrs() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    const valorRaw = document.getElementById('input-actualizar-hrs').value.trim();
    const valor = convertirHoras(valorRaw);
    let esA2 = false;
    if (datos.tipo_meta === 'regular' && document.getElementById('input-a2')) {
        esA2 = document.getElementById('input-a2').value === 'si';
    }
    if (valor === 0) {
        alert("Ingresa una cantidad válida de horas.");
        return;
    }
    if (esA2) {
        let actualA2 = getHorasA2();
        actualA2 += valor;
        setHorasA2(actualA2);
    } else {
        let actual = parseFloat(localStorage.getItem('actualizar_hrs') || '0');
        actual += valor;
        localStorage.setItem('actualizar_hrs', actual);
    }
    // Sumar al valor anual si meta es P. Regular
    if (datos.tipo_meta === 'regular') {
        let nuevoValor = getValorAnual() + valor;
        setValorAnual(nuevoValor); // SOLO sumar el valor ingresado y limitar entre 0 y 600
    }
    mostrarResumenMes();
    cerrarModal();
}

// --- Horas meses anteriores ---
function abrirHorasMesesAnteriores() {
    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>¿Desea agregar horas de meses anteriores a su informe?</h3>
            <input type="number" id="input-horas-meses-anteriores" min="0" step="0.01" placeholder="Horas">
            <button class="btn" id="btn-aceptar-hma">Aceptar</button>
            <button class="btn" id="btn-cancelar-hma">Cancelar</button>
        </div>
    `;
    modal.classList.add('abierto');
    document.getElementById('btn-aceptar-hma').onclick = function () {
        const valor = parseFloat(document.getElementById('input-horas-meses-anteriores').value) || 0;
        setHorasMesesAnteriores(valor);
        mostrarResumenMes();
        cerrarModal();
    };
    document.getElementById('btn-cancelar-hma').onclick = cerrarModal;
}

// --- Botón editar y eliminar ---
function crearBotonEditar(li) {
    const btn = document.createElement('button');
    btn.textContent = 'Editar';
    btn.className = 'btn-edit';
    btn.onclick = function (e) {
        e.stopPropagation();
        editarActividad(li);
    };
    return btn;
}
function crearBotonEliminar(li) {
    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.className = 'btn-del';
    btn.title = 'Eliminar';
    btn.onclick = function (e) {
        e.stopPropagation();
        if (confirm("¿Seguro que quieres eliminar esta actividad?")) {
            li.remove();
            guardarActividades();
            actualizarBotonesEliminar();
        }
    };
    return btn;
}
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
function editarActividad(li) {
    li.classList.add('editando');
    const contenido = li.innerHTML;
    const horaMatch = contenido.match(/<span>(.*?)<\/span>/);
    const hora = horaMatch ? horaMatch[1] : '';
    const tipoMatch = contenido.match(/\| ([^>]+)(?: >| \|)/);
    const tipo = tipoMatch ? tipoMatch[1].trim() : '';
    const textoMatch = contenido.match(/> ([^|]+)(?: \|)?/);
    const texto = textoMatch ? textoMatch[1].trim() : '';
    const horasMatch = contenido.match(/\| ([\d\.\-]+)h/);
    const horas = horasMatch ? horasMatch[1] : '';
    li.innerHTML = `
        <div class="edit-controls">
            <input type="time" class="edit-hora" value="${hora}" style="width:4.5rem;">
            <select class="edit-tipo">
                <option value="">Selecciona...</option>
                <option value="Casa en casa" ${tipo === "Casa en casa" ? "selected" : ""}>Casa en casa</option>
                <option value="Pública" ${tipo === "Pública" ? "selected" : ""}>Pública</option>
                <option value="Revisita" ${tipo === "Revisita" ? "selected" : ""}>Revisita</option>
                <option value="C. Bíblico" ${tipo === "C. Bíblico" ? "selected" : ""}>C. Bíblico</option>
                <option value="A2" ${tipo === "A2" ? "selected" : ""}>A2</option>
                <option value="Académico" ${tipo === "Académico" ? "selected" : ""}>Académico</option>
                <option value="Espiritual" ${tipo === "Espiritual" ? "selected" : ""}>Espiritual</option>
                <option value="Familiar" ${tipo === "Familiar" ? "selected" : ""}>Familiar</option>
                <option value="Laboral" ${tipo === "Laboral" ? "selected" : ""}>Laboral</option>
                <option value="Médica" ${tipo === "Médica" ? "selected" : ""}>Médica</option>
                <option value="Recreativa" ${tipo === "Recreativa" ? "selected" : ""}>Recreativa</option>
                <option value="Social" ${tipo === "Social" ? "selected" : ""}>Social</option>
            </select>
            <input type="text" class="edit-texto" value="${texto}" placeholder="Descripción breve">
            <input type="number" class="edit-horas" value="${horas}" min="-99" max="99" step="0.1" placeholder="Horas">
            <button class="btn" onclick="guardarEdicion(this)">Guardar</button>
            <button class="btn" onclick="cancelarEdicion(this)">Cancelar</button>
        </div>
    `;
}
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
    // actualizar atributo data-horas y data-tipo
    if (li.classList.contains('servicio')) li.setAttribute('data-horas', horas);
    if (tipo) li.setAttribute('data-tipo', tipo);
    else li.removeAttribute('data-tipo');
    li.classList.remove('editando');
    li.appendChild(crearBotonEditar(li));
    li.appendChild(crearBotonEliminar(li));
    guardarActividades();
    actualizarBotonesEliminar();
    ordenarActividadesPorHora(li.parentElement.id);
}

function cancelarEdicion(btn) {
    const li = btn.closest('li');
    li.classList.remove('editando');
    cargarActividades();
    actualizarBotonesEliminar();
}

// --- Informe mensual ---
function abrirInforme() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    if (!datos.nombre) return alert("Primero configura tu nombre y meta en 'Mi meta del mes'.");
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

// // Genera el informe y muestra opciones
// function generarInforme() {
//     const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
//     const cb = parseInt(document.getElementById('input-cb').value, 10) || 0;
//     const nombre = datos.nombre || '';
//     const apellido = datos.apellido || '';
//     const mes = getMesActual();
//     const año = new Date().getFullYear();
//     const tipoMeta = datos.tipo_meta;
//     const meta = datos.meta || 0;
//     const totalActualizadoHoras = parseFloat(localStorage.getItem('actualizar_hrs') || '0');
//     const totalA2 = getHorasA2();
//     let texto = '';
//     // Si hay horas A2, mostrar formato especial
//     if ((tipoMeta === 'regular' || tipoMeta === 'auxiliar') && totalA2 > 0) {
//         texto = `${nombre}${apellido ? ' ' + apellido : ''} | ${mes} ${año} | ${mostrarTipoMeta(tipoMeta)}\nHoras de servicio: ${totalActualizadoHoras}\nHoras servicio A2: ${totalA2}\nTotal horas: ${totalActualizadoHoras + totalA2}\nC.B.: ${cb}`;
//     } else if (tipoMeta === 'regular' || tipoMeta === 'auxiliar') {
//         texto = `${nombre}${apellido ? ' ' + apellido : ''} | ${mes} ${año} | ${mostrarTipoMeta(tipoMeta)}\nHoras: ${totalActualizadoHoras}\nC.B.: ${cb}`;
//     } else {
//         texto = `${nombre}${apellido ? ' ' + apellido : ''} | ${mes} ${año}\nParticipe en una o varias facetas del servicio este mes\nC.B.: ${cb}`;
//     }
//     const modal = document.getElementById('modal-agregar');
//     modal.innerHTML = `
//         <div class="modal-content">
//             <h3>Informe generado</h3>
//             <textarea id="informe-txt" readonly style="width:95%;height:6em;">${texto}</textarea>
//             <button class="btn" onclick="copiarInforme()">Copiar</button>
//             <button class="btn" onclick="descargarInformeTxt()">Generar .txt</button>
//             <button class="btn" id="btn-confirmar-informe">Confirmar</button>
//             <button class="btn" onclick="cerrarModal()">Cancelar</button>
//             <div id="copiado-msg" class="copiado-msg"></div>
//         </div>
//     `;
//     document.getElementById('btn-confirmar-informe').onclick = confirmarInforme;
// }

// Genera el informe y muestra opciones (reemplazo con regla 55h)
function generarInforme() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    const cb = parseInt(document.getElementById('input-cb').value, 10) || 0;
    const nombre = datos.nombre || '';
    const apellido = datos.apellido || '';
    const mes = getMesActual();
    const año = new Date().getFullYear();
    const tipoMeta = datos.tipo_meta;
    const meta = datos.meta || 0;

    // 1) fuente: actualizar_hrs (solo NO-A2, porque cuando se guardó con esA2=true
    // el código incrementó horas_a2 en lugar de actualizar_hrs)
    const horasActualizadasNoA2 = parseFloat(localStorage.getItem('actualizar_hrs') || '0') || 0;

    // 2) fuente: horas A2 guardadas por "Actualizar hrs" con esA2=true
    const horasA2Guardadas = getHorasA2();

    // 3) sumar actividades (li.servicio) y distinguir A2 vs no-A2 usando data-tipo
    let horasActividadesNoA2 = 0;
    let horasActividadesA2 = 0;
    document.querySelectorAll('ul').forEach(ul => {
        ul.querySelectorAll('li.servicio').forEach(li => {
            const h = parseFloat(li.getAttribute('data-horas') || '0') || 0;
            const tipo = (li.getAttribute('data-tipo') || '').toString().trim().toUpperCase();
            if (tipo === 'A2') horasActividadesA2 += h;
            else horasActividadesNoA2 += h;
        });
    });

    // 4) Totales combinados
    const totalNoA2 = horasActualizadasNoA2 + horasActividadesNoA2; // servicio no A2
    const totalA2 = horasA2Guardadas + horasActividadesA2;         // A2 total

    // 5) Aplicar regla de 55h/mes
    const LIMITE_MES = 55;
    let a2Contada = 0;
    let a2Excluida = 0;
    let servicioNoA2 = totalNoA2;

    if (servicioNoA2 >= LIMITE_MES) {
        // la regla que definiste: si servicio (no A2) >= 55, se incluyen completas
        // y A2 no se cuentan (pero se informa que fueron excluidas)
        a2Contada = 0;
        a2Excluida = totalA2;
    } else {
        // A2 puede contarse hasta completar 55
        a2Contada = Math.min(totalA2, LIMITE_MES - servicioNoA2);
        a2Excluida = totalA2 - a2Contada;
    }
    const totalEfectivo = servicioNoA2 + a2Contada;

    // 6) construir detalle del informe
    let detalleHoras = '';
    if (tipoMeta === 'regular' || tipoMeta === 'auxiliar') {
        detalleHoras = `Total servicio: ${servicioNoA2.toFixed(2)}\n` +
                       `Total horas A2: ${a2Contada.toFixed(2)}\n` +
                       `Total horas mes: ${totalEfectivo.toFixed(2)}\n`;
        if (a2Excluida > 0) {
            detalleHoras += `Nota: se excluyeron ${a2Excluida.toFixed(2)} hrs de servicio A2 para respetar el límite de ${LIMITE_MES} hrs/mes.\n`;
        }
    } else {
        detalleHoras = `Horas: ${(horasActualizadasNoA2 + horasActividadesNoA2 + horasA2Guardadas + horasActividadesA2).toFixed(2)}\n`;
    }

    let texto = '';
    if (tipoMeta === 'regular' || tipoMeta === 'auxiliar') {
        texto = `${nombre}${apellido ? ' ' + apellido : ''} | ${mes} ${año} | ${mostrarTipoMeta(tipoMeta)}\n` +
                `${detalleHoras}` +
                `C. Bíblico(s): ${cb}`;
    } else {
        texto = `${nombre}${apellido ? ' ' + apellido : ''} | ${mes} ${año}\nParticipe en una o varias facetas del servicio este mes\nC.B.: ${cb}`;
    }

    const modal = document.getElementById('modal-agregar');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Informe generado</h3>
            <textarea id="informe-txt" readonly style="width:95%;height:8em;">${texto}</textarea>
            <button class="btn" onclick="copiarInforme()">Copiar</button>
            <button class="btn" onclick="descargarInformeTxt()">Generar .txt</button>
            <button class="btn" id="btn-confirmar-informe">Nuevo mes</button>
            <button class="btn" onclick="cerrarModal()">Cancelar</button>
            <div id="copiado-msg" class="copiado-msg"></div>
        </div>
    `;
    document.getElementById('btn-confirmar-informe').onclick = confirmarInforme;
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
    const blob = new Blob([informe], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "informe.txt";
    a.click();
    URL.revokeObjectURL(url);
}

// Confirma el informe y reinicia los datos según reglas
function confirmarInforme() {
    const datos = JSON.parse(localStorage.getItem('datos_usuario') || '{}');
    const mesActual = getMesActual();
    document.querySelectorAll('ul').forEach(ul => {
        ul.querySelectorAll('li').forEach(li => {
            if (li.getAttribute('data-fija') !== 'true') {
                li.remove();
            }
        });
    });
    guardarActividades();
    localStorage.setItem('actualizar_hrs', '0');
    setHorasA2(0);

    // Reinicia valor anual si es agosto
    if (datos.tipo_meta === 'regular' && mesActual === 'Agosto') {
        setValorAnual(0);
        setHorasMesesAnteriores(0);
    }
    if (datos.tipo_meta !== 'regular') {
        datos.meta = 0;
        delete datos.tipo_meta;
    }
    datos.mes = MESES[new Date().getMonth()];
    datos.fecha_inicio = new Date().toISOString();
    localStorage.setItem('datos_usuario', JSON.stringify(datos));
    mostrarResumenMes();
    cargarActividades();
    cerrarModal();
}

// --- Inicialización ---
window.onload = function () {
    if (localStorage.getItem('modo_claro') === 'true') {
        document.body.classList.add('modo-claro');
    }
    mostrarMesActual();
    renderMetaForm();
    cargarActividades();
    mostrarResumenMes();
    actualizarBotonesEliminar();

    document.addEventListener('mousedown', function (e) {
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
