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
  updateUser: (userDetails: User) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  talus: null,
  signIn: async () => {},
  signOut: () => {},
  setMostRecentTalus: () => {},
  selectTalus: () => {},
  updateUser: () => {}
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
          if (talusResponse.talusId === undefined) {
            setTalus(null);
            return;
          }

          setTalus({
            name: talusResponse.name!,
            talusId: talusResponse.talusId
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
    gender: string;
    birthday: Date;
    height: number;
    weight: number;
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

  const updateUser = (userDetails: User): void => {
    setUser(userDetails);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        talus,
        signIn,
        signOut,
        setMostRecentTalus,
        selectTalus,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
