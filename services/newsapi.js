const express = require('express');
const router = express.Router();
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const API_KEY = process.env.NEWS_API_KEY;

router.post('/', async (req, res) => {
    const input = req.body;
    const baseUrl = 'https://newsapi.org/v2/top-headlines';
    const params = new URLSearchParams();

    if (input.country) params.append('country', input.country);
    if (input.category) params.append('category', input.category);
    if (input.query) params.append('q', input.query);
    if (input.sources) params.append('sources', input.sources);
    params.append('pageSize', input.pageSize || 10);
    params.append('page', input.page || 1);
    params.append('apiKey', API_KEY);

    const url = `${baseUrl}?${params.toString()}`;

    // 🔍 Log the final request URL before sending
    console.log('🔍 Requesting URL:', url);

    try {
        const response = await axios.get(url);
        const articles = response.data.articles;

        const simplifiedArticles = articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt
        }));

        res.json({ result: simplifiedArticles });
    } catch (error) {
        console.error('❌ Error fetching news:', error.message);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});


module.exports = router;
