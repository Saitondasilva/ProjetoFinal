const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    palavraPasse: { type: String, required: true },
    tipo: { type: String, required: true, enum: ['docente', 'aluno', 'administrador'] },
    numeroEstudante: { type: String },
    departamento: { type: String },
    curso: { type: String }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);


