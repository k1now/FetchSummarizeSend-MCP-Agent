const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { addUserMessage, runConversation } = require('./serverLlmConversation');
const { startServer, setupShutdownHandler } = require('./serverOps');

const apiKey = process.env.ANTHROPIC_API_KEY;

// User message to invoke the agent
const userMessage = 'Provide a summary of the latest news about artificial intelligence in the form of a news digest and email it to the users interested in the topic.';

async function main() {
  try {
    if (!apiKey) {
      throw new Error('❌ API key is missing. Please set ANTHROPIC_API_KEY in .env file');
    }

    const server = await startServer();
    setupShutdownHandler(server);

    console.log('🤖 Starting conversation...');
    addUserMessage(userMessage);
    await runConversation();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
