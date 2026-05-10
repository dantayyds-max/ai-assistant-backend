const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// DeepSeek AI
async function getAIResponse(userText) {

  // 读取 DeepSeek API Key
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // 调用 DeepSeek API
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: userText
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
  });

  const data = await response.json();

  // 打印日志方便排错
  console.log(data);

  // 如果 API 返回错误
  if (data.error) {
    throw new Error(data.error.message);
  }

  // 返回 AI 回复
  return data.choices[0].message.content;
}

// API接口
app.post('/api/ask', async (req, res) => {

  const { question } = req.body;

  // 判断是否为空
  if (!question) {
    return res.status(400).json({
      error: '问题不能为空'
    });
  }

  try {

    // 获取 AI 回复
    const answer = await getAIResponse(question);

    // 返回给前端
    res.json({
      answer
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message || 'AI服务调用失败'
    });
  }
});

// 首页测试
app.get('/', (req, res) => {
  res.send('DeepSeek AI 后端运行成功');
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});