const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Login primeiro (para não conflitar com /:tipo)
router.post('/login', usuarioController.login);

router.post('/', usuarioController.criarUsuario);
router.get('/', usuarioController.listarUsuarios);
router.get('/:tipo', usuarioController.listarPorTipo);

module.exports = router;
