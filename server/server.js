const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { ObjectId } = require('mongodb');



const app = express();
const db = mongoose.connection;

const allowedOrigins = [
  'http://localhost:5173',
  'https://webf-three.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // 비브라우저 요청 (Postman 등) 허용
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('❌ CORS 차단됨: ', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
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
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60,          
  }
}))
app.use(passport.initialize())
app.use(passport.session()) 

// CORS 직접 처리

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
  res.json({ msg: 'Node + MongoDB 연결 완료' });
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

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {

    if (error) {
      console.error(error);
      return res.status(500).json({ msg: '서버 에러 발생' });
    }

    if (!user) {
      return res.status(401).json({ msg: info.message });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      const safeUser = {
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt,
      };

      return res.json({
        msg: '로그인 성공',
        user: safeUser,
      });
    });

  })(req, res, next);
});



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

app.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    // 세션 삭제
    req.session.destroy(() => {
      // 쿠키도 지워주기 (이름은 connect.sid)
      res.clearCookie('connect.sid', {
        httpOnly: true,
        sameSite: 'none',   // 배포환경 세팅에 맞게
        secure: true,       // https라서 true
      });

      return res.json({ msg: '로그아웃 완료' });
    });
  });
});


// 글쓰기
app.post('/posts', async (req, res)=>{
  const { title, content } = req.body;
  await db.collection('posts').insertOne({authorId: req.user._id, authorName: req.user.username, title, content, createdAt: new Date()})
  
  try {
    if(!title || !content) {
    return res.status(400).json({msg : '제목과 내용 모두 입력하시오'})
  }
  return res.json({msg: '글이 등록되었음'})
  } catch(err) {
    console.log(err);
    res.status(500).json({msg : '서버 오류 발생'});
  }
  
})

// 글가져오기
app.get('/posts', async (req, res)=>{
  const posts = await db.collection('posts').find().toArray();
  res.json({posts});
})

// 마이페이지에 내가 쓴 글 목록
app.get('/posts/mine', async (req, res) => {
  try {
    if (!req.user) {
    return res.status(401).json({ msg: '로그인이 필요합니다.' });
  }

  if (!ObjectId.isValid(req.user._id)) {
    return res.status(400).json({ msg: '유효하지 않은 사용자 ID입니다.' });
  }

  const myPosts = await db.collection('posts').find({
    authorId: new ObjectId(req.user._id)
  }).toArray();

  if (myPosts.length === 0) {
  return res.json({ myPosts: [], msg: '글이 존재하지 않습니다.' });
}

  res.json({ myPosts});
  }  catch(err) {
    console.error(err);
    res.status(500).json({ msg: '서버 오류 발생' });
  }
  
});


// 디테일페이지 가져오기
app.get('/posts/:id', async (req, res)=>{
  try {
  if(!req.user) {
    return res.status(401).json({msg: '로그인해야 보여줌 ㅅㄱ'});
  }
  if (!ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ msg: '글이 존재하지 않습니다.' });
    }

  const post = await db.collection('posts').findOne({_id: new ObjectId(req.params.id)});
  if(!post) {
    return res.status(404).json({msg :'그런 글은 없어요'});
  }
  res.json(post);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({msg : '서버 오류 발생'});
  }
  
});



// 글 수정기능

app.put('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // 1) 로그인 여부 체크
    if (!req.user) {
      return res.status(401).json({ msg: '로그인이 필요합니다.' });
    }

    // 2) 글 ID 형식 체크
    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ msg: '잘못된 ID' });
    }

    // 3) 글 찾기
    const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    if (!post) {
      return res.status(404).json({ msg: '글을 찾을 수 없습니다.' });
    }

    // 4) 작성자 체크 (authorId vs 현재 로그인 유저)
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: '본인이 작성한 글만 수정할 수 있습니다.' });
    }

    // 5) 수정 로직
    const { title, content } = req.body;

    await db.collection('posts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content } }
    );

    res.json({ msg: '수정 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: '서버 오류' });
  }
});

// 글삭제

app.delete('/posts/:id', async (req, res)=>{
  try {
    const id = req.params.id;

    // 1) 로그인 체크
    if (!req.user) {
      return res.status(401).json({ msg: '로그인이 필요합니다.' });
    }

    // 2) ObjectId 형식 체크 mongodb의 _id는 24자리임
    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ msg: '잘못된 ID입니다.' });
    }

    // 3) 글 찾기
    const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
    if (!post) {
      return res.status(404).json({ msg: '글을 찾을 수 없습니다.' });
    }

    // 4) 작성자 체크
    if (String(post.authorId) !== String(req.user._id)) {
      return res.status(403).json({ msg: '본인이 작성한 글만 삭제할 수 있습니다.' });
    }

    // 5) 삭제
    await db.collection('posts').deleteOne({ _id: new ObjectId(id) });

    res.json({ msg: '삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: '서버 오류' });
  }
});





// 서버 시작


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server running on', PORT);
});


// 추가할것 : 댓글기능, 검색기능, 이미지 업로드기능 (아마존), 관리자기능