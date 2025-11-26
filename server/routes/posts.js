const express = require('express');
const { ObjectId } = require('mongodb');
const db = require('../db');
const { isLoggedIn } = require('../middlewares/auth');

const router = express.Router();

// 글쓰기 (로그인 필요)
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ msg: '제목과 내용 모두 입력하시오' });
    }

    await db.collection('posts').insertOne({
      authorId: req.user._id,
      authorName: req.user.username,
      title,
      content,
      createdAt: new Date(),
    });

    return res.json({ msg: '글이 등록되었음' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: '서버 오류 발생' });
  }
});

// 전체 글 가져오기 (로그인 필요 X)
router.get('/', async (req, res) => {
  const posts = await db.collection('posts').find().toArray();
  res.json({ posts });
});

// 내가 쓴 글 목록 (마이페이지)
router.get('/mine', isLoggedIn, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ msg: '유효하지 않은 사용자 ID입니다.' });
    }

    const myPosts = await db.collection('posts').find({
      authorId: new ObjectId(req.user._id),
    }).toArray();

    if (myPosts.length === 0) {
      return res.json({ myPosts: [], msg: '글이 존재하지 않습니다.' });
    }

    res.json({ myPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: '서버 오류 발생' });
  }
});

// 디테일 페이지
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ msg: '글이 존재하지 않습니다.' });
    }

    const post = await db
      .collection('posts')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!post) {
      return res.status(404).json({ msg: '그런 글은 없어요' });
    }

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: '서버 오류 발생' });
  }
});

// 글 수정
router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ msg: '잘못된 ID' });
    }

    const post = await db
      .collection('posts')
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ msg: '글을 찾을 수 없습니다.' });
    }

    if (post.authorId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: '본인이 작성한 글만 수정할 수 있습니다.' });
    }

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

// 글 삭제
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ msg: '잘못된 ID입니다.' });
    }

    const post = await db
      .collection('posts')
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return res.status(404).json({ msg: '글을 찾을 수 없습니다.' });
    }

    if (String(post.authorId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ msg: '본인이 작성한 글만 삭제할 수 있습니다.' });
    }

    await db.collection('posts').deleteOne({ _id: new ObjectId(id) });

    res.json({ msg: '삭제 완료' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: '서버 오류' });
  }
});

module.exports = router;
