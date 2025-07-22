import React, { createContext, useState } from 'react';

import type { ReactNode } from 'react';

type User = {
  firstName: string;
  lastName: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  signIn: (userDetails: User) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: () => {}
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({
  children
}: AuthProviderProps): React.JSX.Element => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (userDetails: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<void> => {
    setUser(userDetails);
  };

  const signOut = (): void => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
