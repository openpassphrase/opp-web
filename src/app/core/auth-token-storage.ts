export class AuthStorage {
  static TOKEN_KEY = 'id_token';

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
