import { useEffect, useState} from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api';

function PostEdit() {

const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [msg, setMsg] = useState('');
const navigate = useNavigate();
const { id } = useParams();

 useEffect(() => {
    const fetchPost = async () => {
      const res = await apiFetch(`/posts/${id}`);
      const data = await res.json();

      if (!res.ok) {
        setMsg(data.msg || "글을 불러오지 못했습니다.");
        return;
      }

      setTitle(data.title);
      setContent(data.content);
    };

    fetchPost();
  }, [id]);

const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await apiFetch(`/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    setMsg(data.msg);

    if (res.ok) {
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 1500);
    } else {
      setTimeout(() => setMsg(""), 2000);
    }
  };

    return(
    <div className="post-page">
      <div className="post-card">
        <h2 className="post-title"> 글 수정</h2>

        <form onSubmit={handleSubmit} className="post-form">
          <label className="post-label">
            제목
            <input
              type="text"
              placeholder={"제목을 입력하세요"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="post-input"
            />
          </label>

          <label className="post-label">
            내용
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="post-textarea"
              rows={5}
            />
          </label>

          <button type="submit" className="post-button">
            수정하기
          </button>
        </form>
      </div>
        {msg && <div className="popup">{msg}</div>}
        </div>
    );
}





export default PostEdit;