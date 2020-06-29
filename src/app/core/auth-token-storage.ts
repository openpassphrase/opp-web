export class AuthStorage {
  static TOKEN_KEY = 'id_token';
  static SESSION_EXPIRE_AT_KEY = 'session_expire_at';

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getSessionExpirationTime() {
    const val = localStorage.getItem(this.SESSION_EXPIRE_AT_KEY);
    return val ? parseInt(val) : undefined;
  }

  static setToken(token: string, sessionExpireAt: number) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(
      this.SESSION_EXPIRE_AT_KEY,
      sessionExpireAt.toString()
    );
  }

  static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.SESSION_EXPIRE_AT_KEY);
  }
}
