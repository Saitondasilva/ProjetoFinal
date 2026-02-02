require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro ao conectar MongoDB:', err));

// ================= ROTAS =================
const usuarioRoutes = require('./routes/usuarioRoutes');
const propostaRoutes = require('./routes/propostaRoutes');
const alunoPropostaRoutes = require('./routes/alunoPropostaRoutes');

app.use('/usuarios', usuarioRoutes);
app.use('/propostas', propostaRoutes);
app.use('/', alunoPropostaRoutes);
// ========================================

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
