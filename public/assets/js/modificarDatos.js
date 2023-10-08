const base_url = 'http://localhost:3000/';
let data = null;

//Funcion para modificar los datos del usuario, en caso de que algun campo no se modifique mantendra el valor del placeholder
const modificar = ()=>{
    const nombreCompletoInput = document.getElementById("nombreCompleto");
    const nombreCompleto = nombreCompletoInput.value.trim() || nombreCompletoInput.placeholder;
    const rutInput = document.getElementById("rut");
    const rut = rutInput.value.trim() || rutInput.placeholder;
    const direccionInput = document.getElementById("direccion");
    const direccion = direccionInput.value.trim() || direccionInput.placeholder;
    const telefonoInput = document.getElementById("telefono");
    const telefono = telefonoInput.value.trim() || telefonoInput.placeholder;
    const url = `${base_url}usuario/${data.data.id_usuario}`;
    const payload = {
        nombreCompleto: nombreCompleto,
        rut: rut,
        direccion: direccion,
        telefono: telefono,
    }
    //Realizamos la request para modificar el usuario
    axios.put(url, payload).then(res =>{
        const response = res.data;
        console.log('Respuesta modificacion de usuario' , response);
        alert('Datos modificados Correctamente.')

    }).catch(error=>{
        console.log('Error del servidor', error);
    })
}

//Funcion para que el usuario pueda eliminar su cuenta
const eliminar = ()=>{
    const id_usuario = data.data.id_usuario;
    const url = `${base_url}operacion/eliminar?id_usuario=${id_usuario}`;

    //Realizamos la request para eliminar el usuario
    axios.delete(url).then(res =>{
        const response = res.data;
        if(response.error == null){
            console.log('response.error', response.error);
            console.log('deberia eliminar usuario');
            alert('Usuario Eliminado!');
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirige a la página después de 5 segundos
            }, 1000); // 5000 milisegundos = 5 segundos
        } else{
            console.log('Ocurrio un error', response.error);
        }
        console.log('Respuesta eliminar usuario' , response);
    }).catch(error=>{
        console.log('Error del servidor', error);
    })
}

//Al estar dentro del sistema bancario solo se puede acceder a modificar los datos con una sesion valida ya que puede comprometer la cuenta del usuario
const verificarSesion = ()=>{
    const token_acceso = JSON.parse(localStorage.getItem('access_token'));
    if(token_acceso){
        const url = 'http://localhost:3000/usuario/verificar-token';
        const payload = {
            token_acceso: token_acceso
        }
        //Verificamos la sesion valida con el token
        axios.post(url, payload).then(res=>{
            data = res.data;
            if(data.err){
                window.location.href = 'login.html';
            }
            //Utilizamos la informacion del usuario para completar sus datos con el token obtenido
            document.getElementById("nombreCompleto").placeholder = data.data.nombreCompleto;
            document.getElementById("rut").placeholder = data.data.RUT;
            document.getElementById("direccion").placeholder = data.data.direccion;
            document.getElementById("telefono").placeholder = data.data.telefono;
        }).catch(error =>{
            window.location.href = 'login.html';
            console.log('error del servidor, login', error);
        })
    } else{
        window.location.href = 'login.html';
    }
}
