# Sistema de Gestión Médica - MEJORADO

## Mejoras implementadas

### 1. **Almacenamiento de datos**
- Ahora guarda doctores, pacientes y citas en `localStorage`
- Los datos persisten aunque cierres el navegador

### 2. **Listas funcionales**
- Lista de Doctores muestra todos los doctores registrados
- Lista de Pacientes muestra todos los pacientes registrados
- **NUEVA:** Lista de Citas muestra todas las citas agendadas

### 3. **Validación mejorada**
- Eliminadas las alertas molestas una por una
- Ahora muestra un solo mensaje con TODOS los errores
- Solo muestra alerta de éxito cuando todo está correcto

### 4. **Conexión entre módulos**
- El registro de citas valida que el paciente exista
- Busca automáticamente doctores con la especialidad requerida
- Asigna el doctor correspondiente a la cita

### 5. **Funcionalidad de eliminación**
- Botón para eliminar doctores
- Botón para eliminar pacientes
- Botón para cancelar citas

### 6. **Mejoras visuales**
- CSS mejorado con mejor diseño
- Tablas con estilos profesionales
- Formularios más claros y organizados
- Diseño responsive (se adapta a móviles)

### 7. **Nuevas páginas**
- **ListaCitas.html** - Para ver todas las citas registradas

### 8. **Corrección de bugs**
- Arreglados problemas de eventos duplicados
- Validación correcta de campos
- Regex de edad mejorado (1-120 años)

---

## Archivos del proyecto

### HTML (Páginas)
- `Pacientesydoctores.html` - Página de inicio
- `RegistroDoctores.html` - Formulario para registrar doctores
- `RegistroPacientes.html` - Formulario para registrar pacientes
- `Registrocitamedica.html` - Formulario para agendar citas
- `ListaDoctores.html` - Ver lista de doctores
- `ListaPacientes.html` - Ver lista de pacientes
- `ListaCitas.html` - **NUEVO** Ver lista de citas

### JavaScript
- `JSdoctores.js` - Lógica de doctores
- `JSpacientes.js` - Lógica de pacientes
- `JScitaspacientes.js` - Lógica de citas

### Estilos
- `CSS.css` - Estilos mejorados

### Imagen
- `Imagen.avif` - Banner de la página de inicio

---

## Cómo usar

### 1. **Abrir el sistema**
- Abre `Pacientesydoctores.html` en tu navegador

### 2. **Registrar doctores primero**
1. Ve a "Registro Doctores"
2. Llena el formulario
3. Click en "Registrar Doctor"
4. Verifica en "Lista Doctores"

### 3. **Registrar pacientes**
1. Ve a "Registro Pacientes"
2. Llena el formulario
3. Click en "Registrar Paciente"
4. Verifica en "Lista Pacientes"

### 4. **Agendar citas**
1. Ve a "Registro Citas Médicas"
2. Ingresa la cédula del paciente (debe estar registrado)
3. Selecciona especialidad
4. Selecciona fecha y hora
5. Click en "Registrar Cita"
6. El sistema:
   - Verifica que el paciente existe
   - Busca doctores con esa especialidad
   - Asigna automáticamente un doctor
   - Guarda la cita
7. Verifica en "Lista Citas"

---

## Datos almacenados

Los datos se guardan en `localStorage` del navegador:
- `doctores` - Array de doctores
- `pacientes` - Array de pacientes
- `citas` - Array de citas

### Para limpiar todos los datos:
Abre la consola del navegador (F12) y ejecuta:
```javascript
localStorage.clear()
```

---

## Validaciones implementadas

### Doctores:
- Nombre y apellido: solo letras y espacios
- Cédula: 8, 10, 11 dígitos o formato 123456-12345
- Especialidad: debe seleccionar una
- Consultorio: exactamente 3 dígitos
- Correo: formato válido de email
- No permite cédulas duplicadas

### Pacientes:
- Nombre y apellido: solo letras y espacios
- Cédula: 8, 10, 11 dígitos o formato 123456-12345
- Edad: entre 1 y 120 años
- Correo: formato válido de email
- Teléfono: exactamente 10 dígitos
- No permite cédulas duplicadas

### Citas:
- Verifica que el paciente esté registrado
- Verifica que haya doctores con la especialidad
- Asigna automáticamente el doctor disponible
- Requiere fecha y hora

---

## Solución de problemas

### "No hay doctores disponibles"
- Primero registra doctores con la especialidad que necesitas

### "No existe un paciente con esta cédula"
- Primero registra al paciente antes de agendar cita

### Los datos desaparecen
- Revisa que no estés usando modo incógnito
- Verifica que localStorage esté habilitado en tu navegador

---

## Notas importantes

1. **Orden recomendado:**
   - Primero registra doctores
   - Luego registra pacientes
   - Finalmente agenda citas

2. **Especialidades disponibles:**
   - Medicina General
   - Cardiología
   - Medicina Interna
   - Dermatología
   - Rehabilitación Física
   - Psicología
   - Odontología
   - Radiología

3. **Formato de cédula aceptado:**
   - 12345678 (8 dígitos)
   - 1234567890 (10 dígitos)
   - 12345678901 (11 dígitos)
   - 123456-12345 (6 dígitos-5 dígitos)

---

## Próximas mejoras sugeridas

- Editar doctores, pacientes y citas
- Buscar por nombre o cédula
- Exportar datos a Excel/PDF
- Sistema de usuarios y login
- [ ] Historial médico de pacientes
- [ ] Recordatorios de citas
- [ ] Estadísticas del sistema

---