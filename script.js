let bosquejoActual = localStorage.getItem('bosquejo_activo') || '1';
let cantidadPuntos = parseInt(localStorage.getItem(`b${bosquejoActual}_cantidad`)) || 3;
// MEJORA: Recordar el tamaño de letra preferido del usuario
let fontSizeActual = parseInt(localStorage.getItem('fontSize_pref')) || 22;

const camposBase = ['tema', 'cita', 'objetivo_tipo', 'proposito', 'introduccion', 'resumen_final', 'conclusion'];

function cargarDatos() {
    const selector = document.getElementById('selector_bosquejo');
    if (selector) selector.value = bosquejoActual;

    const contenedor = document.getElementById('acordeonPuntos');
    contenedor.innerHTML = "";

    cantidadPuntos = parseInt(localStorage.getItem(`b${bosquejoActual}_cantidad`)) || 3;

    for (let i = 1; i <= cantidadPuntos; i++) {
        crearEstructuraPunto(i);
    }

    camposBase.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = localStorage.getItem(`b${bosquejoActual}_${id}`) || "";
            el.oninput = () => localStorage.setItem(`b${bosquejoActual}_${id}`, el.value);
            el.onfocus = () => {
                const titulo = el.getAttribute('data-titulo') || "CONCLUSIÓN";
                document.getElementById('titulo-lectura-actual').innerText = titulo;
                el.style.fontSize = fontSizeActual + "px";
            };
        }
    });

    for (let i = 1; i <= cantidadPuntos; i++) {
        activarGuardadoPunto(i);
    }
}

function crearEstructuraPunto(i) {
    const contenedor = document.getElementById('acordeonPuntos');
    const div = document.createElement('div');
    div.className = "accordion-item mb-3 border shadow-sm";
    div.innerHTML = `
        <h2 class="accordion-header d-flex align-items-center bg-white p-2">
            <button class="accordion-button collapsed fw-bold w-auto" type="button" data-bs-toggle="collapse" data-bs-target="#cp${i}">
                <span class="badge bg-primary me-2">${i}</span>
            </button>
            <input type="text" id="p${i}_titulo" class="input-titulo-punto ms-2" placeholder="Título del Punto Principal..." 
                   oninput="guardarTituloPunto(${i}, this.value)">
        </h2>
        <div id="cp${i}" class="accordion-collapse collapse" data-bs-parent="#acordeonPuntos">
            <div class="accordion-body bg-light">
                <div class="row g-2">
                    <div class="col-12 mb-2">
                        <label class="small fw-bold text-primary">DESARROLLO DEL PUNTO:</label>
                        <textarea id="p${i}_cuerpo" class="form-control" rows="3" data-tipo="CONTENIDO"></textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="small fw-bold text-success">VERSÍCULOS CLAVE:</label>
                        <textarea id="p${i}_versos" class="form-control border-success" rows="3" data-tipo="VERSÍCULOS" style="background-color: #f0fff4"></textarea>
                    </div>
                    <div class="col-md-6">
                        <label class="small fw-bold text-warning">ILUSTRACIÓN / NOTAS:</label>
                        <textarea id="p${i}_notas" class="form-control border-warning" rows="3" data-tipo="ILUSTRACIÓN" style="background-color: #fffdf0"></textarea>
                    </div>
                </div>
            </div>
        </div>`;
    contenedor.appendChild(div);
}

function activarGuardadoPunto(i) {
    const inputTitulo = document.getElementById(`p${i}_titulo`);
    inputTitulo.value = localStorage.getItem(`b${bosquejoActual}_p${i}_titulo`) || "";

    [`p${i}_cuerpo`, `p${i}_versos`, `p${i}_notas`].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = localStorage.getItem(`b${bosquejoActual}_${id}`) || "";
            el.oninput = () => localStorage.setItem(`b${bosquejoActual}_${id}`, el.value);
            el.onfocus = () => {
                const nombrePunto = document.getElementById(`p${i}_titulo`).value || `PUNTO ${i}`;
                const subSeccion = el.getAttribute('data-tipo');
                document.getElementById('titulo-lectura-actual').innerText = `${nombrePunto} > ${subSeccion}`;
                el.style.fontSize = fontSizeActual + "px";
            };
        }
    });
}

function guardarTituloPunto(i, valor) {
    localStorage.setItem(`b${bosquejoActual}_p${i}_titulo`, valor);
}

function cambiarTamanoLetra(delta) {
    fontSizeActual += delta;
    if (fontSizeActual < 12) fontSizeActual = 12;
    if (fontSizeActual > 60) fontSizeActual = 60;
    
    // MEJORA: Guardar preferencia de tamaño
    localStorage.setItem('fontSize_pref', fontSizeActual);

    if (document.activeElement && document.activeElement.tagName === "TEXTAREA") {
        document.activeElement.style.fontSize = fontSizeActual + "px";
    }
}

function agregarPunto() {
    cantidadPuntos++;
    localStorage.setItem(`b${bosquejoActual}_cantidad`, cantidadPuntos);
    crearEstructuraPunto(cantidadPuntos);
    activarGuardadoPunto(cantidadPuntos);
}

function eliminarUltimoPunto() {
    if (cantidadPuntos <= 1) return alert("Debe haber al menos un punto.");
    if (confirm(`¿Eliminar el último punto (Punto ${cantidadPuntos})?`)) {
        [`p${cantidadPuntos}_cuerpo`, `p${cantidadPuntos}_versos`, `p${cantidadPuntos}_notas`, `p${cantidadPuntos}_titulo`].forEach(id => {
            localStorage.removeItem(`b${bosquejoActual}_${id}`);
        });
        cantidadPuntos--;
        localStorage.setItem(`b${bosquejoActual}_cantidad`, cantidadPuntos);
        cargarDatos();
    }
}

function cambiarBosquejo(nuevoId) {
    bosquejoActual = nuevoId;
    localStorage.setItem('bosquejo_activo', nuevoId);
    cargarDatos();
}

function cerrarLectura() { if (document.activeElement) document.activeElement.blur(); }

window.onload = cargarDatos;

function imprimirPDF() { window.print(); }
