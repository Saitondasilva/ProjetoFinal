const express = require('express');
const router = express.Router();
const propostaController = require('../controllers/propostaController');
const auth = require('../middlewares/auth');

// Rotas propostas
router.post('/', auth, propostaController.criarProposta);
router.get('/', auth, propostaController.listarPropostas);
router.get('/:id', auth, propostaController.obterProposta);
router.put('/:id', auth, propostaController.atualizarProposta);
router.delete('/:id', auth, propostaController.deletarProposta);

// Rotas candidaturas (docente)
router.get('/docente/candidaturas', auth, propostaController.candidaturasMinhasPropostas);
router.put('/candidatura/:candidaturaId/aceitar', auth, propostaController.aceitarCandidatura);
router.put('/docente/candidatura/:candidaturaId/recusar', auth, propostaController.recusarCandidatura);

router.get(
  '/docente/candidaturas/pendentes',
  auth,
  propostaController.candidaturasPendentesDocente
);


module.exports = router;
