
# 🛒 API de Pagamentos com PayPal (Node.js + TypeScript)

Seja bem-vindo(a) à minha API de integração com o PayPal! Este projeto demonstra uma implementação completa de um sistema de pedidos e pagamentos usando **Node.js**, **Express**, **TypeScript** e a **SDK oficial do PayPal REST**.

✅ **Objetivo:** Demonstrar conhecimento prático na construção de APIs RESTful com integração de pagamentos reais, seguindo boas práticas de desenvolvimento backend com TypeScript.

---

## 🚀 Funcionalidades

- 📦 Criar pedidos com múltiplos itens e valores detalhados.
- 💳 Capturar pagamentos com segurança usando a API oficial do PayPal.
- 🔄 Suporte tanto ao ambiente **sandbox** quanto **live**.
- 📚 Tipagem forte e validação utilizando TypeScript.

---

## 📌 Requisitos

Antes de iniciar, você precisará ter instalado:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Conta no [PayPal Developer](https://developer.paypal.com/)

---

## ⚙️ Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/reinaldoper/paypal-api.git
cd paypal-api
```

### 2. Instale as dependencias:

```bash
npm install
# ou
yarn
```

### 3. Configure as variáveis de ambiente
- Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

```bash
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
PORT=3000
```


### 4. Inicie o servidor:

```bash
npm run dev
# ou
yarn dev

# ou 
npm run build # gera o buid em js

&&

npm run start # roda a aplicação builder
```
- A API estará disponível em: http://localhost:3000/paypal


![PAYPAL](./assets/images/paypal.png)


### 5. Documentação da API:

**Criar Pedido**
- `POST /paypal/create-order`
- Body:
```json
{
  "value": "49.98",
  "currency_code": "USD",
  "description": "Compra de camisetas personalizadas",
  "invoice_id": "INV-2025-001",
  "items": [
    {
      "name": "Camiseta Azul",
      "description": "Tamanho M",
      "quantity": 1,
      "unit_price": "24.99",
      "category": "PHYSICAL_GOODS"
    },
    {
      "name": "Camiseta Vermelha",
      "description": "Tamanho G",
      "quantity": 1,
      "unit_price": "24.99",
      "category": "PHYSICAL_GOODS"
    }
  ]
}
```

### 6. Resposta da API:

```api
{
	"id": "ID_DA REQUISICAO",
	"status": "CREATED",
	"approveUrl": "link_para_aceitar_ou_nao_o_pagamento"
}
```


**Capturar Pedido**
- `POST /paypal/capture-order/:orderID`
- Sem body

---

🏁 Considerações Finais
- Este projeto está pronto para ser utilizado tanto em testes (sandbox) quanto em produção com PayPal. Ele representa minha capacidade de lidar com APIs externas, garantir segurança nas transações e construir um backend limpo e escalável com Node.js e TypeScript.

Se quiser testar, basta rodar localmente com um sandbox PayPal!
Estou aberto a sugestões, melhorias e, claro, oportunidades. 🚀