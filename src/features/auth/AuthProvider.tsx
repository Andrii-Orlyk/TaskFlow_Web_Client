import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { authApi } from '../../api/taskFlowApi';
import { clearAuthToken, getAuthToken, setAuthToken } from '../../lib/authToken';
import { commentKeys } from '../comments/commentQueryKeys';
import { dashboardKeys } from '../dashboard/dashboardQueryKeys';
import { projectKeys } from '../projects/projectQueryKeys';
import { taskKeys } from '../tasks/taskQueryKeys';
import { AuthContext, type AuthContextValue } from './auth-store';
import type { LoginFormValues, RegisterFormValues } from './authSchemas';

const authMeQueryKey = ['auth', 'me'] as const;

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => getAuthToken());

  const invalidateSession = useCallback(() => {
    clearAuthToken();
    setToken(null);
    queryClient.removeQueries({ queryKey: authMeQueryKey });
  }, [queryClient]);

  const meQuery = useQuery({
    queryKey: authMeQueryKey,
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch (error) {
        invalidateSession();
        throw error;
      }
    },
    enabled: Boolean(token),
    retry: false
  });

  const clearUserScopedQueries = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['auth'] });
    queryClient.removeQueries({ queryKey: projectKeys.all });
    queryClient.removeQueries({ queryKey: taskKeys.all });
    queryClient.removeQueries({ queryKey: commentKeys.all });
    queryClient.removeQueries({ queryKey: dashboardKeys.all });
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const response = await authApi.login(values);
      const authToken = authApi.extractAuthToken(response);
      setAuthToken(authToken);
      setToken(authToken);
      return response.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authMeQueryKey, user);
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const response = await authApi.register(values);
      const authToken = authApi.extractAuthToken(response);
      setAuthToken(authToken);
      setToken(authToken);
      return response.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authMeQueryKey, user);
    }
  });

  const logout = useCallback(() => {
    clearAuthToken();
    setToken(null);
    clearUserScopedQueries();
  }, [clearUserScopedQueries]);

  const user = token ? (meQuery.data ?? null) : null;
  const isAuthenticated = Boolean(token && user);
  const isLoading = Boolean(token) && meQuery.isLoading;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login: async (values) => {
        await loginMutation.mutateAsync(values);
      },
      register: async (values) => {
        await registerMutation.mutateAsync(values);
      },
      logout,
      isLoggingIn: loginMutation.isPending,
      isRegistering: registerMutation.isPending
    }),
    [user, isAuthenticated, isLoading, loginMutation, registerMutation, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
