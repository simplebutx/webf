function MyPage({ user }) {
  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>로그인이 필요합니다</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>마이페이지</h2>
      <p>아이디: {user.username}</p>
      <p>가입일: {new Date(user.createdAt).toLocaleString()}</p>
    </div>
  );
}

export default MyPage;
