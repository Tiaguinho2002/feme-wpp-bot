# 🧠 Feme Bot — WhatsApp AI Assistant

Um assistente automatizado para WhatsApp que integra **IA generativa do Google Gemini** com o **framework WhatsApp Web.js**, permitindo conversas inteligentes, respostas automáticas e processamento de mensagens em tempo real.

---

## 🚀 Funcionalidades Principais

- Conecta ao WhatsApp Web via **QR Code**.
- Responde automaticamente a mensagens recebidas.
- Integração com **Google Gemini API** para geração de respostas inteligentes.
- Suporte a comandos personalizados e automações.
- Estrutura modular em **TypeScript**.
- Deploy simplificado com **Docker** e **docker-compose**.

---

## 🧩 Tecnologias Utilizadas

| Categoria | Tecnologias |
|------------|-------------|
| **Linguagem** | TypeScript (ES2020) |
| **Runtime** | Node.js |
| **Framework Web** | Express |
| **Bibliotecas principais** | whatsapp-web.js, qrcode-terminal, @google/genai |
| **Utilitários** | dotenv, cors |
| **Dev Tools** | nodemon, ts-node, typescript |
| **Infraestrutura** | Docker, docker-compose |
| **Gerenciamento de dependências** | npm |

---

## ⚙️ Estrutura do Projeto

```
feme-bot/
├── src/                     # Código-fonte principal (TypeScript)
│   ├── commands/            # Comandos do bot
│   │   ├── englishMode.ts
│   │   ├── everyone.ts
│   │   ├── help.ts
│   │   ├── stiker.ts
│   │   ├── summarize.ts
│   │   └── whosRight.ts
│   │
│   ├── services/            # Serviços externos e integrações
│   │   └── GeminiService.ts
│   │
│   ├── types/               # Tipagens e interfaces TypeScript
│   │   ├── command.ts
│   │   └── main.ts
│   │
│   └── prompts.ts           # Prompts e textos utilizados pelo bot
│
├── dist/                    # Código compilado (JavaScript)
├── Dockerfile               # Configuração da imagem Docker
├── docker-compose.yml       # Orquestração de containers
├── package.json             # Dependências e scripts
├── package-lock.json        # Versões exatas das dependências
├── tsconfig.json            # Configuração TypeScript
├── .env                     # Variáveis de ambiente (ex: GEMINI_API_KEY)
├── .dockerignore            # Arquivos ignorados pelo Docker
├── .gitignore               # Arquivos ignorados pelo Git
├── LICENSE                  # Licença MIT
└── README.md                # Documentação do projeto
```

---

## 🧱 Pré-requisitos

- Node.js 20+
- npm
- Conta e chave da API do **Google Gemini**
- WhatsApp ativo para conexão via QR Code
- Docker (opcional para containerização)

---

## 🪄 Como Executar Localmente

```bash
# Clonar o repositório
git clone https://github.com/tiaguinho2002/feme-bot.git
cd feme-bot

# Instalar dependências
npm install

# Criar o arquivo .env
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Executar em modo desenvolvimento
npm run dev
```

Ao iniciar, será exibido um **QR Code** no terminal — escaneie com o WhatsApp para autenticar o bot.

---

## 🐳 Rodando com Docker

```bash
docker-compose up --build
```

Isso criará e iniciará o container do bot automaticamente.

---

## 🧠 API Google Gemini

O projeto utiliza o pacote oficial `@google/genai` para se conectar à IA generativa do Google, permitindo que o bot processe e gere respostas contextuais em linguagem natural.

---

## 👨‍💻 Autor

**Tiago Santos Izidoro**  
Desenvolvedor Full Stack  
📍 São Paulo, Brasil  
🔗 [GitHub](https://github.com/tiaguinho2002)

---

## 🪪 Licença

Este projeto está licenciado sob a **MIT License** — veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
