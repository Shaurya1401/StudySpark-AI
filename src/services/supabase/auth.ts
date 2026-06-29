// Supabase service stubs. Real client is wired in Batch 2.
// These interfaces let UI code compile against a stable contract.

import type { User } from "@/types";

export interface AuthService {
  getCurrentUser(): Promise<User | null>;
  signInWithEmail(email: string, password: string): Promise<User>;
  signUpWithEmail(email: string, password: string, name: string): Promise<User>;
  signOut(): Promise<void>;
  onAuthChange(cb: (user: User | null) => void): () => void;
}

const mockUser: User = {
  id: "mock-user",
  email: "student@studyspark.ai",
  name: "Alex Morgan",
  createdAt: new Date().toISOString(),
};

export const authService: AuthService = {
  async getCurrentUser() {
    return mockUser;
  },
  async signInWithEmail(email) {
    return { ...mockUser, email };
  },
  async signUpWithEmail(email, _password, name) {
    return { ...mockUser, email, name };
  },
  async signOut() {},
  onAuthChange() {
    return () => {};
  },
};
