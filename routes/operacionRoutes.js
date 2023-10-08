import express, { Router } from 'express';
//Importamos las funciones de operaciones
import {transferencia, eliminarUsuario, obtenerTransferencias} from '../controller/operacionController.js';

const router = express.Router();

//Ruta para realizar una transferencia
router.post('/transferir', transferencia);
//Ruta para eliminar un usuario, se coloco en operaciones por la ruta solicitada en el ejercicio
router.delete('/eliminar', eliminarUsuario);
//Ruta para ver los ultimos movimientos de un usuario
router.get('/movimientos/:id_usuario', obtenerTransferencias)


export default router;