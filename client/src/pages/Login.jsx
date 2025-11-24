import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {

  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
          const res = await apiFetch('/Login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',      
            },
            body: JSON.stringify({ username, password: pw }), 
            credentials: 'include',
          });
    
             const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);   // { msg: '로그인 성공', user: {...} } 같은 경우
    } catch {
      data = text;               // '아이디 DB에 없음', '비번불일치' 이런 경우
    }

    console.log('me 결과:', data);

    // 🔹 문자열이면 그대로, 객체면 msg 사용
    const message = typeof data === 'string' ? data : data.msg;

    setMsg(message || '로그인 실패');

    // ❶ 실패(401 등)면 여기서 끝내고 로그인 페이지에 그대로 있게
    if (!res.ok) {
      setTimeout(() => setMsg(''), 2000);
      return;
    }

    // ❷ 성공일 때만 진행
    setUsername('');
    setPw('');
    setUser(data.user);

    // 팝업 잠깐 보여주고 홈으로 이동하고 싶으면:
    setTimeout(() => {
      setMsg('');
      navigate('/');
    }, 1000); // 1초 후 이동 (원하면 0으로 줄여도 되고)
        } catch (err) {      
          console.error(err);
          setMsg('요청 중 에러남');
          setTimeout(() => setMsg(''), 2000);
        }
  };

  return (
     <div style={{ padding: '40px', textAlign: 'center' }}>
      <div className="signup-container">
        <form className="signup-box" onSubmit={handleSubmit}>
          <h2>로그인</h2>

          <input
            type="username"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <button type="submit">로그인</button>
        </form>
      </div>
       {msg && <div className="popup">{msg}</div>}
    </div>
  );
}

export default Login;