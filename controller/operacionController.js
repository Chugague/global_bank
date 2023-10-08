//Importamos las clases que necesitamos para que funcionen nuestras distintas operaciones
import { Cuenta } from "../model/cuentaModel.js";
import { Transferencia } from "../model/transferenciaModel.js";
import { Usuario } from "../model/usuarioModel.js";

//Funcion controlador para crear intercambio
export const transferencia = async (req, res) =>{
    let response = {
        msg:'Transferencia',
        error: null,
        data: null
    };
    const {id_usuario_enviador, nombreDestinatario, rutDestinatario, comentario, tipo_cuenta, monto} = req.body;
    //Verificamos que esten todos los parametros
    if(id_usuario_enviador && nombreDestinatario && rutDestinatario && monto){
        //Instanciamos los usuarios y las cuentas tanto de destino como de recibo
        const usuario_destino = new Usuario(nombreDestinatario,rutDestinatario);
        const id_usuario_destino = await usuario_destino.obtenerUsuario();
        const cuenta_destino = new Cuenta()
        cuenta_destino.tipo_cuenta = 'corriente';
        cuenta_destino.id_usuario = id_usuario_destino;
        const id_cuenta_destino = await cuenta_destino.obtenerCuenta();
        const cuenta_enviador = new Cuenta();
        cuenta_enviador.tipo_cuenta = tipo_cuenta;
        cuenta_enviador.id_usuario = id_usuario_enviador;
        const id_cuenta_enviador = await cuenta_enviador.obtenerCuenta();
        //Preparamos la transferencia
        const transferencia = new Transferencia(id_cuenta_enviador, id_cuenta_destino, monto, comentario);
        const resultado_modelo = await transferencia.transferir();
        if(resultado_modelo !=null){
            response.data = resultado_modelo;
        } else{
            response.error = 'Error en la transferencia'
        }
    } else{
        response.error = 'Faltan parametros'
    }
    res.send(response);
};

//Funcion para eliminar un usuario con sus credenciales y cuentas
export const eliminarUsuario = async(req, res)=>{
    let response = {
        msg: 'Eliminar usuario',
        error: null,
        data: null
    }
    try{
        //Obtenemos los parametros
        const id_usuario = req.query.id_usuario;
        if(id_usuario){
            const usuario = new Usuario();
            usuario.id = id_usuario
            //Ejecutamos la funcion para eliminar el usuario
            const resultado_modelo = await usuario.eliminar();
            console.log('Resultado modelo usuario', resultado_modelo);
            if(resultado_modelo != null){
                response.data = resultado_modelo;
            }else{
                response.error = 'Error al eliminar el usuario';
            }
        } else{
            response.error = 'Faltan parametros requeridos';
        }
        res.send(response);
    }catch(error){
        response.error = 'error interno del servidor';
        console.log(error);
        res.status(500).send(response);
    }
};

//Funcion controlador para obtener las ultimas 10 transacciones realizadas por una cuenta para colocarlas en el index.html
export const obtenerTransferencias = async (req, res) =>{
    let response = {
        msg:'Obtener las ultimas transferencias',
        error: null,
        data: null
    };
    const id_usuario = req.params.id_usuario;
    if(id_usuario){
    try{
    const cuenta = new Cuenta();
    cuenta.id_usuario = id_usuario;
    cuenta.tipo_cuenta = 'corriente';
    const cuenta_usuario = await cuenta.obtenerCuenta();
    const transferencia = new Transferencia();
    const transferencia_usuario = await transferencia.obtenerTransferencias(cuenta_usuario);
    if(transferencia_usuario != null){
        if(transferencia_usuario.length == 0){
            response.error= 'No hay transacciones registradas';
        }
        response.data = transferencia_usuario;
    }
    else{
        response.error = 'Error al obtener las transacciones';
    }
    res.status(200).send(response);
}catch(error){
    response.error = 'Error interno del servidor';
    console.log('error: ', error);
    res.status(500).send(response);
}
    }else{
        response.error = 'Faltan parametros';
};
}
