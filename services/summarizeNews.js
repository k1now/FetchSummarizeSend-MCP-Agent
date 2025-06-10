const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.ANTHROPIC_API_KEY;

router.post('/', async (req, res) => {
  const { articles, style = 'neutral', length = 'medium' } = req.body;

  const prompt = `
You are a news summarization assistant.

Summarize the following news articles into a ${length} summary in a ${style} tone.

Articles:
${articles.map(a => `- ${a.title}: ${a.description}`).join('\n')}

Return the summary in plain text.
  `;
  
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 600,
        messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );

    const summary = response.data?.content?.[0]?.text || 'No summary generated';
    res.json({ result: summary });

  } catch (err) {
    console.error('❌ Error summarizing news:', err.message);
    res.status(500).json({ error: 'Failed to summarize news' });
  }
});

module.exports = router;
