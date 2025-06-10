const axios = require('axios');

const MCP_BASE_URL = 'http://localhost:4000';

const toolRoutes = {
  fetchNews: '/fetch-news',
  summarizeNews: '/summarize-news',
  fetchUsersByInterest: '/fetch-users',
  sendEmail: '/send-email'
};


async function callTool(toolName, input) {
  try {
    const response = await axios.post(`${MCP_BASE_URL}${toolRoutes[toolName]}`, input);
    return response.data.result;
  } catch (err) {
    console.error(`❌ MCP Error for ${toolName}:`, err.message);
    return 'Error executing tool';
  }
}

module.exports = { callTool };