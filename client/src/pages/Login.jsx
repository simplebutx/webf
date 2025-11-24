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
    
          const data = await res.json();   
          console.log('me 결과:', data);
          setMsg(data.msg);   
    
          if (res.ok) {       
            setUsername('');
            setPw('');
            setUser(data.user); 
            navigate('/');
          }
          setTimeout(() => setMsg(''), 2000);
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