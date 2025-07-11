import { getMostRecentTalus } from '@/api/userApi';
import React, { createContext, useState } from 'react';

import type { ReactNode } from 'react';

type User = {
  firstName: string;
  lastName: string;
  email: string;
};

type Talus = {
  talusId: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  talus: Talus | null;
  signIn: (userDetails: User) => Promise<void>;
  signOut: () => void;
  selectTalus: (talusDetails: Talus) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  talus: null,
  signIn: async () => {},
  signOut: () => {},
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

  const signIn = async (userDetails: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<void> => {
    setUser(userDetails);

    getMostRecentTalus(userDetails.email)
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

  const signOut = (): void => {
    setUser(null);
    setTalus(null);
  };

  const selectTalus = (talusDetails: Talus): void => {
    setTalus(talusDetails);
  };

  return (
    <AuthContext.Provider value={{ user, talus, signIn, signOut, selectTalus }}>
      {children}
    </AuthContext.Provider>
  );
};
