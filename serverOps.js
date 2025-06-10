
const express = require('express');
const app = express();


// Start the MCP API Server for tools
app.use(express.json());

// Import and use service routers
const newsapiRouter = require('./services/newsapi.js');
const summarizeNewsRouter = require('./services/summarizeNews.js');
const fetchUsersRouter = require('./services/fetchUsers.js');
const sendEmailRouter = require('./services/sendEmail.js');

app.use('/fetch-news', newsapiRouter);
app.use('/summarize-news', summarizeNewsRouter);
app.use('/fetch-users', fetchUsersRouter);
app.use('/send-email', sendEmailRouter);

const port = process.env.MCP_SERVER_PORT || 4000;

function startServer() {
  return new Promise(resolve => {
    const server = app.listen(port, async () => {
      console.log(`🚀 MCP Tool Server running on port ${port}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      resolve(server); // not app
    });
  });
}


function setupShutdownHandler(server) {
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
}

module.exports = {
  app,
  startServer,
  setupShutdownHandler
}; 