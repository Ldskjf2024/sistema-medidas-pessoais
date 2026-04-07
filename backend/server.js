const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());


app.get("/", (req, res) => {
    res.send("API funcionando");
});

app.post("/usuario", (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.json({ mensagem: "Preencha todos os campos" });
    }

    if (!email.includes("@")) {
        return res.json({ mensagem: "Email inválido" });
    }

    if (senha.length < 6) {
        return res.json({ mensagem: "Senha deve ter no mínimo 6 caracteres" });
    }
    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
        if (result.length > 0) {
            return res.json({ mensagem: "Email já cadastrado" });
        }

        const codigo = Math.random().toString(36).substring(2, 10).toUpperCase();

        const sql = "INSERT INTO usuarios (nome, email, senha, codigo_acesso) VALUES (?, ?, ?, ?)";

        db.query(sql, [nome, email, senha, codigo], () => {
            res.json({ mensagem: "Usuário cadastrado!", codigo });
        });
    });
});

app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";

    db.query(sql, [email, senha], (err, result) => {
        if (result.length > 0) {
            res.json({ mensagem: "Login OK", usuario: result[0] });
        } else {
            res.json({ mensagem: "Login inválido" });
        }
    });
});

app.post("/medidas", (req, res) => {
    const { usuario_id, busto, torax, cintura, quadril, coxa, calcado } = req.body;

    const sql = `
    INSERT INTO medidas (usuario_id, busto, torax, cintura, quadril, coxa, calcado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [usuario_id, busto, torax, cintura, quadril, coxa, calcado], (err) => {
        if (err) return res.json({ mensagem: "Erro ao salvar medidas" });

        res.json({ mensagem: "Medidas salvas!" });
    });
});

app.get("/medidas/:id", (req, res) => {
    const id = req.params.id;

    const sql = "SELECT * FROM medidas WHERE usuario_id = ? ORDER BY id DESC LIMIT 1";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.json([]);
        }

        res.json(result);
    });
});

app.get("/medidas/codigo/:codigo", (req, res) => {
    const sql = `
    SELECT m.* FROM medidas m
    JOIN usuarios u ON m.usuario_id = u.id
    WHERE u.codigo_acesso = ?
    `;

    db.query(sql, [req.params.codigo], (err, result) => {
        res.json(result);
    });
});
app.delete("/usuario/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM medidas WHERE usuario_id = ?", [id], () => {
        db.query("DELETE FROM usuarios WHERE id = ?", [id], () => {
            res.json({ mensagem: "Conta excluída!" });
        });
    });
});
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});