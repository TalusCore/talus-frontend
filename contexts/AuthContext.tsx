import { getMostRecentTalus } from '@/api/userApi';
import type { Talus, User } from '@/components/types';
import React, { createContext, useState } from 'react';

import type { ReactNode } from 'react';

type AuthContextType = {
  user: User | null;
  talus: Talus | null;
  signIn: (userDetails: User) => Promise<void>;
  signOut: () => void;
  setMostRecentTalus: () => void;
  selectTalus: (talusDetails: Talus | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  talus: null,
  signIn: async () => {},
  signOut: () => {},
  setMostRecentTalus: () => {},
  selectTalus: () => {}
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({
  children
}: AuthProviderProps): React.JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [talus, setTalus] = useState<Talus | null>(null);

  const setMostRecentTalus = (email?: string): void => {
    const userEmail = email ?? user?.email;

    if (userEmail === undefined) {
      setTalus(null);
      return;
    }

    getMostRecentTalus(userEmail)
      .then(talusResponse => {
        if (talusResponse.success) {
          setTalus({
            name: talusResponse.name!,
            talusId: talusResponse.talusId!
          });
        } else {
          setTalus(null);
          console.error(talusResponse.error);
        }
      })
      .catch(error => {
        setTalus(null);
        console.error('Error fetching Talus info:', error);
      });
  };

  const signIn = async (userDetails: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<void> => {
    setUser(userDetails);
    setMostRecentTalus(userDetails.email);
  };

  const signOut = (): void => {
    setUser(null);
    setTalus(null);
  };

  const selectTalus = (talusDetails: Talus | null): void => {
    setTalus(talusDetails);
  };

  return (
    <AuthContext.Provider
      value={{ user, talus, signIn, signOut, setMostRecentTalus, selectTalus }}
    >
      {children}
    </AuthContext.Provider>
  );
};
