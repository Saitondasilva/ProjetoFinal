const Proposta = require('../models/Proposta');
const Usuario = require('../models/Usuario');
const AlunoProposta = require('../models/AlunoProposta');
exports.criarProposta = async (req, res) => {
    try {
        // ✅ só docente pode criar
        if (req.user.tipo !== 'docente') {
            return res.status(403).json({
                erro: 'Apenas docentes podem criar propostas'
            });
        }

        const { titulo, descricao, estado, palavras_chave, orientadores } = req.body;

        // ✅ valida orientadores
        if (orientadores && orientadores.length > 0) {
            for (let o of orientadores) {
                const docenteExiste = await Usuario.findOne({
                    _id: o.docente,
                    tipo: 'docente'
                });

                if (!docenteExiste) {
                    return res.status(400).json({
                        erro: `Docente ${o.docente} não existe`
                    });
                }
            }
        }

        const proposta = new Proposta({
            titulo,
            descricao,
            estado,
            palavras_chave,
            orientadores,
            criador: req.user.id // ✅ docente logado
        });

        await proposta.save();

        res.status(201).json(proposta);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};


// Listar todas propostas
exports.listarPropostas = async (req, res) => {
    try {
        const propostas = await Proposta.find().populate('orientadores.docente', 'nome email');
        res.json(propostas);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Listar proposta por ID
exports.obterProposta = async (req, res) => {
    try {
        const { id } = req.params;
        const proposta = await Proposta.findById(id).populate('orientadores.docente', 'nome email');
        if (!proposta) return res.status(404).json({ erro: 'Proposta não encontrada' });
        res.json(proposta);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Atualizar proposta
exports.atualizarProposta = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, estado, palavras_chave, orientadores } = req.body;

        const proposta = await Proposta.findById(id);
        if (!proposta) return res.status(404).json({ erro: 'Proposta não encontrada' });

        // Atualiza campos
        if (titulo) proposta.titulo = titulo;
        if (descricao) proposta.descricao = descricao;
        if (estado) proposta.estado = estado;
        if (palavras_chave) proposta.palavras_chave = palavras_chave;
        if (orientadores) {
            // Verifica se os docentes existem
            for (let o of orientadores) {
                const docenteExiste = await Usuario.findOne({ _id: o.docente, tipo: 'docente' });
                if (!docenteExiste) return res.status(400).json({ erro: `Docente ${o.docente} não existe` });
            }
            proposta.orientadores = orientadores;
        }

        await proposta.save();
        res.json(proposta);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

// Deletar proposta
exports.deletarProposta = async (req, res) => {
    try {
        const { id } = req.params;
        const proposta = await Proposta.findByIdAndDelete(id);
        if (!proposta) return res.status(404).json({ erro: 'Proposta não encontrada' });
        res.json({ msg: 'Proposta deletada com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};





exports.candidaturasMinhasPropostas = async (req, res) => {

  try {

    // ✅ apenas docente
    if (req.user.tipo !== 'docente') {
      return res.status(403).json({
        erro: 'Apenas docentes podem consultar candidaturas'
      });
    }

    // 👉 buscar propostas criadas por este docente
    const propostas = await Proposta.find({
      criador: req.user.id
    }).select('_id');

    const propostasIds = propostas.map(p => p._id);

    // 👉 buscar candidaturas nessas propostas
    const candidaturas = await AlunoProposta.find({
      proposta: { $in: propostasIds }
    })
      .populate('aluno', 'nome email')
      .populate('proposta');

    res.json(candidaturas);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.aceitarCandidatura = async (req, res) => {

  try {

    if (req.user.tipo !== 'docente') {
      return res.status(403).json({ erro: 'Apenas docentes podem aceitar' });
    }

    const { candidaturaId } = req.params;

    const candidatura = await AlunoProposta.findById(candidaturaId)
      .populate('proposta');

    if (!candidatura) {
      return res.status(404).json({ erro: 'Candidatura não encontrada' });
    }

    // ✅ verificar se proposta pertence ao docente
    if (candidatura.proposta.criador.toString() !== req.user.id) {
      return res.status(403).json({ erro: 'Não autorizado' });
    }

    candidatura.estado = 'aceite';

    await candidatura.save();

    res.json({ msg: 'Candidatura aceite' });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.recusarCandidatura = async (req, res) => {

  try {

    if (req.user.tipo !== 'docente') {
      return res.status(403).json({ erro: 'Apenas docentes podem recusar' });
    }

    const { candidaturaId } = req.params;

    const candidatura = await AlunoProposta.findById(candidaturaId)
      .populate('proposta');

    if (!candidatura) {
      return res.status(404).json({ erro: 'Candidatura não encontrada' });
    }

    if (candidatura.proposta.criador.toString() !== req.user.id) {
      return res.status(403).json({ erro: 'Não autorizado' });
    }

    candidatura.estado = 'recusado';

    await candidatura.save();

    res.json({ msg: 'Candidatura recusada' });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};


//ver as candidaturas pendentes 
exports.candidaturasPendentesDocente = async (req, res) => {
  try {

    // ✅ apenas docente pode acessar
    if (req.user.tipo !== 'docente') {
      return res.status(403).json({
        erro: 'Apenas docentes podem consultar candidaturas pendentes'
      });
    }

    // 👉 Buscar propostas criadas pelo docente logado
    const propostas = await Proposta.find({
      criador: req.user.id
    }).select('_id');

    const propostasIds = propostas.map(p => p._id);

    // 👉 Buscar candidaturas pendentes dessas propostas
    const candidaturas = await AlunoProposta.find({
      proposta: { $in: propostasIds },
      estado: 'pendente' // 🔥 aqui está o filtro
    })
      .populate('aluno', 'nome email')
      .populate('proposta');

    res.json(candidaturas);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

