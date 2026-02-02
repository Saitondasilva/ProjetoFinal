// controllers/alunoPropostaController.js
const AlunoProposta = require('../models/AlunoProposta');
const Proposta = require('../models/Proposta');

/**
 * Permite que um aluno se candidate a uma proposta
 */
exports.candidatarProposta = async (req, res) => {
  try {
    // ✅ Apenas alunos podem candidatar-se
    if (req.user.tipo !== 'aluno') {
      return res.status(403).json({
        erro: 'Apenas alunos podem candidatar-se a propostas'
      });
    }

    const { propostaId } = req.params;

    // ✅ Verifica se a proposta existe
    const proposta = await Proposta.findById(propostaId);
    if (!proposta) {
      return res.status(404).json({ erro: 'Proposta não encontrada' });
    }

    // ✅ Verifica se já existe candidatura
    const jaCandidatado = await AlunoProposta.findOne({
      proposta: propostaId,
      aluno: req.user.id
    });

    if (jaCandidatado) {
      return res.status(400).json({
        erro: 'Já te candidataste a esta proposta'
      });
    }

    // ✅ Cria candidatura
    const candidatura = new AlunoProposta({
      proposta: propostaId,
      aluno: req.user.id
    });

    await candidatura.save();

    res.status(201).json({
      msg: 'Candidatura submetida com sucesso',
      candidatura
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/**
 * Retorna as propostas às quais o aluno foi aceite
 */
exports.minhasPropostasAceites = async (req, res) => {
  try {
    if (req.user.tipo !== 'aluno') {
      return res.status(403).json({ erro: 'Apenas alunos podem consultar' });
    }

    const propostas = await AlunoProposta.find({
      aluno: req.user.id,
      estado: 'aceite'
    })
      .populate('proposta')
      .populate('aluno', 'nome email');

    // 🔹 FILTRAR APENAS PROPOSTAS NÃO NULAS
    const propostasValidas = propostas.filter(p => p.proposta !== null);

    res.json(propostasValidas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


/**
 * Retorna todas as candidaturas do aluno (aceites ou pendentes)
 */
exports.minhasCandidaturas = async (req, res) => {
  try {
    if (req.user.tipo !== 'aluno') {
      return res.status(403).json({ erro: 'Apenas alunos podem consultar' });
    }

    const candidaturas = await AlunoProposta.find({
      aluno: req.user.id
    })
      .populate('proposta')
      .populate('aluno', 'nome email');

    res.json(candidaturas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
