// src/api.js

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const fetchWithAuth = async (endpoint, options = {}, authRequired = true) => {
  let token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh");

  // URL과 헤더 설정
  const url = `${BASE_URL}${endpoint}`;

  options.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // 토큰이 필요한 경우에만 Authorization 헤더 추가
  if (authRequired && token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  // 첫 번째 요청 시도
  let response = await fetch(url, options);

  // 401 Unauthorized 에러 발생 시, 토큰 갱신 시도
  if (response.status === 401 && refreshToken && authRequired) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      options.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, options); // 갱신된 토큰으로 재요청
    }
  }

  return response;
};

// 토큰 갱신 함수
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh");
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "refresh-token": refreshToken,
    },
  });

  if (response.ok) {
    const newToken = response.headers
      .get("Authorization")
      ?.replace("Bearer ", "");
    if (newToken) {
      localStorage.setItem("token", newToken); // 토큰 저장
      return newToken;
    }
  } else {
    // 토큰 갱신 실패 시 로그아웃 처리
    handleLogout();
    return null;
  }
};

// 로그아웃 함수
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("role");
  window.location.href = "/login";
};

export { fetchWithAuth as default, handleLogout };
