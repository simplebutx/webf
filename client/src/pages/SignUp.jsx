import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';
import { apiFetch } from '../api';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [msg, setMsg] = useState('');

 const handleSubmit = async (e) => { 
    e.preventDefault(); // 기본적으로 form 안에서 submit 누르면 페이지가 새로고침됨 -> 폼 기본 새로고침 막기 (리액트는 spa이므로 새로고침하면 안됨)

    try {
      const res = await apiFetch('/SignUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',       // JSON 보낸다고 서버한테 알림
        },
        body: JSON.stringify({ email, password: pw }),     // 실제 보낼 데이터
      });

      const data = await res.json();   // 서버에서 온 응답 해석하기
      setMsg(data.msg);    // data는 서버에서 온 데이터

      if (res.ok) {        // res.ok는 http 상태코드를 돌려주는데, 성공 범위 (200~299)면 성공으로 간주
        setName('');
        setEmail('');
        setPw('');
        setPwCheck('');
      }
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {        // 서버랑 통신 자체가 실패할 경우
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