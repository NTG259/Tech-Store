// Lưu chính thức bằng key: access_token
const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";

export function setAuthToStorage({ access_token, user }) {
  // Chỉ nhận và lưu đúng key access_token
  if (access_token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  // (Tùy chọn) Xóa luôn key cũ nếu nó còn sót lại trên trình duyệt của user từ trước
  localStorage.removeItem("accessToken"); 
}

export function getAuthFromStorage() {
  try {
    const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    
    return { access_token, user };
  } catch {
    return { access_token: null, user: null };
  }
}