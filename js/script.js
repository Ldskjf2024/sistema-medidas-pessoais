const API = "http://localhost:3000";

// CADASTRO
function cadastrar() {

if (!email.value.includes("@")) {
    alert("Email inválido!");
    return;
}

if (senha.value.length < 6) {
    alert("Senha mínimo 6 caracteres!");
    return;
}

    fetch(API + "/usuario", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nome: nome.value,
            email: email.value,
            senha: senha.value
        })
    })
    .then(r => r.json())
.then(d => {
    alert(d.mensagem);

    if (d.mensagem === "Usuário cadastrado!") {
        window.location.href = "index.html";
    }
});
}
// LOGIN
function login() {
    fetch(API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: loginEmail.value,
            senha: loginSenha.value
        })
    })
    .then(r => r.json())
    .then(d => {
        alert(d.mensagem);

        if (d.usuario) {
            localStorage.setItem("usuario_id", d.usuario.id);
            localStorage.setItem("codigo", d.usuario.codigo_acesso);
            window.location.href = "medidas.html";
        }
    });
}

// IR PARA SALVAR
function irParaSalvar() {

    // salva no localStorage antes de ir
    localStorage.setItem("busto", busto.value);
    localStorage.setItem("torax", torax.value);
    localStorage.setItem("cintura", cintura.value);
    localStorage.setItem("quadril", quadril.value);
    localStorage.setItem("coxa", coxa.value);
    localStorage.setItem("calcado", calcado.value);

    window.location.href = "salvarMedidas.html";
}

// SALVAR MEDIDAS
function salvarMedidas() {
    if (
    !busto.value ||
    !torax.value ||
    !cintura.value ||
    !quadril.value ||
    !coxa.value ||
    !calcado.value
) {
    alert("Preencha todas as medidas!");
    return;
}

if (
    isNaN(busto.value) ||
    isNaN(torax.value) ||
    isNaN(cintura.value) ||
    isNaN(quadril.value) ||
    isNaN(coxa.value) ||
    isNaN(calcado.value)
) {
    alert("Digite apenas números!");
    return;
}
    fetch(API + "/medidas", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            usuario_id: localStorage.getItem("usuario_id"),
            busto: busto.value,
            torax: torax.value,
            cintura: cintura.value,
            quadril: quadril.value,
            coxa: coxa.value,
            calcado: calcado.value
        })
    })
    .then(r => r.json())
    .then(d => {
        alert(d.mensagem);
        window.location.href = "codigo.html";
    });
}

// 🔥 CARREGAR MEDIDAS DO BANCO
function carregarMedidasUsuario() {

    // primeiro tenta localStorage
    busto.value = localStorage.getItem("busto") || "";
    torax.value = localStorage.getItem("torax") || "";
    cintura.value = localStorage.getItem("cintura") || "";
    quadril.value = localStorage.getItem("quadril") || "";
    coxa.value = localStorage.getItem("coxa") || "";
    calcado.value = localStorage.getItem("calcado") || "";

    // depois banco (sobrescreve se existir)
    const id = localStorage.getItem("usuario_id");

    fetch(API + "/medidas/" + id)
    .then(r => r.json())
    .then(d => {
        if (d.length > 0) {
            const m = d[0];

            busto.value = m.busto;
            torax.value = m.torax;
            cintura.value = m.cintura;
            quadril.value = m.quadril;
            coxa.value = m.coxa;
            calcado.value = m.calcado;
        }
    });
}
// MOSTRAR CÓDIGO
function mostrarCodigo() {
    document.getElementById("codigo").innerText =
        localStorage.getItem("codigo");
}

function excluirConta() {

    if (!confirm("Tem certeza que deseja excluir sua conta?")) return;

    const id = localStorage.getItem("usuario_id");

    fetch(API + "/usuario/" + id, {
        method: "DELETE"
    })
    .then(r => r.json())
    .then(d => {
        alert(d.mensagem);

        localStorage.clear();

        window.location.href = "index.html";
    });
}

function editarMedidas() {
    busto.disabled = false;
    torax.disabled = false;
    cintura.disabled = false;
    quadril.disabled = false;
    coxa.disabled = false;
    calcado.disabled = false;
}

function copiarCodigo() {
    const codigo = localStorage.getItem("codigo");
    navigator.clipboard.writeText(codigo);
    alert("Código copiado!");
}