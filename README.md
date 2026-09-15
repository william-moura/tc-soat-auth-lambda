---

### 4. `tc-soat-auth-lambda` (Serviço de Autenticação / Lambda)

Crie ou atualize o arquivo **`README.md`** neste repositório:

```markdown
# 🔐 Tech Challenge - Autenticação (AWS Lambda)

Serviço Serverless responsável pelo fluxo de autenticação e validação de tokens de usuários do sistema, integrado diretamente ao **AWS API Gateway (HTTP API)**.

---

## ⚡ Arquitetura Serverless

* **Compute:** AWS Lambda
* **Integração:** AWS API Gateway v2 (`HTTP API`) via rota `POST /auth`.
* **Runtime:** Node.js / Python (de acordo com a implementação da função).
* **Segurança:** Permissão `aws_lambda_permission` gerenciada para invocação exclusiva do API Gateway do projeto.

---

## 🔑 Configuração de Secrets (GitHub Actions)

| Secret | Descrição |
| :--- | :--- |
| `AWS_ACCESS_KEY_ID` | Chave de acesso temporária do AWS Academy |
| `AWS_SECRET_ACCESS_KEY` | Chave secreta temporária do AWS Academy |
| `AWS_SESSION_TOKEN` | Token de sessão do AWS Academy |

---

## 🔄 Ordem de Implantação

1. Executar a pipeline deste repositório para criar a função **`tc-soat-auth-lambda`** na conta AWS.
2. Executar a pipeline do repositório `tc-soat-k8s-infra` para conectar o API Gateway à Lambda via ARN dinâmico (`arn:aws:lambda:us-east-1:<ACCOUNT_ID>:function:tc-soat-auth-lambda`).