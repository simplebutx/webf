const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();   // .env 불러오기
const bcrypt = require('bcrypt');

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',          // 로컬 개발용 (Vite 기본 포트)
    'https://webf-three.vercel.app',  // 배포된 프론트 주소
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));


app.use(express.json());

const db = mongoose.connection;
const userCollection = db.collection('user');



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

app.post('/SignUp', async (req, res) => {
  try {
    console.log('✅ /SignUp 요청 도착, body:', req.body);  // 1) 진짜 요청 오는지 확인

    const { email, password } = req.body;

    // 1) 값 제대로 왔는지 체크
    if (!email || !password) {
      return res.status(400).json({ msg: '이메일이랑 비밀번호 둘 다 보내줘야 함' });
    }

    const db = mongoose.connection;
    const userCollection = db.collection('user');  // 2) 여기서 컬렉션 가져오기

    // 2) 이미 있는 이메일인지 체크
    const existUser = await userCollection.findOne({ email });
    console.log('기존 유저:', existUser); // 3) 있는지 확인용

    if (existUser) {
      return res.status(409).json({ msg: '이미 가입된 이메일임' });
    }

    // 3) 비번 해시
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) DB에 저장
    const insertResult = await userCollection.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    console.log('📥 insert 결과:', insertResult.insertedId); // 4) 진짜 저장됐는지

    // 5) 성공 응답
    res.json({ msg: '회원가입 완료!' });
  } catch (err) {
    console.error('❌ /SignUp 에러:', err);
    res.status(500).json({ msg: '서버 에러' });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('server running on', PORT);
});
