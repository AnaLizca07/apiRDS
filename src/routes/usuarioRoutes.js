const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

router.get('/:id', auth, usuarioController.obtenerUsuario);
router.post('/', usuarioController.crearUsuario);
//router.post('/login', usuarioController.login);
// Implementar otras rutas según sea necesario

module.exports = router;