import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

function Login() {

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      email,
      pw,
    });
  };

  return (
     <div style={{ padding: '40px', textAlign: 'center' }}>
      <div className="signup-container">
        <form className="signup-box" onSubmit={handleSubmit}>
          <h2>로그인</h2>

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

          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
}

export default Login;