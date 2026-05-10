const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 调用 OpenAI API
async function getAIResponse(userText) {
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: userText
        }
      ],
      max_tokens: 200
    })
  });

  // 打印 OpenAI 返回结果（方便排错）
  const data = await response.json();
  console.log(data);

  // OpenAI 返回错误
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.choices[0].message.content;
}

// API接口
app.post('/api/ask', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: '问题不能为空'
    });
  }

  try {
    const answer = await getAIResponse(question);

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
  res.send('AI助手后端运行成功');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});