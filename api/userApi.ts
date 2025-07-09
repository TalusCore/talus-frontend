import { capitalizeFirstLetter } from '@/components/utils';
import apiClient from './apiClient';

type UserResponse = {
  firstName?: string;
  lastName?: string;
  email?: string;
  success: boolean;
  error?: string;
};

type ErrorResponse = { response: { data: { message: string } } };

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
