import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);   // 글 데이터
  const [msg, setMsg] = useState('');       // 팝업 메시지
  const [loading, setLoading] = useState(true); // 로딩 상태

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

          <div className="post-detail-meta">
            <span>✏️ 작성자 : {post.authorName || '알 수 없음'}</span>
            <span>
              🕒 작성 날짜 : {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="post-detail-content">{post.content}</p>
        </article>
      )}
    </div>
  );
}

export default PostDetail;
