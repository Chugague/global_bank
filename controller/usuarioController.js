//Importamos las clases y el validador del token para tener una persistencia en la seguridad de la sesion
import {Usuario} from '../model/usuarioModel.js';
import { Credencial } from '../model/credencialModel.js';
import { Cuenta } from '../model/cuentaModel.js';
import { validateJWT } from '../utils/jwt.js';

//Funcion controlador para crear un nuevo usuario con sus credenciales y sus cuentas
export const crearUsuario = async (req, res)=>{
    let response = {
        msg: 'Creacion de usuario',
        error: null,
        data: null
    };
    const {nombreCompleto, rut, direccion, telefono, email, contrasena} = req.body;
    try{
        //Verificamos que tengamos los parametros necesarios
        if(nombreCompleto && rut && direccion && telefono && email && contrasena){
            const usuario = new Usuario(nombreCompleto, rut, direccion, telefono)
            const nuevo_usuario = await usuario.crear();
            //Verificamos que el nuevo usuario se haya creado sin problemas
            if(nuevo_usuario != null){
                const credencial = new Credencial(nuevo_usuario.id_usuario);
                credencial.email = email;
                credencial.contrasena = contrasena;
                const nueva_credencial = await credencial.crear();
                //Verificamos que la credencial se haya creado sin problemas
                if(nueva_credencial != null){
                    console.log('Credencial creada con exito');
                    const cuentaCorriente = new Cuenta('Corriente', '100000', nuevo_usuario.id_usuario);
                    const cuentaAhorro = new Cuenta('Ahorro', '0', nuevo_usuario.id_usuario);
                    const nueva_cuentaCorriente = cuentaCorriente.crear();
                    const nueva_cuentaAhorro = cuentaAhorro.crear();
                    //Por ultimo verificamos que tambien se hayan creado las cuentas del usuario
                    if(nueva_cuentaAhorro && nueva_cuentaCorriente){
                        console.log('Cuentas de banco creadas.')
                        response.data = nuevo_usuario;
                        //Posteriormente tenemos el manejo de los distintos errores posibles
                    } else{
                        response.error = 'Error al crear las cuentas bancarias';
                    }

                } else{
                    response.error ='Error al crear la credencial';
                }
            }else{
                response.error ='Error al crear el usuario';
            }
        } else{
            response.error = 'Faltan parametros requeridos';
        }
        res.send(response);
    } catch(error){
        response.error = 'error interno del servidor';
        console.log(error);
        res.status(500).send(response);
    }
}

//Funcion controlador para iniciar sesion
export const loginUsuario = async (req,res)=>{
    let response = {
        msg: 'Login de usuario',
        error: null,
        data: null
    }
    try{
        const{email, contrasena} = req.body;
        if(email && contrasena){
            //Asignamos sus credenciales, contrasenas y token para la seguridad de la sesion
            const credencial = new Credencial();
            credencial.email = email;
            credencial.contrasena = contrasena;
            const resultado_modelo = await credencial.login();
            console.log('Resultado modelo', resultado_modelo);
            if(resultado_modelo != null){
                response.data = resultado_modelo;
            }else{
                response.error = 'Error al iniciar sesion';
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

}

//Funcion controlador para modificar un usuario
export const modificarUsuario = async(req, res)=>{
    let response = {
        msg: 'actualizacion de usuario',
        error: null,
        data: null
    }
    try{
        const{nombreCompleto, rut, direccion, telefono} = req.body;
        const id_usuario = req.params.id_usuario;
        //Verificamos los parametros requeridos
        if(nombreCompleto && rut && direccion && telefono && id_usuario){
            const usuario = new Usuario(nombreCompleto, rut, direccion, telefono);
            usuario.id = id_usuario
            const resultado_modelo = await usuario.modificar();
            console.log('Resultado modelo usuario', resultado_modelo);
            if(resultado_modelo != null){
                response.data = resultado_modelo;
            }else{
                response.error = 'Error al modificar el usuario';
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

//Funcion para verificar la valides de nuestro token de navegacion, en caso de no tenerlo nos enviara al login 
export const verificarToken = async (req, res) => {
    const {token_acceso} = req.body;
    let response = {
            msg: 'Verificacion de token de acceso',
            data: null,
            err: null
        }
    if(token_acceso){
        const token_isvalid = validateJWT(token_acceso);
        if(token_isvalid){
            response.data = token_isvalid;
            console.log(response.data);
            res.status(200).send(response);    
        }else{
            response.data = false;
            response.err = 'Token invalido';
            res.status(200).send(response)
        }
    }else{
        res.status(400).send('Faltan parametros requeridos')
    }
};
