const base_url = 'http://localhost:3000/';

//Funcion para registrarnos en el banco
const registro = ()=>{
    //Verificacion de que se completen los campos requeridos
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const email = document.getElementById('email').value;
    const rut = document.getElementById('rut').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    if(nombreCompleto && email && rut && direccion && telefono && contrasena==confirmarContrasena){
        const url = `${base_url}usuario/crear`
        const payload = {
            nombreCompleto: nombreCompleto,
            email: email,
            rut: rut,
            direccion: direccion,
            telefono: telefono,
            contrasena: contrasena,
        }
        //Request para registrar y crear un nuevo usuario
        axios.post(url, payload).then(res =>{
            console.log('Respuesta creacion de usuario');
            alert('Usuario creado correctamente, puedes iniciar sesion!')

        }).catch(error=>{
            console.log('Error del servidor', error);
        })
    } else{
        alert('Registro Invalido, Completa el formulario correctamente!');
    }
}