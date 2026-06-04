import { createContext } from 'react';
import type { UserDto } from '../../types/api';
import type { LoginFormValues, RegisterFormValues } from './authSchemas';

export type AuthContextValue = {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
