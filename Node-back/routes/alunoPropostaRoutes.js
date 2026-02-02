// routes/alunoPropostaRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const {
  candidatarProposta,
  minhasPropostasAceites,
  minhasCandidaturas
} = require('../controllers/alunoPropostaController');

router.post('/propostas/:propostaId/candidatar', auth, candidatarProposta);
router.get('/aluno/propostas/aceites', auth, minhasPropostasAceites);
router.get('/aluno/candidaturas', auth, minhasCandidaturas);

module.exports = router;
