# FetchSummarizeSend MCP Agent for Personalized News Digests

This project implements a fully custom, low-level MCP (Model Context Protocol) Agent that fetches the latest news, summarizes it, identifies interested users from a database, and emails them a digest — all without relying on any SDKs or external agent frameworks.

It serves as a reference implementation of end-to-end tool orchestration using Claude's tool-calling API with a modular Express.js backend.

## 🔧 Architecture Overview

The system follows a modular design with four key tool routes:

- `/fetch-news` – Fetches news articles via NewsAPI based on a topic
- `/summarize-news` – Summarizes fetched articles using the Claude API
- `/fetch-users` – Retrieves user emails from Supabase based on their interests
- `/send-email` – Sends the digest to users using NodeMailer and Gmail SMTP

An MCP-compatible agent interacts with these tools by generating tool calls, parsing responses, and chaining them recursively.

## ⚙️ Technologies Used

### 🧠 Claude API (Anthropic)
- Tool Use and Result Blocks: Implements structured tool-calling using Claude 3's messages API
- Recursive conversation loop: Each tool call result is added back into the prompt context to drive the next reasoning step

### 🛠️ Custom MCP Agent Runtime (no SDKs!)
- Built from scratch with no reliance on SDKs or orchestration frameworks
- Recursive tool execution loop in serverLlmConversation.js
- Tool schemas declared in JSON Schema format (toolSchemas.js)

### 🌐 External API Integration
- NewsAPI (newsapi.js) – REST call with query customization
  - Constructs parameterized URL requests
  - Maps and simplifies response payload

### 🧾 Text Summarization via Claude
- summarizeNews.js dynamically builds prompt based on style and length
- Uses Claude to generate editorial-style digests in plain text

### 🧑‍💻 Supabase Integration
- Pulls user emails by interest tag using @supabase/supabase-js
- Uses Postgres-compatible ilike search for flexible matching

### 📧 Email Delivery
- Uses nodemailer with Gmail's SMTP interface
- Dynamic email subject + digest body
- Sends to all matched users in a single batch

### 🧵 Tool Routing and Modularity
Tools exposed as modular Express routers under:
- /services/newsapi.js
- /services/summarizeNews.js
- /services/fetchUsers.js
- /services/sendEmail.js

Registered in serverOps.js, exposing tool routes under root

### 🧪 Agent Entry Point
- server.js initializes the server and launches the conversation loop
- addUserMessage() sets the agent's objective
- runConversation() kicks off recursive tool usage

### 🧰 Full Toolchain Recap

| Capability | Technology |
|------------|------------|
| Agent Orchestration | Claude 3 API (manual MCP impl) |
| News Fetching | NewsAPI + Axios |
| Summarization | Claude 3 (prompt-based) |
| DB Retrieval | Supabase + JS Client |
| Email Sending | Nodemailer + Gmail SMTP |
| HTTP Server & Routing | Express.js |
| Environment Config | dotenv |
| API Logging | Console instrumentation |

## 🧠 Why This Project Matters

This repo showcases how to:
- Build an MCP-compatible agent entirely from scratch
- Expose standalone REST tools that plug cleanly into LLM-driven workflows
- Chain complex tool outputs (news -> summary -> audience -> email)
- Use LLMs for high-reasoning tasks like intent parsing, input inference, and content generation
- Operate without dependency lock-in — no SDKs, no serverless wrappers, no hidden state

## 🚀 Getting Started

1. Clone the repo
2. Create a .env file (see below)
3. Run `node server.js`

### Example .env
```
ANTHROPIC_API_KEY=your_claude_api_key
NEWS_API_KEY=your_newsapi_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your_supabase_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
MCP_SERVER_PORT=4000
```

## 📁 File Structure

```
.
├── server.js                   # Entry point
├── serverOps.js               # MCP API server setup
├── serverLlmConversation.js   # Agent logic and recursion
├── router.js                  # Tool router proxy
├── toolSchemas.js             # JSON tool schema definitions
└── services/
    ├── newsapi.js             # /fetch-news
    ├── summarizeNews.js       # /summarize-news
    ├── fetchUsers.js          # /fetch-users
    └── sendEmail.js           # /send-email
```

## 🧑‍🔬 Created By

This project is part of a hands-on exploration of advanced AI agent workflows using Claude and custom MCP infrastructure. It demonstrates how real-world, multi-step automation can be built entirely from primitives.

Feel free to fork, adapt, or expand. Contributions welcome!

## 🤔 Example of Reasoning Steps

Below is a sample of the logs from running the agent, which demonstrates how it breaks down complex tasks into logical steps and executes them sequentially:

1. **Initial Planning**
```
<thinking>
To fulfill this request, I would need to take the following steps:
1. Fetch recent news articles about artificial intelligence using the fetchNews tool
2. Summarize the fetched news articles into a digest format using the summarizeNews tool
3. Fetch the list of users interested in artificial intelligence using the fetchUsersByInterest tool
4. Email the news digest to the fetched users using the sendEmail tool
</thinking>
```

2. **Tool Execution Sequence**
```
🛠️  Claude wants to use tool: fetchNews
📝 Tool input parameters: {
  "query": "artificial intelligence"
}

🛠️  Claude wants to use tool: summarizeNews
📝 Tool input parameters: {
  "articles": [...]
}

🛠️  Claude wants to use tool: fetchUsersByInterest
📝 Tool input parameters: {
  "interest": "artificial_intelligence"
}

🛠️  Claude wants to use tool: sendEmail
📝 Tool input parameters: {
  "to": ["kayvan.nowrouzi@gmail.com"],
  "subject": "Latest Artificial Intelligence News Digest",
  "text": "..."
}
```

This log output demonstrates how the agent:
- Plans its approach before taking action
- Uses each tool's output as input for the next step
- Maintains context throughout the conversation
- Provides clear reasoning for each decision
- Handles errors and edge cases gracefully

The agent's ability to break down complex tasks into manageable steps and execute them in the correct order is what makes it effective at orchestrating multi-step workflows. 