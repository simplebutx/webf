import { useEffect, useState } from 'react';
import { apiFetch } from '../api';   // ← 너가 만든 apiFetch 경로에 맞게 수정해

function MyPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiFetch('/me', {
          method: 'GET',
          credentials: 'include',   // 세션 쿠키 필요
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user);

      } catch (err) {
        console.error('MyPage 에러:', err);
      }
    };

    fetchMe();
  }, []);

  if (user === null) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>My Page</h1>
      <p>내 아이디: <strong>{user.username}</strong></p>
    </div>
  );
}

export default MyPage;
