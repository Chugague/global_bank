import express from 'express';
//Index de rutas de interfaz
//Rutas de usuarios
import usuarioRoutes from './usuarioRoutes.js';
//Rutas de operaciones
import operacionRoutes from './operacionRoutes.js';

const router = express.Router();

router.use('/usuario', usuarioRoutes);
router.use('/operacion', operacionRoutes);

// Middleware para manejar rutas no encontradas
router.use((req, res) => {
    res.redirect('/error404.html'); // Redirige a la página de error 404
});


export default router;