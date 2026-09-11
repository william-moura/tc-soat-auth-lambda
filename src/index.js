const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

// Configuração do pool fora do handler para reuso em exibições subsequentes (warm start)
const dbConfig = {
    host: process.env.DB_HOST || 'database',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'dbadmin',
    password: process.env.DB_PASSWORD || 'secretpassword',
    database: process.env.DB_NAME || 'techchallenge',
    connectTimeout: 10000
};

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura';

// Função para validar formato básico de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

exports.handler = async (event) => {
    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { cpf } = body || {};

        if (!cpf || !validarCPF(cpf)) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "CPF inválido ou não informado." })
            };
        }

        const cpfLimpo = cpf.replace(/[^\d]+/g, '');

        // Consulta ao Banco de Dados Gerenciado (RDS)
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT id, name, document FROM customers WHERE document = ? LIMIT 1', 
            [cpfLimpo]
        );
        await connection.end();

        if (rows.length === 0) {
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Cliente não encontrado na base de dados." })
            };
        }

        const cliente = rows[0];

        // if (cliente.status !== 'ATIVO') {
        //     return {
        //         statusCode: 403,
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ message: "Cliente inativo no sistema." })
        //     };
        // }

        // Geração do JWT
        const token = jwt.sign(
            { 
                sub: cliente.id, 
                cpf: cliente.document,
                nome: cliente.name 
            }, 
            JWT_SECRET, 
            { expiresIn: '2h' }
        );

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                access_token: token,
                token_type: "Bearer",
                expires_in: 7200
            })
        };

    } catch (error) {
        console.error("Erro no processamento da autenticação:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Erro interno no servidor de autenticação." })
        };
    }
};