let token_acceso = null;
let data= null
const base_url = 'http://localhost:3000/';

//Funcion para mostrar las ultimas transferencias realizadas en nuestro index
const llenarTablaTransferencias = (transferencias) => {
    const tablaBody = document.getElementById('tabla-transferencias');
    tablaBody.innerHTML = '';

    for (const transferencia of transferencias) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${transferencia.id_transferencia}</td>
            <td>${transferencia.fecha}</td>
            <td>${transferencia.comentario}</td>
            <td>${transferencia.monto}</td>
            <td>${transferencia.id_cuenta_recibidor}</td>
        `;
        tablaBody.appendChild(fila);
    }
};

//Funcion para verificar la sesion y obtener los datos de nuestro usuario
const verificarSesion = ()=>{
    try{
        //Verificamos que tengamos un token valido
    token_acceso = JSON.parse(localStorage.getItem('access_token'));
    }catch{
        //en caso contrario nos envia a la pagina de inicio de sesion
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
            const id_usuario = data.data.id_usuario;
            const url = `${base_url}operacion/movimientos/${id_usuario}`;
            
            axios.get(url).then(res =>{
                const response = res.data;
                if(response.error == null && response.data != 'No hay transferencias disponibles para esta cuenta.'){
                    llenarTablaTransferencias(response.data);
                    console.log('Response: ', response.data);
                } else{
                    console.log('Ocurrio un error', response.error);
                }
                console.log('Respuesta transferencias de usuario' , response);
            })
        }).catch(error =>{
            window.location.href = 'login.html';
            console.log('error del servidor, login', error);
        })
    } else{
        window.location.href = 'login.html';
    }
}