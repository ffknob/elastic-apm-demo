import LoginInfo from './LoginInfo';
import User from './User';

export default interface AuthContext {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  login: (loginInfo: LoginInfo) => Promise<User>;
  logout: () => Promise<User>;
}
