const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { ObjectId } = require('mongodb');


const app = express();
const db = mongoose.connection;

app.use(cors({
  origin: [
  'http://localhost:5173',                // 개발용
  'https://webf-three.vercel.app',        // Vercel 배포 프론트
],
  credentials: true,
}));

//passport 라이브러리 세팅
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const MongoStore = require('connect-mongo')

const isProd = process.env.NODE_ENV === 'production';
app.set('trust proxy', 1);

app.use(session({
  secret: '암호화에 쓸 비번',
  resave : false,
  saveUninitialized : false,
  store : MongoStore.create({
    mongoUrl : process.env.MONGODB_URI,
    dbName : 'Cluster0',
  }),
  cookie: {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax', 
    secure: isProd,                 
  }
}))
app.use(passport.initialize())
app.use(passport.session()) 

// CORS 직접 처리

const allowedOrigins = [
  'http://localhost:5173',          // Vite 로컬
  'https://webf-three.vercel.app',  // Vercel 프론트
];


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

    const { username, password } = req.body;    // const username = req.body.username; const password = req.body.password; 

    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: '아이디랑 비밀번호 둘 다 보내줘야 함' });
    }


    const userCollection = db.collection('user');

    const existUser = await userCollection.findOne({ username });
    console.log('기존 유저:', existUser);

    if (existUser) {
      return res.status(409).json({ msg: '이미 가입된 아이디임' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await userCollection.insertOne({
      username,
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

// Login API (passport)

passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
  let result = await db.collection('user').findOne({ username : 입력한아이디})
  if (!result) {
    return cb(null, false, { message: '아이디 DB에 없음' })
  }
  
  if (await bcrypt.compare(입력한비번, result.password)) {
    return cb(null, result)
  } else {
    return cb(null, false, { message: '비번불일치' });
  }
}))

// Login 시 session 만들기

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user._id.toString())    // 이런내용의 session 기록함
  })
})

// 쿠키 분석 (쿠키는 유저가 요청을 날릴때마다 같이 날라감)
// req.user 사용하면 현재 로그인된 유저출력

passport.deserializeUser(async (id, done) => {   
  try {
    console.log('deserializeUser id:', id);

    const result = await db
      .collection('user')
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return done(null, false);  // 유저 못 찾으면
    }

    delete result.password;

    process.nextTick(() => {
      done(null, result);        // req.user에 들어갈 것
    });
  } catch (err) {
    done(err);
  }
});

app.post('/login', async (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
      if (error) return res.status(500).json(error)
      if (!user) return res.status(401).json(info.message)
      req.logIn(user, (err) => {
        if (err) return next(err)
        res.json({ msg: '로그인 성공' });
      })
  })(req, res, next)
}) 


// 미들웨어
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ msg: '로그인 필요함' });
}

// 내 정보 확인 API
app.get('/me', isLoggedIn, (req, res) => {
  console.log('현재 로그인 유저:', req.user);   
  res.json({ user: req.user });
});


// 서버 시작

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server running on', PORT);
});
