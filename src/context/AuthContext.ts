import { createContext } from 'react';
import type { Account, LoginRequest, RegisterRequest, User } from '../models';

export interface AuthContextValue {
  user: User | null;
  account: Account | null;
  token: string | null;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);