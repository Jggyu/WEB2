class AuthService {
  constructor() {
    this.tokenKey = 'TMDb-Key';
    this.userKey = 'netflix-user';
    this.usersKey = 'users';
  }

  login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
      const user = users.find(u => u.id === email && u.password === password);

      if (!user) {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem(this.tokenKey, password);
      localStorage.setItem(this.userKey, JSON.stringify({
        email: user.id,
        name: user.id.split('@')[0]
      }));

      return user;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  register = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
      
      if (users.some(user => user.id === email)) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: email,
        password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(this.usersKey, JSON.stringify(users));

      return newUser;
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  logout = () => {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  };

  isAuthenticated = () => {
    return !!localStorage.getItem(this.tokenKey);
  };

  getUser = () => {
    try {
      return JSON.parse(localStorage.getItem(this.userKey));
    } catch {
      return null;
    }
  };
}

export const authService = new AuthService();