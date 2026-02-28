// Cargar citas desde localStorage o inicializar array vacío
let Citas = JSON.parse(localStorage.getItem('citas')) || []

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById("Citamedicaform")
    
    if (formulario) {
        formulario.addEventListener("submit", registrarcita)
        cargarDoctoresDisponibles()
    }
})

function registrarcita(event) {
    event.preventDefault()

    const NumeroDPaciente = document.getElementById("NumeroDPaciente").value.trim()
    const EspecialidadRequerida = document.getElementById("EspecialidadRequerida").value
    const DoctorSeleccionado = document.getElementById("DoctorSeleccionado")?.value
    const FechaCita = document.getElementById("FechaCita")?.value
    const HoraCita = document.getElementById("HoraCita")?.value

    // Validar campos
    let errores = []

    // Validar cédula del paciente
    var expRegCedulaCitapaciente = /^((\d{8})|(\d{10})|(\d{11})|(\d{6}-\d{5}))$/;
    if (!expRegCedulaCitapaciente.test(NumeroDPaciente)) {
        errores.push("La cédula del paciente no es válida")
    }

    // Validar especialidad
    if (!EspecialidadRequerida || EspecialidadRequerida === "Blanco") {
        errores.push("Debes seleccionar una especialidad")
    }

    // Validar fecha (si existe el campo)
    if (FechaCita && !FechaCita) {
        errores.push("Debes seleccionar una fecha")
    }

    // Si hay errores, mostrarlos
    if (errores.length > 0) {
        alert("Por favor corrige los siguientes errores:\n\n" + errores.join("\n"))
        return
    }

    // Verificar que el paciente existe
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || []
    const paciente = pacientes.find(p => p.cedula === NumeroDPaciente)

    if (!paciente) {
        alert("❌ No existe un paciente registrado con esta cédula.\n\nPor favor, registra al paciente primero.")
        return
    }

    // Buscar doctores con la especialidad requerida
    const doctores = JSON.parse(localStorage.getItem('doctores')) || []
    const doctoresDisponibles = doctores.filter(d => d.especialidad === EspecialidadRequerida)

    if (doctoresDisponibles.length === 0) {
        alert("❌ No hay doctores disponibles con la especialidad: " + convertirEspecialidad(EspecialidadRequerida))
        return
    }

    // Asignar doctor (si no hay selector, tomar el primero disponible)
    let doctorAsignado
    if (DoctorSeleccionado) {
        doctorAsignado = doctores.find(d => d.cedula === DoctorSeleccionado)
    } else {
        doctorAsignado = doctoresDisponibles[0]
    }

    // Crear objeto cita
    const cita = {
        id: Date.now(), // ID único basado en timestamp
        paciente: {
            nombre: paciente.nombre + " " + paciente.apellido,
            cedula: paciente.cedula,
            telefono: paciente.telefono
        },
        doctor: {
            nombre: doctorAsignado.nombre + " " + doctorAsignado.apellido,
            cedula: doctorAsignado.cedula,
            consultorio: doctorAsignado.consultorio
        },
        especialidad: EspecialidadRequerida,
        fecha: FechaCita || new Date().toISOString().split('T')[0],
        hora: HoraCita || "Por asignar",
        fechaRegistro: new Date().toISOString(),
        estado: "Pendiente"
    }

    // Agregar a array
    Citas.push(cita)

    // Guardar en localStorage
    localStorage.setItem('citas', JSON.stringify(Citas))

    console.log("Cita registrada:", cita)
    console.log("Total citas:", Citas.length)

    // Mensaje de éxito con detalles
    alert(`✅ Cita registrada exitosamente!

Paciente: ${cita.paciente.nombre}
Doctor: ${cita.doctor.nombre}
Especialidad: ${convertirEspecialidad(cita.especialidad)}
Consultorio: ${cita.doctor.consultorio}
Fecha: ${cita.fecha}
Hora: ${cita.hora}`)

    // Limpiar formulario
    document.getElementById("Citamedicaform").reset()
}

// Función para cargar doctores disponibles según especialidad seleccionada
function cargarDoctoresDisponibles() {
    const selectEspecialidad = document.getElementById("EspecialidadRequerida")
    
    if (!selectEspecialidad) return

    selectEspecialidad.addEventListener('change', function() {
        const especialidad = this.value
        
        if (!especialidad || especialidad === "Blanco") return

        // Buscar doctores con esa especialidad
        const doctores = JSON.parse(localStorage.getItem('doctores')) || []
        const doctoresDisponibles = doctores.filter(d => d.especialidad === especialidad)

        console.log(`Doctores disponibles para ${especialidad}:`, doctoresDisponibles)
        
        if (doctoresDisponibles.length > 0) {
            console.log(`✅ Hay ${doctoresDisponibles.length} doctor(es) disponible(s)`)
        } else {
            console.log(`⚠️ No hay doctores disponibles para esta especialidad`)
        }
    })
}

// Función para convertir el valor de especialidad a texto legible
function convertirEspecialidad(valor) {
    const especialidades = {
        "MedicinaGeneral": "Medicina General",
        "Cardiologia": "Cardiología",
        "MedicinaInterna": "Medicina Interna",
        "Dermatologia": "Dermatología",
        "RehabilitacionFisica": "Rehabilitación Física",
        "Psicologia": "Psicología",
        "Odontologia": "Odontología",
        "Radiologia": "Radiología"
    }
    return especialidades[valor] || valor
}

// Función para cargar lista de citas (si existe una página para eso)
function cargarListaCitas() {
    const tbody = document.querySelector("#CitasTable tbody")
    
    if (!tbody) return

    // Limpiar tabla
    tbody.innerHTML = ""

    // Cargar citas desde localStorage
    Citas = JSON.parse(localStorage.getItem('citas')) || []

    if (Citas.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>No hay citas registradas</td></tr>"
        return
    }

    // Agregar cada cita a la tabla
    Citas.forEach((cita, index) => {
        const fila = document.createElement("tr")
        
        fila.innerHTML = `
            <td>${cita.paciente.nombre}</td>
            <td>${cita.doctor.nombre}</td>
            <td>${convertirEspecialidad(cita.especialidad)}</td>
            <td>${cita.fecha}</td>
            <td>${cita.hora}</td>
            <td>${cita.estado}</td>
            <td>
                <button onclick="cancelarCita(${index})">Cancelar</button>
            </td>
        `
        
        tbody.appendChild(fila)
    })
}

// Función para cancelar cita
function cancelarCita(index) {
    if (confirm("¿Estás seguro de cancelar esta cita?")) {
        Citas.splice(index, 1)
        localStorage.setItem('citas', JSON.stringify(Citas))
        cargarListaCitas()
        alert("Cita cancelada")
    }
}
