// models/AlunoProposta.js
const mongoose = require('mongoose');

const AlunoPropostaSchema = new mongoose.Schema({
  proposta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposta',
    required: true
  },
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  estado: {
    type: String,
    enum: ['pendente', 'aceite', 'rejeitado'],
    default: 'pendente'
  },
  data_candidatura: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AlunoProposta', AlunoPropostaSchema);
