import { useState } from "react";
import { apiFetch } from "../api";
import './CreatePost.css';
import { useNavigate } from 'react-router-dom';

function CreatePost() {

const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [msg, setMsg] = useState('');
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify({title, content})
    })

    const data = await res.json();
    setMsg(data.msg);

    setTitle('');
    setContent('');
    setTimeout(() => {
      setMsg('');
      navigate('/');
    }, 2000);
}

    return(
    <div className="post-page">
      <div className="post-card">
        <h2 className="post-title">새 글 작성</h2>

        <form onSubmit={handleSubmit} className="post-form">
          <label className="post-label">
            제목
            <input
              type="text"
              placeholder="제목을 입력하세요"
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
            글쓰기
          </button>
        </form>
      </div>
        {msg && <div className="popup">{msg}</div>}
        </div>
    );
}

export default CreatePost;