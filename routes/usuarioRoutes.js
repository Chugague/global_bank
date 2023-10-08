import express from 'express';
//Importamos las funciones de usuarios
import {crearUsuario, loginUsuario, modificarUsuario, verificarToken} from '../controller/usuarioController.js';

const router = express.Router();

//Ruta para crear un nuevo usuario, junto con sus cuentas y credenciales
router.post('/crear', crearUsuario);
//Ruta para poder iniciar sesion
router.post('/inicio-sesion', loginUsuario);
//Ruta para verificar el token
router.post('/verificar-token', verificarToken);
//Ruta para modificar un usuario
router.put('/:id_usuario', modificarUsuario);


export default router;