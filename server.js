const express = require('express');
const cors = require('cors');
const app = express();

// Vercel/Render动态端口
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function getAIResponse(userText) {
  userText = userText.toLowerCase();
  if (userText.includes('你好') || userText.includes('hello')) {
    return '你好！我是你的AI小助手，有什么可以帮你的吗？';
  } else if (userText.includes('javascript')) {
    return '你想学习JavaScript吗？可以试试MDN文档，非常适合入门。';
  } else if (userText.includes('html')) {
    return 'HTML是网页的骨架，你可以使用标签来构建网页内容。';
  } else {
    return '抱歉，我还不太理解你的意思，可以换个问题吗？';
  }
}

app.post('/api/ask', (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: '问题不能为空' });
  const answer = getAIResponse(question);
  res.json({ answer });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));