const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const db = mongoose.connection;


// CORS 직접 처리

const allowedOrigins = [
  'http://localhost:5173',          // Vite 로컬
  'https://webf-three.vercel.app',  // Vercel 프론트
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // 허용된 origin이면 허용
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // preflight(OPTIONS) 요청은 여기서 바로 200으로 응답
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// JSON 파싱
app.use(express.json());


// MongoDB 연결

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공');
  })
  .catch((err) => {
    console.error('❌ MongoDB 연결 실패:', err);
  });

// 테스트용 API

app.get('/api/hello', (req, res) => {
  res.json({ msg: 'Node + MongoDB 연결 완료!' });
});


// 회원가입 API

app.post('/SignUp', async (req, res) => {
  try {
    console.log('✅ /SignUp 요청 도착, body:', req.body);

    const { email, password } = req.body;    // const email = req.body.email; const password = req.body.password; 

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: '이메일이랑 비밀번호 둘 다 보내줘야 함' });
    }


    const userCollection = db.collection('user');

    const existUser = await userCollection.findOne({ email });
    console.log('기존 유저:', existUser);

    if (existUser) {
      return res.status(409).json({ msg: '이미 가입된 이메일임' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await userCollection.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    console.log('📥 insert 결과:', insertResult.insertedId);

    res.json({ msg: '회원가입 완료!' });
  } catch (err) {
    console.error('❌ /SignUp 에러:', err);
    res.status(500).json({ msg: '서버 에러' });
  }
});

app.post('/login', async (req, res)=>{
  const { email, password } = req.body;
  const user = await db.collection('user').findOne( { email }); 

  if(!user) {
    return res.status(401).json({msg: '존재하지 않는 이메일'});
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) {
    return res.status(401).json({msg: '비밀번호가 일치하지 않음'})
  }

  return res.json({msg: '로그인 성공'});
  
})


// 서버 시작

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server running on', PORT);
});
