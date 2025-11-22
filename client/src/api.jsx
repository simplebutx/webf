export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;     // .env에서 가져온 서버 주소

// 공통 fetch 함수
export async function apiFetch(path, options = {}) {

  const url = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  return res;
}

// 이제 이거 쓰면 서버 주소 앞부분은 .env에서 자동으로 붙음 (관리 용이)