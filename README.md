### File 4: `tc-soat-auth-lambda/README.md`

# 🔐 Tech Challenge - Autenticação Serverless (AWS Lambda)

> 📌 **Nota:** Este repositório é parte integrante do ecossistema **Tech Challenge**. Para conferir a visão geral da aplicação, acesse o repositório principal: [tech-challenge](https://github.com/william-moura/tech-challenge).

Este repositório gerencia a função **AWS Lambda** de autenticação do sistema, integrada ao **AWS API Gateway v2 (HTTP API)**.

---

## ⚡ Arquitetura & Funcionamento

* **Serviço Compute:** AWS Lambda (`tc-soat-auth-lambda`)
* **Integrador de Entrada:** AWS API Gateway HTTP API na rota `POST /auth`
* **Escalabilidade:** Serverless (sob demanda, sem gerenciamento de servidores)
* **IAM & Permissões:** Permissão de invocação concedida via `aws_lambda_permission` vinculada ao API Gateway provisionado no repositório `tc-soat-k8s-infra`.

---

## 🔑 Variáveis & Secrets (GitHub Actions)

Cadastre as seguintes Secrets em **Settings > Secrets and variables > Actions**:

| Secret | Descrição |
| :--- | :--- |
| `AWS_ACCESS_KEY_ID` | Chave de acesso temporária da AWS |
| `AWS_SECRET_ACCESS_KEY` | Chave secreta temporária da AWS |
| `AWS_SESSION_TOKEN` | Token de sessão temporário da AWS |

---

## 🔄 Ordem de Implantação do Ecossistema

Para garantir o funcionamento completo das dependências entre os serviços:

1. **1º:** Executar o deploy do repositório **`tc-soat-auth-lambda`** para publicar a função na AWS.
2. **2º:** Executar o deploy do repositório **`tc-soat-k8s-infra`** (o Terraform irá associar a rota do API Gateway à Lambda já existente).
3. **3º:** Executar o deploy do repositório **`tc-soat-db-infra`** para criar o banco de dados RDS.
4. **4º:** Executar o deploy do repositório **`tech-challenge`** para subir a aplicação Laravel no K3s.