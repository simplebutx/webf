const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 테스트용 API
app.get('/api/hello', (req, res) => {
  res.json({ msg: '서버에서 보낸 메세지임 gddd' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server running on', PORT);
});
