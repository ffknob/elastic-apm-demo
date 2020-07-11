import LoginInfo from './LoginInfo';
import User from './User';

export default interface AuthContext {
    user: User | null;
    isSignedIn: boolean;
    setUser: (user: User | null) => void;
    setIsSignedIn: (isSignedIn: boolean) => void;
    signIn: (loginInfo: LoginInfo) => Promise<User>;
    signOut: () => Promise<User>;
}
