const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "sistema_medidas"
});
db.connect((err) => {
    if (err) {
        console.log("erro", err);
    } else {
        console.log("sucesso!");
    }
});
module.exports = db;