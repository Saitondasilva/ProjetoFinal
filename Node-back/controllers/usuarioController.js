const Usuario = require('../models/Usuario'); // obrigatório
const bcrypt = require('bcrypt');             // obrigatório
const jwt = require('jsonwebtoken');

// Criar usuário
exports.criarUsuario = async (req, res) => {
    try {
        const { nome, email, palavraPasse, tipo, numeroEstudante, departamento, curso } = req.body;

        const senhaHash = await bcrypt.hash(palavraPasse, 10);

        const usuario = new Usuario({
            nome,
            email,
            palavraPasse: senhaHash,
            tipo,
            numeroEstudante,
            departamento,
            curso
        });

        await usuario.save();
        res.status(201).json(usuario);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

// Listar todos usuários
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Listar por tipo
exports.listarPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        const usuarios = await Usuario.find({ tipo });
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, palavraPasse } = req.body;

        // Validação dos campos
        if (!email || !palavraPasse) {
            return res.status(400).json({ erro: 'Email e palavra-passe são obrigatórios' });
        }

        // Buscar usuário
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(401).json({ erro: 'Usuário ou senha incorretos' });

        // Verificar senha
        const senhaValida = await bcrypt.compare(palavraPasse, usuario.palavraPasse);
        if (!senhaValida) return res.status(401).json({ erro: 'Usuário ou senha incorretos' });

        // Gerar token JWT
        const token = jwt.sign(
            { id: usuario._id, tipo: usuario.tipo }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        // Retornar mensagem de sucesso + token
        res.json({
            mensagem: 'Login efetuado com sucesso!',
            token
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};