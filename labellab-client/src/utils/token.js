// @param: user type is required is every function
export function hasToken(user_type) {
  const token = getToken(user_type);
  return !!token;
}
export function getToken(user_type) {
  return localStorage.getItem(user_type);
}
export function logout(user_type) {
  if (getToken(user_type)) {
    localStorage.removeItem(user_type);
  }
}
export function setToken(user_type, token, boolean = false) {
  localStorage.setItem(user_type, token);
  if (boolean) {
    window.location.href = "/login";
  }
}
