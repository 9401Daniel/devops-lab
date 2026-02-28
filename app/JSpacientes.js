// Cargar pacientes desde localStorage o inicializar array vacío
let Pacientes = JSON.parse(localStorage.getItem('pacientes')) || []

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById("Pacienteform")
    
    if (formulario) {
        formulario.addEventListener("submit", registrarpaciente)
    }
    
    // Si estamos en la página de lista, cargar pacientes
    const tablaPacientes = document.querySelector("#PacienteTable tbody")
    if (tablaPacientes) {
        cargarListaPacientes()
    }
})

function registrarpaciente(event) {
    event.preventDefault()

    const NombrePaciente = document.getElementById("NombrePaciente").value.trim()
    const ApellidoPaciente = document.getElementById("ApellidoPaciente").value.trim()
    const NumerocedulaPaciente = document.getElementById("NumerocedulaPaciente").value.trim()
    const EdadPaciente = document.getElementById("EdadPaciente").value.trim()
    const CorreoPaciente = document.getElementById("CorreoPaciente").value.trim()
    const TelefonoPaciente = document.getElementById("TelefonoPaciente").value.trim()

    // Validar todos los campos
    let errores = []

    // Validar nombre
    var expRegnombreP = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/;
    if (!expRegnombreP.test(NombrePaciente)) {
        errores.push("El nombre no es válido")
    }

    // Validar apellido
    var expRegApellidoP = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$/;
    if (!expRegApellidoP.test(ApellidoPaciente)) {
        errores.push("El apellido no es válido")
    }

    // Validar cédula
    var expRegCedulaP = /^((\d{8})|(\d{10})|(\d{11})|(\d{6}-\d{5}))$/;
    if (!expRegCedulaP.test(NumerocedulaPaciente)) {
        errores.push("La cédula no es válida")
    }

    // Validar edad (1-120)
    const edad = parseInt(EdadPaciente)
    if (isNaN(edad) || edad < 1 || edad > 120) {
        errores.push("La edad debe ser un número entre 1 y 120")
    }

    // Validar correo
    var expRegcorreoP = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    if (!expRegcorreoP.test(CorreoPaciente)) {
        errores.push("El correo no es válido")
    }

    // Validar teléfono (10 dígitos)
    var expRegtelefonoP = /^\d{10}$/;
    if (!expRegtelefonoP.test(TelefonoPaciente)) {
        errores.push("El teléfono debe tener exactamente 10 dígitos")
    }

    // Si hay errores, mostrarlos y detener
    if (errores.length > 0) {
        alert("Por favor corrige los siguientes errores:\n\n" + errores.join("\n"))
        return
    }

    // Verificar si la cédula ya existe
    if (Pacientes.some(pac => pac.cedula === NumerocedulaPaciente)) {
        alert("Ya existe un paciente registrado con esta cédula")
        return
    }

    // Crear objeto paciente
    const paciente = {
        nombre: NombrePaciente,
        apellido: ApellidoPaciente,
        cedula: NumerocedulaPaciente,
        edad: EdadPaciente,
        correo: CorreoPaciente,
        telefono: TelefonoPaciente,
        fechaRegistro: new Date().toISOString()
    }

    // Agregar a array
    Pacientes.push(paciente)

    // Guardar en localStorage
    localStorage.setItem('pacientes', JSON.stringify(Pacientes))

    console.log("Paciente registrado:", paciente)
    console.log("Total pacientes:", Pacientes.length)

    // Mensaje de éxito
    alert("✅ Paciente registrado exitosamente!")

    // Limpiar formulario
    document.getElementById("Pacienteform").reset()
}

// Función para cargar la lista de pacientes en la tabla
function cargarListaPacientes() {
    const tbody = document.querySelector("#PacienteTable tbody")
    
    if (!tbody) return

    // Limpiar tabla
    tbody.innerHTML = ""

    // Cargar pacientes desde localStorage
    Pacientes = JSON.parse(localStorage.getItem('pacientes')) || []

    if (Pacientes.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>No hay pacientes registrados</td></tr>"
        return
    }

    // Agregar cada paciente a la tabla
    Pacientes.forEach((paciente, index) => {
        const fila = document.createElement("tr")
        
        fila.innerHTML = `
            <td>${paciente.nombre} ${paciente.apellido}</td>
            <td>${paciente.cedula}</td>
            <td>${paciente.edad}</td>
            <td>${paciente.correo}</td>
            <td>${paciente.telefono}</td>
            <td>
                <button onclick="eliminarPaciente(${index})">Eliminar</button>
            </td>
        `
        
        tbody.appendChild(fila)
    })
}

// Función para eliminar paciente
function eliminarPaciente(index) {
    if (confirm("¿Estás seguro de eliminar este paciente?")) {
        Pacientes.splice(index, 1)
        localStorage.setItem('pacientes', JSON.stringify(Pacientes))
        cargarListaPacientes()
        alert("Paciente eliminado")
    }
}






















