const mongoose = require('mongoose');

const PropostaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String },
    estado: {
        type: String,
        enum: ['ativa', 'arquivada', 'concluida'],
        default: 'ativa'
    },
    data_criacao: { type: Date, default: Date.now },
    palavras_chave: [{ type: String }],

    // ✅ quem criou a proposta
    criador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    orientadores: [
        {
            docente: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Usuario',
                required: true
            },
            tipo: {
                type: String,
                enum: ['orientador principal', 'coorientador'],
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Proposta', PropostaSchema);
