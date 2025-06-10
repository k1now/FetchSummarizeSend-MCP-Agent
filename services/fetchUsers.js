const express = require('express');
const router = express.Router();
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', async (req, res) => {
  const { interest } = req.body;
  console.log('Found the following interest in the fetch request', interest)
  
  try {
    const { data, error } = await supabase
  .from('NewsUsers')
  .select('*')
  .ilike('interest', `%${interest}%`); // 👈 correct syntax


    if (error) {
      throw error;
    }

    console.log('✅ Users fetched:', data);
    res.json({ result: data });
  } catch (err) {
    console.error('❌ Error fetching users:', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
