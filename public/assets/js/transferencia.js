let token_acceso = null;
let data= null
const base_url = 'http://localhost:3000/';

//Debemos verificar una sesion valida para poder realizar una transferencia
const verificarSesion = ()=>{
    try{
    token_acceso = JSON.parse(localStorage.getItem('access_token'));
    }catch{
        window.location.href = 'login.html';
        console.log('Error al obtener el token', error);
    }
    if(token_acceso ){
        const url = 'http://localhost:3000/usuario/verificar-token';
        const payload = {
            token_acceso: token_acceso
        }
        axios.post(url, payload).then(res=>{
            data = res.data;
            if(data.err ){
                window.location.href = 'login.html';
            }
        }).catch(error =>{
            window.location.href = 'login.html';
            console.log('error del servidor, login', error);
        })
    } else{
        window.location.href = 'login.html';
    }
}

const transferencia = () => {
    //Debemos completar los campos requeridos y encontrar el usuario destino en nuestra base de datos para realizar la transferencia
    const id_usuario_enviador = data.data.id_usuario;
    const nombreDestinatario = document.getElementById('nombreDestinatario').value;
    const rutDestinatario = document.getElementById('rut').value;
    const comentario = document.getElementById('comentario').value;
    const tipo_cuenta = document.getElementById('tipo_cuenta').value;
    const monto = document.getElementById('monto').value;
    const url = `${base_url}operacion/transferir`;
    const payload = {
        id_usuario_enviador: id_usuario_enviador,
        nombreDestinatario: nombreDestinatario,
        rutDestinatario: rutDestinatario,
        comentario: comentario,
        tipo_cuenta: tipo_cuenta,
        monto: monto
    };
    if(id_usuario_enviador && nombreDestinatario && rutDestinatario && tipo_cuenta && monto){
        axios.post(url, payload).then(res =>{
            data = res.data;
            if(data.error == null){
                alert('Transferencia exitosa!');
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirige a la página después de 5 segundos
                }, 1000); // 5000 milisegundos = 5 segundos
            } else{
                console.log('Ocurrio un error', data.error);
            }
        }).catch(error=>{
            console.log('Error del servidor', error);
        })
} else{
    alert('Registro Invalido, Completa el formulario correctamente!');
}               
}