import type { ErrorResponse, Talus, User } from '@/components/types';
import { capitalizeFirstLetter } from '@/components/utils';
import apiClient from './apiClient';

type UserResponse = {
  firstName?: string;
  lastName?: string;
  email?: string;
  success: boolean;
  error?: string;
};

type TalusResponse = Partial<Talus> & {
  success: boolean;
  error?: string;
};

type TalusListResponse = {
  taluses?: Talus[];
  success: boolean;
  error?: string;
};

export const login = async (
  email: string,
  password: string
): Promise<UserResponse> => {
  const body = {
    email,
    password
  };

  return callUserApi('login', body);
};

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<UserResponse> => {
  const body = {
    firstName,
    lastName,
    email,
    password
  };

  return callUserApi('signup', body);
};

const callUserApi = async (
  type: string,
  body: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  }
): Promise<UserResponse> => {
  try {
    const response = await apiClient.post(`/users/${type}`, body);
    return {
      firstName: capitalizeFirstLetter(response.data.firstName, 'User'),
      lastName: capitalizeFirstLetter(response.data.lastName, 'User'),
      email: response.data.email,
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: (error as ErrorResponse).response.data.message ?? String(error)
    };
  }
};

export const getMostRecentTalus = async (
  email: string
): Promise<TalusResponse> => {
  try {
    const response = await apiClient.get(`/users/most-recent-talus`, {
      params: { email }
    });
    return {
      talusId: response.data.talusId,
      name: capitalizeFirstLetter(response.data.name, 'Talus'),
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: (error as ErrorResponse).response.data.message ?? String(error)
    };
  }
};

export const getTalusList = async (
  email: string
): Promise<TalusListResponse> => {
  try {
    const response = await apiClient.get(`/users/all-taluses`, {
      params: { email }
    });
    const taluses = response.data.map((talus: TalusResponse) => ({
      talusId: talus.talusId,
      name: capitalizeFirstLetter(talus.name, 'Talus')
    }));
    return {
      taluses,
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: (error as ErrorResponse).response.data.message ?? String(error)
    };
  }
};

export const updateTalusOptions = (
  user: User | null,
  setTalusOptions: (taluses: Talus[]) => void
): void => {
  if (!user) {
    setTalusOptions([]);

    return;
  }

  getTalusList(user.email)
    .then(response => {
      if (response.success) {
        if (response.taluses && response.taluses.length > 0) {
          setTalusOptions(response.taluses);
        }
      } else {
        console.error(response.error);
      }
    })
    .catch(error => {
      console.error('Error fetching talus list:', error);
    });
};
