import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      email,
      pw,
      pwCheck,
    });
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
    </div>
  );
}

export default SignUp;