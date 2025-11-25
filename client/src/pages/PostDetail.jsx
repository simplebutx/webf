import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import './PostDetail.css';

function PostDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);   // 글 데이터
  const [msg, setMsg] = useState('');       // 팝업 메시지
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 🔹 user / post 에서 id 추출해서 비교 (필드명이 조금 달라도 어느 정도 커버)
  const userId = user && (user._id || user.id);
  const authorId = post && (post.authorId || post.userId);

  const isAuthor =
    !!userId && !!authorId && String(userId) === String(authorId);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiFetch(`/posts/${id}`);
        const data = await res.json();

        if (res.status === 401) {
          setMsg(data.msg || '로그인이 필요한 서비스입니다.');
          setLoading(false);

          setTimeout(() => {
            setMsg('');
            navigate('/');
          }, 1500);

          return;
        }

        if (!res.ok) {
          setMsg(data.msg || '글을 불러오지 못했습니다.');
          setLoading(false);

          setTimeout(() => {
            setMsg('');
          }, 2000);

          return;
        }

        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMsg('알 수 없는 오류가 발생했습니다.');
        setLoading(false);

        setTimeout(() => {
          setMsg('');
        }, 2000);
      }
    };

    fetchPost();
  }, [id, navigate]);

  // 🔥 삭제 기능
  const handleDelete = async () => {
    if (!window.confirm('정말 이 글을 삭제할까요?')) return;

    try {
      const res = await apiFetch(`/posts/${post._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      setMsg(data.msg);

      if (res.ok) {
        setTimeout(() => {
          setMsg('');
          navigate('/PostList');   // 또는 '/' 로 바꾸고 싶으면 여기 수정
        }, 1500);
      } else {
        setTimeout(() => setMsg(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setMsg('삭제 중 오류가 발생했습니다.');
      setTimeout(() => setMsg(''), 2000);
    }
  };

  return (
    <div className="post-detail-page">
      {msg && <div className="popup">{msg}</div>}
      {loading && !msg && <div>로딩 중...</div>}
      {!loading && !post && !msg && (
        <div>글이 존재하지 않습니다.</div>
      )}

      {post && (
        <article className="post-detail-card">
          <h2 className="post-detail-title">{post.title}</h2>
          <p className="post-detail-content">{post.content}</p>

          <div className="post-detail-meta">
            <span>✏️ 작성자 : {post.authorName || '알 수 없음'}</span>
            <span>
              🕒 작성 날짜 : {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>

          {/* 🔥 작성자인 경우에만 수정 / 삭제 버튼 노출 */}
          {isAuthor && (
            <div className="post-detail-controls">
              <button
                className="edit-btn"
                onClick={() => navigate(`/posts/${post._id}/edit`)}
              >
                ✏️ 수정
              </button>

              <button
                className="delete-btn"
                onClick={handleDelete}
              >
                🗑 삭제
              </button>
            </div>
          )}
        </article>
      )}
    </div>
  );
}

export default PostDetail;
