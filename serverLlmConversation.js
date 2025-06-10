const axios = require('axios');
const { callTool } = require('./router.js');

const headers = {
  'x-api-key': process.env.ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'content-type': 'application/json',
};

const conversation = {
  messages: [],
  toolResults: []
};

function addUserMessage(text) {
  conversation.messages.push({
    role: 'user',
    content: [
        { 
            type: 'text', 
            text 
        }
    ]
  });
}


function addAssistantText(text) {
    conversation.messages.push({
      role: 'assistant',
      content: [
        {
          type: 'text',
          text
        }
      ]
    });
}


function addAssistantToolUse(toolBlock) {
    conversation.messages.push({
      role: 'assistant',
      content: [
        {
          type: 'tool_use',
          id: toolBlock.id,
          name: toolBlock.name,
          input: toolBlock.input
        }
      ]
    });
  }
  

function addToolResult(toolId, result) {
    conversation.messages.push({
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: toolId,
          content: [{ type: 'text', text: JSON.stringify(result) }]
        }
      ]
    });
  }
  

function buildRequestPayload() {
  return {
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    messages: conversation.messages,
    tools: Object.values(require('./toolSchemas'))
  };
}

async function callClaudeAPI() {
  try {
    console.log('📤 Sending request to Claude API...');
    const payload = buildRequestPayload();
    console.log('📦 Request payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post('https://api.anthropic.com/v1/messages', payload, { headers });
    return response.data;
  } catch (error) {
    console.error('❌ API call failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
    throw error;
  }
}

async function runConversation() {
    try {
      const response = await callClaudeAPI();
  
      for (const block of response.content) {
        if (block.type === 'text') {
          console.log('🤖 Claude:', block.text);
          addAssistantText(block.text);
        }
  
        if (block.type === 'tool_use') {
          const toolUse = {
            id: block.id,
            name: block.name,
            input: block.input
          };
  
          console.log('🛠️  Claude wants to use tool:', toolUse.name);
          console.log('📝 Tool input parameters:', JSON.stringify(toolUse.input, null, 2));
          addAssistantToolUse(toolUse);
  
          const result = await callTool(toolUse.name, toolUse.input);
          console.log('✅ Tool result:', result);
          addToolResult(toolUse.id, result);
  
          // 💡 Recursive call to continue the loop
          await runConversation();
          return; // Make sure to stop this loop after recursive call
        }
      }
    } catch (error) {
      console.error('❌ Error in conversation:', error.message);
      process.exit(1);
    }
}
  

module.exports = {
  addUserMessage,
  runConversation
}; 