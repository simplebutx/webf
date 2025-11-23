import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Navbar from './components/Navbar.jsx';
import { apiFetch } from './api.jsx';
import MyPage from './pages/MyPage.jsx';


function App() {
  const [message, setMessage] = useState('서버에서 아직 데이터 안 옴');

  useEffect(() => {
    apiFetch('/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.msg);
      })
      .catch((err) => {
        console.error(err);
        setMessage('에러 발생 😢');
      });
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/me" element={<MyPage />} />
      </Routes>

      <div>
        <h2>{message}</h2>
      </div>
    </>
  );
}

export default App;
