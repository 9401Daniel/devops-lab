// Cargar doctores desde localStorage o inicializar array vacío
let Doctores = JSON.parse(localStorage.getItem('doctores')) || []

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById("Doctorform")
    
    if (formulario) {
        formulario.addEventListener("submit", registrardoctor)
    }
    
    // Si estamos en la página de lista, cargar doctores
    const tablaDoctores = document.querySelector("#DoctorTable tbody")
    if (tablaDoctores) {
        cargarListaDoctores()
    }
})

function registrardoctor(event) {
    event.preventDefault()

    const NombreDoctor = document.getElementById("NombreDoctor").value.trim()
    const ApellidoDoctor = document.getElementById("ApellidoDoctor").value.trim()
    const CedulaDoctor = document.getElementById("NumerocedulaDoctor").value.trim()
    const EspecialidadDoctor = document.getElementById("EspecialidadDoctor").value
    const CorreoDoctor = document.getElementById("CorreoDoctor").value.trim()
    const ConsultorioDoctor = document.getElementById("ConsultorioDoctor").value.trim()

    // Validar todos los campos
    let errores = []

    // Validar nombre
    var expRegnombre = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/;
    if (!expRegnombre.test(NombreDoctor)) {
        errores.push("El nombre no es válido")
    }

    // Validar apellido
    var expRegApellido = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/;
    if (!expRegApellido.test(ApellidoDoctor)) {
        errores.push("El apellido no es válido")
    }

    // Validar cédula
    var expRegCedula = /^((\d{8})|(\d{10})|(\d{11})|(\d{6}-\d{5}))$/;
    if (!expRegCedula.test(CedulaDoctor)) {
        errores.push("La cédula no es válida")
    }

    // Validar especialidad
    if (EspecialidadDoctor === "" || EspecialidadDoctor === "Blanco") {
        errores.push("Debes seleccionar una especialidad")
    }

    // Validar correo
    var expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    if (!expReg.test(CorreoDoctor)) {
        errores.push("El correo no es válido")
    }

    // Validar consultorio (3 dígitos)
    var expRegconsultorio = /^\d{3}$/;
    if (!expRegconsultorio.test(ConsultorioDoctor)) {
        errores.push("El consultorio debe tener exactamente 3 dígitos")
    }

    // Si hay errores, mostrarlos y detener
    if (errores.length > 0) {
        alert("Por favor corrige los siguientes errores:\n\n" + errores.join("\n"))
        return
    }

    // Verificar si la cédula ya existe
    if (Doctores.some(doc => doc.cedula === CedulaDoctor)) {
        alert("Ya existe un doctor registrado con esta cédula")
        return
    }

    // Crear objeto doctor
    const doctor = {
        nombre: NombreDoctor,
        apellido: ApellidoDoctor,
        cedula: CedulaDoctor,
        especialidad: EspecialidadDoctor,
        correo: CorreoDoctor,
        consultorio: ConsultorioDoctor,
        fechaRegistro: new Date().toISOString()
    }

    // Agregar a array
    Doctores.push(doctor)

    // Guardar en localStorage
    localStorage.setItem('doctores', JSON.stringify(Doctores))

    console.log("Doctor registrado:", doctor)
    console.log("Total doctores:", Doctores.length)

    // Mensaje de éxito
    alert("✅ Doctor registrado exitosamente!")

    // Limpiar formulario
    document.getElementById("Doctorform").reset()
}

// Función para cargar la lista de doctores en la tabla
function cargarListaDoctores() {
    const tbody = document.querySelector("#DoctorTable tbody")
    
    if (!tbody) return

    // Limpiar tabla
    tbody.innerHTML = ""

    // Cargar doctores desde localStorage
    Doctores = JSON.parse(localStorage.getItem('doctores')) || []

    if (Doctores.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>No hay doctores registrados</td></tr>"
        return
    }

    // Agregar cada doctor a la tabla
    Doctores.forEach((doctor, index) => {
        const fila = document.createElement("tr")
        
        fila.innerHTML = `
            <td>${doctor.nombre} ${doctor.apellido}</td>
            <td>${doctor.correo}</td>
            <td>${convertirEspecialidad(doctor.especialidad)}</td>
            <td>
                <button onclick="eliminarDoctor(${index})">Eliminar</button>
            </td>
        `
        
        tbody.appendChild(fila)
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

// Función para eliminar doctor
function eliminarDoctor(index) {
    if (confirm("¿Estás seguro de eliminar este doctor?")) {
        Doctores.splice(index, 1)
        localStorage.setItem('doctores', JSON.stringify(Doctores))
        cargarListaDoctores()
        alert("Doctor eliminado")
    }
}






























