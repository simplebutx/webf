import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
   const [msg, setMsg] = useState('');

 const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 새로고침 막기

    try {
      const API_BASE_URL = import.meta.env.DEV
        ? 'http://localhost:5000'
        : 'https://fullweb-tjb9.onrender.com'; 

      const res = await fetch(`${API_BASE_URL}/SignUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: pw }),
      });

      const data = await res.json();
      setMsg(data.msg);

      if (res.ok) {       
        setName('');
        setEmail('');
        setPw('');
        setPwCheck('');
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
        <h2>회원가입</h2>

        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호 확인"
          value={pwCheck}
          onChange={(e) => setPwCheck(e.target.value)}
        />

        <button type="submit">회원가입</button>
      </form>
    </div>
    {msg && <div className="popup">{msg}</div>}
    </div>
  );
}

export default SignUp;