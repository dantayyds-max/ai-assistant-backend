const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // 如果 node 版本 < 18, 需安装：npm install node-fetch@2

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 调用 OpenAI GPT API
async function getAIResponse(userText) {
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userText }],
      max_tokens: 200
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: '问题不能为空' });
  try {
    const answer = await getAIResponse(question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI服务调用失败' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));